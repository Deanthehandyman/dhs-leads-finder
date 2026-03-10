// Dean's Handyman Service LLC — V2 Pro Scanner
// Pittsburg TX 75686 · Starts local, spirals outward
// ArkLaTex + East TX first, then all TX + neighboring states, then nationwide
// Daily 8am digest + instant hot-lead alerts

const fs   = require('fs');
const path = require('path');

const COMPANY = "Dean's Handyman Service LLC";
const PHONE   = "281-917-9914";
const WEBSITE = "deanshandymanservice.me";
const BASE    = "Pittsburg TX 75686";
const RUN_MODE = process.env.RUN_MODE || 'scan';

// ─── PRIORITY ZONES — closest first, spirals outward ─────────────────────────
const ZONES = [
  // ZONE 1 — Home turf (scanned most often)
  {
    zone: 1, label: "Home Turf",
    regions: [
      { name: "East Texas",       cities: ["Tyler", "Longview", "Nacogdoches", "Lufkin", "Marshall", "Pittsburg", "Henderson", "Jacksonville", "Carthage", "Center"] },
      { name: "Deep East Texas",  cities: ["Jasper", "San Augustine", "Tenaha", "Hemphill", "Newton", "Silsbee", "Woodville", "Livingston", "Coldspring", "Huntsville"] },
      { name: "ArkLaTex — AR",    cities: ["Texarkana AR", "Hope AR", "El Dorado AR", "Camden AR", "Magnolia AR", "Nashville AR", "Arkadelphia AR"] },
      { name: "ArkLaTex — LA",    cities: ["Shreveport LA", "Bossier City LA", "Minden LA", "Ruston LA", "Monroe LA", "Natchitoches LA", "Mansfield LA"] },
      { name: "ArkLaTex — TX",    cities: ["Texarkana TX", "Atlanta TX", "Mount Pleasant TX", "Sulphur Springs TX", "Paris TX", "Clarksville TX", "New Boston TX"] },
    ]
  },
  // ZONE 2 — Nearby states + North/Central TX
  {
    zone: 2, label: "Regional",
    regions: [
      { name: "Oklahoma",         cities: ["Oklahoma City OK", "Tulsa OK", "Ardmore OK", "Durant OK", "Broken Bow OK", "McAlester OK", "Poteau OK", "Idabel OK"] },
      { name: "North Texas",      cities: ["Sherman", "Denison", "Gainesville", "Greenville", "Bonham", "Wichita Falls", "Denton", "Decatur"] },
      { name: "DFW Rural",        cities: ["Weatherford", "Granbury", "Cleburne", "Corsicana", "Waxahachie", "Hillsboro", "Stephenville", "Glen Rose"] },
      { name: "Central Texas",    cities: ["Waco", "Temple", "Killeen", "Belton", "Lampasas", "Burnet", "Llano", "Mason"] },
      { name: "SW Arkansas",      cities: ["Fort Smith AR", "Hot Springs AR", "Pine Bluff AR", "Fayetteville AR", "Jonesboro AR", "Searcy AR"] },
    ]
  },
  // ZONE 3 — All Texas + rest of neighboring states
  {
    zone: 3, label: "Texas Statewide",
    regions: [
      { name: "West Texas",         cities: ["Midland", "Odessa", "Big Spring", "Pecos", "Fort Stockton", "Alpine", "Marfa"] },
      { name: "Texas Hill Country", cities: ["Kerrville", "Fredericksburg", "Boerne", "Comfort", "Bandera", "Medina", "Ingram"] },
      { name: "South Texas",        cities: ["Laredo", "Eagle Pass", "Del Rio", "Uvalde", "Hondo", "Cotulla", "Carrizo Springs"] },
      { name: "Rio Grande Valley",  cities: ["McAllen", "Edinburg", "Harlingen", "Brownsville", "Weslaco", "Mission"] },
      { name: "Gulf Coast",         cities: ["Corpus Christi", "Victoria", "Bay City", "Port Lavaca", "Rockport", "Aransas Pass"] },
      { name: "Houston Rural",      cities: ["Conroe", "Katy", "Waller", "Brenham", "Navasota", "Bryan", "Caldwell"] },
      { name: "Golden Triangle",    cities: ["Beaumont", "Port Arthur", "Orange", "Vidor", "Nederland", "Bridge City"] },
      { name: "Texas Panhandle",    cities: ["Amarillo", "Lubbock", "Canyon", "Pampa", "Borger", "Plainview", "Levelland"] },
      { name: "San Antonio Rural",  cities: ["New Braunfels", "Seguin", "Pleasanton", "Floresville", "Pearsall", "Castroville"] },
      { name: "Louisiana",          cities: ["Lake Charles LA", "Lafayette LA", "Baton Rouge LA", "Alexandria LA", "Opelousas LA"] },
      { name: "New Mexico",         cities: ["Hobbs NM", "Carlsbad NM", "Roswell NM", "Alamogordo NM", "Clovis NM", "Artesia NM"] },
    ]
  },
];

// Pick zone based on time slot — Zone 1 gets 50% of scans, Zone 2 gets 30%, Zone 3 gets 20%
function getThisRunTargets() {
  const slot = Math.floor(Date.now() / (30 * 60 * 1000));
  const roll  = slot % 10; // 0-9
  const zone  = roll < 5 ? ZONES[0] : roll < 8 ? ZONES[1] : ZONES[2];
  const regionIdx = slot % zone.regions.length;
  const region    = zone.regions[regionIdx];
  const svc1 = SERVICES[slot % SERVICES.length];
  const svc2 = SERVICES[(slot + 1) % SERVICES.length];
  return { zone, region, services: [svc1, svc2] };
}

// ─── ALL SERVICES including Virtual Handyman ──────────────────────────────────
const SERVICES = [
  {
    name: "Starlink Installation",
    emoji: "🛰️",
    virtual: false,
    searches: [
      'site:reddit.com "Starlink" "install" "help" Texas OR Arkansas OR Louisiana OR Oklahoma',
      '"Starlink" "installer" OR "mount" OR "setup" Texas ArkLaTex',
      'site:craigslist.org "Starlink" install Texas OR Arkansas OR Louisiana',
      '"just got Starlink" install help Texas OR "East Texas" OR Shreveport OR Texarkana',
      '"Starlink technician" OR "Starlink installer" Texas hire affordable',
      'cheaper than installpros Starlink Texas',
    ],
    intent: "People who just got a Starlink kit and need it mounted, looking for a local installer cheaper than $899 national companies",
  },
  {
    name: "General Handyman",
    emoji: "🔨",
    virtual: false,
    searches: [
      'site:reddit.com "handyman" "Texas" OR "Arkansas" OR "Louisiana" OR "Oklahoma" need recommend',
      'site:craigslist.org Texas OR Arkansas OR Louisiana "handyman" wanted needed',
      'site:nextdoor.com "handyman" Texas recommendation',
      '"need a handyman" OR "looking for handyman" East Texas OR ArkLaTex',
      'site:facebook.com "handyman" Texas needed hire affordable',
    ],
    intent: "People publicly asking for a handyman for home repairs, odd jobs, fix-it projects",
  },
  {
    name: "TV Mounting",
    emoji: "📺",
    virtual: false,
    searches: [
      'site:reddit.com "TV mount" OR "mount TV" Texas OR Arkansas OR Louisiana help',
      'site:craigslist.org Texas "TV mounting" OR "mount TV"',
      '"TV wall mount" installer Texas hire affordable',
      'site:nextdoor.com Texas "TV mount" OR "hang TV"',
    ],
    intent: "People wanting their TV mounted on the wall",
  },
  {
    name: "Plumbing",
    emoji: "🚿",
    virtual: false,
    searches: [
      'site:reddit.com Texas OR Arkansas OR Louisiana "plumber" need affordable basic',
      'site:craigslist.org Texas "plumber" OR "plumbing" needed fix',
      '"leaky faucet" OR "running toilet" OR "clogged drain" Texas fix help',
      'site:nextdoor.com Texas "plumber" recommend need',
    ],
    intent: "Homeowners needing basic plumbing — faucets, toilets, drains",
  },
  {
    name: "Electrical",
    emoji: "⚡",
    virtual: false,
    searches: [
      'site:reddit.com Texas "electrician" OR "electrical" affordable handyman need',
      'site:craigslist.org Texas "electrical repair" OR "electrician" needed',
      '"outlet not working" OR "light fixture" OR "ceiling fan install" Texas help',
      'site:nextdoor.com Texas "electrician" recommend need',
    ],
    intent: "Homeowners needing basic electrical — outlets, fixtures, ceiling fans, switches",
  },
  {
    name: "Pressure Washing",
    emoji: "💦",
    virtual: false,
    searches: [
      'site:reddit.com Texas "pressure wash" OR "power wash" service need',
      'site:craigslist.org Texas "pressure washing" service',
      '"pressure wash" Texas house OR driveway OR fence quote affordable',
      'site:nextdoor.com Texas "pressure washing" need hire',
    ],
    intent: "Homeowners wanting house, driveway, deck, or fence pressure washed",
  },
  {
    name: "Virtual Handyman Consult",
    emoji: "💻",
    virtual: true,
    searches: [
      'site:reddit.com "how do I fix" OR "how to repair" home Texas DIY help',
      'site:reddit.com/r/HomeImprovement "need advice" OR "help me" Texas plumbing electrical',
      '"virtual handyman" OR "remote handyman" OR "video call handyman" help',
      'site:reddit.com "should I hire" handyman OR plumber OR electrician Texas advice',
      '"DIY help" OR "walk me through" home repair fix Texas',
      'site:reddit.com/r/DIY "East Texas" OR "Texas" help fix repair advice',
    ],
    intent: "People asking how to fix things themselves who could use a paid video call consultation, or people unsure whether to DIY or hire — offer a virtual consult to assess their situation remotely",
  },
  {
    name: "Smart Home Setup",
    emoji: "🏠",
    virtual: true,
    searches: [
      'site:reddit.com Texas "smart home" setup help install',
      '"Ring doorbell" OR "Nest thermostat" OR "smart switch" install help Texas',
      'site:reddit.com Texas "Google Home" OR "Alexa" OR "smart plug" setup confused',
      '"smart home" installer Texas hire help setup',
      'Texas "home automation" setup help affordable',
    ],
    intent: "People needing smart home devices installed or set up — Ring, Nest, Alexa, smart switches, etc. Can be done virtually or in person",
  },
  {
    name: "Antenna & Cable Setup",
    emoji: "📡",
    virtual: false,
    searches: [
      '"TV antenna" install OR mount Texas help',
      'site:craigslist.org Texas "antenna" OR "cable" install setup',
      '"cut the cord" antenna install Texas help hire',
      'site:reddit.com Texas "antenna" "install" help',
      '"coax cable" run Texas hire handyman',
    ],
    intent: "People wanting a TV antenna mounted or cable/coax run through their home",
  },
  {
    name: "Furniture Assembly",
    emoji: "🪑",
    virtual: false,
    searches: [
      'site:craigslist.org Texas "furniture assembly" OR "IKEA assembly" help',
      'site:nextdoor.com Texas "furniture assembly" hire help',
      '"IKEA" OR "furniture" assemble Texas hire affordable handyman',
      'site:reddit.com Texas "furniture assembly" help need',
    ],
    intent: "People needing furniture assembled — IKEA, Amazon, big box store furniture",
  },
];

const CARRIERS = {
  google:  n => `${n}@txt.voice.google.com`,
  att:     n => `${n}@txt.att.net`,
  verizon: n => `${n}@vtext.com`,
  tmobile: n => `${n}@tmomail.net`,
  sprint:  n => `${n}@messaging.sprintpcs.com`,
  boost:   n => `${n}@sms.myboostmobile.com`,
  cricket: n => `${n}@mms.cricketwireless.net`,
  uscc:    n => `${n}@email.uscc.net`,
  metro:   n => `${n}@mymetropcs.com`,
};

const LEADS_FILE = path.join(__dirname, 'leads.json');
let existing = [];
try { existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch {}

// ─── Scan one region + service ────────────────────────────────────────────────
async function scanCombo(zone, region, service) {
  console.log(`  ${service.emoji} ${service.name} — Zone ${zone.zone} ${region.name}`);
  const cityList = region.cities.slice(0, 5).join(', ');
  const isVirtual = service.virtual;

  const prompt = `You are a lead finder for "${COMPANY}", a handyman business based in Pittsburg TX.
${isVirtual
  ? `This is a VIRTUAL service — they can serve customers ANYWHERE by video call/phone. Cast a wide net.`
  : `They serve: Zone 1 (East TX + ArkLaTex + OK) as priority, then all TX + neighboring states.`}

Find leads RIGHT NOW in ${region.name} (cities: ${cityList}) for: **${service.name}** ${service.emoji}
What to look for: ${service.intent}

Search these:
${service.searches.map((s,i) => `${i+1}. ${s} "${region.cities[0]}"`).join('\n')}
Also:
- site:reddit.com "${region.cities[0]}" "${service.name.toLowerCase()}"
- site:craigslist.org "${region.cities[0]}" "${service.name.split(' ')[0].toLowerCase()}"
- "${region.cities[1]}" "${service.name.toLowerCase()}" help needed hire

Return ONLY valid JSON array, no markdown:
[
  {
    "title": "What they need in one line",
    "snippet": "2-3 sentences — their situation, urgency, any frustration with cost or past services",
    "service": "${service.name}",
    "serviceEmoji": "${service.emoji}",
    "isVirtual": ${isVirtual},
    "source": "reddit|facebook|nextdoor|craigslist|forum|google",
    "platform": "specific platform e.g. r/DIY, Facebook East TX group, Craigslist Shreveport",
    "url": "URL if found else empty string",
    "contactHint": "any visible email or username, else empty string",
    "location": "City, State",
    "region": "${region.name}",
    "zone": ${zone.zone},
    "heat": "hot|warm|cold",
    "heatReason": "One sentence. Is this person ready to pay now?",
    "competitorMention": true or false,
    "tags": ["tag1","tag2","tag3"],
    "posted": "e.g. 2 hours ago, yesterday, this week"
  }
]
Return 3-5 leads. Do NOT invent personal names, phone numbers, or addresses.`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools:      [{ type: 'web_search_20250305', name: 'web_search' }],
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  const data = await resp.json();
  if (!resp.ok) { console.error(`    API error:`, data.error?.message); return []; }

  let text = '';
  for (const b of (data.content || [])) if (b.type === 'text') text += b.text;
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) { console.log(`    No results`); return []; }
  try {
    const leads = JSON.parse(match[0]);
    console.log(`    ✅ ${leads.length} leads`);
    return leads;
  } catch { return []; }
}

// ─── Send instant hot-lead alert ──────────────────────────────────────────────
async function sendHotAlert(hotLeads, region) {
  if (!hotLeads.length) return;
  const nodemailer = require('nodemailer');
  const transport  = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:16px;background:#fff8e6">
<div style="background:#04080f;border-radius:12px;padding:20px;text-align:center;margin-bottom:14px">
  <div style="font-size:28px">🔥</div>
  <h2 style="color:#ff9d00;margin:8px 0 4px;font-size:17px">HOT LEAD ALERT</h2>
  <p style="color:#7a9cc0;margin:0;font-size:12px">${hotLeads.length} hot lead${hotLeads.length>1?'s':''} found in ${region.name}</p>
</div>
${hotLeads.map(l=>`
<div style="background:white;border:2px solid #ff9d00;border-radius:12px;padding:16px;margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
    <b style="color:#111">${l.serviceEmoji||'🔨'} ${l.title}</b>
    <span style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700">${l.isVirtual?'VIRTUAL':'LOCAL'}</span>
  </div>
  <p style="color:#444;font-size:13px;margin:0 0 6px">${l.snippet}</p>
  <div style="font-size:11px;color:#888">📍 ${l.location||region.name} · ${l.platform||l.source||'web'} · ${l.posted||'recent'}</div>
  ${l.heatReason?`<div style="font-size:11px;color:#b45309;margin-top:4px;font-style:italic">💡 ${l.heatReason}</div>`:''}
  ${l.contactHint?`<div style="font-size:12px;color:#059669;margin-top:6px;font-weight:600">📧 ${l.contactHint}</div>`:''}
  ${l.url?`<a href="${l.url}" style="font-size:11px;color:#2563eb;display:block;margin-top:6px">${l.url}</a>`:''}
</div>`).join('')}
<div style="text-align:center;font-size:12px;color:#888;margin-top:14px">
  <b>${COMPANY}</b> · <a href="tel:${PHONE}">${PHONE}</a> · <a href="https://${WEBSITE}">${WEBSITE}</a>
</div></body></html>`;

  const sms = `🔥 HOT LEAD: ${hotLeads[0].serviceEmoji||''} ${hotLeads[0].title.slice(0,70)} | ${hotLeads[0].location||region.name} | ${PHONE}`;
  await sendMessage(transport, html, sms, `🔥 ${hotLeads.length} HOT Lead${hotLeads.length>1?'s':''} — ${hotLeads[0].service} | ${region.name}`);
}

// ─── Send daily 8am digest ────────────────────────────────────────────────────
async function sendDailyDigest() {
  console.log('📰 Building daily digest...');
  const nodemailer = require('nodemailer');
  const transport  = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });

  const allLeads = existing; // already loaded
  const cutoff   = new Date(Date.now() - 24*60*60*1000);
  const recent   = allLeads.filter(l => new Date(l.foundAt) >= cutoff);
  const hot      = recent.filter(l=>l.heat==='hot');
  const warm     = recent.filter(l=>l.heat==='warm');
  const cold     = recent.filter(l=>l.heat==='cold');
  const comp     = recent.filter(l=>l.competitorMention===true||l.competitorMention==='true');
  const virtual  = recent.filter(l=>l.isVirtual===true||l.isVirtual==='true');

  // Group by service
  const byService = {};
  recent.forEach(l=>{
    const k=`${l.serviceEmoji||'🔨'} ${l.service||'Handyman'}`;
    (byService[k]=byService[k]||[]).push(l);
  });

  const icon = h=>h==='hot'?'🔥':h==='warm'?'⚡':'·';

  const serviceBlocks = Object.entries(byService).map(([svc,leads])=>`
<div style="margin-bottom:20px">
  <div style="font-size:14px;font-weight:700;color:#111;border-bottom:2px solid #e2e8f0;padding-bottom:7px;margin-bottom:10px">${svc} (${leads.length})</div>
  ${leads.map(l=>{
    const bg=l.heat==='hot'?'#fffbeb':l.heat==='warm'?'#eff8ff':'#f9fafb';
    const bc=l.heat==='hot'?'#f59e0b':l.heat==='warm'?'#93c5fd':'#e5e7eb';
    const tc=l.heat==='hot'?'#92400e':l.heat==='warm'?'#1e40af':'#555';
    return `<div style="background:${bg};border:1px solid ${bc};border-radius:10px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:4px">
        <b style="color:#111;font-size:13px">${icon(l.heat)} ${l.title}</b>
        <span style="font-size:10px;font-weight:700;color:${tc};background:${bc};padding:2px 8px;border-radius:8px;white-space:nowrap">${(l.heat||'').toUpperCase()}${l.isVirtual?' · VIRTUAL':''}</span>
      </div>
      <p style="color:#444;font-size:12px;margin:4px 0">${l.snippet}</p>
      <div style="font-size:11px;color:#888">📍 ${l.location||''} · ${l.platform||l.source||'web'} · ${l.posted||ago(l.foundAt)}</div>
      ${l.heatReason?`<div style="font-size:11px;color:${tc};font-style:italic;margin-top:3px">💡 ${l.heatReason}</div>`:''}
      ${l.contactHint?`<div style="font-size:11px;color:#059669;font-weight:600;margin-top:4px">📧 ${l.contactHint}</div>`:''}
      ${l.url?`<a href="${l.url}" style="font-size:11px;color:#2563eb;display:block;margin-top:4px">${l.url}</a>`:''}
    </div>`;
  }).join('')}
</div>`).join('');

  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:16px;background:#f1f5f9">
<div style="background:#04080f;border-radius:14px;padding:24px;text-align:center;margin-bottom:16px">
  <div style="font-size:32px">🔨</div>
  <h2 style="color:#00d4ff;margin:8px 0 4px;font-size:20px">GOOD MORNING DEAN!</h2>
  <p style="color:#7a9cc0;margin:0;font-size:13px">Your daily lead report — ${today}</p>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:16px">
  ${[['🔥 Hot',hot.length,'#fef3c7','#92400e'],['⚡ Warm',warm.length,'#eff8ff','#1e40af'],['💻 Virtual',virtual.length,'#f0fdf4','#065f46'],['⚠️ vs Comp',comp.length,'#fee2e2','#dc2626']].map(([l,n,bg,c])=>`
  <div style="background:${bg};border-radius:10px;padding:12px;text-align:center">
    <div style="font-size:22px;font-weight:700;color:${c}">${n}</div>
    <div style="font-size:11px;color:${c};font-weight:600">${l}</div>
  </div>`).join('')}
</div>

${recent.length===0?'<div style="background:white;border-radius:12px;padding:30px;text-align:center;color:#888">No new leads in the last 24 hours. Scanner is still running — check back tomorrow!</div>':`
${comp.length?`<div style="background:#fee2e2;border:2px solid #f87171;border-radius:12px;padding:12px;margin-bottom:14px;text-align:center">
  <b style="color:#dc2626">⚠️ ${comp.length} LEADS SHOPPED installpros.io / starlinkinstallationpros.com — CALL THESE FIRST. They hate the $899 price.</b>
</div>`:''}

<div style="background:white;border-radius:12px;padding:20px;margin-bottom:14px">
  <h3 style="margin:0 0 16px;color:#111;font-size:15px">📋 All ${recent.length} Leads From Last 24 Hours</h3>
  ${serviceBlocks}
</div>`}

<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;margin-bottom:14px;font-size:12px;color:#166534">
  <b>💡 Virtual Handyman tip:</b> For any "how do I fix this" leads — offer a 30-min video consult. Charge $25-50. Zero travel, pure profit. Upsell to an in-person visit if they're local.
</div>

<div style="text-align:center;font-size:11px;color:#888;background:white;border-radius:10px;padding:14px">
  <b>${COMPANY}</b> · ${PHONE} · <a href="https://${WEBSITE}">${WEBSITE}</a><br>
  East TX + ArkLaTex + OK priority · All TX + neighboring states<br>
  Scanning 24/7 · Next digest tomorrow at 8am Central
</div>
</body></html>`;

  const sms = recent.length
    ? `☀️ Dean's 8am Report: ${recent.length} leads (${hot.length} hot, ${virtual.length} virtual). ${comp.length?`${comp.length} shopped competitor!`:''} Check email for full list.`
    : `☀️ Dean's 8am Report: No new leads in 24hrs. Scanner running fine.`;

  await sendMessage(transport, html, sms, `☀️ Dean's Daily Leads — ${recent.length} new | ${hot.length} 🔥 hot | ${today}`);
  console.log(`✅ Daily digest sent. ${recent.length} leads (${hot.length} hot).`);
}

// ─── Shared send helper ───────────────────────────────────────────────────────
async function sendMessage(transport, html, sms, subject) {
  const recipients = [process.env.NOTIFY_EMAIL].filter(Boolean);
  const rawPhone   = (process.env.NOTIFY_PHONE||'').replace(/\D/g,'');
  const carrier    = (process.env.NOTIFY_CARRIER||'').toLowerCase();
  if (rawPhone && carrier && CARRIERS[carrier]) recipients.push(CARRIERS[carrier](rawPhone));

  for (const to of recipients) {
    const isSms = !['gmail','yahoo','hotmail','outlook','icloud','aol','proton'].some(d=>to.includes(d));
    try {
      await transport.sendMail({
        from: `"Dean's Leads 🔨" <${process.env.GMAIL_USER}>`,
        to, subject,
        ...(isSms ? { text: sms } : { html }),
      });
      console.log(`✅ Sent to: ${to}`);
    } catch(e) { console.error(`❌ Failed ${to}:`, e.message); }
  }
}

function ago(iso){if(!iso)return'–';const s=(Date.now()-new Date(iso))/1000;if(s<60)return'just now';if(s<3600)return Math.floor(s/60)+'m ago';if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago';}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🔨 DEAN'S V2 LEAD SCANNER — Mode: ${RUN_MODE.toUpperCase()}`);
  console.log(`📍 ${BASE} | Priority: East TX + ArkLaTex + OK → TX → Neighboring States`);
  console.log(`📅 ${new Date().toISOString()}\n`);

  // Daily digest mode
  if (RUN_MODE === 'digest') {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await sendDailyDigest();
    } else {
      console.warn('⚠️  No Gmail credentials — skipping digest');
    }
    process.exit(0);
  }

  // Regular scan mode
  const { zone, region, services } = getThisRunTargets();
  console.log(`🗺️  Zone ${zone.zone} (${zone.label}): ${region.name}`);
  console.log(`🛠  Services: ${services.map(s=>s.name).join(' + ')}\n`);

  let allNew = [];
  try {
    const results = await Promise.all(services.map(svc => scanCombo(zone, region, svc)));
    allNew = results.flat();
  } catch(e) { console.error('Scan error:', e); process.exit(1); }

  console.log(`\n📊 Found: ${allNew.length} leads`);
  if (!allNew.length) { console.log('No leads this cycle.'); process.exit(0); }

  const existingKeys = new Set(existing.map(l=>(l.title||'').toLowerCase().slice(0,50)));
  const fresh = allNew.filter(l=>!existingKeys.has((l.title||'').toLowerCase().slice(0,50)));
  console.log(`✨ ${fresh.length} new (${allNew.length-fresh.length} dupes)`);
  if (!fresh.length) process.exit(0);

  const stamped = fresh.map(l=>({...l, id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`, foundAt:new Date().toISOString(), status:'new'}));
  const merged  = [...stamped, ...existing].slice(0,1000);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2));
  console.log(`💾 Saved ${merged.length} total`);

  // Only send instant alert for HOT leads — daily digest handles the rest
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const hot = stamped.filter(l=>l.heat==='hot');
    if (hot.length) {
      console.log(`🔥 Sending instant hot-lead alert for ${hot.length} leads...`);
      try { await sendHotAlert(hot, region); } catch(e) { console.error('Alert error:', e.message); }
    } else {
      console.log(`ℹ️  No hot leads this scan — saving for 8am digest`);
    }
  }

  const hotCount = stamped.filter(l=>l.heat==='hot').length;
  console.log(`\n✅ Done. ${stamped.length} new leads (${hotCount} 🔥 hot)`);
})();
