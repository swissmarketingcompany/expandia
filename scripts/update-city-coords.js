const fs = require('fs');

const citiesPath = 'data/cities.json';
const locationsPath = 'city-locations.html';

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const locationsContent = fs.readFileSync(locationsPath, 'utf8');

// Extract cities array from the JS in HTML
// Pattern: const cities = [ ... ];
const jsMatch = locationsContent.match(/const cities = \[([\s\S]*?)\];/);

if (jsMatch) {
    const jsContent = jsMatch[1];
    // This is a bit hacky, but valid for the specific format
    // We can evaluate it or regex parse it. Regex is safer.
    
    // Pattern: { name: 'Zurich', lat: 47.3769, lng: 8.5417, url: './b2b-lead-generation-zurich.html', region: 'DACH' },
    const lines = jsContent.split('\n');
    const coordsMap = {};
    const regionMap = {};

    lines.forEach(line => {
        const nameMatch = line.match(/name: '(.*?)'/);
        const latMatch = line.match(/lat: ([\d.-]+)/);
        const lngMatch = line.match(/lng: ([\d.-]+)/);
        const regionMatch = line.match(/region: '(.*?)'/);

        if (nameMatch && latMatch && lngMatch) {
            const name = nameMatch[1];
            coordsMap[name] = {
                lat: parseFloat(latMatch[1]),
                lng: parseFloat(lngMatch[1])
            };
        }
        if (nameMatch && regionMatch) {
            regionMap[nameMatch[1]] = regionMatch[1];
        }
    });

    // Update cities.json
    cities.forEach(city => {
        if (coordsMap[city.city]) {
            city.lat = coordsMap[city.city].lat;
            city.lng = coordsMap[city.city].lng;
        } else {
            console.warn(`No coordinates found for ${city.city}`);
            // Default or fetch?
        }
        
        if (regionMap[city.city]) {
            city.region = regionMap[city.city];
        } else {
            // Default region logic if missing
             if (city.country === 'United Kingdom' || city.country === 'France' || city.country === 'Ireland' || city.country === 'Netherlands') {
                city.region = 'Western Europe';
            } else if (city.country === 'Germany' || city.country === 'Austria' || city.country === 'Switzerland') {
                 city.region = 'DACH';
            } else if (city.country === 'Spain' || city.country === 'Italy' || city.country === 'Portugal') {
                 city.region = 'Southern Europe';
            } else if (city.country === 'Sweden' || city.country === 'Norway' || city.country === 'Denmark' || city.country === 'Finland') {
                 city.region = 'Scandinavia';
            } else if (city.country === 'Poland' || city.country === 'Czech Republic' || city.country === 'Hungary' || city.country === 'Romania' || city.country === 'Bulgaria' || city.country === 'Croatia' || city.country === 'Slovakia' || city.country === 'Slovenia' || city.country === 'Estonia' || city.country === 'Latvia' || city.country === 'Lithuania' || city.country === 'Serbia') {
                 city.region = 'Eastern Europe';
            } else if (city.country === 'United States') {
                 city.region = 'North America';
            } else if (city.country === 'Turkey') {
                 city.region = 'Turkey';
            } else {
                city.region = 'Global';
            }
        }
    });

    fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2));
    console.log('Updated cities.json with coordinates and regions.');

} else {
    console.error('Could not find cities array in city-locations.html');
}
