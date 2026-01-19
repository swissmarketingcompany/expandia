
const fs = require('fs');
const path = require('path');
const cities = require('../data/cities.json');
const industries = require('../data/industries.json');

const assetDir = path.join(__dirname, '../assets/local');
const missingImages = [];

// Check Cities
console.log('Checking City Images...');
cities.forEach(city => {
    let imagePath = city.image;
    // Clean path (remove ./assets/local/)
    if (imagePath.startsWith('./assets/local/')) {
        imagePath = imagePath.replace('./assets/local/', '');
    }
    
    const fullPath = path.join(assetDir, imagePath);
    if (!fs.existsSync(fullPath)) {
        missingImages.push({
            type: 'City',
            name: city.city,
            slug: city.slug,
            missingFile: imagePath
        });
    }
});

// Check Industries
console.log('Checking Industry Images...');
industries.forEach(ind => {
    let imagePath = ind.image;
    if (imagePath.startsWith('./assets/local/')) {
        imagePath = imagePath.replace('./assets/local/', '');
    }
    
    const fullPath = path.join(assetDir, imagePath);
    if (!fs.existsSync(fullPath)) {
        missingImages.push({
            type: 'Industry',
            name: ind.name,
            slug: ind.slug,
            missingFile: imagePath
        });
    }
});

if (missingImages.length > 0) {
    console.log(`\n❌ Found ${missingImages.length} pages with missing images:`);
    missingImages.forEach(m => {
        console.log(`- [${m.type}] ${m.name} (${m.slug}.html) -> Missing: ${m.missingFile}`);
    });
} else {
    console.log('\n✅ All pages have valid images.');
}
