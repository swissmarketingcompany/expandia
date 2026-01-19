#!/usr/bin/env python3
"""
Curate top 150 business hub cities from the full 757 city list.
Priority: Capitals, financial centers, tech hubs, industrial centers.
"""

import json

# Define tier 1 cities (must keep - capitals and major financial/tech hubs)
TIER_1_CITIES = [
    # Western Europe - Major Hubs
    "London", "Paris", "Amsterdam", "Brussels", "Dublin", "Luxembourg City",
    
    # DACH - Germany
    "Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf",
    "Leipzig", "Dresden", "Nuremberg", "Hannover", "Dortmund", "Essen", "Bremen",
    
    # DACH - Switzerland
    "Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne",
    
    # DACH - Austria
    "Vienna", "Graz", "Salzburg", "Innsbruck",
    
    # Scandinavia
    "Stockholm", "Copenhagen", "Oslo", "Helsinki", "Gothenburg", "Malmö", "Aarhus", "Bergen",
    
    # Southern Europe
    "Madrid", "Barcelona", "Valencia", "Seville", "Bilbao",
    "Milan", "Rome", "Turin", "Bologna", "Florence", "Naples",
    "Lisbon", "Porto",
    "Athens",
    
    # UK & Ireland
    "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Leeds", "Bristol", "Liverpool",
    
    # Benelux
    "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Antwerp", "Ghent",
    
    # France
    "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux",
    
    # Eastern Europe
    "Warsaw", "Krakow", "Wroclaw",
    "Prague", "Brno",
    "Budapest",
    "Bucharest",
    "Sofia",
    "Belgrade",
    "Zagreb",
    "Ljubljana",
    "Bratislava",
    "Tallinn", "Riga", "Vilnius",
    
    # Turkey
    "Istanbul", "Ankara", "Izmir", "Bursa", "Antalya",
    
    # North America (if any in your list)
    "New York", "Chicago", "San Francisco", "Boston", "Los Angeles", "Seattle", "Toronto", "Vancouver"
]

def load_cities():
    """Load the full cities list"""
    with open('data/cities-backup-full-757.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def is_tier1_city(city_name):
    """Check if city is in tier 1 list"""
    return city_name in TIER_1_CITIES

def is_capital_or_major_hub(city_data):
    """Check if city is likely a capital or major business hub based on metadata"""
    city = city_data.get('city', '')
    description = city_data.get('description', '').lower()
    
    # Check for capital/major hub indicators
    indicators = [
        'capital', 'financial', 'tech hub', 'startup', 'headquarters',
        'banking', 'innovation', 'business center', 'commercial'
    ]
    
    return any(indicator in description for indicator in indicators)

def curate_top_150_cities(cities):
    """Select top 150 cities based on business importance"""
    
    # Priority 1: Tier 1 cities (manually curated)
    tier1 = [c for c in cities if is_tier1_city(c['city'])]
    print(f"✅ Tier 1 (manually curated): {len(tier1)} cities")
    
    # Priority 2: Capitals and major hubs not in tier 1
    remaining = [c for c in cities if not is_tier1_city(c['city'])]
    tier2 = [c for c in remaining if is_capital_or_major_hub(c)]
    print(f"✅ Tier 2 (capitals/hubs): {len(tier2)} cities")
    
    # Combine and limit to 150
    selected = tier1 + tier2
    
    # If we have more than 150, prioritize by region diversity
    if len(selected) > 150:
        # Keep all tier 1, trim tier 2
        selected = tier1 + tier2[:150-len(tier1)]
    
    # If we have less than 150, add more from remaining
    if len(selected) < 150:
        additional_needed = 150 - len(selected)
        already_selected_slugs = {c['slug'] for c in selected}
        additional = [c for c in remaining if c['slug'] not in already_selected_slugs][:additional_needed]
        selected.extend(additional)
        print(f"✅ Added {len(additional)} additional cities to reach 150")
    
    return selected[:150]

def main():
    print("🔧 Curating top 150 business hub cities...")
    
    # Load full city list
    all_cities = load_cities()
    print(f"📊 Total cities in original list: {len(all_cities)}")
    
    # Curate top 150
    top_150 = curate_top_150_cities(all_cities)
    print(f"✅ Selected {len(top_150)} cities")
    
    # Show breakdown by region
    regions = {}
    for city in top_150:
        region = city.get('region', 'Unknown')
        regions[region] = regions.get(region, 0) + 1
    
    print("\n📍 Cities by region:")
    for region, count in sorted(regions.items(), key=lambda x: x[1], reverse=True):
        print(f"   {region}: {count} cities")
    
    # Save curated list
    with open('data/cities.json', 'w', encoding='utf-8') as f:
        json.dump(top_150, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved {len(top_150)} cities to data/cities.json")
    print(f"📦 Original 757 cities backed up to data/cities-backup-full-757.json")
    
    # Show some examples
    print("\n📋 Sample cities kept:")
    for city in top_150[:10]:
        print(f"   • {city['city']}, {city['country']} ({city.get('region', 'N/A')})")

if __name__ == '__main__':
    main()
