// Dean's Tech & Network Solutions — V7 TECH OVERDRIVE (Groq + Tavily)
// Pittsburg TX 75686 | Spiral from 75686 outward
// FOCUS: Starlink, WiFi, Smart Home, Security Cameras, TV Mounting, Thermostats
// PLATFORMS: Facebook · Nextdoor · Craigslist · Twitter/X · Forums (NO REDDIT)
// TIMEFRAME: Strictly last 14 days
// GOAL: Hundreds of fresh 2026 tech installation leads per day

const fs      = require('fs');
const path    = require('path');

const COMPANY  = "Deans Handyman Service LLC (Tech Division)";
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
      { name: "Paris & Lamar County TX",       zip:"75460", cities:["Paris TX","Clarksville","Honey Grove","Bonham","Powderly","Roxton","Deport","Blossom","Bogata","Detroit TX"] },
      { name: "Sherman & Denison TX",          zip:"75090", cities:["Sherman","Denison","Pottsboro","Durant border","Whitesboro","Gainesville","Gunter","Van Alstyne","Howe","Bells"] },
      { name: "Greenville & Hunt County TX",   zip:"75401", cities:["Greenville","Commerce","Wolfe City","Caddo Mills","Quinlan","Royse City","Rockwall","Fate","Lavon","Nevada TX"] },
      { name: "Dallas Rural & East DFW",       zip:"75126", cities:["Forney","Terrell","Wills Point","Canton","Kaufman","Mabank","Gun Barrel City","Kemp","Athens","Corsicana"] },
    ]
  },
  {
    zone: 2, label: "Extended Reach (200-400mi)", weight: 4,
    regions: [
      { name: "Oklahoma City Metro",     zip:"73101", cities:["Oklahoma City OK","Norman OK","Edmond OK","Yukon OK","Mustang OK","Moore OK","Midwest City OK","Del City OK","Shawnee OK","Chickasha OK"] },
      { name: "Fort Worth & Tarrant TX", zip:"76101", cities:["Fort Worth","Arlington","Mansfield","Burleson","Granbury","Weatherford","Mineral Wells","Stephenville","Glen Rose","Cleburne"] },
      { name: "Central Louisiana",       zip:"71301", cities:["Alexandria LA","Pineville LA","Leesville LA","DeRidder LA","Opelousas LA","Eunice LA","Crowley LA","Jennings LA","Lake Charles LA","Sulphur LA"] },
      { name: "Northwest Arkansas",      zip:"72701", cities:["Fayetteville AR","Springdale AR","Rogers AR","Bentonville AR","Siloam Springs AR","Fort Smith AR","Van Buren AR","Russellville AR","Clarksville AR","Ozark AR"] },
      { name: "Houston Metro East",      zip:"77002", cities:["Houston","Pasadena","Pearland","League City","Deer Park","La Marque","Texas City","Galveston","Friendswood","Alvin"] },
    ]
  }
];

const ROTATION = [];
ZONES.forEach(z=>{ for(let i=0;i<z.weight;i++) ROTATION.push(z); });

// ── TECH ONLY SERVICES ────────────────────────────────────────────────────────
const SERVICES = [
  // ══ STARLINK & INTERNET ═════════════════════════════════════════════════════
  {
    name:"Starlink Installation", emoji:"🛰️", virtual:false, category:"Starlink",
    searches:[
      'nextdoor.com "starlink" "Pittsburg" OR "Tyler" OR "Longview" OR "Texarkana" "anyone install" OR "recommend" OR "need help"',
      'facebook.com /groups "starlink" "East Texas" OR "Tyler" OR "Longview" "need someone" OR "anyone install"',
      '"just got starlink" OR "starlink arrived" "East Texas" OR "Tyler" OR "Longview" need help install mount',
      '"anyone install starlink" OR "can someone install starlink" "East Texas" OR "Tyler" OR "Longview"',
      'craigslist.org texarkana OR tyler OR longview "starlink" install mount setup',
      '"starlink" "pole mount" OR "roof mount" OR "J-mount" cant figure out help "East Texas" OR "Tyler"',
    ],
  },
  {
    name:"HughesNet & Viasat Switchers", emoji:"😡", virtual:false, category:"Internet",
    searches:[
      'facebook.com /groups "hughesnet" OR "viasat" "East Texas" OR "Tyler" "terrible" OR "switching" OR "alternatives"',
      'nextdoor.com "hughesnet" OR "viasat" "Pittsburg" OR "Tyler" OR "Longview" "slow" OR "switching" OR "cancel"',
      '"done with hughesnet" OR "canceling viasat" "East Texas" OR "rural Texas" OR "rural Oklahoma"',
      '"switching to starlink" OR "switched to starlink" "East Texas" OR "rural Texas"',
    ],
  },
  {
    name:"Rural Internet & WiFi Dead Zones", emoji:"📶", virtual:false, category:"Networking",
    searches:[
      'facebook.com /groups "East Texas" OR "Tyler" OR "Longview" "internet" "terrible" OR "what do yall use"',
      'nextdoor.com "wifi" "dead zones" OR "doesnt reach" OR "bad signal" "Pittsburg" OR "Tyler" OR "Longview"',
      '"wifi doesnt reach" OR "no wifi in the shop" OR "no wifi in the barn" "East Texas" fix extend',
      '"ethernet" run OR install shop OR barn OR garage "East Texas" OR "Tyler"',
      '"mesh wifi" confused setup "East Texas" OR "Tyler" OR "Longview" need help install',
    ],
  },

  // ══ SMART HOME & CAMERAS ════════════════════════════════════════════════════
  {
    name:"Security Cameras & Doorbells", emoji:"📷", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "doorbell" OR "ring camera" "Pittsburg" OR "Tyler" OR "Longview" "install" OR "recommend" OR "need someone"',
      'facebook.com /groups "security camera" OR "doorbell camera" "East Texas" OR "Tyler" "need help" OR "anyone install"',
      '"doorbell camera" "just got" OR "just bought" need help install "East Texas"',
      '"ring alarm" OR "simplisafe" setup confused install "East Texas" OR "Tyler" OR "Longview"',
      '"outdoor cameras" install weatherproof "East Texas" OR "Tyler" OR "Longview" affordable',
    ],
  },
  {
    name:"Smart Thermostats & Locks", emoji:"🌡️", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "thermostat" OR "smart lock" "Pittsburg" OR "Tyler" OR "Longview" "install" OR "recommend"',
      'facebook.com /groups "nest" OR "ecobee" OR "keypad lock" "East Texas" OR "Tyler"',
      '"C wire" OR "no C wire" smart thermostat install confused help "East Texas"',
      '"Schlage" OR "Kwikset" OR "August" smart lock install confused "East Texas"',
    ],
  },
  {
    name:"Smart Lighting & Switches", emoji:"💡", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "smart switch" OR "smart lights" "Pittsburg" OR "Tyler" OR "Longview" "anyone install" OR "confused"',
      '"no neutral wire" smart switch install confused "East Texas" OR "Tyler" OR "Longview" help',
      '"motion sensor light" OR "smart flood light" install "East Texas" OR "Tyler"',
    ],
  },

  // ══ AV & TECH INSTALLS ══════════════════════════════════════════════════════
  {
    name:"TV Mounting & Home Theater", emoji:"📺", virtual:false, category:"AV",
    searches:[
      '"mount TV" OR "TV mounting" OR "hang TV" "East Texas" OR "Tyler" need help hire',
      '"65 inch" OR "75 inch" OR "85 inch" mount "East Texas" OR "Tyler" help hire',
      '"above fireplace" TV mount install "East Texas" OR "Tyler" OR "Longview"',
      'nextdoor.com "TV" "mount" OR "hang" "recommend" "Tyler" OR "Longview" OR "Pittsburg"',
      '"surround sound" OR "soundbar" install setup "East Texas" OR "Tyler"',
    ],
  },
  {
    name:"Smart Appliances & EV Chargers", emoji:"⚡", virtual:false, category:"Tech Installs",
    searches:[
      '"EV charger" install OR "electric car charger" install "East Texas" OR "Tyler"',
      '"level 2 charger" install "East Texas" OR "Tyler" OR "Longview"',
      '"smart garage door" install OR setup "East Texas" OR "Tyler" help',
      '"myQ" OR "chamberlain" smart garage install setup help "East Texas"',
    ],
  },
  
  // ══ COMPETITOR & PRICE SHOPPING (Tech Focus) ════════════════════════════════
  {
    name:"Tech DIY Fails", emoji:"😤", virtual:false, category:"DIYFail",
    searches:[
      '"tried to set up" OR "tried to install" camera OR wifi OR starlink "East Texas" need help',
      '"watched the YouTube video" still need help router OR camera OR tv "East Texas"',
      '"wiring wrong" OR "wont connect" OR "offline" camera OR thermostat "East Texas"',
    ],
  },
  {
    name:"Geek Squad / Competitor Intercept", emoji:"🥊", virtual:false, category:"PriceShopper",
    searches:[
      '"Geek Squad" "too expensive" OR "didn\'t show up" "East Texas" OR "Tyler"',
      '"ADT" OR "Vivint" "too expensive" OR "canceling" need security cameras "East Texas"',
      '"waiting weeks for" internet OR install "East Texas" OR "Tyler"',
    ],
  }
];

function getThisRunTargets() {
  const slot   = Math.floor(Date.now() / (10 * 60 * 1000));
  const zone   = ROTATION[slot % ROTATION.length];
  const region = zone.regions[slot % zone.regions.length];
  
  // Pull 3 random tech services
  const svcs = [];
  const shuffled = SERVICES.sort(() => 0.5 - Math.random());
  svcs.push(shuffled[0], shuffled[1], shuffled[2]);

  return { zone, region, services: svcs };
}

// ─── Outreach scripts ─────────────────────────────────────────────────────────
const OUTREACH_SCRIPTS = {
  Starlink: {
    subject: "Local Starlink installer here — I can get you set up",
    message: `Hi! I saw you're looking for help with Starlink. I'm Dean, a local installer in East Texas. I can get your dish properly mounted, run the cables cleanly, and make sure your WiFi covers the whole house. Give me a call: ${PHONE} or visit ${WEBSITE}`
  },
  Internet: {
    subject: "Local internet/tech installer — time to ditch HughesNet",
    message: `Hi! I saw you're frustrated with your current internet. I'm Dean, a local tech installer. I highly recommend switching to Starlink — I can order it for you and do the full installation. It's usually cheaper and way faster. Give me a call: ${PHONE}`
  },
  Networking: {
    subject: "Local WiFi & Network installer here",
    message: `Hey! I'm Dean, a local tech installer in East Texas. If you need WiFi extended to your shop, barn, or just need to eliminate dead zones in the house, I can run ethernet and set up mesh networks. Call or text: ${PHONE}`
  },
  "Smart Home": {
    subject: "Local Smart Home installer — I can set that up",
    message: `Hi! I'm Dean, a local tech and smart home installer. I install Ring cameras, Nest thermostats, smart locks, and video doorbells. I make sure everything is wired right and connected to your phone. Call me: ${PHONE}`
  },
  AV: {
    subject: "Local TV Mounting & AV installer",
    message: `Hey! I'm Dean, a local installer. I can securely mount your TV, hide the wires in the wall, and set up your soundbar or home theater system. Fast and affordable. Call or text: ${PHONE}`
  },
  "Tech Installs": {
    subject: "Local Tech Installer here to help",
    message: `Hi! I'm Dean, a local tech and handyman installer in East Texas. Whether it's an EV charger, smart garage, or other tech device, I can get it installed correctly. Call me: ${PHONE}`
  },
  DIYFail: {
    subject: "I can finish that tech install for you",
    message: `Hi! I'm Dean, a local tech installer. Smart home wiring and networks can be a huge headache — no worries! I can come out, troubleshoot it, and finish the setup for you. Call or text: ${PHONE}`
  },
  PriceShopper: {
    subject: "Skip Geek Squad/ADT — local installer, better prices",
    message: `Hi! I'm Dean, a local tech installer in East Texas. If the big companies quoted you too much or have a long wait, I'd be happy to help. I install cameras, TVs, and networks at fair, straightforward prices. Call me: ${PHONE}`
  },
  default: {
    subject: "Local Tech & Starlink Installer",
    message: `Hi! I'm Dean with Dean's Handyman Service (Tech Division). I install Starlink, smart home devices, cameras, and networks. Give me a call: ${PHONE} or visit ${WEBSITE}`
  }
};

function getScript(category) {
  return OUTREACH_SCRIPTS[category] || OUTREACH_SCRIPTS.default;
}

// ─── Query Builder (No Reddit, Yes Facebook/Nextdoor) ─────────────────────────
function buildHumanQueries(service, region, zone) {
  const city1 = region.cities[0];
  const svc   = service.name.toLowerCase()
    .replace(/ installation$/i,'').replace(/ installer$/i,'')
    .replace(/ setup$/i,'');

  const humanPool = [
    `"${city1}" "need someone" ${svc}`,
    `"${city1}" "looking for" ${svc}`,
    `"${city1}" "anyone recommend" ${svc}`,
    `"${city1}" "help setting up" ${svc}`,
    `site:facebook.com "${city1}" "anyone know" ${svc}`,
    `site:nextdoor.com "${city1}" "looking for" ${svc}`,
    `site:craigslist.org "${city1}" ${svc} wanted`,
  ];

  const hardcoded = service.searches || [];
  const result = [];

  if (hardcoded.length > 0) result.push(hardcoded[Math.floor(Math.random() * hardcoded.length)]);
  if (hardcoded.length > 1) result.push(hardcoded[Math.floor(Math.random() * hardcoded.length)]);
  
  result.push(humanPool[Math.floor(Math.random() * humanPool.length)]);
  result.push(humanPool[Math.floor(Math.random() * humanPool.length)]);

  return result.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// ─── Search API Call (Tavily - Strict 14 Days & Anti-Spam) ────────────────────
async function tavilySearch(query) {
  const cleanQ = query.replace(/\b(2024|2025|2026)\b/g, '').replace(/\s{2,}/g, ' ').trim();

  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: cleanQ,
      search_depth: 'advanced', 
      days: 14, // Strict 14-day limit
      max_results: 15,          
      include_answer: false,
      exclude_domains: [
        'reddit.com', // 🚨 REDDIT COMPLETELY BLOCKED
        'wikipedia.org','amazon.com','ebay.com','walmart.com','bestbuy.com',
        'homedepot.com','lowes.com', 'yelp.com', 'yellowpages.com', 'bbb.org',
        'angi.com', 'homeadvisor.com', 'thumbtack.com', 'taskrabbit.com',
        'porch.com', 'houzz.com', 'expertise.com', 'homeguide.com', 'fixr.com' 
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
    console.log(`    🔄 No results found. Skipping LLM call.`);
    return [];
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `You are a professional lead scraper for Dean's Tech & Network Solutions in ${city} (${region.name}).
TODAY'S DATE IS: ${today}.

WHAT COUNTS AS A REAL LEAD (Look for FIRST-PERSON language: "I need", "my wifi", "we are looking for"):
- Real humans asking for tech, wifi, starlink, TV, or smart home installation help STRICTLY within the LAST 14 DAYS.
- People venting about bad rural internet (HughesNet/Viasat).
- People who bought a smart device/camera/TV and can't figure out how to install it.

WHAT TO REJECT (DO NOT INCLUDE THESE):
- ANYTHING FROM 2025 OR EARLIER. Reject immediately if it implies 2025 or older.
- ANYTHING OLDER THAN 14 DAYS from today's date (${today}). 
- General handyman work (plumbing, wood work, painting). ONLY accept Tech/IT/AV/Smart Home.
- Businesses advertising their own services.
- News articles, SEO directory listings, generic blogs.

Search results:
${searchContext}

IMPORTANT: If there are no real humans asking for TECH help in the last 14 days, return an empty array: []
Do not invent or guess leads. 

Return ONLY a JSON array (up to 5 leads). Each:
{"title":"what they need","snippet":"Exact description of their situation","service":"${service.name}","serviceEmoji":"${service.emoji}","category":"${service.category}","isVirtual":${service.virtual},"source":"platform name","platform":"platform name","url":"url or empty","contactHint":"email/phone or empty","location":"City, State","region":"${region.name}","zone":${zone.zone},"heat":"hot|warm|cold","heatReason":"Why this is hot","competitorMention":true/false,"urgency":"immediate|this week|flexible|unknown","estimatedJobValue":"$X-$Y or unknown","tags":["tag1","tag2"],"posted":"EXACT age based on snippet (e.g., '2 days ago', 'March 10') - MUST BE UNDER 14 DAYS","status":"new"}

JSON only. No markdown. Ensure all quotes are escaped.`;

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
        temperature: 0.1, // Extremely strict
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
  <h2 style="color:#ff9d00;margin:8px 0 4px">HOT TECH LEAD${hotLeads.length>1?'S':''}</h2>
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
    <b style="color:#111;font-size:14px">${l.serviceEmoji||'🛰️'} ${l.title}</b>
    <div style="display:flex;gap:5px;flex-wrap:wrap">
      <span style="background:${uc(l.urgency)};color:white;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700">${ul(l.urgency)}</span>
      ${l.estimatedJobValue&&l.estimatedJobValue!=='unknown'?`<span style="background:#f0fdf4;color:#166534;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700">💰 ${l.estimatedJobValue}</span>`:''}
    </div>
  </div>
  <p style="color:#444;font-size:13px;margin:0 0 8px;line-height:1.5">${l.snippet}</p>
  <div style="font-size:11px;color:#888;margin-bottom:6px">📍 ${l.location||region.name} · ${l.platform||l.source} · ${l.posted||'recent'}</div>
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
  await sendEmail(t, html, `🔥 ${hotLeads.length} HOT Tech Lead${hotLeads.length>1?'s':''} — ${hotLeads[0].service} · ${region.name}`);
}

// ─── Daily digest ─────────────────────────────────────────────────────────────
async function sendDailyDigest() {
  console.log('☀️  Building 8am digest...');
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const cutoff   = new Date(Date.now() - 24*60*60*1000);
  const recent   = existing.filter(l => new Date(l.foundAt) >= cutoff);
  const hot      = recent.filter(l=>l.heat==='hot');
  const warm     = recent.filter(l=>l.heat==='warm');
  const cold     = recent.filter(l=>l.heat==='cold');
  const starlink = recent.filter(l=>l.category==='Starlink');
  const wifi     = recent.filter(l=>l.category==='Networking');
  const smart    = recent.filter(l=>l.category==='Smart Home');
  const av       = recent.filter(l=>l.category==='AV');

  const byCat = {};
  recent.forEach(l=>{
    const c = l.category||'Other';
    if(!byCat[c]) byCat[c]=[];
    byCat[c].push(l);
  });

  const catEmoji = {Starlink:'🛰️',Networking:'📶',['Smart Home']:'📷',AV:'📺',['Tech Installs']:'⚡',Internet:'📡',DIYFail:'😤',PriceShopper:'🥊'};
  
  const catBlocks = Object.keys(byCat).map(cat=>{
    const leads = byCat[cat];
    const sorted = [...leads].sort((a,b)=>(a.heat==='hot'?0:a.heat==='warm'?1:2)-(b.heat==='hot'?0:b.heat==='warm'?1:2));
    return `<div style="background:white;border-radius:12px;padding:18px;margin-bottom:10px">
  <h3 style="margin:0 0 12px;font-size:14px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:7px">
    ${catEmoji[cat]||'⚙️'} ${cat} <span style="color:#64748b;font-weight:400;font-size:12px">(${leads.length} leads)</span>
  </h3>
  ${sorted.map(l=>{
    const bg=l.heat==='hot'?'#fffbeb':l.heat==='warm'?'#f0f9ff':'#f9fafb';
    const bc=l.heat==='hot'?'#f59e0b':l.heat==='warm'?'#93c5fd':'#e5e7eb';
    const tc=l.heat==='hot'?'#92400e':l.heat==='warm'?'#1e40af':'#555';
    return `<div style="background:${bg};border:1px solid ${bc};border-radius:8px;padding:11px;margin-bottom:7px">
    <div style="display:flex;justify-content:space-between;gap:6px;margin-bottom:4px;flex-wrap:wrap">
      <b style="color:#111;font-size:12px">${l.heat==='hot'?'🔥':l.heat==='warm'?'⚡':'·'} ${l.serviceEmoji||'⚙️'} ${l.title}</b>
      <div style="display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0">
        <span style="background:${bc};color:${tc};padding:1px 6px;border-radius:5px;font-size:9px;font-weight:700">${(l.heat||'').toUpperCase()}</span>
      </div>
    </div>
    <p style="color:#444;font-size:11px;margin:0 0 4px;line-height:1.5">${l.snippet}</p>
    <div style="font-size:10px;color:#888">📍 ${l.location||''} · ${l.platform||l.source||'web'} · ${l.posted||'recent'}</div>
    ${l.url?`<a href="${l.url}" style="font-size:10px;color:#2563eb;display:block;margin-top:3px;word-break:break-all">${l.url}</a>`:''}
  </div>`}).join('')}
</div>`;
  }).join('');

  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;background:#f1f5f9">
<div style="background:#04080f;border-radius:14px;padding:26px;text-align:center;margin-bottom:14px">
  <div style="font-size:36px">🚀</div>
  <h2 style="color:#00d4ff;margin:8px 0 2px;font-size:22px">TECH LEADS REPORT</h2>
  <p style="color:#7a9cc0;margin:0 0 4px;font-size:13px">${today}</p>
  <p style="color:#4a6080;margin:0;font-size:11px">${COMPANY} · ${PHONE}</p>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
  ${[['🛰️ Starlink',starlink.length,'#eff8ff','#1d4ed8'],['📶 WiFi',wifi.length,'#f0fdf4','#065f46'],['📷 Smart',smart.length,'#fef3c7','#92400e'],['📺 AV/TV',av.length,'#fdf4ff','#7e22ce']].map(([l,n,bg,c])=>`
  <div style="background:${bg};border:1px solid ${c}33;border-radius:10px;padding:10px;text-align:center">
    <div style="font-size:20px;font-weight:800;color:${c}">${n}</div>
    <div style="font-size:9px;color:${c};font-weight:700">${l}</div>
  </div>`).join('')}
</div>

${recent.length===0 ? `<div style="background:white;border-radius:12px;padding:30px;text-align:center;color:#888;font-size:14px;">No new tech leads in the last 24 hours.</div>` : catBlocks}
</body></html>`;

  const subject = recent.length
    ? `🚀 ${recent.length} Tech Leads — ${starlink.length}🛰️Starlink · ${wifi.length}📶WiFi · ${smart.length}📷Smart Home | ${today}`
    : `🚀 Scanner active, no tech leads yet | ${today}`;

  await sendEmail(t, html, subject);
}

async function sendEmail(transport, html, subject) {
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  if (!to) return;
  try { await transport.sendMail({ from:`"Dean's Tech Leads" <${process.env.GMAIL_USER}>`, to, subject, html }); } catch(e) {}
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const LEADS_FILE = path.join(__dirname, 'leads.json');
let existing = [];
try { existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch {}

(async () => {
  console.log(`\n🚀 DEAN'S TECH OVERDRIVE V7`);
  console.log(`📍 ${BASE} | Starlink · WiFi · AV · Smart Home | NO REDDIT`);
  
  if (RUN_MODE === 'digest') {
    await sendDailyDigest();
    process.exit(0);
  }

  const { zone, region, services } = getThisRunTargets();
  console.log(`🗺️  Zone ${zone.zone}: ${region.name} [${region.zip}]`);
  
  let allNew = [];
  for (const svc of services) {
    const results = await scanCombo(zone, region, svc);
    allNew = allNew.concat(results);
  }

  const existingKeys = new Set(existing.map(l=>(l.title||'').toLowerCase().slice(0,50)));
  const fresh = allNew.filter(l=>!existingKeys.has((l.title||'').toLowerCase().slice(0,50)));
  console.log(`✨ ${fresh.length} new leads found.`);
  
  if (!fresh.length) process.exit(0);

  const stamped = fresh.map(l=>({ ...l, id: `${Date.now()}`, foundAt: new Date().toISOString(), status: 'new' }));
  const merged = [...stamped, ...existing].slice(0, 5000);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2));

  if (process.env.GMAIL_USER) {
    const hotLeads = stamped.filter(l=>l.heat==='hot');
    if (hotLeads.length) await sendHotAlert(hotLeads, region);
  }
  console.log(`✅ Done.`);
})();
