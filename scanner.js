// Dean's Tech & Network Solutions — V10 24/7 CONTINUOUS HUNTER
// Pittsburg TX 75686 | Spiral from 75686 outward
// FOCUS: Starlink, WiFi, Smart Home, Security Cameras, TV Mounting, Thermostats
// MEMORY: Uses seen.json to NEVER return a lead you've already seen.
// BEHAVIOR: Runs 24/7. Hunts for leads, sleeps, wakes up, repeats.

const fs      = require('fs');
const path    = require('path');

const COMPANY  = "Deans Handyman Service LLC (Tech Division)";
const PHONE    = "281-917-9914";
const WEBSITE  = "deanshandymanservice.me";
const BASE     = "Pittsburg TX 75686";

// ⚙️ 24/7 ENGINE SETTINGS
const TARGET_LEADS = 5;               // Goal per hunting session
const MAX_LOOPS    = 10;              // Max loops per session before forcing a break
const SESSION_DELAY_MINUTES = 15;     // How long to sleep between hunting sessions (saves API credits)
const DIGEST_HOUR  = 8;               // Sends daily email at 8 AM

// 🛑 BANNED KEYWORDS
const BANNED_KEYWORDS = [
  "w-2", "full-time", "salary", "hiring manager", 
  "background check", "drug test", "hourly rate"
];

// ─── ZONES ───────────────────────────────────────────────────────────────────
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
  {
    name:"Starlink Installation", emoji:"🛰️", virtual:false, category:"Starlink",
    searches:[
      'nextdoor.com "starlink" "Pittsburg" OR "Tyler" OR "Longview" OR "Texarkana" "anyone install" OR "recommend" OR "need help"',
      'facebook.com /groups "starlink" "East Texas" OR "Tyler" OR "Longview" "need someone" OR "anyone install"',
      '"just got starlink" OR "starlink arrived" "East Texas" OR "Tyler" OR "Longview" need help install mount',
      '"anyone install starlink" OR "can someone install starlink" "East Texas" OR "Tyler" OR "Longview"',
      'craigslist.org texarkana OR tyler OR longview "starlink" install mount setup',
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
    ],
  },
  {
    name:"Security Cameras & Doorbells", emoji:"📷", virtual:false, category:"Smart Home",
    searches:[
      'nextdoor.com "doorbell" OR "ring camera" "Pittsburg" OR "Tyler" OR "Longview" "install" OR "recommend" OR "need someone"',
      'facebook.com /groups "security camera" OR "doorbell camera" "East Texas" OR "Tyler" "need help" OR "anyone install"',
      '"doorbell camera" "just got" OR "just bought" need help install "East Texas"',
      '"ring alarm" OR "simplisafe" setup confused install "East Texas" OR "Tyler" OR "Longview"',
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
    name:"TV Mounting & Home Theater", emoji:"📺", virtual:false, category:"AV",
    searches:[
      '"mount TV" OR "TV mounting" OR "hang TV" "East Texas" OR "Tyler" need help hire',
      '"65 inch" OR "75 inch" OR "85 inch" mount "East Texas" OR "Tyler" help hire',
      '"above fireplace" TV mount install "East Texas" OR "Tyler" OR "Longview"',
      'nextdoor.com "TV" "mount" OR "hang" "recommend" "Tyler" OR "Longview" OR "Pittsburg"',
    ],
  },
  {
    name:"Smart Appliances & EV Chargers", emoji:"⚡", virtual:false, category:"Tech Installs",
    searches:[
      '"EV charger" install OR "electric car charger" install "East Texas" OR "Tyler"',
      '"level 2 charger" install "East Texas" OR "Tyler" OR "Longview"',
      '"smart garage door" install OR setup "East Texas" OR "Tyler" help',
    ],
  },
  {
    name:"Tech DIY Fails", emoji:"😤", virtual:false, category:"DIYFail",
    searches:[
      '"tried to set up" OR "tried to install" camera OR wifi OR starlink "East Texas" need help',
      '"watched the YouTube video" still need help router OR camera OR tv "East Texas"',
    ],
  }
];

function getThisRunTargets(offset = 0) {
  const slot   = Math.floor(Date.now() / (10 * 60 * 1000)) + offset;
  const zone   = ROTATION[slot % ROTATION.length];
  const region = zone.regions[slot % zone.regions.length];
  
  const svcs = [];
  const shuffled = [...SERVICES].sort(() => 0.5 - Math.random());
  svcs.push(shuffled[0], shuffled[1], shuffled[2]);

  return { zone, region, services: svcs };
}

// ─── Query Builder ─────────────────────────
function buildHumanQueries(service, region, zone) {
  const city1 = region.cities[0];
  const svc   = service.name.toLowerCase().replace(/ installation$/i,'').replace(/ installer$/i,'').replace(/ setup$/i,'');

  const humanPool = [
    `"${city1}" "need someone" ${svc}`,
    `"${city1}" "looking for" ${svc}`,
    `"${city1}" "anyone recommend" ${svc}`,
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
      days: 14, 
      max_results: 15,          
      include_answer: false,
      exclude_domains: [
        'reddit.com', 'wikipedia.org','amazon.com','ebay.com','walmart.com','bestbuy.com',
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
    console.log(`    🔄 No results found. Skipping LLM.`);
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
{"title":"what they need","snippet":"Exact description of their situation","service":"${service.name}","serviceEmoji":"${service.emoji}","category":"${service.category}","isVirtual":${service.virtual},"source":"platform name","platform":"platform name","url":"url or empty","contactHint":"email/phone or empty","location":"City, State","region":"${region.name}","zone":${zone.zone},"heat":"hot|warm|cold","heatReason":"Why this is hot","competitorMention":true/false,"urgency":"immediate|this week|flexible|unknown","estimatedJobValue":"$X-$Y or unknown","tags":["tag1","tag2"],"posted":"EXACT age based on snippet - MUST BE UNDER 14 DAYS","status":"new"}

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
        temperature: 0.1, 
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
    return leads;
  } catch(e) {
    console.log(`    Parse error: ${e.message}`);
    return [];
  }
}

// ─── Daily digest ─────────────────────────────────────────────────────────────
async function sendDailyDigest(existing) {
  if (!process.env.GMAIL_USER) return;
  console.log('☀️  Building and sending 8 AM digest email...');
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const cutoff = new Date(Date.now() - 24*60*60*1000);
  const recent = existing.filter(l => new Date(l.foundAt) >= cutoff);
  const starlink = recent.filter(l=>l.category==='Starlink');
  const wifi     = recent.filter(l=>l.category==='Networking');
  const smart    = recent.filter(l=>l.category==='Smart Home');
  const av       = recent.filter(l=>l.category==='AV');
  
  const todayStr = new Date().toLocaleDateString();

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;background:#f1f5f9">
  <div style="background:#04080f;border-radius:14px;padding:26px;text-align:center;margin-bottom:14px">
    <div style="font-size:36px">🚀</div>
    <h2 style="color:#00d4ff;margin:8px 0 2px;font-size:22px">TECH LEADS REPORT</h2>
    <p style="color:#7a9cc0;margin:0 0 4px;font-size:13px">${todayStr}</p>
    <p style="color:#4a6080;margin:0;font-size:11px">${COMPANY} · ${PHONE}</p>
  </div>
  
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
    ${[['🛰️ Starlink',starlink.length,'#eff8ff','#1d4ed8'],['📶 WiFi',wifi.length,'#f0fdf4','#065f46'],['📷 Smart',smart.length,'#fef3c7','#92400e'],['📺 AV/TV',av.length,'#fdf4ff','#7e22ce']].map(([l,n,bg,c])=>`
    <div style="background:${bg};border:1px solid ${c}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-size:20px;font-weight:800;color:${c}">${n}</div>
      <div style="font-size:9px;color:${c};font-weight:700">${l}</div>
    </div>`).join('')}
  </div>

  <div style="background:white;border-radius:12px;padding:30px;text-align:center;color:#333;font-size:16px;">
    Found <b>${recent.length}</b> new tech leads in the last 24 hours.<br><br>
    Check your leads.json file or Google Sheet dashboard to view them!
  </div>
  </body></html>`;

  const subject = recent.length
    ? `🚀 ${recent.length} Tech Leads — ${starlink.length}🛰️ · ${wifi.length}📶 · ${smart.length}📷 | ${todayStr}`
    : `🚀 Scanner active, no tech leads today | ${todayStr}`;

  await t.sendMail({ from:`"Dean's Tech Leads" <${process.env.GMAIL_USER}>`, to:process.env.NOTIFY_EMAIL || process.env.GMAIL_USER, subject: subject, html });
  console.log(`✅ Daily digest sent successfully.`);
}

// Helper to delay the loop
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── MAIN ENGINE (24/7 Infinite Loop) ─────────────────────────────────────────
const LEADS_FILE = path.join(__dirname, 'leads.json');
const SEEN_FILE  = path.join(__dirname, 'seen.json');

(async () => {
  console.log(`\n🚀 DEAN'S TECH OVERDRIVE V10 — 24/7 CONTINUOUS HUNTER`);
  console.log(`📍 ${BASE} | NO REDDIT`);
  console.log(`🎯 Goal: Hunt until ${TARGET_LEADS} leads are bagged, then sleep for ${SESSION_DELAY_MINUTES} mins.`);
  
  let lastDigestDate = null;

  // 🔄 THE INFINITE 24/7 LOOP
  while (true) {
    // Load Files inside loop so manual edits while it's sleeping take effect
    let existing = [];
    try { existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch {}
    
    let seenLog = [];
    try { seenLog = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8')); } catch {}
    
    const seenUrls = new Set(seenLog.map(x => x.url).filter(Boolean));
    const seenTitles = new Set(seenLog.map(x => x.title).filter(Boolean));

    // ── Check if we need to send the Daily Digest ──
    const now = new Date();
    const todayString = now.toLocaleDateString();
    if (now.getHours() === DIGEST_HOUR && lastDigestDate !== todayString) {
      await sendDailyDigest(existing);
      lastDigestDate = todayString;
    }

    console.log(`\n======================================================`);
    console.log(`🌅 NEW HUNTING SESSION: ${now.toLocaleString()}`);
    console.log(`🧠 Memory: ${seenLog.length} leads in the Vault.`);
    console.log(`======================================================`);
    
    let freshBounty = [];
    let loopCount = 0;

    // ── The Hunting Sub-Loop ──
    while (freshBounty.length < TARGET_LEADS && loopCount < MAX_LOOPS) {
      console.log(`\n--- Cycle ${loopCount + 1}/${MAX_LOOPS} | Bagged: ${freshBounty.length}/${TARGET_LEADS} ---`);

      const { zone, region, services } = getThisRunTargets(loopCount);
      console.log(`🗺️  Scanning Zone ${zone.zone}: ${region.name}`);
      
      for (const svc of services) {
        const results = await scanCombo(zone, region, svc);
        
        for (const lead of results) {
          const titleKey = (lead.title||'').toLowerCase().slice(0,50);
          const urlKey = lead.url || '';
          const textToSearch = ((lead.title||'') + ' ' + (lead.snippet||'')).toLowerCase();
          const hasBlockedWord = BANNED_KEYWORDS.some(word => textToSearch.includes(word));

          if (!seenTitles.has(titleKey) && !seenUrls.has(urlKey) && !hasBlockedWord) {
            seenTitles.add(titleKey);
            if (urlKey) seenUrls.add(urlKey);
            
            seenLog.push({ url: urlKey, title: titleKey, addedAt: new Date().toISOString() });

            const stampedLead = { ...lead, id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, foundAt: new Date().toISOString(), status: 'new' };
            freshBounty.push(stampedLead);
          } else if (hasBlockedWord) {
            console.log(`    🛑 Blocked Lead (Contains Banned Word): ${lead.title}`);
          } else {
            console.log(`    ♻️ Skipped Lead (Already in Vault): ${lead.title}`);
          }
        }
      }
      
      loopCount++;
      if (freshBounty.length < TARGET_LEADS && loopCount < MAX_LOOPS) {
        console.log(`⏳ Cooling down for 30s...`);
        await sleep(30000);
      }
    }

    // ── Save Results ──
    if (freshBounty.length > 0) {
      const merged = [...freshBounty, ...existing].slice(0, 5000);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2));
      fs.writeFileSync(SEEN_FILE, JSON.stringify(seenLog, null, 2));
      console.log(`\n💾 Saved ${freshBounty.length} new leads to database and memory vault.`);
    } else {
      console.log(`\n📉 No new leads found after ${loopCount} cycles. The internet is quiet.`);
    }

    // ── Go to Sleep ──
    console.log(`\n💤 Session complete. Sleeping for ${SESSION_DELAY_MINUTES} minutes...`);
    await sleep(SESSION_DELAY_MINUTES * 60 * 1000);
  }
})();
