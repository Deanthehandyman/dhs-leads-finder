// Dean's Handyman Service LLC — Pro Texas Lead Scanner
// Pittsburg TX 75686 · Beats installpros.io & starlinkinstallationpros.com on price + local service
// Searches Reddit, Facebook public groups, Nextdoor, Craigslist, forums, Google

const fs   = require('fs');
const path = require('path');

const COMPANY     = "Dean's Handyman Service LLC";
const PHONE       = "281-917-9914";
const WEBSITE     = "deanshandymanservice.me";
const BASE        = "Pittsburg TX 75686";
const COMPETITOR1 = "installpros.io";
const COMPETITOR2 = "starlinkinstallationpros.com";
const COMP_PRICE  = "$899";  // what competitors charge — Dean undercuts this

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    name: "Starlink Installation",
    emoji: "🛰️",
    // Diverse search queries hitting Reddit, FB groups, Nextdoor, Craigslist, forums
    searches: [
      'site:reddit.com "Starlink" "install" "Texas" "help"',
      'site:reddit.com/r/Starlink "need help" OR "installer" OR "mount" Texas',
      'site:facebook.com "Starlink installation" Texas',
      'site:craigslist.org Texas "Starlink" install',
      '"Starlink" "install" "Texas" site:nextdoor.com',
      '"just got Starlink" Texas install help',
      '"Starlink technician" OR "Starlink installer" Texas hire',
      'Texas "Starlink" "need someone" OR "looking for" install mount 2024 OR 2025',
      '"Starlink" "rural Texas" "no internet" OR "bad internet" help',
      'Texas Starlink installer cheaper than installpros',
    ],
    intent: "People who just received a Starlink kit and need it mounted, or are looking for a local Texas installer cheaper than the $899 national companies",
  },
  {
    name: "General Handyman",
    emoji: "🔨",
    searches: [
      'site:reddit.com "handyman" "Texas" "need" OR "looking for" OR "recommend"',
      'site:craigslist.org Texas "handyman" wanted OR needed',
      'site:nextdoor.com Texas "handyman" recommendation',
      'site:facebook.com "handyman" "Texas" needed hire',
      '"handyman" "East Texas" OR "North Texas" OR "South Texas" hire 2024 OR 2025',
      'Texas "need a handyman" OR "looking for handyman" forum',
      'site:reddit.com/r/Texas handyman fix repair help',
    ],
    intent: "People in Texas publicly asking for a handyman on Reddit, Nextdoor, Facebook groups, or Craigslist",
  },
  {
    name: "TV Mounting",
    emoji: "📺",
    searches: [
      'site:reddit.com "TV mount" OR "mount TV" Texas help installer',
      'site:craigslist.org Texas "TV mounting" OR "mount TV"',
      'site:nextdoor.com Texas "TV mount" OR "mount my TV"',
      '"mount TV" "Texas" "someone" OR "hire" OR "service" 2024 OR 2025',
      'site:facebook.com Texas "TV mounting" service needed',
      'Texas "wall mount" TV installer hire cheap',
    ],
    intent: "People in Texas asking someone to mount their TV on the wall",
  },
  {
    name: "Plumbing",
    emoji: "🚿",
    searches: [
      'site:reddit.com Texas "plumber" OR "plumbing" "need" OR "looking for" affordable',
      'site:craigslist.org Texas "plumber" needed fix repair',
      'site:nextdoor.com Texas "plumber" recommend need',
      '"leaky faucet" OR "running toilet" OR "clogged drain" Texas fix help',
      'site:facebook.com Texas "plumber" needed affordable',
      'Texas "handyman plumber" OR "basic plumbing" help hire',
    ],
    intent: "Texas homeowners needing affordable basic plumbing help — faucets, toilets, drains",
  },
  {
    name: "Electrical",
    emoji: "⚡",
    searches: [
      'site:reddit.com Texas "electrician" OR "electrical" "need" OR "help" affordable handyman',
      'site:craigslist.org Texas "electrician" OR "electrical repair" needed',
      'site:nextdoor.com Texas "electrician" recommend need',
      '"outlet not working" OR "light fixture" OR "ceiling fan" install Texas help',
      'site:facebook.com Texas "electrician" needed affordable',
      'Texas "handyman electrician" hire install fix',
    ],
    intent: "Texas homeowners needing basic electrical work — outlets, fixtures, ceiling fans, switches",
  },
  {
    name: "Pressure Washing",
    emoji: "💦",
    searches: [
      'site:reddit.com Texas "pressure wash" OR "power wash" service need',
      'site:craigslist.org Texas "pressure washing" OR "power washing" service',
      'site:nextdoor.com Texas "pressure washing" recommend hire',
      '"pressure wash" "Texas" "house" OR "driveway" OR "fence" service quote',
      'site:facebook.com Texas "pressure washing" needed quote',
      'Texas "power washing" hire cheap affordable 2024 OR 2025',
    ],
    intent: "Texas homeowners wanting their house, driveway, deck, or fence pressure washed",
  },
];

// ─── 20 Texas Regions ─────────────────────────────────────────────────────────
const TX_REGIONS = [
  { name: "East Texas",            cities: ["Tyler", "Longview", "Nacogdoches", "Lufkin", "Marshall", "Pittsburg", "Henderson", "Jacksonville"] },
  { name: "Deep East Texas",       cities: ["Jasper", "Center", "San Augustine", "Tenaha", "Hemphill", "Carthage", "Newton", "Sabine County"] },
  { name: "DFW Rural",             cities: ["Weatherford", "Granbury", "Cleburne", "Corsicana", "Waxahachie", "Hillsboro", "Stephenville", "Glen Rose"] },
  { name: "North Texas",           cities: ["Sherman", "Denison", "Paris", "Gainesville", "Greenville", "Sulphur Springs", "Bonham", "Clarksville"] },
  { name: "Northwest Texas",       cities: ["Wichita Falls", "Decatur", "Jacksboro", "Graham", "Mineral Wells", "Breckenridge", "Olney", "Seymour"] },
  { name: "West Texas",            cities: ["Midland", "Odessa", "Big Spring", "Pecos", "Fort Stockton", "Alpine", "Marfa", "Van Horn"] },
  { name: "Far West Texas",        cities: ["El Paso", "Sierra Blanca", "Dell City", "Tornillo", "Fabens", "Presidio", "Balmorhea"] },
  { name: "Permian Basin",         cities: ["Andrews", "Kermit", "Wink", "Monahans", "Pecos County", "Ward County", "Reeves County"] },
  { name: "Central Texas",         cities: ["Waco", "Temple", "Killeen", "Belton", "Lampasas", "Burnet", "Llano", "Mason"] },
  { name: "Texas Hill Country",    cities: ["Kerrville", "Fredericksburg", "Boerne", "Comfort", "Bandera", "Medina", "Ingram", "Hunt"] },
  { name: "Austin Rural",          cities: ["Bastrop", "Lockhart", "Luling", "Gonzales", "La Grange", "Giddings", "Elgin", "Taylor"] },
  { name: "South Texas",           cities: ["Laredo", "Eagle Pass", "Del Rio", "Uvalde", "Hondo", "Cotulla", "Carrizo Springs"] },
  { name: "Rio Grande Valley",     cities: ["McAllen", "Edinburg", "Mission", "Harlingen", "Brownsville", "Weslaco", "Donna"] },
  { name: "Coastal Bend",          cities: ["Corpus Christi", "Rockport", "Aransas Pass", "Beeville", "Alice", "Kingsville", "Robstown"] },
  { name: "Greater Houston Rural", cities: ["Conroe", "Huntsville", "Livingston", "Coldspring", "Woodville", "Kountze", "Silsbee", "Dayton"] },
  { name: "Golden Triangle",       cities: ["Beaumont", "Port Arthur", "Orange", "Vidor", "Nederland", "Bridge City", "Jasper"] },
  { name: "Gulf Coast Plains",     cities: ["Victoria", "Bay City", "Edna", "El Campo", "Wharton", "Richmond", "Columbus", "Cuero"] },
  { name: "Texas Panhandle",       cities: ["Amarillo", "Canyon", "Pampa", "Borger", "Canadian", "Perryton", "Dalhart", "Hereford"] },
  { name: "South Plains",          cities: ["Lubbock", "Levelland", "Seminole", "Lamesa", "Slaton", "Post", "Tahoka", "Crosbyton"] },
  { name: "San Antonio Rural",     cities: ["New Braunfels", "Seguin", "Pleasanton", "Jourdanton", "Poteet", "Floresville", "Pearsall"] },
];

function getThisRunTargets() {
  const slot   = Math.floor(Date.now() / (30 * 60 * 1000));
  const region = TX_REGIONS[slot % TX_REGIONS.length];
  const svc1   = SERVICES[slot % SERVICES.length];
  const svc2   = SERVICES[(slot + 1) % SERVICES.length];
  return { region, services: [svc1, svc2] };
}

const CARRIERS = {
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
async function scanCombo(region, service) {
  console.log(`  ${service.emoji} ${service.name} — ${region.name}`);
  const cityList = region.cities.slice(0, 5).join(', ');

  const prompt = `You are an aggressive lead finder for "${COMPANY}", a LOCAL Texas handyman business competing against national Starlink installers like installpros.io and starlinkinstallationpros.com who charge $899+. Dean's is local, faster, and cheaper.

TASK: Search the web RIGHT NOW for people in ${region.name} Texas (cities: ${cityList} and surrounding area) who publicly posted that they need: **${service.name}** ${service.emoji}

TARGET SOURCES — search ALL of these:
- Reddit (r/Starlink, r/Texas, r/DIY, r/HomeImprovement, local Texas subreddits)
- Facebook public groups (local Texas community groups, rural internet groups)  
- Nextdoor public posts (Texas neighborhoods)
- Craigslist gigs/services wanted sections for Texas cities
- Local Texas community forums and neighborhood sites
- Google for anyone publicly asking in ${region.name}

USE THESE SEARCH QUERIES:
${service.searches.map((s, i) => `${i + 1}. ${s} "${region.cities[0]}"`).join('\n')}

Also search:
- "${region.cities[0]} ${service.name.toLowerCase()} help" site:reddit.com
- "${region.cities[0]} TX" "${service.name.toLowerCase()}" craigslist
- "${region.cities[1]} Texas" "${service.name.toLowerCase()}" nextdoor OR facebook group

ALSO look for:
- Anyone who complained about national installers (too expensive, slow, not local)
- Anyone who got a quote from installpros.io or starlinkinstallationpros.com and is shopping around
- Any publicly listed email addresses or contact info in posts

For each lead found, return a JSON object. Return ONLY a valid JSON array, no markdown:
[
  {
    "title": "Short description of what they need",
    "snippet": "2-3 sentences. Include: what they need, urgency, any frustration with expensive services, property details if mentioned",
    "service": "${service.name}",
    "serviceEmoji": "${service.emoji}",
    "source": "reddit|facebook|nextdoor|craigslist|forum|google",
    "platform": "specific platform e.g. r/Starlink, Facebook group name, Nextdoor, Craigslist Tyler TX",
    "url": "direct URL to the post if found, else empty string",
    "contactHint": "any email, username, or contact info publicly visible in the post, else empty string",
    "location": "City, TX",
    "region": "${region.name}",
    "heat": "hot|warm|cold",
    "heatReason": "One sentence. Note if they complained about competitor pricing or are ready to hire now.",
    "competitorMention": "true if they mentioned installpros or starlinkinstallationpros or similar, else false",
    "tags": ["up to 4 tags"],
    "posted": "time estimate e.g. 3 hours ago, yesterday, this week"
  }
]

Return 3-6 leads from ${region.name} Texas only. Do NOT invent personal names, phone numbers, or addresses.`;

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
    const hot = leads.filter(l => l.heat === 'hot').length;
    console.log(`    ✅ ${leads.length} leads (${hot} hot)`);
    return leads;
  } catch { return []; }
}

// ─── Email/SMS notification ───────────────────────────────────────────────────
async function sendNotification(newLeads, region, services) {
  const nodemailer = require('nodemailer');
  const transport  = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  const hot  = newLeads.filter(l => l.heat === 'hot');
  const warm = newLeads.filter(l => l.heat === 'warm');
  const comp = newLeads.filter(l => l.competitorMention === 'true' || l.competitorMention === true);
  const icon = h => h==='hot'?'🔥':h==='warm'?'⚡':'·';

  const byService = {};
  newLeads.forEach(l => {
    const k = `${l.serviceEmoji||'🔨'} ${l.service||'Handyman'}`;
    (byService[k] = byService[k] || []).push(l);
  });

  const serviceBlocks = Object.entries(byService).map(([svc, leads]) => `
<div style="margin-bottom:18px">
  <div style="font-size:13px;font-weight:700;color:#111;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:10px">${svc}</div>
  ${leads.map(l => {
    const bg = l.heat==='hot'?'#fffbeb':l.heat==='warm'?'#eff8ff':'#f9fafb';
    const bc = l.heat==='hot'?'#f59e0b':l.heat==='warm'?'#93c5fd':'#e5e7eb';
    const tc = l.heat==='hot'?'#92400e':l.heat==='warm'?'#1e40af':'#555';
    const compBadge = (l.competitorMention==='true'||l.competitorMention===true)
      ? `<span style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:8px;padding:2px 8px;font-size:10px;font-weight:700;margin-left:6px">⚠️ SHOPPED COMPETITOR</span>` : '';
    return `<div style="background:${bg};border:1px solid ${bc};border-radius:10px;padding:13px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px">
        <b style="color:#111;font-size:13px">${icon(l.heat)} ${l.title}</b>
        <span style="background:${bc};color:${tc};padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap">${(l.heat||'cold').toUpperCase()}</span>
      </div>
      <p style="color:#444;font-size:12px;margin:4px 0">${l.snippet}</p>
      <div style="font-size:11px;color:#888;margin-top:4px">
        📍 ${l.location||region.name} · ${l.platform||l.source||'web'} · ${l.posted||'recent'}
        ${compBadge}
      </div>
      ${l.heatReason?`<div style="font-size:11px;color:${tc};margin-top:3px;font-style:italic">💡 ${l.heatReason}</div>`:''}
      ${l.contactHint?`<div style="font-size:11px;color:#059669;margin-top:4px;font-weight:600">📧 Contact hint: ${l.contactHint}</div>`:''}
      ${l.url?`<a href="${l.url}" style="font-size:11px;color:#2563eb;display:block;margin-top:4px">${l.url}</a>`:''}
    </div>`;
  }).join('')}
</div>`).join('');

  const html = `<html><body style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:16px;background:#f1f5f9">
<div style="background:#04080f;border-radius:14px;padding:22px;text-align:center;margin-bottom:14px">
  <div style="font-size:30px">🔨</div>
  <h2 style="color:#00d4ff;margin:8px 0 4px;font-size:18px">DEAN'S TEXAS LEAD ALERT</h2>
  <p style="color:#7a9cc0;margin:0;font-size:13px">
    <b>${newLeads.length}</b> new leads · 🔥 ${hot.length} hot · ⚡ ${warm.length} warm
    ${comp.length ? ` · <span style="color:#ff6b6b">⚠️ ${comp.length} shopped competitor</span>` : ''}
  </p>
  <p style="color:#4a6080;font-size:11px;margin:5px 0 0">${region.name} · ${services.map(s=>s.name).join(' + ')}</p>
</div>

${comp.length ? `<div style="background:#fee2e2;border:2px solid #f87171;border-radius:12px;padding:12px;margin-bottom:12px;text-align:center">
  <b style="color:#dc2626">⚠️ ${comp.length} LEAD${comp.length>1?'S':''} SHOPPED installpros.io / starlinkinstallationpros.com — THEY HATE THE $899 PRICE. CALL NOW AND WIN THEM.</b>
</div>` : ''}

${hot.length ? `<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:12px;margin-bottom:12px;text-align:center">
  <b style="color:#92400e">🔥 ${hot.length} HOT LEAD${hot.length>1?'S':''} — CALL THESE FIRST</b>
</div>` : ''}

<div style="background:white;border-radius:12px;padding:18px;margin-bottom:12px">${serviceBlocks}</div>

<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;color:#166534">
  <b>🏆 Your competitive edge:</b> Competitors charge $899+. You're local, faster, and personal.
  Mention this when you call — it closes deals.
</div>

<div style="text-align:center;font-size:11px;color:#888;background:white;border-radius:10px;padding:14px">
  <b>${COMPANY}</b> · ${PHONE} · <a href="https://${WEBSITE}">${WEBSITE}</a><br>
  Pittsburg TX · ALL of Texas · 6 Services · 20 Regions · 24/7<br>
  <a href="https://YOUR-GITHUB-USERNAME.github.io/dhs-lead-finder" style="color:#2563eb">View Dashboard →</a>
</div></body></html>`;

  const top = hot[0] || warm[0] || newLeads[0];
  const sms = `🔨 DHS ${icon(top.heat)} [${top.service}] ${top.title.slice(0,55)} | ${top.location||region.name} | ${newLeads.length} leads${comp.length?` (${comp.length} shopped $899 competitor!)`:''}`;

  const recipients = [process.env.NOTIFY_EMAIL].filter(Boolean);
  const rawPhone   = (process.env.NOTIFY_PHONE||'').replace(/\D/g,'');
  const carrier    = (process.env.NOTIFY_CARRIER||'').toLowerCase();
  if (rawPhone && carrier && CARRIERS[carrier]) recipients.push(CARRIERS[carrier](rawPhone));

  for (const to of recipients) {
    const isSms = !['gmail','yahoo','hotmail','outlook','icloud','aol','proton'].some(d=>to.includes(d));
    try {
      await transport.sendMail({
        from:    `"Dean's Leads 🔨" <${process.env.GMAIL_USER}>`,
        to,
        subject: `🔨 ${hot.length?`🔥${hot.length} HOT`:newLeads.length} Leads${comp.length?` ⚠️${comp.length} vs competitor`:''} | ${services.map(s=>s.emoji).join('')} ${region.name}`,
        ...(isSms ? { text: sms } : { html }),
      });
      console.log(`✅ Notified: ${to}`);
    } catch(e) { console.error(`❌ Notify failed:`, e.message); }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🔨 DEAN'S PRO TEXAS LEAD SCANNER`);
  console.log(`📍 ${BASE} · All Texas · Competing vs ${COMPETITOR1} & ${COMPETITOR2}`);
  console.log(`💰 Competitors charge ${COMP_PRICE}+ — Dean's is local and cheaper`);
  console.log(`📅 ${new Date().toISOString()}\n`);

  const { region, services } = getThisRunTargets();
  console.log(`🗺️  Region: ${region.name} | Services: ${services.map(s=>s.name).join(' + ')}`);
  console.log(`🔎 Searching: Reddit, Facebook groups, Nextdoor, Craigslist, forums...\n`);

  let allNew = [];
  try {
    const results = await Promise.all(services.map(svc => scanCombo(region, svc)));
    allNew = results.flat();
  } catch(e) { console.error('Scan error:', e); process.exit(1); }

  console.log(`\n📊 Total found: ${allNew.length}`);
  const compCount = allNew.filter(l=>l.competitorMention==='true'||l.competitorMention===true).length;
  if (compCount) console.log(`⚠️  ${compCount} leads mention competitor — PRIORITY CALLS`);
  if (!allNew.length) { console.log('No leads this cycle.'); process.exit(0); }

  const existingKeys = new Set(existing.map(l=>(l.title||'').toLowerCase().slice(0,50)));
  const fresh = allNew.filter(l=>!existingKeys.has((l.title||'').toLowerCase().slice(0,50)));
  console.log(`✨ ${fresh.length} new (${allNew.length-fresh.length} dupes skipped)`);
  if (!fresh.length) { process.exit(0); }

  const stamped = fresh.map(l => ({
    ...l,
    id:      `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    foundAt: new Date().toISOString(),
    status:  'new',
  }));

  const merged = [...stamped, ...existing].slice(0, 1000);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2));
  console.log(`💾 Saved ${merged.length} total leads`);

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try { await sendNotification(stamped, region, services); }
    catch(e) { console.error('Notification error:', e.message); }
  }

  const hotCount = stamped.filter(l=>l.heat==='hot').length;
  console.log(`\n✅ Done. ${stamped.length} new (${hotCount} 🔥 hot, ${compCount} ⚠️ competitor mentions)`);
})();
