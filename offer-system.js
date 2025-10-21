/**
 * Offer System Module for Expandia (PostgreSQL Version)
 * Handles offer creation, editing, and client viewing with database persistence
 */

const { Pool } = require('pg');
const crypto = require('crypto');

class OfferSystem {
    constructor() {
        this.adminPassword = process.env.ADMIN_PASSWORD || 'expandia2025';
        this.sessions = new Map(); // Store authenticated sessions
        
        // Initialize PostgreSQL connection pool
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        });
        
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            // Create offers table if it doesn't exist
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS offers (
                    id VARCHAR(255) PRIMARY KEY,
                    client_name VARCHAR(500) NOT NULL,
                    title VARCHAR(500) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    password_plain VARCHAR(255) NOT NULL,
                    html_content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create indexes
            await this.pool.query(`
                CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC)
            `);
            
            console.log('✅ Database initialized successfully');
        } catch (error) {
            console.error('❌ Database initialization error:', error.message);
        }
    }

    /**
     * Verify admin password
     */
    verifyAdminPassword(password) {
        return password === this.adminPassword;
    }

    /**
     * Hash client password for storage
     */
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    /**
     * Verify client password
     */
    verifyClientPassword(offer, providedPassword) {
        const storedHash = offer.password_hash || offer.passwordHash;
        const providedHash = this.hashPassword(providedPassword);
        return storedHash === providedHash;
    }

    /**
     * Generate session ID
     */
    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Create a new offer
     */
    async createOffer(offerData) {
        const { id, clientName, title, password, htmlContent } = offerData;

        // Validate required fields
        if (!id || !clientName || !title || !password || !htmlContent) {
            throw new Error('Missing required fields');
        }

        // Check if offer ID already exists
        const existing = await this.pool.query(
            'SELECT id FROM offers WHERE id = $1',
            [id]
        );
        
        if (existing.rows.length > 0) {
            throw new Error('Offer with this ID already exists');
        }

        // Insert new offer
        await this.pool.query(
            `INSERT INTO offers (id, client_name, title, password_hash, password_plain, html_content, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [id, clientName, title, this.hashPassword(password), password, htmlContent]
        );

        console.log(`✅ Offer created in database: ${id}`);
        
        return { 
            id, 
            clientName, 
            title, 
            createdAt: new Date().toISOString() 
        };
    }

    /**
     * Update an existing offer
     */
    async updateOffer(id, updateData) {
        // Read existing offer
        const existingOffer = await this.getOffer(id);
        
        // Handle password update
        let newPasswordHash = existingOffer.password_hash;
        let newPasswordPlain = existingOffer.password_plain;
        
        if (updateData.password && updateData.password !== newPasswordPlain) {
            // Password changed - update both hash and plain
            newPasswordHash = this.hashPassword(updateData.password);
            newPasswordPlain = updateData.password;
        }
        
        // Update fields
        await this.pool.query(
            `UPDATE offers 
             SET client_name = $1, 
                 title = $2, 
                 password_hash = $3, 
                 password_plain = $4, 
                 html_content = $5, 
                 updated_at = NOW()
             WHERE id = $6`,
            [
                updateData.clientName || existingOffer.client_name,
                updateData.title || existingOffer.title,
                newPasswordHash,
                newPasswordPlain,
                updateData.htmlContent || existingOffer.html_content,
                id
            ]
        );

        console.log(`✅ Offer updated in database: ${id}`);
        
        return { 
            id, 
            updatedAt: new Date().toISOString() 
        };
    }

    /**
     * Get a single offer by ID
     */
    async getOffer(id) {
        const result = await this.pool.query(
            'SELECT * FROM offers WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Offer not found');
        }
        
        return result.rows[0];
    }

    /**
     * Get offer for admin (includes password)
     */
    async getOfferForAdmin(id) {
        const offer = await this.getOffer(id);
        
        // Return with camelCase keys for frontend compatibility
        return {
            id: offer.id,
            clientName: offer.client_name,
            title: offer.title,
            password: offer.password_plain, // Return plain password for admin
            htmlContent: offer.html_content,
            createdAt: offer.created_at,
            updatedAt: offer.updated_at
        };
    }

    /**
     * Get offer for client (no password)
     */
    async getOfferForClient(id) {
        const offer = await this.getOffer(id);
        
        // Return without password fields
        return {
            id: offer.id,
            clientName: offer.client_name,
            title: offer.title,
            htmlContent: offer.html_content,
            createdAt: offer.created_at,
            updatedAt: offer.updated_at
        };
    }

    /**
     * Get all offers (for admin)
     */
    async getAllOffers() {
        try {
            const result = await this.pool.query(
                'SELECT id, client_name, title, password_plain, created_at, updated_at FROM offers ORDER BY created_at DESC'
            );
            
            // Convert to camelCase for frontend
            return result.rows.map(offer => ({
                id: offer.id,
                clientName: offer.client_name,
                title: offer.title,
                password: offer.password_plain,
                createdAt: offer.created_at,
                updatedAt: offer.updated_at
            }));
        } catch (err) {
            console.error('Error reading offers:', err);
            return [];
        }
    }

    /**
     * Delete an offer
     */
    async deleteOffer(id) {
        const result = await this.pool.query(
            'DELETE FROM offers WHERE id = $1 RETURNING id',
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Offer not found');
        }
        
        console.log(`✅ Offer deleted from database: ${id}`);
        return true;
    }

    /**
     * Authenticate client for an offer
     */
    async authenticateClient(id, password) {
        const offer = await this.getOffer(id);
        
        if (this.verifyClientPassword(offer, password)) {
            const sessionId = this.generateSessionId();
            this.sessions.set(sessionId, {
                offerId: id,
                createdAt: Date.now(),
                expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
            });
            
            return sessionId;
        }
        
        return null;
    }

    /**
     * Verify client session
     */
    verifyClientSession(sessionId, offerId) {
        const session = this.sessions.get(sessionId);
        
        if (!session) return false;
        
        // Check if session expired
        if (Date.now() > session.expiresAt) {
            this.sessions.delete(sessionId);
            return false;
        }
        
        // Check if session is for the correct offer
        if (session.offerId !== offerId) return false;
        
        return true;
    }

    /**
     * Clean up expired sessions (run periodically)
     */
    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now > session.expiresAt) {
                this.sessions.delete(sessionId);
            }
        }
    }
}

module.exports = OfferSystem;

