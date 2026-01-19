
const fs = require('fs');
const cities = require('../data/cities.json');
const industries = require('../data/industries.json');

// Select Top Industries (First 20)
const topIndustries = industries.slice(0, 20);

// Select Top Cities (Top 3 from each major country to ensure spread, plus extra US/UK)
const targetCountries = ["United States", "United Kingdom", "Germany", "France", "Canada", "Australia", "Switzerland", "Netherlands"];
let topCities = [];

targetCountries.forEach(country => {
    const countryCities = cities.filter(c => c.country === country).slice(0, 5); // Take top 5 from each
    topCities = [...topCities, ...countryCities];
});

// Fill up to 50 with largest remaining cities (assuming cities.json order has some logic, otherwise just take first ones)
if (topCities.length < 50) {
    const remaining = cities.filter(c => !topCities.includes(c)).slice(0, 50 - topCities.length);
    topCities = [...topCities, ...remaining];
}

console.log(`Selected ${topIndustries.length} Industries and ${topCities.length} Cities.`);

fs.writeFileSync('data/top-industries.json', JSON.stringify(topIndustries, null, 2));
fs.writeFileSync('data/top-cities.json', JSON.stringify(topCities, null, 2));
