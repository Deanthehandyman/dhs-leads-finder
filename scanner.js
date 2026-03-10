// Dean's Handyman Service LLC — V6 MAXIMUM OVERDRIVE (FREE — Groq + Tavily Search)
// Pittsburg TX 75686 | Spiral from 75686 outward
// 50+ service categories | Angi · Thumbtack · HomeAdvisor · Craigslist · Reddit
// Facebook · Nextdoor · Twitter/X · Google · Yelp · Forums
// HughesNet/Viasat · New Homeowners · Ranchers · Farmers · Businesses
// Mobile Homes · Storm Damage · Veterans · Churches · Lake Houses · RV Parks
// GOAL: Hundreds of leads per day

const fs      = require('fs');
const path    = require('path');

const COMPANY  = "Dean's Handyman Service LLC";
const PHONE    = "281-917-9914";
const WEBSITE  = "deanshandymanservice.me";
const BASE     = "Pittsburg TX 75686";
const RUN_MODE = process.env.RUN_MODE || 'scan';

// ─── ZONES — spiral outward from ZIP 75686 ────────────────────────────────────
const ZONES = [
  {
    zone: 1, label: "Home Base (0-30mi)", weight: 8,
    regions: [
      { name: "Pittsburg TX & Camp County",  zip:"75686", cities:["Pittsburg","Avinger","Lone Star","Linden","Hughes Springs","Daingerfield","Omaha","Naples","Talco","Bogata"] },
      { name: "East Texas Core",             zip:"75701", cities:["Tyler","Longview","Marshall","Henderson","Jacksonville","Kilgore","Gladewater","White Oak","Hallsville","Rusk"] },
      { name: "Deep East Texas",             zip:"75961", cities:["Nacogdoches","Lufkin","Center","Carthage","Jasper","San Augustine","Tenaha","Hemphill","Timpson","Joaquin"] },
      { name: "ArkLaTex TX",                 zip:"75501", cities:["Texarkana TX","Atlanta TX","Mount Pleasant","Sulphur Springs","Paris TX","Clarksville","New Boston","Queen City","De Kalb"] },
      { name: "ArkLaTex AR",                 zip:"71854", cities:["Texarkana AR","Hope AR","El Dorado AR","Camden AR","Magnolia AR","Arkadelphia AR","Hot Springs AR","Gurdon","Nashville AR"] },
      { name: "ArkLaTex LA",                 zip:"71101", cities:["Shreveport LA","Bossier City LA","Minden LA","Ruston LA","Monroe LA","Natchitoches LA","Mansfield LA","Logansport LA","Many LA"] },
      { name: "East TX Lakes & Rural",       zip:"75941", cities:["Gilmer","Mineola","Canton","Lindale","Palestine","Fairfield","Corsicana","Athens","Gun Barrel City","Mabank"] },
    ]
  },
  {
    zone: 2, label: "Regional (30-150mi)", weight: 6,
    regions: [
      { name: "Oklahoma South",    zip:"74701", cities:["Durant OK","Ardmore OK","Broken Bow OK","McAlester OK","Poteau OK","Idabel OK","Hugo OK","Antlers OK","Tishomingo OK"] },
      { name: "Oklahoma Central",  zip:"73101", cities:["Oklahoma City OK","Norman OK","Shawnee OK","Ada OK","Seminole OK","Coalgate OK","Sulphur OK","Pauls Valley OK"] },
      { name: "Oklahoma East",     zip:"74401", cities:["Muskogee OK","Tahlequah OK","Stilwell OK","Sallisaw OK","Fort Smith border OK","Heavener OK","Wilburton OK"] },
      { name: "North Texas",       zip:"75090", cities:["Sherman","Denison","Gainesville","Greenville","Bonham","Paris TX","Clarksville","Honey Grove","Blossom","Deport"] },
      { name: "DFW Rural",         zip:"76086", cities:["Weatherford","Granbury","Cleburne","Corsicana","Waxahachie","Hillsboro","Stephenville","Glen Rose","Mineral Wells","Clifton"] },
      { name: "Central Texas",     zip:"76701", cities:["Waco","Temple","Killeen","Belton","Georgetown","Taylor","Cameron","Rockdale","Hearne","Bryan"] },
    ]
  },
  {
    zone: 3, label: "Texas Statewide", weight: 4,
    regions: [
      { name: "Greater Houston Rural",  zip:"77301", cities:["Conroe","Huntsville","Livingston","Coldspring","Dayton","Liberty","Cleveland","Splendora","New Caney","Huffman"] },
      { name: "Golden Triangle",        zip:"77701", cities:["Beaumont","Port Arthur","Orange","Vidor","Silsbee","Jasper","Woodville","Lumberton","Nederland","Bridge City"] },
      { name: "West Texas",             zip:"79701", cities:["Midland","Odessa","Big Spring","San Angelo","Abilene","Pecos","Fort Stockton","Snyder","Sweetwater","Colorado City"] },
      { name: "South Texas",            zip:"78040", cities:["Laredo","Eagle Pass","Uvalde","Hondo","Cotulla","Pearsall","Carrizo Springs","Crystal City","Dilley","Freer"] },
      { name: "Texas Hill Country",     zip:"78028", cities:["Kerrville","Fredericksburg","Boerne","Comfort","Bandera","Uvalde","Del Rio","Junction","Mason","Llano"] },
      { name: "Texas Panhandle Plains", zip:"79101", cities:["Amarillo","Lubbock","Canyon","Pampa","Borger","Plainview","Levelland","Tahoka","Littlefield","Lamesa"] },
      { name: "Gulf Coast TX",          zip:"77901", cities:["Victoria","Bay City","Port Lavaca","Cuero","Edna","El Campo","Wharton","Richmond","Columbus","Hallettsville"] },
      { name: "San Antonio Rural",      zip:"78006", cities:["Boerne","New Braunfels","Seguin","Pleasanton","Floresville","Pearsall","Castroville","Hondo","Poteet","Jourdanton"] },
    ]
  },
  {
    zone: 4, label: "Neighboring States", weight: 3,
    regions: [
      { name: "Louisiana Statewide",    zip:"71101", cities:["Baton Rouge LA","Lafayette LA","Lake Charles LA","Alexandria LA","Opelousas LA","Hammond LA","Slidell LA","Bogalusa LA"] },
      { name: "Arkansas Statewide",     zip:"72201", cities:["Little Rock AR","Fort Smith AR","Fayetteville AR","Jonesboro AR","Pine Bluff AR","Conway AR","Russellville AR","Searcy AR"] },
      { name: "New Mexico East",        zip:"88201", cities:["Hobbs NM","Carlsbad NM","Roswell NM","Alamogordo NM","Clovis NM","Artesia NM","Lovington NM","Portales NM"] },
    ]
  },
  {
    zone: 5, label: "National Virtual", weight: 3,
    regions: [
      { name: "Rural South",     zip:"38601", cities:["Rural Mississippi","Rural Alabama","Rural Tennessee","Rural Kentucky","Rural Georgia","Rural South Carolina"] },
      { name: "Rural Midwest",   zip:"64501", cities:["Rural Missouri","Rural Kansas","Rural Nebraska","Rural Iowa","Rural Indiana","Rural Illinois"] },
      { name: "Rural West",      zip:"87501", cities:["Rural New Mexico","Rural Colorado","Rural Utah","Rural Nevada","Rural Arizona","Rural Wyoming"] },
      { name: "Rural Southeast", zip:"29601", cities:["Rural North Carolina","Rural Virginia","Rural West Virginia","Rural Ohio","Rural Pennsylvania"] },
    ]
  },
];

const ROTATION = [];
ZONES.forEach(z=>{ for(let i=0;i<z.weight;i++) ROTATION.push(z); });

function getThisRunTargets() {
  const slot   = Math.floor(Date.now() / (30 * 60 * 1000));
  const zone   = ROTATION[slot % ROTATION.length];
  const region = zone.regions[slot % zone.regions.length];
  const svcs   = [];
  for(let i=0;i<3;i++) svcs.push(SERVICES[(slot*7 + i*11) % SERVICES.length]);
  // Deduplicate
  const seen = new Set();
  return { zone, region, services: svcs.filter(s=>{ if(seen.has(s.name)) return false; seen.add(s.name); return true; }) };
}

// ─── 50+ SERVICE CATEGORIES ───────────────────────────────────────────────────
const SERVICES = [

  // ══ INTERNET & STARLINK ══════════════════════════════════════════════════════
  {
    name:"Starlink Installation", emoji:"🛰️", virtual:false, category:"Internet",
    searches:[
      '"starlink" install OR mount OR setup Texas OR Arkansas OR Louisiana OR Oklahoma need help',
      '"just got starlink" OR "starlink arrived" OR "starlink kit" install setup help',
      '"starlink" "need someone" OR "need help" OR "hire" install mount 2025 OR 2026',
      'site:reddit.com/r/Starlink "installer" OR "installation" OR "help installing" 2025',
      'site:reddit.com/r/Starlink "just got" OR "finally got" OR "arrived today" mount help',
      'site:craigslist.org Texas OR Arkansas OR Louisiana OR Oklahoma "starlink" install',
      '"starlink installer" Texas OR Texarkana OR Tyler OR Shreveport affordable local',
      'site:facebook.com "starlink" install help Texas OR Arkansas OR Louisiana 2025',
      '"starlink" "pole mount" OR "roof mount" OR "J-mount" OR "tree mount" install Texas',
      '"starlink" confused OR hard OR difficult install setup help 2025',
      'site:nextdoor.com "starlink" install OR setup help recommend',
      '"starlink" rural Texas OR Oklahoma OR Arkansas internet setup affordable',
      '"starlink RV" OR "starlink portable" install setup help',
      '"starlink business" OR "starlink priority" install Texas help',
      'site:thumbtack.com "starlink installation" Texas OR nearby',
      'site:angi.com "starlink installation" Texas request',
    ],
  },
  {
    name:"HughesNet Switchers → Starlink", emoji:"😤", virtual:false, category:"Internet",
    searches:[
      '"hughesnet" "hate" OR "terrible" OR "slow" OR "awful" Texas OR Arkansas OR Louisiana OR Oklahoma 2025',
      '"hughesnet" "switching to starlink" OR "switched to starlink" OR "worth switching"',
      'site:reddit.com "hughesnet" "starlink" OR "switching" OR "alternatives" 2025 OR 2026',
      '"hughesnet" "data cap" OR "throttled" OR "FAP" OR "buffering" frustrated',
      '"leaving hughesnet" OR "cancel hughesnet" OR "done with hughesnet" Texas',
      '"stuck with hughesnet" OR "tired of hughesnet" OR "hughesnet sucks" rural',
      'site:reddit.com/r/Rural_Internet "hughesnet" problem OR terrible OR slow OR awful 2025',
      '"hughesnet" "$100" OR "$150" OR "$200" a month "not worth it" OR "too expensive"',
      '"hughesnet" complaint Texas OR Arkansas OR Oklahoma forum 2025 2026',
      '"hughesnet" "need something better" OR "any alternatives" rural',
      'site:twitter.com "hughesnet" terrible OR slow OR hate OR cancel 2025',
      '"hughesnet" vs "starlink" Texas rural which is better 2025',
      'site:facebook.com "hughesnet" "switching" OR "recommendations" Texas 2025',
      '"hughesnet" OR "hughes network" rural internet complaint community forum Texas',
      '"gen5" hughesnet slow Texas OR rural alternative starlink',
    ],
  },
  {
    name:"Viasat Switchers → Starlink", emoji:"😡", virtual:false, category:"Internet",
    searches:[
      '"viasat" "hate" OR "terrible" OR "slow" OR "cancel" Texas OR Arkansas OR Oklahoma 2025',
      '"viasat" "switching to starlink" OR "switched to starlink" OR "worth it"',
      'site:reddit.com "viasat" "starlink" switch OR switching OR better 2025 OR 2026',
      '"viasat" "data cap" OR "throttled" OR "buffering" frustrated rural',
      '"leaving viasat" OR "cancel viasat" OR "done with viasat"',
      '"stuck with viasat" OR "tired of viasat" OR "viasat sucks"',
      'site:reddit.com/r/Rural_Internet "viasat" terrible OR slow OR problem 2025',
      '"viasat" "$150" OR "$200" OR "$300" "not worth it" OR "too expensive"',
      '"exede" OR "wildblue" OR "viasat" rural internet complaint Texas 2025',
      '"viasat" "need something better" OR "alternatives" rural Texas',
      'site:twitter.com "viasat" terrible OR slow OR hate OR cancel 2025',
      '"viasat" vs "starlink" Texas rural comparison 2025',
      'site:facebook.com "viasat" switching OR recommendations Texas 2025',
      '"viasat" contract OR "early termination" Texas stuck alternatives',
      '"ViaSat-3" OR "viasat unlimited" still slow rural Texas problem',
    ],
  },
  {
    name:"Rural Internet Complaints", emoji:"🌾", virtual:false, category:"Internet",
    searches:[
      '"rural internet" Texas OR Arkansas OR Louisiana OR Oklahoma problem OR terrible OR slow 2025',
      '"no good internet" OR "no broadband" rural Texas help options 2025',
      '"satellite internet" OR "fixed wireless" rural Texas options compare',
      'site:reddit.com "rural Texas" OR "rural Oklahoma" internet slow terrible options 2025',
      '"no fiber" OR "no cable" rural Texas internet what options',
      '"cell internet" OR "hotspot" rural Texas "not enough" OR "throttled" OR "too slow"',
      '"DSL too slow" OR "DSL terrible" rural Texas alternative options',
      '"off grid internet" OR "remote property" internet Texas options 2025',
      'site:reddit.com/r/Rural_Internet Texas OR Oklahoma OR Arkansas 2025',
      '"Elon Musk internet" OR "space internet" rural Texas help setup',
      '"internet options" rural Texas ZIP OR county 2025',
      '"T-Mobile Home Internet" OR "Verizon Home Internet" rural TX not working',
      '"no internet" new construction OR new home Texas rural 2025',
      'site:facebook.com Texas rural internet group "starlink" OR "recommendations"',
      '"work from home" rural Texas internet bad slow options',
    ],
  },
  {
    name:"Business & Oilfield Starlink", emoji:"💼", virtual:false, category:"Internet",
    searches:[
      '"starlink business" Texas install setup help affordable',
      '"starlink for business" OR "starlink enterprise" OR "starlink priority" Texas',
      '"business internet" rural Texas OR Oklahoma options starlink',
      '"construction site internet" OR "job site internet" Texas starlink',
      '"restaurant" OR "bar" OR "shop" rural Texas internet starlink setup',
      '"oilfield" OR "oil field" OR "pump site" internet Texas starlink',
      '"ranch" OR "farm" internet Texas starlink business setup',
      '"starlink" "multiple locations" OR "roam" OR "portable" Texas business',
      '"campground" OR "RV park" OR "marina" internet Texas starlink setup',
      '"church" OR "school" rural Texas internet starlink affordable',
    ],
  },

  // ══ NEW HOMEOWNERS ════════════════════════════════════════════════════════════
  {
    name:"Just Bought a House", emoji:"🏠", virtual:false, category:"New Homeowner",
    searches:[
      '"just bought a house" OR "just closed" Texas need repairs handyman 2025',
      '"new homeowner" Texas need help fix repair work done 2025',
      '"first time homeowner" Texas repairs handyman affordable help',
      'site:reddit.com "just bought a house" Texas handyman repairs 2025 OR 2026',
      'site:reddit.com/r/FirstTimeHomeBuyer Texas repairs list help 2025',
      '"fixer upper" Texas need help repairs affordable handyman',
      '"home inspection" repairs Texas fix affordable before moving in',
      '"just closed on" Texas house need work handyman repairs',
      '"new to Texas" OR "moved to Texas" house need handyman help',
      'site:nextdoor.com Texas "just moved in" OR "new neighbor" handyman recommend',
      '"punch list" OR "to do list" new house Texas handyman',
      '"new construction" Texas need work OR repairs OR finishing handyman',
      'site:reddit.com/r/homeowners Texas repairs help advice 2025 2026',
      'site:facebook.com Texas "just bought a house" need handyman recommendations',
      '"move in ready" OR "moving in" Texas repairs handyman need hire',
    ],
  },
  {
    name:"Pre-Sale Home Repairs", emoji:"🏡", virtual:false, category:"Real Estate",
    searches:[
      '"selling my house" OR "listing soon" Texas repairs fix handyman affordable',
      '"before listing" OR "before selling" Texas repairs handyman fix up',
      '"home inspection" failed OR issues Texas fix repair sell',
      '"curb appeal" repairs OR painting Texas selling house affordable',
      'site:reddit.com Texas "selling house" repairs handyman 2025',
      '"real estate agent said" OR "realtor recommended" repairs Texas affordable',
      '"seller repairs" OR "buyer requested" fix Texas affordable fast',
      '"flipping" OR "flip house" Texas handyman repairs affordable quick',
      '"FSBO" OR "for sale by owner" Texas repairs handyman needed',
      '"staging" repairs OR updates Texas house sell fast affordable',
      '"coming soon" listing Texas house repairs need',
      'site:facebook.com Texas "selling house" need repairs recommendations',
      '"cash buyer" Texas house as-is repairs still needed',
      '"fix before selling" OR "update before listing" Texas house handyman',
      '"days on market" OR "price reduction" Texas house fix up handyman',
    ],
  },
  {
    name:"Rental & Investment Properties", emoji:"🏘️", virtual:false, category:"Real Estate",
    searches:[
      '"rental property" repairs OR maintenance Texas hire handyman affordable',
      '"landlord" repairs Texas affordable handyman need fast',
      '"tenant damage" OR "tenant repair" Texas landlord handyman',
      '"property management" repairs Texas affordable contractor handyman',
      'site:reddit.com "landlord" Texas repairs handyman affordable 2025',
      '"investment property" OR "rental house" fix repair Texas affordable',
      '"Airbnb" OR "VRBO" OR "short term rental" repairs Texas handyman',
      '"between tenants" OR "tenant turnover" repairs Texas handyman fast',
      '"property manager" Texas repairs handyman need affordable fast',
      '"real estate investor" Texas repairs handyman affordable reliable',
      '"Section 8" OR "HUD" Texas repairs required landlord handyman',
      '"rental inspection" OR "code violation" Texas repairs affordable',
      '"eviction" OR "vacant property" Texas repairs clean out handyman',
      '"rehab" OR "renovation" Texas rental property affordable handyman',
      'site:reddit.com/r/realestateinvesting Texas repairs handyman 2025',
    ],
  },
  {
    name:"Mobile & Manufactured Homes", emoji:"🚐", virtual:false, category:"New Homeowner",
    searches:[
      '"mobile home" OR "manufactured home" repairs Texas affordable handyman',
      '"mobile home" roof OR skirting OR steps OR deck Texas repair',
      '"double wide" OR "single wide" OR "triple wide" repairs Texas handyman',
      '"trailer" repairs Texas affordable handyman need',
      'site:reddit.com "mobile home" OR "manufactured home" repairs Texas 2025',
      '"mobile home park" repairs Texas handyman affordable',
      '"HUD home" OR "repo home" OR "bank owned" Texas repairs handyman',
      '"skirting repair" OR "underpinning" OR "tie downs" mobile home Texas',
      '"mobile home" HVAC OR electrical OR plumbing Texas affordable',
      'site:facebook.com Texas "mobile home" repairs need handyman recommendations',
      '"modular home" repairs OR finishing Texas affordable',
      '"land home package" Texas repairs handyman need',
      '"repo mobile home" OR "used mobile home" fix up Texas affordable',
    ],
  },
  {
    name:"Homesteaders & Self-Sufficient Living", emoji:"🌱", virtual:false, category:"Ranch/Farm",
    searches:[
      '"homestead" Texas repairs OR build OR install help handyman',
      '"off grid" Texas home repairs build help affordable',
      '"tiny house" OR "container home" Texas repairs install help',
      '"barndominium" Texas repairs OR finishing OR plumbing handyman',
      '"solar" install OR repair Texas homestead affordable',
      'site:reddit.com "homesteading" Texas help repairs build 2025',
      '"rainwater collection" OR "water well" Texas repair install help',
      '"composting toilet" OR "septic" Texas repair install help',
      '"greenhouse" OR "chicken coop" build Texas affordable',
      '"root cellar" OR "storm shelter" Texas build install help',
      '"self sufficient" Texas home repairs build help',
      'site:facebook.com Texas homesteading group repairs help 2025',
    ],
  },

  // ══ RANCHERS & FARMERS ════════════════════════════════════════════════════════
  {
    name:"Ranch & Farm Repairs", emoji:"🤠", virtual:false, category:"Ranch/Farm",
    searches:[
      '"ranch" OR "farm" handyman repairs Texas hire need affordable 2025',
      '"barn repair" OR "barn door" OR "barn roof" Texas fix handyman',
      '"cattle guard" OR "stock tank" OR "water trough" repair Texas',
      '"ranch house" repairs Texas affordable handyman hire',
      '"equipment shed" OR "hay barn" repair Texas affordable',
      'site:reddit.com Texas "ranch" OR "farm" handyman repairs help 2025',
      '"agricultural" building OR structure repair Texas handyman',
      '"rural property" repairs OR maintenance Texas hire someone affordable',
      '"acreage" OR "large property" Texas repairs handyman affordable',
      'site:facebook.com Texas ranch OR farm need handyman repairs group',
      '"horse barn" OR "horse stall" repair Texas affordable handyman',
      '"feed room" OR "tack room" repair Texas handyman',
      '"working ranch" Texas need handyman repairs maintenance',
      '"hog barn" OR "chicken house" OR "poultry house" repair Texas',
      'site:craigslist.org Texas farm OR ranch repair handyman needed',
    ],
  },
  {
    name:"Ranch Fencing", emoji:"🌵", virtual:false, category:"Ranch/Farm",
    searches:[
      '"ranch fence" OR "farm fence" repair OR install Texas hire affordable',
      '"barbed wire" fence repair OR install Texas need someone',
      '"high fence" OR "deer fence" Texas build repair install',
      '"cattle fence" OR "horse fence" OR "hog fence" Texas repair install',
      '"pipe fence" OR "pipe corral" OR "pipe gate" Texas install repair',
      '"t-post" OR "wooden post" OR "corner post" fence Texas help',
      '"electric fence" install OR repair Texas ranch affordable',
      '"game fence" OR "wildlife fence" Texas install repair',
      '"perimeter fence" Texas rural large acreage install repair',
      'site:craigslist.org Texas fencing ranch farm install repair needed',
      '"fence row" clear OR repair Texas ranch help',
      '"cross fence" OR "cross fencing" Texas ranch install',
      '"field fence" OR "woven wire" Texas install repair',
      'site:facebook.com Texas ranch fence repair install recommendation need',
    ],
  },
  {
    name:"Metal Buildings & Ag Structures", emoji:"🏗️", virtual:false, category:"Ranch/Farm",
    searches:[
      '"metal building" OR "steel building" Texas install repair handyman',
      '"pole barn" build OR repair Texas affordable hire',
      '"shop building" OR "workshop" OR "man cave" Texas build affordable',
      '"carport" OR "RV cover" OR "boat cover" Texas build install',
      '"barndominium" Texas build OR repair OR finish affordable',
      'site:craigslist.org Texas "metal building" OR "pole barn" install needed',
      '"ag building" OR "agriculture building" Texas repair install',
      '"quonset hut" OR "round building" Texas repair install help',
      '"spray foam" OR "insulation" metal building Texas handyman',
      '"concrete floor" metal building Texas pour affordable',
      '"lean-to" OR "loafing shed" Texas build install affordable',
      'site:facebook.com Texas metal building shop barn need build help',
    ],
  },
  {
    name:"Hunting Camps & Cabins", emoji:"🦌", virtual:false, category:"Ranch/Farm",
    searches:[
      '"hunting cabin" OR "hunting camp" repair Texas affordable',
      '"deer blind" OR "deer stand" build OR repair Texas help',
      '"hunting lease" OR "hunting property" repairs Texas handyman',
      '"hunting cabin" plumbing OR electrical OR roof Texas fix',
      '"game cleaning station" build Texas affordable handyman',
      'site:reddit.com Texas "hunting cabin" OR "hunting camp" repair build 2025',
      '"duck camp" OR "fishing cabin" repairs Texas affordable',
      '"hunting house" OR "camp house" fix up Texas handyman',
      '"shooting house" OR "blind" build install Texas affordable',
      'site:facebook.com Texas hunting cabin camp repair need help',
    ],
  },
  {
    name:"Lake Houses & Vacation Properties", emoji:"⛵", virtual:false, category:"Real Estate",
    searches:[
      '"lake house" repairs OR maintenance Texas affordable handyman',
      '"lake property" Texas repairs fix up handyman',
      '"boat dock" repair OR build Texas affordable',
      '"lake cabin" fix up OR repair Texas handyman',
      'Texas lakes "lake home" repairs need handyman affordable',
      'site:reddit.com Texas "lake house" repairs handyman 2025',
      '"lake fork" OR "Toledo Bend" OR "Sam Rayburn" OR "Caddo Lake" repairs handyman',
      '"weekend house" OR "getaway" Texas repairs handyman affordable',
      '"waterfront" Texas property repairs handyman affordable',
      'site:facebook.com Texas lake house repairs handyman recommend need',
      '"dock repair" OR "boat lift" install Texas affordable',
      '"pier repair" OR "bulkhead" Texas lake affordable handyman',
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
      'site:craigslist.org Texas "commercial" handyman OR maintenance needed',
      '"business owner" Texas need handyman repairs maintenance affordable',
      '"storefront" repairs OR renovation Texas affordable handyman',
      '"gas station" OR "convenience store" repairs Texas handyman',
      '"salon" OR "barbershop" repairs OR renovation Texas affordable',
      '"gym" OR "fitness" repairs OR maintenance Texas handyman affordable',
      '"daycare" OR "childcare" repairs OR safety Texas handyman affordable',
      '"auto shop" OR "car dealership" repairs maintenance Texas handyman',
      '"warehouse" OR "storage facility" repairs Texas handyman',
      'site:facebook.com Texas "small business" repairs handyman need recommendation',
    ],
  },
  {
    name:"Churches & Nonprofits", emoji:"⛪", virtual:false, category:"Business",
    searches:[
      '"church" repairs OR maintenance Texas affordable handyman',
      '"nonprofit" OR "ministry" repairs Texas affordable handyman help',
      '"small church" OR "rural church" repairs Texas handyman affordable',
      '"church building" repairs OR renovation Texas need help',
      '"fellowship hall" OR "church hall" repairs Texas affordable',
      'site:reddit.com Texas "church" repairs handyman affordable 2025',
      '"mission" OR "outreach center" repairs Texas handyman affordable',
      '"VFW" OR "American Legion" OR "Elks" repairs Texas affordable',
      '"community center" repairs Texas handyman affordable',
      'site:facebook.com Texas church repairs maintenance need affordable handyman',
      '"food bank" OR "shelter" repairs Texas affordable handyman',
      '"school" repairs Texas affordable handyman maintenance',
    ],
  },
  {
    name:"Oilfield & Energy Services", emoji:"⛽", virtual:false, category:"Business",
    searches:[
      '"oilfield" OR "oil field" handyman repairs Texas hire affordable',
      '"pump jack" OR "wellhead" building OR housing repair Texas',
      '"man camp" OR "worker housing" OR "frac camp" repairs Texas',
      '"Permian Basin" OR "Eagle Ford" OR "Haynesville" handyman repair services',
      '"energy company" OR "oil company" facility repairs Texas affordable',
      '"tank battery" OR "storage tank" housing repair Texas',
      '"compressor station" building repair Texas handyman',
      '"solar farm" OR "wind farm" facility repairs Texas handyman',
      'site:craigslist.org Texas "oilfield" handyman needed repair',
      '"saltwater disposal" OR "SWD" facility repair Texas',
    ],
  },
  {
    name:"RV Parks, Campgrounds & Marinas", emoji:"🏕️", virtual:false, category:"Business",
    searches:[
      '"RV park" repairs OR maintenance Texas affordable handyman',
      '"campground" repairs OR maintenance Texas handyman',
      '"marina" repairs OR maintenance Texas affordable handyman',
      '"RV resort" OR "glamping" facility repairs Texas handyman',
      'site:reddit.com Texas "RV park" repairs handyman 2025',
      '"KOA" OR "Jellystone" OR "Good Sam" repairs Texas handyman',
      '"tent camping" facilities repair Texas handyman affordable',
      '"picnic shelter" OR "pavilion" repair Texas affordable handyman',
      '"shower house" OR "bathhouse" campground repair Texas',
      'site:facebook.com Texas RV park campground repairs need handyman',
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
      '"flooding" OR "flood damage" repairs Texas affordable handyman',
      'site:reddit.com Texas "storm damage" repairs handyman 2025',
      '"after the storm" OR "damage from storm" Texas repairs need',
      '"insurance claim" repairs Texas affordable contractor',
      'site:nextdoor.com Texas "storm damage" OR "hail damage" repairs recommend',
      '"freeze damage" OR "frozen pipes" Texas repair affordable 2025',
      '"hurricane" OR "tropical storm" Texas repairs handyman affordable',
      '"power outage damage" repairs Texas handyman affordable',
      'site:facebook.com Texas storm damage repairs recommendation need',
    ],
  },
  {
    name:"Emergency Repairs — Urgent", emoji:"🚨", virtual:false, category:"Storm",
    searches:[
      '"emergency repair" Texas handyman urgent need fast',
      '"roof leak" emergency Texas fix fast affordable',
      '"water leak" OR "pipe burst" emergency Texas fix ASAP',
      '"door kicked in" OR "broken window" Texas emergency repair',
      '"power out" OR "electrical emergency" Texas affordable fast',
      'site:craigslist.org Texas "emergency" repairs handyman needed ASAP',
      '"urgent" handyman repairs Texas affordable fast reliable',
      '"same day" repairs Texas handyman affordable',
      '"broken" OR "damaged" Texas house need fixed immediately',
      '"can\'t wait" OR "need it done today" OR "ASAP" Texas repairs handyman',
    ],
  },

  // ══ VETERANS & MILITARY ═══════════════════════════════════════════════════════
  {
    name:"Veterans & Military Homeowners", emoji:"🇺🇸", virtual:false, category:"Specialty",
    searches:[
      '"veteran" OR "military" homeowner Texas repairs affordable handyman',
      '"VA loan" Texas new home repairs handyman affordable',
      '"disabled veteran" Texas home repairs accessible affordable',
      '"military family" Texas moving repairs handyman affordable',
      '"PCS" OR "permanent change of station" Texas home repairs handyman',
      'site:reddit.com "veteran" Texas home repairs handyman affordable 2025',
      '"Fort Hood" OR "Fort Bliss" OR "Fort Sam" Texas area repairs affordable',
      '"Camp Shelby" OR "Barksdale" OR "Tinker" area repairs handyman',
      '"GI Bill" OR "veteran benefits" Texas home repairs affordable',
      '"Purple Heart" OR "disabled vet" Texas accessible home modifications',
    ],
  },

  // ══ GENERAL HANDYMAN ══════════════════════════════════════════════════════════
  {
    name:"General Handyman & Repairs", emoji:"🔨", virtual:false, category:"Handyman",
    searches:[
      '"need a handyman" Texas OR Arkansas OR Louisiana OR Oklahoma 2025',
      '"looking for handyman" East Texas OR ArkLaTex OR Texarkana OR Shreveport',
      'site:craigslist.org Texas OR Arkansas OR Louisiana "handyman" needed wanted help',
      'site:nextdoor.com "handyman" Texas recommend need hire 2025',
      'site:reddit.com Texas "handyman" hire recommend affordable 2025',
      '"home repairs" OR "odd jobs" OR "honey do list" Texas hire affordable',
      'site:facebook.com Texas "need a handyman" OR "handyman recommendation" 2025',
      'site:angi.com "handyman" Texas job request 2025',
      'site:thumbtack.com "handyman" Tyler OR Longview OR Texarkana OR Shreveport',
      '"reliable handyman" Texas recommendation need help affordable',
      '"handyman services" East Texas OR Texarkana OR Tyler OR Longview affordable 2025',
      'site:yelp.com "need handyman" Texas reviews 2025',
      '"fix it all" OR "jack of all trades" Texas hire affordable handyman',
      '"retired contractor" OR "experienced handyman" Texas hire',
      '"quick fix" OR "small repairs" Texas handyman affordable',
    ],
  },
  {
    name:"TV Mounting", emoji:"📺", virtual:false, category:"Handyman",
    searches:[
      '"mount TV" OR "TV mounting" OR "hang TV" Texas need help hire affordable',
      '"TV wall mount" Texas service affordable install',
      'site:craigslist.org Texas "TV mount" OR "mount TV" OR "hang TV"',
      'site:nextdoor.com Texas "TV" mount hire recommend need 2025',
      '"65 inch" OR "75 inch" OR "85 inch" OR "big TV" mount Texas help hire',
      '"above fireplace" OR "above mantle" TV mount install Texas',
      '"new TV" OR "got a TV" need mounted Texas affordable handyman',
      'site:facebook.com Texas "TV mounting" OR "mount my TV" need help hire',
      '"tilt mount" OR "full motion mount" OR "articulating mount" Texas install',
      'site:thumbtack.com "TV mounting" Texas near',
      'site:angi.com "TV mounting" Texas',
      '"cord concealment" OR "hide TV wires" Texas handyman affordable',
    ],
  },
  {
    name:"Plumbing Repairs", emoji:"🚿", virtual:false, category:"Handyman",
    searches:[
      '"need a plumber" OR "plumber needed" Texas OR Arkansas OR Louisiana OR Oklahoma',
      '"leaking faucet" OR "dripping faucet" OR "faucet drip" Texas fix help',
      '"running toilet" OR "toilet runs" OR "phantom flush" Texas fix',
      '"clogged drain" OR "slow drain" OR "backed up" Texas fix help',
      '"water heater" repair OR replace OR not working Texas affordable',
      'site:craigslist.org Texas OR Arkansas OR Louisiana "plumber" OR "plumbing" help',
      'site:nextdoor.com Texas "plumber" recommend need affordable',
      '"pipe leak" OR "burst pipe" OR "water leak" Texas repair fast',
      '"outdoor faucet" OR "hose bib" OR "spigot" repair Texas',
      '"low water pressure" Texas plumber fix help affordable',
      '"water softener" install OR repair Texas affordable',
      '"well pump" OR "pressure tank" repair Texas affordable',
      'site:thumbtack.com "plumber" OR "plumbing" Texas near affordable',
      'site:angi.com "plumbing" Texas job request',
      '"sump pump" install OR repair Texas affordable handyman',
    ],
  },
  {
    name:"Electrical Work", emoji:"⚡", virtual:false, category:"Handyman",
    searches:[
      '"need electrician" OR "electrician needed" Texas affordable',
      '"outlet not working" OR "dead outlet" OR "tripping breaker" Texas fix',
      '"ceiling fan install" OR "ceiling fan replacement" Texas hire affordable',
      '"light fixture install" OR "light fixture replacement" Texas',
      'site:craigslist.org Texas "electrical" OR "electrician" needed affordable',
      'site:nextdoor.com Texas "electrician" recommend need affordable',
      '"generator hookup" OR "generator install" OR "transfer switch" Texas',
      '"outdoor lighting" install OR repair Texas affordable handyman',
      '"EV charger" OR "electric car charger" install Texas home affordable',
      '"panel upgrade" OR "breaker box" OR "electrical panel" Texas affordable',
      '"GFCI outlet" OR "220 outlet" OR "240 outlet" install Texas',
      '"security light" OR "motion sensor light" install Texas affordable',
      'site:thumbtack.com "electrician" Texas near affordable',
      'site:angi.com "electrical" Texas job request',
      '"USB outlet" OR "smart outlet" install Texas handyman affordable',
    ],
  },
  {
    name:"Pressure Washing", emoji:"💦", virtual:false, category:"Handyman",
    searches:[
      '"pressure washing" OR "power washing" Texas need quote hire affordable',
      '"dirty driveway" OR "stained concrete" OR "oil stain" driveway Texas',
      '"moldy siding" OR "algae siding" OR "dirty siding" Texas wash clean',
      'site:craigslist.org Texas "pressure washing" needed service affordable',
      'site:nextdoor.com Texas "pressure washing" recommend need hire',
      '"house washing" OR "soft wash" OR "roof washing" Texas affordable',
      '"deck cleaning" OR "fence cleaning" OR "patio cleaning" Texas',
      '"commercial pressure washing" Texas business affordable',
      '"before selling" OR "curb appeal" pressure wash Texas house',
      '"fleet washing" OR "truck washing" OR "equipment washing" Texas',
      'site:thumbtack.com "pressure washing" Texas near affordable',
      'site:angi.com "pressure washing" Texas',
      '"mold removal" OR "mildew removal" Texas exterior wash',
      '"dumpster pad" OR "parking lot" cleaning Texas affordable',
    ],
  },
  {
    name:"Painting — Interior & Exterior", emoji:"🎨", virtual:false, category:"Handyman",
    searches:[
      '"need painter" OR "painter needed" OR "house painting" Texas hire affordable',
      '"interior painting" OR "exterior painting" Texas affordable quote',
      'site:craigslist.org Texas "painter" OR "painting" needed hire affordable',
      'site:nextdoor.com Texas "painter" recommend need affordable',
      '"paint my house" OR "paint rooms" OR "paint walls" Texas hire',
      '"before selling" OR "curb appeal" paint Texas affordable',
      '"cabinet painting" OR "kitchen cabinet" paint Texas refinish',
      '"popcorn ceiling" remove OR paint Texas handyman affordable',
      '"trim painting" OR "accent wall" OR "color consultation" Texas',
      'site:thumbtack.com "painter" OR "painting" Texas near affordable',
      'site:angi.com "painting" Texas job request',
      '"staining" OR "stain deck" OR "stain fence" Texas affordable',
      '"epoxy floor" OR "garage floor" paint Texas affordable',
      '"spray painting" OR "spray finish" Texas handyman affordable',
    ],
  },
  {
    name:"Drywall Repair & Texture", emoji:"🧱", virtual:false, category:"Handyman",
    searches:[
      '"drywall repair" Texas need hire affordable',
      '"hole in wall" OR "drywall patch" OR "sheetrock repair" Texas fix',
      'site:craigslist.org Texas "drywall" OR "sheetrock" repair needed',
      'site:nextdoor.com Texas "drywall" recommend need affordable',
      '"water damage" drywall OR ceiling Texas repair handyman',
      '"texture match" OR "knockdown texture" OR "orange peel texture" Texas',
      '"smooth ceiling" OR "skim coat" Texas drywall handyman affordable',
      '"crack repair" drywall OR plaster Texas handyman',
      'site:thumbtack.com "drywall" Texas near affordable',
      '"popcorn ceiling" repair OR removal Texas affordable',
      '"access panel" OR "drywall opening" Texas repair handyman',
    ],
  },
  {
    name:"Flooring Installation & Repair", emoji:"🪵", virtual:false, category:"Handyman",
    searches:[
      '"flooring installation" OR "floor install" Texas hire affordable',
      '"LVP" OR "luxury vinyl plank" OR "vinyl plank" install Texas',
      '"laminate flooring" install Texas affordable handyman',
      'site:craigslist.org Texas "flooring" install OR repair needed',
      'site:nextdoor.com Texas "flooring" install recommend need',
      '"tile installation" OR "tile floor" Texas hire affordable',
      '"hardwood floor" install OR refinish OR repair Texas affordable',
      '"carpet install" OR "carpet replacement" Texas affordable',
      '"subfloor repair" OR "squeaky floor" OR "soft spot" floor Texas',
      'site:thumbtack.com "flooring" Texas near affordable',
      'site:angi.com "flooring" Texas job request',
      '"bathroom floor" OR "kitchen floor" tile install Texas affordable',
      '"stair treads" install OR replace Texas affordable handyman',
    ],
  },
  {
    name:"Fence Repair & Installation", emoji:"🪚", virtual:false, category:"Handyman",
    searches:[
      '"fence repair" OR "fence installation" Texas need hire affordable',
      '"fence fell" OR "fence blown down" OR "fence down" Texas repair',
      '"replace fence" OR "new fence" Texas affordable handyman',
      'site:craigslist.org Texas "fence" repair OR install needed',
      'site:nextdoor.com Texas "fence" repair install recommend need',
      '"wood fence" OR "cedar fence" OR "privacy fence" Texas install repair',
      '"chain link fence" install OR repair Texas affordable',
      '"gate repair" OR "fence gate" OR "automatic gate" Texas affordable',
      '"HOA fence" OR "neighbor fence" Texas repair affordable',
      'site:thumbtack.com "fence" Texas near affordable install repair',
      '"vinyl fence" OR "aluminum fence" install repair Texas',
      '"dog fence" OR "yard fence" Texas install repair affordable',
      '"split rail" OR "board on board" fence Texas install affordable',
    ],
  },
  {
    name:"Deck, Porch & Patio", emoji:"🪑", virtual:false, category:"Handyman",
    searches:[
      '"deck repair" OR "porch repair" OR "patio repair" Texas need hire',
      '"rotting deck" OR "rotten wood" deck OR porch Texas repair replace',
      '"deck rebuild" OR "deck replacement" Texas affordable',
      'site:craigslist.org Texas "deck" OR "porch" repair build needed',
      'site:nextdoor.com Texas "deck" OR "porch" repair recommend need',
      '"deck railing" OR "porch railing" repair install Texas affordable',
      '"porch steps" OR "front steps" repair replace Texas affordable',
      '"concrete patio" OR "paver patio" Texas install repair affordable',
      '"pergola" OR "covered patio" OR "shade structure" Texas build install',
      '"deck staining" OR "deck sealing" OR "deck refinish" Texas affordable',
      'site:thumbtack.com "deck" OR "porch" Texas near affordable',
      '"screen porch" OR "screened porch" build OR repair Texas',
      '"outdoor kitchen" build Texas affordable handyman',
    ],
  },
  {
    name:"Roof Repairs", emoji:"🏠", virtual:false, category:"Handyman",
    searches:[
      '"roof repair" OR "roof leak" Texas need hire affordable fast',
      '"missing shingles" OR "damaged shingles" Texas repair affordable',
      '"roof flashing" repair OR replace Texas affordable handyman',
      'site:nextdoor.com Texas "roof repair" recommend need affordable',
      '"storm damage" roof Texas repair affordable fast',
      '"fascia" OR "soffit" OR "drip edge" repair Texas affordable',
      '"flat roof" repair Texas affordable EPDM OR TPO',
      '"metal roof" repair OR seal Texas affordable handyman',
      '"roof tarp" OR "emergency roof" Texas storm damage fix',
      '"skylight" repair OR replace OR leak Texas affordable',
      'site:craigslist.org Texas "roof repair" OR "roofing" needed affordable',
      '"chimney" repair OR flashing OR repointing Texas affordable',
    ],
  },
  {
    name:"Gutter Cleaning & Repair", emoji:"🍂", virtual:false, category:"Handyman",
    searches:[
      '"gutter cleaning" OR "gutter repair" Texas need hire affordable',
      '"clogged gutters" OR "overflowing gutters" OR "gutters full" Texas fix',
      'site:craigslist.org Texas "gutter" cleaning OR repair needed',
      'site:nextdoor.com Texas "gutter" cleaning repair recommend need',
      '"gutter guard" OR "leaf guard" install Texas affordable handyman',
      '"downspout" repair OR extend OR redirect Texas affordable',
      '"seamless gutter" install Texas affordable',
      '"gutter replacement" Texas affordable handyman',
      'site:thumbtack.com "gutter cleaning" OR "gutter repair" Texas near',
    ],
  },
  {
    name:"Door, Window & Lock", emoji:"🚪", virtual:false, category:"Handyman",
    searches:[
      '"door repair" OR "window repair" Texas need hire affordable',
      '"door won\'t close" OR "door stuck" OR "door won\'t latch" Texas fix',
      '"window seal broken" OR "foggy window" OR "broken window" Texas',
      '"door frame" repair OR replace Texas affordable handyman',
      '"screen door" OR "screen repair" OR "new screen" Texas affordable',
      '"lock repair" OR "deadbolt install" OR "rekey" Texas affordable',
      '"door installation" OR "new door" install Texas affordable handyman',
      '"sliding door" repair OR "sliding glass door" Texas fix',
      '"storm door" install OR repair Texas affordable handyman',
      '"garage door" repair OR install Texas affordable handyman',
      'site:thumbtack.com "door repair" OR "window repair" Texas near',
    ],
  },
  {
    name:"Appliance Installation", emoji:"🍽️", virtual:false, category:"Handyman",
    searches:[
      '"appliance install" OR "appliance hookup" Texas hire affordable',
      '"dishwasher install" OR "dishwasher hookup" Texas handyman',
      '"microwave install" OR "over range microwave" Texas handyman',
      '"range hood" install Texas affordable handyman',
      '"washer dryer" hookup OR install Texas handyman affordable',
      '"garbage disposal" install OR replace Texas affordable',
      '"dryer vent" install OR clean OR reroute Texas handyman',
      '"refrigerator waterline" OR "ice maker line" install Texas',
      '"new appliances" install hookup Texas affordable',
      'site:craigslist.org Texas "appliance" install hookup needed',
      '"gas appliance" install OR hookup Texas handyman',
      '"built-in appliance" install Texas affordable handyman',
    ],
  },
  {
    name:"Junk Removal & Hauling", emoji:"🚛", virtual:false, category:"Handyman",
    searches:[
      '"junk removal" OR "junk hauling" Texas need hire affordable',
      '"haul away" OR "trash removal" OR "debris removal" Texas',
      'site:craigslist.org Texas "junk removal" OR "hauling" OR "clean out" needed',
      'site:nextdoor.com Texas "junk removal" recommend need affordable',
      '"garage cleanout" OR "attic cleanout" OR "shed cleanout" Texas',
      '"estate cleanout" OR "house cleanout" Texas affordable',
      '"scrap metal" removal OR haul Texas affordable',
      '"old furniture" OR "old appliances" removal Texas affordable',
      '"brush removal" OR "tree debris" OR "limbs" haul Texas',
      '"dumpster alternative" OR "no dumpster" haul Texas affordable',
      'site:thumbtack.com "junk removal" Texas near affordable',
      '"moving debris" OR "renovation debris" Texas haul affordable',
    ],
  },
  {
    name:"Senior & Accessibility Mods", emoji:"♿", virtual:false, category:"Specialty",
    searches:[
      '"grab bars" install OR bathroom Texas hire handyman affordable',
      '"wheelchair ramp" build OR install Texas affordable',
      '"walk-in shower" conversion OR "roll-in shower" Texas affordable',
      '"aging in place" modifications OR "senior home" Texas handyman',
      '"handrail" install OR repair Texas staircase affordable',
      '"stair lift" install OR "stairlift" Texas affordable',
      '"widened doorway" OR "doorway widening" Texas accessible',
      '"safety rails" OR "bath safety" Texas handyman affordable',
      'site:reddit.com "aging in place" OR "accessible home" Texas help 2025',
      '"ADA" modifications OR "handicap accessible" home Texas affordable',
      '"lowered counter" OR "roll under" accessible kitchen Texas',
    ],
  },
  {
    name:"Security Cameras & Smart Home", emoji:"📷", virtual:true, category:"Tech",
    searches:[
      '"security camera" install OR setup help Texas hire affordable',
      '"ring camera" OR "ring doorbell" setup install help confused',
      '"arlo" OR "wyze" OR "reolink" camera setup help Texas',
      '"doorbell camera" install Texas handyman affordable',
      '"smart home" setup install help Texas hire',
      '"smart switch" OR "smart plug" OR "Lutron" install Texas',
      '"nest thermostat" OR "ecobee" install setup help Texas',
      '"home automation" setup install Texas affordable',
      'site:reddit.com "security camera" install confused help 2025',
      '"NVR" OR "DVR" OR "CCTV" install Texas affordable handyman',
      '"alarm system" install OR setup Texas affordable',
      '"video doorbell" install Texas affordable handyman',
      'site:thumbtack.com "security camera" OR "smart home" Texas near',
    ],
  },
  {
    name:"Shed, Carport & Structures", emoji:"🏚️", virtual:false, category:"Handyman",
    searches:[
      '"shed assembly" OR "shed installation" OR "build shed" Texas hire help',
      '"assemble shed" Texas hire someone affordable',
      '"carport installation" OR "carport kit" Texas hire affordable',
      '"pergola" OR "gazebo" OR "arbor" Texas build install affordable',
      '"playhouse" OR "playset" OR "swing set" assembly Texas hire',
      '"storage building" install OR assemble Texas affordable',
      '"tuff shed" OR "arrow shed" OR "lifetime shed" assemble Texas',
      '"sunroom" OR "sunroom addition" Texas build install affordable',
      '"porch enclosure" OR "screen room" build Texas affordable',
      'site:craigslist.org Texas "shed" OR "carport" assembly build needed',
      '"retaining wall" build OR repair Texas affordable handyman',
      '"privacy screen" OR "lattice" install Texas outdoor affordable',
    ],
  },
  {
    name:"HVAC — Filters, Units & Mini Splits", emoji:"❄️", virtual:false, category:"Handyman",
    searches:[
      '"mini split install" OR "ductless AC" install Texas affordable handyman',
      '"window AC" install OR remove Texas affordable handyman',
      '"HVAC filter" OR "air filter" change Texas affordable',
      '"AC not cooling" OR "heat not working" Texas handyman simple fix',
      '"thermostat install" OR "thermostat replacement" Texas affordable',
      '"dryer vent cleaning" OR "duct cleaning" Texas affordable handyman',
      '"attic fan" install OR replace Texas affordable handyman',
      '"whole house fan" install Texas affordable handyman',
      '"register" OR "vent cover" replace Texas affordable',
      '"portable AC" install OR setup Texas help affordable',
    ],
  },
  {
    name:"Virtual Handyman Consult", emoji:"💻", virtual:true, category:"Virtual",
    searches:[
      'site:reddit.com/r/HomeImprovement "how do I fix" OR "how do I repair" 2025 OR 2026',
      'site:reddit.com/r/DIY "should I hire" OR "is this DIY" OR "can I DIY" 2025',
      'site:reddit.com/r/homeowners "need advice" OR "help me" repairs 2025 OR 2026',
      '"virtual handyman" OR "remote handyman" consult video anywhere',
      '"how much would it cost" OR "how much does it cost" home repair fix',
      'site:reddit.com "DIY or hire" home repair 2025 OR 2026',
      'site:reddit.com/r/FirstTimeHomeBuyer repairs advice help 2025',
      '"video call" handyman OR plumber OR electrician help consult',
      '"remote consultation" home repair fix advice',
      '"FaceTime" OR "Zoom" help with repairs home anywhere',
    ],
  },
  {
    name:"Furniture & Equipment Assembly", emoji:"🪑", virtual:false, category:"Handyman",
    searches:[
      '"furniture assembly" Texas hire affordable',
      '"IKEA assembly" OR "IKEA help" Texas hire someone',
      'site:craigslist.org Texas "furniture assembly" OR "IKEA" needed',
      'site:nextdoor.com Texas "furniture assembly" OR "IKEA" recommend help hire',
      '"Wayfair furniture" OR "Amazon furniture" assemble Texas help hire',
      '"office furniture" assembly Texas affordable handyman',
      '"gym equipment" OR "treadmill" assembly Texas hire affordable',
      '"patio furniture" assembly Texas handyman affordable',
      '"crib" OR "baby furniture" assembly Texas hire',
      'site:thumbtack.com "furniture assembly" Texas near affordable',
    ],
  },
  {
    name:"Concrete, Driveways & Walkways", emoji:"🏗️", virtual:false, category:"Handyman",
    searches:[
      '"concrete repair" OR "driveway repair" Texas affordable handyman',
      '"cracked concrete" OR "sunken concrete" Texas repair fix',
      '"concrete leveling" OR "mudjacking" Texas affordable',
      '"new driveway" OR "driveway extension" Texas affordable',
      '"walkway" OR "sidewalk" repair OR install Texas affordable',
      '"concrete steps" repair OR replace Texas affordable handyman',
      '"paver installation" OR "brick paver" Texas affordable',
      '"concrete slab" pour Texas affordable handyman',
      'site:craigslist.org Texas "concrete" OR "driveway" repair needed',
      '"expansion joint" OR "control joint" concrete Texas repair',
    ],
  },
  {
    name:"Landscaping & Yard Work Help", emoji:"🌿", virtual:false, category:"Handyman",
    searches:[
      '"yard cleanup" OR "yard work" Texas hire affordable handyman',
      '"tree removal" OR "tree trimming" Texas affordable small',
      '"stump removal" OR "stump grinding" Texas affordable handyman',
      '"brush clearing" OR "lot clearing" Texas affordable',
      '"sprinkler repair" OR "irrigation repair" Texas affordable handyman',
      '"French drain" OR "drainage problem" Texas yard help affordable',
      '"raised garden bed" build Texas affordable handyman',
      '"retaining wall" build OR repair Texas affordable',
      '"gravel driveway" OR "caliche driveway" Texas install repair',
      'site:craigslist.org Texas "yard work" OR "landscaping" needed affordable',
    ],
  },

  // ══ NEW LEAD TYPES ════════════════════════════════════════════════════════════
  {
    name:"Craigslist — Services Wanted", emoji:"📋", virtual:false, category:"Craigslist",
    searches:[
      'site:craigslist.org/search/lbg Texas "handyman" OR "repairs" OR "help needed"',
      'site:craigslist.org Tyler TX services wanted handyman',
      'site:craigslist.org Texarkana services wanted handyman repairs',
      'site:craigslist.org Shreveport services wanted handyman repairs',
      'site:craigslist.org Dallas services wanted "handyman" OR "repairs"',
      'site:craigslist.org Oklahoma City services wanted handyman',
      'site:craigslist.org East Texas "services wanted" handyman 2025 2026',
      'site:craigslist.org "looking for handyman" OR "need handyman" Texas',
    ],
  },
  {
    name:"Facebook Groups — Need Recommendations", emoji:"👥", virtual:false, category:"Social",
    searches:[
      'site:facebook.com "group" "East Texas" "recommend" OR "looking for" handyman 2025',
      'site:facebook.com "Texarkana" group "need a handyman" OR "who does" 2025',
      'site:facebook.com "Tyler Texas" group "recommend" handyman repairs 2025',
      'site:facebook.com "Longview Texas" group "need someone" repairs 2025',
      'site:facebook.com "Shreveport" group "recommend" handyman 2025',
      'site:facebook.com "Camp County" OR "Pittsburg TX" group need repairs 2025',
      'site:facebook.com "ArkLaTex" group handyman recommendations 2025',
      'site:facebook.com "Oklahoma" rural group "need handyman" 2025',
    ],
  },
  {
    name:"Nextdoor — Neighbor Recommendations", emoji:"🏘️", virtual:false, category:"Social",
    searches:[
      'site:nextdoor.com "East Texas" handyman recommend need 2025',
      'site:nextdoor.com Tyler OR Longview OR Marshall TX handyman 2025',
      'site:nextdoor.com Texarkana handyman recommend 2025',
      'site:nextdoor.com "Shreveport" OR "Bossier" handyman recommend 2025',
      'site:nextdoor.com Texas "who does" OR "does anyone know" handyman repairs 2025',
      'site:nextdoor.com Texas "looking for" OR "need a" handyman 2025',
      'site:nextdoor.com Texas "starlink" install recommend 2025',
      'site:nextdoor.com Texas "pressure washing" OR "fence repair" recommend 2025',
    ],
  },
  {
    name:"New Business Openings — Need Setup Work", emoji:"🆕", virtual:false, category:"Business",
    searches:[
      '"new business" OR "opening soon" Texas need work renovations repairs 2025',
      '"grand opening" Texas need repairs OR renovation OR setup handyman',
      '"new restaurant" OR "new shop" Texas need work done repairs renovation',
      '"new location" Texas need repairs renovation handyman affordable',
      'site:reddit.com Texas "opening a business" need repairs renovation help 2025',
      '"build out" OR "tenant improvement" Texas affordable handyman',
      '"commercial renovation" Texas small business affordable',
      '"new office" Texas need repairs setup handyman affordable',
    ],
  },
  {
    name:"Foreclosures & Auctions — Fix & Flip", emoji:"🏚️", virtual:false, category:"Real Estate",
    searches:[
      '"foreclosure" Texas need repairs fix up handyman affordable',
      '"bank owned" OR "REO" Texas property repairs handyman',
      '"auction property" OR "tax sale" Texas fix up repairs',
      '"fix and flip" Texas handyman repairs affordable fast',
      '"wholesale" OR "investor" Texas property repairs handyman',
      'site:reddit.com Texas "foreclosure" OR "fix and flip" repairs handyman 2025',
      '"probate" OR "estate sale" Texas property repairs needed',
      '"as-is" Texas house need repairs fix up handyman',
    ],
  },
  {
    name:"Insurance Claims — Storm Repairs", emoji:"📋", virtual:false, category:"Storm",
    searches:[
      '"insurance claim" OR "insurance adjuster" Texas repairs handyman affordable',
      '"hail claim" OR "wind claim" Texas repairs contractor affordable',
      '"FEMA" OR "disaster relief" Texas repairs handyman affordable',
      '"homeowners insurance" claim Texas repairs affordable contractor',
      '"supplement" OR "insurance supplement" Texas repairs handyman',
      '"public adjuster" Texas repairs contractor affordable',
      '"storm claim" Texas roof fence deck repairs affordable',
      'site:reddit.com Texas "insurance claim" repairs contractor affordable 2025',
    ],
  },
  {
    name:"Moving — Need Help Before & After", emoji:"📦", virtual:false, category:"New Homeowner",
    searches:[
      '"moving to Texas" OR "moving to East Texas" need handyman help repairs',
      '"just moved" Texas house need repairs work done handyman',
      '"moving out" Texas house need repairs clean fix',
      '"moving company" referral Texas handyman repairs',
      '"relocating to Texas" need handyman repairs affordable',
      'site:reddit.com "moving to Texas" need repairs handyman 2025',
      '"PCS to Texas" OR "transferred to Texas" need handyman',
      '"uhaul" OR "penske" Texas moving need repairs help',
    ],
  },
  {
    name:"Property Management Companies", emoji:"🏢", virtual:false, category:"Business",
    searches:[
      '"property management" Texas need handyman repairs vendor',
      '"property manager" East Texas OR Texarkana OR Tyler handyman contractor',
      '"HOA" repairs OR maintenance Texas handyman affordable vendor',
      '"apartment complex" repairs maintenance Texas handyman vendor',
      '"commercial property" maintenance Texas handyman affordable',
      'site:linkedin.com "property manager" Texas East TX handyman vendor',
      '"maintenance request" property Texas handyman affordable',
      '"preferred vendor" Texas property management handyman',
    ],
  },
  {
    name:"Real Estate Agents — Repair Referrals", emoji:"🤝", virtual:true, category:"Real Estate",
    searches:[
      '"real estate agent" Texas need handyman referral repairs',
      '"realtor" East Texas OR Texarkana OR Tyler recommend handyman repairs',
      '"RE/MAX" OR "Keller Williams" OR "Century 21" East Texas handyman',
      '"real estate" Texas "handyman referral" OR "contractor referral"',
      'site:linkedin.com "real estate agent" East Texas Tyler Longview Texarkana',
      '"listing agent" Texas need handyman repairs before listing',
      '"buyer agent" Texas need repairs after closing affordable',
      '"real estate investor" Texas need handyman repairs affordable fast',
    ],
  },
  {
    name:"Reddit — Home Improvement Help Wanted", emoji:"💬", virtual:true, category:"Social",
    searches:[
      'site:reddit.com/r/HomeImprovement "East Texas" OR "Tyler TX" OR "Texarkana" help 2025',
      'site:reddit.com/r/HomeImprovement "need someone" OR "hire" OR "contractor" Texas 2025',
      'site:reddit.com/r/DIY "East Texas" OR "Tyler" OR "Longview" help hire 2025',
      'site:reddit.com/r/homeowners Texas repairs "need help" OR "hire" 2025',
      'site:reddit.com/r/Texas "handyman" OR "repairs" need recommend 2025',
      'site:reddit.com/r/ArkLaTex handyman repairs recommend hire 2025',
      'site:reddit.com/r/oklahoma handyman repairs need hire recommend 2025',
      'site:reddit.com "Texas" "handyman" "recommend" OR "affordable" 2025 2026',
    ],
  },
  {
    name:"Water Well & Septic Issues", emoji:"💧", virtual:false, category:"Handyman",
    searches:[
      '"water well" repair OR pump OR pressure Texas affordable',
      '"well pump" not working OR low pressure Texas fix',
      '"septic" repair OR pump OR problem Texas affordable handyman',
      '"septic system" issue OR backup Texas fix affordable',
      '"well water" problem Texas fix repair affordable',
      'site:reddit.com Texas "water well" OR "septic" problem repair 2025',
      '"pressure tank" repair OR replace Texas affordable',
      '"well house" OR "pump house" repair Texas affordable',
    ],
  },
  {
    name:"Generator Install & Repair", emoji:"⚡", virtual:false, category:"Handyman",
    searches:[
      '"generator install" OR "generator hookup" Texas affordable handyman',
      '"standby generator" OR "whole house generator" install Texas',
      '"Generac" OR "Kohler" install OR repair Texas affordable',
      '"transfer switch" install Texas affordable handyman',
      '"generator" not starting OR repair Texas affordable',
      'site:reddit.com Texas "generator" install hookup affordable 2025',
      '"natural gas generator" OR "propane generator" install Texas',
      '"power outage" generator Texas install affordable need',
    ],
  },
  {
    name:"Tiny Homes, Containers & Cabins", emoji:"🏕️", virtual:false, category:"New Homeowner",
    searches:[
      '"tiny home" OR "tiny house" build OR repair Texas affordable',
      '"shipping container" home OR cabin Texas build install',
      '"container home" Texas build finish repairs affordable',
      '"park model" OR "park home" repairs Texas affordable',
      '"cabin build" OR "cabin repair" Texas affordable handyman',
      'site:reddit.com Texas "tiny home" OR "container home" build repairs 2025',
      '"shouse" OR "shop house" Texas build finish repairs',
      '"accessory dwelling" OR "ADU" Texas build affordable',
    ],
  },
  {
    name:"Pool & Hot Tub Repairs", emoji:"🏊", virtual:false, category:"Handyman",
    searches:[
      '"pool repair" OR "pool deck" repair Texas affordable handyman',
      '"hot tub" install OR repair OR move Texas affordable',
      '"pool fence" install Texas affordable handyman',
      '"pool pump" OR "pool motor" repair Texas affordable',
      '"above ground pool" install OR repair Texas affordable',
      '"pool house" OR "pool shed" build Texas affordable',
      'site:craigslist.org Texas "pool repair" OR "hot tub" needed',
      '"swim spa" install OR repair Texas affordable handyman',
    ],
  },
  {
    name:"Disabled & Low Income Home Repair Programs", emoji:"🏠", virtual:true, category:"Specialty",
    searches:[
      '"USDA" home repair grant OR loan Texas apply help',
      '"CDBG" OR "community development" home repair Texas affordable',
      '"weatherization" program Texas home repairs affordable',
      '"LIHEAP" OR "low income" home repair Texas program',
      'site:reddit.com Texas "home repair grant" OR "repair assistance" 2025',
      '"critical home repair" Texas affordable program help',
      '"Habitat for Humanity" Texas need repairs help affordable',
      '"Area Agency on Aging" Texas home repair seniors affordable',
    ],
  },
  {
    name:"Weddings, Events & Temporary Structures", emoji:"🎪", virtual:false, category:"Business",
    searches:[
      '"wedding venue" OR "event venue" repairs Texas affordable handyman',
      '"outdoor wedding" setup OR repairs Texas affordable',
      '"event space" repairs OR renovation Texas affordable',
      '"barn wedding" repair OR setup Texas affordable handyman',
      '"temporary structure" OR "tent platform" build Texas',
      'site:facebook.com Texas "wedding venue" repairs need handyman 2025',
      '"venue renovation" Texas affordable handyman',
      '"outdoor event" setup build Texas affordable handyman',
    ],
  },
  {
    name:"Schools, Daycares & Community Buildings", emoji:"🏫", virtual:false, category:"Business",
    searches:[
      '"school" repairs OR maintenance Texas affordable handyman',
      '"daycare" repairs OR safety Texas affordable handyman',
      '"church camp" OR "retreat center" repairs Texas affordable',
      '"community building" repairs Texas affordable handyman',
      '"fire station" OR "police station" repairs Texas affordable',
      '"library" repairs maintenance Texas affordable handyman',
      '"park pavilion" OR "park shelter" repair Texas affordable',
      'site:craigslist.org Texas "school" OR "community" repairs handyman needed',
    ],
  },
  {
    name:"Contractors Needing Subcontractors", emoji:"🔧", virtual:false, category:"Business",
    searches:[
      '"subcontractor" needed Texas handyman work available',
      '"looking for sub" OR "need sub" Texas handyman repairs',
      '"general contractor" Texas need handyman subcontractor',
      'site:craigslist.org Texas "subcontractor" OR "sub needed" handyman',
      '"1099" handyman Texas work available contractor',
      '"contract work" Texas handyman available',
      '"construction company" Texas need handyman subcontractor affordable',
      'site:indeed.com OR site:craigslist.org Texas "handyman subcontractor" 2025',
    ],
  },
  {
    name:"Farms & Agriculture — Equipment Buildings", emoji:"🚜", virtual:false, category:"Ranch/Farm",
    searches:[
      '"cotton gin" OR "grain elevator" repairs Texas affordable',
      '"chicken house" OR "broiler house" repair Texas affordable',
      '"dairy barn" OR "milking parlor" repair Texas affordable',
      '"irrigation" repair OR install Texas farm affordable',
      '"hay equipment" storage building Texas build repair',
      '"pecan orchard" OR "peach orchard" structures Texas repair build',
      '"catfish pond" OR "aquaculture" structures Texas build repair',
      '"livestock barn" OR "show barn" Texas build repair affordable',
    ],
  },
  {
    name:"Car Ports, Garages & Shop Buildings", emoji:"🚗", virtual:false, category:"Handyman",
    searches:[
      '"garage door" repair OR replace Texas affordable handyman',
      '"carport" build OR repair Texas affordable handyman',
      '"detached garage" build OR repair Texas affordable',
      '"workshop" OR "man cave" build Texas affordable handyman',
      '"garage conversion" Texas affordable handyman',
      '"epoxy floor" garage Texas affordable handyman',
      '"garage organization" OR "garage shelving" Texas build install',
      'site:craigslist.org Texas "garage" OR "carport" build repair needed',
    ],
  },

  // ══ THUMBTACK, ANGI, HOUSECALL PRO ════════════════════════════════════════════
  {
    name:"Thumbtack — Job Requests", emoji:"📌", virtual:false, category:"Lead Platforms",
    searches:[
      'site:thumbtack.com "handyman" Tyler OR Longview OR Texarkana OR Shreveport OR Marshall TX',
      'site:thumbtack.com "handyman" East Texas OR ArkLaTex request 2025',
      'site:thumbtack.com "starlink" OR "TV mounting" OR "fence" Texas request',
      'site:thumbtack.com "painting" OR "drywall" OR "flooring" East Texas',
      'site:thumbtack.com "pressure washing" OR "gutter" OR "deck" Texas request',
      'site:thumbtack.com "plumbing" OR "electrical" OR "ceiling fan" East Texas',
      'site:thumbtack.com "junk removal" OR "shed" OR "appliance" Texas request',
      'site:thumbtack.com "smart home" OR "security camera" Texas request',
      'site:thumbtack.com "senior" OR "grab bars" OR "wheelchair ramp" Texas',
      'site:thumbtack.com "generator" OR "mini split" OR "HVAC" Texas request',
    ],
  },
  {
    name:"Angi & HomeAdvisor — Job Requests", emoji:"🏠", virtual:false, category:"Lead Platforms",
    searches:[
      'site:angi.com "handyman" Tyler OR Longview OR Texarkana OR Shreveport TX request',
      'site:angi.com "handyman" East Texas OR ArkLaTex job request 2025',
      'site:angi.com "starlink" OR "TV mounting" OR "smart home" Texas',
      'site:angi.com "painting" OR "drywall" OR "flooring" East Texas request',
      'site:angi.com "pressure washing" OR "gutter cleaning" OR "deck repair" Texas',
      'site:angi.com "fence" OR "door" OR "window" repair Texas request',
      'site:angi.com "plumbing" OR "electrical" East Texas affordable request',
      'site:angi.com "junk removal" OR "hauling" Texas job request',
      'site:angi.com "security camera" OR "doorbell" OR "smart thermostat" Texas',
      'site:angi.com "generator" OR "ceiling fan" OR "light fixture" Texas',
      'site:homeadvisor.com "handyman" East Texas OR Texarkana job request',
      'site:homeadvisor.com "starlink" OR "satellite" OR "internet" install Texas',
    ],
  },
  {
    name:"Yelp — People Asking for Services", emoji:"⭐", virtual:false, category:"Lead Platforms",
    searches:[
      'site:yelp.com "handyman" Tyler TX OR Longview TX OR Texarkana TX review need',
      'site:yelp.com "handyman" Shreveport LA OR Marshall TX review 2025',
      'site:yelp.com "handyman" East Texas affordable recommend 2025',
      'site:yelp.com "TV mounting" OR "smart home" OR "camera install" Texas',
      'site:yelp.com "pressure washing" OR "painting" OR "fence" East Texas',
      'site:yelp.com "junk removal" OR "hauling" Tyler OR Longview OR Texarkana',
      'site:yelp.com "starlink" OR "satellite install" Texas review recommend',
      'site:yelp.com "plumber" OR "electrician" East Texas affordable',
    ],
  },
  {
    name:"HouseCallPro & Jobber — Lead Boards", emoji:"🔧", virtual:false, category:"Lead Platforms",
    searches:[
      '"housecall pro" handyman East Texas leads OR customers 2025',
      '"jobber" handyman East Texas leads OR customers 2025',
      '"service titan" handyman East Texas leads 2025',
      '"workiz" handyman East Texas leads customers 2025',
      '"handyman app" Texas leads customers 2025',
      '"pro referral" OR "home depot pro" Texas handyman leads',
      '"lowe\'s pro" OR "lowes pro" handyman Texas leads referral',
      '"google local services" handyman East Texas leads 2025',
      '"google guaranteed" handyman Texas leads affordable',
      '"Porch.com" handyman East Texas job request leads',
    ],
  },
  {
    name:"TaskRabbit & Handy — Overflow Leads", emoji:"📱", virtual:false, category:"Lead Platforms",
    searches:[
      'site:taskrabbit.com handyman East Texas OR Tyler OR Texarkana OR Shreveport',
      '"taskrabbit" handyman East Texas request overflow 2025',
      '"handy.com" OR "handy app" handyman Texas request 2025',
      '"Amazon Home Services" handyman Texas request 2025',
      '"Frontdoor" OR "AHS" handyman Texas request 2025',
      '"Bark.com" handyman East Texas request leads 2025',
      '"Houzz" handyman East Texas project request 2025',
      '"BuildZoom" handyman East Texas project request 2025',
    ],
  },

  // ══ SMART HOME — FULL EXPANSION ═══════════════════════════════════════════════
  {
    name:"Smart Doorbells & Video Doorbells", emoji:"🔔", virtual:true, category:"Smart Home",
    searches:[
      '"video doorbell" install OR setup help Texas affordable handyman',
      '"ring doorbell" install OR setup confused help Texas',
      '"nest doorbell" OR "google doorbell" install help Texas',
      '"arlo doorbell" OR "eufy doorbell" install setup help',
      '"doorbell camera" wiring OR install Texas affordable',
      'site:reddit.com "ring doorbell" install help confused wiring 2025',
      '"doorbell" "no existing wiring" OR "no chime" install help Texas',
      '"video doorbell" "how to install" OR "need help" 2025',
      'site:nextdoor.com Texas "doorbell camera" install recommend need',
      '"ring" OR "nest" doorbell "not working" OR "offline" Texas help',
    ],
  },
  {
    name:"Smart Thermostats", emoji:"🌡️", virtual:true, category:"Smart Home",
    searches:[
      '"smart thermostat" install OR setup help Texas affordable',
      '"nest thermostat" install OR setup confused help Texas',
      '"ecobee" install OR setup help Texas affordable handyman',
      '"honeywell smart" OR "sensi thermostat" install help Texas',
      '"thermostat" "C wire" OR "common wire" problem install help',
      'site:reddit.com "smart thermostat" install help "C wire" confused 2025',
      '"smart thermostat" "no C wire" install help Texas',
      '"thermostat" not working OR wrong wiring Texas fix help',
      '"smart thermostat" "heat pump" wiring install Texas help',
      'site:nextdoor.com Texas "thermostat" install recommend need help',
    ],
  },
  {
    name:"Smart Lighting & Switches", emoji:"💡", virtual:true, category:"Smart Home",
    searches:[
      '"smart lights" OR "smart bulbs" setup install help Texas',
      '"smart switch" install OR setup help Texas confused',
      '"Lutron" OR "Caseta" install setup Texas help affordable',
      '"Kasa" OR "Leviton" smart switch install help Texas',
      '"Philips Hue" OR "LIFX" setup help Texas',
      '"smart dimmer" install help Texas no neutral wire',
      '"no neutral wire" smart switch install help Texas',
      'site:reddit.com "smart switch" install "no neutral" help confused 2025',
      '"under cabinet lighting" OR "accent lighting" install Texas affordable',
      '"outdoor smart lights" OR "smart landscape lights" install Texas',
      '"motion sensor light" OR "smart flood light" install Texas',
      '"smart ceiling fan" install OR "smart fan" setup help Texas',
    ],
  },
  {
    name:"Smart Locks & Keypads", emoji:"🔐", virtual:true, category:"Smart Home",
    searches:[
      '"smart lock" install OR setup help Texas affordable',
      '"schlage encode" OR "kwikset halo" install help Texas',
      '"august smart lock" OR "yale smart lock" install help',
      '"keypad lock" install Texas affordable handyman',
      '"keyless entry" install OR setup Texas affordable',
      'site:reddit.com "smart lock" install help confused 2025',
      '"deadbolt" smart lock install Texas affordable handyman',
      '"door lock" not working OR install Texas help',
      '"Airbnb lock" OR "rental lock" install Texas',
      '"keypad" install Texas vacation rental Airbnb VRBO help',
    ],
  },
  {
    name:"Smart Home Hubs & Systems", emoji:"🏠", virtual:true, category:"Smart Home",
    searches:[
      '"smart home" setup OR install help Texas affordable',
      '"google home" OR "amazon echo" setup help Texas',
      '"alexa" setup OR install help Texas home',
      '"apple homekit" setup install help Texas',
      '"home assistant" setup install help Texas',
      '"samsung smartthings" setup install help Texas',
      '"z-wave" OR "zigbee" smart home setup help Texas',
      'site:reddit.com "smart home" setup help beginner Texas 2025',
      '"whole home automation" install Texas affordable',
      '"matter" smart home setup help Texas 2025',
      '"voice control" home setup install Texas help',
    ],
  },
  {
    name:"Smart TVs, Streaming & Entertainment", emoji:"📺", virtual:true, category:"Smart Home",
    searches:[
      '"smart TV" setup OR install help Texas',
      '"Roku" OR "Fire TV" OR "Apple TV" setup help Texas',
      '"surround sound" OR "home theater" install setup Texas affordable',
      '"soundbar" install OR setup help Texas',
      '"projector" install OR mount Texas affordable handyman',
      '"media room" OR "theater room" setup Texas affordable',
      '"streaming" setup help Texas confused not working',
      '"HDMI" OR "ARC" OR "eARC" setup help Texas confused',
      '"whole home audio" OR "multi room audio" setup Texas',
      '"Sonos" OR "Bose" setup install help Texas',
      '"outdoor TV" install OR mount Texas affordable',
      'site:reddit.com "home theater" setup help Texas 2025',
    ],
  },
  {
    name:"Smart Security Systems", emoji:"🚨", virtual:true, category:"Smart Home",
    searches:[
      '"security system" install OR setup help Texas affordable',
      '"ring alarm" setup install help Texas',
      '"simplisafe" setup install help Texas',
      '"ADT" OR "vivint" alternative Texas cheaper self install',
      '"motion sensor" install OR setup Texas help',
      '"door sensor" OR "window sensor" install Texas help',
      '"glass break sensor" install Texas help',
      '"alarm system" self install help Texas confused',
      'site:reddit.com "home security" self install help Texas 2025',
      '"security system" "no monthly fee" install Texas help',
      '"NVR system" OR "CCTV" install help Texas affordable',
      '"outdoor camera" install Texas weatherproof affordable',
    ],
  },
  {
    name:"Smart Garage Doors", emoji:"🚗", virtual:true, category:"Smart Home",
    searches:[
      '"smart garage door" install OR setup Texas help',
      '"myQ" OR "chamberlain" smart garage install setup help Texas',
      '"garage door opener" install OR replace Texas affordable',
      '"smart garage" "works with alexa" OR "google home" setup Texas',
      '"garage door" not working OR repair Texas affordable handyman',
      '"garage door sensor" install replace Texas help',
      'site:reddit.com "smart garage" install confused help 2025',
      '"garage door" spring OR cable OR track repair Texas affordable',
    ],
  },
  {
    name:"Smart Irrigation & Outdoor Tech", emoji:"🌱", virtual:true, category:"Smart Home",
    searches:[
      '"smart sprinkler" OR "rachio" install setup help Texas',
      '"irrigation controller" smart install Texas affordable',
      '"outdoor smart plug" OR "outdoor smart outlet" install Texas',
      '"landscape lighting" smart install Texas affordable',
      '"smart pool" controller install help Texas',
      '"weather station" install setup Texas home',
      '"soil sensor" OR "smart irrigation" install Texas help',
      'site:reddit.com "smart irrigation" setup help Texas 2025',
    ],
  },
  {
    name:"Whole Home WiFi & Networking", emoji:"📶", virtual:true, category:"Smart Home",
    searches:[
      '"mesh wifi" OR "whole home wifi" setup install Texas help',
      '"eero" OR "orbi" OR "google wifi" setup help Texas',
      '"wifi dead zones" OR "bad wifi" Texas fix help',
      '"ethernet" run OR install Texas affordable handyman',
      '"wifi extender" OR "wifi booster" setup Texas help',
      'site:reddit.com "mesh wifi" setup help Texas 2025',
      '"network" setup home Texas affordable help',
      '"wifi" not reaching garage OR shop OR barn Texas fix',
      '"outdoor wifi" OR "wifi to shop" Texas extend help',
      '"starlink" wifi setup mesh extend Texas help',
      '"cat6" OR "ethernet cable" run home Texas affordable',
      '"network closet" OR "patch panel" setup Texas affordable',
    ],
  },
  {
    name:"EV Chargers & Solar", emoji:"⚡", virtual:false, category:"Smart Home",
    searches:[
      '"EV charger" install OR "electric car charger" install Texas affordable',
      '"level 2 charger" install Texas affordable handyman',
      '"Tesla charger" OR "ChargePoint" install Texas affordable',
      '"240v outlet" install garage Texas affordable',
      '"NEMA 14-50" install Texas affordable electrician handyman',
      'site:reddit.com "EV charger" install help Texas 2025',
      '"solar panel" install Texas affordable help',
      '"solar battery" OR "powerwall" install Texas affordable',
      '"generator" OR "backup power" install Texas solar affordable',
      '"whole home battery" install Texas affordable',
    ],
  },
  {
    name:"Smart Appliances & Kitchen Tech", emoji:"🍳", virtual:true, category:"Smart Home",
    searches:[
      '"smart refrigerator" setup OR install help Texas',
      '"smart oven" OR "smart range" install setup Texas',
      '"smart dishwasher" install hookup Texas affordable',
      '"smart washer dryer" install setup Texas help',
      '"instant pot" OR "air fryer" install OR setup help Texas',
      '"undercounter fridge" OR "beverage center" install Texas',
      '"wine cooler" install OR hookup Texas affordable',
      '"smart microwave" install Texas affordable handyman',
      '"smart coffee maker" OR "smart kitchen" setup help Texas',
      '"whole home water" filter OR softener install Texas affordable',
    ],
  },

  // ══ BROADBAND & DSL SUFFERERS — READY TO SWITCH ═══════════════════════════════
  {
    name:"AT&T DSL & Broadband — Switch to Starlink", emoji:"📞", virtual:false, category:"Internet",
    searches:[
      '"AT&T DSL" slow OR terrible OR cancel Texas rural 2025',
      '"AT&T internet" OR "AT&T fixed wireless" rural Texas complaints 2025',
      '"AT&T" "1mb" OR "3mb" OR "6mb" OR "slow DSL" Texas rural',
      '"AT&T" rural Texas "no fiber" OR "DSL only" frustrated alternatives',
      'site:reddit.com "AT&T DSL" slow rural Texas starlink switch 2025',
      '"AT&T" "not available" OR "no service" rural Texas internet options',
      '"leaving AT&T" OR "cancel AT&T" rural Texas internet starlink',
      '"AT&T" rural "upload speed" OR "can\'t work from home" Texas',
      '"AT&T" rural Texas "zoom" OR "teams" OR "work from home" not working',
      'site:reddit.com/r/Rural_Internet "AT&T" Texas alternatives starlink 2025',
    ],
  },
  {
    name:"Windstream, Suddenlink & Local ISP Complaints", emoji:"📡", virtual:false, category:"Internet",
    searches:[
      '"Windstream" slow OR terrible OR cancel Texas Arkansas Louisiana 2025',
      '"Windstream" rural Texas alternatives OR "switching to starlink"',
      '"Suddenlink" OR "Optimum" slow Texas rural complaints 2025',
      '"Suddenlink" cancel OR alternatives Texas 2025',
      '"CenturyLink" slow rural Texas alternatives starlink 2025',
      '"Frontier" internet slow OR cancel Texas rural 2025',
      '"local ISP" OR "small ISP" rural Texas slow terrible alternatives',
      '"co-op internet" OR "electric co-op" internet Texas slow problem',
      'site:reddit.com "Windstream" OR "Suddenlink" Texas cancel starlink 2025',
      '"cable internet" rural Texas dropped OR slow alternatives starlink',
      '"broadband map" Texas "underserved" OR "no service" OR "slow" 2025',
      '"T-Mobile home internet" OR "Verizon home internet" rural TX not enough',
    ],
  },
  {
    name:"People Working From Home — Need Better Internet", emoji:"💻", virtual:false, category:"Internet",
    searches:[
      '"work from home" rural Texas internet bad slow need better 2025',
      '"remote work" rural Texas internet problems starlink 2025',
      '"zoom calls" OR "teams meetings" rural Texas internet cutting out',
      '"VPN" rural Texas slow internet work from home problem',
      '"upload speed" rural Texas work from home not enough',
      '"home office" rural Texas internet bad need starlink 2025',
      'site:reddit.com "work from home" rural Texas internet slow problem 2025',
      '"remote job" rural Texas internet "not fast enough" OR "dropping"',
      '"Starlink" "work from home" rural Texas worth it 2025',
      '"digital nomad" rural Texas internet options starlink 2025',
      '"RV" OR "van life" Texas internet starlink work remote 2025',
    ],
  },
  {
    name:"Students & Schools — Need Better Internet", emoji:"🎓", virtual:false, category:"Internet",
    searches:[
      '"student" rural Texas internet slow bad homework zoom 2025',
      '"online school" OR "homeschool" rural Texas internet bad slow',
      '"college student" rural Texas home internet problem starlink',
      '"online classes" rural Texas internet cutting out slow',
      '"hotspot" not enough data rural Texas student school',
      '"school" rural Texas wifi internet slow bad 2025',
      'site:reddit.com rural Texas "online school" internet bad 2025',
      '"kids" online learning rural Texas internet terrible need better',
      '"Chromebook" rural Texas school internet bad home',
      '"hot spot" OR "mobile data" rural TX school "running out" 2025',
    ],
  },

  // ══ PEOPLE MOVING INTO NEW AREAS ══════════════════════════════════════════════
  {
    name:"People Moving to East Texas", emoji:"🚚", virtual:false, category:"New Mover",
    searches:[
      '"moving to East Texas" OR "moving to Tyler TX" OR "moving to Longview TX" 2025',
      '"relocating to East Texas" OR "moving to Texarkana" 2025',
      '"moving to Pittsburg TX" OR "moving to Camp County" 2025',
      '"new to East Texas" OR "just moved to East Texas" 2025',
      'site:reddit.com "moving to East Texas" OR "moving to Tyler" 2025',
      'site:reddit.com "moving to Texarkana" OR "moving to Longview" 2025',
      '"moving from" city "to East Texas" rural internet handyman 2025',
      '"bought land" East Texas moving building house 2025',
      '"retiring to East Texas" OR "retiring to rural Texas" 2025',
      '"leaving city" moving rural Texas East 2025',
      'site:facebook.com "moving to East Texas" group recommendations need 2025',
      '"what do I need to know" moving East Texas Tyler Longview 2025',
    ],
  },
  {
    name:"People Moving to Rural Oklahoma & Arkansas", emoji:"🏡", virtual:false, category:"New Mover",
    searches:[
      '"moving to Oklahoma" rural 2025 internet handyman',
      '"moving to Arkansas" rural 2025 internet repairs',
      '"relocating to Oklahoma" OR "moving to Durant OK" 2025',
      '"moving to Texarkana AR" OR "moving to Hope AR" 2025',
      'site:reddit.com "moving to Oklahoma" rural internet 2025',
      'site:reddit.com "moving to Arkansas" rural repairs internet 2025',
      '"retiring to Oklahoma" OR "retiring to Arkansas" rural 2025',
      '"leaving California" OR "leaving Illinois" OR "leaving New York" moving rural south 2025',
      '"leaving the city" moving Oklahoma OR Arkansas rural 2025',
      '"bought property" Oklahoma OR Arkansas need internet repairs 2025',
    ],
  },
  {
    name:"New Construction & Rural Land Buyers", emoji:"🏗️", virtual:false, category:"New Mover",
    searches:[
      '"buying land" Texas rural need internet starlink 2025',
      '"building a house" rural Texas need internet starlink handyman',
      '"new construction" rural Texas need starlink internet setup',
      '"raw land" Texas buying building need internet options',
      '"5 acres" OR "10 acres" OR "20 acres" Texas buying building 2025',
      'site:reddit.com "building rural Texas" internet options starlink 2025',
      '"off grid" Texas land buying building need internet solar 2025',
      '"rural property" Texas bought building need internet options',
      '"well and septic" Texas new property need internet starlink',
      '"house plans" OR "floor plans" rural Texas building need internet',
      '"barndominium" build Texas need internet starlink options 2025',
      '"new home" rural Texas need internet setup starlink install',
    ],
  },
  {
    name:"People Escaping Cities — Moving to Rural", emoji:"🌄", virtual:false, category:"New Mover",
    searches:[
      '"leaving Dallas" OR "leaving Houston" moving rural Texas 2025',
      '"leaving the city" moving rural Texas East 2025',
      '"tired of the city" moving rural Texas 2025',
      '"sold our house" moving rural Texas 2025',
      '"remote work" moving rural Texas 2025',
      'site:reddit.com "moving rural Texas" from city internet repairs 2025',
      '"leaving Austin" moving rural East Texas 2025',
      '"cost of living" moving rural Texas affordable 2025',
      '"homestead" OR "self sufficient" moving rural Texas 2025',
      '"escape the city" Texas rural move 2025 internet',
      '"urban to rural" Texas move 2025 internet starlink handyman',
      '"city to country" Texas move 2025 what do I need',
    ],
  },

  // ══ HYPERLOCAL EAST TEXAS SEARCHES ════════════════════════════════════════════
  {
    name:"Camp County & Surrounding — Ultra Local", emoji:"📍", virtual:false, category:"Hyperlocal",
    searches:[
      '"Pittsburg TX" need handyman OR repairs OR internet 2025',
      '"Camp County" Texas need repairs OR internet OR handyman 2025',
      '"Daingerfield TX" OR "Lone Star TX" need internet OR repairs 2025',
      '"Hughes Springs TX" OR "Linden TX" need help repairs internet',
      '"Avinger TX" OR "Omaha TX" need repairs internet handyman',
      '"Morris County" OR "Cass County" Texas repairs internet handyman 2025',
      '"Titus County" OR "Franklin County" Texas need handyman repairs',
      '"Mount Pleasant TX" need handyman OR internet OR repairs 2025',
      '"Mount Vernon TX" OR "Winnsboro TX" need help repairs internet',
      'site:facebook.com "Pittsburg Texas" OR "Camp County" need recommend help 2025',
      'site:nextdoor.com "Pittsburg" OR "Daingerfield" OR "Hughes Springs" TX need help',
      'site:craigslist.org "East Texas" OR "Texarkana" need handyman repairs 2025',
    ],
  },
  {
    name:"Tyler, Longview & Marshall — Core Market", emoji:"🏙️", virtual:false, category:"Hyperlocal",
    searches:[
      '"Tyler TX" need handyman OR repairs OR starlink 2025',
      '"Longview TX" need handyman OR repairs OR internet 2025',
      '"Marshall TX" need handyman OR repairs OR internet 2025',
      '"Kilgore TX" OR "Henderson TX" need repairs OR internet 2025',
      '"Jacksonville TX" OR "Rusk TX" need handyman repairs 2025',
      'site:reddit.com "Tyler Texas" handyman repairs internet 2025',
      'site:facebook.com "Tyler TX" group need recommend handyman repairs 2025',
      'site:nextdoor.com "Tyler" OR "Longview" OR "Marshall" TX need handyman 2025',
      'site:craigslist.org Tyler TX handyman repairs internet needed 2025',
      '"Smith County" OR "Gregg County" OR "Harrison County" TX handyman 2025',
    ],
  },
  {
    name:"Texarkana & ArkLaTex Ultra Local", emoji:"📍", virtual:false, category:"Hyperlocal",
    searches:[
      '"Texarkana TX" need handyman OR repairs OR internet 2025',
      '"Texarkana AR" need handyman OR repairs OR internet 2025',
      '"Bowie County" Texas need handyman repairs internet 2025',
      '"Miller County" Arkansas need handyman repairs internet 2025',
      '"Atlanta TX" OR "New Boston TX" need repairs internet 2025',
      '"De Kalb TX" OR "Queen City TX" need handyman repairs 2025',
      'site:facebook.com "Texarkana" group need recommend handyman repairs 2025',
      'site:nextdoor.com "Texarkana" need handyman repairs internet 2025',
      'site:craigslist.org Texarkana handyman repairs internet needed 2025',
      '"ArkLaTex" need handyman repairs internet starlink 2025',
    ],
  },
  {
    name:"Shreveport & North Louisiana Ultra Local", emoji:"📍", virtual:false, category:"Hyperlocal",
    searches:[
      '"Shreveport LA" need handyman OR repairs OR internet 2025',
      '"Bossier City LA" need handyman OR repairs OR internet 2025',
      '"Caddo Parish" OR "Bossier Parish" need handyman repairs internet 2025',
      '"Minden LA" OR "Bossier City" need handyman repairs 2025',
      '"Natchitoches LA" OR "Mansfield LA" need handyman 2025',
      'site:facebook.com "Shreveport" group need recommend handyman repairs 2025',
      'site:nextdoor.com "Shreveport" OR "Bossier City" need handyman 2025',
      'site:craigslist.org Shreveport handyman repairs internet needed 2025',
      '"North Louisiana" need handyman repairs internet starlink 2025',
      '"Webster Parish" OR "DeSoto Parish" Louisiana need handyman 2025',
    ],
  },

  // ══ SEASONAL & WEATHER-DRIVEN LEADS ═══════════════════════════════════════════
  {
    name:"Spring Prep & Home Maintenance", emoji:"🌸", virtual:false, category:"Seasonal",
    searches:[
      '"spring cleaning" OR "spring maintenance" Texas home repairs handyman 2025',
      '"spring projects" OR "honey do list" Texas hire handyman 2025',
      '"after winter" repairs OR damage Texas home handyman 2025',
      '"deck" OR "fence" OR "gutters" spring cleaning Texas affordable 2025',
      '"exterior painting" spring Texas affordable handyman 2025',
      '"yard cleanup" OR "landscaping" spring Texas handyman 2025',
      'site:nextdoor.com Texas "spring" repairs handyman recommend 2025',
      '"HVAC tune up" OR "AC check" spring Texas affordable 2025',
      '"pressure wash" spring Texas house affordable 2025',
      '"spring home" checklist repairs Texas handyman affordable 2025',
    ],
  },
  {
    name:"Summer Heat Damage & AC Help", emoji:"☀️", virtual:false, category:"Seasonal",
    searches:[
      '"summer heat" damage repairs Texas home 2025',
      '"AC not cooling" OR "AC broken" Texas affordable fix 2025',
      '"heat damage" roof OR deck OR fence Texas repair 2025',
      '"attic fan" install Texas summer heat affordable 2025',
      '"mini split" install Texas summer heat affordable 2025',
      '"window AC" install Texas summer affordable 2025',
      '"ceiling fan" install Texas summer affordable 2025',
      '"shade structure" OR "pergola" Texas summer heat affordable build',
      '"insulation" Texas summer heat attic affordable 2025',
      '"cool roof" OR "roof coating" Texas summer heat affordable',
    ],
  },
  {
    name:"Winter Freeze & Storm Prep", emoji:"❄️", virtual:false, category:"Seasonal",
    searches:[
      '"freeze prep" OR "winterize" Texas home affordable 2025',
      '"pipe insulation" OR "heat tape" install Texas affordable',
      '"freeze damage" OR "burst pipes" Texas repair 2025',
      '"generator" Texas winter freeze prep install affordable',
      '"storm shutters" OR "window film" Texas winter affordable',
      '"weather stripping" OR "door seal" Texas winter affordable',
      '"insulation" crawl space OR attic Texas winter affordable',
      '"propane" OR "wood stove" install Texas winter affordable',
      'site:reddit.com Texas "winter storm" prep repairs affordable 2025',
      '"power outage" prep Texas generator battery affordable',
    ],
  },

  // ══ COMMUNITY & SOCIAL PLATFORMS ══════════════════════════════════════════════
  {
    name:"Local Facebook Groups — All East TX", emoji:"👥", virtual:false, category:"Social",
    searches:[
      'site:facebook.com/groups "East Texas" "need" OR "recommend" OR "looking for" handyman 2025',
      'site:facebook.com/groups "Pittsburg Texas" OR "Camp County" recommend need 2025',
      'site:facebook.com/groups "Tyler Texas" "need" handyman repairs recommend 2025',
      'site:facebook.com/groups "Longview Texas" "need" repairs handyman 2025',
      'site:facebook.com/groups "Texarkana" "need" OR "recommend" handyman repairs 2025',
      'site:facebook.com/groups "Shreveport" "need" OR "recommend" handyman 2025',
      'site:facebook.com/groups "East Texas" "starlink" OR "internet" help 2025',
      'site:facebook.com/groups "rural Texas" "internet" OR "handyman" need 2025',
      '"East Texas buy sell trade" group handyman repairs need 2025',
      '"East Texas Community" facebook group need help repairs 2025',
    ],
  },
  {
    name:"Twitter & X — Real Time Complaints", emoji:"🐦", virtual:false, category:"Social",
    searches:[
      'site:twitter.com "East Texas" OR "Tyler TX" need handyman repairs 2025',
      'site:twitter.com "Texarkana" need repairs OR internet OR handyman 2025',
      'site:twitter.com "hughesnet" OR "viasat" hate terrible slow cancel 2025',
      'site:twitter.com "starlink" install help Texas 2025',
      'site:twitter.com "rural internet" terrible slow Texas 2025',
      'site:twitter.com "need a handyman" Texas 2025',
      'site:twitter.com "moving to Texas" rural need help 2025',
      'site:twitter.com "East Texas" internet bad slow help 2025',
      'site:x.com "rural Texas" internet slow need help 2025',
      'site:x.com "starlink" install Texas need help 2025',
    ],
  },
  {
    name:"Neighborhood & Community Apps", emoji:"📱", virtual:false, category:"Social",
    searches:[
      'site:nextdoor.com "East Texas" handyman recommend need 2025',
      'site:nextdoor.com "Tyler" OR "Longview" OR "Texarkana" handyman repairs 2025',
      'site:nextdoor.com "Pittsburg" OR "Mount Pleasant" handyman need 2025',
      'site:nextdoor.com East Texas "starlink" OR "internet" help recommend 2025',
      '"Nextdoor" East Texas handyman starlink recommend 2025',
      '"Ring Neighbors" East Texas repairs help need 2025',
      '"Patch.com" East Texas handyman repairs community 2025',
      '"Alignable" East Texas small business handyman connect 2025',
      '"Alignable" Tyler OR Longview OR Texarkana handyman recommend 2025',
      '"local community" app East Texas handyman repairs recommend 2025',
    ],
  },
  {
    name:"Google Maps & Local Reviews", emoji:"🗺️", virtual:false, category:"Social",
    searches:[
      '"google maps" "handyman" "East Texas" reviews recommend 2025',
      '"google" "handyman near me" East Texas Tyler Longview Texarkana',
      '"handyman" Tyler TX google reviews affordable reliable 2025',
      '"handyman" Longview TX google reviews affordable 2025',
      '"handyman" Texarkana TX google reviews affordable 2025',
      '"starlink installer" East Texas google maps reviews 2025',
      '"handyman" Shreveport LA google reviews affordable 2025',
      '"best handyman" East Texas OR Tyler OR Longview 2025',
      '"handyman" Pittsburg TX OR Mount Pleasant TX reviews affordable',
      '"google local" handyman East Texas reviews need 2025',
    ],
  },

  // ══ SPECIFIC HIGH-VALUE TARGETS ════════════════════════════════════════════════
  {
    name:"New Subdivisions & Developments", emoji:"🏘️", virtual:false, category:"New Mover",
    searches:[
      '"new subdivision" OR "new development" East Texas handyman 2025',
      '"new homes" East Texas Tyler Longview Texarkana handyman need 2025',
      '"DR Horton" OR "LGI Homes" OR "Centex" East Texas new homeowner 2025',
      '"new neighborhood" East Texas handyman repairs need 2025',
      '"builder grade" OR "upgrade" Texas new home handyman affordable',
      '"new home" East Texas "honey do list" OR "to do list" handyman',
      '"just closed" East Texas new home need handyman repairs 2025',
      '"new construction" East Texas need handyman repairs finishing 2025',
      '"move in ready" East Texas new home need work done handyman',
      'site:reddit.com "new home" East Texas Tyler Longview need handyman 2025',
    ],
  },
  {
    name:"Retirees & Snowbirds Moving to Texas", emoji:"🌅", virtual:false, category:"New Mover",
    searches:[
      '"retiring to Texas" need handyman internet repairs 2025',
      '"retirement" East Texas moving need handyman internet 2025',
      '"snowbird" Texas moving need repairs internet setup 2025',
      '"55+" OR "senior living" East Texas moving need handyman 2025',
      '"downsizing" moving Texas rural need handyman help 2025',
      '"retirement home" East Texas need repairs handyman internet 2025',
      '"fixed income" Texas home repairs affordable handyman 2025',
      '"senior" East Texas need handyman repairs internet help 2025',
      'site:reddit.com "retiring to Texas" rural need handyman internet 2025',
      '"active adult" OR "55 plus" East Texas new home need handyman',
    ],
  },
  {
    name:"Veterans Moving to Texas for Benefits", emoji:"🇺🇸", virtual:false, category:"New Mover",
    searches:[
      '"veteran" moving to Texas benefits need handyman repairs 2025',
      '"military" retiring Texas need handyman repairs internet 2025',
      '"VA loan" Texas new home East TX need repairs handyman 2025',
      '"veteran" East Texas new home need handyman affordable 2025',
      '"disabled veteran" Texas home repairs accessible affordable 2025',
      '"GI Bill" Texas home new need repairs handyman 2025',
      'site:reddit.com "veteran" moving Texas need handyman repairs 2025',
      '"military family" relocating East Texas need handyman internet 2025',
      '"PCS" Texas need handyman repairs internet setup 2025',
      '"JBLM" OR "Fort Hood" OR "Fort Bliss" retiring Texas rural 2025',
    ],
  },

  // ══ BOX ASSEMBLY — STUFF PEOPLE BUY AND CAN'T PUT TOGETHER ═══════════════════
  {
    name:"IKEA & Flat Pack Furniture Assembly", emoji:"📦", virtual:false, category:"Assembly",
    searches:[
      '"IKEA assembly" OR "IKEA help" Texas hire someone affordable 2025',
      '"IKEA" "need help" OR "confusing" Texas assemble help',
      'site:craigslist.org Texas "IKEA" OR "flat pack" assembly needed',
      'site:nextdoor.com Texas "IKEA" assembly help hire recommend 2025',
      '"flat pack" furniture Texas help hire affordable',
      '"KALLAX" OR "BILLY" OR "PAX" OR "HEMNES" IKEA Texas assemble help',
      'site:thumbtack.com "IKEA assembly" OR "furniture assembly" Texas near',
    ],
  },
  {
    name:"Wayfair & Amazon Furniture Assembly", emoji:"🛋️", virtual:false, category:"Assembly",
    searches:[
      '"Wayfair" furniture assembly Texas help hire affordable 2025',
      '"Amazon furniture" assembly Texas help hire 2025',
      '"furniture arrived" OR "furniture delivered" need assembled Texas',
      '"too many pieces" OR "confusing instructions" furniture Texas help',
      '"bed frame assembly" Texas affordable hire help 2025',
      '"desk assembly" OR "bookshelf assembly" OR "dresser assembly" Texas hire',
      'site:craigslist.org Texas "furniture assembly" OR "assemble furniture" needed',
      'site:nextdoor.com Texas "furniture" assembly help hire recommend 2025',
      'site:thumbtack.com "furniture assembly" Texas near affordable',
    ],
  },
  {
    name:"Office Furniture Assembly", emoji:"🖥️", virtual:false, category:"Assembly",
    searches:[
      '"office furniture" assembly Texas hire affordable 2025',
      '"standing desk" OR "sit stand desk" assembly Texas hire help',
      '"home office" furniture setup assembly Texas affordable',
      '"filing cabinet" OR "bookcase" office assembly Texas hire',
      '"conference table" OR "office desk" assembly Texas hire affordable',
      'site:craigslist.org Texas "office furniture" assembly needed',
      'site:thumbtack.com "office furniture assembly" Texas near',
    ],
  },
  {
    name:"Kids Furniture, Toys & Playsets", emoji:"🧸", virtual:false, category:"Assembly",
    searches:[
      '"swing set" OR "playset" assembly Texas hire affordable 2025',
      '"trampoline" assembly OR setup Texas hire affordable',
      '"bunk bed" OR "loft bed" assembly Texas hire affordable',
      '"crib" OR "baby furniture" assembly Texas hire affordable',
      '"playhouse" build OR assemble Texas affordable hire',
      '"outdoor playset" assemble Texas affordable hire someone',
      'site:craigslist.org Texas "playset" OR "swing set" assembly needed',
      'site:nextdoor.com Texas "playset" OR "trampoline" assembly recommend hire',
      'site:thumbtack.com "playset assembly" OR "trampoline assembly" Texas near',
    ],
  },
  {
    name:"Gym & Exercise Equipment Assembly", emoji:"🏋️", virtual:false, category:"Assembly",
    searches:[
      '"treadmill assembly" OR "treadmill setup" Texas hire affordable',
      '"exercise equipment" assembly Texas hire affordable 2025',
      '"peloton" setup OR assembly Texas hire affordable',
      '"weight bench" OR "home gym" assembly Texas hire',
      '"squat rack" OR "power rack" assembly Texas affordable hire',
      '"bowflex" OR "NordicTrack" assembly Texas hire affordable',
      'site:craigslist.org Texas "treadmill" OR "gym equipment" assembly needed',
      'site:nextdoor.com Texas "treadmill" OR "exercise equipment" assembly hire',
      'site:thumbtack.com "exercise equipment assembly" Texas near',
    ],
  },
  {
    name:"Grill & Smoker Assembly", emoji:"🔥", virtual:false, category:"Assembly",
    searches:[
      '"grill assembly" OR "BBQ assembly" Texas hire affordable 2025',
      '"gas grill" setup OR assembly Texas hire affordable',
      '"Traeger" OR "Pit Boss" OR "Weber" assembly Texas hire help',
      '"smoker assembly" Texas hire affordable handyman',
      '"blackstone" OR "flat top grill" assembly Texas hire',
      '"propane" grill hookup OR setup Texas affordable handyman',
      'site:craigslist.org Texas "grill" OR "smoker" assembly needed',
      'site:nextdoor.com Texas "grill assembly" recommend hire 2025',
    ],
  },
  {
    name:"Patio & Outdoor Furniture Assembly", emoji:"⛱️", virtual:false, category:"Assembly",
    searches:[
      '"patio furniture" assembly Texas hire affordable 2025',
      '"patio set" OR "dining set" assembly Texas affordable hire',
      '"porch swing" install OR hang Texas affordable',
      '"hammock" hang OR install Texas affordable handyman',
      '"outdoor sectional" assembly Texas hire affordable',
      'site:craigslist.org Texas "patio furniture" assembly OR setup needed',
      'site:nextdoor.com Texas "patio furniture" assembly recommend hire',
    ],
  },
  {
    name:"Storage Shelving & Closet Organization", emoji:"🗄️", virtual:false, category:"Assembly",
    searches:[
      '"garage shelving" assembly OR install Texas hire affordable',
      '"closet organizer" install OR assemble Texas affordable',
      '"wall shelves" install Texas affordable handyman',
      '"floating shelves" install Texas affordable handyman',
      '"closet system" install Texas affordable hire help',
      '"ClosetMaid" OR "Rubbermaid" OR "Elfa" install Texas affordable',
      'site:craigslist.org Texas "shelving" OR "storage" assembly install needed',
      'site:nextdoor.com Texas "closet organizer" OR "garage shelving" install hire',
      'site:thumbtack.com "shelving installation" OR "closet organizer" Texas near',
    ],
  },

  // ══ SIMPLE INSTALLATIONS ══════════════════════════════════════════════════════
  {
    name:"Ceiling Fan Installation", emoji:"💨", virtual:false, category:"Installation",
    searches:[
      '"ceiling fan install" OR "ceiling fan installation" Texas hire affordable',
      '"new ceiling fan" install Texas affordable handyman 2025',
      '"ceiling fan" replacement Texas affordable hire help',
      '"outdoor ceiling fan" install porch OR patio Texas affordable',
      'site:craigslist.org Texas "ceiling fan" install OR replace needed',
      'site:nextdoor.com Texas "ceiling fan" install recommend hire 2025',
      'site:thumbtack.com "ceiling fan installation" Texas near affordable',
    ],
  },
  {
    name:"Light Fixture & Chandelier Installation", emoji:"💡", virtual:false, category:"Installation",
    searches:[
      '"light fixture" install OR replace Texas hire affordable 2025',
      '"chandelier" install OR hang Texas affordable handyman',
      '"pendant light" OR "recessed lighting" install Texas affordable',
      '"vanity light" install OR replace Texas affordable bathroom',
      '"exterior light" OR "outdoor light" install Texas affordable',
      '"under cabinet lighting" install Texas affordable handyman',
      'site:craigslist.org Texas "light fixture" install OR replace needed',
      'site:nextdoor.com Texas "light fixture" OR "chandelier" install hire recommend',
      'site:thumbtack.com "light fixture installation" Texas near affordable',
    ],
  },
  {
    name:"Faucet & Fixture Installation", emoji:"🚰", virtual:false, category:"Installation",
    searches:[
      '"faucet installation" OR "faucet replace" Texas hire affordable 2025',
      '"kitchen faucet" install OR replace Texas affordable',
      '"bathroom faucet" install OR replace Texas affordable handyman',
      '"shower head" replace OR install Texas affordable',
      '"toilet" install OR replace Texas affordable handyman',
      '"bidet" install Texas affordable handyman help',
      '"outdoor faucet" OR "hose bib" replace install Texas affordable',
      'site:craigslist.org Texas "faucet" install OR replace needed affordable',
      'site:nextdoor.com Texas "faucet" install replace recommend hire 2025',
      'site:thumbtack.com "faucet installation" Texas near affordable',
    ],
  },
  {
    name:"TV & Monitor Mounting", emoji:"📺", virtual:false, category:"Installation",
    searches:[
      '"TV mounting" OR "mount TV" OR "hang TV" Texas affordable hire 2025',
      '"65 inch" OR "75 inch" OR "85 inch" TV mount Texas help hire',
      '"above fireplace" TV mount Texas hire affordable',
      '"full motion mount" OR "tilt mount" install Texas affordable',
      '"hide TV wires" OR "cord concealment" Texas handyman affordable',
      '"outdoor TV" mount OR install Texas affordable handyman',
      '"projector mount" OR "projector screen" install Texas affordable',
      'site:craigslist.org Texas "TV mounting" OR "hang TV" needed affordable',
      'site:nextdoor.com Texas "TV mounting" OR "mount TV" recommend hire 2025',
      'site:thumbtack.com "TV mounting" Texas near affordable',
    ],
  },
  {
    name:"Blinds, Curtain Rods & Window Treatments", emoji:"🪟", virtual:false, category:"Installation",
    searches:[
      '"blinds installation" OR "install blinds" Texas hire affordable 2025',
      '"curtain rod" install Texas affordable handyman hire',
      '"window treatments" install Texas affordable hire help',
      '"cellular shades" OR "roller shades" install Texas affordable',
      '"plantation shutters" install Texas affordable handyman',
      '"motorized blinds" OR "smart blinds" install Texas affordable',
      'site:craigslist.org Texas "blinds" OR "curtain rod" install needed',
      'site:nextdoor.com Texas "blinds" OR "curtains" install recommend hire 2025',
      'site:thumbtack.com "blinds installation" OR "window treatment" Texas near',
    ],
  },
  {
    name:"Picture Hanging & Gallery Walls", emoji:"🖼️", virtual:false, category:"Installation",
    searches:[
      '"picture hanging" OR "hang pictures" Texas hire affordable 2025',
      '"gallery wall" setup OR hang Texas affordable handyman hire',
      '"heavy mirror" hang Texas hire affordable',
      '"floating shelves" install Texas affordable handyman',
      '"large art" OR "oversized mirror" hang Texas affordable',
      'site:craigslist.org Texas "picture hanging" OR "gallery wall" needed',
      'site:nextdoor.com Texas "picture hanging" OR "hang pictures" recommend hire',
    ],
  },
  {
    name:"Bathroom Accessories Installation", emoji:"🪞", virtual:false, category:"Installation",
    searches:[
      '"towel bar" install Texas affordable handyman hire 2025',
      '"bathroom mirror" install OR hang Texas affordable handyman',
      '"toilet paper holder" OR "robe hook" install Texas affordable',
      '"shower curtain rod" install OR replace Texas affordable',
      '"medicine cabinet" install Texas affordable handyman',
      '"grab bar" install bathroom Texas affordable senior',
      'site:craigslist.org Texas "bathroom" install accessories mirror needed',
      'site:nextdoor.com Texas "bathroom" install mirror accessories recommend hire',
    ],
  },
  {
    name:"Garbage Disposal & Kitchen Installs", emoji:"🍽️", virtual:false, category:"Installation",
    searches:[
      '"garbage disposal" install OR replace Texas affordable 2025',
      '"disposal not working" OR "garbage disposal broken" Texas fix',
      '"InSinkErator" OR "Badger" OR "Moen disposal" install Texas',
      '"range hood" install OR replace Texas affordable handyman',
      '"pot filler" install Texas affordable handyman',
      '"under cabinet" lights OR storage install Texas affordable',
      'site:craigslist.org Texas "garbage disposal" OR "kitchen" install needed',
      'site:nextdoor.com Texas "garbage disposal" install recommend hire 2025',
    ],
  },
  {
    name:"Baby Proofing & Child Safety", emoji:"👶", virtual:false, category:"Installation",
    searches:[
      '"baby proofing" OR "childproofing" Texas hire affordable 2025',
      '"baby gates" install Texas hire affordable handyman',
      '"cabinet locks" install Texas affordable handyman',
      '"furniture anchoring" OR "tip straps" install Texas affordable',
      '"stair gates" install Texas affordable handyman',
      'site:reddit.com Texas "baby proofing" hire help affordable 2025',
      'site:nextdoor.com Texas "baby proofing" recommend hire affordable',
      'site:thumbtack.com "baby proofing" OR "childproofing" Texas near',
    ],
  },
  {
    name:"Appliance Hookup & Installation", emoji:"🔧", virtual:false, category:"Installation",
    searches:[
      '"washer dryer hookup" Texas hire affordable 2025',
      '"new appliances" install hookup Texas affordable',
      '"refrigerator water line" install Texas affordable',
      '"ice maker line" install Texas affordable handyman',
      '"gas appliance" hookup install Texas affordable',
      '"dryer vent" install OR reroute Texas affordable',
      '"over range microwave" install Texas affordable handyman',
      '"dishwasher hookup" Texas affordable hire help',
      'site:craigslist.org Texas "appliance hookup" OR "appliance install" needed',
      'site:nextdoor.com Texas "appliance" hookup install recommend hire 2025',
      'site:thumbtack.com "appliance installation" Texas near affordable',
    ],
  },
  {
    name:"Pet Doors & Pet Installs", emoji:"🐾", virtual:false, category:"Installation",
    searches:[
      '"pet door" install OR "dog door" install Texas affordable 2025',
      '"doggy door" install Texas affordable hire help',
      '"pet door" sliding glass OR wall install Texas affordable',
      '"dog run" OR "dog kennel" build Texas affordable',
      '"cat enclosure" OR "catio" build Texas affordable',
      'site:craigslist.org Texas "pet door" OR "dog door" install needed',
      'site:nextdoor.com Texas "pet door" OR "dog door" install recommend hire',
    ],
  },
  {
    name:"Outlet, USB & Smart Outlet Installation", emoji:"🔌", virtual:false, category:"Installation",
    searches:[
      '"USB outlet" install Texas affordable handyman 2025',
      '"GFCI outlet" install OR replace Texas affordable',
      '"outdoor outlet" install Texas affordable handyman hire',
      '"USB-C outlet" OR "smart outlet" install Texas affordable',
      '"220 outlet" OR "240 outlet" install Texas affordable',
      '"garage outlet" install Texas affordable handyman',
      'site:craigslist.org Texas "outlet" install add needed affordable',
      'site:nextdoor.com Texas "outlet" install add recommend hire 2025',
    ],
  },
  {
    name:"Small Odd Jobs Nobody Wants to Do", emoji:"✅", virtual:false, category:"Assembly",
    searches:[
      '"odd jobs" Texas hire affordable handyman 2025',
      '"honey do list" Texas hire handyman affordable 2025',
      '"small jobs" OR "small tasks" Texas hire affordable handyman',
      '"just need someone" Texas small repairs odd jobs affordable',
      '"couple hours" OR "half day" handyman Texas hire affordable',
      '"punch list" house Texas affordable handyman hire',
      '"fix a few things" Texas hire someone affordable handyman',
      '"weekend handyman" Texas hire affordable',
      'site:reddit.com Texas "small repairs" OR "odd jobs" hire handyman affordable 2025',
      'site:nextdoor.com Texas "odd jobs" OR "small tasks" hire handyman recommend',
      'site:craigslist.org Texas "odd jobs" OR "handyman" small tasks needed affordable',
    ],
  },
  // ══ BUILDING PERMIT MONITOR ═══════════════════════════════════════════════════
  {
    name:"Building Permits — East Texas", emoji:"📋", virtual:false, category:"Permits",
    searches:[
      '"building permit" East Texas OR "Camp County" OR "Morris County" 2025 2026',
      '"building permit" Tyler TX OR Longview TX OR Marshall TX 2025 2026',
      '"permit pulled" OR "permit issued" East Texas construction 2025',
      'site:smith-county.com OR site:co.smith.tx.us building permit 2025',
      '"new construction" permit East Texas Tyler Longview 2025',
      '"remodel permit" OR "renovation permit" East Texas 2025',
      '"electrical permit" OR "plumbing permit" East Texas 2025',
      '"deck permit" OR "fence permit" OR "pool permit" East Texas 2025',
      '"Camp County" building permit issued 2025 2026',
      '"Titus County" OR "Morris County" building permit 2025',
    ],
  },
  {
    name:"Building Permits — Texarkana & ArkLaTex", emoji:"📋", virtual:false, category:"Permits",
    searches:[
      '"building permit" Texarkana TX OR AR 2025 2026',
      '"building permit" "Bowie County" OR "Miller County" 2025',
      '"permit" issued Texarkana construction remodel 2025',
      '"building permit" Shreveport OR "Bossier City" LA 2025',
      '"permit" "Caddo Parish" OR "Bossier Parish" 2025',
      '"new home" permit ArkLaTex 2025 construction',
      '"remodel" OR "addition" permit Texarkana 2025',
      '"deck" OR "pool" OR "fence" permit Texarkana area 2025',
    ],
  },
  {
    name:"Building Permits — Oklahoma & North TX", emoji:"📋", virtual:false, category:"Permits",
    searches:[
      '"building permit" Durant OK OR Ardmore OK 2025 2026',
      '"building permit" Sherman TX OR Denison TX 2025',
      '"permit" issued "Bryan County" OR "Marshall County" Oklahoma 2025',
      '"new construction" permit North Texas rural 2025',
      '"remodel permit" Oklahoma rural 2025',
      '"permit" "Grayson County" OR "Lamar County" Texas 2025',
    ],
  },
  {
    name:"New Home Sales — Recent Closings", emoji:"🏠", virtual:false, category:"Permits",
    searches:[
      '"just closed" OR "new homeowner" East Texas Tyler Longview 2025',
      '"sold" East Texas new homeowner need repairs internet 2025',
      '"deed" OR "title transfer" East Texas new owner 2025',
      '"closing disclosure" East Texas new home need handyman',
      '"new listing sold" East Texas Tyler Longview 2025',
      '"recently sold" East Texas homes new owner need work 2025',
      'site:zillow.com "recently sold" Tyler TX OR Longview TX 2025',
      'site:realtor.com "recently sold" East Texas Texarkana 2025',
      '"home sold" East Texas need repairs handyman internet 2025',
      '"moved in" East Texas new home need handyman repairs 2025',
    ],
  },

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
  default: {
    subject: "Local handyman here to help",
    message: `Hi! I'm Dean with Dean's Handyman Service in East Texas. I can help with repairs, installations, assembly, Starlink setup and more. Give me a call: ${PHONE} or visit ${WEBSITE}`
  }
};

function getScript(category) {
  return OUTREACH_SCRIPTS[category] || OUTREACH_SCRIPTS.default;
}

// ─── Scan ─────────────────────────────────────────────────────────────────────
async function scanCombo(zone, region, service) {
  console.log(`  ${service.emoji} ${service.name} — Z${zone.zone} ${region.name}`);
  const city = region.cities[0];
  const city2 = region.cities[1] || region.cities[0];

  // Run 2 Tavily searches
  let searchContext = '';
  for (const q of service.searches.slice(0, 2)) {
    try {
      const sr = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: q,
          search_depth: 'basic',
          max_results: 3,
          include_answer: false,
        }),
      });
      if (sr.ok) {
        const sd = await sr.json();
        for (const r of (sd.results || [])) {
          searchContext += `\nURL: ${r.url}\nTITLE: ${r.title}\nSNIPPET: ${r.content?.slice(0,200)}\n---`;
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1000));
  }

  // Short focused prompt to stay under token limits
  const prompt = `Find people who need "${service.name}" near ${city}, ${region.zip}. Category: ${service.category}.${service.virtual ? ' Also search nationwide for virtual help.' : ''}

Search results:
${searchContext || 'No results — use your knowledge of Reddit, Facebook, Craigslist, Nextdoor for this area.'}

Return ONLY a JSON array of leads (up to 5). Each lead:
{"title":"what they need","snippet":"their situation in 1-2 sentences","service":"${service.name}","serviceEmoji":"${service.emoji}","category":"${service.category}","isVirtual":${service.virtual},"source":"reddit|facebook|nextdoor|craigslist|angi|thumbtack|google","platform":"specific platform","url":"url or empty","contactHint":"username/email/phone or empty","location":"City, State","region":"${region.name}","zone":${zone.zone},"heat":"hot|warm|cold","heatReason":"why they need this","competitorMention":false,"urgency":"immediate|this week|flexible|unknown","estimatedJobValue":"$X-Y or unknown","tags":["tag1"],"posted":"timeframe"}

JSON only, no markdown.`;

  // Groq call with retry on rate limit
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
        max_tokens:  1000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    if (resp.status === 429) {
      const wait = 25000;
      console.log(`    ⏳ Rate limited — waiting 25s...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!resp.ok) { console.error(`    ❌ API error:`, JSON.stringify(data.error||data)); return []; }
    text = data.choices?.[0]?.message?.content || '';
    break;
  }

  if (!text) { console.log(`    No response text`); return []; }

  // Strip markdown code fences if present (Llama often adds them)
  let clean = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Extract JSON array
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) { console.log(`    No JSON array found in response`); return []; }

  try {
    const leads = JSON.parse(match[0]);
    if (!Array.isArray(leads)) { console.log(`    Response was not an array`); return []; }
    const hot  = leads.filter(l=>l.heat==='hot').length;
    const warm = leads.filter(l=>l.heat==='warm').length;
    console.log(`    ✅ ${leads.length} leads (${hot}🔥 ${warm}⚡ ${leads.length-hot-warm}cold)`);
    return leads;
  } catch(e) {
    console.log(`    Parse error: ${e.message}`);
    console.log(`    Raw text sample: ${text.slice(0, 200)}`);
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
// Automatically replies to leads that have a Craigslist URL or direct email
async function autoReply(leads) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  // Load already-replied leads so we never double-reply
  const repliedFile = path.join(__dirname, 'replied.json');
  let replied = [];
  try { replied = JSON.parse(require('fs').readFileSync(repliedFile, 'utf8')); } catch {}
  const repliedSet = new Set(replied);

  let count = 0;
  for (const lead of leads) {
    // Only reply to hot/warm Craigslist leads with a URL
    if (!['hot','warm'].includes(lead.heat)) continue;
    if (!lead.url || !lead.url.includes('craigslist.org')) continue;
    if (repliedSet.has(lead.url)) continue;

    try {
      // Fetch the Craigslist post to get the reply email
      const pageResp = await fetch(lead.url, { headers:{ 'User-Agent':'Mozilla/5.0' } });
      if (!pageResp.ok) continue;
      const html = await pageResp.text();

      // Extract Craigslist anonymized reply email
      const emailMatch = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.craigslist\.org/);
      if (!emailMatch) continue;
      const replyTo = emailMatch[0];

      // Build a short friendly message
      const serviceMsg = lead.service || 'handyman work';
      const body = `Hi there,

I saw your post and wanted to reach out — I'm Dean, a local handyman serving the ${lead.location || 'East Texas / ArkLaTex'} area.

I do ${serviceMsg} and I'm available this week. I'm local, affordable, and reliable.

Give me a call or text anytime: ${PHONE}
Or visit: https://${WEBSITE}

Hope to hear from you!
— Dean
${COMPANY}
${PHONE}`;

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

      // Wait 30s between replies so Gmail doesn't flag as spam
      await new Promise(r => setTimeout(r, 30000));

    } catch(e) {
      console.log(`  ⚠️  Auto-reply failed for ${lead.url}: ${e.message}`);
    }
  }

  // Save replied list
  try { require('fs').writeFileSync(repliedFile, JSON.stringify(replied, null, 2)); } catch {}
  if (count > 0) console.log(`✅ Auto-replied to ${count} Craigslist leads`);
}

// ─── Daily digest ─────────────────────────────────────────────────────────────
async function sendDailyDigest() {
  console.log('☀️  Building 8am digest...');
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const cutoff   = new Date(Date.now() - 24*60*60*1000);
  const threeDaysCutoff = new Date(Date.now() - 3*24*60*60*1000);
  const recent   = existing.filter(l => new Date(l.foundAt) >= cutoff);
  const hot      = recent.filter(l=>l.heat==='hot');
  // Follow-up tracker: hot/warm leads 1-3 days old still marked 'new'
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
  const virt     = recent.filter(l=>l.isVirtual===true||l.isVirtual==='true');
  const immed    = recent.filter(l=>l.urgency==='immediate');
  const internet = recent.filter(l=>l.category==='Internet');
  const newHome  = recent.filter(l=>l.category==='New Homeowner'||l.category==='Real Estate');
  const ranch    = recent.filter(l=>l.category==='Ranch/Farm');
  const biz      = recent.filter(l=>l.category==='Business');
  const storm    = recent.filter(l=>l.category==='Storm');

  // Group by category
  const byCat = {};
  recent.forEach(l=>{
    const c = l.category||'Other';
    if(!byCat[c]) byCat[c]=[];
    byCat[c].push(l);
  });

  const hi = h=>h==='hot'?'🔥':h==='warm'?'⚡':'·';
  const uc = u=>u==='immediate'?'#dc2626':u==='this week'?'#d97706':'transparent';
  const ul = u=>u==='immediate'?'⚡NOW':u==='this week'?'📅WK':'';

  const catOrder = ['Internet','New Homeowner','Real Estate','Ranch/Farm','Business','Storm','Handyman','Specialty','Tech','Virtual','Other'];
  const catEmoji = {Internet:'📡',['New Homeowner']:'🏠',['Real Estate']:'🏡',['Ranch/Farm']:'🤠',Business:'🏪',Storm:'⛈️',Handyman:'🔨',Specialty:'♿',Tech:'📷',Virtual:'💻',Other:'📋'};

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

<!-- Top stats row -->
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:8px">
  ${[['📋 Total',recent.length,'#f8fafc','#334155'],['🔥 Hot',hot.length,'#fef3c7','#92400e'],['⚡ Warm',warm.length,'#eff8ff','#1e40af'],['· Cold',cold.length,'#f9fafb','#64748b'],['⚡ Urgent',immed.length,'#fee2e2','#dc2626']].map(([l,n,bg,c])=>`
  <div style="background:${bg};border:1px solid ${c}33;border-radius:10px;padding:10px;text-align:center">
    <div style="font-size:22px;font-weight:800;color:${c}">${n}</div>
    <div style="font-size:9px;color:${c};font-weight:700;letter-spacing:.05em">${l}</div>
  </div>`).join('')}
</div>
<!-- Category stats row -->
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
  ${needFollowUp.length?`<div style="background:#fdf4ff;border:2px solid #c084fc;border-radius:12px;padding:14px;margin-bottom:12px">
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
  <b>💡 Dean's Daily Playbook:</b><br>
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
  Reddit · Facebook · Nextdoor · Craigslist · Angi · Thumbtack · Yelp · Twitter<br>
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
  const to = process.env.NOTIFY_EMAIL;
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

(async () => {
  console.log(`\n🔨 DEAN'S V6 MAXIMUM OVERDRIVE — Mode: ${RUN_MODE.toUpperCase()}`);
  console.log(`📍 ${BASE} | 50+ Services | FREE: Groq LLM + Tavily Search | No billing needed`);
  console.log(`📅 ${new Date().toISOString()}\n`);

  if (RUN_MODE === 'digest') {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await sendDailyDigest();
    } else { console.warn('⚠️  No Gmail credentials'); }
    process.exit(0);
  }

  const { zone, region, services } = getThisRunTargets();
  console.log(`🗺️  Zone ${zone.zone} (${zone.label}): ${region.name} [${region.zip}]`);
  console.log(`🛠  ${services.length} services: ${services.map(s=>s.emoji+s.name).join(' · ')}`);
  console.log(`🌐 Reddit·FB·Nextdoor·Craigslist·Angi·Thumbtack·Yelp·Twitter·Google\n`);

  let allNew = [];
  try {
    for (const svc of services) {
      const results = await scanCombo(zone, region, svc);
      allNew = allNew.concat(results);
      // Wait 8 seconds between services to avoid rate limits
      await new Promise(r => setTimeout(r, 30000));
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
    // Auto-reply to Craigslist leads
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
