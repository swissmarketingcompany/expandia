
const fs = require('fs');
const path = require('path');

// --- DATASETS ---

const industriesList = [
    // Technology
    "SaaS", "FinTech", "Cybersecurity", "Artificial Intelligence", "Cloud Computing", "Data Analytics", "EdTech", "HealthTech", "MarTech", "PropTech", "DevOps", "IoT", "Robotics", "Blockchain", "Ecommerce",
    // Professional Services
    "Management Consulting", "Legal Services", "Accounting", "HR & Staffing", "Recruitment", "Architecture", "Engineering", "Design Agencies", "Marketing Agencies", "PR Agencies",
    // Industrial & Manufacturing
    "Manufacturing", "Automotive", "Aerospace", "Logistics", "Supply Chain", "Construction", "Energy", "Oil & Gas", "Renewable Energy", "Chemicals", "Packaging", "Textiles",
    // Healthcare & Life Sciences
    "Healthcare", "Biotechnology", "Pharmaceuticals", "Medical Devices", "Clinical Research",
    // Financial Services
    "Banking", "Insurance", "Wealth Management", "Private Equity", "Venture Capital", "Real Estate Investment",
    // Other B2B
    "Wholesale", "Telecommunications", "Facilities Management", "Security Services", "Event Management", "Corporate Training", "Translation Services"
];

// Simplified City List (Top B2B Hubs)
const countries = {
    "United States": [
        "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", 
        "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington", 
        "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", 
        "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami", 
        "Raleigh", "Omaha", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
        "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Riverside", "Corpus Christi", "Lexington",
        "Henderson", "Stockton", "Saint Paul", "Cincinnati", "St. Louis", "Pittsburgh", "Greensboro", "Lincoln", "Anchorage", "Plano",
        "Orlando", "Irvine", "Newark", "Durham", "Chula Vista", "Toledo", "Fort Wayne", "St. Petersburg", "Laredo", "Jersey City",
        "Chandler", "Madison", "Lubbock", "Scottsdale", "Reno", "Buffalo", "Gilbert", "Glendale", "North Las Vegas", "Winston-Salem",
        "Chesapeake", "Norfolk", "Fremont", "Garland", "Irving", "Hialeah", "Richmond", "Boise", "Spokane", "Baton Rouge",
        "Des Moines", "Modesto", "Fayetteville", "Tacoma", "Oxnard", "Fontana", "Montgomery", "Moreno Valley", "Shreveport", "Aurora",
        "Yonkers", "Akron", "Huntington Beach", "Little Rock", "Augusta", "Amarillo", "Glendale", "Mobile", "Grand Rapids", "Salt Lake City",
        "Huntsville", "Tallahassee", "Grand Prairie", "Overland Park", "Knoxville", "Worcester", "Brownsville", "Vancouver", "Santa Clarita", "Providence",
        "Garden Grove", "Chattanooga", "Oceanside", "Jackson", "Fort Lauderdale", "Santa Rosa", "Rancho Cucamonga", "Port St. Lucie", "Tempe", "Ontario",
        "Lancaster", "Eugene", "Pembroke Pines", "Salem", "Cape Coral", "Peoria", "Sioux Falls", "Springfield", "Elk Grove", "Rockford",
        "Corona", "Palmdale", "Salinas", "Pomona", "Pasadena", "Joliet", "Paterson", "Kansas City", "Torrance", "Syracuse",
        "Bridgeport", "Hayward", "Fort Collins", "Escondido", "Lakewood", "Naperville", "Dayton", "Hollywood", "Sunnyvale", "Alexandria",
        "Mesquite", "Hampton", "Pasadena", "Orange", "Savannah", "Fullerton", "Warren", "Clarksville", "McKinney", "McAllen",
        "New Haven", "West Valley City", "Sterling Heights", "Columbia", "Killeen", "Topeka", "Thousand Oaks", "Cedar Rapids", "Olathe", "Elizabeth",
        "Waco", "Hartford", "Visalia", "Gainesville", "Simi Valley", "Stamford", "Bellevue", "Concord", "Miramar", "Coral Springs",
        "Lafayette", "Charleston", "Carrollton", "Roseville", "Thornton", "Beaumont", "Allentown", "Surprise", "Evansville", "Abilene",
        "Frisco", "Independence", "Santa Clara", "Springfield", "Vallejo", "Victorville", "Athens", "Peoria", "Lansing", "Ann Arbor",
        "El Monte", "Denton", "Berkeley", "Provo", "Downey", "Midland", "Norman", "Waterbury", "Costa Mesa", "Inglewood",
        "Manchester", "Murfreesboro", "Columbia", "Elgin", "Clearwater", "Miami Gardens", "Rochester", "Pueblo", "Lowell", "Wilmington",
        "Arvada", "Ventura", "Westminster", "West Covina", "Gresham", "Fargo", "Norwalk", "Carlsbad", "Fairfield", "Cambridge",
        "Wichita Falls", "High Point", "Billings", "Green Bay", "West Jordan", "Richmond", "Murrieta", "Burbank", "Palm Bay", "Everett",
        "Flint", "Antioch", "Erie", "South Bend", "Daly City", "Centennial", "Temecula", "Inland Empire", "Sparks", "Concord",
        "Rialto", "Santa Maria", "Tyler", "Davie", "College Station", "Lewisville", "Pearland", "League City", "San Mateo", "Hesperia",
        "Sandy Springs", "Lakeland", "Boulder", "West Palm Beach", "Brockton", "San Angelo", "Compton", "El Cajon", "Mission Viejo", "Albany",
        "Roanoke", "Nampa", "Clifton", "Kirkland", "Macon", "Sugar Land", "Hammond", "Vista", "Longmont", "Bloomington",
        "Kenner", "Tuscaloosa", "Yuma", "Avondale", "Beaverton", "Pawtucket", "Hoover", "Gastonia", "Somerville", "Reading",
        "South Gate", "New Bedford", "Vacaville", "Chico", "Carson", "Santa Monica", "Westminster", "Santa Barbara", "San Leandro", "Citrus Heights",
        "Redding", "Livermore", "Tracy", "Indio", "Menifee", "Chino", "Redwood City", "Merced", "Hemet", "Lake Forest",
        "Napa", "Mountain View", "Pleasanton", "Tustin", "Alameda", "Baldwin Park", "Chino Hills", "Bellflower", "Union City", "Perris",
        "Manteca", "Upland", "Apple Valley", "Lynwood", "Redlands", "Turlock", "Milpitas", "Redondo Beach", "Pittsburg", "Folsom",
        "Davis", "Yuba City", "Rancho Cordova", "Yorba Linda", "Laguna Niguel", "Walnut Creek", "San Clemente", "Florence", "Pico Rivera", "Montebello",
        "Lodi", "Carmichael", "Huntington Park", "South San Francisco", "Encinitas", "Tulare", "Gardena", "National City", "Cupertino", "Huntington",
        "Petaluma", "San Rafael", "South Whittier", "La Habra", "Whittier", "Rosemead", "Highland", "Fountain Valley", "Colton", "Diamond Bar",
        "Novato", "Placentia", "Hacienda Heights", "Cathedral City", "Delano", "Watsonville", "Porterville", "Gilroy", "Paramount", "Hanford",
        "Glendora", "West Sacramento", "Aliso Viejo", "Cerritos", "Poway", "La Mirada", "Cypress", "Covina", "Azusa", "Ceres",
        "San Luis Obispo", "Palm Desert", "San Jacinto", "Lincoln", "Newark", "Lompoc", "El Centro", "Danville", "Bell Gardens", "Coachella",
        "Rancho Palos Verdes", "San Bruno", "Rohnert Park", "Brea", "La Puente", "Campbell", "San Gabriel", "Beaumont", "Morgan Hill", "Culver City",
        "Calexico", "Stanton", "La Quinta", "Pacifica", "Montclair", "Oakley", "Monrovia", "Los Banos", "Martinez", "Temple City"
    ],
    "Italy": [
        "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania",
        "Venice", "Verona", "Messina", "Padua", "Trieste", "Taranto", "Brescia", "Parma", "Prato", "Modena",
        "Reggio Calabria", "Reggio Emilia", "Perugia", "Ravenna", "Livorno", "Cagliari", "Foggia", "Rimini", "Salerno", "Ferrara",
        "Sassari", "Latina", "Giugliano in Campania", "Monza", "Siracusa", "Bergamo", "Pescara", "Trento", "Forlì", "Vicenza",
        "Terni", "Bolzano", "Piacenza", "Novara", "Ancona", "Andria", "Arezzo", "Udine", "Cesena", "Lecce",
        "Pesaro", "Barletta", "Alessandria", "La Spezia", "Pisa", "Pistoia", "Guidonia Montecelio", "Lucca", "Catanzaro", "Brindisi",
        "Torre del Greco", "Treviso", "Busto Arsizio", "Marsala", "Como", "Grosseto", "Sesto San Giovanni", "Pozzuoli", "Varese", "Fiumicino",
        "Casoria", "Asti", "Cinisello Balsamo", "Caserta", "Gela", "Aprilia", "Ragusa", "Pavia", "Cremona", "Carpi"
    ],
    "Spain": [
        "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao",
        "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "Vitoria-Gasteiz", "A Coruña", "Elche", "Granada",
        "Terrassa", "Badalona", "Oviedo", "Sabadell", "Cartagena", "Jerez", "Móstoles", "Santa Cruz", "Pamplona", "Almería",
        "Alcalá de Henares", "Fuenlabrada", "Leganés", "San Sebastián", "Getafe", "Burgos", "Albacete", "Santander", "Castellón de la Plana", "Alcorcón",
        "San Cristóbal de La Laguna", "Logroño", "Badajoz", "Huelva", "Salamanca", "Marbella", "Lleida", "Dos Hermanas", "Tarragona", "Torrejón de Ardoz",
        "Parla", "Mataró", "León", "Algeciras", "Santa Coloma de Gramenet", "Alcobendas", "Cádiz", "Jaén", "Reus", "Ourense",
        "Girona", "Telde", "Barakaldo", "Lugo", "Santiago de Compostela", "Roquetas de Mar", "Cáceres", "Las Rozas de Madrid", "San Fernando", "Lorca"
    ],
    "Poland": [
        "Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan", "Gdansk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice",
        "Bialystok", "Gdynia", "Czestochowa", "Radom", "Sosnowiec", "Torun", "Kielce", "Rzeszow", "Gliwice", "Zabrze"
    ],
    "Turkey": [
        "Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep", "Konya", "Antalya", "Kayseri", "Mersin",
        "Eskisehir", "Diyarbakir", "Samsun", "Denizli", "Sanliurfa", "Adapazari", "Malatya", "Kahramanmaras", "Erzurum", "Van",
        "Batman", "Elazig", "Izmit", "Manisa", "Sivas", "Gebze", "Balikesir", "Tarsus", "Kutahya", "Trabzon"
    ],
    "Sweden": [
        "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"
    ],
    "Norway": [
        "Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg"
    ],
    "Denmark": [
        "Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde"
    ],
    "Finland": [
        "Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Pori"
    ],
    "Austria": [
        "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn"
    ],
    "Belgium": [
        "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst"
    ],
    "Portugal": [
        "Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra", "Setúbal", "Almada", "Agualva-Cacém"
    ],
    "Ireland": [
        "Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan"
    ],
    "Czech Republic": [
        "Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc", "Ceske Budejovice", "Hradec Kralove", "Usti nad Labem", "Pardubice"
    ],
    "Hungary": [
        "Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Gyor", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely"
    ],
    "Romania": [
        "Bucharest", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta", "Craiova", "Brasov", "Galati", "Ploiesti", "Oradea"
    ],
    "United States": [
        "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", 
        "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington", 
        "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", 
        "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami", 
        "Raleigh", "Omaha", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
        "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Riverside", "Corpus Christi", "Lexington",
        "Henderson", "Stockton", "Saint Paul", "Cincinnati", "St. Louis", "Pittsburgh", "Greensboro", "Lincoln", "Anchorage", "Plano",
        "Orlando", "Irvine", "Newark", "Durham", "Chula Vista", "Toledo", "Fort Wayne", "St. Petersburg", "Laredo", "Jersey City",
        "Chandler", "Madison", "Lubbock", "Scottsdale", "Reno", "Buffalo", "Gilbert", "Glendale", "North Las Vegas", "Winston-Salem",
        "Chesapeake", "Norfolk", "Fremont", "Garland", "Irving", "Hialeah", "Richmond", "Boise", "Spokane", "Baton Rouge",
        "Des Moines", "Modesto", "Fayetteville", "Tacoma", "Oxnard", "Fontana", "Montgomery", "Moreno Valley", "Shreveport", "Aurora",
        "Yonkers", "Akron", "Huntington Beach", "Little Rock", "Augusta", "Amarillo", "Glendale", "Mobile", "Grand Rapids", "Salt Lake City",
        "Huntsville", "Tallahassee", "Grand Prairie", "Overland Park", "Knoxville", "Worcester", "Brownsville", "Vancouver", "Santa Clarita", "Providence",
        "Garden Grove", "Chattanooga", "Oceanside", "Jackson", "Fort Lauderdale", "Santa Rosa", "Rancho Cucamonga", "Port St. Lucie", "Tempe", "Ontario",
        "Lancaster", "Eugene", "Pembroke Pines", "Salem", "Cape Coral", "Peoria", "Sioux Falls", "Springfield", "Elk Grove", "Rockford",
        "Corona", "Palmdale", "Salinas", "Pomona", "Pasadena", "Joliet", "Paterson", "Kansas City", "Torrance", "Syracuse",
        "Bridgeport", "Hayward", "Fort Collins", "Escondido", "Lakewood", "Naperville", "Dayton", "Hollywood", "Sunnyvale", "Alexandria",
        "Mesquite", "Hampton", "Pasadena", "Orange", "Savannah", "Fullerton", "Warren", "Clarksville", "McKinney", "McAllen",
        "New Haven", "West Valley City", "Sterling Heights", "Columbia", "Killeen", "Topeka", "Thousand Oaks", "Cedar Rapids", "Olathe", "Elizabeth",
        "Waco", "Hartford", "Visalia", "Gainesville", "Simi Valley", "Stamford", "Bellevue", "Concord", "Miramar", "Coral Springs",
        "Lafayette", "Charleston", "Carrollton", "Roseville", "Thornton", "Beaumont", "Allentown", "Surprise", "Evansville", "Abilene",
        "Frisco", "Independence", "Santa Clara", "Springfield", "Vallejo", "Victorville", "Athens", "Peoria", "Lansing", "Ann Arbor",
        "El Monte", "Denton", "Berkeley", "Provo", "Downey", "Midland", "Norman", "Waterbury", "Costa Mesa", "Inglewood",
        "Manchester", "Murfreesboro", "Columbia", "Elgin", "Clearwater", "Miami Gardens", "Rochester", "Pueblo", "Lowell", "Wilmington"
    ],
    "Italy": [
        "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania",
        "Venice", "Verona", "Messina", "Padua", "Trieste", "Taranto", "Brescia", "Parma", "Prato", "Modena",
        "Reggio Calabria", "Reggio Emilia", "Perugia", "Ravenna", "Livorno", "Cagliari", "Foggia", "Rimini", "Salerno", "Ferrara"
    ],
    "Spain": [
        "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao",
        "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "Vitoria-Gasteiz", "A Coruña", "Elche", "Granada",
        "Terrassa", "Badalona", "Oviedo", "Sabadell", "Cartagena", "Jerez", "Móstoles", "Santa Cruz", "Pamplona", "Almería"
    ],
    "Poland": [
        "Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan", "Gdansk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice",
        "Bialystok", "Gdynia", "Czestochowa", "Radom", "Sosnowiec", "Torun", "Kielce", "Rzeszow", "Gliwice", "Zabrze"
    ],
    "Turkey": [
        "Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep", "Konya", "Antalya", "Kayseri", "Mersin",
        "Eskisehir", "Diyarbakir", "Samsun", "Denizli", "Sanliurfa", "Adapazari", "Malatya", "Kahramanmaras", "Erzurum", "Van",
        "Batman", "Elazig", "Izmit", "Manisa", "Sivas", "Gebze", "Balikesir", "Tarsus", "Kutahya", "Trabzon"
    ],
    "Sweden": [
        "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"
    ],
    "Norway": [
        "Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg"
    ],
    "Denmark": [
        "Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde"
    ],
    "Finland": [
        "Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Pori"
    ],
    "Austria": [
        "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn"
    ],
    "Belgium": [
        "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst"
    ],
    "Portugal": [
        "Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra", "Setúbal", "Almada", "Agualva-Cacém"
    ],
    "Ireland": [
        "Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan"
    ],
    "Czech Republic": [
        "Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc", "Ceske Budejovice", "Hradec Kralove", "Usti nad Labem", "Pardubice"
    ],
    "Hungary": [
        "Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Gyor", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely"
    ],
    "Romania": [
        "Bucharest", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta", "Craiova", "Brasov", "Galati", "Ploiesti", "Oradea"
    ],
    "United Kingdom": [
        "London", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Bradford", "Liverpool", "Edinburgh", "Manchester", "Bristol", 
        "Kirklees", "Fife", "Wirral", "North Lanarkshire", "Wakefield", "Cardiff", "Dudley", "Wigan", "East Riding", "South Lanarkshire",
        "Coventry", "Belfast", "Leicester", "Sunderland", "Sandwell", "Doncaster", "Stockport", "Sefton", "Nottingham", "Newcastle", 
        "Kingston upon Hull", "Bolton", "Walsall", "Plymouth", "Rotherham", "Stoke-on-Trent", "Wolverhampton", "Rhondda Cynon Taf", 
        "South Gloucestershire", "Derby", "Swansea", "Salford", "Aberdeenshire", "Barnsley", "Tameside", "Oldham", "Trafford", "Aberdeen",
        "Southampton", "Highland", "Rochdale", "Solihull", "Gateshead", "Milton Keynes", "North Tyneside", "Calderdale", "Northampton", 
        "Portsmouth", "Warrington", "North Somerset", "Bury", "Luton", "St Helens", "Stockton-on-Tees", "Renfrewshire", "York", 
        "Thurrock", "Bournemouth", "County Durham", "Peterborough", "Brighton", "Southend-on-Sea", "Newborough", "Reading", "Wokingham"
    ],
    "Canada": [
        "Toronto", "Montreal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg", "Vancouver", "Brampton", "Hamilton",
        "Quebec City", "Surrey", "Laval", "Halifax", "London", "Markham", "Vaughan", "Gatineau", "Saskatoon", "Longueuil",
        "Kitchener", "Burnaby", "Windsor", "Regina", "Richmond", "Oakville", "Burlington", "Richmond Hill", "Oshawa", "Catharines"
    ],
    "Australia": [
        "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City"
    ],
    "Germany": [
        "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen",
        "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster",
        "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Kiel", "Aachen",
        "Halle", "Magdeburg", "Freiburg", "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel",
        "Hagen", "Hamm", "Saarbrücken", "Mülheim", "Potsdam", "Ludwigshafen", "Oldenburg", "Leverkusen", "Osnabrück", "Solingen",
        "Heidelberg", "Herne", "Neuss", "Darmstadt", "Paderborn", "Regensburg", "Ingolstadt", "Würzburg", "Fürth", "Wolfsburg",
        "Offenbach", "Ulm", "Heilbronn", "Pforzheim", "Göttingen", "Bottrop", "Trier", "Recklinghausen", "Reutlingen", "Bremerhaven"
    ],
    "France": [
        "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille",
        "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne",
        "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours", "Amiens", "Perpignan", "Metz",
        "Besançon", "Boulogne-Billancourt", "Orléans", "Mulhouse", "Rouen", "Saint-Denis", "Caen", "Argenteuil", "Saint-Paul", "Montreuil",
        "Nancy", "Roubaix", "Tourcoing", "Nanterre", "Avignon", "Vitry-sur-Seine", "Créteil", "Dunkerque", "Poitiers", "Asnières-sur-Seine",
        "Courbevoie", "Versailles", "Colombes", "Fort-de-France", "Aulnay-sous-Bois", "Saint-Pierre", "Rueil-Malmaison", "Pau", "Aubervilliers", "Le Tampon",
        "Champigny-sur-Marne", "Antibes", "Béziers", "La Rochelle", "Saint-Maur-des-Fossés", "Cannes", "Calais", "Saint-Nazaire", "Mérignac", "Drancy",
        "Colmar", "Ajaccio", "Bourges", "Issy-les-Moulineaux", "Levallois-Perret", "La Seyne-sur-Mer", "Quimper", "Noisy-le-Grand", "Villeneuve-d'Ascq", "Neuilly-sur-Seine",
        "Valence", "Antony", "Cergy", "Vénissieux", "Pessac", "Troyes", "Clichy", "Ivry-sur-Seine", "Chambéry", "Lorient"
    ],
    "Switzerland": [
        "Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne"
    ],
    "Netherlands": [
        "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"
    ]
};

// --- HELPERS ---

// Helper: Determine region based on country
function getRegion(country) {
    if (country === "United States" || country === "Canada") return "North America";
    if (country === "Australia") return "APAC";
    if (country === "Germany" || country === "Switzerland" || country === "Austria") return "DACH";
    if (country === "United Kingdom" || country === "Ireland") return "Western Europe";
    if (country === "France" || country === "Netherlands" || country === "Belgium") return "Western Europe";
    if (country === "Spain" || country === "Italy" || country === "Portugal") return "Southern Europe";
    if (country === "Sweden" || country === "Norway" || country === "Denmark" || country === "Finland") return "Scandinavia";
    if (country === "Poland" || country === "Romania" || country === "Czech Republic" || country === "Hungary") return "Eastern Europe";
    if (country === "Turkey") return "Turkey";
    return "Global";
}

// Helper: Generate slug
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// --- GENERATORS ---

function generateIndustries() {
    const existingIndustries = require('../data/industries.json');
    const newIndustries = [];

    industriesList.forEach(name => {
        const slug = `b2b-lead-generation-${slugify(name)}`;
        
        // Check if exists
        if (!existingIndustries.some(i => i.slug === slug)) {
            newIndustries.push({
                id: slug,
                slug: slug,
                name: name,
                title: `B2B Lead Generation for ${name} | Expandia`,
                description: `Specialized B2B lead generation for ${name} companies. Fill your pipeline with qualified leads and sales meetings.`,
                image: "./assets/local/default-industry.jpg"
            });
        }
    });

    const finalIndustries = [...existingIndustries, ...newIndustries];
    fs.writeFileSync('data/industries.json', JSON.stringify(finalIndustries, null, 2));
    console.log(`✅ Updated Industries: ${finalIndustries.length} total (${newIndustries.length} new)`);
}

function generateCities() {
    const existingCities = require('../data/cities.json');
    const newCities = [];

    Object.entries(countries).forEach(([country, cityList]) => {
        cityList.forEach(city => {
            const slug = `b2b-lead-generation-${slugify(city)}`;
            
            // Check if exists
            if (!existingCities.some(c => c.slug === slug)) {
                newCities.push({
                    id: slug,
                    slug: slug,
                    city: city,
                    country: country,
                    description: `B2B lead generation agency in ${city} helping companies win qualified leads across ${country} and globally.`,
                    image: "./assets/local/default-city.jpg",
                    lat: 0, // Placeholder, would need a geocoding service for real coords
                    lng: 0,
                    region: getRegion(country)
                });
            }
        });
    });

    const finalCities = [...existingCities, ...newCities];
    fs.writeFileSync('data/cities.json', JSON.stringify(finalCities, null, 2));
    console.log(`✅ Updated Cities: ${finalCities.length} total (${newCities.length} new)`);
}

// --- EXECUTE ---

console.log('🚀 Generating Data...');
generateIndustries();
generateCities();
console.log('🎉 Data Generation Complete!');
