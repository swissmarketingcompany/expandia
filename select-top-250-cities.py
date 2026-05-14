#!/usr/bin/env python3
"""
Curate top 250 cities from the full cities.json file.
Focus on major business hubs across regions.
"""

import argparse
import json
import sys

ANKARA_LONGITUDE_CUTOFF = 32.8597
MIN_POPULATION = 80000

parser = argparse.ArgumentParser(description="Regenerate curated city list from data/cities.json")
parser.add_argument(
    "--force",
    action="store_true",
    help="required safety flag; prevents accidental overwrite of data/cities-top250.json",
)
args = parser.parse_args()

if not args.force:
    print("⛔ Refusing to regenerate city list without --force.")
    print("Reason: accidental runs can overwrite curated city quality filters.")
    sys.exit(1)

# Load current cities
with open('data/cities.json', 'r', encoding='utf-8') as f:
    all_cities = json.load(f)

print(f"Total cities loaded: {len(all_cities)}")

# Define selection criteria by region
region_quotas = {
    "DACH": 40,  # Germany, Austria, Switzerland - key markets
    "Western Europe": 80,  # France, Netherlands, Belgium, UK
    "Southern Europe": 40,  # Spain, Italy, Portugal, Greece
    "Scandinavia": 25,  # Sweden, Norway, Denmark, Finland
    "Eastern Europe": 30,  # Poland, Czech Republic, Hungary, Romania
    "North America": 30,  # USA, Canada
    "Turkey": 5,  # Strategic Turkish cities
}

# Group cities by region
cities_by_region = {}
for city in all_cities:
    try:
        lng = float(city.get("lng", 0))
    except Exception:
        lng = 0.0
    pop_raw = str(city.get("population", "0"))
    try:
        pop = int(pop_raw.replace(",", ""))
    except Exception:
        pop = 0

    # Align with build filters to avoid reintroducing low-quality/out-of-scope cities.
    if lng > ANKARA_LONGITUDE_CUTOFF:
        continue
    if pop < MIN_POPULATION:
        continue

    region = city.get('region', 'Other')
    if region not in cities_by_region:
        cities_by_region[region] = []
    cities_by_region[region].append(city)

print("\nCities by region:")
for region, cities in cities_by_region.items():
    print(f"  {region}: {len(cities)} cities")

# Select top cities from each region
top_250_cities = []

for region, quota in region_quotas.items():
    if region in cities_by_region:
        region_cities = cities_by_region[region]
        
        # Sort by population (convert to int, handle missing values)
        def get_population(city):
            pop = city.get('population', '0')
            # Remove commas and convert to int
            try:
                return int(pop.replace(',', ''))
            except:
                return 0
        
        sorted_cities = sorted(region_cities, key=get_population, reverse=True)
        
        # Take top N cities from this region
        selected = sorted_cities[:quota]
        top_250_cities.extend(selected)
        
        print(f"\n{region}: Selected {len(selected)} cities (quota: {quota})")
        print(f"  Top 5: {', '.join([c['city'] for c in selected[:5]])}")

print(f"\n✅ Total cities selected: {len(top_250_cities)}")

# Save to new file
output_file = 'data/cities-top250.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(top_250_cities, f, indent=2, ensure_ascii=False)

print(f"✅ Saved to {output_file}")

# Print summary by country
countries = {}
for city in top_250_cities:
    country = city.get('country', 'Unknown')
    countries[country] = countries.get(country, 0) + 1

print("\n📊 Cities by country:")
for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True):
    print(f"  {country}: {count}")
