/**
 * Offer System Module for Expandia
 * Handles offer creation, editing, and client viewing
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class OfferSystem {
    constructor(offersDir = './offers') {
        this.offersDir = offersDir;
        this.adminPassword = process.env.ADMIN_PASSWORD || 'expandia2025';
        this.sessions = new Map(); // Store authenticated sessions
        this.initializeOffersDirectory();
    }

    async initializeOffersDirectory() {
        try {
            await fs.access(this.offersDir);
        } catch {
            await fs.mkdir(this.offersDir, { recursive: true });
            console.log('✅ Offers directory created');
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
        // Support both old format (just hash) and new format (hash + plain)
        const storedHash = offer.passwordHash || offer.password;
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
        const filePath = path.join(this.offersDir, `${id}.json`);
        try {
            await fs.access(filePath);
            throw new Error('Offer with this ID already exists');
        } catch (err) {
            if (err.message === 'Offer with this ID already exists') {
                throw err;
            }
            // File doesn't exist, which is what we want
        }

        const offer = {
            id,
            clientName,
            title,
            passwordHash: this.hashPassword(password), // Store hashed for verification
            passwordPlain: password, // Store plain text for admin viewing (security trade-off)
            htmlContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile(filePath, JSON.stringify(offer, null, 2));
        console.log(`✅ Offer created: ${id}`);
        
        return { id, clientName, title, createdAt: offer.createdAt };
    }

    /**
     * Update an existing offer
     */
    async updateOffer(id, updateData) {
        const filePath = path.join(this.offersDir, `${id}.json`);
        
        // Read existing offer
        const existingOffer = await this.getOffer(id);
        
        // Handle password update
        let newPasswordHash = existingOffer.passwordHash || existingOffer.password; // Support old format
        let newPasswordPlain = existingOffer.passwordPlain || ''; // Support old format
        
        if (updateData.password && updateData.password !== existingOffer.passwordPlain) {
            // Password changed - update both hash and plain
            newPasswordHash = this.hashPassword(updateData.password);
            newPasswordPlain = updateData.password;
        }
        
        // Update fields
        const updatedOffer = {
            ...existingOffer,
            clientName: updateData.clientName || existingOffer.clientName,
            title: updateData.title || existingOffer.title,
            passwordHash: newPasswordHash,
            passwordPlain: newPasswordPlain,
            htmlContent: updateData.htmlContent || existingOffer.htmlContent,
            updatedAt: new Date().toISOString()
        };
        
        // Remove old 'password' field if it exists (migration)
        delete updatedOffer.password;

        await fs.writeFile(filePath, JSON.stringify(updatedOffer, null, 2));
        console.log(`✅ Offer updated: ${id}`);
        
        return { id, updatedAt: updatedOffer.updatedAt };
    }

    /**
     * Get a single offer by ID
     */
    async getOffer(id) {
        const filePath = path.join(this.offersDir, `${id}.json`);
        
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Offer not found');
        }
    }

    /**
     * Get offer for admin (includes password)
     */
    async getOfferForAdmin(id) {
        const offer = await this.getOffer(id);
        // Return offer with plain text password for admin
        return {
            ...offer,
            password: offer.passwordPlain || offer.password || '' // Return plain password for display/edit
        };
    }

    /**
     * Get offer for client (no password)
     */
    async getOfferForClient(id) {
        const offer = await this.getOffer(id);
        
        // Remove sensitive data (both password fields)
        const { password, passwordHash, passwordPlain, ...clientOffer } = offer;
        return clientOffer;
    }

    /**
     * Get all offers (for admin)
     */
    async getAllOffers() {
        try {
            const files = await fs.readdir(this.offersDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            
            const offers = await Promise.all(
                jsonFiles.map(async (file) => {
                    const data = await fs.readFile(path.join(this.offersDir, file), 'utf8');
                    const offer = JSON.parse(data);
                    // For listing, we don't need the full HTML content
                    return {
                        id: offer.id,
                        clientName: offer.clientName,
                        title: offer.title,
                        password: offer.passwordPlain || offer.password || '', // Show plain password for admin
                        createdAt: offer.createdAt,
                        updatedAt: offer.updatedAt
                    };
                })
            );

            // Sort by creation date (newest first)
            offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return offers;
        } catch (err) {
            console.error('Error reading offers:', err);
            return [];
        }
    }

    /**
     * Delete an offer
     */
    async deleteOffer(id) {
        const filePath = path.join(this.offersDir, `${id}.json`);
        
        try {
            await fs.unlink(filePath);
            console.log(`✅ Offer deleted: ${id}`);
            return true;
        } catch (err) {
            throw new Error('Offer not found');
        }
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

