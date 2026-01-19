const fs = require('fs');
const path = require('path');

const directoryPath = '.';
const outputFilePath = 'data/cities.json';

if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

const files = fs.readdirSync(directoryPath).filter(file => 
    file.startsWith('b2b-lead-generation-') && 
    file.endsWith('.html') && 
    file !== 'b2b-lead-generation-agency.html'
);

const cities = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Extract City and Country
    // Pattern: <p class="text-sm uppercase tracking-wide text-primary mb-3">London • United Kingdom</p>
    const locationMatch = content.match(/<p class="text-sm uppercase tracking-wide text-primary mb-3">(.*?) • (.*?)<\/p>/);
    
    let city = '';
    let country = '';
    
    if (locationMatch) {
        city = locationMatch[1];
        country = locationMatch[2];
    } else {
        // Fallback: try to guess from filename
        const namePart = file.replace('b2b-lead-generation-', '').replace('.html', '');
        city = namePart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        console.warn(`Could not extract location for ${file}, using filename: ${city}`);
    }

    // Extract Description
    const descriptionMatch = content.match(/<meta name="description" content="(.*?)">/);
    const description = descriptionMatch ? descriptionMatch[1] : '';

    // Extract Hero Image
    const imageMatch = content.match(/src="(\.\/assets\/local\/.*?)"/);
    const image = imageMatch ? imageMatch[1] : '';

    // Extract Slug
    const slug = file.replace('.html', '');

    cities.push({
        id: slug,
        slug: slug,
        city: city,
        country: country,
        description: description,
        image: image
    });
});

fs.writeFileSync(outputFilePath, JSON.stringify(cities, null, 2));

console.log(`Extracted data for ${cities.length} cities to ${outputFilePath}`);
