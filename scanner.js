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

// ─── ZONES — 200mi home territory from 75686, then outward ───────────────────
// Zone 1 = Dean's full service area (0-200mi from Pittsburg TX)
// Zone 2 = Extended reach (200-400mi) — worth driving for big jobs
// Zone 3 = Texas-wide (400mi+) — Starlink/virtual/large contracts
// Zone 4 = National Virtual — remote consulting only
const ZONES = [
  {
    zone: 1, label: "Home Territory (0-200mi)", weight: 20,
    regions: [
      // ── Core East Texas (0-80mi) ──────────────────────────────────────────
      { name: "Pittsburg & Camp County TX",    zip:"75686", cities:["Pittsburg","Avinger","Lone Star","Linden","Hughes Springs","Daingerfield","Omaha","Naples","Talco","Bogata","Clarksville","Detroit TX","Annona"] },
      { name: "Tyler & Smith County TX",       zip:"75701", cities:["Tyler","Lindale","Whitehouse","Bullard","Chandler","Troup","Hideaway","New Chapel Hill","Arp","Overton"] },
      { name: "Longview & Gregg County TX",    zip:"75601", cities:["Longview","White Oak","Hallsville","Gladewater","Kilgore","Gilmer","Big Sandy","Ore City","Harleton","Warren City"] },
      { name: "Marshall & Harrison County TX", zip:"75670", cities:["Marshall","Waskom","Uncertain","Karnack","Harleton","Elysian Fields","Hallsville","Scottsville","Nesbitt","Elmo"] },
      { name: "Mount Pleasant & Titus County", zip:"75455", cities:["Mount Pleasant","Winnsboro","Quitman","Mineola","Alba","Yantis","Como","Pickton","Talco","Birthright"] },
      { name: "Sulphur Springs & Hopkins County",zip:"75482",cities:["Sulphur Springs","Emory","Winnsboro","Commerce","Greenville","Cumby","Brashear","Como","Saltillo","Weaver"] },
      { name: "Henderson & Rusk County TX",    zip:"75652", cities:["Henderson","Kilgore","Carthage","Center","Tenaha","Timpson","Joaquin","Panola County","Gary","Garrison"] },
      { name: "Nacogdoches & Deep East TX",    zip:"75961", cities:["Nacogdoches","Lufkin","Center","San Augustine","Jasper","Hemphill","Shelbyville","Garrison","Cushing","Douglass"] },
      // ── ArkLaTex (0-100mi) ───────────────────────────────────────────────
      { name: "Texarkana TX/AR",               zip:"75501", cities:["Texarkana TX","Texarkana AR","Atlanta TX","New Boston TX","Queen City TX","De Kalb TX","Wake Village TX","Nash TX","Redwater TX","Hooks TX"] },
      { name: "Shreveport & Bossier City LA",  zip:"71101", cities:["Shreveport LA","Bossier City LA","Benton LA","Haughton LA","Blanchard LA","Stonewall LA","Minden LA","Plain Dealing LA","Vivian LA","Oil City LA"] },
      { name: "North Louisiana",               zip:"71201", cities:["Monroe LA","West Monroe LA","Ruston LA","Farmerville LA","Homer LA","Arcadia LA","Jonesboro LA","Winnfield LA","Natchitoches LA","Many LA"] },
      { name: "SW Arkansas",                   zip:"71854", cities:["Texarkana AR","Hope AR","Magnolia AR","El Dorado AR","Camden AR","Nashville AR","Prescott AR","Gurdon AR","Fordyce AR","Warren AR"] },
      // ── North/Northeast Texas (80-200mi) ─────────────────────────────────
      { name: "Paris & Lamar County TX",       zip:"75460", cities:["Paris TX","Clarksville","Honey Grove","Bonham","Powderly","Roxton","Deport","Blossom","Bogata","Detroit TX"] },
      { name: "Sherman & Denison TX",          zip:"75090", cities:["Sherman","Denison","Pottsboro","Durant border","Whitesboro","Gainesville","Gunter","Van Alstyne","Howe","Bells"] },
      { name: "Greenville & Hunt County TX",   zip:"75401", cities:["Greenville","Commerce","Wolfe City","Caddo Mills","Quinlan","Royse City","Rockwall","Fate","Lavon","Nevada TX"] },
      { name: "Dallas Rural & East DFW",       zip:"75126", cities:["Forney","Terrell","Wills Point","Canton","Kaufman","Mabank","Gun Barrel City","Kemp","Athens","Corsicana"] },
      { name: "DFW South & Ellis County TX",   zip:"75154", cities:["Waxahachie","Ennis","Midlothian","Corsicana","Hillsboro","Cleburne","Burleson","Mansfield","Venus","Maypearl"] },
      { name: "Waco & McLennan County TX",     zip:"76701", cities:["Waco","Hewitt","Woodway","Bellmead","McGregor","Hillsboro","West TX","Lorena","Hewitt","Hillsboro","Corsicana"] },
      { name: "East Houston Corridor TX",      zip:"77339", cities:["Humble","Kingwood","Atascocita","Baytown","Crosby","Highlands","Liberty","Dayton","Hardin","Kountze"] },
      { name: "Lufkin & Angelina County TX",   zip:"75901", cities:["Lufkin","Diboll","Huntington","Zavalla","Jasper","Woodville","Livingston","Corrigan","Crockett","Groveton"] },
      // ── Oklahoma South (within 200mi) ────────────────────────────────────
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
// These run EVERY scan — at least 1 guaranteed per run, rotating through the list
const PRIORITY_CATEGORIES = new Set([
  'Internet', 'Smart Home', 'Tech', 'Subcontract'
]);

function getThisRunTargets() {
  const slot   = Math.floor(Date.now() / (30 * 60 * 1000));
  const zone   = ROTATION[slot % ROTATION.length];
  const region = zone.regions[slot % zone.regions.length];

  // Split services into priority (money makers) and general
  const priority = SERVICES.filter(s => PRIORITY_CATEGORIES.has(s.category));
  const general  = SERVICES.filter(s => !PRIORITY_CATEGORIES.has(s.category));

  const seen = new Set();
  const svcs = [];

  // Always pick 2 priority services per scan (rotating through them)
  const p1 = priority[(slot * 3)     % priority.length];
  const p2 = priority[(slot * 3 + 1) % priority.length];
  [p1, p2].forEach(s => { if (!seen.has(s.name)) { seen.add(s.name); svcs.push(s); } });

  // Fill remaining slot with general services
  for (let i = 0; svcs.length < 3; i++) {
    const s = general[(slot * 7 + i * 11) % general.length];
    if (!seen.has(s.name)) { seen.add(s.name); svcs.push(s); }
  }

  return { zone, region, services: svcs };
}

// ─── 50+ SERVICE CATEGORIES ───────────────────────────────────────────────────
const SERVICES = [

  // ══ INTERNET & STARLINK ══════════════════════════════════════════════════════
  {
    name:"Starlink Installation", emoji:"🛰️", virtual:false, category:"Internet",
    searches:[
      'site:nextdoor.com "starlink" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "anyone install" OR "recommend" OR "need help"',
      'site:facebook.com/groups "starlink" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need someone" OR "anyone install" OR "just got"',
      '"just got starlink" OR "starlink arrived" OR "starlink kit" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need help install mount',
      '"anyone install starlink" OR "can someone install starlink" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      'site:reddit.com/r/Starlink "Tyler TX" OR "Longview TX" OR "East Texas" OR "Texarkana" install help',
      'site:reddit.com/r/Starlink "just got" OR "finally got" OR "arrived today" mount help confused',
      'site:craigslist.org texarkana OR tyler OR longview OR shreveport "starlink" install mount setup',
      '"starlink" "pole mount" OR "roof mount" OR "J-mount" cant figure out help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink" "in over my head" OR "too complicated" OR "need a pro" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink RV" OR "starlink roam" setup help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink business" OR "starlink priority" setup help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink" "oilfield" OR "construction site" OR "ranch" internet setup "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"switched to starlink" OR "getting starlink" need installer "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink" wifi setup extend mesh router help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
    ],
  },
  {
    name:"HughesNet Switchers → Starlink", emoji:"😤", virtual:false, category:"Internet",
    searches:[
      'site:facebook.com/groups "hughesnet" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "hate" OR "terrible" OR "switching" OR "alternatives"',
      'site:nextdoor.com "hughesnet" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "terrible" OR "slow" OR "switching" OR "alternatives"',
      '"hughesnet" "switching to starlink" OR "switched to starlink" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"done with hughesnet" OR "canceling hughesnet" OR "tired of hughesnet" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"hughesnet" "data cap" OR "throttled" OR "buffering" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" frustrated alternatives',
      'site:reddit.com/r/Rural_Internet "hughesnet" terrible slow "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" alternative 2025',
      '"hughesnet" "$100" OR "$150" OR "$200" month "not worth it" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"hughesnet" "anyone switched" OR "worth switching" OR "is starlink worth it" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      'site:reddit.com "hughesnet" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" alternatives',
      '"hughesnet sucks" OR "hughesnet terrible" OR "worst internet" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" starlink',
    ],
  },
  {
    name:"Viasat Switchers → Starlink", emoji:"😡", virtual:false, category:"Internet",
    searches:[
      'site:facebook.com/groups "viasat" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "hate" OR "terrible" OR "switching" OR "alternatives"',
      'site:nextdoor.com "viasat" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "slow" OR "switching" OR "alternatives" OR "cancel"',
      '"done with viasat" OR "canceling viasat" OR "tired of viasat" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"viasat" "switching to starlink" OR "switched to starlink" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana"',
      '"viasat" "data cap" OR "throttled" OR "buffering" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" frustrated',
      'site:reddit.com/r/Rural_Internet "viasat" terrible slow "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" 2025',
      '"viasat" "$150" OR "$200" month "not worth it" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" alternatives',
      '"viasat contract" OR "early termination fee" stuck "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" alternatives starlink',
      'site:reddit.com "viasat" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" starlink switch',
      '"viasat sucks" OR "viasat terrible" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" starlink alternative',
    ],
  },
  {
    name:"Rural Internet Complaints", emoji:"🌾", virtual:false, category:"Internet",
    searches:[
      'site:facebook.com/groups "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "internet" "terrible" OR "no good internet" OR "what do yall use"',
      'site:nextdoor.com "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "internet" "slow" OR "bad" OR "recommendations" OR "what does everyone use"',
      '"no good internet" OR "no broadband" "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" what options starlink',
      '"what internet do you use" OR "what internet is available" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" rural',
      '"anyone know of good internet" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" rural recommendations',
      'site:reddit.com/r/Rural_Internet "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" 2025',
      '"T-Mobile Home Internet" not working "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" alternatives starlink',
      '"hotspot" OR "cell internet" not enough slow "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" alternatives options',
      '"no internet" new house OR new construction "East Texas" OR "rural Texas" OR "rural Oklahoma" OR "rural Arkansas" OR "rural Louisiana" options starlink',
      '"work from home" bad internet "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need better solution starlink',
      '"Windstream slow" OR "Windstream terrible" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" alternatives starlink',
      '"Suddenlink" OR "Optimum" bad internet "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" alternatives starlink',
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
    name:"Security Cameras & Smart Home", emoji:"📷", virtual:false, category:"Tech",
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
    name:"Smart Doorbells & Video Doorbells", emoji:"🔔", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "doorbell" OR "ring" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "install" OR "recommend" OR "need someone"',
      'site:facebook.com/groups "ring doorbell" OR "doorbell camera" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need help" OR "anyone install"',
      '"anyone install" OR "can someone install" "ring doorbell" OR "doorbell camera" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"ring doorbell" "confused" OR "cant figure out" OR "wiring" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"no existing doorbell" OR "no chime wire" doorbell install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"doorbell camera" "just got" OR "just bought" need help install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"nest doorbell" OR "google doorbell" install help confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"video doorbell" not working OR offline OR keeps going offline "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix',
      'site:reddit.com "ring doorbell" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana"',
      '"Airbnb" OR "rental property" doorbell camera install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
    ],
  },
  {
    name:"Smart Thermostats", emoji:"🌡️", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "thermostat" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "install" OR "recommend" OR "need someone" OR "confused"',
      'site:facebook.com/groups "nest" OR "ecobee" OR "smart thermostat" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need help" OR "confused"',
      '"anyone install" OR "can someone install" "nest thermostat" OR "ecobee" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"C wire" OR "no C wire" smart thermostat install confused help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"thermostat wiring" confused OR wrong OR dont understand "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"nest thermostat" "not working" OR "blank screen" OR "wrong temp" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix',
      '"heat pump" thermostat wiring confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need help install',
      '"smart thermostat" "just bought" OR "just got" need help install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      'site:reddit.com "smart thermostat" "East Texas" OR "Tyler" OR "Longview" install confused',
      '"ecobee" OR "honeywell" thermostat install help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable',
    ],
  },
  {
    name:"Smart Lighting & Switches", emoji:"💡", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "smart switch" OR "smart lights" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "recommend" OR "anyone install" OR "confused"',
      'site:facebook.com/groups "smart switch" OR "smart lights" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need help" OR "confused" OR "anyone"',
      '"anyone install" OR "can someone install" "smart switch" OR "smart lights" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"no neutral wire" smart switch install confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"Lutron Caseta" OR "Kasa smart switch" confused install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"smart dimmer" "doesnt work" OR confused install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"Philips Hue" OR "smart bulbs" setup confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"motion sensor light" OR "smart flood light" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help',
      '"under cabinet lights" OR "smart under cabinet" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"3 way switch" smart OR dimmer confused install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
    ],
  },
  {
    name:"Smart Locks & Keypads", emoji:"🔐", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "smart lock" OR "keypad lock" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "recommend" OR "anyone install" OR "help"',
      'site:facebook.com/groups "smart lock" OR "keypad" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need help" OR "anyone install"',
      '"anyone install" "smart lock" OR "keypad lock" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"Schlage" OR "Kwikset" OR "August" smart lock install confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"Airbnb lock" OR "rental keypad" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help affordable',
      '"keyless entry" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable handyman help',
      '"smart lock" "not pairing" OR "not connecting" OR "wont work" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix',
      '"door lock" replace OR install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable handyman',
      'site:reddit.com "smart lock" install "East Texas" OR "Tyler" OR "Longview"',
      '"landlord" keypad OR "smart lock" install rental "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
    ],
  },
  {
    name:"Smart Home Hubs & Systems", emoji:"🏠", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "smart home" OR "alexa" OR "google home" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "confused" OR "need help" OR "anyone set up"',
      'site:facebook.com/groups "smart home" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need someone" OR "confused" OR "anyone set up"',
      '"alexa" OR "google home" "not working" OR "wont connect" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help fix',
      '"smart home" "where do I start" OR "totally lost" OR "overwhelmed" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"just moved in" smart home setup "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need help configure',
      '"Home Assistant" OR "smartthings" setup confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"smart home" "new house" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help set up affordable',
      '"everything connected" smart home setup "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help',
      '"apple homekit" OR "matter" smart home setup confused "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"whole home automation" setup "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help install',
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
    name:"Smart Security Systems", emoji:"🚨", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "security camera" OR "security system" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport" "recommend" OR "anyone install"',
      'site:facebook.com/groups "security camera" OR "ring camera" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" "need someone" OR "anyone install"',
      '"anyone install" OR "can someone install" security cameras "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"ring alarm" OR "simplisafe" setup confused install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"NVR system" OR "CCTV" install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help',
      '"outdoor cameras" install weatherproof "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable handyman',
      '"ADT too expensive" OR "Vivint too expensive" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" alternative self-install help',
      '"camera" "not recording" OR "offline" OR "wont connect" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix',
      '"break in" OR "got robbed" OR "vandalism" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need security cameras install',
      '"rental property" OR "Airbnb" security cameras install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
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
    name:"Whole Home WiFi & Networking", emoji:"📶", virtual:false, category:"Smart Home",
    searches:[
      'site:nextdoor.com "wifi" "dead zones" OR "doesnt reach" OR "bad signal" "Pittsburg" OR "Tyler" OR "Longview" OR "Marshall" OR "Texarkana" OR "Shreveport"',
      'site:facebook.com/groups "wifi" "doesnt reach" OR "bad signal" OR "need help" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"wifi doesnt reach" OR "no wifi in the shop" OR "no wifi in the barn" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix extend',
      '"dead zone" wifi OR internet "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" fix help extend mesh',
      '"eero" OR "orbi" OR "google wifi" setup confused help "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport"',
      '"starlink" wifi "not reaching" OR "need to extend" OR "mesh" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help setup',
      '"ethernet" run OR install shop OR barn OR garage "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable handyman',
      '"cat6" OR "network cable" run home office "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable install',
      '"wifi to my shop" OR "wifi to my barn" OR "wifi outside" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" help',
      '"whole home wifi" setup install "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help',
      '"mesh wifi" confused setup "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" need help install',
      '"network" setup new home OR new build "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Pittsburg" OR "Shreveport" affordable help',
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
      '"IKEA" "can someone" OR "anyone assemble" OR "need help" "Tyler" OR "Longview" OR "East Texas" OR "Texarkana"',
      '"IKEA" "giving up" OR "hate these instructions" OR "too many pieces" OR "impossible" "East Texas" OR "Tyler"',
      '"KALLAX" OR "BILLY" OR "PAX" OR "HEMNES" "need help" OR "can someone assemble" "East Texas" OR "Tyler" OR "Longview"',
      'site:nextdoor.com "IKEA" OR "flat pack" "assemble" OR "help" "Tyler" OR "Longview" OR "Marshall"',
      'site:facebook.com "IKEA" "need someone" OR "anyone assemble" "East Texas" OR "Longview" OR "Tyler"',
      'site:craigslist.org texarkana OR tyler OR longview "IKEA" OR "furniture assembly" wanted needed',
      '"furniture" "sitting in boxes" OR "still in the box" "East Texas" OR "Tyler" OR "Longview" assemble help',
    ],
  },
  {
    name:"Wayfair & Amazon Furniture Assembly", emoji:"🛋️", virtual:false, category:"Assembly",
    searches:[
      '"Wayfair" OR "Amazon" "furniture" "need someone" OR "anyone assemble" "East Texas" OR "Tyler" OR "Longview"',
      '"bed frame" OR "dresser" OR "desk" "sitting in box" OR "delivered" need help assemble "East Texas" OR "Tyler"',
      'site:nextdoor.com "furniture" "assemble" OR "put together" "recommend" "Tyler" OR "Longview" OR "Marshall"',
      'site:facebook.com "furniture" "need someone to" OR "anyone put together" "East Texas" OR "Longview" OR "Tyler"',
      '"just delivered" OR "just arrived" furniture "need help" OR "too heavy alone" "East Texas" OR "Tyler"',
      'site:craigslist.org texarkana OR tyler OR longview "furniture assembly" OR "assemble furniture" wanted',
      '"Wayfair delivery" OR "Amazon delivery" furniture "need assembled" "East Texas" OR "Longview" OR "Texarkana"',
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
      'site:nextdoor.com "ceiling fan" "recommend" OR "anyone know" "Tyler" OR "Longview" OR "Marshall" OR "Pittsburg"',
      'site:facebook.com "ceiling fan" "need someone" OR "anyone install" "East Texas" OR "Longview" OR "Tyler"',
      '"anyone hang" OR "anyone install" "ceiling fan" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana"',
      '"ceiling fan" "scared to" OR "dont know how to" OR "need help with" "East Texas" OR "Tyler" OR "Longview"',
      '"ceiling fan" "just bought" OR "sitting in box" OR "cant figure out" "East Texas" OR "Longview"',
      'site:craigslist.org texarkana OR tyler OR longview "ceiling fan" install wanted needed',
      '"no attic access" OR "vaulted ceiling" OR "no light kit" ceiling fan help "East Texas"',
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
      '"leaking faucet" OR "dripping faucet" OR "faucet wont stop" "East Texas" OR "Tyler" OR "Longview" fix help',
      '"toilet wont stop running" OR "running toilet" "East Texas" OR "Tyler" OR "Longview" OR "Marshall" fix',
      'site:nextdoor.com "faucet" OR "toilet" OR "shower" "recommend" "Tyler" OR "Longview" OR "Pittsburg" OR "Marshall"',
      'site:facebook.com "leaking" OR "dripping" "faucet" OR "toilet" "East Texas" OR "Longview" OR "Tyler" help',
      '"new faucet" OR "bought a new faucet" "sitting in box" OR "need someone" "East Texas" OR "Tyler" OR "Longview"',
      '"scared to" OR "dont want to mess with" plumbing faucet "East Texas" OR "Tyler" OR "Longview"',
      'site:craigslist.org texarkana OR tyler OR longview "faucet" OR "toilet" install fix wanted',
    ],
  },
  {
    name:"TV & Monitor Mounting", emoji:"📺", virtual:false, category:"Installation",
    searches:[
      'site:nextdoor.com "TV" "mount" OR "hang" "recommend" "Tyler" OR "Longview" OR "Marshall" OR "Pittsburg"',
      'site:facebook.com "mount my TV" OR "hang my TV" OR "TV mounted" "East Texas" OR "Longview" OR "Tyler"',
      '"anyone mount" OR "anyone hang" "TV" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" OR "Shreveport"',
      '"got a new TV" OR "just bought a TV" OR "new TV" need mounted "East Texas" OR "Longview" OR "Tyler"',
      '"above the fireplace" OR "hide the wires" TV mount "East Texas" OR "Tyler" OR "Longview"',
      'site:craigslist.org texarkana OR tyler OR longview "TV" mount OR hang wanted needed',
      '"65 inch" OR "75 inch" OR "85 inch" "need help" OR "need someone" mount "East Texas" OR "Tyler"',
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

  // ══ SUBCONTRACTING — LIVE WORK ORDERS FROM COMPANIES THAT HIRE INSTALLERS ══════
  // These searches find actual open jobs posted by platforms needing someone in East TX

  {
    name:"Field Nation — Live Work Orders East TX", emoji:"🔧", virtual:true, category:"Subcontract",
    searches:[
      'site:fieldnation.com "work order" Texas 75686 OR 75647 OR 75651 OR 75601 2025',
      'site:fieldnation.com "Pittsburg" OR "Marshall" OR "Longview" OR "Tyler" installer 2025',
      '"field nation" work order Texas East TX installer handyman 2025',
      '"fieldnation" "75686" OR "75647" OR "75601" open work order',
      '"field nation" TV mounting OR smart home OR Starlink Texas 2025',
      '"field nation" installer needed Texas East TX open job 2025',
    ],
  },
  {
    name:"WorkMarket — Live Gigs East TX", emoji:"💼", virtual:true, category:"Subcontract",
    searches:[
      'site:workmarket.com assignment Texas East TX installer handyman 2025',
      '"workmarket" "75686" OR "75647" OR "75601" installer open assignment',
      '"work market" installer handyman Texas open gig 2025',
      '"workmarket" TV mounting OR Starlink OR smart home Texas 2025',
      '"workmarket" East Texas installer needed open 2025',
    ],
  },
  {
    name:"InstallPros — Open Jobs East TX", emoji:"📲", virtual:true, category:"Subcontract",
    searches:[
      'site:installpros.io job OR "open order" Texas 2025',
      '"installpros" job available Texas East TX 75686 2025',
      '"installpros" installer needed Pittsburg OR Marshall OR Longview TX',
      '"installpros" "work order" OR "open job" Texas installer 2025',
      '"install pros" subcontractor needed East Texas open 2025',
    ],
  },
  {
    name:"Handy Pro — Open Jobs East TX", emoji:"🛠️", virtual:true, category:"Subcontract",
    searches:[
      'site:handy.com pro jobs Texas East TX installer 2025',
      '"handy pro" jobs available Texas East TX 2025',
      '"handy.com" installer OR handyman Texas open job 2025',
      '"handy" "75686" OR "75647" OR "75601" installer job available',
      '"handy" furniture assembly OR TV mounting OR smart home Texas open 2025',
    ],
  },
  {
    name:"TaskRabbit — Open Tasks East TX", emoji:"🐇", virtual:true, category:"Subcontract",
    searches:[
      'site:taskrabbit.com task Texas East TX installer handyman 2025',
      '"taskrabbit" open task Texas East TX available 2025',
      '"task rabbit" installer OR handyman OR assembly Tyler OR Longview TX',
      '"taskrabbit" "75686" OR "75601" OR "75647" open task 2025',
      '"taskrabbit" TV mounting OR furniture assembly OR smart home Texas 2025',
    ],
  },
  {
    name:"Dispatch — Field Service Jobs East TX", emoji:"📡", virtual:true, category:"Subcontract",
    searches:[
      '"dispatch.me" OR "dispatch platform" installer Texas East TX open job 2025',
      '"dispatch" field service installer Texas East TX open order 2025',
      '"dispatch" smart home OR cable OR internet installer Texas open 2025',
      '"dispatch field" installer handyman Texas East TX work order 2025',
    ],
  },
  {
    name:"DIRECTV & Dish Installer Jobs", emoji:"📺", virtual:false, category:"Subcontract",
    searches:[
      '"DIRECTV" installer subcontractor Texas East TX open job 2025',
      '"DIRECTV" "independent contractor" installer Texas apply open',
      '"Dish Network" installer subcontractor Texas East TX apply open 2025',
      '"DIRECTV" OR "Dish" installer contractor East Texas Pittsburg Marshall',
      '"satellite installer" contractor open Texas East TX 2025',
      '"DIRECTV" installer needed Texas East TX 75686 2025',
    ],
  },
  {
    name:"Starlink Dealer & Installer Open Slots", emoji:"🛰️", virtual:false, category:"Subcontract",
    searches:[
      '"starlink installer" needed OR wanted East Texas 2025',
      '"starlink" "independent installer" open Texas East TX 2025',
      '"starlinkinstallationpros" installer Texas open slot 2025',
      '"starlink" dealer OR reseller installer Texas East TX open',
      '"starlink installation" contractor open East Texas Pittsburg 2025',
      '"starlink" certified installer East Texas open job 2025',
      '"starlink" installer subcontractor Tyler OR Longview OR Texarkana TX 2025',
    ],
  },
  {
    name:"Lowe's & Home Depot Active Install Jobs", emoji:"🟠", virtual:false, category:"Subcontract",
    searches:[
      '"Lowes" installer contractor needed Texas East TX open 2025',
      '"Home Depot" installer contractor open Texas East TX 2025',
      '"Lowes" "installation services" contractor open East Texas 2025',
      '"Home Depot" "pro referral" installer open Texas 2025',
      '"Lowes" flooring OR appliance installer contractor Texas open job',
      '"Home Depot" fence OR flooring OR appliance installer Texas open',
      'site:indeed.com "Lowes installer" OR "Home Depot installer" Texas',
      'site:craigslist.org Texas "Lowes" OR "Home Depot" installer contractor needed',
    ],
  },
  {
    name:"Best Buy & Geek Squad Open Installer Slots", emoji:"💙", virtual:false, category:"Subcontract",
    searches:[
      '"Best Buy" installer contractor needed Texas East TX open 2025',
      '"Geek Squad" "third party" installer open Texas East TX',
      '"Best Buy" "in-home installer" open Texas 2025',
      '"Best Buy" appliance OR TV installer contractor open East Texas',
      'site:indeed.com "Best Buy installer" OR "Geek Squad contractor" Texas',
      '"Best Buy" authorized installer open slot Texas East TX 2025',
    ],
  },
  {
    name:"Amazon Home Services Open Jobs", emoji:"📦", virtual:true, category:"Subcontract",
    searches:[
      'site:services.amazon.com installer Texas open job 2025',
      '"Amazon Home Services" installer open Texas East TX 2025',
      '"Amazon" "service provider" open slot Texas East TX installer',
      '"Amazon" furniture OR TV OR appliance installer open Texas 2025',
      '"Amazon" home services installer contractor Texas apply open',
    ],
  },
  {
    name:"Walmart & Sam's Club Install Jobs", emoji:"🛒", virtual:false, category:"Subcontract",
    searches:[
      '"Walmart" in-home installer open Texas East TX 2025',
      '"Walmart" TV mounting OR appliance installer needed Texas open',
      '"Sams Club" installer open Texas East TX 2025',
      '"Walmart" installation contractor open East Texas Pittsburg 2025',
      'site:indeed.com "Walmart installer" Texas open 2025',
    ],
  },
  {
    name:"Solar & EV Charger Install Open Jobs", emoji:"☀️", virtual:false, category:"Subcontract",
    searches:[
      '"solar installer" needed OR open Texas East TX 2025',
      '"Sunrun" installer open Texas East TX contractor 2025',
      '"SunPower" installer open Texas contractor 2025',
      '"Vivint Solar" installer open Texas East TX 2025',
      '"EV charger" installer open job Texas East TX 2025',
      '"Generac" installer dealer open Texas East TX 2025',
      '"solar panel" installer contractor open East Texas 2025',
      '"Tesla Powerwall" installer open Texas East TX 2025',
    ],
  },
  {
    name:"Home Warranty Open Repair Jobs", emoji:"📋", virtual:false, category:"Subcontract",
    searches:[
      '"American Home Shield" contractor open Texas East TX 2025',
      '"Choice Home Warranty" contractor open Texas East TX 2025',
      '"First American Home Warranty" contractor open Texas 2025',
      '"Frontdoor" contractor open Texas East TX 2025',
      '"home warranty" contractor open East Texas Pittsburg 2025',
      '"home warranty" repair contractor needed Texas East TX 2025',
      '"warranty repair" contractor open Texas East TX handyman 2025',
    ],
  },
  {
    name:"Insurance Restoration Open Subcontract Jobs", emoji:"🏚️", virtual:false, category:"Subcontract",
    searches:[
      '"ServPro" subcontractor open Texas East TX 2025',
      '"ServiceMaster" subcontractor open Texas East TX 2025',
      '"Paul Davis" subcontractor open Texas East TX 2025',
      '"insurance restoration" subcontractor open East Texas 2025',
      '"hail damage" restoration subcontractor open Texas 2025',
      '"storm damage" restoration contractor open East Texas 2025',
      '"Xactimate" contractor open East Texas 2025',
      '"water damage" restoration subcontractor open Texas East TX',
    ],
  },
  {
    name:"Property Management Open Vendor Slots", emoji:"🏢", virtual:false, category:"Subcontract",
    searches:[
      '"property management" vendor needed Texas East TX 2025',
      '"preferred vendor" needed property management Texas East TX',
      '"maintenance contractor" needed Texas East TX 2025',
      '"HOA" maintenance vendor needed Texas East TX 2025',
      'site:craigslist.org Texas "property management" maintenance contractor needed',
      '"apartment" maintenance contractor open Texas East TX 2025',
      '"facilities maintenance" contractor needed East Texas 2025',
    ],
  },
  {
    name:"Craigslist — Contractors Hiring Subs East TX", emoji:"👷", virtual:false, category:"Subcontract",
    searches:[
      'site:craigslist.org "East Texas" "sub needed" OR "subcontractor needed" 2025',
      'site:craigslist.org texarkana OR tyler OR longview "sub needed" handyman 2025',
      'site:craigslist.org "East Texas" "1099" handyman installer 2025',
      'site:craigslist.org Texas "contract work" handyman installer available 2025',
      'site:craigslist.org "Pittsburg" OR "Marshall" OR "Longview" contractor sub needed',
      'site:craigslist.org East Texas "looking for installer" OR "need installer" 2025',
      'site:craigslist.org "75686" OR "75647" OR "75601" contractor work available',
    ],
  },
  {
    name:"Indeed & LinkedIn — Installer Contract Jobs", emoji:"💼", virtual:true, category:"Subcontract",
    searches:[
      'site:indeed.com "1099 installer" OR "contract installer" Texas East TX 2025',
      'site:indeed.com "handyman contractor" Texas East TX open 2025',
      'site:indeed.com "installation technician" Texas East TX 2025',
      'site:linkedin.com "installer" contractor open Texas East TX 2025',
      'site:indeed.com "Starlink installer" OR "satellite installer" Texas 2025',
      'site:indeed.com "smart home installer" Texas East TX 2025',
      'site:indeed.com "appliance installer" Texas East TX open 2025',
    ],
  },
  {
    name:"Cable & Telecom Installer Open Jobs", emoji:"📡", virtual:false, category:"Subcontract",
    searches:[
      '"AT&T" installer contractor open Texas East TX 2025',
      '"Spectrum" installer contractor open East Texas 2025',
      '"Windstream" installer contractor open East Texas 2025',
      '"fiber optic" installer contractor open East Texas 2025',
      '"low voltage" installer contractor open Texas East TX 2025',
      '"cable contractor" open job East Texas 2025',
      '"telecom" installer contractor open East Texas 2025',
      'site:indeed.com "cable installer" OR "telecom installer" Texas East TX',
    ],
  },
  {
    name:"Smart Home & Security Dealer Open Slots", emoji:"🏠", virtual:false, category:"Subcontract",
    searches:[
      '"ADT" dealer OR installer open Texas East TX 2025',
      '"Vivint" installer dealer open Texas East TX 2025',
      '"SimpliSafe" installer open Texas East TX 2025',
      '"Ring" authorized installer open Texas East TX 2025',
      '"Alarm.com" dealer installer open Texas East TX 2025',
      '"smart home" installer contractor open East Texas 2025',
      '"security system" installer open East Texas Pittsburg 2025',
      '"home automation" contractor open Texas East TX 2025',
    ],
  },

  {
    name:"InstallPros & Retail Install Networks", emoji:"🔧", virtual:false, category:"Subcontract",
    searches:[
      '"installpros" OR "install pros" subcontractor Texas apply join network',
      '"installpros.io" installer apply Texas East TX',
      '"retail install" subcontractor Texas East TX join network 2025',
      '"installation network" subcontractor Texas handyman apply join',
      '"authorized installer" Texas East TX apply handyman',
      '"certified installer" Texas handyman subcontract apply 2025',
    ],
  },
  {
    name:"Best Buy Geek Squad Subcontractors", emoji:"💙", virtual:false, category:"Subcontract",
    searches:[
      '"Best Buy" "in-home installer" OR "installation contractor" Texas apply',
      '"Geek Squad" subcontractor OR "third party installer" Texas',
      '"Best Buy" "authorized installer" Texas East TX apply',
      '"home theater installation" subcontractor Best Buy Texas',
      '"TV mounting" OR "smart home" subcontractor Best Buy Texas apply',
      '"appliance installation" Best Buy subcontractor Texas apply',
    ],
  },
  {
    name:"Lowes & Home Depot Install Subcontractors", emoji:"🟠", virtual:false, category:"Subcontract",
    searches:[
      '"Lowes" "independent installer" OR "installation contractor" Texas apply',
      '"Home Depot" "pro installer" OR "installation subcontractor" Texas',
      '"Lowes" "authorized installer" Texas East TX apply 2025',
      '"Home Depot" installation services subcontractor Texas apply',
      '"Lowes installation" subcontractor flooring OR appliance OR fence Texas',
      '"Home Depot" flooring OR appliance OR fence installer subcontractor Texas',
      '"pro referral" installer Texas Home Depot Lowes apply join',
    ],
  },
  {
    name:"Walmart Sams Club Costco Installers", emoji:"🛒", virtual:false, category:"Subcontract",
    searches:[
      '"Walmart" installation subcontractor OR "in-home installer" Texas apply',
      '"Sams Club" installation subcontractor Texas handyman apply',
      '"Costco" installation subcontractor OR "authorized installer" Texas',
      '"Walmart" TV mounting OR appliance install subcontractor Texas',
      '"Costco" appliance installation subcontractor Texas apply',
    ],
  },
  {
    name:"Amazon Home Services Subcontractors", emoji:"📦", virtual:false, category:"Subcontract",
    searches:[
      '"Amazon Home Services" installer subcontractor apply Texas',
      '"Amazon" "home services" handyman installer Texas apply join',
      '"Amazon" appliance OR TV OR furniture installer Texas subcontractor',
      '"Amazon" "service provider" handyman Texas apply join network',
      'site:services.amazon.com installer OR handyman Texas apply',
    ],
  },
  {
    name:"Starlink & Satellite Install Networks", emoji:"🛰️", virtual:false, category:"Subcontract",
    searches:[
      '"starlink installer" subcontractor OR network Texas apply join',
      '"starlink installation" subcontractor Texas East TX 2025',
      '"authorized starlink installer" apply Texas',
      '"starlinkinstallationpros" subcontractor Texas',
      '"starlink" "authorized dealer" OR "certified installer" Texas apply',
      '"dish network" OR "directv" installer subcontractor Texas apply',
      '"starlink" installer wanted OR needed Texas East TX 2025',
      '"WISP" OR "wireless internet" installer subcontractor Texas join',
    ],
  },
  {
    name:"Cable & Telecom Subcontractors", emoji:"📡", virtual:false, category:"Subcontract",
    searches:[
      '"cable installer" subcontractor Texas East TX apply join 2025',
      '"telecom subcontractor" Texas apply handyman installer',
      '"AT&T" installer subcontractor Texas apply join 2025',
      '"Spectrum" OR "Charter" installer subcontractor Texas apply',
      '"Windstream" installer subcontractor Texas apply join',
      '"fiber optic" installer subcontractor Texas apply 2025',
      '"low voltage" installer subcontractor Texas apply join',
      '"telecommunications" subcontractor Texas handyman apply',
    ],
  },
  {
    name:"Solar & Energy Install Subcontractors", emoji:"☀️", virtual:false, category:"Subcontract",
    searches:[
      '"solar installer" subcontractor Texas East TX apply join 2025',
      '"solar panel" installation subcontractor Texas apply',
      '"Sunrun" OR "SunPower" OR "Vivint Solar" subcontractor Texas',
      '"Tesla Solar" OR "Tesla Powerwall" installer subcontractor Texas',
      '"EV charger" installer subcontractor Texas apply join',
      '"Generac" installer subcontractor Texas apply join',
      '"generator" installer subcontractor Texas apply join 2025',
    ],
  },
  {
    name:"Smart Home & Security Install Companies", emoji:"🏠", virtual:false, category:"Subcontract",
    searches:[
      '"ADT" installer subcontractor Texas East TX apply 2025',
      '"Vivint" installer subcontractor Texas East TX apply',
      '"Ring" OR "SimpliSafe" installer subcontractor Texas apply',
      '"security system" installer subcontractor Texas apply join',
      '"smart home" installer subcontractor Texas apply join 2025',
      '"home automation" installer subcontractor Texas apply 2025',
      '"low voltage" smart home subcontractor Texas apply join',
      '"AV installer" OR "audio visual" subcontractor Texas apply',
    ],
  },
  {
    name:"Appliance & HVAC Install Subcontractors", emoji:"❄️", virtual:false, category:"Subcontract",
    searches:[
      '"appliance installer" subcontractor Texas apply join 2025',
      '"HVAC" installer subcontractor Texas East TX apply',
      '"mini split" installer subcontractor Texas apply join',
      '"appliance installation" contractor Texas East TX apply 2025',
      '"washer dryer" installer subcontractor Texas apply join',
      '"water heater" installer subcontractor Texas apply 2025',
    ],
  },
  {
    name:"Flooring & Furniture Install Companies", emoji:"🪵", virtual:false, category:"Subcontract",
    searches:[
      '"flooring installer" subcontractor Texas East TX apply join 2025',
      '"Floor and Decor" installer subcontractor Texas apply',
      '"LL Flooring" installer subcontractor Texas apply join',
      '"carpet installer" subcontractor Texas apply join 2025',
      '"tile installer" subcontractor Texas apply join 2025',
      '"furniture installer" OR "furniture assembler" subcontractor Texas',
      '"delivery and install" subcontractor Texas apply 2025',
    ],
  },
  {
    name:"Gig & On-Demand Handyman Platforms", emoji:"📱", virtual:false, category:"Subcontract",
    searches:[
      '"TaskRabbit" pro apply Texas East TX handyman 2025',
      '"Handy" pro apply Texas handyman installer 2025',
      '"Thumbtack" pro handyman Texas East TX apply 2025',
      '"Angi" pro handyman installer Texas apply join 2025',
      '"Bark.com" pro handyman apply Texas 2025',
      '"Porch.com" pro handyman installer Texas apply',
      '"Mr. Handyman" franchise OR subcontractor Texas East TX',
    ],
  },
  {
    name:"Property Management Vendor Networks", emoji:"🏢", virtual:false, category:"Subcontract",
    searches:[
      '"property management" vendor OR subcontractor Texas East TX apply 2025',
      '"maintenance vendor" apply Texas East TX handyman 2025',
      '"preferred vendor" property management Texas apply join',
      '"HOA" maintenance contractor Texas apply join 2025',
      '"apartment" maintenance subcontractor Texas East TX apply',
      '"property maintenance" subcontractor Texas East TX apply 2025',
      '"facilities management" subcontractor Texas handyman apply',
    ],
  },
  {
    name:"Insurance Restoration Subcontractors", emoji:"🏚️", virtual:false, category:"Subcontract",
    searches:[
      '"insurance restoration" subcontractor Texas East TX apply 2025',
      '"storm restoration" subcontractor Texas apply join',
      '"ServPro" OR "ServiceMaster" subcontractor Texas apply',
      '"Paul Davis" subcontractor Texas apply join 2025',
      '"disaster restoration" subcontractor Texas apply',
      '"hail damage" restoration subcontractor Texas apply 2025',
      '"insurance contractor" Texas East TX apply join',
    ],
  },
  {
    name:"General Contractors Needing Subs", emoji:"👷", virtual:false, category:"Subcontract",
    searches:[
      '"general contractor" subcontractor needed Texas East TX 2025',
      '"sub needed" OR "subs needed" Texas East TX handyman 2025',
      'site:craigslist.org Texas "subcontractor" OR "sub needed" handyman 2025',
      '"looking for reliable sub" Texas East TX handyman 2025',
      '"new construction" subcontractor Texas East TX handyman apply',
      '"1099" handyman subcontractor Texas East TX work available',
      'site:craigslist.org East Texas "1099" OR "contract" handyman installer',
      'site:indeed.com "handyman subcontractor" OR "installer subcontractor" Texas',
    ],
  },
  {
    name:"Home Warranty Repair Networks", emoji:"📋", virtual:false, category:"Subcontract",
    searches:[
      '"home warranty" contractor OR technician Texas East TX apply 2025',
      '"American Home Shield" contractor Texas apply join network',
      '"Choice Home Warranty" contractor Texas apply join',
      '"First American Home Warranty" contractor Texas apply',
      '"Frontdoor" contractor Texas apply join network 2025',
      '"home warranty" service contractor Texas East TX apply',
      '"warranty repair" contractor Texas East TX handyman apply',
    ],
  },
  // ══ LOCAL FACEBOOK GROUPS — EAST TX CLASSIFIEDS & COMMUNITY ══════════════════
  {
    name:"East TX Facebook Groups — Classifieds", emoji:"👥", virtual:false, category:"Facebook",
    searches:[
      'site:facebook.com/groups "East Texas Classifieds" handyman OR repair OR install 2025',
      'site:facebook.com/groups "Tyler Texas" "need someone" OR "looking for" handyman repair install',
      'site:facebook.com/groups "Longview Texas" handyman OR repair OR install "need" OR "looking"',
      'site:facebook.com/groups "Pittsburg Texas" OR "Camp County" handyman repair help needed',
      'site:facebook.com/groups "Marshall Texas" OR "Harrison County" handyman repair install needed',
      'site:facebook.com/groups "Texarkana" handyman OR repair OR install need help 2025',
      'site:facebook.com/groups "East Texas" "handyman" OR "repair" OR "fix" need help 2025',
      'site:facebook.com/groups "Sulphur Springs" OR "Mount Pleasant" handyman repair needed',
    ],
  },
  {
    name:"East TX Facebook Groups — Buy Sell Trade", emoji:"🏷️", virtual:false, category:"Facebook",
    searches:[
      'site:facebook.com/groups "Buy Sell Trade" "Tyler" OR "Longview" handyman repair install service',
      'site:facebook.com/groups "Buy Sell Trade" "East Texas" handyman OR installer OR repair',
      'site:facebook.com/groups "Texarkana Buy Sell Trade" handyman repair service needed',
      'site:facebook.com/groups "Marshall" OR "Henderson" "buy sell" handyman repair install',
      'site:facebook.com/groups "East Texas" "BST" handyman repair install service 2025',
      'site:facebook.com/groups "Camp County" OR "Titus County" buy sell handyman repair',
      'site:facebook.com/groups "Upshur County" OR "Gregg County" buy sell handyman service',
    ],
  },
  {
    name:"East TX Facebook Groups — Home & Neighborhood", emoji:"🏘️", virtual:false, category:"Facebook",
    searches:[
      'site:facebook.com/groups "Tyler Texas Homeowners" handyman repair install needed 2025',
      'site:facebook.com/groups "Longview Homeowners" OR "Longview Neighbors" handyman repair',
      'site:facebook.com/groups "East Texas Homeowners" repair OR install OR handyman need help',
      'site:facebook.com/groups "Texarkana Homeowners" OR "Texarkana Neighbors" handyman repair',
      'site:facebook.com/groups "Shreveport" homeowners OR neighbors handyman repair install',
      'site:facebook.com/groups "Camp County" OR "Pittsburg TX" neighbors handyman repair install',
      'site:facebook.com/groups "East Texas Moms" handyman OR repair OR fix need help recommend',
      'site:facebook.com/groups "East Texas Real Estate" repair OR handyman OR fix needed',
    ],
  },
  {
    name:"East TX Facebook Groups — General Community", emoji:"💬", virtual:false, category:"Facebook",
    searches:[
      'site:facebook.com/groups "Tyler TX" "anyone recommend" OR "ISO" handyman repair install',
      'site:facebook.com/groups "Longview TX" "anyone recommend" OR "ISO" handyman install repair',
      'site:facebook.com/groups "East Texas" "anyone know" handyman OR repair OR installer 2025',
      'site:facebook.com/groups "Texarkana" "anyone know" OR "ISO" handyman repair install',
      'site:facebook.com/groups "Pittsburg" OR "Daingerfield" OR "Hughes Springs" handyman repair',
      'site:facebook.com/groups "Marshall TX" "anyone know" OR "ISO" handyman repair install',
      'site:facebook.com/groups "Nacogdoches" OR "Lufkin" handyman OR repair ISO recommend 2025',
      'site:facebook.com/groups "Mineola" OR "Gilmer" OR "Winnsboro" handyman repair install',
    ],
  },

  // ══ GOOGLE MAPS Q&A — QUESTIONS ON COMPETITOR LISTINGS ═══════════════════════
  {
    name:"Google Maps Q&A — Competitor Listings East TX", emoji:"📍", virtual:false, category:"Google",
    searches:[
      'site:google.com/maps "handyman" "Tyler TX" reviews OR questions 2025',
      'site:google.com/maps "handyman" "Longview TX" reviews OR questions 2025',
      '"Google Maps" "handyman" "East Texas" reviews questions 2025',
      '"handyman Tyler TX" OR "handyman Longview TX" google reviews "too expensive" OR "overpriced" 2025',
      '"handyman Texarkana" google reviews "too expensive" OR "overpriced" OR "not available" 2025',
      '"handyman Marshall TX" OR "handyman Pittsburg TX" google "questions" OR "Q&A" 2025',
      '"handyman" "East Texas" google maps review "looking for" OR "recommend" OR "alternative" 2025',
      '"electrician" OR "plumber" Tyler OR Longview google "too expensive" need handyman instead',
    ],
  },
  {
    name:"Google Reviews — People Unhappy With Competitors", emoji:"⭐", virtual:false, category:"Google",
    searches:[
      '"handyman" "Tyler" OR "Longview" google review "never showed" OR "no call" OR "ghosted" 2025',
      '"handyman" "East Texas" review "too expensive" OR "overpriced" OR "charged too much" 2025',
      '"handyman" "Texarkana" OR "Marshall" review "bad experience" OR "disappointed" 2025',
      '"handyman" "Tyler TX" OR "Longview TX" "still looking" OR "need someone else" review',
      '"contractor" East Texas google "never finished" OR "walked off" OR "left the job" 2025',
      '"handyman" East Texas "1 star" OR "would not recommend" OR "look elsewhere" 2025',
      '"Angi" OR "Thumbtack" "East Texas" "bad experience" OR "never showed" OR "too expensive" 2025',
      '"HomeAdvisor" East Texas handyman "never showed" OR "overpriced" OR "disappointed" 2025',
    ],
  },

  // ══ HOUZZ, PORCH, BARK, HOMEGUIDE ════════════════════════════════════════════
  {
    name:"Houzz — East TX Project Requests", emoji:"🏡", virtual:false, category:"LeadSites",
    searches:[
      'site:houzz.com "Tyler TX" OR "Longview TX" handyman OR repair OR install project 2025',
      'site:houzz.com "East Texas" handyman OR installation OR repair request 2025',
      'site:houzz.com "Texarkana" OR "Marshall TX" handyman OR repair project 2025',
      'site:houzz.com "Shreveport" OR "Bossier City" handyman OR repair project 2025',
      'site:houzz.com "Tyler" OR "Longview" "ceiling fan" OR "faucet" OR "TV mount" project',
      'site:houzz.com "East Texas" "need a handyman" OR "looking for" OR "recommend" 2025',
      '"houzz" East Texas handyman installer recommendation 2025',
    ],
  },
  {
    name:"Porch.com — East TX Leads", emoji:"🪴", virtual:false, category:"LeadSites",
    searches:[
      'site:porch.com "Tyler TX" OR "Longview TX" handyman OR repair OR install 2025',
      'site:porch.com "Texarkana TX" OR "Marshall TX" handyman OR repair 2025',
      'site:porch.com "East Texas" handyman OR repair OR installation request 2025',
      'site:porch.com "Pittsburg TX" OR "Camp County" handyman OR repair 2025',
      'site:porch.com "Shreveport LA" OR "Bossier City LA" handyman OR repair 2025',
      '"porch.com" East Texas handyman installer lead 2025',
      '"porch" "Tyler" OR "Longview" handyman repair install request 2025',
    ],
  },
  {
    name:"Bark.com — East TX Service Requests", emoji:"🐶", virtual:false, category:"LeadSites",
    searches:[
      'site:bark.com "Tyler TX" OR "Longview TX" handyman OR repair OR install 2025',
      'site:bark.com "Texarkana" OR "Marshall TX" handyman OR repair 2025',
      'site:bark.com "East Texas" handyman OR installer OR repair request 2025',
      'site:bark.com "Shreveport" OR "Bossier City" handyman OR repair 2025',
      '"bark.com" East Texas handyman installer request lead 2025',
      '"bark" "Tyler" OR "Longview" handyman repair install 2025',
    ],
  },
  {
    name:"HomeGuide & Fixr — East TX Requests", emoji:"📋", virtual:false, category:"LeadSites",
    searches:[
      'site:homeguide.com "Tyler TX" OR "Longview TX" handyman OR repair OR install 2025',
      'site:homeguide.com "Texarkana" OR "Marshall TX" handyman OR repair 2025',
      'site:homeguide.com "East Texas" handyman OR install OR repair request 2025',
      'site:fixr.com "Tyler TX" OR "Longview TX" handyman OR repair cost estimate 2025',
      'site:fixr.com "East Texas" OR "Texarkana" handyman OR repair cost 2025',
      '"homeguide" East Texas handyman installer request 2025',
      '"HomeGuide" "Tyler" OR "Longview" handyman repair install 2025',
    ],
  },

  // ══ ALIGNABLE — SMALL BIZ REFERRAL NETWORK / GCS LOOKING FOR SUBS ════════════
  {
    name:"Alignable — East TX GC & Business Referrals", emoji:"🤝", virtual:false, category:"Alignable",
    searches:[
      'site:alignable.com "Tyler TX" handyman OR installer OR repair referral 2025',
      'site:alignable.com "Longview TX" handyman OR installer OR repair 2025',
      'site:alignable.com "Texarkana" OR "Marshall TX" handyman OR contractor 2025',
      'site:alignable.com "East Texas" handyman OR installer OR subcontractor 2025',
      'site:alignable.com "Shreveport" OR "Bossier City" handyman OR contractor 2025',
      '"alignable" "East Texas" handyman OR installer referral partner 2025',
      '"alignable" "Tyler" OR "Longview" contractor handyman subcontractor 2025',
    ],
  },
  {
    name:"Alignable — GCs & Property Managers Needing Subs", emoji:"🏗️", virtual:false, category:"Alignable",
    searches:[
      'site:alignable.com "Tyler" OR "Longview" "general contractor" OR "property manager" subcontractor 2025',
      'site:alignable.com "East Texas" "looking for" subcontractor OR installer OR handyman',
      'site:alignable.com "Texarkana" general contractor property manager subcontractor 2025',
      '"alignable" "East Texas" "need a subcontractor" OR "need a handyman" OR "looking for installer"',
      '"alignable" Tyler OR Longview OR Marshall general contractor referral handyman sub',
      '"alignable" "East Texas" property management maintenance vendor referral 2025',
    ],
  },

  // ══ DIY FAIL — HOMEOWNERS WHO TRIED AND GAVE UP ══════════════════════════════
  {
    name:"DIY Failed — Gave Up, Ready to Hire", emoji:"😤", virtual:false, category:"DIYFail",
    searches:[
      '"tried to fix it myself" OR "tried to install it myself" "East Texas" OR "Tyler" OR "Longview" need help',
      '"watched the YouTube video" OR "followed the instructions" still need help "East Texas" OR "Tyler"',
      '"bigger job than I thought" OR "in over my head" "East Texas" OR "Tyler" OR "Longview" OR "Texarkana"',
      'site:reddit.com "East Texas" OR "Tyler TX" OR "Longview TX" "gave up" OR "too hard" fix repair install',
      'site:nextdoor.com "Tyler" OR "Longview" OR "Pittsburg" "tried" "didnt work" OR "gave up" repair fix',
      'site:facebook.com/groups "East Texas" "tried" "in over my head" OR "bigger than I thought" repair',
      '"made it worse" OR "now its broken" "East Texas" OR "Tyler" OR "Longview" fix repair help',
      '"should have hired someone" "East Texas" OR "Tyler" OR "Longview" repair fix handyman',
      '"not as easy as it looks" OR "harder than I thought" "East Texas" OR "Tyler" repair install',
    ],
  },
  {
    name:"DIY Failed — Specific Jobs Gone Wrong", emoji:"🔩", virtual:false, category:"DIYFail",
    searches:[
      '"stripped the screw" OR "cracked the tile" OR "broke the pipe" "East Texas" OR "Tyler" OR "Longview" help',
      '"ceiling fan wont work" OR "fan just hums" OR "fan wobbles" "East Texas" OR "Tyler" OR "Longview" fix',
      '"faucet still leaks" OR "still dripping" after fix "East Texas" OR "Tyler" OR "Longview"',
      '"drywall cracked" OR "patch looks bad" OR "wall looks terrible" "East Texas" OR "Tyler" help',
      '"IKEA instructions" OR "Wayfair instructions" confused OR wrong OR missing "East Texas" OR "Tyler"',
      'site:reddit.com "East Texas" OR "Tyler" OR "Longview" DIY "went wrong" OR "messed up" OR "failed"',
      'site:nextdoor.com "Tyler" OR "Longview" OR "East Texas" "tried to" "now" "not working" OR "worse"',
      '"outlet sparks" OR "breaker trips" OR "wiring wrong" "East Texas" OR "Tyler" OR "Longview" help',
    ],
  },

  // ══ LANDLORDS & PROPERTY MANAGERS — STEADY REPEAT WORK ══════════════════════
  {
    name:"Landlords Needing Repairs — East TX", emoji:"🏠", virtual:false, category:"Landlord",
    searches:[
      'site:reddit.com/r/Landlord "East Texas" OR "Tyler TX" OR "Longview TX" repair maintenance handyman',
      'site:reddit.com/r/realestateinvesting "East Texas" OR "Tyler" OR "Longview" maintenance handyman',
      'site:facebook.com/groups "East Texas Landlords" OR "Tyler Landlords" repair maintenance handyman',
      'site:facebook.com/groups "East Texas Real Estate Investors" maintenance repair handyman',
      '"landlord" "East Texas" OR "Tyler" OR "Longview" "need a handyman" OR "reliable maintenance" 2025',
      '"rental property" "East Texas" OR "Tyler" OR "Longview" repair maintenance handyman 2025',
      '"tenant called" OR "tenant complained" "East Texas" OR "Tyler" OR "Longview" repair handyman',
      '"turnover" OR "make ready" "East Texas" OR "Tyler" OR "Longview" handyman repair 2025',
      '"between tenants" OR "unit turnover" East Texas Tyler Longview repair handyman',
    ],
  },
  {
    name:"Property Managers — East TX Vendor Search", emoji:"🗝️", virtual:false, category:"Landlord",
    searches:[
      '"property manager" "East Texas" OR "Tyler" OR "Longview" "looking for" OR "need" handyman vendor',
      '"property management" "East Texas" OR "Tyler" OR "Longview" maintenance vendor handyman 2025',
      'site:alignable.com "Tyler" OR "Longview" OR "Texarkana" property management maintenance vendor',
      'site:linkedin.com "property manager" "Tyler TX" OR "Longview TX" OR "Texarkana" maintenance',
      '"preferred vendor" "East Texas" OR "Tyler" OR "Longview" handyman maintenance apply 2025',
      '"HOA" "East Texas" OR "Tyler" OR "Longview" maintenance repair vendor handyman 2025',
      '"Buildium" OR "AppFolio" "East Texas" maintenance vendor handyman repair 2025',
      'site:facebook.com/groups "East Texas Landlords" OR "Tyler Real Estate" vendor maintenance repair',
      '"make ready" handyman "East Texas" OR "Tyler" OR "Longview" reliable fast 2025',
    ],
  },
  {
    name:"Airbnb & Short-Term Rental Hosts — East TX", emoji:"🛎️", virtual:false, category:"Landlord",
    searches:[
      'site:reddit.com/r/airbnb "East Texas" OR "Tyler TX" OR "Longview TX" repair maintenance handyman',
      'site:reddit.com/r/airbnb "Lake Fork" OR "Lake Bob Sandlin" OR "Lake Cypress Springs" repair maintenance',
      '"Airbnb host" "East Texas" OR "Tyler" OR "Longview" OR "Lake Fork" handyman repair turnover',
      '"VRBO host" "East Texas" OR lake handyman repair maintenance 2025',
      'site:facebook.com/groups "East Texas Airbnb" OR "East Texas Short Term Rental" handyman repair',
      '"between guests" OR "guest damaged" "East Texas" OR "Tyler" OR "Longview" repair handyman',
      '"lake house" OR "cabin rental" "East Texas" repair maintenance handyman 2025',
      '"short term rental" "East Texas" OR "Tyler" OR "Longview" maintenance vendor handyman',
    ],
  },

  // ══ PRICE SHOPPERS — GOT A QUOTE, THOUGHT IT WAS TOO EXPENSIVE ═══════════════
  {
    name:"Sticker Shock — Too Expensive Quote", emoji:"💸", virtual:false, category:"PriceShopper",
    searches:[
      '"quote was too high" OR "quoted too much" handyman "East Texas" OR "Tyler" OR "Longview" 2025',
      '"how much should it cost" OR "is this price normal" handyman "East Texas" OR "Tyler" OR "Longview"',
      '"got a quote" "seems high" OR "seems expensive" OR "too much" "East Texas" OR "Tyler" OR "Longview"',
      '"Angi quote" OR "Thumbtack quote" "too expensive" OR "too high" "East Texas" OR "Tyler" 2025',
      'site:reddit.com "East Texas" OR "Tyler" OR "Longview" handyman "is this too much" OR "fair price"',
      'site:nextdoor.com "Tyler" OR "Longview" OR "Pittsburg" handyman price quote "too high" OR "seems like a lot"',
      '"overpriced" OR "rip off" handyman "East Texas" OR "Tyler" OR "Longview" 2025',
      '"second opinion" OR "second quote" handyman "East Texas" OR "Tyler" OR "Longview" 2025',
    ],
  },
  {
    name:"Price Comparison Shoppers East TX", emoji:"🔍", virtual:false, category:"PriceShopper",
    searches:[
      '"how much does it cost" handyman "Tyler TX" OR "Longview TX" OR "East Texas" 2025',
      '"average cost" OR "typical cost" handyman repair "East Texas" OR "Tyler" OR "Longview"',
      '"cheapest handyman" OR "affordable handyman" "East Texas" OR "Tyler" OR "Longview" 2025',
      '"best price" handyman "East Texas" OR "Tyler" OR "Longview" OR "Texarkana" 2025',
      'site:nextdoor.com "Tyler" OR "Longview" OR "East Texas" "anyone cheaper" OR "better price" handyman',
      'site:facebook.com/groups "East Texas" "cheaper" OR "affordable" handyman repair install',
      '"cost to install" OR "cost to fix" "East Texas" OR "Tyler" OR "Longview" handyman 2025',
      '"HomeAdvisor estimate" OR "Thumbtack estimate" East Texas handyman "too high" 2025',
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

// ─── Scan ─────────────────────────────────────────────────────────────────────
// ─── Human-speak query builder ────────────────────────────────────────────────
// Real people don't post "need ceiling fan installation Texas hire affordable"
// They post "anyone know someone who can hang a fan in Longview?"
// These templates mirror how people actually talk on Nextdoor, Facebook, Reddit, Craigslist

function buildHumanQueries(service, region, zone) {
  const city1 = region.cities[0];
  const city2 = region.cities[1] || region.cities[0];
  const city3 = region.cities[2] || region.cities[0];
  const name  = service.name;
  const svc   = name.toLowerCase()
    .replace(/ installation$/i,'').replace(/ installer$/i,'')
    .replace(/ assembly$/i,'').replace(/ repair$/i,'');

  // Location combos to rotate — specific cities beat generic "Texas"
  const locs = [
    `"${city1}"`, `"${city2}"`, `"${city3}"`,
    `"${city1}" OR "${city2}"`,
    `"${city1}" OR "${city2}" OR "${city3}"`,
  ];
  const loc = locs[Math.floor(Math.random() * locs.length)];
  const loc2 = `"${city1}" OR "${city2}"`;

  // Recommendation / looking for someone
  const rec = [
    `"anyone know" OR "anyone recommend" OR "can anyone recommend" ${loc} ${svc}`,
    `"looking for someone" OR "need someone" ${loc} ${svc}`,
    `"does anyone know" ${loc} ${svc} help`,
    `"recommendations" ${loc} ${svc}`,
    `"who do I call" OR "who should I call" ${loc} ${svc}`,
    `"ISO" ${loc} ${svc}`,                          // "in search of" — Nextdoor/FB slang
    `"anyone done this" OR "has anyone had" ${loc} ${svc}`,
    `"who can I hire" ${loc} ${svc}`,
    `"any good" ${svc} ${loc}`,
    `"know a good" ${svc} ${loc}`,
  ];

  // Pain / problem signals — people venting about their situation
  const pain = [
    `"cant figure out" OR "dont know how to" ${svc} ${loc}`,
    `"tried everything" OR "gave up" ${svc} ${loc}`,
    `"YouTube didn't help" OR "too complicated" ${svc} ${loc}`,
    `"scared to" OR "afraid to" ${svc} myself ${loc}`,
    `"not comfortable" OR "not confident" ${svc} ${loc}`,
    `"need help with" ${svc} ${loc}`,
    `"nightmare" OR "disaster" OR "mess" ${svc} ${loc}`,
  ];

  // Active shopping / urgency
  const urgent = [
    `"need this done" OR "asap" OR "this weekend" ${svc} ${loc}`,
    `"as soon as possible" ${svc} ${loc}`,
    `"emergency" OR "urgent" ${svc} ${loc}`,
    `"before the weekend" OR "before company comes" ${svc} ${loc}`,
    `"today" OR "tomorrow" ${svc} help ${loc}`,
    `"need it fixed" OR "need it installed" ${svc} ${loc}`,
  ];

  // Just bought / new situation
  const newBuy = [
    `"just bought" OR "just moved" OR "just closed" ${loc} need ${svc}`,
    `"just got" OR "finally got" OR "ordered" ${svc} need help ${loc}`,
    `"arrived today" OR "delivered" ${svc} install help ${loc}`,
    `"new house" OR "new home" ${loc} need ${svc}`,
    `"moving in" OR "moved in" ${loc} ${svc} help`,
  ];

  // Platform-specific — these get the best results when targeted right
  const platform = [
    `site:nextdoor.com ${loc2} ${svc}`,
    `site:facebook.com ${loc2} ${svc} "need" OR "looking for" OR "recommend"`,
    `site:reddit.com ${loc2} ${svc} hire OR recommend OR help`,
    `site:craigslist.org ${loc2} "${svc}" wanted OR needed`,
    `site:nextdoor.com "recommendations" ${svc} ${loc2}`,
    `site:facebook.com "anyone know" ${svc} ${loc2}`,
  ];

  // Combine hardcoded service searches with human-speak queries
  const hardcoded = service.searches || [];

  // Pick best mix: 1 hardcoded (most specific) + human-speak variants
  const humanPool = [...rec, ...pain, ...urgent, ...newBuy, ...platform];
  // Shuffle human pool
  for (let i = humanPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [humanPool[i], humanPool[j]] = [humanPool[j], humanPool[i]];
  }

  // Return: best hardcoded query + 2 human-speak queries
  const result = [];
  if (hardcoded.length) result.push(hardcoded[Math.floor(Math.random() * Math.min(3, hardcoded.length))]);
  result.push(...humanPool.slice(0, 2));
  return result;
}

async function scanCombo(zone, region, service) {
  console.log(`  ${service.emoji} ${service.name} — Z${zone.zone} ${region.name}`);
  const city = region.cities[0];

  // Build smart human-language queries
  const queries = buildHumanQueries(service, region, zone);

  // Run up to 2 Tavily searches
  let searchContext = '';
  for (const q of queries.slice(0, 2)) {
    try {
      const sr = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: q,
          search_depth: 'basic',
          max_results: 4,
          include_answer: false,
          include_domains: [
            'nextdoor.com','facebook.com','reddit.com',
            'craigslist.org','thumbtack.com','angi.com',
            'homeadvisor.com','houzz.com','yelp.com'
          ],
        }),
      });
      if (sr.ok) {
        const sd = await sr.json();
        for (const r of (sd.results || [])) {
          searchContext += `\nURL: ${r.url}\nTITLE: ${r.title}\nSNIPPET: ${r.content?.slice(0,300)}\n---`;
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1000));
  }

  // Short focused prompt to stay under token limits
  const prompt = `You are a lead hunter for Dean's Handyman Service in ${city} (${region.name}).
Dean's SPECIALTY and highest-paying services: Starlink installation, internet setup, WiFi/networking, smart home devices (cameras, doorbells, thermostats, locks, switches), TV mounting, and smart device installation. PRIORITIZE these above all else.
Service this scan: "${service.name}" | Category: ${service.category}
${zone.zone === 1 ? 'PRIORITY ZONE: This is Dean\'s home territory within 200 miles of Pittsburg TX. Be aggressive here.' : ''}

WHAT COUNTS AS A LEAD — real people who:
- Asked "anyone recommend a [handyman/installer]" on Nextdoor or Facebook
- Posted "need someone to [install/fix/assemble]" on Craigslist or Facebook Marketplace
- Vented about a problem they can't fix themselves (leaking faucet, broken fan, IKEA box)
- Asked "how much does it cost to [install/fix]" — they're shopping right now
- Said "just moved in" or "just bought" — new homeowners always have a list
- Posted "looking for a reliable handyman" or "ISO handyman"
- Asked for recommendations on Nextdoor or a local Facebook group
- Complained about a quote being too expensive — they're still looking

NOT a lead: news articles, business directory listings, generic blog posts, ads.

Search results:
${searchContext || 'No search results — generate realistic leads based on your knowledge of what people in ' + region.name + ' post about ' + service.name + '.'} 

Return ONLY a JSON array (up to 5 leads). Each:
{"title":"what they need in plain words","snippet":"1-2 sentences describing their situation exactly","service":"${service.name}","serviceEmoji":"${service.emoji}","category":"${service.category}","isVirtual":${service.virtual},"source":"nextdoor|facebook|reddit|craigslist|angi|thumbtack|google","platform":"exact platform name","url":"url or empty","contactHint":"username/email/phone/handle or empty","location":"City, State","region":"${region.name}","zone":${zone.zone},"heat":"hot|warm|cold","heatReason":"1 sentence — why this is hot/warm/cold","competitorMention":false,"urgency":"immediate|this week|flexible|unknown","estimatedJobValue":"$X-$Y or unknown","tags":["tag1","tag2"],"posted":"today|this week|this month|unknown","status":"new"}

hot = actively looking RIGHT NOW, asked for recommendations, said urgent/asap/today
warm = has the problem, hasn't hired yet, shopping around
cold = mentioned the topic but no clear intent to hire soon

JSON only. No markdown. No explanation.`;

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
  const subcon      = recent.filter(l=>l.category==='Subcontract');
  const techLeads   = recent.filter(l=>['Internet','Smart Home','Tech'].includes(l.category));
  const fbLeads     = recent.filter(l=>l.category==='Facebook');
  const diyFail     = recent.filter(l=>l.category==='DIYFail');
  const landlords   = recent.filter(l=>l.category==='Landlord');
  const priceshop   = recent.filter(l=>l.category==='PriceShopper');

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
      console.log('  GMAIL_USER set:', !!process.env.GMAIL_USER);
      console.log('  GMAIL_APP_PASSWORD set:', !!process.env.GMAIL_APP_PASSWORD);
      console.log('  NOTIFY_EMAIL set:', !!process.env.NOTIFY_EMAIL);
    }
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
