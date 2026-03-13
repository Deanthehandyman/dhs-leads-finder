// Dean's Handyman Service LLC — V6 MAXIMUM OVERDRIVE (FREE — Groq + Tavily Search)
// Pittsburg TX 75686 | Spiral from 75686 outward
// 50+ service categories | Angi · Thumbtack · HomeAdvisor · Craigslist · Facebook
// Nextdoor · Twitter/X · Google · Yelp · Forums
// HughesNet/Viasat · New Homeowners · Ranchers · Farmers · Businesses
// Mobile Homes · Storm Damage · Veterans · Churches · Lake Houses · RV Parks
// GOAL: Hundreds of fresh 2026 leads per day

const fs      = require('fs');
const path    = require('path');

const COMPANY  = "Dean's Handyman Service LLC";
const PHONE    = "281-917-9914";
const WEBSITE  = "deanshandymanservice.me";
const BASE     = "Pittsburg TX 75686";
const RUN_MODE = process.env.RUN_MODE || 'scan';

// ─── ZONES — 200mi home territory from 75686, then outward ───────────────────
const ZONES = [
  {
    zone: 1, label: "Home Territory (0-200mi)", weight: 20,
    regions: [
      { name: "Pittsburg & Camp County TX",    zip:"75686", cities:["Pittsburg","Avinger","Lone Star","Linden","Hughes Springs","Daingerfield","Omaha","Naples","Talco","Bogata","Clarksville","Detroit TX","Annona"] },
      { name: "Tyler & Smith County TX",       zip:"75701", cities:["Tyler","Lindale","Whitehouse","Bullard","Chandler","Troup","Hideaway","New Chapel Hill","Arp","Overton"] },
      { name: "Longview & Gregg County TX",    zip:"75601", cities:["Longview","White Oak","Hallsville","Gladewater","Kilgore","Gilmer","Big Sandy","Ore City","Harleton","Warren City"] },
      { name: "Marshall & Harrison County TX", zip:"75670", cities:["Marshall","Waskom","Uncertain","Karnack","Harleton","Elysian Fields","Hallsville","Scottsville","Nesbitt","Elmo"] },
      { name: "Mount Pleasant & Titus County", zip:"75455", cities:["Mount Pleasant","Winnsboro","Quitman","Mineola","Alba","Yantis","Como","Pickton","Talco","Birthright"] },
      { name: "Sulphur Springs & Hopkins County",zip:"75482",cities:["Sulphur Springs","Emory","Winnsboro","Commerce","Greenville","Cumby","Brashear","Como","Saltillo","Weaver"] },
      { name: "Henderson & Rusk County TX",    zip:"75652", cities:["Henderson","Kilgore","Carthage","Center","Tenaha","Timpson","Joaquin","Panola County","Gary","Garrison"] },
      { name: "Nacogdoches & Deep East TX",    zip:"75961", cities:["Nacogdoches","Lufkin","Center","San Augustine","Jasper","Hemphill","Shelbyville","Garrison","Cushing","Douglass"] },
      { name: "Texarkana TX/AR",               zip:"75501", cities:["Texarkana TX","Texarkana AR","Atlanta TX","New Boston TX","Queen City TX","De Kalb TX","Wake Village TX","Nash TX","Redwater TX","Hooks TX"] },
      { name: "Shreveport & Bossier City LA",  zip:"71101", cities:["Shreveport LA","Bossier City LA","Benton LA","Haughton LA","Blanchard LA","Stonewall LA","Minden LA","Plain Dealing LA","Vivian LA","Oil City LA"] },
      { name: "North Louisiana",               zip:"71201", cities:["Monroe LA","West Monroe LA","Ruston LA","Farmerville LA","Homer LA","Arcadia LA","Jonesboro LA","Winnfield LA","Natchitoches LA","Many LA"] },
      { name: "SW Arkansas",                   zip:"71854", cities:["Texarkana AR","Hope AR","Magnolia AR","El Dorado AR","Camden AR","Nashville AR","Prescott AR","Gurdon AR","Fordyce AR","Warren AR"] },
      { name: "Paris & Lamar County TX",       zip:"75460", cities:["Paris TX","Clarksville","Honey Grove","Bonham","Powderly","Roxton","Deport","Blossom","Bogata","Detroit TX"] },
      { name: "Sherman & Denison TX",          zip:"75090", cities:["Sherman","Denison","Pottsboro","Durant border","Whitesboro","Gainesville","Gunter","Van Alstyne","Howe","Bells"] },
      { name: "Greenville & Hunt County TX",   zip:"75401", cities:["Greenville","Commerce","Wolfe City","Caddo Mills","Quinlan","Royse City","Rockwall","Fate","Lavon","Nevada TX"] },
      { name: "Dallas Rural & East DFW",       zip:"75126", cities:["Forney","Terrell","Wills Point","Canton","Kaufman","Mabank","Gun Barrel City","Kemp","Athens","Corsicana"] },
      { name: "DFW South & Ellis County TX",   zip:"75154", cities:["Waxahachie","Ennis","Midlothian","Corsicana","Hillsboro","Cleburne","Burleson","Mansfield","Venus","Maypearl"] },
      { name: "Waco & McLennan County TX",     zip:"76701", cities:["Waco","Hewitt","Woodway","Bellmead","McGregor","Hillsboro","West TX","Lorena","Hewitt","Hillsboro","Corsicana"] },
      { name: "East Houston Corridor TX",      zip:"77339", cities:["Humble","Kingwood","Atascocita","Baytown","Crosby","Highlands","Liberty","Dayton","Hardin","Kountze"] },
      { name: "Lufkin & Angelina County TX",   zip:"75901", cities:["Lufkin","Diboll","Huntington","Zavalla","Jasper","Woodville","Livingston","Corrigan","Crockett","Groveton"] },
      { name: "Southern Oklahoma",             zip:"74701", cities:["Durant OK","Ardmore OK","Broken Bow OK","Idabel OK","Hugo OK","Atoka OK","Coalgate OK","Tishomingo OK","Madill OK","Sulphur OK"] },
      { name: "Southeast Oklahoma",            zip:"74521", cities:["McAlester OK","Poteau OK","Heavener OK","Wilburton OK","Talihina OK","Antlers OK","Stigler OK","Eufaula OK","Checotah OK","Henryetta OK"] },
      { name: "Central Arkansas",              zip:"72201", cities:["Little Rock AR","North Little Rock AR","Conway AR","Benton AR","Bryant AR","Hot Springs AR","Arkadelphia AR","Pine Bluff AR","Malvern AR","Searcy AR"] },
    ]
  },
  {
    zone: 2, label: "Extended Reach (200-400mi)", weight: 4,
    regions: [
      { name: "Oklahoma City Metro",     zip:"73101", cities:["Oklahoma City OK","Norman OK","Edmond OK","Yukon OK","Mustang OK","Moore OK","Midwest City OK","Del City OK","Shawnee OK","Chickasha OK"] },
      { name: "Oklahoma Northeast",      zip:"74401", cities:["Muskogee OK","Tahlequah OK","Stilwell OK","Sallisaw OK","Pryor OK","Claremore OK","Vinita OK","Grove OK","Miami OK","Afton OK"] },
      { name: "Fort Worth & Tarrant TX", zip:"76101", cities:["Fort Worth","Arlington","Mansfield","Burleson","Granbury","Weatherford","Mineral Wells","Stephenville","Glen Rose","Cleburne"] },
      { name: "Central Louisiana",       zip:"71301", cities:["Alexandria LA","Pineville LA","Leesville LA","DeRidder LA","Opelousas LA","Eunice LA","Crowley LA","Jennings LA","Lake Charles LA","Sulphur LA"] },
      { name: "South Arkansas",          zip:"71601", cities:["Pine Bluff AR","Monticello AR","El Dorado AR","Camden AR","Warren AR","Fordyce AR","Crossett AR","McGehee AR","Dumas AR","Helena AR"] },
      { name: "Northwest Arkansas",      zip:"72701", cities:["Fayetteville AR","Springdale AR","Rogers AR","Bentonville AR","Siloam Springs AR","Fort Smith AR","Van Buren AR","Russellville AR","Clarksville AR","Ozark AR"] },
      { name: "Houston Metro East",      zip:"77002", cities:["Houston","Pasadena","Pearland","League City","Deer Park","La Marque","Texas City","Galveston","Friendswood","Alvin"] },
      { name: "Golden Triangle TX",      zip:"77701", cities:["Beaumont","Port Arthur","Orange","Vidor","Silsbee","Jasper","Woodville","Lumberton","Nederland","Bridge City"] },
    ]
  },
  {
    zone: 3, label: "Texas Statewide + Far States", weight: 2,
    regions: [
      { name: "West Texas",             zip:"79701", cities:["Midland","Odessa","Big Spring","San Angelo","Abilene","Pecos","Fort Stockton","Snyder","Sweetwater","Colorado City"] },
      { name: "South Texas",            zip:"78040", cities:["Laredo","Eagle Pass","Uvalde","Hondo","Cotulla","Pearsall","Carrizo Springs","Crystal City","Dilley","Freer"] },
      { name: "Texas Hill Country",     zip:"78028", cities:["Kerrville","Fredericksburg","Boerne","Comfort","Bandera","Uvalde","Del Rio","Junction","Mason","Llano"] },
      { name: "Texas Panhandle",        zip:"79101", cities:["Amarillo","Lubbock","Canyon","Pampa","Borger","Plainview","Levelland","Tahoka","Littlefield","Lamesa"] },
      { name: "San Antonio Rural",      zip:"78006", cities:["Boerne","New Braunfels","Seguin","Pleasanton","Floresville","Castroville","Hondo","Poteet","Jourdanton","Pearsall"] },
      { name: "Mississippi Rural",      zip:"38601", cities:["Southaven MS","Tupelo MS","Hattiesburg MS","Gulfport MS","Meridian MS","Starkville MS","Columbus MS","Corinth MS"] },
      { name: "Tennessee Rural",        zip:"38101", cities:["Memphis TN","Jackson TN","Dyersburg TN","Clarksville TN","Cookeville TN","Columbia TN","Murfreesboro TN"] },
      { name: "New Mexico East",        zip:"88201", cities:["Hobbs NM","Carlsbad NM","Roswell NM","Alamogordo NM","Clovis NM","Artesia NM","Lovington NM","Portales NM"] },
    ]
  },
  {
    zone: 4, label: "National Virtual", weight: 1,
    regions: [
      { name: "Rural Midwest",   zip:"64501", cities:["Rural Missouri","Rural Kansas","Rural Nebraska","Rural Iowa","Rural Indiana","Rural Illinois"] },
      { name: "Rural West",      zip:"87501", cities:["Rural New Mexico","Rural Colorado","Rural Utah","Rural Nevada","Rural Arizona","Rural Wyoming"] },
      { name: "Rural Southeast", zip:"29601", cities:["Rural North Carolina","Rural Virginia","Rural West Virginia","Rural Ohio","Rural Pennsylvania"] },
      { name: "Rural Northeast", zip:"04101", cities:["Rural Maine","Rural Vermont","Rural New Hampshire","Rural Upstate New York","Rural Connecticut"] },
    ]
  },
];

const ROTATION = [];
ZONES.forEach(z=>{ for(let i=0;i<z.weight;i++) ROTATION.push(z); });

// ── PRIORITY SERVICES — Dean's money makers ──────────────────────────────────
const PRIORITY_CATEGORIES = new Set([
  'Internet',       
  'Smart Home',     
  'Facebook',       
  'Social',         
  'DIYFail',        
  'PriceShopper',   
  'Assembly'        
]);

function getThisRunTargets() {
  const slot   = Math.floor(Date.now() / (10 * 60 * 1000));
  const zone   = ROTATION[slot % ROTATION.length];
  const region = zone.regions[slot % zone.regions.length];

  const priority = SERVICES.filter(s => PRIORITY_CATEGORIES.has(s.category));
  const general  = SERVICES.filter(s => !PRIORITY_CATEGORIES.has(s.category));

  const seen = new Set();
  const svcs = [];

  // Aggressively pull priority services per run
  for (let i = 0; i < 3; i++) {
    const p = priority[(slot * 7 + i) % priority.length];
    if (p && !seen.has(p.name)) { seen.add(p.name); svcs.push(p); }
  }

  // Pull 1 GENERAL service
  const g = general[(slot * 11) % general.length];
  if (g && !seen.has(g.name)) { seen.add(g.name); svcs.push(g); }

  return { zone, region, services: svcs };
}

// ─── 50+ SERVICE CATEGORIES (Cleaned of hardcoded years and Reddit) ────────────
const SERVICES = [
  // ══ INTERNET & STARLINK ══════════════════════════════════════════════════════
  {
    name:"Starlink Installation", emoji:"🛰️", virtual:false, category:"Internet",
    searches:[
      'nextdoor.com "starlink" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "anyone install" OR "recommend" OR "need help"',
      'facebook.com /groups "starlink" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need someone" OR "anyone install" OR "just got"',
      '"just got starlink" OR "starlink arrived" OR "starlink kit" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need help install mount',
      '"anyone install starlink" OR "can someone install starlink" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      'craigslist.org texarkana OR tyler OR longview "starlink" install mount setup',
      '"starlink" "pole mount" OR "roof mount" OR "J-mount" cant figure out help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
    ],
  },
  {
    name:"HughesNet Switchers → Starlink", emoji:"😤", virtual:false, category:"Internet",
    searches:[
      'facebook.com /groups "hughesnet" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "hate" OR "terrible" OR "switching" OR "alternatives"',
      'nextdoor.com "hughesnet" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "terrible" OR "slow" OR "switching" OR "alternatives"',
      '"hughesnet" "switching to starlink" OR "switched to starlink" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"done with hughesnet" OR "canceling hughesnet" OR "tired of hughesnet" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
    ],
  },
  {
    name:"Viasat Switchers → Starlink", emoji:"😡", virtual:false, category:"Internet",
    searches:[
      'facebook.com /groups "viasat" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "hate" OR "terrible" OR "switching" OR "alternatives"',
      'nextdoor.com "viasat" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "slow" OR "switching" OR "alternatives" OR "cancel"',
      '"done with viasat" OR "canceling viasat" OR "tired of viasat" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"viasat" "switching to starlink" OR "switched to starlink" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
    ],
  },
  {
    name:"Rural Internet Complaints", emoji:"🌾", virtual:false, category:"Internet",
    searches:[
      'facebook.com /groups "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "internet" "terrible" OR "no good internet" OR "what do yall use"',
      'nextdoor.com "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "internet" "slow" OR "bad" OR "recommendations" OR "what does everyone use"',
      '"no good internet" OR "no broadband" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" what options starlink',
      '"what internet do you use" OR "what internet is available" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" rural',
    ],
  },
  {
    name:"Business & Oilfield Starlink", emoji:"💼", virtual:false, category:"Internet",
    searches:[
      '"starlink business" Texas install setup help affordable',
      '"starlink for business" OR "starlink enterprise" OR "starlink priority" Texas',
      '"business internet" rural Texas OR Oklahoma options starlink',
      '"construction site internet" OR "job site internet" Texas starlink',
      '"oilfield" OR "oil field" OR "pump site" internet Texas starlink',
    ],
  },

  // ══ NEW HOMEOWNERS ════════════════════════════════════════════════════════════
  {
    name:"Just Bought a House", emoji:"🏠", virtual:false, category:"New Homeowner",
    searches:[
      '"just bought a house" OR "just closed" Texas need repairs handyman',
      '"new homeowner" Texas need help fix repair work done',
      '"first time homeowner" Texas repairs handyman affordable help',
      '"home inspection" repairs Texas fix affordable before moving in',
    ],
  },
  {
    name:"Pre-Sale Home Repairs", emoji:"🏡", virtual:false, category:"Real Estate",
    searches:[
      '"selling my house" OR "listing soon" Texas repairs fix handyman affordable',
      '"before listing" OR "before selling" Texas repairs handyman fix up',
      '"home inspection" failed OR issues Texas fix repair sell',
      '"curb appeal" repairs OR painting Texas selling house affordable',
    ],
  },
  {
    name:"Rental & Investment Properties", emoji:"🏘️", virtual:false, category:"Real Estate",
    searches:[
      '"rental property" repairs OR maintenance Texas hire handyman affordable',
      '"landlord" repairs Texas affordable handyman need fast',
      '"tenant damage" OR "tenant repair" Texas landlord handyman',
      '"property management" repairs Texas affordable contractor handyman',
    ],
  },
  {
    name:"Mobile & Manufactured Homes", emoji:"🚐", virtual:false, category:"New Homeowner",
    searches:[
      '"mobile home" OR "manufactured home" repairs Texas affordable handyman',
      '"mobile home" roof OR skirting OR steps OR deck Texas repair',
      '"double wide" OR "single wide" OR "triple wide" repairs Texas handyman',
      '"skirting repair" OR "underpinning" OR "tie downs" mobile home Texas',
    ],
  },
  {
    name:"Homesteaders & Self-Sufficient Living", emoji:"🌱", virtual:false, category:"Ranch/Farm",
    searches:[
      '"homestead" Texas repairs OR build OR install help handyman',
      '"off grid" Texas home repairs build help affordable',
      '"barndominium" Texas repairs OR finishing OR plumbing handyman',
      '"rainwater collection" OR "water well" Texas repair install help',
    ],
  },

  // ══ RANCHERS & FARMERS ════════════════════════════════════════════════════════
  {
    name:"Ranch & Farm Repairs", emoji:"🤠", virtual:false, category:"Ranch/Farm",
    searches:[
      '"ranch" OR "farm" handyman repairs Texas hire need affordable',
      '"barn repair" OR "barn door" OR "barn roof" Texas fix handyman',
      '"cattle guard" OR "stock tank" OR "water trough" repair Texas',
      '"agricultural" building OR structure repair Texas handyman',
    ],
  },
  {
    name:"Ranch Fencing", emoji:"🌵", virtual:false, category:"Ranch/Farm",
    searches:[
      '"ranch fence" OR "farm fence" repair OR install Texas hire affordable',
      '"barbed wire" fence repair OR install Texas need someone',
      '"high fence" OR "deer fence" Texas build repair install',
      '"pipe fence" OR "pipe corral" OR "pipe gate" Texas install repair',
    ],
  },
  {
    name:"Metal Buildings & Ag Structures", emoji:"🏗️", virtual:false, category:"Ranch/Farm",
    searches:[
      '"metal building" OR "steel building" Texas install repair handyman',
      '"pole barn" build OR repair Texas affordable hire',
      '"shop building" OR "workshop" OR "man cave" Texas build affordable',
      '"carport" OR "RV cover" OR "boat cover" Texas build install',
    ],
  },

  // ══ BUSINESSES ════════════════════════════════════════════════════════════════
  {
    name:"Commercial Repairs — Small Business", emoji:"🏪", virtual:false, category:"Business",
    searches:[
      '"small business" repairs OR maintenance Texas handyman affordable',
      '"commercial" handyman OR repairs Texas hire need affordable',
      '"restaurant" OR "cafe" OR "diner" repairs Texas handyman affordable',
      '"retail store" OR "boutique" maintenance repairs Texas handyman',
      '"office" repairs OR maintenance OR renovation Texas handyman',
    ],
  },

  // ══ STORM DAMAGE & INSURANCE ══════════════════════════════════════════════════
  {
    name:"Storm & Hail Damage Repairs", emoji:"⛈️", virtual:false, category:"Storm",
    searches:[
      '"storm damage" repairs Texas affordable handyman need',
      '"hail damage" repair Texas affordable handyman',
      '"wind damage" OR "tornado damage" repairs Texas affordable',
      '"tree fell" OR "tree on house" OR "tree through roof" Texas repair',
      '"fence blown down" OR "fence damage" Texas storm repair',
      '"insurance claim" repairs Texas affordable contractor',
    ],
  },

  // ══ GENERAL HANDYMAN ══════════════════════════════════════════════════════════
  {
    name:"General Handyman & Repairs", emoji:"🔨", virtual:false, category:"Handyman",
    searches:[
      '"need a handyman" Texas OR Arkansas OR Louisiana OR Oklahoma',
      '"looking for handyman" East Texas OR ArkLaTex OR Texarkana OR Shreveport',
      'craigslist.org Texas OR Arkansas OR Louisiana "handyman" needed wanted help',
      'nextdoor.com "handyman" Texas recommend need hire',
      '"home repairs" OR "odd jobs" OR "honey do list" Texas hire affordable',
    ],
  },
  {
    name:"TV Mounting", emoji:"📺", virtual:false, category:"Handyman",
    searches:[
      '"mount TV" OR "TV mounting" OR "hang TV" Texas need help hire affordable',
      '"TV wall mount" Texas service affordable install',
      '"65 inch" OR "75 inch" OR "85 inch" OR "big TV" mount Texas help hire',
      '"above fireplace" OR "above mantle" TV mount install Texas',
    ],
  },
  {
    name:"Plumbing Repairs", emoji:"🚿", virtual:false, category:"Handyman",
    searches:[
      '"need a plumber" OR "plumber needed" Texas OR Arkansas OR Louisiana OR Oklahoma',
      '"leaking faucet" OR "dripping faucet" OR "faucet drip" Texas fix help',
      '"running toilet" OR "toilet runs" OR "phantom flush" Texas fix',
      '"water heater" repair OR replace OR not working Texas affordable',
    ],
  },
  {
    name:"Electrical Work", emoji:"⚡", virtual:false, category:"Handyman",
    searches:[
      '"need electrician" OR "electrician needed" Texas affordable',
      '"outlet not working" OR "dead outlet" OR "tripping breaker" Texas fix',
      '"ceiling fan install" OR "ceiling fan replacement" Texas hire affordable',
      '"light fixture install" OR "light fixture replacement" Texas',
    ],
  },
  {
    name:"Pressure Washing", emoji:"💦", virtual:false, category:"Handyman",
    searches:[
      '"pressure washing" OR "power washing" Texas need quote hire affordable',
      '"dirty driveway" OR "stained concrete" OR "oil stain" driveway Texas',
      '"moldy siding" OR "algae siding" OR "dirty siding" Texas wash clean',
    ],
  },
  {
    name:"Drywall Repair & Texture", emoji:"🧱", virtual:false, category:"Handyman",
    searches:[
      '"drywall repair" Texas need hire affordable',
      '"hole in wall" OR "drywall patch" OR "sheetrock repair" Texas fix',
      '"water damage" drywall OR ceiling Texas repair handyman',
    ],
  },
  {
    name:"Fence Repair & Installation", emoji:"🪚", virtual:false, category:"Handyman",
    searches:[
      '"fence repair" OR "fence installation" Texas need hire affordable',
      '"fence fell" OR "fence blown down" OR "fence down" Texas repair',
      '"replace fence" OR "new fence" Texas affordable handyman',
    ],
  },
  {
    name:"Deck, Porch & Patio", emoji:"🪑", virtual:false, category:"Handyman",
    searches:[
      '"deck repair" OR "porch repair" OR "patio repair" Texas need hire',
      '"rotting deck" OR "rotten wood" deck OR porch Texas repair replace',
      '"deck rebuild" OR "deck replacement" Texas affordable',
    ],
  },
  {
    name:"Junk Removal & Hauling", emoji:"🚛", virtual:false, category:"Handyman",
    searches:[
      '"junk removal" OR "junk hauling" Texas need hire affordable',
      '"haul away" OR "trash removal" OR "debris removal" Texas',
      '"garage cleanout" OR "attic cleanout" OR "shed cleanout" Texas',
    ],
  },
  
  // ══ SMART HOME ═══════════════════════════════════════════════════════════════
  {
    name:"Smart Doorbells & Video Doorbells", emoji:"🔔", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "doorbell" OR "ring" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "install" OR "recommend" OR "need someone"',
      'facebook.com /groups "ring doorbell" OR "doorbell camera" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need help" OR "anyone install"',
      '"doorbell camera" "just got" OR "just bought" need help install "East Texas"',
    ],
  },
  {
    name:"Smart Thermostats", emoji:"🌡️", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "thermostat" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "install" OR "recommend"',
      'facebook.com /groups "nest" OR "ecobee" OR "smart thermostat" "East Texas"',
      '"C wire" OR "no C wire" smart thermostat install confused help "East Texas"',
    ],
  },
  {
    name:"Smart Locks & Keypads", emoji:"🔐", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "smart lock" OR "keypad lock" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" "recommend" OR "anyone install"',
      '"anyone install" "smart lock" OR "keypad lock" "East Texas" OR "Tyler" OR "Longview"',
      '"Schlage" OR "Kwikset" OR "August" smart lock install confused "East Texas"',
    ],
  },
  {
    name:"Whole Home WiFi & Networking", emoji:"📶", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "wifi" "dead zones" OR "doesnt reach" OR "bad signal" "Pittsburg" OR "Tyler" OR "Longview"',
      '"wifi doesnt reach" OR "no wifi in the shop" OR "no wifi in the barn" "East Texas" fix extend',
      '"ethernet" run OR install shop OR barn OR garage "East Texas" OR "Tyler"',
    ],
  },
  
  // ══ ASSEMBLY ════════════════════════════════════════════════════════════════
  {
    name:"IKEA & Flat Pack Furniture Assembly", emoji:"📦", virtual:false, category:"Assembly",
    searches:[
      '"IKEA" "can someone" OR "anyone assemble" OR "need help" "Tyler" OR "Longview" OR "East Texas"',
      '"IKEA" "giving up" OR "hate these instructions" OR "too many pieces" "East Texas"',
      '"KALLAX" OR "BILLY" OR "PAX" OR "HEMNES" "need help" OR "can someone assemble" "East Texas"',
    ],
  },
  {
    name:"Wayfair & Amazon Furniture Assembly", emoji:"🛋️", virtual:false, category:"Assembly",
    searches:[
      '"Wayfair" OR "Amazon" "furniture" "need someone" OR "anyone assemble" "East Texas"',
      '"bed frame" OR "dresser" OR "desk" "sitting in box" OR "delivered" need help assemble "East Texas"',
    ],
  },
  {
    name:"Gym & Exercise Equipment Assembly", emoji:"🏋️", virtual:false, category:"Assembly",
    searches:[
      '"treadmill assembly" OR "treadmill setup" Texas hire affordable',
      '"exercise equipment" assembly Texas hire affordable',
      '"peloton" setup OR assembly Texas hire affordable',
    ],
  },

  // ══ SPECIAL OUTREACH & DIY FAILS ════════════════════════════════════════════
  {
    name:"DIY Failed — Gave Up, Ready to Hire", emoji:"😤", virtual:false, category:"DIYFail",
    searches:[
      '"tried to fix it myself" OR "tried to install it myself" "East Texas" OR "Tyler" need help',
      '"watched the YouTube video" OR "followed the instructions" still need help "East Texas"',
      '"bigger job than I thought" OR "in over my head" "East Texas" OR "Tyler" OR "Longview"',
    ],
  },
  {
    name:"Price Comparison Shoppers East TX", emoji:"🔍", virtual:false, category:"PriceShopper",
    searches:[
      '"quote was too high" OR "quoted too much" handyman "East Texas" OR "Tyler"',
      '"got a quote" "seems high" OR "seems expensive" OR "too much" "East Texas"',
      '"how much does it cost" handyman "Tyler TX" OR "Longview TX"',
    ],
  },
  {
    name:"Craigslist — Services Wanted", emoji:"📋", virtual:false, category:"Social",
    searches:[
      'craigslist.org /search/lbg Texas "handyman" OR "repairs" OR "help needed"',
      'craigslist.org Tyler TX services wanted handyman',
      'craigslist.org Texarkana services wanted handyman repairs',
    ],
  },
  {
    name:"Facebook Groups — Need Recommendations", emoji:"👥", virtual:false, category:"Facebook",
    searches:[
      'facebook.com "group" "East Texas" "recommend" OR "looking for" handyman',
      'facebook.com "Tyler Texas" group "recommend" handyman repairs',
      'facebook.com "Longview Texas" group "need someone" repairs',
    ],
  }
];

// ─── Outreach scripts by category ─────────────────────────────────────────────
const OUTREACH_SCRIPTS = {
  Internet: {
    subject: "Local Starlink installer here — can help you switch",
    message: `Hi! I saw you're looking for better internet. I'm Dean, a local Starlink installer in East Texas. I can get you set up fast — usually same week. Starlink runs $120/mo and is WAY faster than HughesNet or Viasat. Give me a call: ${PHONE} or visit ${WEBSITE}`
  },
  "New Homeowner": {
    subject: "Local handyman here — congrats on the new home!",
    message: `Hey, congrats on the new place! I'm Dean, a local handyman in East Texas. Whether it's a punch list, repairs, or just getting things set up the way you want — I'm affordable and reliable. Call or text me: ${PHONE}`
  },
  "Real Estate": {
    subject: "Handyman for pre-sale repairs — fast turnaround",
    message: `Hi! I'm Dean, a local handyman. I specialize in quick pre-sale repairs and punch lists for homeowners getting ready to list. Fast turnaround, affordable prices. Call me: ${PHONE} or visit ${WEBSITE}`
  },
  "Ranch/Farm": {
    subject: "Local handyman for ranch & farm work",
    message: `Hey! I'm Dean, a local handyman serving East Texas ranches and farms. Fencing, barn repairs, ag buildings, equipment sheds — I do it all. Affordable and reliable. Give me a call: ${PHONE}`
  },
  Business: {
    subject: "Handyman for your business — fast & affordable",
    message: `Hi! I'm Dean with Dean's Handyman Service. I do commercial repairs and maintenance for small businesses in East Texas — fast turnaround, affordable rates. Let me know what you need: ${PHONE}`
  },
  Storm: {
    subject: "Storm damage repair — available now",
    message: `Hi, I'm Dean — local handyman in East Texas. I can help with storm and hail damage repairs quickly. Call me today and I can often come out same week: ${PHONE}`
  },
  "Smart Home": {
    subject: "Local smart home installer — I can help set that up",
    message: `Hey! I'm Dean, a local handyman and smart home installer in East Texas. I install Ring cameras, Nest thermostats, smart switches, ceiling fans, TV mounts and more. Affordable and quick. Call me: ${PHONE}`
  },
  Assembly: {
    subject: "I can assemble that for you — local & affordable",
    message: `Hi! I'm Dean, a local handyman in East Texas. I assemble furniture, playsets, grills, exercise equipment — anything you bought in a box. Quick turnaround, affordable rates. Call me: ${PHONE}`
  },
  Installation: {
    subject: "Local installer — I can handle that for you",
    message: `Hey! I'm Dean, a local handyman. I install ceiling fans, light fixtures, faucets, TV mounts, blinds, smart devices and more. No job too small. Call or text: ${PHONE}`
  },
  Permits: {
    subject: "Local handyman — saw you're doing some work",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. I noticed you may be working on your property and wanted to reach out. I do repairs, installations, and all kinds of handyman work — affordable and reliable. Call me: ${PHONE}`
  },
  Handyman: {
    subject: "Local handyman available — affordable & reliable",
    message: `Hi! I'm Dean, a local handyman serving East Texas and the ArkLaTex area. Whatever you need done around the house, I can help. Affordable rates, reliable work. Call or text: ${PHONE}`
  },
  Subcontract: {
    subject: "Local installer available — East Texas — looking to partner",
    message: `Hi! I'm Dean with Dean's Handyman Service in Pittsburg TX (East Texas / ArkLaTex area). I'm an experienced handyman and installer looking to join your installer network or subcontract. I do Starlink, smart home, TV mounting, appliances, flooring, general repairs and more. Insured, reliable, fast. Would love to talk. Call or text: ${PHONE} or visit ${WEBSITE}`
  },
  Facebook: {
    subject: "Local handyman here — saw you were looking",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas (Pittsburg TX area). I saw you were looking for help and wanted to reach out. I do repairs, installations, furniture assembly, Starlink, TV mounting and more — affordable and reliable. Call or text: ${PHONE}`
  },
  Google: {
    subject: "Local handyman — alternative to that quote",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. I'm local, affordable, and reliable — often a better option than the big names. Whatever you need done, give me a call: ${PHONE} or visit ${WEBSITE}`
  },
  LeadSites: {
    subject: "Local handyman available — East Texas",
    message: `Hi! I'm Dean with Dean's Handyman Service serving East Texas, Texarkana, Shreveport and the ArkLaTex area. I do all types of repairs, installations, and handyman work at affordable prices. Call or text: ${PHONE}`
  },
  Alignable: {
    subject: "Local handyman looking to partner with contractors",
    message: `Hi! I'm Dean with Dean's Handyman Service in Pittsburg TX (East Texas / ArkLaTex). I'm an experienced handyman and installer looking to build relationships with GCs and property managers. Reliable, affordable, fast turnaround. Let's connect: ${PHONE} or ${WEBSITE}`
  },
  DIYFail: {
    subject: "I can finish that for you — local handyman",
    message: `Hi! I'm Dean, a local handyman in East Texas. Sounds like the project got a little complicated — no worries, happens to everyone! I can come finish it up for you quickly and affordably. Call or text me: ${PHONE}`
  },
  Landlord: {
    subject: "Reliable handyman for your rental properties",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. I work with landlords and property managers for repairs, make-readies, and ongoing maintenance — fast turnaround, fair pricing, you can count on me to show up. Call or text: ${PHONE} or visit ${WEBSITE}`
  },
  PriceShopper: {
    subject: "Get a second opinion — local handyman, fair prices",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. If you got a quote that seemed high, I'd be happy to give you a second opinion. I'm local, affordable, and straightforward about pricing. Call or text: ${PHONE}`
  },
  default: {
    subject: "Local handyman here to help",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. I can help with repairs, installations, assembly, Starlink setup and more. Give me a call: ${PHONE} or visit ${WEBSITE}`
  }
};

function getScript(category) {
  return OUTREACH_SCRIPTS[category] || OUTREACH_SCRIPTS.default;
}

// ─── Query Builder (First Person & Human Intent) ──────────────────────────────
function buildHumanQueries(service, region, zone) {
  const city1 = region.cities[0];
  const name  = service.name;
  const svc   = name.toLowerCase()
    .replace(/ installation$/i,'').replace(/ installer$/i,'')
    .replace(/ assembly$/i,'').replace(/ repair$/i,'');

  // Real humans use simpler phrases. Complex OR statements often confuse search APIs.
  const humanPool = [
    `"${city1}" "need someone" ${svc}`,
    `"${city1}" "looking for" ${svc}`,
    `"${city1}" "anyone recommend" ${svc}`,
    `"${city1}" "help with my" ${svc}`,
    `"${city1}" "how much to" ${svc}`,
    `site:craigslist.org "${city1}" ${svc} wanted`, // Forces Craigslist
  ];

  const hardcoded = service.searches || [];
  const result = [];

  // Grab 2 hardcoded (highly specific) + 2 human pool (broad intent)
  if (hardcoded.length > 0) result.push(hardcoded[Math.floor(Math.random() * hardcoded.length)]);
  if (hardcoded.length > 1) result.push(hardcoded[Math.floor(Math.random() * hardcoded.length)]);
  
  result.push(humanPool[Math.floor(Math.random() * humanPool.length)]);
  result.push(humanPool[Math.floor(Math.random() * humanPool.length)]);

  // Shuffle and return top 3 to keep API costs down while maximizing variety
  return result.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// ─── Search API Call (Tavily) ────────────────────────────────────────────────
async function tavilySearch(query) {
  // Professionally strip years so we hit human posts, not SEO spam blogs
  const cleanQ = query
    .replace(/\b(2024|2025|2026)\b/g, '') 
    .replace(/\s{2,}/g, ' ')
    .trim();

  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: cleanQ,
      search_depth: 'advanced', 
      days: 14, // Enforces recent indexing                 
      max_results: 15,          
      include_answer: false,
      exclude_domains: [
        'wikipedia.org','amazon.com','ebay.com','walmart.com',
        'homedepot.com','lowes.com', 'yelp.com', 'yellowpages.com', 'bbb.org',
        'angi.com', 'homeadvisor.com', 'thumbtack.com', 'taskrabbit.com',
        'porch.com', 'houzz.com', 'expertise.com', 'homeguide.com', 'fixr.com', 'buildzoom.com', 'reddit.com'
      ],
    }),
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  if (data.error) return [];
  return data.results || [];
}

// ─── LLM Filtering & Parsing (Groq) ──────────────────────────────────────────
async function scanCombo(zone, region, service) {
  console.log(`  ${service.emoji} ${service.name} — Z${zone.zone} ${region.name}`);
  const city = region.cities[0];

  const queries = buildHumanQueries(service, region, zone);
  let searchContext = '';
  let totalResults = 0;

  for (const q of queries) {
    try {
      const results = await tavilySearch(q);
      console.log(`    🔍 Tavily: ${results.length} results — ${q.slice(0,70)}`);
      totalResults += results.length;
      for (const r of results) {
        searchContext += `\nURL: ${r.url}\nTITLE: ${r.title}\nSNIPPET: ${r.content?.slice(0,350)}\n---`;
      }
      if (totalResults >= 15) break; 
    } catch(e) {
      console.log(`    ❌ Tavily exception: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 20000)); 
  }

  if (!searchContext) {
    console.log(`    🔄 No results found. Skipping LLM call to save tokens.`);
    return [];
  }

  console.log(`    📄 Total search context: ${searchContext.length} chars`);

  // DYNAMIC DATE INJECTION: The LLM needs to know exactly what today is.
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `You are a professional lead scraper for Dean's Handyman Service in ${city} (${region.name}).
TODAY'S DATE IS: ${today}.

WHAT COUNTS AS A REAL LEAD (Look for FIRST-PERSON language: "I need", "my roof", "we are looking for"):
- Real humans asking for recommendations, quotes, or help STRICTLY within the LAST 14 DAYS.
- People venting about a problem they can't fix themselves (IKEA box, bad HughesNet, broken tech).
- Truncated snippets that strongly imply a homeowner looking for local services (e.g., "Looking for a guy to...").
- People saying "just moved in" or "just bought a house".

WHAT TO REJECT (DO NOT INCLUDE THESE):
- ANYTHING FROM 2025 OR EARLIER. If the snippet implies it is from 2025, 2024, or older, REJECT IT IMMEDIATELY.
- ANYTHING OLDER THAN 14 DAYS from today's date (${today}). 
- Businesses advertising their own services (e.g., "We offer the best plumbing in town").
- News articles, business directory listings, generic blog posts, or national job postings.

Search results:
${searchContext}

IMPORTANT: If there are no real humans asking for help in the last 14 days, return an empty array: []
Do not invent or guess leads. 

Return ONLY a JSON array (up to 5 leads). Each:
{"title":"what they need","snippet":"Exact description of their situation","service":"${service.name}","serviceEmoji":"${service.emoji}","category":"${service.category}","isVirtual":${service.virtual},"source":"platform name","platform":"platform name","url":"url or empty","contactHint":"email/phone or empty","location":"City, State","region":"${region.name}","zone":${zone.zone},"heat":"hot|warm|cold","heatReason":"Why this is hot (e.g., 'First-person plea for help, very recent')","competitorMention":true/false,"urgency":"immediate|this week|flexible|unknown","estimatedJobValue":"$X-$Y or unknown","tags":["tag1","tag2"],"posted":"EXACT age based on snippet (e.g., '2 days ago', 'March 10') - MUST BE UNDER 14 DAYS","status":"new"}

hot = actively looking RIGHT NOW, frustrated with competitor, urgent
warm = has the problem, shopping around or general question
cold = mentioned the topic but no clear intent

JSON only. No markdown. No explanation. Ensure all quotes inside values are properly escaped and do not use line breaks inside strings.`;

  let text = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        max_tokens:  3000,
        temperature: 0.2, // Ultra-strict adherence to instructions
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    if (resp.status === 429) {
      console.log(`    ⏳ Rate limited — waiting 25s...`);
      await new Promise(r => setTimeout(r, 25000));
      continue;
    }
    if (!resp.ok) { console.error(`    ❌ API error:`, JSON.stringify(data.error||data)); return []; }
    text = data.choices?.[0]?.message?.content || '';
    break;
  }

  if (!text) return [];

  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    const leads = JSON.parse(match[0]);
    if (!Array.isArray(leads)) return [];
    const hot  = leads.filter(l=>l.heat==='hot').length;
    const warm = leads.filter(l=>l.heat==='warm').length;
    console.log(`    ✅ ${leads.length} leads (${hot}🔥 ${warm}⚡ ${leads.length-hot-warm}cold)`);
    return leads;
  } catch(e) {
    console.log(`    Parse error: ${e.message}`);
    return [];
  }
}

// ─── Hot alert email ──────────────────────────────────────────────────────────
async function sendHotAlert(hotLeads, region) {
  if (!hotLeads.length) return;
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });
  const uc = u=>u==='immediate'?'#dc2626':u==='this week'?'#d97706':'#059669';
  const ul = u=>u==='immediate'?'⚡ NOW':u==='this week'?'📅 THIS WEEK':'🗓 FLEXIBLE';
  const html = `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:16px;background:#fffbeb">
<div style="background:#04080f;border-radius:12px;padding:20px;text-align:center;margin-bottom:14px">
  <div style="font-size:30px">🔥</div>
  <h2 style="color:#ff9d00;margin:8px 0 4px">HOT LEAD${hotLeads.length>1?'S':''} — CALL NOW</h2>
  <p style="color:#7a9cc0;margin:0;font-size:12px">${hotLeads.length} hot lead${hotLeads.length>1?'s':''} · ${region.name}</p>
</div>
${hotLeads.map(l=>{
  const script = getScript(l.category);
  const mailtoBody = encodeURIComponent(script.message);
  const mailtoSubj = encodeURIComponent(script.subject);
  const contactEmail = (l.contactHint||'').match(/[^\s]+@[^\s]+/)?.[0] || '';
  const mailtoLink = contactEmail ? `mailto:${contactEmail}?subject=${mailtoSubj}&body=${mailtoBody}` : '';
  return `
<div style="background:white;border:2px solid #f59e0b;border-radius:12px;padding:16px;margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap">
    <b style="color:#111;font-size:14px">${l.serviceEmoji||'🔨'} ${l.title}</b>
    <div style="display:flex;gap:5px;flex-wrap:wrap">
      <span style="background:${uc(l.urgency)};color:white;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700">${ul(l.urgency)}</span>
      ${l.estimatedJobValue&&l.estimatedJobValue!=='unknown'?`<span style="background:#f0fdf4;color:#166534;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700">💰 ${l.estimatedJobValue}</span>`:''}
    </div>
  </div>
  <p style="color:#444;font-size:13px;margin:0 0 8px;line-height:1.5">${l.snippet}</p>
  <div style="font-size:11px;color:#888;margin-bottom:6px">📍 ${l.location||region.name} · ${l.platform||l.source} · ${l.posted||'recent'}${l.isVirtual?' · 💻 VIRTUAL':''}</div>
  ${l.heatReason?`<div style="font-size:12px;color:#b45309;font-style:italic;margin-bottom:6px">💡 ${l.heatReason}</div>`:''}
  ${l.contactHint?`<div style="font-size:12px;color:#059669;font-weight:600;background:#f0fdf4;padding:6px 10px;border-radius:8px;margin-bottom:6px">📧 ${l.contactHint}</div>`:''}
  ${l.url?`<a href="${l.url}" style="font-size:11px;color:#2563eb;word-break:break-all;display:block;margin-bottom:8px">${l.url}</a>`:''}
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;margin-top:8px">
    <div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em">📝 What to say:</div>
    <div style="font-size:11px;color:#334155;line-height:1.6;white-space:pre-wrap">${script.message}</div>
    ${mailtoLink?`<a href="${mailtoLink}" style="display:inline-block;margin-top:8px;background:#2563eb;color:white;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">📧 Send Email Now</a>`:''}
  </div>
</div>`}).join('')}
<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;padding:12px;text-align:center">
  <b style="color:#92400e">📞 Call before someone else does: ${PHONE}</b>
</div></body></html>`;
  await sendEmail(t, html, `🔥 ${hotLeads.length} HOT Lead${hotLeads.length>1?'s':''} — ${hotLeads[0].service} · ${region.name}`);
}

// ─── Auto-Reply ───────────────────────────────────────────────────────────────
async function autoReply(leads) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const repliedFile = path.join(__dirname, 'replied.json');
  let replied = [];
  try { replied = JSON.parse(fs.readFileSync(repliedFile, 'utf8')); } catch {}
  const repliedSet = new Set(replied);

  let count = 0;
  for (const lead of leads) {
    if (!['hot','warm'].includes(lead.heat)) continue;
    if (!lead.url || !lead.url.includes('craigslist.org')) continue;
    if (repliedSet.has(lead.url)) continue;

    try {
      const pageResp = await fetch(lead.url, { headers:{ 'User-Agent':'Mozilla/5.0' } });
      if (!pageResp.ok) continue;
      const html = await pageResp.text();

      const emailMatch = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.craigslist\.org/);
      if (!emailMatch) continue;
      const replyTo = emailMatch[0];

      const serviceMsg = lead.service || 'handyman work';
      const body = `Hi there,\n\nI saw your post and wanted to reach out — I'm Dean, a local handyman serving the ${lead.location || 'East Texas / ArkLaTex'} area.\n\nI do ${serviceMsg} and I'm available this week. I'm local, affordable, and reliable.\n\nGive me a call or text anytime: ${PHONE}\nOr visit: https://${WEBSITE}\n\nHope to hear from you!\n— Dean\n${COMPANY}\n${PHONE}`;

      await t.sendMail({
        from: `"Dean's Handyman Service" <${process.env.GMAIL_USER}>`,
        to: replyTo,
        subject: `Re: ${lead.title || 'Your post'}`,
        text: body,
      });

      repliedSet.add(lead.url);
      replied.push(lead.url);
      count++;
      console.log(`  📧 Auto-replied to: ${lead.title} → ${replyTo}`);
      await new Promise(r => setTimeout(r, 30000));
    } catch(e) {
      console.log(`  ⚠️  Auto-reply failed for ${lead.url}: ${e.message}`);
    }
  }

  try { fs.writeFileSync(repliedFile, JSON.stringify(replied, null, 2)); } catch {}
  if (count > 0) console.log(`✅ Auto-replied to ${count} Craigslist leads`);
}

// ─── Daily digest ─────────────────────────────────────────────────────────────
async function sendDailyDigest() {
  console.log('☀️  Building 8am digest...');
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const cutoff   = new Date(Date.now() - 24*60*60*1000);
  const recent   = existing.filter(l => new Date(l.foundAt) >= cutoff);
  const hot      = recent.filter(l=>l.heat==='hot');
  
  const needFollowUp = existing.filter(l => {
    const age = Date.now() - new Date(l.foundAt);
    const oneDayMs = 24*60*60*1000;
    return (l.status === 'new') &&
           ['hot','warm'].includes(l.heat) &&
           age > oneDayMs &&
           age < 7*oneDayMs;
  });
  
  const warm     = recent.filter(l=>l.heat==='warm');
  const cold     = recent.filter(l=>l.heat==='cold');
  const comp     = recent.filter(l=>l.competitorMention===true||l.competitorMention==='true');
  const immed    = recent.filter(l=>l.urgency==='immediate');
  const internet = recent.filter(l=>l.category==='Internet');
  const newHome  = recent.filter(l=>l.category==='New Homeowner'||l.category==='Real Estate');
  const ranch    = recent.filter(l=>l.category==='Ranch/Farm');
  const biz      = recent.filter(l=>l.category==='Business');
  const storm    = recent.filter(l=>l.category==='Storm');
  const subcon   = recent.filter(l=>l.category==='Subcontract');
  const techLeads= recent.filter(l=>['Internet','Smart Home','Tech'].includes(l.category));
  const fbLeads  = recent.filter(l=>l.category==='Facebook');
  const diyFail  = recent.filter(l=>l.category==='DIYFail');
  const landlords= recent.filter(l=>l.category==='Landlord');
  const priceshop= recent.filter(l=>l.category==='PriceShopper');

  const byCat = {};
  recent.forEach(l=>{
    const c = l.category||'Other';
    if(!byCat[c]) byCat[c]=[];
    byCat[c].push(l);
  });

  const hi = h=>h==='hot'?'🔥':h==='warm'?'⚡':'·';
  const uc = u=>u==='immediate'?'#dc2626':u==='this week'?'#d97706':'transparent';
  const ul = u=>u==='immediate'?'⚡NOW':u==='this week'?'📅WK':'';

  const catOrder = ['Subcontract','Facebook','DIYFail','Landlord','PriceShopper','Google','Alignable','LeadSites','Internet','New Homeowner','Real Estate','Ranch/Farm','Business','Storm','Handyman','Assembly','Installation','Hyperlocal','Permits','Seasonal','Social','Lead Platforms','Specialty','Tech','Smart Home','Virtual','New Mover','Other'];
  const catEmoji = {Subcontract:'🔧',Facebook:'👥',DIYFail:'😤',Landlord:'🏠',PriceShopper:'💸',Google:'📍',Alignable:'🤝',LeadSites:'🏡',Internet:'📡',['New Homeowner']:'🏠',['Real Estate']:'🏡',['Ranch/Farm']:'🤠',Business:'🏪',Storm:'⛈️',Handyman:'🔨',Assembly:'📦',Installation:'⚙️',Hyperlocal:'📍',Permits:'📋',Seasonal:'🌸',['Lead Platforms']:'📌',Social:'👥',Specialty:'♿',Tech:'📷',['Smart Home']:'🏠',Virtual:'💻',['New Mover']:'🚚',Other:'📋'};

  const catBlocks = catOrder.filter(c=>byCat[c]&&byCat[c].length).map(cat=>{
    const leads = byCat[cat];
    const sorted = [...leads].sort((a,b)=>(a.heat==='hot'?0:a.heat==='warm'?1:2)-(b.heat==='hot'?0:b.heat==='warm'?1:2));
    return `<div style="background:white;border-radius:12px;padding:18px;margin-bottom:10px">
  <h3 style="margin:0 0 12px;font-size:14px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:7px">
    ${catEmoji[cat]||'📋'} ${cat} <span style="color:#64748b;font-weight:400;font-size:12px">(${leads.length} leads)</span>
  </h3>
  ${sorted.map(l=>{
    const bg=l.heat==='hot'?'#fffbeb':l.heat==='warm'?'#f0f9ff':'#f9fafb';
    const bc=l.heat==='hot'?'#f59e0b':l.heat==='warm'?'#93c5fd':'#e5e7eb';
    const tc=l.heat==='hot'?'#92400e':l.heat==='warm'?'#1e40af':'#555';
    return `<div style="background:${bg};border:1px solid ${bc};border-radius:8px;padding:11px;margin-bottom:7px">
    <div style="display:flex;justify-content:space-between;gap:6px;margin-bottom:4px;flex-wrap:wrap">
      <b style="color:#111;font-size:12px">${hi(l.heat)} ${l.serviceEmoji||'🔨'} ${l.title}</b>
      <div style="display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0">
        <span style="background:${bc};color:${tc};padding:1px 6px;border-radius:5px;font-size:9px;font-weight:700">${(l.heat||'').toUpperCase()}</span>
        ${l.urgency&&l.urgency!=='unknown'&&l.urgency!=='flexible'?`<span style="background:${uc(l.urgency)};color:white;padding:1px 6px;border-radius:5px;font-size:9px;font-weight:700">${ul(l.urgency)}</span>`:''}
        ${l.estimatedJobValue&&l.estimatedJobValue!=='unknown'?`<span style="background:#f0fdf4;color:#166534;padding:1px 6px;border-radius:5px;font-size:9px;font-weight:700">💰${l.estimatedJobValue}</span>`:''}
      </div>
    </div>
    <p style="color:#444;font-size:11px;margin:0 0 4px;line-height:1.5">${l.snippet}</p>
    <div style="font-size:10px;color:#888">📍 ${l.location||''} · ${l.platform||l.source||'web'} · ${l.posted||'recent'}${l.isVirtual?' · 💻':''}</div>
    ${l.heatReason?`<div style="font-size:10px;color:${tc};font-style:italic;margin-top:3px">💡 ${l.heatReason}</div>`:''}
    ${l.contactHint?`<div style="font-size:10px;color:#059669;font-weight:600;margin-top:3px">📧 ${l.contactHint}</div>`:''}
    ${l.url?`<a href="${l.url}" style="font-size:10px;color:#2563eb;display:block;margin-top:3px;word-break:break-all">${l.url}</a>`:''}
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:7px;margin-top:6px;font-size:10px;color:#475569;line-height:1.6">
      <b style="color:#334155">📝 Say:</b> ${getScript(l.category).message.split('\n')[0]}
    </div>
  </div>`}).join('')}
</div>`;
  }).join('');

  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;background:#f1f5f9">
<div style="background:#04080f;border-radius:14px;padding:26px;text-align:center;margin-bottom:14px">
  <div style="font-size:36px">☀️</div>
  <h2 style="color:#00d4ff;margin:8px 0 2px;font-size:22px">GOOD MORNING DEAN!</h2>
  <p style="color:#7a9cc0;margin:0 0 4px;font-size:13px">${today}</p>
  <p style="color:#4a6080;margin:0;font-size:11px">${COMPANY} · ${PHONE} · ${WEBSITE}</p>
</div>

<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:8px">
  ${[['📋 Total',recent.length,'#f8fafc','#334155'],['🔥 Hot',hot.length,'#fef3c7','#92400e'],['⚡ Warm',warm.length,'#eff8ff','#1e40af'],['· Cold',cold.length,'#f9fafb','#64748b'],['⚡ Urgent',immed.length,'#fee2e2','#dc2626']].map(([l,n,bg,c])=>`
  <div style="background:${bg};border:1px solid ${c}33;border-radius:10px;padding:10px;text-align:center">
    <div style="font-size:22px;font-weight:800;color:${c}">${n}</div>
    <div style="font-size:9px;color:${c};font-weight:700;letter-spacing:.05em">${l}</div>
  </div>`).join('')}
</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px">
  ${[['📡 Internet',internet.length,'#eff8ff','#1d4ed8'],['🏠 New Home',newHome.length,'#f0fdf4','#065f46'],['🤠 Ranch',ranch.length,'#fef3c7','#92400e'],['🏪 Business',biz.length,'#fdf4ff','#7e22ce'],['⛈️ Storm',storm.length,'#fff7ed','#c2410c']].map(([l,n,bg,c])=>`
  <div style="background:${bg};border:1px solid ${c}33;border-radius:10px;padding:10px;text-align:center">
    <div style="font-size:20px;font-weight:800;color:${c}">${n}</div>
    <div style="font-size:9px;color:${c};font-weight:700">${l}</div>
  </div>`).join('')}
</div>

${recent.length===0
  ? `<div style="background:white;border-radius:12px;padding:30px;text-align:center;color:#888;font-size:14px;line-height:2">
      No new leads captured in the last 24 hours.<br>
      Scanner is running every 30 min — this is normal on slow news days.<br>
      <b>Tip:</b> Go to GitHub Actions → Run workflow → Run a manual scan right now.
    </div>`
  : `
  ${techLeads.length?`<div style="background:#0c1a2e;border:2px solid #00d4ff;border-radius:12px;padding:14px;margin-bottom:10px;text-align:center">
    <div style="font-size:22px">🛰️📶🏠</div>
    <b style="color:#00d4ff;font-size:14px">MONEY MAKERS — ${techLeads.length} STARLINK / INTERNET / SMART HOME LEADS</b>
    <div style="color:#7a9cc0;font-size:11px;margin-top:4px">These are Dean's highest-value jobs — Starlink installs, WiFi, smart devices. Call these first.</div>
  </div>`:''}
  ${immed.length?`<div style="background:#fee2e2;border:2px solid #f87171;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#dc2626">⚡ ${immed.length} PEOPLE NEED IMMEDIATE HELP — CALL THESE FIRST THING THIS MORNING</b>
  </div>`:''}
  ${comp.length?`<div style="background:#fff7ed;border:2px solid #fb923c;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#c2410c">⚠️ ${comp.length} LEADS SHOPPED EXPENSIVE COMPETITORS — Say: "I'm local and I charge less."</b>
  </div>`:''}
  ${internet.length?`<div style="background:#eff8ff;border:2px solid #93c5fd;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#1d4ed8">📡 ${internet.length} INTERNET LEADS — HughesNet/Viasat people pay $100-200/mo and HATE it. Starlink saves them money AND is faster.</b>
  </div>`:''}
  ${storm.length?`<div style="background:#fff7ed;border:2px solid #fb923c;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#c2410c">⛈️ ${storm.length} STORM DAMAGE LEADS — These are urgent and insurance often covers it. Strike fast.</b>
  </div>`:''}
  ${subcon.length?`<div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#166534">🔧 ${subcon.length} SUBCONTRACT LEADS — Companies looking for local installers. Steady recurring work. Apply today.</b>
  </div>`:''}
  ${diyFail.length?`<div style="background:#fef9c3;border:2px solid #fde047;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#854d0e">😤 ${diyFail.length} DIY FAIL LEADS — They tried it themselves and failed. Already motivated to hire someone. Call today.</b>
  </div>`:''}
  ${landlords.length?`<div style="background:#f0f9ff;border:2px solid #38bdf8;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#0369a1">🏠 ${landlords.length} LANDLORD LEADS — Repeat work, multiple properties. These customers are worth thousands per year.</b>
  </div>`:''}
  ${priceshop.length?`<div style="background:#fdf4ff;border:2px solid #e879f9;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#86198f">💸 ${priceshop.length} PRICE SHOPPER LEADS — Got a high quote and are looking for alternatives. Easy win — just be cheaper.</b>
  </div>`:''}
  ${fbLeads.length?`<div style="background:#eff6ff;border:2px solid #93c5fd;border-radius:12px;padding:12px;margin-bottom:10px;text-align:center;font-size:13px">
    <b style="color:#1d4ed8">👥 ${fbLeads.length} FACEBOOK GROUP LEADS — Local East TX groups. These people want someone nearby — that's you.</b>
  </div>`:''}\n  ${needFollowUp.length?`<div style="background:#fdf4ff;border:2px solid #c084fc;border-radius:12px;padding:14px;margin-bottom:12px">
    <div style="text-align:center;font-size:13px;font-weight:700;color:#7e22ce;margin-bottom:10px">
      ⏰ ${needFollowUp.length} LEAD${needFollowUp.length>1?'S':''} WAITING ON YOU — Haven't been followed up on yet
    </div>
    ${needFollowUp.slice(0,5).map(l=>{
      const script = getScript(l.category);
      const ageHrs = Math.floor((Date.now()-new Date(l.foundAt))/3600000);
      const ageDays = ageHrs >= 24 ? Math.floor(ageHrs/24)+'d ago' : ageHrs+'h ago';
      return `<div style="background:white;border:1px solid #e9d5ff;border-radius:8px;padding:11px;margin-bottom:7px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:4px">
        <b style="font-size:12px;color:#111">${l.serviceEmoji||'🔨'} ${l.title}</b>
        <span style="font-size:10px;color:#9333ea;font-weight:700;background:#fdf4ff;padding:2px 7px;border-radius:5px">⏰ ${ageDays} — not called yet</span>
      </div>
      <p style="font-size:11px;color:#555;margin:0 0 6px;line-height:1.5">${l.snippet}</p>
      ${l.contactHint?`<div style="font-size:11px;color:#059669;font-weight:600;margin-bottom:5px">📧 ${l.contactHint}</div>`:''}
      ${l.url?`<a href="${l.url}" style="font-size:10px;color:#2563eb;word-break:break-all;display:block;margin-bottom:6px">${l.url}</a>`:''}
      <div style="background:#fdf4ff;border-radius:6px;padding:8px;font-size:11px;color:#4c1d95;line-height:1.6">
        <b>Say:</b> ${script.message.split('\n')[0]}
      </div>
    </div>`;}).join('')}
    ${needFollowUp.length>5?`<div style="text-align:center;font-size:11px;color:#9333ea;margin-top:6px">...and ${needFollowUp.length-5} more waiting</div>`:''}
  </div>`:''}
  ${catBlocks}`}

<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;margin-bottom:12px;font-size:12px;color:#166534;line-height:1.9">
  <b>💡 Dean's Daily Playbook — Money Makers First:</b><br>
  🛰️ Starlink leads: CALL FIRST — ask "How much do you pay for internet monthly?" Starlink saves most people money AND is faster<br>
  📶 WiFi/networking leads: Quick $150-300 job — extend to shop/barn/garage, run ethernet, set up mesh<br>
  🏠 Smart home leads: $75-200/device — cameras, doorbells, thermostats, locks. Easy installs, high value<br>
  🔥 Hot leads: Call within the hour — they are actively shopping right now<br>
  📡 HughesNet/Viasat leads: Ask "How much do you pay monthly?" — Starlink is often cheaper AND faster<br>
  🏠 New homeowner leads: They have a whole list of things to do — big recurring customer opportunity<br>
  🤠 Ranch leads: Big properties = big jobs + they know 10 other ranchers who need work<br>
  ⛈️ Storm damage: Urgent + insurance often pays — go today if you can<br>
  💻 Virtual leads: $25-50 video call from anywhere — zero gas, easy upsell to in-person<br>
  🏪 Business leads: Repeat work + referrals — worth a follow-up even if no reply<br>
  📋 Cold leads: Follow up in 3-5 days — they're often still deciding
</div>

<div style="text-align:center;font-size:11px;color:#888;background:white;border-radius:10px;padding:14px;line-height:2">
  <b>${COMPANY}</b> · <a href="tel:${PHONE}">${PHONE}</a> · <a href="https://${WEBSITE}">${WEBSITE}</a><br>
  Pittsburg TX 75686 · East TX · ArkLaTex · OK · All Texas · Neighboring States<br>
  50+ Service Categories · HughesNet/Viasat · New Homeowners · Ranchers · Businesses · Storm Damage<br>
  Facebook · Nextdoor · Craigslist · Angi · Thumbtack · Yelp · Twitter<br>
  🔥 Hot leads = instant email · ☀️ Next digest tomorrow 8am Central
</div>
</body></html>`;

  const subject = recent.length
    ? `☀️ ${recent.length} leads — ${hot.length}🔥hot · ${internet.length}📡internet · ${newHome.length}🏠home · ${ranch.length}🤠ranch · ${biz.length}🏪biz · ${storm.length}⛈️storm | ${today}`
    : `☀️ Good Morning Dean — Scanner running, no leads yet | ${today}`;

  await sendEmail(t, html, subject);
  console.log(`✅ Digest sent. ${recent.length} leads (${hot.length}🔥 ${warm.length}⚡ ${cold.length}cold).`);
}

async function sendEmail(transport, html, subject) {
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  if (!to) { console.warn('⚠️  No NOTIFY_EMAIL set'); return; }
  try {
    await transport.sendMail({ from:`"Dean's Leads 🔨" <${process.env.GMAIL_USER}>`, to, subject, html });
    console.log(`✅ Email sent: ${to}`);
  } catch(e) { console.error(`❌ Email failed:`, e.message); }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const LEADS_FILE = path.join(__dirname, 'leads.json');
let existing = [];
try { existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch {}

async function pushToGoogleSheet(lead) {
  if (!process.env.GOOGLE_SHEET_WEBHOOK) return;
  try {
    await fetch(process.env.GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toLocaleDateString(),
        title: lead.title || '',
        service: lead.service || '',
        snippet: lead.snippet || '',
        urgency: lead.urgency || '',
        value: lead.estimatedJobValue || '',
        location: lead.location || '',
        contact: lead.contactHint || '',
        url: lead.url || ''
      })
    });
  } catch (e) {
    console.log(`  ⚠️ Failed to push to Google Sheet: ${e.message}`);
  }
}

(async () => {
  console.log(`\n🔨 DEAN'S V6 MAXIMUM OVERDRIVE — Mode: ${RUN_MODE.toUpperCase()}`);
  console.log(`📍 ${BASE} | 50+ Services | FREE: Groq LLM + Tavily Search | No billing needed`);
  console.log(`📅 ${new Date().toISOString()}\n`);

  if (RUN_MODE === 'digest' || RUN_MODE === 'test') {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Sending digest email now...');
      await sendDailyDigest();
    } else {
      console.error('❌ Missing GMAIL_USER or GMAIL_APP_PASSWORD secrets');
    }
    process.exit(0);
  }

  const { zone, region, services } = getThisRunTargets();
  console.log(`🗺️  Zone ${zone.zone} (${zone.label}): ${region.name} [${region.zip}]`);
  console.log(`🛠  ${services.length} services: ${services.map(s=>s.emoji+s.name).join(' · ')}`);
  console.log(`🌐 FB·Nextdoor·Craigslist·Angi·Thumbtack·Yelp·Twitter·Google\n`);

  let allNew = [];
  try {
    for (const svc of services) {
      const results = await scanCombo(zone, region, svc);
      allNew = allNew.concat(results);
    }
  } catch(e) { console.error('Scan error:', e); process.exit(1); }

  const hot  = allNew.filter(l=>l.heat==='hot').length;
  const warm = allNew.filter(l=>l.heat==='warm').length;
  console.log(`\n📊 Found: ${allNew.length} leads (${hot}🔥 ${warm}⚡ ${allNew.length-hot-warm}cold)`);
  if (!allNew.length) { console.log('No leads this cycle.'); process.exit(0); }

  const existingKeys = new Set(existing.map(l=>(l.title||'').toLowerCase().slice(0,50)));
  const fresh = allNew.filter(l=>!existingKeys.has((l.title||'').toLowerCase().slice(0,50)));
  console.log(`✨ ${fresh.length} new (${allNew.length-fresh.length} dupes skipped)`);
  if (!fresh.length) process.exit(0);

  const stamped = fresh.map(l=>({
    ...l,
    id:      `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    foundAt: new Date().toISOString(),
    status:  'new',
  }));

  console.log(`📊 Pushing ${fresh.length} leads to Google Sheets Pipeline...`);
  for (const lead of stamped) {
    await pushToGoogleSheet(lead);
    await new Promise(r => setTimeout(r, 500)); 
  }

  const merged = [...stamped, ...existing].slice(0, 10000);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2));
  console.log(`💾 Saved ${merged.length} total leads`);

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const hotLeads = stamped.filter(l=>l.heat==='hot');
    if (hotLeads.length) {
      console.log(`🔥 Sending instant alert for ${hotLeads.length} hot leads...`);
      try { await sendHotAlert(hotLeads, region); } catch(e) { console.error('Alert error:', e.message); }
    } else {
      console.log(`ℹ️  No hot leads this pass — all saved for 8am digest`);
    }
    const craigslistLeads = stamped.filter(l=>l.url && l.url.includes('craigslist.org'));
    if (craigslistLeads.length) {
      console.log(`📧 Auto-replying to ${craigslistLeads.length} Craigslist leads...`);
      try { await autoReply(craigslistLeads); } catch(e) { console.error('Auto-reply error:', e.message); }
    }
  }

  const hc = stamped.filter(l=>l.heat==='hot').length;
  const wc = stamped.filter(l=>l.heat==='warm').length;
  console.log(`\n✅ Done. ${stamped.length} new leads (${hc}🔥 · ${wc}⚡ · ${stamped.length-hc-wc}cold)`);
})();
