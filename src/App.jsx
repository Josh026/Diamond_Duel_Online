import { useState, useEffect, useRef } from "react";

// ─── TEAM COLORS ─────────────────────────────────────────────────────────────
const TEAM_PALETTE = [
  { primary:"#C8102E", secondary:"#F5E642" }, // Red / Yellow
  { primary:"#1D428A", secondary:"#FFC72C" }, // Royal Blue / Gold
  { primary:"#006341", secondary:"#E8D5A3" }, // Forest Green / Cream
  { primary:"#6B21A8", secondary:"#F59E0B" }, // Purple / Amber
  { primary:"#F97316", secondary:"#1a1a1a" }, // Orange / Black
  { primary:"#0E7490", secondary:"#F0F9FF" }, // Teal / White
  { primary:"#1a1a1a", secondary:"#C8102E" }, // Black / Red
  { primary:"#B45309", secondary:"#FEF3C7" }, // Brown / Cream
  { primary:"#BE185D", secondary:"#FCE7F3" }, // Hot Pink / Light Pink
  { primary:"#374151", secondary:"#D1FAE5" }, // Slate / Mint
];

// ─── TEAM NAMES ──────────────────────────────────────────────────────────────
const TEAM_NAMES = [
  "Ironclads","Riverhawks","Dustdevils","Stormcrows","Copperheads",
  "Timberwolves","Fireflies","Mudcats","Greyhounds","Thunderbolts",
  "Rattlers","Pelicans","Zephyrs","Jackrabbits","Nighthawks",
  "Ospreys","Crosscutters","Snappers","Kernels","Sultans",
  "Hillcats","Crawdads","Baysox","Yard Goats","Shuckers",
  "Rockhounds","Isotopes","Biscuits","Lookouts","Sounds",
];

// ─── PLAYER POOL ─────────────────────────────────────────────────────────────
function makeBatter(id, name, pos, contact, power, eye, speed) {
  const avg = (contact+power+eye+speed)/4;
  const tier = avg>=78?"S":avg>=65?"A":avg>=52?"B":"C";
  return { id, name, pos, contact, power, eye, speed, tier, type:"batter" };
}
function makePitcher(id, name, stuff, control, movement, stamina=70) {
  const avg = (stuff+control+movement)/3;
  const tier = avg>=78?"S":avg>=65?"A":avg>=52?"B":"C";
  return { id, name, stuff, control, movement, stamina, tier, type:"pitcher" };
}

const BATTER_POOL = [
  makeBatter("b1","Hack Swingman","CF",82,95,78,88),
  makeBatter("b2","Slamuel L. Jackson","1B",75,98,70,55),
  makeBatter("b3","Barry Bondage","LF",88,90,82,72),
  makeBatter("b4","Stealin' Dillon","SS",85,78,90,92),
  makeBatter("b5","Bunt Reynolds","3B",79,92,75,68),
  makeBatter("b6","Ron Swingson","RF",80,96,68,74),
  makeBatter("b7","Catch McCatchface","C",78,88,80,60),
  makeBatter("b8","Chuck Knuckle","2B",90,72,88,85),
  makeBatter("b9","Dinger McGee","DH",76,95,74,50),
  makeBatter("b10","Homie Run","RF",78,80,72,78),
  makeBatter("b11","Speedy Gonzalez Jr","CF",82,68,76,90),
  makeBatter("b12","Skip Triplowski","SS",80,70,80,88),
  makeBatter("b13","Bob Dugout","3B",70,85,65,66),
  makeBatter("b14","Girth Brooks","1B",72,88,62,58),
  makeBatter("b15","Lance A. Lot","LF",76,82,70,72),
  makeBatter("b16","Mitt Romney","C",74,76,78,55),
  makeBatter("b17","Double Down Jones","2B",82,65,80,82),
  makeBatter("b18","Big Papi Smurf","DH",68,90,72,52),
  makeBatter("b19","Al Capone Base","RF",78,78,70,74),
  makeBatter("b20","Willie Makeit","CF",80,72,74,86),
  makeBatter("b21","Ty Cobbwebs","1B",70,82,66,60),
  makeBatter("b22","Roberto Clementime","SS",84,64,78,90),
  makeBatter("b23","Hank Aarondvark","3B",72,80,70,70),
  makeBatter("b24","Frank Robinsonian","LF",76,78,72,76),
  makeBatter("b25","Yogi Bearra","C",70,74,80,56),
  makeBatter("b26","Reggie Jacksonite","2B",80,68,76,84),
  makeBatter("b27","Chipper Johns-tone","DH",66,88,70,50),
  makeBatter("b28","Wade Boggsworth","RF",76,76,68,78),
  makeBatter("b29","Rickey Hendersun","CF",78,70,74,88),
  makeBatter("b30","Nomar Garciapunto","1B",68,84,64,58),
  makeBatter("b31","Phil Grundle","SS",74,62,76,80),
  makeBatter("b32","Gary Sheffieldgoal","3B",66,74,66,66),
  makeBatter("b33","Manny Ramirezident","LF",70,76,64,70),
  makeBatter("b34","Pudge Rodriguessed","C",64,70,74,52),
  makeBatter("b35","Jim Thome Alone","2B",74,62,72,78),
  makeBatter("b36","Mo Vaughn-couver","DH",62,80,66,48),
  makeBatter("b37","Raul Mondaysee","RF",70,70,64,72),
  makeBatter("b38","Sammy Sosad","CF",72,64,68,84),
  makeBatter("b39","Jeff Baglunch","1B",64,76,60,54),
  makeBatter("b40","Tim Salmonella","SS",68,60,74,76),
  makeBatter("b41","Todd Heltonious","3B",62,72,64,64),
  makeBatter("b42","Larry Walker Texas","LF",68,70,62,70),
  makeBatter("b43","Moises Aloud","C",60,66,70,50),
  makeBatter("b44","Brian Gilesberg","2B",72,58,70,76),
  makeBatter("b45","Johnny Damnit","DH",58,78,62,46),
  makeBatter("b46","Ray Durhamster","RF",66,66,60,68),
  makeBatter("b47","Benito Santiaghost","CF",68,60,64,80),
  makeBatter("b48","Daryle Wardrobed","1B",60,72,58,52),
  makeBatter("b49","Steve Finkelman","SS",64,58,70,74),
  makeBatter("b50","Bip Robinsong","3B",58,68,62,62),
  makeBatter("b51","Oddibe McDowell Jr","LF",64,66,58,66),
  makeBatter("b52","Mackey Sasshole","C",56,62,66,48),
  makeBatter("b53","Tuffy Rhodesian","2B",68,54,66,72),
  makeBatter("b54","Coot Veal-o","DH",54,74,58,44),
  makeBatter("b55","Stubby Clapp Trap","RF",62,62,56,64),
  makeBatter("b56","Ducky Medwicket","CF",64,56,60,76),
  makeBatter("b57","Darryl Strawberry Fields","1B",56,68,54,50),
  makeBatter("b58","Ugueth Urbinaugh","SS",60,54,66,70),
  makeBatter("b59","Rusty Staubwound","3B",54,64,58,58),
  makeBatter("b60","Oil Can Boycott","LF",60,62,54,62),
  makeBatter("b61","Chico Escuelita","C",52,58,62,46),
  makeBatter("b62","Ned Yapworth","2B",64,50,62,68),
  makeBatter("b63","Cleat Eastwood","DH",50,70,54,42),
  makeBatter("b64","Pitchy McPitchface","RF",58,58,52,60),
  makeBatter("b65","Stan Musial Chairs","CF",60,52,56,72),
  makeBatter("b66","Bat Masterson Jr","1B",52,64,50,48),
  makeBatter("b67","Ernie Bankroll","SS",56,50,62,66),
  makeBatter("b68","Mel Ott-omodo","3B",50,60,54,54),
  makeBatter("b69","Cap Ansonfire","LF",56,58,50,58),
  makeBatter("b70","Roger Hornsbyweed","C",48,54,58,44),
  makeBatter("b71","Tris Speakeasy","2B",60,46,58,64),
  makeBatter("b72","Shoeless Joe Frome","DH",46,66,50,40),
  makeBatter("b73","King Kelly Clarkson","RF",54,54,48,56),
  makeBatter("b74","Turkey Mike Donkey","CF",56,48,52,68),
  makeBatter("b75","Dummy Hoyaway","1B",48,60,46,46),
  makeBatter("b76","Rube Waddlesworth","SS",52,46,58,62),
  makeBatter("b77","Boileryard Clarket","3B",46,56,50,50),
  makeBatter("b78","Icebox Chamberlain","LF",52,54,46,54),
  makeBatter("b79","Noodles Hahn Solo","C",44,50,54,42),
  makeBatter("b80","Buttercup Dickerson","2B",56,42,54,60),
  makeBatter("b81","Wagon Tongue Burke","DH",42,62,46,38),
  makeBatter("b82","Phenomenal Smith-y","RF",50,50,44,52),
  makeBatter("b83","Piano Legs Hickman","CF",52,44,48,64),
  makeBatter("b84","Poodles Hannaford","1B",44,56,42,44),
  makeBatter("b85","Lollipop Lujack","SS",48,42,54,58),
  makeBatter("b86","Pretzels Getzien","3B",42,52,46,46),
  makeBatter("b87","Luscious Easter","LF",48,50,42,50),
  makeBatter("b88","Vinegar Bend Mizell","C",40,46,50,40),
  makeBatter("b89","Suds Sutherland","2B",52,38,50,56),
  makeBatter("b90","Moonshot McGillicuddy","DH",38,58,42,36),
];

const PITCHER_POOL = [
  // stamina 5th arg: 90=workhorse, 70=avg, 50=short arm
  makePitcher("p1","Sandy Koufaxed",92,85,78,90),
  makePitcher("p2","Nolan Ryanair",88,90,82,95),
  makePitcher("p3","Roger Clemonsade",95,78,70,85),
  makePitcher("p4","Pedro Martinizer",85,92,80,80),
  makePitcher("p5","Randy Johnsonian",90,82,76,88),
  makePitcher("p6","Greg Madduxedo",86,88,84,92),
  makePitcher("p7","Tom Seaverest",80,82,76,82),
  makePitcher("p8","Bob Gibsonite",82,78,80,78),
  makePitcher("p9","Steve Carltonaise",84,74,72,80),
  makePitcher("p10","Whitey Fordable",78,82,78,75),
  makePitcher("p11","Curt Schillingly",80,80,74,78),
  makePitcher("p12","Mike Mussinator",76,84,82,74),
  makePitcher("p13","Fergie Jenkinstein",82,76,76,76),
  makePitcher("p14","Don Drysdale Ale",78,80,80,80),
  makePitcher("p15","Juan Marichalupa",80,78,74,78),
  makePitcher("p16","Catfish Hunter BBQ",76,82,78,72),
  makePitcher("p17","Vida Bluechip",78,76,82,70),
  makePitcher("p18","Rollie Fingers Crossed",80,74,76,65),
  makePitcher("p19","Boo Moon Wright",72,74,76,68),
  makePitcher("p20","Chuckie Bones",74,72,78,66),
  makePitcher("p21","Spit Ballington",70,76,72,64),
  makePitcher("p22","Earl Weavershed",72,74,74,68),
  makePitcher("p23","Billy Martian",74,70,76,66),
  makePitcher("p24","Sparky Andersonet",70,74,72,64),
  makePitcher("p25","Tommy Laseorda",72,72,70,62),
  makePitcher("p26","Dusty Bakerman",68,76,74,60),
  makePitcher("p27","Denny McLainbo",70,72,72,64),
  makePitcher("p28","Jim Kaatwalk",68,70,76,62),
  makePitcher("p29","Luis Tiantrum",72,68,72,66),
  makePitcher("p30","Gaylord Perrywinkle",68,72,70,60),
  makePitcher("p31","Mickey Loychemist",70,70,68,62),
  makePitcher("p32","Ken Holtzmanstein",66,74,72,58),
  makePitcher("p33","Dave McNallyzone",68,68,74,60),
  makePitcher("p34","Jim Palmeraide",70,66,72,62),
  makePitcher("p35","Mike Cuellarant",66,70,70,58),
  makePitcher("p36","Woodie Fryman Egg",68,68,68,56),
  makePitcher("p37","Burt Hootonanny",62,64,68,52),
  makePitcher("p38","Hank Aguirreeka",60,66,64,50),
  makePitcher("p39","Mudcat Grantham",62,62,66,52),
  makePitcher("p40","Satchmo Paige",58,66,62,48),
  makePitcher("p41","Shovel Hands McGee",60,60,64,50),
  makePitcher("p42","Wild Thang Thatcher",62,58,62,48),
  makePitcher("p43","Bobo Newsomatic",58,62,60,46),
  makePitcher("p44","Slim Sallee Forth",60,58,62,50),
  makePitcher("p45","Rube Marquardigan",56,62,60,46),
  makePitcher("p46","Lefty Gomezdilla",58,58,62,48),
  makePitcher("p47","Chief Benderoni",60,56,58,50),
  makePitcher("p48","Three Finger Brown",56,60,58,46),
  makePitcher("p49","Waddell Von Waddel",54,58,60,44),
  makePitcher("p50","Amos Rusiebert",56,56,58,46),
  makePitcher("p51","Pud Galvinizer",52,58,56,42),
  makePitcher("p52","Old Hoss Radbourn",54,54,58,44),
  makePitcher("p53","Cy Youngblood",50,56,54,40),
  makePitcher("p54","Hooks Wittsicle",52,52,56,42),
  makePitcher("p55","Jouett Meekinsect",48,54,52,40),
  makePitcher("p56","Noodles Hahn-Over",50,50,54,38),
  makePitcher("p57","Oops Yourdead",46,52,50,36),
  makePitcher("p58","Brickwall Jackson",48,48,52,38),
  makePitcher("p59","Dazzy Vancelot",44,50,48,36),
  makePitcher("p60","Firpo Marberry Jam",46,46,50,34),
];

const PLAYER_POOL = [...BATTER_POOL, ...PITCHER_POOL];


// ─── WALK-UP SONGS ───────────────────────────────────────────────────────────
const WALKUP_SONGS = {
  "b1":"Enter Sandman - Metallica","b2":"Eye of the Tiger - Survivor",
  "b3":"We Will Rock You - Queen","b4":"Jump Around - House of Pain",
  "b5":"Ridin' - Chamillionaire","b6":"Welcome to the Jungle - G N R",
  "b7":"Who Let the Dogs Out - Baha Men","b8":"All Star - Smash Mouth",
  "b9":"Sweet Home Alabama - Lynyrd Skynyrd","b10":"Thunderstruck - AC/DC",
  "b11":"Born to Run - Springsteen","b12":"Mr. Brightside - The Killers",
  "b13":"Sabotage - Beastie Boys","b14":"Baby Got Back - Sir Mix-a-Lot",
  "b15":"Shipping Up to Boston - Dropkick Murphys","b16":"Cotton Eye Joe - Rednex",
  "b17":"Piano Man - Billy Joel","b18":"Can't Stop - RHCP",
  "b19":"Lose Yourself - Eminem","b20":"Don't Stop Me Now - Queen",
  "b21":"Zombie - The Cranberries","b22":"Africa - Toto",
  "b23":"Gold Digger - Kanye West","b24":"Sweet Caroline - Neil Diamond",
  "b25":"Here Comes the Sun - Beatles","b26":"Livin on a Prayer - Bon Jovi",
  "b27":"Smooth - Santana ft. Rob Thomas","b28":"Don't Stop Believin - Journey",
  "b29":"Jump - Van Halen","b30":"Take Me Out - Franz Ferdinand",
  "b31":"Seven Nation Army - White Stripes","b32":"Mr. Jones - Counting Crows",
  "b33":"Semi-Charmed Life - Third Eye Blind","b34":"Closing Time - Semisonic",
  "b35":"Fly Away - Lenny Kravitz","b36":"Tubthumping - Chumbawamba",
  "b37":"Mambo No. 5 - Lou Bega","b38":"Butterfly - Crazy Town",
  "b39":"Kryptonite - 3 Doors Down","b40":"Hanging by a Moment - Lifehouse",
  "b41":"Last Resort - Papa Roach","b42":"In the End - Linkin Park",
  "b43":"How You Remind Me - Nickelback","b44":"Drops of Jupiter - Train",
  "b45":"Superman - Five for Fighting","b46":"Everywhere - Michelle Branch",
  "b47":"Complicated - Avril Lavigne","b48":"Hero - Chad Kroeger",
  "b49":"Clocks - Coldplay","b50":"Beautiful Day - U2",
  "b51":"Float On - Modest Mouse","b52":"Mr. Brightside (again) - The Killers",
  "b53":"Maps - Yeah Yeah Yeahs","b54":"Take Me Out - Franz Ferdinand",
  "b55":"Slow Ride - Foghat","b56":"Shout at the Devil - Motley Crue",
  "b57":"Pour Some Sugar on Me - Def Leppard","b58":"Cherry Pie - Warrant",
  "b59":"Livin on a Prayer (again) - Bon Jovi","b60":"Here I Go Again - Whitesnake",
  "b61":"YMCA - Village People","b62":"Macarena - Los Del Rio",
  "b63":"Who Are You - The Who","b64":"Old Time Rock and Roll - Bob Seger",
  "b65":"Born to Be Wild - Steppenwolf","b66":"Sharp Dressed Man - ZZ Top",
  "b67":"Highway to Hell - AC/DC","b68":"Roxanne - The Police",
  "b69":"Blister in the Sun - Violent Femmes","b70":"Come On Eileen - Dexys",
  "b71":"Girls Just Want to Have Fun - Cyndi Lauper","b72":"Wake Me Up - Avicii",
  "b73":"Call Me Maybe - Carly Rae Jepsen","b74":"Gangnam Style - PSY",
  "b75":"Friday - Rebecca Black","b76":"Baby - Justin Bieber",
  "b77":"What Does the Fox Say - Ylvis","b78":"Harlem Shake - Baauer",
  "b79":"Cha Cha Slide - DJ Casper","b80":"Soulja Boy - Soulja Boy",
  "b81":"Single Ladies - Beyonce","b82":"Poker Face - Lady Gaga",
  "b83":"Party in the USA - Miley Cyrus","b84":"Run the World - Beyonce",
  "b85":"Rolling in the Deep - Adele","b86":"Uptown Funk - Bruno Mars",
  "b87":"Happy - Pharrell Williams","b88":"Shake It Off - Taylor Swift",
  "b89":"Old Town Road - Lil Nas X","b90":"Blinding Lights - The Weeknd",
};


// ─── PERSISTENT STORAGE ──────────────────────────────────────────────────────
// Uses window.storage (artifact API) with localStorage fallback
const SAVE_KEY = "diamond-duel-playoff-v1";

function compressPlayoff(po) {
  // Strip pitch histories to keep save size small
  return {
    ...po,
    matchups: po.matchups.map(m=>({
      ...m,
      games: m.games.map(g=>({
        awayScore: g.awayScore,
        homeScore: g.homeScore,
        simmed: g.simmed||false,
      }))
    })),
    stats: {},
    simLog: (po.simLog||[]).slice(-20),
  };
}

async function savePlayoff(playoffData) {
  const json = JSON.stringify(compressPlayoff(playoffData));
  // Try artifact storage first, fall back to localStorage
  try {
    if(window.storage && typeof window.storage.set === "function"){
      await window.storage.set(SAVE_KEY, json);
      return true;
    }
  } catch(e) { console.warn("artifact storage save failed:", e); }
  try {
    localStorage.setItem(SAVE_KEY, json);
    return true;
  } catch(e) { console.warn("localStorage save failed:", e); return false; }
}

async function loadPlayoff() {
  // Try artifact storage first, fall back to localStorage
  try {
    if(window.storage && typeof window.storage.get === "function"){
      const result = await window.storage.get(SAVE_KEY);
      if(result && result.value) return JSON.parse(result.value);
    }
  } catch(e) { console.warn("artifact storage load failed:", e); }
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw) return JSON.parse(raw);
  } catch(e) { console.warn("localStorage load failed:", e); }
  return null;
}

async function deleteSave() {
  try {
    if(window.storage && typeof window.storage.delete === "function")
      await window.storage.delete(SAVE_KEY);
  } catch(e) {}
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
}


// ─── SUPABASE ONLINE MODE ─────────────────────────────────────────────────────
const SUPABASE_URL = "https://ilkdmydpukdfdorxeekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsa2RteWRwdWtkZmRvcnhlZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyOTUyNzMsImV4cCI6MjA5OTg3MTI3M30.ISx1pjxLeKyfBpvJBvcxIY9xPFBVtPxUTl9W99OrB24";

const supaHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

const supa = {
  // Get the state object stored in the room
  async getRoom(code) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/rooms?code=eq.${encodeURIComponent(code)}&select=state`,
        { headers: supaHeaders }
      );
      const rows = await r.json();
      return rows?.[0]?.state || null;
    } catch(e) { console.error("getRoom failed:", e); return null; }
  },

  // Write/overwrite the state object for a room
  async upsertRoom(code, state) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/rooms`, {
        method: "POST",
        headers: { ...supaHeaders, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ code, state }),
      });
      if(!r.ok) console.error("upsertRoom failed:", r.status, await r.text());
    } catch(e) { console.error("upsertRoom error:", e); }
  },

  // Subscribe to any change on this room row
  subscribeRoom(code, callback) {
    const wsUrl = `${SUPABASE_URL.replace("https","wss")}/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        topic: `realtime:public:rooms:code=eq.${code}`,
        event: "phx_join",
        payload: { config: { broadcast:{self:false}, presence:{key:""} } },
        ref: "1",
      }));
      // Keep-alive ping every 20s
      ws._ping = setInterval(()=>ws.readyState===1&&ws.send(JSON.stringify({topic:"phoenix",event:"heartbeat",payload:{},ref:"hb"})),20000);
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if(msg.event==="postgres_changes"){
          const record = msg.payload?.data?.record;
          callback(record?.state || null);
        }
      } catch{}
    };
    ws.onerror = ws.onclose = () => clearInterval(ws._ping);
    return () => { clearInterval(ws._ping); ws.close(); };
  },
};

function generateRoomCode() {
  return Math.random().toString(36).slice(2,7).toUpperCase();
}


// Determine whose turn it is to write after a given phase transition
// "away" pitches in top half, "home" pitches in bottom half
// "away" bats in top half, "home" bats in bottom half
function nextTurn(phase, topBottom, playerSide) {
  if(phase==="pitching")    return topBottom==="top"?"home":"away"; // pitcher writes pitch choice
  if(phase==="batting")     return topBottom==="top"?"away":"home"; // batter writes swing
  if(phase==="rolling")     return topBottom==="top"?"away":"home"; // batter resolves
  if(phase==="result")      return topBottom==="top"?"away":"home"; // batter advances
  if(phase==="between")     return "away"; // away always initiates between-inning
  if(phase==="lineup_setup")return "away"; // away sets lineup first
  if(phase==="draft")       return "away"; // away drafts (solo drafts handled separately)
  if(phase==="gameover")    return "away";
  if(phase==="walkoff")     return "home";
  return "away";
}


// ─── PLAYOFF ENGINE ───────────────────────────────────────────────────────────

function initPlayoff(teams, bracketSize, seriesLen, innings, humanIdxs){
  // teams: array of {name, colorIdx, roster, lineup, isHuman}
  // Build first-round matchups (1v8,2v7,... or 1v4,2v3)
  const n = bracketSize;
  const seeds = teams.map((t,i)=>({...t, seed:i+1, seriesWins:0}));
  const matchups = [];
  for(let i=0;i<n/2;i++){
    matchups.push({
      id:`r1m${i}`, round:1, matchupIdx:i,
      awayIdx:i, homeIdx:n-1-i,
      games:[], seriesLen, innings,
      awayWins:0, homeWins:0, winner:null,
      status:"pending", // pending | active | complete
    });
  }
  return{
    bracketSize:n, seriesLen, innings,
    teams:seeds, matchups,
    round:1, totalRounds:Math.log2(n),
    stats:{}, // keyed by playerId -> cumulative stats
    phase:"hub", // hub | in_game | sim
    activeMatchup:null, // matchup id currently being played
    activeGameTeams:null, // {away, home} team indices
    simLog:[], // log of simmed game results
    dayCounter:1,
  };
}

// Quick sim for AI vs AI games — no UI, just produces a score
// Build a full AI team from scratch using all tiers (not just C)
function buildAIRoster(pool, takenIds){
  const overall=p=>p.type==="batter"?(p.contact+p.power+p.eye+p.speed)/4:(p.stuff+p.control+p.movement)/3;
  const avail=pool.filter(p=>!takenIds.includes(p.id)).sort((a,b)=>overall(b)-overall(a));
  const batters=[]; const pitchers=[];
  for(const p of avail){
    if(batters.length>=FULL_BATTERS&&pitchers.length>=FULL_PITCHERS) break;
    if(p.type==="batter"&&batters.length<FULL_BATTERS) batters.push(p);
    else if(p.type==="pitcher"&&pitchers.length<FULL_PITCHERS) pitchers.push(p);
  }
  return{batters,pitchers};
}

function simGame(awayRoster, homeRoster, innings=3){
  function teamStrength(roster){
    const batAvg = roster.batters.length
      ? roster.batters.reduce((s,b)=>(s+(b.contact+b.power+b.eye)/3),0)/roster.batters.length
      : 50;
    const pitAvg = roster.pitchers.length
      ? roster.pitchers.reduce((s,p)=>(s+(p.stuff+p.control)/2),0)/roster.pitchers.length
      : 50;
    return{batAvg, pitAvg};
  }
  const away = teamStrength(awayRoster);
  const home = teamStrength(homeRoster);

  function simInningHalf(batStr, pitStr){
    let runs=0, outs=0, bases=[false,false,false];
    while(outs<3){
      // hit probability driven by batter contact vs pitcher control
      const hitChance = 0.26 + (batStr-50)*0.003 - (pitStr-50)*0.002;
      const roll = Math.random();
      if(roll < hitChance*0.12){ // HR
        runs += 1 + bases.filter(Boolean).length;
        bases=[false,false,false];
      } else if(roll < hitChance*0.3){ // extra base
        if(bases[1]) runs++;
        if(bases[2]) runs++;
        bases=[false,true,Math.random()<0.5];
      } else if(roll < hitChance){ // single
        if(bases[2]) runs++;
        bases=[bases[1],bases[0],false];
      } else if(roll < hitChance + 0.08){ // walk
        if(bases[0]&&bases[1]&&bases[2]) runs++;
        bases=[true,bases[0]&&bases[1]?bases[1]:bases[0],bases[0]&&bases[1]?bases[1]:false];
      } else { // out
        outs++;
      }
    }
    return runs;
  }

  let awayScore=0, homeScore=0;
  for(let i=1;i<=innings;i++){
    awayScore += simInningHalf(away.batAvg, home.pitAvg);
    // Home skips bottom of final inning if already winning
    if(i===innings && homeScore>awayScore) break;
    homeScore += simInningHalf(home.batAvg, away.pitAvg);
  }
  // No ties — keep playing extra innings until someone scores
  while(awayScore===homeScore){
    awayScore += simInningHalf(away.batAvg, home.pitAvg);
    homeScore += simInningHalf(home.batAvg, away.pitAvg);
    // Safety: if both score same in extra, keep going (extremely rare infinite loop guard)
    if(awayScore===homeScore && awayScore>0) homeScore++; // give home team walk-off
  }
  return{awayScore, homeScore};
}

// Advance playoff bracket after a series completes
function advanceBracket(playoff){
  const p = JSON.parse(JSON.stringify(playoff)); // deep copy
  const roundMatchups = p.matchups.filter(m=>m.round===p.round);
  const allDone = roundMatchups.every(m=>m.status==="complete");
  if(!allDone) return p;

  if(p.round >= p.totalRounds) return{...p, phase:"champion"};

  // Build next round matchups
  const nextRound = p.round + 1;
  const winners = roundMatchups.map(m=>m.winner);
  const nextMatchups = [];
  for(let i=0;i<winners.length/2;i++){
    nextMatchups.push({
      id:`r${nextRound}m${i}`, round:nextRound, matchupIdx:i,
      awayIdx:winners[i*2], homeIdx:winners[i*2+1],
      games:[], seriesLen:p.seriesLen, innings:p.innings,
      awayWins:0, homeWins:0, winner:null, status:"pending",
    });
  }
  return{...p, matchups:[...p.matchups,...nextMatchups], round:nextRound, dayCounter:p.dayCounter+1};
}


// Generate plausible per-player stats for a simmed game
// R always sums exactly to runsScored; AB and H scale with innings
function simGameStats(roster, runsScored, innings) {
  const stats = {};
  const batters = roster.batters.slice(0, 9);
  const n = batters.length;
  if(!n) return stats;

  // Realistic totals
  // AB: ~3 per inning base + small bonus for high-scoring games
  const totalAB  = Math.max(n, innings * 3 + Math.round(runsScored * 0.3));
  // H: team BA ~.250 baseline, higher when scoring more
  const totalH   = Math.min(totalAB - 1, Math.max(runsScored,
                     Math.round(totalAB * 0.25 + runsScored * 0.35)));
  const totalHR  = Math.min(totalH, Math.max(0,
                     Math.round(runsScored * 0.15 + Math.random() * 0.5)));
  const totalBB  = Math.max(0, Math.round(innings * 0.33));
  const totalR   = runsScored;             // EXACT match to score
  const totalRBI = runsScored; // RBI total equals runs scored (runners must score to earn RBI)

  // AB weight by lineup position (top of order bats more)
  const abW = [1.2,1.15,1.1,1.0,1.0,0.95,0.9,0.88,0.85].slice(0,n);
  const totalABW = abW.reduce((s,v)=>s+v,0);

  // Contact/power weights from actual player stats
  const cW = batters.map(b=>Math.max(1, b.contact||50));
  const pW = batters.map(b=>Math.max(1, b.power||50));
  const totalCW = cW.reduce((s,v)=>s+v,0);
  const totalPW = pW.reduce((s,v)=>s+v,0);

  // First pass: assign AB, H, HR per batter
  const entries = batters.map((b,i)=>({
    id:   b.id,
    name: b.name,
    ab:   Math.max(1, Math.round((abW[i]/totalABW)*totalAB)),
    h:    0, hr: 0, bb: 0, r: 0, rbi: 0,
  }));

  // Distribute H weighted by contact, capped by AB
  let hLeft = totalH;
  entries.forEach((e,i)=>{
    const share = Math.min(e.ab, Math.round((cW[i]/totalCW)*totalH));
    e.h = Math.min(share, hLeft);
    hLeft -= e.h;
  });
  // Give leftover H to first batters that can absorb them
  entries.forEach(e=>{ if(hLeft>0&&e.h<e.ab){e.h++;hLeft--;} });

  // Distribute HR weighted by power, capped by H
  let hrLeft = totalHR;
  entries.forEach((e,i)=>{
    const share = Math.min(e.h, Math.round((pW[i]/totalPW)*totalHR));
    e.hr = Math.min(share, hrLeft);
    hrLeft -= e.hr;
  });

  // Distribute BB
  let bbLeft = totalBB;
  entries.forEach((e,i)=>{ if(bbLeft>0){ e.bb = i<4?Math.min(1,bbLeft):0; bbLeft-=e.bb; } });

  // Distribute R to EXACTLY equal runsScored
  let rLeft = totalR;
  // Give 1 R to each batter who had a hit (starting from top), until rLeft exhausted
  entries.forEach(e=>{ if(rLeft>0&&e.h>0){e.r=1;rLeft--;} });
  // Distribute remaining R to top of order
  entries.forEach(e=>{ if(rLeft>0){e.r++;rLeft--;} });

  // Distribute RBI close to totalRBI
  let rbiLeft = totalRBI;
  entries.forEach(e=>{
    if(rbiLeft<=0) return;
    // HRs always earn at least 1 RBI
    const rbi = Math.min(rbiLeft, e.hr + (e.h>e.hr&&rbiLeft>1?1:0));
    e.rbi = rbi;
    rbiLeft -= rbi;
  });
  // Any leftover RBI to batters with hits
  entries.forEach(e=>{ if(rbiLeft>0&&e.h>0){e.rbi++;rbiLeft--;} });

  // Build stats map
  entries.forEach(e=>{
    stats[e.id]={name:e.name, AB:e.ab, H:e.h, HR:e.hr, BB:e.bb, R:e.r, RBI:e.rbi};
  });
  return stats;
}


// ─── SOUND ENGINE ────────────────────────────────────────────────────────────
// Pure Web Audio API — no libraries, no external files
const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);

let _soundEnabled = true;
function playSound(type) {
  if (!AudioCtx || !_soundEnabled) return;
  try {
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);

    const play = (freq, dur, wave="sine", vol=1, startDelay=0, freqEnd=null) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(master);
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
      if (freqEnd) osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + startDelay + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime + startDelay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + dur);
      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + dur + 0.01);
    };

    if (type === "hit") {
      // Solid crack — thump + bright ping
      play(120, 0.08, "sawtooth", 1.2);
      play(800, 0.12, "sine", 0.6, 0.02);
      play(1200, 0.18, "sine", 0.3, 0.04);
    } else if (type === "homerun") {
      // Big crack + rising cheer tone
      play(100, 0.1, "sawtooth", 1.5);
      play(600, 0.15, "sine", 0.8, 0.02);
      play(880, 0.4, "sine", 0.5, 0.1, 1320);
      play(1100, 0.4, "sine", 0.3, 0.15, 1760);
      play(1320, 0.5, "sine", 0.3, 0.25, 2200);
    } else if (type === "strikeout") {
      // Low descending tone
      play(400, 0.15, "sawtooth", 0.8, 0, 120);
      play(200, 0.25, "sine", 0.5, 0.1, 80);
    } else if (type === "walk") {
      // Two ascending tones
      play(440, 0.12, "sine", 0.6);
      play(660, 0.18, "sine", 0.5, 0.1);
    } else if (type === "out") {
      // Short dull thud
      play(180, 0.12, "sawtooth", 0.7, 0, 60);
    } else if (type === "dice") {
      // Light rattling clicks
      [0, 0.06, 0.12, 0.18, 0.24].forEach(t => play(800 + Math.random()*400, 0.04, "square", 0.3, t));
    } else if (type === "guess_correct") {
      // Bright ding-ding
      play(880, 0.12, "sine", 0.7);
      play(1320, 0.18, "sine", 0.5, 0.1);
    } else if (type === "guess_wrong") {
      // Wah-wah down
      play(300, 0.15, "sawtooth", 0.6, 0, 180);
    } else if (type === "walkoff") {
      // Triumphant fanfare
      [0,0.15,0.28,0.42,0.55].forEach((t,i) => {
        const freqs = [523,659,784,1047,1319];
        play(freqs[i], 0.25, "sine", 0.7, t);
        play(freqs[i]*1.26, 0.2, "sine", 0.3, t+0.02);
      });
    }
    setTimeout(()=>ctx.close(), 2000);
  } catch(e) { /* silently ignore if audio unavailable */ }
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PITCH_TYPES = [
  { id:"fastball",  label:"Fastball",  abbr:"FB", color:"#E63946" },
  { id:"curveball", label:"Curveball", abbr:"CB", color:"#457B9D" },
  { id:"changeup",  label:"Changeup",  abbr:"CH", color:"#2A9D8F" },
  { id:"slider",    label:"Slider",    abbr:"SL", color:"#E9C46A" },
  { id:"sinker",    label:"Sinker",    abbr:"SK", color:"#9B5DE5" },
];
const SWING_TYPES = [
  { id:"power",   label:"Power Swing",   desc:"+HR, –contact" },
  { id:"contact", label:"Contact Swing", desc:"+contact, –power" },
  { id:"bunt",    label:"Bunt",          desc:"sacrifice / surprise" },
  { id:"take",    label:"Take",          desc:"look for a walk" },
];
const TIER_COLOR = { S:"#f59e0b", A:"#60a5fa", B:"#34d399", C:"#94a3b8" };

// ─── STAMINA SYSTEM ──────────────────────────────────────────────────────────
// Pitchers lose effective stats as batters faced increases.
// Fatigue = batters_faced / stamina_threshold; threshold = stamina/10 + 5
function pitcherFatigue(pitcher, battersFaced) {
  if (!pitcher) return { stuff:70, control:70, movement:70 };
  const threshold = Math.round(pitcher.stamina / 10) + 5; // 70stam→12, 90stam→14, 50stam→10
  const fatigue = Math.min(1, battersFaced / threshold);   // 0=fresh, 1=gassed
  const drop = fatigue * 25; // max -25 to each stat
  return {
    ...pitcher,
    stuff:    Math.max(30, pitcher.stuff    - drop),
    control:  Math.max(30, pitcher.control  - drop),
    movement: Math.max(30, pitcher.movement - drop),
    fatigue,
    battersFaced,
  };
}

// ─── DICE SYSTEM ─────────────────────────────────────────────────────────────
function statToWeights(stat) {
  const delta = (stat - 70) / 100;
  return Array.from({length:6}, (_,i) => Math.max(0.05, 1 + (i - 2.5) * delta * 1.4));
}
function weightedD6(weights) {
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for (let i=0;i<6;i++) { r-=weights[i]; if(r<=0) return i+1; }
  return 6;
}

// Outcome bands per swing type — used for display on rolling/result screens
function outcomeBands(swing) {
  if (swing === "take")    return [["≥+1","Walk","#34d399"],["0 or less","Strikeout","#f87171"]];
  if (swing === "bunt")    return [["≥+3","Single","#60a5fa"],["1 to 2","Out","#94a3b8"],["0 or less","Strikeout","#f87171"]];
  if (swing === "power")   return [["≥+5","HR","#f59e0b"],["+3 to +4","HR/Triple","#f59e0b"],["+2","Double/Single","#34d399"],["+1","Single","#60a5fa"],["0 to -1","Out","#94a3b8"],["≤-2","Strikeout","#f87171"]];
  /* contact */            return [["≥+5","Triple","#60a5fa"],["+3 to +4","Double","#34d399"],["+1 to +2","Single","#60a5fa"],["0 to -1","Out","#94a3b8"],["≤-2","Strikeout","#f87171"]];
}

// Three dice per at-bat:
//   Batter d6  — weighted by batter's relevant stat (higher stat → more high rolls)
//   Pitcher d6 — weighted by pitcher's relevant stat (higher stat → more high rolls)
//   Luck d6    — flat d6, adds -1 / 0 / +1 to the net
//
// Net = batterRoll - pitcherRoll + luckMod  (range: -6 to +7)
//
// Outcome table (no mid-at-bat balls or strikes — every swing resolves fully):
//   TAKE:    net >= 1 → walk      |  net <= 0 → strikeout (looking)
//   BUNT:    net >= 3 → single    |  net 1-2  → out       |  net <= 0 → strikeout
//   POWER:   net >= 5 → HR        |  net 3-4  → HR/Triple |  net 2 → Double/Single
//            net 1   → Single     |  net -1-0 → Out       |  net <= -2 → Strikeout
//   CONTACT: net >= 4 → Triple    |  net 3 → Double       |  net 1-2 → Single
//            net -1-0 → Out       |  net <= -2 → Strikeout
function rollDice(pitch, swing, batter, pitcher, pitchGuess) {
  // Which stat drives each die
  const swingStatMap = { power:"power", contact:"contact", bunt:"contact", take:"eye" };
  const pitchStatMap = { fastball:"stuff", curveball:"stuff", slider:"stuff", changeup:"stuff", sinker:"movement" };
  const batterStatKey  = swingStatMap[swing]  || "contact";
  const pitcherStatKey = pitchStatMap[pitch]  || "stuff";

  const batterStatVal  = batter  ? batter[batterStatKey]                                   : 70;
  // Pitcher die blends primary pitch stat with control (accuracy always matters)
  const pitcherStatVal = pitcher ? Math.round((pitcher[pitcherStatKey] + pitcher.control) / 2) : 70;

  // Pitch guess bonus: correct guess +8 (sat on it), wrong guess -5 (fooled)
  const guessCorrect = pitchGuess && pitchGuess === pitch;
  const guessWrong   = pitchGuess && pitchGuess !== pitch;
  const guessBonusVal = guessCorrect ? 8 : guessWrong ? -5 : 0;
  const adjustedBatterStatVal = Math.min(99, Math.max(10, batterStatVal + guessBonusVal));

  const batterWeights  = statToWeights(adjustedBatterStatVal);
  const pitcherWeights = statToWeights(pitcherStatVal);

  const batterRoll  = weightedD6(batterWeights);  // 1-6, skewed by batter stat
  const pitcherRoll = weightedD6(pitcherWeights); // 1-6, skewed by pitcher stat
  const luckRoll    = weightedD6([1,1,1,1,1,1]);  // flat d6

  // Luck modifier: 5-6 = lucky (+1), 1-2 = unlucky (-1), 3-4 = neutral (0)
  const luckMod = luckRoll >= 5 ? 1 : luckRoll <= 2 ? -1 : 0;
  // Net is the single number that determines outcome band
  const net = batterRoll - pitcherRoll + luckMod; // range: -6 to +7

  let outcome;
  const r = Math.random();

  if (swing === "take") {
    // Batter is looking — walk vs strikeout only. Net >= 1 favors walk.
    outcome = net >= 1 ? "walk" : "strikeout";
  } else if (swing === "bunt") {
    if      (net >= 3) outcome = "single";
    else if (net >= 1) outcome = "out";       // weak contact
    else               outcome = "strikeout"; // missed bunt
  } else if (swing === "power") {
    if      (net >= 5) outcome = "hr";
    else if (net === 4) outcome = r < 0.75 ? "hr" : "triple";
    else if (net === 3) outcome = r < 0.5  ? "hr" : "double";
    else if (net === 2) outcome = r < 0.6  ? "double" : "single";
    else if (net === 1) outcome = "single";
    else if (net >= -1) outcome = "out";
    else                outcome = "strikeout";
  } else {
    // contact swing
    if      (net >= 5) outcome = "triple";
    else if (net === 4) outcome = r < 0.6 ? "triple" : "double";
    else if (net === 3) outcome = "double";
    else if (net === 2) outcome = r < 0.7 ? "single" : "double";
    else if (net === 1) outcome = r < 0.6 ? "single" : "out";
    else if (net >= -1) outcome = "out";
    else                outcome = "strikeout";
  }

  // ── Post-roll modifiers (clearly tracked so UI can display them) ──────────
  const baseOutcome = outcome; // outcome before modifiers
  let modifier = null;         // shown on result screen if a modifier fires

  // Breaking ball nastiness: pitcher max roll dominates
  if (pitcherRoll === 6 && ["curveball","slider","changeup"].includes(pitch)) {
    const pre = outcome;
    if (outcome === "double") outcome = "single";
    if (outcome === "single") outcome = "out";
    if (outcome === "out" && Math.random() < 0.35) outcome = "strikeout";
    if (outcome !== pre) modifier = `🌀 Nasty ${pitch} on a 6 — result downgraded`;
  }
  // Batter max roll on fastball: extra juice
  if (batterRoll === 6 && pitch === "fastball") {
    const pre = outcome;
    if (outcome === "out") outcome = "single";
    if (outcome === "single" && swing === "power") outcome = Math.random() < 0.4 ? "double" : "single";
    if (outcome !== pre) modifier = `🔥 Squared up a fastball on a 6 — result upgraded`;
  }
  // Bad luck kills a HR
  if (luckRoll === 1 && outcome === "hr") {
    outcome = "double";
    modifier = `💨 Warning track — bad luck turned HR into a double`;
  }

  const OUT_LABELS = ["Flyout!","Groundout!","Lineout!","Pop-up!"];
  const labels = {
    hr:"HOME RUN! 🎉", triple:"Triple!", double:"Double!", single:"Single!",
    out: OUT_LABELS[Math.floor(Math.random() * 4)],
    strikeout:"Strike Three! K'd!", walk:"Walk!",
  };
  return {
    batterRoll, pitcherRoll, luckRoll, luckMod, net,
    batterStatKey, pitcherStatKey, batterStatVal, pitcherStatVal,
    adjustedBatterStatVal, guessCorrect, guessWrong, guessBonusVal, pitchGuess,
    baseOutcome, modifier,
    outcome, outcomeLabel: labels[outcome] || "Out",
  };
}


// ─── STREAK / CLUTCH / COMEBACK ──────────────────────────────────────────────

// Derive a batter's current streak from pitchHistory (same batter id, same half)
function getBatterStreak(batterId, pitchHistory) {
  // Walk backwards; count consecutive hits or outs for this batter
  let streak = 0;
  let streakType = null; // "hot" | "cold"
  for (let i = pitchHistory.length - 1; i >= 0; i--) {
    const ph = pitchHistory[i];
    if (ph.batter?.id !== batterId) continue;
    const isHit = ["single","double","triple","hr"].includes(ph.result);
    if (streakType === null) streakType = isHit ? "hot" : "cold";
    if ((streakType === "hot" && !isHit) || (streakType === "cold" && isHit)) break;
    streak++;
  }
  return { streak, streakType };
}

// Streak die bonus/penalty: +1 to batter die weighting if hot x2+, -1 if cold x3+
function streakBonus(batterId, pitchHistory) {
  const { streak, streakType } = getBatterStreak(batterId, pitchHistory);
  if (streakType === "hot"  && streak >= 2) return  8; // +8 to stat effective value
  if (streakType === "cold" && streak >= 3) return -8;
  return 0;
}

// Clutch: runners in scoring position (2nd or 3rd) with 2 outs
function isClutch(bases, outs) {
  return outs === 2 && (bases[1] || bases[2]);
}

// Comeback: batting team is down 4+ from inning 7 onward
function isComeback(score, battingSide, inning) {
  const deficit = score[battingSide === "away" ? "home" : "away"] - score[battingSide];
  return inning >= 5 && deficit >= 4;
}

// Badge label + color for situation
function situationBadge(bases, outs, score, battingSide, inning) {
  if (isClutch(bases, outs)) return { label: "⚡ CLUTCH", color: "#f59e0b", desc: "Runners in scoring pos, 2 outs" };
  if (isComeback(score, battingSide, inning)) return { label: "🔥 COMEBACK", color: "#e63946", desc: "Down 4+, late innings" };
  return null;
}

function advanceRunners(bases,hitType) {
  const b=[...bases]; let runs=0;
  if(hitType==="hr")  {runs=b.filter(Boolean).length+1;return[[false,false,false],runs];}
  if(hitType==="triple"){runs=b.filter(Boolean).length;return[[false,false,true],runs];}
  if(hitType==="double"){runs=(b[1]?1:0)+(b[2]?1:0);return[[false,true,b[0]],runs];}
  if(hitType==="single"){runs=b[2]?1:0;return[[true,b[0],b[1]],runs];}
  if(hitType==="walk"){
    if(b[0]&&b[1]&&b[2])return[[true,true,true],1];
    if(b[0]&&b[1])return[[true,true,true],0];
    if(b[0])return[[true,true,b[2]],0];
    return[[true,b[1],b[2]],0];
  }
  return[b,0];
}

function aiPickPitch(count, bases, pitcher, score, pitchingSide, inning, pitchHistory){
  const{balls,strikes}=count;
  const runnersOn = bases.some(Boolean);
  const runnersScoringPos = bases[1] || bases[2];
  const deficit = (score?.[pitchingSide==="away"?"home":"away"]||0) - (score?.[pitchingSide]||0);
  const protecting = deficit <= -2; // pitching team has lead

  // 2-strike situations: go for K with best stuff
  if(strikes===2 && balls<3){
    if(pitcher?.stuff>80) return["curveball","slider"][Math.floor(Math.random()*2)];
    return["curveball","slider","changeup"][Math.floor(Math.random()*3)];
  }
  // Full count / must throw a strike
  if(balls===3) return "fastball";
  // Runners on base: favour ground balls (sinker)
  if(runnersOn && (pitcher?.movement>75 || Math.random()<0.4)) return "sinker";
  // Protecting lead late: nibble with offspeed
  if(protecting && inning>=5) return["changeup","curveball","slider"][Math.floor(Math.random()*3)];
  // Chasing a comeback: attack with fastball more
  if(deficit>=3) return Math.random()<0.5?"fastball":PITCH_TYPES[Math.floor(Math.random()*PITCH_TYPES.length)].id;
  // Default: weight toward whatever the pitcher does best
  if(pitcher?.movement>pitcher?.stuff) return Math.random()<0.4?"sinker":PITCH_TYPES[Math.floor(Math.random()*PITCH_TYPES.length)].id;
  return PITCH_TYPES[Math.floor(Math.random()*PITCH_TYPES.length)].id;
}

function aiPickSwing(batter, bases, outs, score, battingSide, inning, pitchHistory){
  if(!batter) return["power","contact","contact","take","bunt"][Math.floor(Math.random()*5)];
  const runnersOn = bases?.some(Boolean);
  const runnerOn3rd = bases?.[2];
  const runnersScoring = bases?.[1] || bases?.[2];
  const deficit = (score?.[battingSide==="away"?"home":"away"]||0) - (score?.[battingSide]||0);
  const{ streak, streakType } = getBatterStreak(batter.id, pitchHistory||[]);

  const o = [];
  // Hot batter swings more aggressively
  if(streakType==="hot" && streak>=2) o.push("power","power");
  // Cold batter is more patient
  if(streakType==="cold" && streak>=3) o.push("take","take","take");
  // Sacrifice fly situation: runner on 3rd, <2 outs → contact
  if(runnerOn3rd && outs<2) o.push("contact","contact","contact");
  // Need to score multiple runs: power up
  if(deficit>=3) o.push("power","power");
  // Close game late: don't give away outs
  if(Math.abs(deficit)<=1 && inning>=5) o.push("take","contact");
  // Batter strengths
  if(batter.power>75) o.push("power","power");
  if(batter.contact>75) o.push("contact","contact","contact"); else o.push("contact");
  if(batter.eye>75) o.push("take");
  if(batter.contact<60) o.push("bunt");
  o.push("take","contact"); // always some base options
  return o[Math.floor(Math.random()*o.length)];
}

// ─── DRAFT HELPERS ───────────────────────────────────────────────────────────
const ROSTER_BATTERS=5, ROSTER_PITCHERS=3, ROSTER_SIZE=8, DRAFT_ROUNDS=16;
// Tier limits per team in the draft (2S + 3A + 3B = exactly 8 picks)
const DRAFT_TIER_LIMITS={ S:2, A:3, B:3, C:0 };
// Full roster after auto-fill (both teams need 9B + 5P)
const FULL_BATTERS=9, FULL_PITCHERS=5;
// Pool caps — need 18 batters + 10 pitchers minimum for 2 full teams
// Use generous caps so auto-fill always has enough players
function buildDraftPool(){
  const overall=p=>p.type==="batter"?(p.contact+p.power+p.eye+p.speed)/4:(p.stuff+p.control+p.movement)/3;
  // Use SEPARATE caps for batters and pitchers to guarantee enough of each type
  // Both teams draft up to 2S+3A+3B = 8 picks each, with 3 pitchers per team
  // So pool needs: min 4 S-pitchers, 6 A-pitchers, 6 B-pitchers, plus batters
  const BATTER_CAPS  = { S:10, A:28, B:28, C:14 }; // supports up to 8 teams
  const PITCHER_CAPS = { S:10, A:16, B:16, C:8 }; // supports up to 8 teams

  const shuffle = arr => [...arr].sort(()=>Math.random()-0.5);
  const batters  = shuffle(BATTER_POOL).sort((a,b)=>overall(b)-overall(a));
  const pitchers = shuffle(PITCHER_POOL).sort((a,b)=>overall(b)-overall(a));

  const bCnt={S:0,A:0,B:0,C:0}, pCnt={S:0,A:0,B:0,C:0};
  const picked=[];
  for(const p of batters){
    if(bCnt[p.tier]<BATTER_CAPS[p.tier]){ picked.push(p); bCnt[p.tier]++; }
  }
  for(const p of pitchers){
    if(pCnt[p.tier]<PITCHER_CAPS[p.tier]){ picked.push(p); pCnt[p.tier]++; }
  }
  return picked.sort((a,b)=>overall(b)-overall(a));
}
function draftPickOwner(idx){const r=Math.floor(idx/2);return(r%2===0)?idx%2:1-idx%2;}


// Pick N random eligible players from pool for the player to choose from
// Always shows a mix if both are needed; filters to one type if only one needed
// Count how many of each tier a team has drafted so far
function rosterTierCount(roster){
  const cnt={S:0,A:0,B:0,C:0};
  [...roster.batters,...roster.pitchers].forEach(p=>{ if(cnt[p.tier]!==undefined) cnt[p.tier]++; });
  return cnt;
}


function buildDraftOptions(pool, takenIds, needBatter, needPitcher, tierCount={}, count=3, filledPositions=new Set()){
  // All eligible players: not taken, type needed, tier not maxed, not C-tier
  const avail=pool.filter(p=>{
    if(takenIds.includes(p.id)) return false;
    if(p.type==="batter"  && !needBatter)  return false;
    if(p.type==="pitcher" && !needPitcher) return false;
    if(p.type==="batter"  && filledPositions.has(p.pos)) return false; // position already drafted
    const limit=DRAFT_TIER_LIMITS[p.tier]??0;
    if(limit===0) return false;
    if((tierCount[p.tier]||0)>=limit) return false;
    return true;
  });
  if(avail.length===0) return [];

  // Shuffle all eligible players
  const shuffled=[...avail].sort(()=>Math.random()-0.5);
  const batters =shuffled.filter(p=>p.type==="batter");
  const pitchers=shuffled.filter(p=>p.type==="pitcher");

  // Build result: try to include both types when both needed, but never block on one type
  const result=[];
  const seen=new Set();
  const add=p=>{ if(!seen.has(p.id)){seen.add(p.id);result.push(p);} };

  if(needBatter && needPitcher && batters.length>0 && pitchers.length>0){
    // Include 1 of each type first, then fill remainder from either
    add(batters[0]);
    add(pitchers[0]);
    for(const p of shuffled){ if(result.length>=count) break; add(p); }
  } else {
    // Only one type available or needed — just fill from whatever exists
    for(const p of shuffled){ if(result.length>=count) break; add(p); }
  }
  return result;
}

// Auto-fill remaining roster slots — ONLY uses C-tier players
function autoFillRoster(roster, pool, takenIds, needBatters, needPitchers){
  const overall=p=>p.type==="batter"?(p.contact+p.power+p.eye+p.speed)/4:(p.stuff+p.control+p.movement)/3;
  // Only C-tier for auto-fill slots
  const avail=pool
    .filter(p=>!takenIds.includes(p.id) && p.tier==="C")
    .sort((a,b)=>overall(b)-overall(a)); // best C-tier first
  const batters=[...roster.batters];
  const pitchers=[...roster.pitchers];
  for(const p of avail){
    if(batters.length>=needBatters&&pitchers.length>=needPitchers)break;
    if(p.type==="batter"&&batters.length<needBatters) batters.push(p);
    else if(p.type==="pitcher"&&pitchers.length<needPitchers) pitchers.push(p);
  }
  return{batters,pitchers};
}

// ─── GAME STATE ──────────────────────────────────────────────────────────────
function initGame(){
  return{
    mode:null, phase:"menu", isWalkoff:false,
    inning:1, topBottom:"top", outs:0,
    count:{balls:0,strikes:0}, bases:[false,false,false],
    score:{away:0,home:0},
    lastResult:null, lastDice:null, lastBatter:null, lastPitcher:null,
    pitchChosen:null, swingChosen:null, pitchGuess:null,
    pitchHistory:[], gameLog:[],
    teams:{away:"Visitors",home:"Home"}, playerSide:"away",
    teamColors:{ away:TEAM_PALETTE[0], home:TEAM_PALETTE[1] },
    playerRoster:{batters:[],pitchers:[]}, aiRoster:{batters:[],pitchers:[]},
    lineup:{ away:[], home:[] },         // ordered batting lineup (9 batters after auto-fill)
    activePitcherIdx:{ away:0, home:0 }, // index into roster pitchers
    batterIndex:{away:0,home:0},
    pitcherBF:{away:0,home:0},           // batters faced by current pitcher
    boxScore:{ away:Array(6).fill(null).map(()=>({r:0,h:0,e:0})),
               home:Array(6).fill(null).map(()=>({r:0,h:0,e:0})) },
    draftPool:[], draftPick:0, draftOptions:[],  // 3 choices shown to player each pick
  };
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function TierBadge({tier}){
  const tc=TIER_COLOR[tier]||"#94a3b8";
  return <span style={{background:tc+"33",border:`1px solid ${tc}99`,color:tc,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:900,letterSpacing:1,boxShadow:`0 1px 4px ${tc}33`}}>{tier}</span>;
}
function StatBar({value,color="#3b82f6"}){
  return <div style={{height:5,borderRadius:3,background:"#1a2236",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,Math.max(0,value))}%`,background:`linear-gradient(90deg,${color}cc,${color})`,borderRadius:3}}/></div>;
}

// ─── PIXEL ART PLAYER AVATAR ─────────────────────────────────────────────────
// Front-facing 16×16 pixel portrait — pure SVG, no external images
// Colors derived deterministically from player.id so every player is consistent

const PX_SKIN = ["#f5c5a0","#e8a87c","#d4845a","#c06030","#8a4820","#5a2c10","#f0b090","#e09060"];
const PX_SKIN_D = ["#d4956a","#c07840","#a05a28","#8a3a10","#5a2808","#3a1404","#c08060","#b06030"];
const PX_HAT  = ["#C8102E","#003087","#1D428A","#006341","#6b21a8","#1a1a1a","#E63946","#CC0000","#002D62","#005C5C","#FD5A1E","#27251F"];
const PX_HATS = ["#8a0010","#001a50","#0a1a60","#003020","#3d0a6b","#333","#a02020","#880000","#001040","#003838","#b03000","#111"];
const PX_HATB = ["#a00018","#002060","#0f2060","#004020","#4a1080","#222","#c03030","#aa0000","#001850","#004040","#c04000","#1a1a1a"];
const PX_JERS = ["#C8102E","#003087","#1D428A","#006341","#6b21a8","#444","#E63946","#CC0000","#002D62","#005C5C","#FD5A1E","#27251F"];
const PX_JERSD= ["#8a0010","#001a50","#0a1a60","#003020","#3d0a6b","#222","#a02020","#880000","#001040","#003838","#b03000","#111"];
const PX_HAIR = ["#1a0800","#3b2005","#7b4020","#c8a050","#e8e8d0","#cc2222","#222","#884400"];
const PX_EYE  = ["#1a1a2a","#1a3a6a","#1a4a1a","#5a2810","#2a1a3a","#1a2a4a","#3a1a1a","#1a3a3a"];

// 16×16 front-facing pixel grid
// H=hat dome, h=hat shadow, b=hat brim, S=skin, D=skin shadow, _=ear/edge skin
// E=eye white, e=eye pupil, N=nose shadow, M=mouth, W=teeth
// J=jersey, j=jersey shadow, R=hair showing under hat
const PIXEL_GRID = [
  "0000HHHHHHHHHH0000",
  "000HHhHHHHHHhHH000",
  "00HHhHHHHHHHHhHH00",
  "0HHHHhHHHHHHhHHHH0",
  "00bbbbbbbbbbbbbb00",
  "000SSSSSSSSSSSS000",
  "00SSSSSSSSSSSSSS00",
  "0_SSSSSSSSSSSSSS_0",
  "0_SSEeSSSSEeSSS__0",
  "0_SSEeSSSSEeSSS__0",
  "00SSSSSNNSSSSSS000",
  "00SSSSSSSSSSSSS000",
  "00SSSWWWWWSSSSSS00",
  "000SSSSSSSSSSSS000",
  "00JJJJJJJJJJJJJJ0",
  "00JjJJJJJJJJJJjJ0",
];

function PlayerAvatar({player, size=40}){
  if(!player) return null;
  const seed = parseInt((player.id||"1").replace(/[^0-9]/g,"")) || 1;

  const si  = seed % PX_SKIN.length;
  const hi  = (seed*3) % PX_HAT.length;
  const ji  = (seed*7) % PX_JERS.length;
  const ri  = (seed*5) % PX_HAIR.length;
  const ei  = (seed*11) % PX_EYE.length;

  // Vary mouth/expression by player type and stats
  const isPitcher = player.type==="pitcher";
  const power     = player.power||player.stuff||0;
  const isSlugger = power > 80;

  // Swap mouth row based on personality
  const grid = PIXEL_GRID.map((row, r) => {
    if(r===12){
      if(isSlugger)    return "00SSSWWWWWWSSSSS00"; // big grin
      if(isPitcher)    return "00SSSSMMSSSSSSS000"; // tight smirk
      return row; // default
    }
    if(r===10 && isPitcher) return "00SSSSSNNSSSSSS000"; // same
    return row;
  });

  const colorMap = {
    "H": PX_HAT[hi],  "h": PX_HATS[hi], "b": PX_HATB[hi],
    "S": PX_SKIN[si], "D": PX_SKIN_D[si], "_": PX_SKIN_D[si],
    "E": "#f0f0f0",   "e": PX_EYE[ei],
    "N": PX_SKIN_D[si], "M": "#b03030",
    "W": "#f0f0f0",
    "J": PX_JERS[ji], "j": PX_JERSD[ji],
    "R": PX_HAIR[ri],
    "0": null,
  };

  const COLS = grid[0].length;
  const ROWS = grid.length;
  // Scale each pixel so total portrait fits in `size`
  const px = size / Math.max(COLS, ROWS);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{display:"block",flexShrink:0,imageRendering:"pixelated"}}>
      {grid.map((row,r)=>
        row.split("").map((ch,c)=>{
          const fill = colorMap[ch];
          if(!fill) return null;
          return <rect key={`${r}-${c}`}
            x={c*px} y={r*px} width={px+0.5} height={px+0.5}
            fill={fill}/>;
        })
      )}
    </svg>
  );
}

function PlayerCard({player,onClick,selected,disabled,accent="#3b82f6"}){
  const isBatter=player.type==="batter";
  return(
    <div onClick={disabled?undefined:onClick} style={{background:selected?"#0f2744":"#111827",border:`1.5px solid ${selected?accent:disabled?"#0f172a":"#1e293b"}`,borderRadius:10,padding:"10px 12px",cursor:disabled?"default":"pointer",opacity:disabled?0.4:1,transition:"all 0.15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <div style={{fontWeight:700,fontSize:13,color:disabled?"#475569":"#f8fafc"}}>{player.name}</div>
          <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{isBatter?player.pos:"Pitcher"}</div>
        </div>
        <TierBadge tier={player.tier}/>
      </div>
      {isBatter?(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px"}}>
          {[["CON",player.contact,"#60a5fa"],["PWR",player.power,"#E63946"],["EYE",player.eye,"#2A9D8F"],["SPD",player.speed,"#E9C46A"]].map(([l,v,c])=>(
            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:"#64748b",letterSpacing:1}}>{l}</span><span style={{fontSize:9,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
          ))}
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"4px 8px"}}>
          {[["STF",player.stuff,"#E63946"],["CTL",player.control,"#2A9D8F"],["MOV",player.movement,"#9B5DE5"],["STA",player.stamina,"#f59e0b"]].map(([l,v,c])=>(
            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:"#64748b",letterSpacing:1}}>{l}</span><span style={{fontSize:9,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DICE FACE (clean SVG) ───────────────────────────────────────────────────
const DOT_POS = {
  1:[[50,50]],
  2:[[25,25],[75,75]],
  3:[[25,25],[50,50],[75,75]],
  4:[[25,25],[75,25],[25,75],[75,75]],
  5:[[25,25],[75,25],[50,50],[25,75],[75,75]],
  6:[[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]],
};
function DiceFace({value,color="#f8fafc",bg="#1e293b",size=56,rolling=false}){
  const dots=DOT_POS[Math.min(6,Math.max(1,value))]||DOT_POS[1];
  const r=size*0.09;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" style={{filter:rolling?"blur(1.5px)":"none",transition:"filter 0.08s",display:"block"}}>
      <rect x="4" y="4" width="92" height="92" rx="18" fill={bg} stroke={color} strokeWidth="3"/>
      {dots.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={r*100/size} fill={color}/>)}
    </svg>
  );
}

// Base positions on the 80×80 diamond (centre of each base)
const BASE_POS = {
  home:  {x:40, y:71},
  first: {x:68, y:43},
  second:{x:40, y:15},
  third: {x:12, y:43},
};

// Tiny pixel-art runner head (8×8 SVG) at position cx,cy
function RunnerHead({cx, cy, color}){
  const s=8;
  const hx=cx-s/2, hy=cy-s/2;
  return(
    <g>
      {/* Hat dome */}
      <rect x={hx+1} y={hy}   width={s-2} height={3} fill={color}/>
      {/* Brim */}
      <rect x={hx}   y={hy+3} width={s}   height={1} fill={color} opacity="0.8"/>
      {/* Face */}
      <rect x={hx+1} y={hy+4} width={s-2} height={3} fill="#e8a87c"/>
      {/* Eyes */}
      <rect x={hx+2} y={hy+5} width={1} height={1} fill="#1a1a1a"/>
      <rect x={hx+5} y={hy+5} width={1} height={1} fill="#1a1a1a"/>
    </g>
  );
}

function Diamond({bases, prevBases, lastResult, color="#E63946", batterColor}){
  // Animation state: each runner has a current position (0=home,1=first,2=second,3=third)
  // and animates toward their new position
  const [animRunners, setAnimRunners] = useState([]); // [{id, from, to, progress, color}]
  const [displayBases, setDisplayBases] = useState(bases);
  const animRef = useRef(null);
  const runnerIdRef = useRef(0);

  useEffect(()=>{
    // When bases change, compute who moved where and animate
    if(!prevBases || !lastResult) return;
    const isHit = ["single","double","triple","hr","walk"].includes(lastResult);
    if(!isHit) { setDisplayBases(bases); return; }

    // Build runner animations
    const newRunners = [];
    const baseName = ["home","first","second","third"];

    // Map: which runners were on which base before
    // prevBases: [first,second,third] → bases[0]=1st, [1]=2nd, [2]=3rd
    // Advance logic mirrors advanceRunners
    const prev = prevBases;
    const next = bases;

    // Runners that were on base and moved forward
    if(prev[2]) newRunners.push({id:runnerIdRef.current++, from:3, to: lastResult==="hr"?0:0, color, scoring:true});
    if(prev[1]) newRunners.push({id:runnerIdRef.current++, from:2, to: lastResult==="single"?3:0, color, scoring:lastResult!=="single"});
    if(prev[0]) newRunners.push({id:runnerIdRef.current++, from:1, to: lastResult==="single"?2:lastResult==="double"?3:0, color, scoring:lastResult==="triple"||lastResult==="hr"});
    // Batter moves to base
    if(lastResult==="single")  newRunners.push({id:runnerIdRef.current++, from:0, to:1, color:batterColor||color, scoring:false});
    if(lastResult==="double")  newRunners.push({id:runnerIdRef.current++, from:0, to:2, color:batterColor||color, scoring:false});
    if(lastResult==="triple")  newRunners.push({id:runnerIdRef.current++, from:0, to:3, color:batterColor||color, scoring:false});
    if(lastResult==="hr")      newRunners.push({id:runnerIdRef.current++, from:0, to:0, color:batterColor||color, scoring:true});
    if(lastResult==="walk")    newRunners.push({id:runnerIdRef.current++, from:0, to:1, color:batterColor||color, scoring:false});

    if(newRunners.length===0){ setDisplayBases(bases); return; }

    // Temporarily show prev bases while animating
    setDisplayBases(prevBases);
    const startTime = performance.now();
    const DURATION = 600; // ms per base

    function tick(){
      const elapsed = performance.now() - startTime;
      const t = Math.min(1, elapsed / DURATION);

      // Ease in-out
      const ease = t<0.5 ? 2*t*t : -1+(4-2*t)*t;

      setAnimRunners(newRunners.map(r=>{
        const fromPos = BASE_POS[["home","first","second","third"][r.from]];
        // For scoring runners, animate to home
        const toBase = r.scoring ? "home" : ["home","first","second","third"][r.to];
        const toPos = BASE_POS[toBase];
        return{
          ...r,
          cx: fromPos.x + (toPos.x - fromPos.x) * ease,
          cy: fromPos.y + (toPos.y - fromPos.y) * ease,
          done: t>=1,
        };
      }));

      if(t<1){
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Animation complete — show final bases, clear runners
        setDisplayBases(bases);
        setAnimRunners([]);
      }
    }

    if(animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
    return()=>{ if(animRef.current) cancelAnimationFrame(animRef.current); };
  },[lastResult, JSON.stringify(bases)]);

  // Keep displayBases in sync when no animation needed
  useEffect(()=>{
    if(!lastResult) setDisplayBases(bases);
  },[bases]);

  const db = displayBases || bases;
  const W=80, H=80;

  // Field geometry — infield diamond with grass and dirt
  // Diamond corners (rotated 45°): home bottom, first right, second top, third left
  const pts = `${BASE_POS.home.x},${BASE_POS.home.y} ${BASE_POS.first.x},${BASE_POS.first.y} ${BASE_POS.second.x},${BASE_POS.second.y} ${BASE_POS.third.x},${BASE_POS.third.y}`;

  return(
    <svg viewBox="0 0 80 80" width="80" height="80" style={{display:"block"}}>
      {/* Green outfield/grass background */}
      <rect width="80" height="80" rx="4" fill="#2d6a2d"/>
      {/* Slightly lighter infield grass diamond */}
      <polygon points={pts} fill="#3a8a3a"/>
      {/* Dirt base paths — small circles around each base */}
      {[BASE_POS.first, BASE_POS.second, BASE_POS.third].map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="9" fill="#8B5E3C" opacity="0.85"/>
      ))}
      {/* Home plate dirt area */}
      <ellipse cx={BASE_POS.home.x} cy={BASE_POS.home.y} rx="9" ry="7" fill="#8B5E3C" opacity="0.85"/>
      {/* Base lines (chalk) */}
      <line x1={BASE_POS.home.x}  y1={BASE_POS.home.y}  x2={BASE_POS.first.x}  y2={BASE_POS.first.y}  stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
      <line x1={BASE_POS.first.x} y1={BASE_POS.first.y} x2={BASE_POS.second.x} y2={BASE_POS.second.y} stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
      <line x1={BASE_POS.second.x}y1={BASE_POS.second.y}x2={BASE_POS.third.x}  y2={BASE_POS.third.y}  stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
      <line x1={BASE_POS.third.x} y1={BASE_POS.third.y} x2={BASE_POS.home.x}   y2={BASE_POS.home.y}   stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
      {/* Bases — white squares, rotate 45° */}
      {/* Second base */}
      <rect x={BASE_POS.second.x-4.5} y={BASE_POS.second.y-4.5} width="9" height="9"
        transform={`rotate(45 ${BASE_POS.second.x} ${BASE_POS.second.y})`}
        fill={db[1]?"#f8fafc":"#f0ede8"} stroke="#ccc" strokeWidth="0.8"/>
      {/* Third base */}
      <rect x={BASE_POS.third.x-4.5} y={BASE_POS.third.y-4.5} width="9" height="9"
        transform={`rotate(45 ${BASE_POS.third.x} ${BASE_POS.third.y})`}
        fill={db[2]?"#f8fafc":"#f0ede8"} stroke="#ccc" strokeWidth="0.8"/>
      {/* First base */}
      <rect x={BASE_POS.first.x-4.5} y={BASE_POS.first.y-4.5} width="9" height="9"
        transform={`rotate(45 ${BASE_POS.first.x} ${BASE_POS.first.y})`}
        fill={db[0]?"#f8fafc":"#f0ede8"} stroke="#ccc" strokeWidth="0.8"/>
      {/* Home plate — pentagon shape */}
      <polygon points={`${BASE_POS.home.x},${BASE_POS.home.y-5} ${BASE_POS.home.x+4},${BASE_POS.home.y-2} ${BASE_POS.home.x+4},${BASE_POS.home.y+3} ${BASE_POS.home.x-4},${BASE_POS.home.y+3} ${BASE_POS.home.x-4},${BASE_POS.home.y-2}`}
        fill="#f0ede8" stroke="#ccc" strokeWidth="0.8"/>
      {/* Runner pixel heads on bases (static, when not animating) */}
      {animRunners.length===0&&db[0]&&<RunnerHead cx={BASE_POS.first.x}  cy={BASE_POS.first.y-8}  color={color}/>}
      {animRunners.length===0&&db[1]&&<RunnerHead cx={BASE_POS.second.x} cy={BASE_POS.second.y-8} color={color}/>}
      {animRunners.length===0&&db[2]&&<RunnerHead cx={BASE_POS.third.x}  cy={BASE_POS.third.y-8}  color={color}/>}
      {/* Animated runners */}
      {animRunners.filter(r=>!r.done).map(r=>(
        <RunnerHead key={r.id} cx={r.cx} cy={r.cy-4} color={r.color}/>
      ))}
    </svg>
  );
}
function CountDisplay({count}){
  return(
    <div style={{display:"flex",gap:12,alignItems:"center"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Balls</div><div style={{display:"flex",gap:4,marginTop:4}}>{[0,1,2,3].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<count.balls?"#10d9b8":"#141d2e",border:`1.5px solid ${i<count.balls?"#10d9b8":"#2a3a4a"}`}}/>)}</div></div>
      <div style={{fontSize:22,fontWeight:800,color:"#f8fafc"}}>{count.balls}–{count.strikes}</div>
      <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Strikes</div><div style={{display:"flex",gap:4,marginTop:4}}>{[0,1,2].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<count.strikes?"#ff4d5e":"#141d2e",border:`1.5px solid ${i<count.strikes?"#ff4d5e":"#2a3a4a"}`}}/>)}</div></div>
    </div>
  );
}

function Scoreboard({g,onBoxScore,onChangePitcher,onSoundToggle}){
  const awayBatting=g.topBottom==="top";
  const aC=g.teamColors.away, hC=g.teamColors.home;
  const playerSide=g.playerSide;
  return(
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:10,width:"100%",maxWidth:580,padding:"12px 16px 0",boxSizing:"border-box"}}>
        <div style={{background:awayBatting?aC.primary+"22":"#111827",border:`2px solid ${awayBatting?aC.primary:"#1e293b"}`,borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:36,fontWeight:900,lineHeight:1,color:awayBatting?aC.primary:"#f8fafc"}}>{g.score.away}</div>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5,marginTop:3}}>{g.teams.away}</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:12,color:"#a0aec0",fontWeight:700,letterSpacing:1}}>{g.topBottom==="top"?"▲":"▼"} {g.inning}<span style={{opacity:0.4,fontSize:10}}>/{g.totalInnings||3}</span></div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{g.outs} Out{g.outs!==1?"s":""}</div>
        </div>
        <div style={{background:!awayBatting?hC.primary+"22":"#111827",border:`2px solid ${!awayBatting?hC.primary:"#1e293b"}`,borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:36,fontWeight:900,lineHeight:1,color:!awayBatting?hC.primary:"#f8fafc"}}>{g.score.home}</div>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5,marginTop:3}}>{g.teams.home}</div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:20,padding:"8px 16px",width:"100%",maxWidth:580,boxSizing:"border-box",alignItems:"center"}}>
        <Diamond bases={g.bases} prevBases={g._prevBases} lastResult={g.lastDice?.outcome} color={awayBatting?g.teamColors.away.primary:g.teamColors.home.primary} batterColor={awayBatting?g.teamColors.away.primary:g.teamColors.home.primary}/>
        <CountDisplay count={g.count}/>
      </div>
      {(onBoxScore||onChangePitcher||onSoundToggle)&&(
        <div style={{display:"flex",gap:8,padding:"0 16px 8px",width:"100%",maxWidth:580,boxSizing:"border-box"}}>
          {onBoxScore&&<button onClick={onBoxScore} style={{flex:1,background:"#141d2e",border:"1px solid #2a3f5f",color:"#7cb9e8",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>📊 Box Score</button>}
          {onChangePitcher&&<button onClick={onChangePitcher} style={{flex:1,background:"#1a1f2e",border:"1px solid #3a2a5f",color:"#c084fc",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 Change Pitcher</button>}
          {onSoundToggle&&<button onClick={onSoundToggle.fn} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,cursor:"pointer",minWidth:40}}>{onSoundToggle.on?"🔊":"🔇"}</button>}
        </div>
      )}
    </>
  );
}

function StaminaBar({pitcher,bf}){
  if(!pitcher)return null;
  const tired=pitcherFatigue(pitcher,bf);
  const pct=Math.round((1-tired.fatigue)*100);
  const col=pct>60?"#34d399":pct>35?"#f59e0b":"#f87171";
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Stamina</span>
        <span style={{fontSize:10,color:col,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{height:5,borderRadius:3,background:"#1e293b",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:3,transition:"width 0.4s"}}/>
      </div>
      {tired.fatigue>0.5&&<div style={{fontSize:10,color:"#f87171",marginTop:3}}>⚠ Getting tired — stats dropping</div>}
    </div>
  );
}

// Helper: does net fall in the label range string (e.g. "+1 to +2", "≥+5", "0 to -1")?
function isInBand(net, rangeStr) {
  if (rangeStr.startsWith("≥")) return net >= parseInt(rangeStr.slice(1));
  if (rangeStr.startsWith("≤")) return net <= parseInt(rangeStr.slice(1));
  if (rangeStr === "0 or less") return net <= 0;
  if (rangeStr === "0 to -1") return net >= -1 && net <= 0;
  if (rangeStr.includes(" to ")) {
    const [lo, hi] = rangeStr.split(" to ").map(s => parseInt(s));
    return net >= Math.min(lo,hi) && net <= Math.max(lo,hi);
  }
  return net === parseInt(rangeStr);
}

function RollingScreen({g,onReveal}){
  const[tick,setTick]=useState(0);
  const[revealed,setRevealed]=useState(false);
  const dice=g.lastDice, batter=g.lastBatter, pitcher=g.lastPitcher;
  const aC=g.teamColors.away, hC=g.teamColors.home;
  const battingColor=g.topBottom==="top"?aC.primary:hC.primary;
  const pitchingColor=g.topBottom==="top"?hC.primary:aC.primary;

  useEffect(()=>{
    if(revealed)return;
    const iv=setInterval(()=>setTick(t=>t+1),110);
    const to=setTimeout(()=>{clearInterval(iv);setRevealed(true);},950);
    return()=>{clearInterval(iv);clearTimeout(to);};
  },[]);

  const fB=revealed?dice.batterRoll:(tick%6)+1;
  const fP=revealed?dice.pitcherRoll:((tick+2)%6)+1;
  const fL=revealed?dice.luckRoll:((tick+4)%6)+1;
  const net=revealed?dice.net:null;
  const netColor=net>0?"#34d399":net<0?"#f87171":"#94a3b8";

  const root={minHeight:"100vh",background:"linear-gradient(160deg,#0d0a1e 0%,#0a1628 50%,#0d1a0a 100%)",color:"#f8fafc",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:40};
  const card={background:"linear-gradient(180deg,#161f2e 0%,#111827 100%)",border:"1px solid #253046",borderRadius:16,padding:20,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"};

  return(
    <div style={root}>
      <Scoreboard g={g}/>
      <div style={card}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:2}}>{revealed?"Dice Landed!":"Rolling…"}</div>
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:16,marginBottom:14}}>
          {/* Three dice: batter | luck modifier | pitcher */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:10,marginBottom:12}}>
            {/* Batter die */}
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:battingColor,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>{batter?.name?.split(" ").slice(-1)[0]||"Batter"}</div>
              <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={fB} color={battingColor} bg="#0f172a" size={58} rolling={!revealed}/></div>
              <div style={{fontSize:9,color:"#475569",marginTop:5}}>
                {dice?.batterStatKey?.toUpperCase()} {dice?.adjustedBatterStatVal ?? dice?.batterStatVal}
                {dice?.guessBonusVal > 0 && <span style={{color:"#34d399",fontWeight:700}}> (+{dice.guessBonusVal} guess)</span>}
                {dice?.guessBonusVal < 0 && <span style={{color:"#f87171",fontWeight:700}}> ({dice.guessBonusVal} guess)</span>}
              </div>
            </div>
            {/* Luck modifier chip — no die face, just the modifier value */}
            <div style={{textAlign:"center",padding:"0 4px"}}>
              <div style={{fontSize:9,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontWeight:700}}>Luck</div>
              <div style={{width:48,height:48,borderRadius:10,border:"2px solid #f59e0b",background:"#1a1200",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                <span style={{fontSize:22,fontWeight:900,color:!revealed?"#334155":dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#94a3b8"}}>
                  {!revealed?"?":(dice.luckMod>0?"+1":dice.luckMod<0?"-1":" 0")}
                </span>
              </div>
              <div style={{fontSize:9,color:"#475569",marginTop:5}}>
                {revealed?(fL<=2?"(1-2)":fL>=5?"(5-6)":"(3-4)"):"rolled…"}
              </div>
            </div>
            {/* Pitcher die */}
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:pitchingColor,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>{pitcher?.name?.split(" ").slice(-1)[0]||"Pitcher"}</div>
              <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={fP} color={pitchingColor} bg="#0f172a" size={58} rolling={!revealed}/></div>
              <div style={{fontSize:9,color:"#475569",marginTop:5}}>{dice?.pitcherStatKey?.toUpperCase()} {dice?.pitcherStatVal}</div>
            </div>
          </div>
          {/* Formula + net */}
          <div style={{borderTop:"1px solid #1e293b",paddingTop:12,marginBottom:revealed?12:0}}>
            {revealed?(
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:13,color:"#64748b",marginBottom:6,fontFamily:"monospace"}}>
                  <span style={{color:battingColor,fontWeight:700}}>{dice.batterRoll}</span>
                  <span style={{color:"#475569"}}> (bat) - </span>
                  <span style={{color:pitchingColor,fontWeight:700}}>{dice.pitcherRoll}</span>
                  <span style={{color:"#475569"}}> (pitch) </span>
                  <span style={{color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#475569",fontWeight:700}}>
                    {dice.luckMod>=0?"+ ":"- "}{Math.abs(dice.luckMod)}
                  </span>
                  <span style={{color:"#475569"}}> (luck) = </span>
                  <span style={{color:netColor,fontWeight:900,fontSize:16}}>{net>0?`+${net}`:net}</span>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",color:"#334155",fontSize:13}}>bat - pitch + luck = ?</div>
            )}
          </div>
          {/* Pitch guess reveal */}
          {revealed&&dice.pitchGuess&&(
            <div style={{textAlign:"center",marginTop:8}}>
              {dice.guessCorrect
                ? <div style={{fontSize:11,color:"#34d399",fontWeight:700}}>✅ Correct guess! +8 to bat stat</div>
                : <div style={{fontSize:11,color:"#f87171",fontWeight:700}}>❌ Wrong guess — fooled. -5 to bat stat</div>
              }
            </div>
          )}
          {/* Situation bonuses applied */}
          {revealed&&dice.streakBonus!==0&&(
            <div style={{textAlign:"center",marginTop:4,fontSize:10,color:dice.streakBonus>0?"#f59e0b":"#60a5fa"}}>
              {dice.streakBonus>0?`🔥 Hot streak: +${dice.streakBonus} to batter stats`:`❄️ Cold streak: ${dice.streakBonus} to batter stats`}
            </div>
          )}
          {revealed&&dice.situationBonus>0&&(
            <div style={{textAlign:"center",marginTop:3,fontSize:10,color:dice.clutch?"#f59e0b":"#e63946"}}>
              {dice.clutch?"⚡ Clutch bonus: +5 to batter stats":"🔥 Comeback bonus: +5 to batter stats"}
            </div>
          )}
          {/* Swing-specific outcome bands — only shown after reveal */}
          {revealed&&(
            <div>
              <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:5,textAlign:"center"}}>{g.swingChosen?.toUpperCase()} outcome bands</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
                {outcomeBands(g.swingChosen).map(([r,l,c])=>(
                  <div key={r} style={{fontSize:10,background:net!==null&&isInBand(net,r)?"#111827":"transparent",borderRadius:5,padding:"3px 8px",color:c,border:`1px solid ${c}${net!==null&&isInBand(net,r)?"bb":"33"}`}}>{r} · {l}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        {revealed?(
          <button onClick={onReveal} style={{background:"#E63946",color:"#fff",border:"none",borderRadius:10,padding:"13px 20px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%"}}>See Result ▶</button>
        ):(
          <div style={{textAlign:"center",color:"#475569",fontSize:13,padding:"8px 0"}}>🎲🎲🎲 Rolling…</div>
        )}
      </div>
    </div>
  );
}


// ─── PITCH HISTORY STRIP ─────────────────────────────────────────────────────

// ─── CURRENT AT-BAT PITCH SEQUENCE ───────────────────────────────────────────
function AtBatSequence({pitchHistory, batterId, pitchingSide}){
  // Get pitches thrown to this specific batter in the current at-bat
  // Walk back from end; stop when we hit a plate-ending result for a different batter
  const sequence = [];
  for(let i=pitchHistory.length-1; i>=0; i--){
    const ph=pitchHistory[i];
    // Stop if we hit an at-bat that wasn't to this batter
    if(ph.batter?.id !== batterId) break;
    // Only include pitches TO this batter's side (they were batting)
    if(ph.battingSide === (pitchingSide==="away"?"home":"away")) break;
    sequence.unshift(ph);
    // If this was a plate-ending result, stop (this was a previous at-bat for same batter)
    const plateDone=["strikeout","out","single","double","triple","hr","walk"].includes(ph.result);
    if(plateDone && i < pitchHistory.length-1) { sequence.shift(); break; }
  }
  if(sequence.length===0) return null;
  const RCOL={hr:"#f59e0b",triple:"#f59e0b",double:"#34d399",single:"#60a5fa",out:"#94a3b8",strikeout:"#f87171",walk:"#34d399",ball:"#2A9D8F",strike:"#E63946"};
  const RABB={hr:"HR",triple:"3B",double:"2B",single:"1B",out:"OUT",strikeout:"K",walk:"BB",ball:"B",strike:"S"};
  return(
    <div style={{marginBottom:10}}>
      <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>This at-bat</div>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        {sequence.map((ph,i)=>{
          const p=PITCH_TYPES.find(x=>x.id===ph.pitch);
          const rc=RCOL[ph.result]||"#475569";
          const ra=RABB[ph.result]||"?";
          return(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
              <div style={{background:p?.color+"22",border:`1px solid ${p?.color||"#334155"}`,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:700,color:p?.color||"#94a3b8"}}>{p?.abbr||"?"}</div>
              <div style={{fontSize:8,color:rc,fontWeight:700}}>{ra}</div>
            </div>
          );
        })}
        <div style={{fontSize:10,color:"#334155",marginLeft:2}}>→</div>
      </div>
    </div>
  );
}

function PitchHistoryStrip({pitchHistory, pitchingSide}){
  // Last 5 pitches thrown by the current pitching side
  const recent=[...pitchHistory].filter(ph=>ph.battingSide!==pitchingSide).slice(-5);
  if(recent.length===0) return(
    <div style={{fontSize:10,color:"#334155",fontStyle:"italic",marginBottom:8,marginTop:4}}>No pitches yet this game</div>
  );
  const RCOL={hr:"#f59e0b",triple:"#f59e0b",double:"#34d399",single:"#60a5fa",out:"#94a3b8",strikeout:"#f87171",walk:"#34d399"};
  const RABB={hr:"HR",triple:"3B",double:"2B",single:"1B",out:"OUT",strikeout:"K",walk:"BB"};
  return(
    <div style={{marginTop:6,marginBottom:2}}>
      <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Last pitches</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {recent.map((ph,i)=>{
          const p=PITCH_TYPES.find(x=>x.id===ph.pitch);
          const rc=RCOL[ph.result]||"#475569";
          const ra=RABB[ph.result]||"?";
          return(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{background:p?.color+"22",border:`1px solid ${p?.color||"#334155"}`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,color:p?.color||"#94a3b8"}}>{p?.abbr||"?"}</div>
              <div style={{fontSize:8,color:rc,fontWeight:700,letterSpacing:0.5}}>{ra}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoxScoreModal({g,onClose}){
  // Derive per-player stat lines from pitchHistory
  const statLine = {}; // id -> { ab, r, h, hr, rbi, bb, k }
  for(const ph of g.pitchHistory){
    if(!ph.batter)continue;
    const id=ph.batter.id;
    if(!statLine[id]) statLine[id]={ ab:0,r:0,h:0,hr:0,rbi:0,bb:0,k:0,name:ph.batter.name,pos:ph.batter.pos,side:ph.battingSide };
    const res=ph.result;
    const runs=ph.runsScored||0;
    if(res==="walk"){ statLine[id].bb++; }
    else if(res==="strikeout"){ statLine[id].ab++; statLine[id].k++; }
    else if(res==="out"){ statLine[id].ab++; }
    else if(["single","double","triple"].includes(res)){ statLine[id].ab++; statLine[id].h++; statLine[id].rbi+=runs; }
    else if(res==="hr"){ statLine[id].ab++; statLine[id].h++; statLine[id].hr++; statLine[id].r++; statLine[id].rbi+=runs; }
  }

  // Helper: render a team's lineup table
  const LineupTable=({side})=>{
    const roster=side===g.playerSide?g.playerRoster:g.aiRoster;
    const lineup=g.lineup[side]?.length?g.lineup[side]:roster.batters;
    const color=g.teamColors[side].primary;
    const pitcherIdx=g.activePitcherIdx[side];
    const pitcher=roster.pitchers[pitcherIdx];
    const bf=g.pitcherBF[side];
    const tired=pitcher?pitcherFatigue(pitcher,bf):null;
    const staPct=tired?Math.round((1-tired.fatigue)*100):100;
    const staCol=staPct>60?"#34d399":staPct>35?"#f59e0b":"#f87171";
    return(
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontWeight:800,fontSize:14,color:color}}>{g.teams[side]}</div>
          <div style={{fontSize:24,fontWeight:900,color:color}}>{g.score[side]}</div>
        </div>
        {/* Batting lineup */}
        <div style={{background:"#0f172a",borderRadius:8,overflow:"hidden",marginBottom:8}}>
          <div style={{display:"grid",gridTemplateColumns:"18px 1fr 26px 22px 22px 26px 22px 22px",gap:"0 3px",padding:"5px 8px",borderBottom:"1px solid #1e293b"}}>
            <div style={{fontSize:9,color:"#475569"}}>#</div>
            <div style={{fontSize:9,color:"#475569"}}>BATTER</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>AB</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>R</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>H</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>RBI</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>BB</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>HR</div>
          </div>
          {lineup.map((b,i)=>{
            const s=statLine[b.id]||{ab:0,h:0,hr:0,rbi:0,bb:0,k:0};
            const avg=s.ab>0?(s.h/s.ab).toFixed(3).replace("0.","."):"---";
            const isUp=side===g.topBottom.replace("top","away").replace("bottom","home")&&g.batterIndex[side]%lineup.length===i;
            // safer active batter check:
            const activeSide=g.topBottom==="top"?"away":"home";
            const isBatting=side===activeSide&&(g.batterIndex[side]%lineup.length)===i;
            return(
              <div key={b.id} style={{display:"grid",gridTemplateColumns:"18px 1fr 26px 22px 22px 26px 22px 22px",gap:"0 3px",padding:"4px 8px",background:isBatting?"#0f2744":"transparent",borderBottom:"1px solid #0f172a",alignItems:"center"}}>
                <div style={{fontSize:10,color:"#475569"}}>{i+1}</div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <PlayerAvatar player={b} size={26}/>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:isBatting?color:"#f8fafc",lineHeight:1.2}}>{b.name.split(" ").slice(-1)[0]}</div>
                    <div style={{fontSize:8,color:"#475569"}}>{b.pos} {avg}</div>
                  </div>
                </div>
                <div style={{fontSize:10,textAlign:"center",color:"#94a3b8"}}>{s.ab}</div>
                <div style={{fontSize:10,textAlign:"center",color:s.r>0?"#34d399":"#94a3b8",fontWeight:s.r>0?700:400}}>{s.r}</div>
                <div style={{fontSize:10,textAlign:"center",color:s.h>0?"#60a5fa":"#94a3b8",fontWeight:s.h>0?700:400}}>{s.h}</div>
                <div style={{fontSize:10,textAlign:"center",color:s.rbi>0?"#f59e0b":"#94a3b8",fontWeight:s.rbi>0?700:400}}>{s.rbi}</div>
                <div style={{fontSize:10,textAlign:"center",color:"#94a3b8"}}>{s.bb}</div>
                <div style={{fontSize:10,textAlign:"center",color:s.hr>0?"#f59e0b":"#94a3b8",fontWeight:s.hr>0?700:400}}>{s.hr}</div>
              </div>
            );
          })}
        </div>
        {/* Pitcher status */}
        {pitcher&&(
          <div style={{background:"#0f172a",borderRadius:8,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700}}>{pitcher.name}</div>
              <div style={{fontSize:9,color:"#64748b"}}>P · STF {Math.round(tired.stuff)} · CTL {Math.round(tired.control)} · {bf} BF</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:15,fontWeight:900,color:staCol}}>{staPct}%</div>
              <div style={{fontSize:9,color:"#64748b"}}>stamina</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:100,padding:"16px",overflowY:"auto"}}>
      <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:16,padding:20,width:"100%",maxWidth:500,marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>📊 Box Score</div>
          <button onClick={onClose} style={{background:"#1e293b",border:"none",color:"#94a3b8",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:13}}>✕ Close</button>
        </div>
        <LineupTable side="away"/>
        <div style={{borderTop:"1px solid #1e293b",marginBottom:16}}/>
        <LineupTable side="home"/>
      </div>
    </div>
  );
}

function ChangePitcherModal({g,onChangeTo,onClose}){
  const side=g.topBottom==="top"?"home":"away"; // pitching side
  const roster=side===g.playerSide?g.playerRoster:g.aiRoster;
  const current=g.activePitcherIdx[side];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}>
      <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:16,padding:20,width:"100%",maxWidth:400}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>🔄 Change Pitcher</div>
          <button onClick={onClose} style={{background:"#1e293b",border:"none",color:"#94a3b8",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:13}}>✕</button>
        </div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Select a reliever from the bullpen:</div>
        {roster.pitchers.map((p,i)=>{
          const bf=i===current?g.pitcherBF[side]:0;
          const tired=pitcherFatigue(p,bf);
          const pct=Math.round((1-tired.fatigue)*100);
          const isCurrent=i===current;
          return(
            <div key={p.id} onClick={()=>!isCurrent&&onChangeTo(side,i)}
              style={{background:isCurrent?"#0f172a":"#1e293b",border:`1px solid ${isCurrent?"#475569":"#334155"}`,borderRadius:10,padding:"10px 14px",marginBottom:8,cursor:isCurrent?"default":"pointer",opacity:isCurrent?0.6:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{p.name} {isCurrent&&<span style={{fontSize:10,color:"#64748b"}}>(current)</span>}</div>
                  <div style={{fontSize:10,color:"#64748b",marginTop:2}}>STF {Math.round(tired.stuff)} · CTL {Math.round(tired.control)} · STA {pct}%</div>
                </div>
                <TierBadge tier={p.tier}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LINEUP EDITOR ───────────────────────────────────────────────────────────
function LineupEditor({roster,teamName,color,onConfirm}){
  const[lineup,setLineup]=useState([...roster.batters]);
  const[drag,setDrag]=useState(null);
  const move=(from,to)=>{
    const next=[...lineup];
    const[item]=next.splice(from,1);
    next.splice(to,0,item);
    setLineup(next);
  };
  return(
    <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:16,padding:20,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 16px"}}>
      <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{teamName} Lineup</div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:14}}>Tap ↑ ↓ to reorder your batting order</div>
      {lineup.map((p,i)=>(
        <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0f172a",border:`1px solid ${i===0?color+"66":"#1e293b"}`,borderRadius:8,padding:"8px 12px",marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:900,color:color,width:22,textAlign:"center"}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>{p.name}</div>
            <div style={{fontSize:10,color:"#64748b"}}>{p.pos} · CON {p.contact} · PWR {p.power}</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button disabled={i===0} onClick={()=>move(i,i-1)} style={{background:"#1e293b",border:"none",color:i===0?"#334155":"#94a3b8",borderRadius:5,padding:"4px 8px",cursor:i===0?"default":"pointer",fontSize:13}}>↑</button>
            <button disabled={i===lineup.length-1} onClick={()=>move(i,i+1)} style={{background:"#1e293b",border:"none",color:i===lineup.length-1?"#334155":"#94a3b8",borderRadius:5,padding:"4px 8px",cursor:i===lineup.length-1?"default":"pointer",fontSize:13}}>↓</button>
          </div>
        </div>
      ))}
      <button onClick={()=>onConfirm(lineup)} style={{background:color,color:"#fff",border:"none",borderRadius:10,padding:"12px 20px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%",marginTop:8}}>
        Confirm Lineup →
      </button>
    </div>
  );
}


// ─── BETWEEN INNING SCREEN (auto-advances in vs-ai) ─────────────────────────
function BetweenInning({g, showBoxScore, setShowBoxScore, onContinue}){
  const[countdown,setCountdown]=useState(2);
  const isAI=g.mode==="vs-ai";
  const nowBatting=g.topBottom==="top"?g.teams.away:g.teams.home;
  const nowColor=g.topBottom==="top"?g.teamColors.away:g.teamColors.home;

  useEffect(()=>{
    if(!isAI)return;
    if(countdown<=0)return;
    const t=setTimeout(()=>setCountdown(c=>c-1),600);
    return()=>clearTimeout(t);
  },[countdown,isAI]);

  const root={minHeight:"100vh",background:"linear-gradient(160deg,#0d0a1e 0%,#0a1628 50%,#0d1a0a 100%)",color:"#f8fafc",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:40};
  const card={background:"linear-gradient(180deg,#161f2e 0%,#111827 100%)",border:"1px solid #253046",borderRadius:16,padding:20,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"};
  const btn=(color="#E63946")=>({background:color,color:"#fff",border:"none",borderRadius:10,padding:"12px 20px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%"});

  return(
    <div style={root}>
      {showBoxScore&&<div style={{position:"fixed",inset:0,zIndex:100}}/>}
      <div style={{...card,maxWidth:400,margin:"60px auto 0",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:6}}>⚾</div>
        <div style={{fontSize:18,fontWeight:800,marginBottom:2}}>{g.topBottom==="top"?"▲":"▼"} Inning {g.inning}</div>
        <div style={{color:"#64748b",fontSize:13,marginBottom:16}}>{nowBatting} now batting</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {["away","home"].map(s=>(
            <div key={s} style={{background:"#1e293b",borderRadius:10,padding:12,border:`2px solid ${g.teamColors[s].primary}`}}>
              <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>{g.teams[s]}</div>
              <div style={{fontSize:32,fontWeight:900,color:g.teamColors[s].primary}}>{g.score[s]}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:"#475569",marginBottom:8,textAlign:"center"}}>
          💡 Check the box score to monitor pitcher stamina — replace before it hits 30%
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <button onClick={()=>setShowBoxScore(true)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>📊 Box Score</button>
          <button onClick={onContinue} style={{flex:2,background:nowColor.primary,color:"#fff",border:"none",borderRadius:8,padding:"7px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {isAI?(countdown>0?`Auto-continuing in ${countdown}…`:"▶ Next half-inning"):(g.mode==="two-player"?"Pass to Next Team →":"Continue →")}
          </button>
        </div>
        {isAI&&countdown>0&&(
          <div style={{height:3,borderRadius:2,background:"#1e293b",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(countdown/2)*100}%`,background:nowColor.primary,borderRadius:2,transition:"width 0.6s linear"}}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function BaseballGame(){
  const[g,setG]=useState(initGame());
  const[teamName,setTeamName]=useState(TEAM_NAMES[0]);
  const[inningChoice,setInningChoice]=useState(3);
  const[soundOn,setSoundOn]=useState(true);
  // ── ONLINE MODE STATE ────────────────────────────────────────────────────
  const[onlineState,setOnlineState]=useState("idle"); // idle|creating|joining|lobby|playing|error
  const[roomCode,setRoomCode]=useState("");
  const[roomInput,setRoomInput]=useState("");
  const[onlineSide,setOnlineSide]=useState(null); // "away"|"home"
  const[onlineError,setOnlineError]=useState("");
  const unsubRef=useRef(null);
  // ── PLAYOFF STATE ──────────────────────────────────────────────────────────
  const[playoff,setPlayoff]=useState(null);
  const[playoffSetup,setPlayoffSetup]=useState(null);
  const[playoffHubTab,setPlayoffHubTab]=useState("scoreboard");
  const[playoffStatsSort,setPlayoffStatsSort]=useState("H");
  const[playoffStatsTeam,setPlayoffStatsTeam]=useState("all");
  const[saveStatus,setSaveStatus]=useState(null);
  const[hasSave,setHasSave]=useState(false);
  const[confirmExit,setConfirmExit]=useState(false);

  // Check for saved playoff on mount — retry a few times in case storage isn't ready
  useEffect(()=>{
    let attempts=0;
    function tryLoad(){
      loadPlayoff().then(data=>{
        if(data){
          setHasSave(true);
        } else if(attempts<3){
          attempts++;
          setTimeout(tryLoad, 800); // retry — storage may not be ready immediately
        }
      }).catch(()=>{
        if(attempts<3){ attempts++; setTimeout(tryLoad,800); }
      });
    }
    tryLoad();
  },[]);
  const[aiTeamName,setAiTeamName]=useState(TEAM_NAMES[1]);
  const[playerColorIdx,setPlayerColorIdx]=useState(0);
  const[aiColorIdx,setAiColorIdx]=useState(1);
  const[chosenSide,setChosenSide]=useState("away");
  const[draftFilter,setDraftFilter]=useState("all");
  const[selectedPlayer,setSelectedPlayer]=useState(null);
  const[showBoxScore,setShowBoxScore]=useState(false);
  const[showChangePitcher,setShowChangePitcher]=useState(false);
  const[lineupPhase,setLineupPhase]=useState(null); // null|"player"|"ai"|"done"
  const logRef=useRef(null);

  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[g.gameLog]);

  // Auto-advance between innings in vs-ai mode
  useEffect(()=>{
    if(g.phase!=="between"||g.mode!=="vs-ai")return;
    const t=setTimeout(()=>continuePlay(),1800);
    return()=>clearTimeout(t);
  },[g.phase,g.mode]);

  // Auto-advance result screen in vs-ai mode after 2.5s
  useEffect(()=>{
    if(g.phase!=="result"||g.mode!=="vs-ai")return;
    const t=setTimeout(()=>setG(prev=>prev.phase==="result"?{...prev,phase:"pitching",pitchChosen:null,pitchGuess:null}:prev),2500);
    return()=>clearTimeout(t);
  },[g.phase,g.mode]);

  // AI auto-actions
  useEffect(()=>{
    if(g.mode!=="vs-ai")return;
    const playerBatting=g.playerSide==="away"?g.topBottom==="top":g.topBottom==="bottom";
    const playerPitching=g.playerSide==="away"?g.topBottom==="bottom":g.topBottom==="top";
    if(g.phase==="pitching"&&playerBatting){
      const aiPRoster=g.playerSide==="away"?g.aiRoster:g.playerRoster;
      const pitcherIdx=g.activePitcherIdx[g.topBottom==="top"?"home":"away"];
      const rawP=aiPRoster.pitchers[pitcherIdx];
      const pitcher=rawP?pitcherFatigue(rawP,g.pitcherBF[g.topBottom==="top"?"home":"away"]):null;
      const pitch=aiPickPitch(g.count,g.bases,pitcher,g.score,g.topBottom==="top"?"home":"away",g.inning,g.pitchHistory);
      const t=setTimeout(()=>setG(prev=>({...prev,pitchChosen:pitch,phase:"batting"})),700);
      return()=>clearTimeout(t);
    }
    if(g.phase==="batting"&&playerPitching){
      const aiBRoster=g.playerSide==="away"?g.aiRoster:g.playerRoster;
      const side=g.topBottom==="top"?"away":"home";
      const lineup=g.lineup[side]; const idx=g.batterIndex[side];
      const batter=lineup.length?lineup[idx%lineup.length]:aiBRoster.batters[idx%aiBRoster.batters.length];
      const side2=g.topBottom==="top"?"away":"home";
      const swing=aiPickSwing(batter,g.bases,g.outs,g.score,side2,g.inning,g.pitchHistory);
      const t=setTimeout(()=>chooseSwing(swing),700);
      return()=>clearTimeout(t);
    }
  },[g.phase,g.topBottom,g.mode]);

  // Online mode — push game state when it's our turn to act
  useEffect(()=>{
    if(g.mode!=="online"||!roomCode||onlineState!=="playing") return;
    if(!g._turn || g._turn !== onlineSide) return;
    supa.upsertRoom(roomCode, g).catch(()=>{});
  },[g,roomCode,onlineState,onlineSide]);

  // Online mode — receive opponent's game state
  useEffect(()=>{
    if(onlineState!=="playing"||!roomCode) return;
    const unsub=supa.subscribeRoom(roomCode,(remote)=>{
      if(!remote||!remote._turn) return;
      if(remote._turn===onlineSide) return; // our own write echoing back — ignore
      setG(prev=>({
        ...remote,
        // Always preserve our own identity and perspective
        playerSide: prev.playerSide,
        playerRoster: prev.playerRoster,
        aiRoster: prev.aiRoster,
        mode:"online",
      }));
    });
    unsubRef.current=unsub;
    return()=>{ if(unsubRef.current) unsubRef.current(); };
  },[onlineState,roomCode,onlineSide]);

  // Auto-save playoff state — debounced so rapid changes don't cause re-render spam
  useEffect(()=>{
    if(!playoff) return;
    const t=setTimeout(()=>{
      setSaveStatus("saving");
      savePlayoff(playoff).then(()=>{
        setSaveStatus("saved");
        setHasSave(true);
        setTimeout(()=>setSaveStatus(null),2000);
      }).catch(()=>setSaveStatus("error"));
    },800); // wait 800ms after last change before saving
    return()=>clearTimeout(t);
  },[playoff]);

  // AI auto-draft — uses a single recursive function that chains all consecutive AI picks
  // This avoids stale closure / double-fire bugs from useEffect re-triggering
  useEffect(()=>{
    if(g.phase!=="draft") return;
    if(g._playoffDraft) return; // playoff solo draft — no AI picks ever
    if(g.draftPick>=DRAFT_ROUNDS) return;
    if(draftPickOwner(g.draftPick)!==1) return; // player's turn, don't run

    // Helper: make one AI pick and return next state, or null if done/player's turn
    function makeAIPick(prev){
      if(prev.phase!=="draft") return null;
      if(prev._playoffDraft) return null; // safety: never AI-pick in playoff draft
      if(prev.draftPick>=DRAFT_ROUNDS) return null;
      if(draftPickOwner(prev.draftPick)!==1) return null; // player's turn now

      const overall=p=>p.type==="batter"?(p.contact+p.power+p.eye+p.speed)/4:(p.stuff+p.control+p.movement)/3;
      const takenArr=[...prev.playerRoster.batters,...prev.playerRoster.pitchers,
                      ...prev.aiRoster.batters,...prev.aiRoster.pitchers].map(p=>p.id);
      const avail=prev.draftPool.filter(p=>!takenArr.includes(p.id));
      const need={batter:prev.aiRoster.batters.length<ROSTER_BATTERS,
                  pitcher:prev.aiRoster.pitchers.length<ROSTER_PITCHERS};
      const aiTC=rosterTierCount(prev.aiRoster);
      const cands=avail.filter(p=>{
        if(p.type==="batter"  && !need.batter)  return false;
        if(p.type==="pitcher" && !need.pitcher) return false;
        const limit=DRAFT_TIER_LIMITS[p.tier]??0;
        if(limit===0) return false;
        if((aiTC[p.tier]||0)>=limit) return false;
        return true;
      });
      const pick=cands.sort((a,b)=>overall(b)-overall(a))[0];
      // If no valid pick, skip this pick index
      const newAI=pick?{
        batters:pick.type==="batter"?[...prev.aiRoster.batters,pick]:prev.aiRoster.batters,
        pitchers:pick.type==="pitcher"?[...prev.aiRoster.pitchers,pick]:prev.aiRoster.pitchers,
      }:prev.aiRoster;
      const next=prev.draftPick+1;

      if(next>=DRAFT_ROUNDS){
        // Draft complete — auto-fill both teams
        const allTaken=[...prev.playerRoster.batters,...prev.playerRoster.pitchers,...newAI.batters,...newAI.pitchers].map(p=>p.id);
        const filledPlayer=autoFillRoster(prev.playerRoster,prev.draftPool,allTaken,FULL_BATTERS,FULL_PITCHERS);
        const takenAfter=[...filledPlayer.batters,...filledPlayer.pitchers,...newAI.batters,...newAI.pitchers].map(p=>p.id);
        const filledAI=autoFillRoster(newAI,prev.draftPool,takenAfter,FULL_BATTERS,FULL_PITCHERS);
        return{...prev,aiRoster:filledAI,playerRoster:filledPlayer,draftPick:next,
          draftOptions:[],phase:"lineup_setup",
          gameLog:[`⚾ ${prev.teams.away} vs ${prev.teams.home}`,`--- Inning 1 (Top) ---`]};
      }

      // Check if next pick is also AI — if so, chain immediately in same state update
      if(draftPickOwner(next)===1){
        const interim={...prev,aiRoster:newAI,draftPick:next};
        return makeAIPick(interim); // recurse synchronously
      }

      // Next pick is player — generate their options and hand control back
      const newTaken=[...prev.playerRoster.batters,...prev.playerRoster.pitchers,...newAI.batters,...newAI.pitchers].map(p=>p.id);
      const freshTC=rosterTierCount(prev.playerRoster);
      const freshFilledPos=new Set(prev.playerRoster.batters.map(b=>b.pos));
      const opts=buildDraftOptions(prev.draftPool,newTaken,
        prev.playerRoster.batters.length<ROSTER_BATTERS,
        prev.playerRoster.pitchers.length<ROSTER_PITCHERS,freshTC,3,freshFilledPos);
      return{...prev,aiRoster:newAI,draftPick:next,draftOptions:opts,phase:"draft"};
    }

    const t=setTimeout(()=>{
      setG(prev=>makeAIPick(prev)||prev);
    },150);
    return()=>clearTimeout(t);
  },[g.phase,g.draftPick]);

  // ── HANDLERS ──────────────────────────────────────────────────────────────
  function startGame(mode){setG(prev=>({...prev,mode,phase:"setup"}));}

  function beginDraft(away,home,playerSide,aC,hC,innings=3){
    const pool=buildDraftPool();
    const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3,new Set());
    setG(prev=>({...prev,teams:{away,home},playerSide,teamColors:{away:aC,home:hC},totalInnings:innings,
      phase:"draft",draftPool:pool,draftPick:0,draftOptions:firstOptions,
      playerRoster:{batters:[],pitchers:[]},aiRoster:{batters:[],pitchers:[]},lineup:{away:[],home:[]}}));
  }

  function playerDraftPick(player){
    setG(prev=>{
      // In playoff draft all picks are player's; in normal draft check snake order
      if(!prev._playoffDraft && draftPickOwner(prev.draftPick)!==0)return prev;
      const newR={
        batters:player.type==="batter"?[...prev.playerRoster.batters,player]:prev.playerRoster.batters,
        pitchers:player.type==="pitcher"?[...prev.playerRoster.pitchers,player]:prev.playerRoster.pitchers,
      };
      const next=prev.draftPick+1;
      // Playoff draft: done after ROSTER_SIZE picks; normal draft: done after DRAFT_ROUNDS
      const draftLimit = prev._playoffDraft ? ROSTER_SIZE : DRAFT_ROUNDS;
      const done=next>=draftLimit;
      if(done){
        const allTaken=[...newR.batters,...newR.pitchers].map(p=>p.id);
        const filledPlayer=autoFillRoster(newR,prev.draftPool,allTaken,FULL_BATTERS,FULL_PITCHERS);
        // In online mode, no AI roster — opponent's roster comes from Supabase after both draft
        const filledAI=prev.mode==="online"
          ? {batters:[],pitchers:[]}
          : autoFillRoster(prev.aiRoster,prev.draftPool,
              [...filledPlayer.batters,...filledPlayer.pitchers,...prev.aiRoster.batters,...prev.aiRoster.pitchers].map(p=>p.id),
              FULL_BATTERS,FULL_PITCHERS);
        return{...prev,playerRoster:filledPlayer,aiRoster:filledAI,draftPick:next,draftOptions:[],
          phase:"lineup_setup",_turn:"away",gameLog:[`⚾ ${prev.teams.away} vs ${prev.teams.home}`,`--- Inning 1 (Top) ---`]};
      }
      // In playoff draft all picks are player's — always generate fresh options
      // In normal draft, check if next is player's or AI's
      if(prev._playoffDraft || draftPickOwner(next)===0){
        const takenNow=[...newR.batters,...newR.pitchers,...prev.aiRoster.batters,...prev.aiRoster.pitchers].map(p=>p.id);
        const tc=rosterTierCount(newR);
        const filledPos2=new Set(newR.batters.map(b=>b.pos));
        const opts=buildDraftOptions(prev.draftPool,takenNow,
          newR.batters.length<ROSTER_BATTERS,
          newR.pitchers.length<ROSTER_PITCHERS,tc,3,filledPos2);
        return{...prev,playerRoster:newR,draftPick:next,draftOptions:opts,phase:"draft"};
      }
      // Next pick is AI (normal draft only) — clear options, AI effect regenerates
      return{...prev,playerRoster:newR,draftPick:next,draftOptions:[],phase:"draft"};
    });
    setSelectedPlayer(null);
  }

  function confirmPlayerLineup(orderedBatters){
    const side=g.playerSide;
    // If online mode — save roster to Supabase and wait for opponent
    if(g.mode==="online"&&roomCode){
      const side=g.playerSide;
      const savedRoster={batters:[...g.playerRoster.batters],pitchers:[...g.playerRoster.pitchers]};
      const savedLineup=[...orderedBatters];
      supa.getRoom(roomCode).then(row=>{
        const updated={...(row||{}), [`${side}Roster`]:savedRoster, [`${side}Lineup`]:savedLineup};
        return supa.upsertRoom(roomCode, updated);
      }).then(()=>{
        const oppSide=side==="away"?"home":"away";
        const poll=setInterval(async()=>{
          const row=await supa.getRoom(roomCode);
          const oppRoster=row?.[`${oppSide}Roster`];
          if(oppRoster&&oppRoster.batters&&oppRoster.batters.length>0){
            clearInterval(poll);
            const myRoster=row[`${side}Roster`];
            const myLineup=row[`${side}Lineup`]||myRoster.batters;
            const oppLineup=row[`${oppSide}Lineup`]||oppRoster.batters;
            const totalInnings=row.innings||g.totalInnings||3;
            setOnlineState("playing");
            setG(prev=>({
              ...prev,
              mode:"online",
              phase:"pitching",
              playerSide:side,
              _turn:"home",
              totalInnings,
              teams:{away:side==="away"?"You":"Opponent", home:side==="home"?"You":"Opponent"},
              playerRoster: myRoster,
              aiRoster: oppRoster,
              lineup:{[side]:myLineup,[oppSide]:oppLineup},
              score:{away:0,home:0},
              inning:1, topBottom:"top", outs:0,
              count:{balls:0,strikes:0},
              bases:[false,false,false],
              pitchHistory:[],
              gameLog:[`⚾ Online Game · ${totalInnings} innings`,`--- Inning 1 (Top) ---`],
              activePitcherIdx:{away:0,home:0},
              pitcherBF:{away:0,home:0},
              usedPitchers:{away:[],home:[]},
              batterIndex:{away:0,home:0},
              isWalkoff:false,
            }));
          }
        },2000);
        setTimeout(()=>clearInterval(poll),300000);
      });
      setOnlineState(side==="away"?"away_wait_home_draft":"home_wait_away_draft");
      setG(prev=>({...prev,phase:"online_wait",_onlineCode:roomCode}));
      return;
    }

    // Intercept for playoff draft — save roster and return to setup
    if(playoffSetup?.step===3&&playoffSetup?._draftingFor!==undefined){
      const teamIdx=playoffSetup._draftingFor;
      const playerSide=side;
      const aiSide=playerSide==="away"?"home":"away";
      const savedRoster={batters:[...g.playerRoster.batters],pitchers:[...g.playerRoster.pitchers]};
      const savedLineup={[playerSide]:orderedBatters,[aiSide]:[...g.aiRoster.batters]};
      setPlayoffSetup(p=>{
        const draftedTeams=[...p.draftedTeams,{teamIdx,roster:savedRoster,lineup:savedLineup}];
        return{...p,draftedTeams,currentDraftTeam:p.currentDraftTeam+1,_draftingFor:undefined};
      });
      setG(prev=>({...prev,phase:"playoff_setup"}));
      return;
    }
    if(g.mode==="vs-ai"){
      const aiSide=side==="away"?"home":"away";
      const aiLineup=[...g.aiRoster.batters];
      setG(prev=>({...prev,lineup:{...prev.lineup,[side]:orderedBatters,[aiSide]:aiLineup},phase:"pitching"}));
    } else {
      setG(prev=>({...prev,lineup:{...prev.lineup,[side]:orderedBatters}}));
      setLineupPhase("ai");
    }
  }

  function skipLineup(){
    const playerSide=g.playerSide;
    const aiSide=playerSide==="away"?"home":"away";
    const lineup={[playerSide]:[...g.playerRoster.batters],[aiSide]:[...g.aiRoster.batters]};
    // If online mode — save roster to Supabase and wait for opponent
    if(g.mode==="online"&&roomCode){
      const savedRoster={batters:[...g.playerRoster.batters],pitchers:[...g.playerRoster.pitchers]};
      const savedLineup=[...g.playerRoster.batters];
      supa.getRoom(roomCode).then(row=>{
        const updated={...(row||{}), [`${playerSide}Roster`]:savedRoster, [`${playerSide}Lineup`]:savedLineup};
        return supa.upsertRoom(roomCode, updated);
      }).then(()=>{
        const oppSide=playerSide==="away"?"home":"away";
        const poll=setInterval(async()=>{
          const row=await supa.getRoom(roomCode);
          const oppRoster=row?.[`${oppSide}Roster`];
          if(oppRoster&&oppRoster.batters&&oppRoster.batters.length>0){
            clearInterval(poll);
            const myRoster=row[`${playerSide}Roster`];
            const myLineup=row[`${playerSide}Lineup`]||myRoster.batters;
            const oppLineup=row[`${oppSide}Lineup`]||oppRoster.batters;
            const totalInnings=row.innings||g.totalInnings||3;
            setOnlineState("playing");
            setG(prev=>({
              ...prev, mode:"online", phase:"pitching",
              playerSide, _turn:"home", totalInnings,
              teams:{away:playerSide==="away"?"You":"Opponent",home:playerSide==="home"?"You":"Opponent"},
              playerRoster:myRoster, aiRoster:oppRoster,
              lineup:{[playerSide]:myLineup,[oppSide]:oppLineup},
              score:{away:0,home:0}, inning:1, topBottom:"top", outs:0,
              count:{balls:0,strikes:0}, bases:[false,false,false],
              pitchHistory:[], gameLog:[`⚾ Online Game · ${totalInnings} innings`,`--- Inning 1 (Top) ---`],
              activePitcherIdx:{away:0,home:0}, pitcherBF:{away:0,home:0},
              usedPitchers:{away:[],home:[]}, batterIndex:{away:0,home:0}, isWalkoff:false,
            }));
          }
        },2000);
        setTimeout(()=>clearInterval(poll),300000);
      });
      setOnlineState(playerSide==="away"?"away_wait_home_draft":"home_wait_away_draft");
      setG(prev=>({...prev,phase:"online_wait",_onlineCode:roomCode}));
      return;
    }
    // If this is a playoff draft, save roster and advance
    if(playoffSetup?.step===3&&playoffSetup?._draftingFor!==undefined){
      const teamIdx=playoffSetup._draftingFor;
      const savedRoster={batters:[...g.playerRoster.batters],pitchers:[...g.playerRoster.pitchers]};
      const savedLineup=lineup;
      setPlayoffSetup(p=>{
        const draftedTeams=[...p.draftedTeams,{teamIdx,roster:savedRoster,lineup:savedLineup}];
        return{...p,draftedTeams,currentDraftTeam:p.currentDraftTeam+1,_draftingFor:undefined};
      });
      setG(prev=>({...prev,phase:"playoff_setup"}));
      return;
    }
    setG(prev=>({...prev,lineup,phase:"pitching"}));
  }

  function confirmAILineup(orderedBatters){
    const side=g.playerSide==="away"?"home":"away";
    setG(prev=>({...prev,lineup:{...prev.lineup,[side]:orderedBatters},phase:"pitching"}));
    setLineupPhase(null);
  }

  function choosePitch(pitchId){setG(prev=>({...prev,pitchChosen:pitchId,phase:"batting",_turn:prev.topBottom==="top"?"home":"away"}));} // pitcher wrote this

  function intentionalWalk(){
    setG(prev=>{
      const battingSide=prev.topBottom==="top"?"away":"home";
      const side=battingSide;
      const[nb,rs]=advanceRunners(prev.bases,"walk");
      const score={...prev.score}; score[side]+=rs;
      const batter=prev.lastBatter||(prev.lineup[battingSide]?.length
        ? prev.lineup[battingSide][prev.batterIndex[battingSide]%prev.lineup[battingSide].length]
        : null);
      const logEntry=`⚾ Intentional walk — ${batter?.name||"batter"} takes first`;
      let newBatIdx={...prev.batterIndex};
      newBatIdx[battingSide]++;
      let newBF={...prev.pitcherBF};
      const pitchingSide=prev.topBottom==="top"?"home":"away";
      newBF[pitchingSide]++;
      return{
        ...prev, bases:nb, score, batterIndex:newBatIdx, pitcherBF:newBF,
        lastResult:"Intentional Walk",
        gameLog:[...prev.gameLog,logEntry],
        phase:"result",_turn:pitchingSide, // pitcher initiated IBB
        lastDice:null,
        pitchHistory:[...prev.pitchHistory,{pitch:"intentional",swing:"walk",result:"walk",batter,pitcher:null,dice:null,battingSide}],
      };
    });
  }

  function chooseSwing(swingId){
    setG(prev=>{
      const battingSide=prev.topBottom==="top"?"away":"home";
      const pitchingSide=prev.topBottom==="top"?"home":"away";
      const bRoster=battingSide===prev.playerSide?prev.playerRoster:prev.aiRoster;
      const pRoster=pitchingSide===prev.playerSide?prev.playerRoster:prev.aiRoster;
      const pIdx=prev.activePitcherIdx[pitchingSide];
      const idx=prev.batterIndex[battingSide];
      const lineupArr=prev.lineup[battingSide];
      const batter=lineupArr.length?lineupArr[idx%lineupArr.length]:bRoster.batters[idx%bRoster.batters.length];
      const rawPitcher=pRoster.pitchers[pIdx];
      const pitcher=rawPitcher?pitcherFatigue(rawPitcher,prev.pitcherBF[pitchingSide]):null;
      // Apply streak bonus to batter effective stat
      const sb = streakBonus(batter?.id, prev.pitchHistory);
      const batterWithBonus = batter && sb !== 0
        ? { ...batter,
            contact: Math.min(99, Math.max(10, batter.contact + sb)),
            power:   Math.min(99, Math.max(10, batter.power   + sb)),
            eye:     Math.min(99, Math.max(10, batter.eye     + sb)) }
        : batter;
      // Clutch/comeback: small bonus to batter luck weighting
      const clutch = isClutch(prev.bases, prev.outs);
      const comeback = isComeback(prev.score, battingSide, prev.inning);
      const situationBonus = (clutch || comeback) ? 5 : 0;
      const batterFinal = batterWithBonus && situationBonus
        ? { ...batterWithBonus,
            contact: Math.min(99, batterWithBonus.contact + situationBonus),
            power:   Math.min(99, batterWithBonus.power   + situationBonus),
            eye:     Math.min(99, batterWithBonus.eye     + situationBonus) }
        : batterWithBonus;
      const dice=rollDice(prev.pitchChosen,swingId,batterFinal,pitcher,prev.pitchGuess);
      // Attach situation context to dice for display
      const streakInfo = getBatterStreak(batter?.id, prev.pitchHistory);
      dice.streakBonus = sb;
      dice.situationBonus = situationBonus;
      dice.clutch = clutch;
      dice.comeback = comeback;
      dice.streakCount = streakInfo.streak;
      dice.streakType = streakInfo.streakType;
      return{...prev,swingChosen:swingId,lastDice:dice,lastBatter:batter,lastPitcher:pitcher,phase:"rolling",_turn:battingSide};
    });
  }

  function resolveOutcome(){
    setG(prev=>{
      const dice=prev.lastDice, pitch=prev.pitchChosen, swing=prev.swingChosen;
      const batter=prev.lastBatter, pitcher=prev.lastPitcher;
      let result=dice.outcome;
      let{balls,strikes}=prev.count;
      let outs=prev.outs, bases=[...prev.bases], score={...prev.score};
      const prevBases=[...prev.bases]; // snapshot before advancing
      let runsScored=0, resultLabel=dice.outcomeLabel, newPhase="result";
      const side=prev.topBottom==="top"?"away":"home";
      const battingSide=side;
      const pitchingSide=prev.topBottom==="top"?"home":"away";
      // Fire sound for dice reveal
      setTimeout(()=>playSound("dice"), 0);

      // Every swing resolves the at-bat completely (no mid-count ball/strike)
      if(result==="walk"){const[nb,rs]=advanceRunners(bases,"walk");bases=nb;runsScored=rs;score[side]+=rs;}
      else if(result==="strikeout"){outs++;}
      else if(result==="out"){outs++;}
      else if(["single","double","triple","hr"].includes(result)){const[nb,rs]=advanceRunners(bases,result);bases=nb;runsScored=rs;score[side]+=rs;}

      if(runsScored>0)resultLabel+=` ${runsScored} run${runsScored>1?"s":""} score!`;

      // Fire outcome sound
      setTimeout(()=>{
        if(result==="hr") playSound("homerun");
        else if(["single","double","triple"].includes(result)) playSound("hit");
        else if(result==="strikeout") playSound("strikeout");
        else if(result==="walk") playSound("walk");
        else if(result==="out") playSound("out");
        if(dice?.guessCorrect) setTimeout(()=>playSound("guess_correct"),200);
        else if(dice?.guessWrong) setTimeout(()=>playSound("guess_wrong"),200);
      }, 300);
      const pitchLabel=PITCH_TYPES.find(p=>p.id===pitch)?.label;
      const swingLabel=SWING_TYPES.find(s=>s.id===swing)?.label;
      const netStr=dice.net>0?`+${dice.net}`:`${dice.net}`;
      const logEntry=`${batter?.name||"Batter"}: ${pitchLabel}/${swingLabel} [🎲${dice.batterRoll}+🎲${dice.luckRoll}-🎲${dice.pitcherRoll}=${netStr}] → ${resultLabel}`;

      let newTop=prev.topBottom, newInning=prev.inning, newBatIdx={...prev.batterIndex};
      let newBF={...prev.pitcherBF};
      let gameOver=false;

      // Increment batters faced for current pitcher
      newBF[pitchingSide]++;

      newBatIdx[battingSide]++;

      if(outs>=3){
        if(newTop==="top"){
          newTop="bottom";
          // If this was the top of the final inning and home is already winning,
          // home doesn't bat — end the game immediately
          if(score.home > score.away){
            // Home leads after top of any inning at or beyond regulation — game over
            if(prev.inning>=prev.totalInnings){
              gameOver=true; newPhase="gameover";
            } else {
              newPhase="between";
            }
          } else {
            newPhase="between";
          }
        }
        else{
          newInning++;newTop="top";newPhase="between";
          if(newInning>prev.totalInnings){
            // No ties — if tied after regulation, keep going as extra innings
            if(score.away===score.home){
              // Continue playing — extra inning, don't end game
              newPhase="between";
            } else {
              gameOver=true;newPhase="gameover";
            }
          }
        }
        outs=0;bases=[false,false,false];balls=0;strikes=0;
      }

      // Walkoff: home team takes the lead in bottom of final inning
      const isWalkoff = (
        newPhase==="gameover" &&
        prev.topBottom==="bottom" &&
        score.home > score.away &&
        runsScored > 0
      );
      if(isWalkoff) setTimeout(()=>playSound("walkoff"), 400);

      const resultTurn = battingSide; // batter always writes result (walkoff/gameover too)
      return{
        ...prev,count:{balls,strikes},outs,bases,score,lastResult:resultLabel,
        _prevBases:prevBases,
        pitchChosen:null,swingChosen:null,pitchGuess:null,
        phase:isWalkoff?"walkoff":newPhase,
        topBottom:newTop,inning:newInning,batterIndex:newBatIdx,pitcherBF:newBF,
        isWalkoff,_turn:resultTurn,
        gameLog:[...prev.gameLog,logEntry],
        pitchHistory:[...prev.pitchHistory,{pitch,swing,result,batter,pitcher,dice,battingSide,pitchGuess:prev.pitchGuess,runsScored}],
      };
    });
  }

  function changePitcher(side,newIdx){
    setG(prev=>({...prev,activePitcherIdx:{...prev.activePitcherIdx,[side]:newIdx},pitcherBF:{...prev.pitcherBF,[side]:0},gameLog:[...prev.gameLog,`🔄 Pitching change for ${prev.teams[side]}`]}));
    setShowChangePitcher(false);
  }

  function continuePlay(){
    setG(prev=>{
      if(prev.topBottom==="bottom" && prev.inning>=prev.totalInnings && prev.score.home>prev.score.away){
        return{...prev,phase:"gameover",_turn:"away"};
      }
      // Pitcher for this half-inning writes first
      const pitcherSide=prev.topBottom==="top"?"home":"away";
      return{...prev,phase:"pitching",_turn:pitcherSide,gameLog:[...prev.gameLog,`--- Inning ${prev.inning} (${prev.topBottom==="top"?"Top":"Bottom"}) ---`]};
    });
  }

  function resetGame(){
    setTeamName(TEAM_NAMES[0]);setAiTeamName(TEAM_NAMES[1]);setInningChoice(3);
    setChosenSide("away");setSelectedPlayer(null);setDraftFilter("all");
    setShowBoxScore(false);setShowChangePitcher(false);setLineupPhase(null);
    setPlayerColorIdx(0);setAiColorIdx(1);
    setPlayoff(null);setPlayoffSetup(null);setHasSave(false);setSaveStatus(null);
    deleteSave();
    setOnlineState("idle");setRoomCode("");setRoomInput("");setOnlineError("");setOnlineSide(null);
    if(unsubRef.current){unsubRef.current();unsubRef.current=null;}
    setG(initGame());
  }

  // ── COMPUTED ────────────────────────────────────────────────────────────────
  const root={minHeight:"100vh",background:"linear-gradient(160deg,#0d0a1e 0%,#0a1628 50%,#0d1a0a 100%)",color:"#f8fafc",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:40};
  const card={background:"linear-gradient(180deg,#161f2e 0%,#111827 100%)",border:"1px solid #253046",borderRadius:16,padding:20,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"};
  const lbl={fontSize:11,color:"#7c8fa8",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8};
  const btn=(color="#E63946")=>({background:`linear-gradient(135deg,${color} 0%,${color}cc 100%)`,color:"#fff",border:`1px solid ${color}`,borderRadius:10,padding:"12px 20px",fontWeight:800,fontSize:14,cursor:"pointer",width:"100%",letterSpacing:0.5,boxShadow:`0 2px 12px ${color}44`});
  const pitchBtn=(color,selected)=>({background:selected?`linear-gradient(135deg,${color},${color}bb)`:"#141d2e",border:`2px solid ${selected?color:"#253046"}`,color:selected?"#fff":"#7c8fa8",borderRadius:10,padding:"10px 8px",fontWeight:700,fontSize:13,cursor:"pointer",flex:1,minWidth:80,boxShadow:selected?`0 2px 10px ${color}55`:"none"});

  const battingTeam=g.topBottom==="top"?g.teams.away:g.teams.home;
  const pitchingTeam=g.topBottom==="top"?g.teams.home:g.teams.away;
  // In online mode: player's turn is determined by their side and current half-inning
  const isOnline=g.mode==="online";
  const playerBatting=(g.mode==="vs-ai"||isOnline)&&(g.playerSide==="away"?g.topBottom==="top":g.topBottom==="bottom");
  const playerPitching=(g.mode==="vs-ai"||isOnline)&&(g.playerSide==="away"?g.topBottom==="bottom":g.topBottom==="top");
  const playerIsPitching=g.mode==="two-player"||playerPitching;
  const playerIsBatting=g.mode==="two-player"||playerBatting;

  const battingSide=g.topBottom==="top"?"away":"home";
  const pitchingSide=g.topBottom==="top"?"home":"away";
  const bRoster=battingSide===g.playerSide?g.playerRoster:g.aiRoster;
  const pRoster=pitchingSide===g.playerSide?g.playerRoster:g.aiRoster;
  const lineupArr=g.lineup[battingSide];
  const activeBatter=lineupArr?.length?lineupArr[g.batterIndex[battingSide]%lineupArr.length]:bRoster.batters[g.batterIndex[battingSide]%Math.max(1,bRoster.batters.length)];
  const rawActivePitcher=pRoster.pitchers[g.activePitcherIdx[pitchingSide]];
  const activePitcher=rawActivePitcher?pitcherFatigue(rawActivePitcher,g.pitcherBF[pitchingSide]):null;
  const playerTeamColor=g.teamColors[g.playerSide]||TEAM_PALETTE[0];

  // Game-phase controls visibility
  const canChangePitcher=playerIsPitching&&g.phase==="pitching";

  // ── MENU ──────────────────────────────────────────────────────────────────
  if(g.phase==="menu")return(
    <div style={root}>
      <div style={{...card,maxWidth:400,margin:"60px auto 0",textAlign:"center"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d1b69,#1a3a2a)",borderRadius:12,padding:"24px 20px 20px",marginBottom:20}}>
          <div style={{fontSize:52,marginBottom:8}}>⚾</div>
          <div style={{fontSize:30,fontWeight:900,letterSpacing:-1,marginBottom:4,background:"linear-gradient(135deg,#60a5fa,#f59e0b,#34d399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Diamond Duel</div>
          <div style={{color:"#94a3b8",fontSize:13}}>Draft · Guess · Swing · Win</div>
        </div>
        <div style={{color:"#64748b",marginBottom:12,fontSize:14}}>Draft · Set Lineup · Guess the Pitch · Win</div>
        <div style={{background:"linear-gradient(135deg,#141d2e,#111827)",border:"1px solid #253046",borderRadius:12,padding:"12px 16px",marginBottom:24,textAlign:"left"}}>
          <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>How to Play</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[["🎲","Draft","Pick 5 of 3 presented options each round — rest auto-filled"],["📋","Set Lineup","Order your 9-batter lineup before the game starts"],["🤔","Guess","Each at-bat: guess the pitch type for a stat bonus"],["🏏","Swing","Choose Power, Contact, Bunt, or Take"],["🎯","Dice","3 dice roll — batter die vs pitcher die + luck modifier"],["🏆","Win","Score more runs through 3-9 innings"]].map(([icon,title,desc])=>(
              <div key={title} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:14}}>{icon}</span>
                <div><span style={{fontWeight:700,color:"#f8fafc",fontSize:12}}>{title}: </span><span style={{color:"#64748b",fontSize:12}}>{desc}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <button style={btn("#E63946")} onClick={()=>startGame("vs-ai")}>🤖  Play vs AI</button>
          
          <button style={btn("#22c55e")} onClick={()=>{
            setOnlineState("idle");setRoomCode("");setRoomInput("");setOnlineError("");
            setG(prev=>({...prev,phase:"online_lobby",mode:"online"}));
          }}>🌐  Play Online</button>
          <button style={btn("#f59e0b")} onClick={()=>{
            setPlayoffSetup({step:1,bracketSize:4,seriesLen:3,innings:3,
              teams:Array.from({length:4},(_,i)=>({name:TEAM_NAMES[i],colorIdx:i,isHuman:i===0})),
              currentDraftTeam:0,draftedTeams:[]});
            setG(prev=>({...prev,phase:"playoff_setup"}));
          }}>🏆  Playoff Mode</button>
          {hasSave&&(
            <>
              <button style={{...btn("#34d399"),marginTop:0}} onClick={async()=>{
                setSaveStatus("saving");
                const data=await loadPlayoff();
                setSaveStatus(null);
                if(data){
                  setPlayoff(data);
                  setG({...initGame(),phase:"playoff_hub"});
                } else {
                  setSaveStatus("error");
                  setTimeout(()=>setSaveStatus(null),3000);
                }
              }}>▶ Resume Saved Playoff</button>
              {saveStatus==="error"&&(
                <div style={{fontSize:11,color:"#f87171",textAlign:"center",marginTop:4}}>
                  Could not load save — try again or start a new playoff
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if(g.phase==="setup"){
    const sel={width:"100%",background:"#1e293b",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"10px 14px",fontSize:15,boxSizing:"border-box",appearance:"none",cursor:"pointer"};
    const sideBtn=(side,icon,title,desc)=>(
      <button onClick={()=>setChosenSide(side)} style={{flex:1,background:chosenSide===side?"#1e3a5f":"#1e293b",border:`2px solid ${chosenSide===side?"#3b82f6":"#334155"}`,borderRadius:10,padding:"12px 10px",cursor:"pointer",textAlign:"center"}}>
        <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
        <div style={{fontWeight:800,color:chosenSide===side?"#60a5fa":"#94a3b8",fontSize:14}}>{title}</div>
        <div style={{fontSize:11,color:"#64748b",marginTop:3}}>{desc}</div>
      </button>
    );
    const ColorSwatch=({idx,selected,onClick})=>(
      <div onClick={onClick} style={{width:28,height:28,borderRadius:"50%",background:TEAM_PALETTE[idx].primary,border:selected?"3px solid #f8fafc":"3px solid transparent",cursor:"pointer",flexShrink:0}}/>
    );
    const aiOpts=TEAM_NAMES.filter(n=>n!==teamName);
    return(
      <div style={root}>
        <div style={{...card,maxWidth:420,margin:"40px auto 0"}}>
          <div style={{fontSize:20,fontWeight:800,marginBottom:20}}>Game Setup</div>
          {g.mode==="vs-ai"&&(<><div style={lbl}>Play as</div><div style={{display:"flex",gap:10,marginBottom:20}}>{sideBtn("away","⚡","Away","Bats first")}{sideBtn("home","🏠","Home","Bats second")}</div></>)}
          {/* Your team: name + color swatches on same row */}
          <div style={{marginBottom:14}}>
            <div style={lbl}>{g.mode==="vs-ai"?"Your Team":"Away Team"}</div>
            <div style={{fontSize:20,fontWeight:900,color:TEAM_PALETTE[playerColorIdx].primary,marginBottom:6,letterSpacing:-0.5}}>{teamName}</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{position:"relative",flex:1}}>
                <select style={{...sel}} value={teamName} onChange={e=>{setTeamName(e.target.value);if(aiTeamName===e.target.value){const n=TEAM_NAMES.find(x=>x!==e.target.value);if(n)setAiTeamName(n);}}}>
                  {TEAM_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#64748b"}}>▾</div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                {TEAM_PALETTE.map((_,i)=><ColorSwatch key={i} idx={i} selected={playerColorIdx===i} onClick={()=>setPlayerColorIdx(i)}/>)}
              </div>
            </div>
          </div>
          {g.mode==="vs-ai"&&(
            <div style={{marginBottom:16}}>
              <div style={lbl}>AI Opponent</div>
              <div style={{fontSize:20,fontWeight:900,color:TEAM_PALETTE[aiColorIdx].primary,marginBottom:6,letterSpacing:-0.5}}>{aiTeamName}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{position:"relative",flex:1}}>
                  <select style={{...sel}} value={aiTeamName} onChange={e=>setAiTeamName(e.target.value)}>
                    {aiOpts.map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                  <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#64748b"}}>▾</div>
                </div>
                <div style={{display:"flex",gap:5,flexShrink:0}}>
                  {TEAM_PALETTE.map((_,i)=><ColorSwatch key={i} idx={i} selected={aiColorIdx===i} onClick={()=>setAiColorIdx(i)}/>)}
                </div>
              </div>
            </div>
          )}
          {/* Inning selector */}
          <div style={{marginBottom:16}}>
            <div style={lbl}>Game Length</div>
            <div style={{display:"flex",gap:8}}>
              {[3,5,7,9].map(n=>(
                <button key={n} onClick={()=>setInningChoice(n)}
                  style={{flex:1,background:inningChoice===n?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${inningChoice===n?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:inningChoice===n?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"8px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                  {n}
                  <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>{n<=3?"~5 min":n<=5?"~8 min":n<=7?"~12 min":"~15 min"}</div>
                </button>
              ))}
            </div>
          </div>
          <button style={btn(TEAM_PALETTE[playerColorIdx].primary)} onClick={()=>{
            const pC=TEAM_PALETTE[playerColorIdx], aC2=TEAM_PALETTE[aiColorIdx];
            if(g.mode==="vs-ai"){
              const away=chosenSide==="away"?teamName:aiTeamName;
              const home=chosenSide==="home"?teamName:aiTeamName;
              const awayC=chosenSide==="away"?pC:aC2;
              const homeC=chosenSide==="home"?pC:aC2;
              beginDraft(away,home,chosenSide,awayC,homeC,inningChoice);
            } else {
              beginDraft(teamName,aiTeamName||"Home","away",pC,aC2,inningChoice);
            }
          }}>Start Draft →</button>
        </div>
      </div>
    );
  }

  // ── DRAFT ─────────────────────────────────────────────────────────────────
  if(g.phase==="draft"){
    const isMyTurn=g._playoffDraft||draftPickOwner(g.draftPick)===0; // solo draft: always player's turn
    const round=Math.floor(g.draftPick/2)+1;
    const needsBatter=g.playerRoster.batters.length<ROSTER_BATTERS;
    const needsPitcher=g.playerRoster.pitchers.length<ROSTER_PITCHERS;
    const POS_SLOTS=["C","1B","2B","3B","SS","LF","CF","RF","DH"];
    const filledPos=new Set(g.playerRoster.batters.map(b=>b.pos));
    const accent=playerTeamColor.primary;
    const options=g.draftOptions||[];

    return(
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"14px 16px 0",boxSizing:"border-box"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>Snake Draft</div>
              <div style={{fontSize:12,color:"#64748b"}}>Pick {g.draftPick+1} of {g._playoffDraft?ROSTER_SIZE:DRAFT_ROUNDS}{g._playoffDraft?" · Solo Draft":" · Round "+round}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:700,color:isMyTurn?accent:"#94a3b8"}}>{isMyTurn?"⬅ Your Pick":"⏳ AI Picking…"}</div>
              {(()=>{const tc=rosterTierCount(g.playerRoster);return(
                <div style={{fontSize:11,color:"#64748b"}}>
                  <span style={{color:"#f59e0b"}}>S {tc.S}/{DRAFT_TIER_LIMITS.S}</span> · <span style={{color:"#60a5fa"}}>A {tc.A}/{DRAFT_TIER_LIMITS.A}</span> · <span style={{color:"#34d399"}}>B {tc.B}/{DRAFT_TIER_LIMITS.B}</span> · <span style={{color:"#94a3b8"}}>C: auto-filled</span>
                </div>
              );})()}
            </div>
          </div>

          {/* Position tracker */}
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Your Picks <span style={{color:"#475569",fontWeight:400}}>(rest auto-filled)</span></div>
              <div style={{fontSize:11,color:"#64748b"}}>{g.playerRoster.batters.length+g.playerRoster.pitchers.length}/{ROSTER_SIZE}</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:5}}>
              {POS_SLOTS.map(pos=>{
                const filled=filledPos.has(pos);
                const player=g.playerRoster.batters.find(b=>b.pos===pos);
                return(
                  <div key={pos} style={{display:"flex",flexDirection:"column",alignItems:"center",background:filled?accent+"33":"#0d1525",border:`1px solid ${filled?accent:"#1e2a3a"}`,borderRadius:6,padding:"3px 6px",minWidth:34}}>
                    <div style={{fontSize:9,color:filled?accent:"#475569",fontWeight:700}}>{pos}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:1,maxWidth:40,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{filled?(player?.name.split(" ").slice(-1)[0]||"✓"):"—"}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {Array.from({length:ROSTER_PITCHERS}).map((_,i)=>{
                const p=g.playerRoster.pitchers[i];
                return(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",background:p?"#3b1f5e":"#0d1525",border:`1px solid ${p?"#9b5de5":"#1e2a3a"}`,borderRadius:6,padding:"3px 6px",minWidth:34}}>
                    <div style={{fontSize:9,color:p?"#c084fc":"#475569",fontWeight:700}}>P{i+1}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:1,maxWidth:50,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?(p.name.split(" ").slice(-1)[0]||"✓"):"—"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 choices or waiting */}
          {isMyTurn ? (
            <div>
              <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#64748b",lineHeight:1.6}}>
                Draft <span style={{color:"#f59e0b",fontWeight:700}}>2 S-tier</span> · <span style={{color:"#60a5fa",fontWeight:700}}>3 A-tier</span> · <span style={{color:"#34d399",fontWeight:700}}>3 B-tier</span> (8 picks). The remaining slots are auto-filled with <span style={{color:"#94a3b8",fontWeight:700}}>C-tier</span> role players. No C-tier in your 8 active picks!
              </div>
              <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                Choose 1 of 3 — others return to pool
              </div>
              {options.length===0 && (
                <div style={{color:"#475569",textAlign:"center",padding:"20px 0",fontSize:13}}>No eligible players available</div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {options.map(p=>{
                  const isBatter=p.type==="batter";
                  // Also ineligible if this batter's position is already filled
                  const posAlreadyFilled=isBatter&&filledPos.has(p.pos);
                  const eligible=(isBatter?needsBatter:needsPitcher)&&!posAlreadyFilled;
                  return(
                    <div key={p.id}
                      style={{background:"#0f172a",border:`2px solid ${eligible?"#1e293b":"#0f172a"}`,borderRadius:12,padding:"12px 14px",cursor:eligible?"pointer":"not-allowed",opacity:eligible?1:0.35,transition:"border-color 0.12s"}}
                      onMouseEnter={e=>{if(eligible)e.currentTarget.style.borderColor=accent;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=eligible?"#1e293b":"#0f172a";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <PlayerAvatar player={p} size={38}/>
                          <div>
                            <div style={{fontWeight:800,fontSize:14}}>{p.name}</div>
                            <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{isBatter?p.pos:"Pitcher"}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <TierBadge tier={p.tier}/>
                          <button
                            onClick={()=>eligible&&playerDraftPick(p)}
                            style={{background:eligible?accent:"#334155",color:"#fff",border:"none",borderRadius:7,padding:"5px 14px",fontWeight:700,fontSize:12,cursor:eligible?"pointer":"default",opacity:eligible?1:0.5}}>
                            Pick ✓
                          </button>
                        </div>
                      </div>
                      {isBatter?(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 10px"}}>
                          {[["CON",p.contact,"#60a5fa"],["PWR",p.power,"#E63946"],["EYE",p.eye,"#2A9D8F"],["SPD",p.speed,"#E9C46A"]].map(([l,v,c])=>(
                            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{v}</span></div><StatBar value={v} color={c}/></div>
                          ))}
                        </div>
                      ):(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 10px"}}>
                          {[["STF",p.stuff,"#E63946"],["CTL",p.control,"#2A9D8F"],["MOV",p.movement,"#9B5DE5"],["STA",p.stamina,"#f59e0b"]].map(([l,v,c])=>(
                            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{v}</span></div><StatBar value={v} color={c}/></div>
                          ))}
                        </div>
                      )}
                      {!eligible&&<div style={{fontSize:10,color:"#f87171",marginTop:6}}>{posAlreadyFilled?`${p.pos} already filled — wait for next pick`:`Roster full for this type`}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ):(
            <div style={{textAlign:"center",color:"#64748b",padding:"24px 0",fontSize:13}}>{g.mode==="online"?"⏳ Waiting for opponent…":"⏳ AI is selecting…"}</div>
          )}
        </div>
      </div>
    );
  }

  // ── LINEUP SETUP ──────────────────────────────────────────────────────────
  if(g.phase==="lineup_setup"||(lineupPhase==="ai"&&g.mode==="two-player")){
    const isPlayerTurn=g.phase==="lineup_setup";
    const editSide=isPlayerTurn?g.playerSide:(g.playerSide==="away"?"home":"away");
    // In online mode, only edit player's own lineup
    const editRoster=g.mode==="online"?g.playerRoster:(editSide===g.playerSide?g.playerRoster:g.aiRoster);
    const editColor=g.teamColors[editSide].primary;
    const editName=g.teams[editSide];
    return(
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"16px 16px 0",boxSizing:"border-box"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{fontWeight:800,fontSize:18,color:editColor}}>{editName}</div>
            <button onClick={skipLineup} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              Skip — Use Draft Order ⚡
            </button>
          </div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>{g.mode==="online"?"Set your batting order, then wait for your opponent to finish their lineup.":"Your lineup cycles through all 9 batters in order. Put your best on-base players at the top, power hitters in the middle (3-5), and speed players lower."}</div>
          <LineupEditor roster={editRoster} teamName={editName} color={editColor} onConfirm={isPlayerTurn?confirmPlayerLineup:confirmAILineup}/>
        </div>
      </div>
    );
  }

  // ── ROLLING ──────────────────────────────────────────────────────────────
  if(g.phase==="rolling")return <RollingScreen g={g} onReveal={resolveOutcome}/>;

  // ── GAME PHASES (pitching, batting, result, between, gameover) ────────────
  const matchupBar=activeBatter&&activePitcher&&(
    <div style={{marginBottom:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
        {/* Batter card */}
        {(()=>{
          const{ streak, streakType }=getBatterStreak(activeBatter.id,g.pitchHistory);
          const situation=situationBadge(g.bases,g.outs,g.score,battingSide,g.inning);
          const song=WALKUP_SONGS[activeBatter.id];
          const streakColor=streakType==="hot"?"#f59e0b":streakType==="cold"?"#60a5fa":"#64748b";
          const streakLabel=streak>=2?(streakType==="hot"?`🔥 ${streak} in a row`:`❄️ 0-for-${streak}`):"";
          return(
            <div style={{background:"#0f172a",borderRadius:8,padding:"8px 10px",borderLeft:`3px solid ${situation?situation.color:g.teamColors[battingSide].primary}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>At Bat #{(g.batterIndex[battingSide]%Math.max(1,lineupArr?.length||1))+1}</div>
                {situation&&<div style={{fontSize:9,fontWeight:800,color:situation.color,background:situation.color+"22",borderRadius:4,padding:"1px 5px"}}>{situation.label}</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <PlayerAvatar player={activeBatter} size={36}/>
                <div>
                  <div style={{fontSize:12,fontWeight:700,lineHeight:1.2}}>{activeBatter.name}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{activeBatter.pos} · <TierBadge tier={activeBatter.tier}/></div>
                </div>
              </div>
              {streakLabel&&<div style={{fontSize:9,color:streakColor,fontWeight:700,marginBottom:4}}>{streakLabel}</div>}
              {song&&<div style={{fontSize:9,color:"#475569",marginBottom:5,fontStyle:"italic"}}>🎵 {song}</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 8px"}}>
                {[["CON",activeBatter.contact,"#60a5fa"],["PWR",activeBatter.power,"#E63946"],["EYE",activeBatter.eye,"#2A9D8F"],["SPD",activeBatter.speed,"#E9C46A"]].map(([l,v,c])=>(
                  <div key={l}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                      <span style={{fontSize:8,color:"#64748b",letterSpacing:1}}>{l}</span>
                      <span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{Math.round(v)}</span>
                    </div>
                    <StatBar value={v} color={c}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {/* Pitcher card */}
        <div style={{background:"#0f172a",borderRadius:8,padding:"8px 10px",borderLeft:`3px solid ${g.teamColors[pitchingSide].primary}`}}>
          <div style={{fontSize:9,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Pitching · {g.pitcherBF[pitchingSide]} BF</div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
            <PlayerAvatar player={rawActivePitcher} size={36}/>
            <div>
              <div style={{fontSize:12,fontWeight:700,lineHeight:1.2}}>{activePitcher.name}</div>
              <div style={{fontSize:10,color:"#94a3b8"}}>P · <TierBadge tier={activePitcher.tier}/></div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 8px",marginBottom:4}}>
            {[["STF",activePitcher.stuff,"#E63946"],["CTL",activePitcher.control,"#2A9D8F"],["MOV",activePitcher.movement,"#9B5DE5"]].map(([l,v,c])=>(
              <div key={l}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                  <span style={{fontSize:8,color:"#64748b",letterSpacing:1}}>{l}</span>
                  <span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{Math.round(v)}</span>
                </div>
                <StatBar value={v} color={c}/>
              </div>
            ))}
          </div>
          <StaminaBar pitcher={rawActivePitcher} bf={g.pitcherBF[pitchingSide]}/>
          <PitchHistoryStrip pitchHistory={g.pitchHistory} pitchingSide={pitchingSide}/>
        </div>
      </div>
    </div>
  );

  if(g.phase==="pitching")return(
    <div style={root}>
      {showBoxScore&&<BoxScoreModal g={g} onClose={()=>setShowBoxScore(false)}/>}
      {showChangePitcher&&<ChangePitcherModal g={g} onChangeTo={changePitcher} onClose={()=>setShowChangePitcher(false)}/>}
      <Scoreboard g={g} onBoxScore={()=>setShowBoxScore(true)} onChangePitcher={canChangePitcher?()=>setShowChangePitcher(true):null} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}  />
      <div style={card}>
        {matchupBar}
        {playerIsPitching
          ?<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={lbl}>🤜 {pitchingTeam} — Choose Your Pitch</div>
              {/* IBB: available when 1st base open OR runners on 2nd/3rd */}
              {(!g.bases[0]||g.bases[1]||g.bases[2])&&activeBatter?.tier==="S"&&(
                <button onClick={intentionalWalk} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>IBB ↗</button>
              )}
            </div>
            {g.mode==="two-player"&&<div style={{background:"#0f172a",borderRadius:7,padding:"6px 10px",fontSize:12,color:"#64748b",marginBottom:10}}>📵 Pass the device — don't let the batter see your pitch choice!</div>}
            {g.mode==="vs-ai"&&g.count.balls===0&&g.count.strikes===0&&(
              <div style={{fontSize:11,color:"#475569",marginBottom:8}}>💡 Tip: Mix pitches to keep the batter guessing. Repeating the same pitch earns a penalty.</div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{PITCH_TYPES.map(p=><button key={p.id} style={pitchBtn(p.color,false)} onClick={()=>choosePitch(p.id)}><div style={{fontSize:15,marginBottom:2}}>{p.abbr}</div><div style={{fontSize:11,fontWeight:400,color:"#94a3b8"}}>{p.label}</div></button>)}</div>
           </>
          :<div style={{color:"#64748b",textAlign:"center",padding:"20px 0"}}>{isOnline?"⏳ Waiting for opponent to pitch…":"⚾ AI is winding up…"}</div>
        }
      </div>
    </div>
  );

  if(g.phase==="batting")return(
    <div style={root}>
      {showBoxScore&&<BoxScoreModal g={g} onClose={()=>setShowBoxScore(false)}/>}
      <Scoreboard g={g} onBoxScore={()=>setShowBoxScore(true)} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}  />
      <div style={card}>
        {matchupBar}
        {playerIsBatting ? (()=>{
          const sit=situationBadge(g.bases,g.outs,g.score,battingSide,g.inning);
          const accentColor=playerTeamColor.primary;
          const guessBtn=(p,selected)=>({
            background:selected?p.color+"33":"#0f172a",
            border:`2px solid ${selected?p.color:"#1e293b"}`,
            color:selected?p.color:"#475569",
            borderRadius:8, padding:"7px 6px", fontWeight:700, fontSize:12,
            cursor:"pointer", flex:1, textAlign:"center", transition:"all 0.12s",
          });
          return(
            <div>
              {/* Situation badge */}
              {sit&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:800,color:sit.color,background:sit.color+"22",borderRadius:6,padding:"4px 10px"}}>{sit.label} — {sit.desc}</div>
              </div>}

              {/* Current at-bat pitch sequence */}
              <AtBatSequence pitchHistory={g.pitchHistory} batterId={activeBatter?.id} pitchingSide={pitchingSide}/>

              {/* Pitch guess */}
              <div style={{background:"#0f172a",borderRadius:7,padding:"6px 10px",fontSize:12,color:"#64748b",marginBottom:8}}>
                Guess right: <span style={{color:"#34d399",fontWeight:700}}>+8</span> to your bat stat · Guess wrong: <span style={{color:"#f87171",fontWeight:700}}>-5</span> · No guess: no change. Then pick your swing type below.
              </div>
              <div style={lbl}>🤔 Guess the pitch</div>
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {PITCH_TYPES.map(p=>(
                  <button key={p.id} style={guessBtn(p, g.pitchGuess===p.id)}
                    onClick={()=>setG(prev=>({...prev,pitchGuess:prev.pitchGuess===p.id?null:p.id}))}>
                    <div style={{fontSize:13}}>{p.abbr}</div>
                    <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>{p.label}</div>
                  </button>
                ))}
              </div>

              {/* Guess feedback */}
              <div style={{fontSize:10,color:"#475569",marginBottom:12,minHeight:14}}>
                {g.pitchGuess
                  ? <span>Guessing <span style={{color:PITCH_TYPES.find(p=>p.id===g.pitchGuess)?.color,fontWeight:700}}>{PITCH_TYPES.find(p=>p.id===g.pitchGuess)?.label}</span> — correct guess: <span style={{color:"#34d399"}}>+8 bat stat</span> · wrong: <span style={{color:"#f87171"}}>-5 bat stat</span></span>
                  : <span style={{color:"#334155"}}>No guess — skip for no bonus/penalty</span>
                }
              </div>

              {/* Swing type */}
              <div style={lbl}>🏏 {battingTeam} — Choose your swing</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {SWING_TYPES.map(s=>(
                  <button key={s.id}
                    style={{...pitchBtn(accentColor,false),display:"flex",justifyContent:"space-between",alignItems:"center",borderColor:"#253046"}}
                    onClick={()=>chooseSwing(s.id)}>
                    <span style={{fontWeight:800}}>{s.label}</span>
                    <span style={{fontSize:11,color:"#64748b",fontWeight:400}}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()
        :<div style={{color:"#64748b",textAlign:"center",padding:"20px 0"}}>{isOnline?"⏳ Waiting for opponent to swing…":"🤖 AI batter deciding…"}</div>}
      </div>
    </div>
  );

  if(g.phase==="result"){
    const last=g.pitchHistory[g.pitchHistory.length-1];
    const pitchLabel=PITCH_TYPES.find(p=>p.id===last?.pitch)?.label||"—";
    const swingLabel=SWING_TYPES.find(s=>s.id===last?.swing)?.label||"—";
    const isHR=g.lastResult?.includes("HOME RUN");
    const isRun=g.lastResult?.includes("run");
    const dice=last?.dice;
    const battingC=g.teamColors[last?.battingSide||"away"].primary;
    const pitchingC=g.teamColors[last?.battingSide==="away"?"home":"away"].primary;
    return(
      <div style={root}>
        {showBoxScore&&<BoxScoreModal g={g} onClose={()=>setShowBoxScore(false)}/>}
        <Scoreboard g={g} onBoxScore={()=>setShowBoxScore(true)} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}  />
        <div style={card}>
          <div style={{background:isHR?"linear-gradient(135deg,#7c3aed,#e63946)":isRun?"linear-gradient(135deg,#16a34a33,#14532d22)":"linear-gradient(135deg,#1e293b,#141d2e)",border:`2px solid ${isHR?"#e63946":isRun?"#16a34a":"#253046"}`,borderRadius:12,padding:"14px 18px",textAlign:"center",marginBottom:12,boxShadow:isHR?"0 4px 20px #e6394644":isRun?"0 2px 12px #16a34a33":"none"}}>
            <div style={{fontSize:22,fontWeight:900}}>{g.lastResult}</div>
            {last?.batter&&<div style={{fontSize:12,color:"#94a3b8",marginTop:3}}>{last.batter.name}</div>}
          </div>
          {dice&&(
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14,marginBottom:12}}>
              {/* Dice row: batter | luck modifier chip | pitcher */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:battingC,textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontWeight:700}}>{last.batter?.name?.split(" ").slice(-1)[0]||"Batter"}</div>
                  <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={dice.batterRoll} color={battingC} bg="#0f172a" size={48}/></div>
                  <div style={{fontSize:9,color:"#475569",marginTop:4}}>
                    {dice.batterStatKey?.toUpperCase()} {dice.adjustedBatterStatVal ?? dice.batterStatVal}
                    {dice.guessBonusVal > 0 && <span style={{color:"#34d399",fontWeight:700}}> (+{dice.guessBonusVal})</span>}
                    {dice.guessBonusVal < 0 && <span style={{color:"#f87171",fontWeight:700}}> ({dice.guessBonusVal})</span>}
                  </div>
                </div>
                <div style={{textAlign:"center",padding:"0 2px"}}>
                  <div style={{fontSize:9,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontWeight:700}}>Luck</div>
                  <div style={{width:40,height:40,borderRadius:8,border:"2px solid #f59e0b",background:"#1a1200",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                    <span style={{fontSize:18,fontWeight:900,color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#94a3b8"}}>
                      {dice.luckMod>0?"+1":dice.luckMod<0?"-1":" 0"}
                    </span>
                  </div>
                  <div style={{fontSize:9,color:"#475569",marginTop:4}}>rolled {dice.luckRoll}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:pitchingC,textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontWeight:700}}>{last.pitcher?.name?.split(" ").slice(-1)[0]||"Pitcher"}</div>
                  <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={dice.pitcherRoll} color={pitchingC} bg="#0f172a" size={48}/></div>
                  <div style={{fontSize:9,color:"#475569",marginTop:4}}>{dice.pitcherStatKey?.toUpperCase()} {dice.pitcherStatVal}</div>
                </div>
              </div>
              {/* Explicit arithmetic */}
              <div style={{borderTop:"1px solid #1e293b",paddingTop:10,textAlign:"center",marginBottom:dice.modifier?8:0}}>
                <div style={{fontSize:13,color:"#64748b",fontFamily:"monospace"}}>
                  <span style={{color:battingC,fontWeight:700}}>{dice.batterRoll}</span>
                  <span style={{color:"#475569"}}> (bat) - </span>
                  <span style={{color:pitchingC,fontWeight:700}}>{dice.pitcherRoll}</span>
                  <span style={{color:"#475569"}}> (pitch) </span>
                  <span style={{color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#475569",fontWeight:700}}>
                    {dice.luckMod>=0?"+ ":"- "}{Math.abs(dice.luckMod)}
                  </span>
                  <span style={{color:"#475569"}}> (luck) = </span>
                  <span style={{fontWeight:900,fontSize:16,color:dice.net>0?"#34d399":dice.net<0?"#f87171":"#94a3b8"}}>{dice.net>0?`+${dice.net}`:dice.net}</span>
                </div>
              </div>
              {/* Post-roll modifier note — shown only when a modifier fired */}
              {dice.modifier&&(
                <div style={{background:"#111827",borderRadius:6,padding:"6px 10px",fontSize:11,color:"#f59e0b",borderLeft:"3px solid #f59e0b",marginTop:6}}>
                  {dice.modifier}
                </div>
              )}
              {dice.pitchGuess&&(
                <div style={{marginTop:6}}>
                  {dice.guessCorrect
                    ? <div style={{fontSize:10,color:"#34d399",background:"#052e16",borderRadius:5,padding:"3px 8px",display:"inline-block"}}>✅ Guessed {PITCH_TYPES.find(p=>p.id===dice.pitchGuess)?.label} — correct! +8</div>
                    : <div style={{fontSize:10,color:"#f87171",background:"#1c0505",borderRadius:5,padding:"3px 8px",display:"inline-block"}}>❌ Guessed {PITCH_TYPES.find(p=>p.id===dice.pitchGuess)?.label} — wrong. -5</div>
                  }
                </div>
              )}
              {(dice.streakBonus!==0||dice.situationBonus>0)&&(
                <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                  {dice.streakBonus!==0&&(
                    <div style={{fontSize:10,color:dice.streakBonus>0?"#f59e0b":"#60a5fa",background:"#111827",borderRadius:5,padding:"3px 8px"}}>
                      {dice.streakBonus>0?`🔥 Hot streak +${dice.streakBonus}`:`❄️ Cold streak ${dice.streakBonus}`}
                    </div>
                  )}
                  {dice.situationBonus>0&&(
                    <div style={{fontSize:10,color:dice.clutch?"#f59e0b":"#e63946",background:"#111827",borderRadius:5,padding:"3px 8px"}}>
                      {dice.clutch?"⚡ Clutch +5":"🔥 Comeback +5"}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div style={{background:"#1e293b",borderRadius:8,padding:"8px 12px"}}><div style={lbl}>Pitch</div><div style={{fontWeight:700,fontSize:13}}>{pitchLabel}</div></div>
            <div style={{background:"#1e293b",borderRadius:8,padding:"8px 12px"}}><div style={lbl}>Swing</div><div style={{fontWeight:700,fontSize:13}}>{swingLabel}</div></div>
          </div>
          <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",marginBottom:10,maxHeight:72,overflowY:"auto"}} ref={logRef}>
            {g.gameLog.slice(-5).map((l,i)=><div key={i} style={{fontSize:11,color:l.startsWith("---")?"#3b82f6":l.includes("HOME RUN")?"#f59e0b":"#94a3b8",marginBottom:2}}>{l}</div>)}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button style={{...btn(playerTeamColor.primary),flex:1}} onClick={()=>setG(prev=>({...prev,phase:"pitching",pitchChosen:null,pitchGuess:null}))}>
              Next Pitch ▶{g.mode==="vs-ai"?" (or wait 2.5s)":""}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(g.phase==="between") return <BetweenInning g={g} showBoxScore={showBoxScore} setShowBoxScore={setShowBoxScore} onContinue={continuePlay} />;

  if(g.phase==="walkoff"){
    const [showFull, setShowFull] = useState(false);
    const homeName=g.teams.home;
    const homeColor=g.teamColors.home.primary;
    const lastHit=g.pitchHistory.filter(ph=>["single","double","triple","hr"].includes(ph.result)).slice(-1)[0];
    // Auto-advance to gameover after 4s
    useEffect(()=>{
      const t=setTimeout(()=>setShowFull(true),500);
      return()=>clearTimeout(t);
    },[]);
    return(
      <div style={{...root,justifyContent:"center",background:"#0a0f1a"}}>
        <div style={{textAlign:"center",padding:"0 24px",maxWidth:440}}>
          <div style={{fontSize:64,marginBottom:8,animation:"none"}}>🎉</div>
          <div style={{fontSize:11,color:"#f59e0b",textTransform:"uppercase",letterSpacing:3,fontWeight:800,marginBottom:8}}>Walk-Off!</div>
          <div style={{fontSize:28,fontWeight:900,color:homeColor,marginBottom:6,lineHeight:1.1}}>
            {homeName} Win It!
          </div>
          {lastHit?.batter&&(
            <div style={{fontSize:16,color:"#94a3b8",marginBottom:20}}>
              {lastHit.batter.name} delivers the walk-off {lastHit.result==="hr"?"home run!":lastHit.result+"!"}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            {["away","home"].map(s=>(
              <div key={s} style={{background:"#111827",borderRadius:12,padding:"14px",border:`2px solid ${g.teamColors[s].primary}`}}>
                <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>{g.teams[s]}</div>
                <div style={{fontSize:42,fontWeight:900,color:g.teamColors[s].primary}}>{g.score[s]}</div>
              </div>
            ))}
          </div>
          <button style={btn(homeColor)} onClick={()=>setG(prev=>({...prev,phase:"gameover"}))}>See Full Summary →</button>
        </div>
      </div>
    );
  }


  // ── PLAYOFF: SETUP WIZARD ─────────────────────────────────────────────────
  if(g.phase==="playoff_setup"){
    const ps = playoffSetup;
    if(!ps) return null;
    const{step,bracketSize,seriesLen,innings,teams}=ps;
    const setBracketSize=v=>setPlayoffSetup(p=>({...p,bracketSize:v,
      teams:Array.from({length:v},(_,i)=>p.teams[i]||{name:TEAM_NAMES[i]||`Team ${i+1}`,colorIdx:i%10,isHuman:i===0})}));

    return(
      <div style={root}>
        <div style={{...card,maxWidth:500,margin:"30px auto 0"}}>
          <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>🏆 Playoff Setup</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Step {step} of 3</div>

          {/* Progress bar */}
          <div style={{height:4,background:"#1e293b",borderRadius:2,marginBottom:20,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(step/3)*100}%`,background:"linear-gradient(90deg,#E63946,#f59e0b)",borderRadius:2,transition:"width 0.3s"}}/>
          </div>

          {step===1&&(
            <div>
              <div style={lbl}>Bracket Size</div>
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {[4,8].map(n=>(
                  <button key={n} onClick={()=>setBracketSize(n)}
                    style={{flex:1,background:bracketSize===n?"#E63946":"#1e293b",border:`2px solid ${bracketSize===n?"#E63946":"#334155"}`,color:"#fff",borderRadius:10,padding:"16px 0",fontWeight:800,fontSize:22,cursor:"pointer"}}>
                    {n}
                    <div style={{fontSize:11,fontWeight:400,color:bracketSize===n?"#fca5a5":"#64748b",marginTop:4}}>{n===4?"Semi + Final":"Full Bracket"}</div>
                  </button>
                ))}
              </div>
              <div style={lbl}>Games per Series</div>
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {[1,3,5,7].map(n=>(
                  <button key={n} onClick={()=>setPlayoffSetup(p=>({...p,seriesLen:n}))}
                    style={{flex:1,background:seriesLen===n?"#f59e0b33":"#1e293b",border:`2px solid ${seriesLen===n?"#f59e0b":"#334155"}`,color:seriesLen===n?"#f59e0b":"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                    {n===1?"1":"Best of "+n}
                  </button>
                ))}
              </div>
              <div style={lbl}>Innings per Game</div>
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {[3,5,7,9].map(n=>(
                  <button key={n} onClick={()=>setPlayoffSetup(p=>({...p,innings:n}))}
                    style={{flex:1,background:innings===n?"#3b82f633":"#1e293b",border:`2px solid ${innings===n?"#3b82f6":"#334155"}`,color:innings===n?"#60a5fa":"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                    {n}
                    <div style={{fontSize:9,color:"#475569",marginTop:2}}>{n<=3?"~5min":n<=5?"~8min":n<=7?"~12min":"~15min"}</div>
                  </button>
                ))}
              </div>
              <button style={btn("#E63946")} onClick={()=>setPlayoffSetup(p=>({...p,step:2}))}>
                Next: Set Up Teams →
              </button>
            </div>
          )}

          {step===2&&(
            <div>
              <div style={lbl}>Teams ({bracketSize} total) — tap to toggle Human / AI</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {teams.map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#0f172a",borderRadius:10,padding:"10px 12px",border:`1px solid ${t.isHuman?"#3b82f6":"#334155"}`}}>
                    {/* Seed */}
                    <div style={{width:24,height:24,borderRadius:"50%",background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#64748b",flexShrink:0}}>
                      {i+1}
                    </div>
                    {/* Color swatch */}
                    <div onClick={()=>setPlayoffSetup(p=>({...p,teams:p.teams.map((t2,j)=>j===i?{...t2,colorIdx:(t2.colorIdx+1)%10}:t2)}))}
                      style={{width:22,height:22,borderRadius:"50%",background:TEAM_PALETTE[t.colorIdx].primary,cursor:"pointer",flexShrink:0,border:"2px solid rgba(255,255,255,0.2)"}}/>
                    {/* Name input */}
                    <div style={{position:"relative",flex:1}}>
                      <select value={t.name}
                        onChange={e=>setPlayoffSetup(p=>({...p,teams:p.teams.map((t2,j)=>j===i?{...t2,name:e.target.value}:t2)}))}
                        style={{width:"100%",background:"transparent",border:"none",color:"#f8fafc",fontSize:14,fontWeight:700,outline:"none",cursor:"pointer",appearance:"none",paddingRight:16}}>
                        {TEAM_NAMES.map(n=><option key={n} value={n} style={{background:"#1e293b"}}>{n}</option>)}
                      </select>
                      <div style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",color:"#475569",pointerEvents:"none",fontSize:10}}>▾</div>
                    </div>
                    {/* Human/AI toggle */}
                    <button onClick={()=>setPlayoffSetup(p=>({...p,teams:p.teams.map((t2,j)=>j===i?{...t2,isHuman:!t2.isHuman}:t2)}))}
                      style={{background:t.isHuman?"#1e3a5f":"#1e293b",border:`1px solid ${t.isHuman?"#3b82f6":"#334155"}`,color:t.isHuman?"#60a5fa":"#475569",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                      {t.isHuman?"👤 Human":"🤖 AI"}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"#475569",marginBottom:16}}>
                💡 Tap a team's color dot to cycle colors. Click the name to rename. Human teams draft manually; AI teams auto-draft.
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{...btn("#475569"),flex:1}} onClick={()=>setPlayoffSetup(p=>({...p,step:1}))}>← Back</button>
                <button style={{...btn("#E63946"),flex:2}} onClick={()=>setPlayoffSetup(p=>({...p,step:3,currentDraftTeam:0,draftedTeams:[]}))}>
                  Next: Draft Teams →
                </button>
              </div>
            </div>
          )}

          {step===3&&(()=>{
            const humanTeams = teams.map((t,i)=>({...t,i})).filter(t=>t.isHuman);
            const{currentDraftTeam=0, draftedTeams=[]}=ps;
            const done = currentDraftTeam >= humanTeams.length;
            if(done){
              return(
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:32,marginBottom:12}}>✅</div>
                  <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>All teams drafted!</div>
                  <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>AI teams will auto-draft when their games are simmed.</div>
                  <button style={btn("#E63946")} onClick={()=>{
                    // Build final team objects with rosters
                    const finalTeams = teams.map((t,i)=>{
                      const drafted = draftedTeams.find(d=>d.teamIdx===i);
                      if(drafted) return{...t,roster:drafted.roster,lineup:drafted.lineup};
                      // AI teams get empty rosters (will be auto-drafted before sim)
                      return{...t,roster:{batters:[],pitchers:[]},lineup:{away:[],home:[]}};
                    });
                    // Pre-build all AI rosters from one shared pool to prevent duplication
                    const masterPool=buildDraftPool();
                    const globalTaken=new Set();
                    // Human teams: mark their drafted players as taken
                    finalTeams.forEach(t=>{
                      if(t.roster?.batters?.length){
                        [...t.roster.batters,...t.roster.pitchers].forEach(p=>globalTaken.add(p.id));
                      }
                    });
                    // Build AI rosters sequentially from same pool
                    const teamsWithRosters=finalTeams.map(t=>{
                      if(t.roster?.batters?.length>=FULL_BATTERS) return t; // human team already has roster
                      const aiRos=buildAIRoster(masterPool,[...globalTaken]);
                      [...aiRos.batters,...aiRos.pitchers].forEach(p=>globalTaken.add(p.id));
                      return{...t,roster:aiRos};
                    });
                    const po = initPlayoff(teamsWithRosters,bracketSize,seriesLen,innings,humanTeams.map(h=>h.i));
                    setPlayoff(po);
                    setG(initGame());
                    setG(prev=>({...prev,phase:"playoff_hub"}));
                  }}>
                    🏆 Start the Playoffs!
                  </button>
                </div>
              );
            }
            const teamToDraft = humanTeams[currentDraftTeam];
            // Check if we're in active draft
            if(g.phase==="draft"||g.phase==="lineup_setup"){
              return(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>
                    Drafting for <span style={{color:TEAM_PALETTE[teamToDraft.colorIdx].primary,fontWeight:700}}>{teamToDraft.name}</span> ({currentDraftTeam+1}/{humanTeams.length})
                  </div>
                  <div style={{fontSize:11,color:"#475569"}}>Complete the draft below ↓</div>
                </div>
              );
            }
            return(
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>
                  Draft for <span style={{color:TEAM_PALETTE[teamToDraft.colorIdx].primary}}>{teamToDraft.name}</span>
                </div>
                <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>
                  Team {currentDraftTeam+1} of {humanTeams.length}
                </div>
                <button style={btn(TEAM_PALETTE[teamToDraft.colorIdx].primary)} onClick={()=>{
                  // Start draft for this team
                  const pool = buildDraftPool();
                  const firstOptions = buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3,new Set());
                  setG(prev=>({
                    ...prev,
                    teams:{away:teamToDraft.name,home:"Opponent"},
                    playerSide:"away",
                    teamColors:{away:TEAM_PALETTE[teamToDraft.colorIdx],home:TEAM_PALETTE[(teamToDraft.colorIdx+3)%10]},
                    totalInnings:innings,
                    phase:"draft",
                    draftPool:pool,
                    draftPick:0,
                    draftOptions:firstOptions,
                    playerRoster:{batters:[],pitchers:[]},
                    aiRoster:{batters:[],pitchers:[]},
                    lineup:{away:[],home:[]},
                    _playoffDraft:true, // solo draft — all 8 picks belong to player
                  }));
                  setPlayoffSetup(p=>({...p,_draftingFor:teamToDraft.i}));
                }}>
                  Start Draft →
                </button>
              </div>
            );
          })()}
        </div>

        {/* Show active draft UI below setup card */}
        {step===3&&(g.phase==="draft"||g.phase==="lineup_setup")&&(
          <div style={{width:"100%",maxWidth:580,marginTop:16}}>
            {/* Inline draft — we render the draft phase directly */}
            {(()=>{
              // After lineup_setup completes → capture roster
              if(g.phase==="lineup_setup"&&ps._draftingFor!==undefined){
                return null; // handled below
              }
              return null;
            })()}
          </div>
        )}
      </div>
    );
  }

  // Capture completed lineup during playoff draft
  if(g.phase==="lineup_setup"&&playoffSetup?.step===3&&playoffSetup?._draftingFor!==undefined){
    // We need to intercept confirmPlayerLineup to save the roster
    // This is handled by the existing lineup_setup phase render + a post-confirm hook
  }

  // ── PLAYOFF: HUB ──────────────────────────────────────────────────────────
  if(g.phase==="playoff_hub"&&playoff){
    const po = playoff;
    const roundMatchups = po.matchups.filter(m=>m.round===po.round);
    const TCOL={S:"#f59e0b",A:"#60a5fa",B:"#34d399",C:"#94a3b8"};

    // Compute cumulative stats across all games
    // Build player → team lookup from all rosters
    const playerTeamMap = {};
    po.teams.forEach(t=>{
      (t.roster?.batters||[]).concat(t.roster?.pitchers||[]).forEach(p=>{
        playerTeamMap[p.id]=t.name;
      });
    });
    // Accumulate stats from game.stats objects (pre-computed at game end)
    const cumStats = {};
    po.matchups.forEach(m=>{
      m.games.forEach(game=>{
        if(!game.stats||Object.keys(game.stats).length===0) return;
        Object.entries(game.stats).forEach(([id,s])=>{
          if(!cumStats[id]) cumStats[id]={name:s.name,team:playerTeamMap[id]||"?",H:0,AB:0,R:0,RBI:0,HR:0,BB:0};
          cumStats[id].H+=s.H||0;
          cumStats[id].AB+=s.AB||0;
          cumStats[id].R+=s.R||0;
          cumStats[id].RBI+=s.RBI||0;
          cumStats[id].HR+=s.HR||0;
          cumStats[id].BB+=s.BB||0;
        });
      });
    });
    const statsList = Object.values(cumStats)
      .filter(s=>playoffStatsTeam==="all"||s.team===playoffStatsTeam)
      .sort((a,b)=>{
        if(playoffStatsSort==="AVG"){
          const aAvg=a.AB>0?a.H/a.AB:0, bAvg=b.AB>0?b.H/b.AB:0;
          return bAvg-aAvg;
        }
        return (b[playoffStatsSort]||0)-(a[playoffStatsSort]||0);
      });

    const isChampion = po.phase==="champion";
    const champion = isChampion ? po.teams[po.matchups.find(m=>m.round===po.totalRounds)?.winner] : null;

    return(
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"14px 16px 0",boxSizing:"border-box"}}>

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontWeight:900,fontSize:20}}>🏆 Playoffs</div>
              <div style={{fontSize:12,color:"#64748b"}}>Round {po.round} of {po.totalRounds}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {saveStatus&&(
                <div style={{fontSize:10,color:saveStatus==="saved"?"#34d399":saveStatus==="saving"?"#f59e0b":"#f87171",fontWeight:700}}>
                  {saveStatus==="saving"?"💾 Saving…":saveStatus==="saved"?"✓ Saved":"⚠ Save failed"}
                </div>
              )}
              {confirmExit?(
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#94a3b8"}}>Exit?</span>
                  <button onClick={()=>{setConfirmExit(false);setG(prev=>({...prev,phase:"menu"}));}}
                    style={{background:"#E63946",border:"none",color:"#fff",borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Yes</button>
                  <button onClick={()=>setConfirmExit(false)}
                    style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>No</button>
                </div>
              ):(
                <button onClick={()=>setConfirmExit(true)}
                  style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  ✕ Exit
                </button>
              )}
            </div>
          </div>

          {/* Champion banner */}
          {isChampion&&champion&&(
            <div style={{background:"linear-gradient(135deg,#92400e,#d97706,#92400e)",borderRadius:12,padding:"16px",textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:36,marginBottom:4}}>🏆</div>
              <div style={{fontSize:22,fontWeight:900,color:"#fef3c7"}}>{champion.name}</div>
              <div style={{fontSize:13,color:"#fcd34d"}}>Playoff Champions!</div>
            </div>
          )}

          {/* Tab nav */}
          <div style={{display:"flex",gap:4,marginBottom:14,background:"#0f172a",borderRadius:10,padding:4}}>
            {[["scoreboard","📅 Scoreboard"],["bracket","🏆 Bracket"],["stats","📊 Stats"]].map(([id,label])=>(
              <button key={id} onClick={()=>setPlayoffHubTab(id)}
                style={{flex:1,background:playoffHubTab===id?"#1e293b":"transparent",border:"none",color:playoffHubTab===id?"#f8fafc":"#475569",borderRadius:7,padding:"8px 4px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {label}
              </button>
            ))}
          </div>

          {/* SCOREBOARD TAB */}
          {playoffHubTab==="scoreboard"&&(
            <div>
              {roundMatchups.map(m=>{
                const away = po.teams[m.awayIdx];
                const home = po.teams[m.homeIdx];
                const awayC = TEAM_PALETTE[away?.colorIdx||0].primary;
                const homeC = TEAM_PALETTE[home?.colorIdx||0].primary;
                const needsWins = Math.ceil(m.seriesLen/2);
                const isComplete = m.status==="complete";
                const winnerTeam = isComplete ? po.teams[m.winner] : null;
                const allAI = !away?.isHuman && !home?.isHuman;
                return(
                  <div key={m.id} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:14,marginBottom:10}}>
                    {/* Series header */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>
                        {m.seriesLen===1?"Elimination":"Best of "+m.seriesLen} · Round {m.round}
                      </div>
                      {isComplete&&<div style={{fontSize:10,fontWeight:700,color:"#34d399"}}>✓ Complete</div>}
                      {!isComplete&&allAI&&<div style={{fontSize:10,color:"#f59e0b"}}>🤖 AI vs AI</div>}
                    </div>
                    {/* Teams + score */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{textAlign:"left"}}>
                        <div style={{fontSize:13,fontWeight:800,color:awayC}}>{away?.name}</div>
                        <div style={{fontSize:11,color:"#475569"}}>{away?.isHuman?"👤":"🤖"} {m.seriesLen>1?`${m.awayWins} win${m.awayWins!==1?"s":""}`:""}</div>
                      </div>
                      <div style={{textAlign:"center",fontSize:12,color:"#475569",fontWeight:700}}>vs</div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:13,fontWeight:800,color:homeC}}>{home?.name}</div>
                        <div style={{fontSize:11,color:"#475569"}}>{home?.isHuman?"👤":"🤖"} {m.seriesLen>1?`${m.homeWins} win${m.homeWins!==1?"s":""}`:""}</div>
                      </div>
                    </div>
                    {/* Individual game scores */}
                    {m.games.length>0&&(
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                        {m.games.map((g2,gi)=>(
                          <div key={gi} style={{background:"#0f172a",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#94a3b8"}}>
                            G{gi+1}: <span style={{color:g2.awayScore>g2.homeScore?awayC:"#94a3b8"}}>{g2.awayScore}</span>–<span style={{color:g2.homeScore>g2.awayScore?homeC:"#94a3b8"}}>{g2.homeScore}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Action buttons */}
                    {!isComplete&&(
                      <div style={{display:"flex",gap:8}}>
                        {allAI?(
                          <button onClick={()=>{
                            // Sim one game — build rosters from shared pool to avoid duplicates
                            const sharedPool=buildDraftPool();
                            let awayRoster = (away.roster?.batters?.length>=FULL_BATTERS)?away.roster:buildAIRoster(sharedPool,[]);
                            const awayTaken=awayRoster.batters.concat(awayRoster.pitchers).map(p=>p.id);
                            let homeRoster = (home.roster?.batters?.length>=FULL_BATTERS)?home.roster:buildAIRoster(sharedPool,awayTaken);
                            const{awayScore,homeScore}=simGame(awayRoster,homeRoster,m.innings);
                            // Generate plausible per-player stats for both teams
                            const awayStats=simGameStats(awayRoster,awayScore,m.innings);
                            const homeStats=simGameStats(homeRoster,homeScore,m.innings);
                            const allStats={...awayStats,...homeStats};
                            // Save rosters back if they were just built
                            setPlayoff(prev=>{
                              const matchups=[...prev.matchups];
                              const mi=matchups.findIndex(x=>x.id===m.id);
                              const updated={...matchups[mi]};
                              // Also persist rosters if they were empty before
                              const newTeams=[...prev.teams];
                              if(!prev.teams[m.awayIdx]?.roster?.batters?.length) newTeams[m.awayIdx]={...prev.teams[m.awayIdx],roster:awayRoster};
                              if(!prev.teams[m.homeIdx]?.roster?.batters?.length) newTeams[m.homeIdx]={...prev.teams[m.homeIdx],roster:homeRoster};
                              const newGame={awayScore,homeScore,simmed:true,stats:allStats};
                              updated.games=[...updated.games,newGame];
                              if(homeScore>awayScore) updated.homeWins++;
                              else updated.awayWins++;
                              const needsW=Math.ceil(updated.seriesLen/2);
                              if(updated.awayWins>=needsW){updated.winner=updated.awayIdx;updated.status="complete";}
                              else if(updated.homeWins>=needsW){updated.winner=updated.homeIdx;updated.status="complete";}
                              matchups[mi]=updated;
                              const next={...prev,teams:newTeams,matchups,simLog:[...prev.simLog,`${away.name} ${awayScore}–${homeScore} ${home.name} (simmed)`]};
                              return advanceBracket(next);
                            });
                          }}
                            style={{flex:1,background:"#1e3a5f",border:"1px solid #3b82f6",color:"#60a5fa",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                            ▶ Sim Game {m.games.length+1}
                          </button>
                        ):(
                          <button onClick={()=>{
                            const humanIsAway = away?.isHuman;
                            const humanTeamData = humanIsAway ? away : home;
                            const aiTeamData   = humanIsAway ? home : away;
                            const playerSide   = humanIsAway ? "away" : "home";

                            // Build rosters from shared pool to avoid duplicates
                            const sharedPool2=buildDraftPool();
                            const humanIds=(humanTeamData.roster?.batters||[]).concat(humanTeamData.roster?.pitchers||[]).map(p=>p.id);
                            let aiRoster=(aiTeamData.roster?.batters?.length>=FULL_BATTERS)?aiTeamData.roster:buildAIRoster(sharedPool2,humanIds);
                            let humanRoster=(humanTeamData.roster?.batters?.length>=FULL_BATTERS)?humanTeamData.roster:buildAIRoster(sharedPool2,aiRoster.batters.concat(aiRoster.pitchers).map(p=>p.id));

                            // Launch game — single setG call, no setPlayoff to avoid re-render conflict
                            setG(prev=>({
                              ...prev,
                              mode:"vs-ai",
                              phase:"lineup_setup",
                              teams:{away:away.name,home:home.name},
                              playerSide,
                              teamColors:{away:TEAM_PALETTE[away.colorIdx||0],home:TEAM_PALETTE[home.colorIdx||0]},
                              totalInnings:m.innings,
                              playerRoster:humanRoster,
                              aiRoster,
                              lineup:{away:[],home:[]},
                              score:{away:0,home:0},
                              inning:1,topBottom:"top",outs:0,count:{balls:0,strikes:0},
                              bases:[false,false,false],
                              pitchHistory:[],gameLog:[`⚾ ${away.name} vs ${home.name}`,`--- Inning 1 (Top) ---`],
                              activePitcherIdx:{away:0,home:0},
                              pitcherBF:{away:0,home:0},
                              usedPitchers:{away:[],home:[]},
                              batterIndex:{away:0,home:0},
                              isWalkoff:false,
                              _playoffMatchupId:m.id,
                              _playoffHumanIsAway:humanIsAway,
                            }));
                          }}
                            style={{flex:1,...btn(TEAM_PALETTE[away?.isHuman?away.colorIdx||0:home.colorIdx||0].primary)}}>
                            ▶ Play Game {m.games.length+1}
                          </button>
                        )}
                      </div>
                    )}
                    {isComplete&&(
                      <div style={{textAlign:"center",fontSize:12,color:"#34d399",fontWeight:700}}>
                        🏆 {winnerTeam?.name} advance
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* BRACKET TAB */}
          {playoffHubTab==="bracket"&&(
            <div>
              {Array.from({length:po.totalRounds}).map((_,ri)=>{
                const rNum=ri+1;
                const rMatches=po.matchups.filter(m=>m.round===rNum);
                const roundLabel=rNum===po.totalRounds?"Championship":rNum===po.totalRounds-1?"Semifinals":`Round ${rNum}`;
                return(
                  <div key={rNum} style={{marginBottom:16}}>
                    <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{roundLabel}</div>
                    {rMatches.map(m=>{
                      const away=po.teams[m.awayIdx];
                      const home=po.teams[m.homeIdx];
                      const winnerTeam=m.winner!=null?po.teams[m.winner]:null;
                      return(
                        <div key={m.id} style={{background:"#0f172a",borderRadius:10,padding:"10px 12px",marginBottom:6,border:"1px solid #1e293b"}}>
                          {[away,home].map((t,ti)=>{
                            const isWinner=m.winner!=null&&(ti===0?m.winner===m.awayIdx:m.winner===m.homeIdx);
                            const isLoser=m.winner!=null&&!isWinner;
                            const wins=ti===0?m.awayWins:m.homeWins;
                            const col=t?TEAM_PALETTE[t.colorIdx||0].primary:"#475569";
                            return(
                              <div key={ti} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                                opacity:isLoser?0.4:1,padding:"3px 0",
                                borderBottom:ti===0?"1px solid #1e293b":"none"}}>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>
                                  <span style={{fontSize:13,fontWeight:isWinner?800:400,color:isWinner?"#f8fafc":"#94a3b8"}}>
                                    {t?.name||"TBD"}
                                  </span>
                                  {t?.isHuman&&<span style={{fontSize:9,color:"#3b82f6"}}>👤</span>}
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  {m.seriesLen>1&&<span style={{fontSize:12,color:col,fontWeight:700}}>{wins}W</span>}
                                  {isWinner&&<span style={{fontSize:12}}>🏆</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* STATS TAB */}
          {playoffHubTab==="stats"&&(
            <div>
              {/* Team filter */}
              <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                <button onClick={()=>setPlayoffStatsTeam("all")}
                  style={{background:playoffStatsTeam==="all"?"#3b82f633":"#1e293b",
                    border:`1px solid ${playoffStatsTeam==="all"?"#3b82f6":"#334155"}`,
                    color:playoffStatsTeam==="all"?"#60a5fa":"#64748b",
                    borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  All Teams
                </button>
                {po.teams.map((t,i)=>{
                  const col=TEAM_PALETTE[t.colorIdx||0].primary;
                  const active=playoffStatsTeam===t.name;
                  return(
                    <button key={i} onClick={()=>setPlayoffStatsTeam(active?"all":t.name)}
                      style={{background:active?col+"33":"#1e293b",
                        border:`1px solid ${active?col:"#334155"}`,
                        color:active?col:"#64748b",
                        borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",
                        display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0}}/>
                      {t.name}
                    </button>
                  );
                })}
              </div>
              {/* Stat sort */}
              <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
                {["H","AB","R","RBI","HR","BB","AVG"].map(s=>(
                  <button key={s} onClick={()=>setPlayoffStatsSort(s)}
                    style={{background:playoffStatsSort===s?"#f59e0b33":"#1e293b",
                      border:`1px solid ${playoffStatsSort===s?"#f59e0b":"#334155"}`,
                      color:playoffStatsSort===s?"#f59e0b":"#94a3b8",
                      borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    {s}
                  </button>
                ))}
              </div>
              {statsList.length===0&&(
                <div style={{color:"#475569",textAlign:"center",padding:"20px 0",fontSize:13}}>
                  Stats will appear here after games are played
                </div>
              )}
              <div style={{background:"#0f172a",borderRadius:10,overflow:"hidden"}}>
                {/* Header */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 32px 32px 32px 32px 32px 32px 44px",gap:"0 2px",padding:"6px 8px",borderBottom:"1px solid #1e293b",fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:0.5}}>
                  <div>Player</div>
                  <div style={{textAlign:"center"}}>AB</div>
                  <div style={{textAlign:"center"}}>H</div>
                  <div style={{textAlign:"center"}}>R</div>
                  <div style={{textAlign:"center"}}>RBI</div>
                  <div style={{textAlign:"center"}}>HR</div>
                  <div style={{textAlign:"center"}}>BB</div>
                  <div style={{textAlign:"center"}}>AVG</div>
                </div>
                {statsList.slice(0,15).map((s,i)=>{
                  const avg=s.AB>0?(s.H/s.AB).toFixed(3).replace(/^0/,""):".000";
                  const isTop=i===0;
                  return(
                    <div key={s.name} style={{display:"grid",gridTemplateColumns:"1fr 32px 32px 32px 32px 32px 32px 44px",gap:"0 2px",padding:"5px 8px",borderBottom:"1px solid #0f172a",background:isTop?"#0f2744":"transparent",alignItems:"center"}}>
                      <div style={{overflow:"hidden",minWidth:0}}>
                        <div style={{fontWeight:isTop?700:400,color:isTop?"#f8fafc":"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:10}}>{s.name}</div>
                        {playoffStatsTeam==="all"&&s.team&&s.team!=="?"&&(
                          <div style={{fontSize:8,color:TEAM_PALETTE[po.teams.find(t=>t.name===s.team)?.colorIdx||0]?.primary||"#475569",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.team}</div>
                        )}
                      </div>
                      <div style={{textAlign:"center",color:"#94a3b8",fontSize:11}}>{s.AB}</div>
                      <div style={{textAlign:"center",color:s.H>0?"#60a5fa":"#64748b",fontWeight:s.H>0?700:400,fontSize:11}}>{s.H}</div>
                      <div style={{textAlign:"center",color:s.R>0?"#34d399":"#64748b",fontSize:11}}>{s.R}</div>
                      <div style={{textAlign:"center",color:s.RBI>0?"#f59e0b":"#64748b",fontWeight:s.RBI>0?700:400,fontSize:11}}>{s.RBI}</div>
                      <div style={{textAlign:"center",color:s.HR>0?"#f59e0b":"#64748b",fontWeight:s.HR>0?800:400,fontSize:11}}>{s.HR}</div>
                      <div style={{textAlign:"center",color:"#64748b",fontSize:11}}>{s.BB}</div>
                      <div style={{textAlign:"center",color:s.AB>0?"#e2e8f0":"#64748b",fontWeight:700}}>{avg}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom padding */}
          <div style={{height:20}}/>
        </div>
      </div>
    );
  }


  // ── ONLINE FLOW ───────────────────────────────────────────────────────────
  // Step 1: Lobby (create/join room)
  // Step 2: Each side drafts LOCALLY and INDEPENDENTLY
  // Step 3: Each side saves finished roster to Supabase when done
  // Step 4: Both sides poll until opponent's roster appears, then start game
  // Step 5: Gameplay syncs via _turn field

  // ── ONLINE: WAITING SCREENS ───────────────────────────────────────────────
  if(g.phase==="online_wait"){
    const waiting = onlineState==="away_wait_home_draft"
      ? "Waiting for opponent to finish their draft…"
      : onlineState==="home_wait_away_draft"
      ? "Waiting for host to finish their draft…"
      : "Waiting for opponent to join…";
    return(
      <div style={root}>
        <div style={{...card,maxWidth:380,margin:"80px auto 0",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>⏳</div>
          <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{waiting}</div>
          {g._onlineCode&&(
            <div style={{background:"#0f172a",borderRadius:10,padding:"14px",
              fontSize:32,fontWeight:900,letterSpacing:8,color:"#f59e0b",
              marginBottom:12,fontFamily:"monospace"}}>{g._onlineCode}</div>
          )}
          <div style={{fontSize:12,color:"#475569",marginBottom:16}}>Room code: <b>{g._onlineCode||roomCode}</b></div>
          <button style={btn("#475569")} onClick={()=>{
            setOnlineState("idle");setG(prev=>({...prev,phase:"menu"}));
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── ONLINE: LOBBY ─────────────────────────────────────────────────────────
  if(g.phase==="online_lobby"){
    return(
      <div style={root}>
        <div style={{...card,maxWidth:420,margin:"60px auto 0",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>🌐</div>
          <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>Play Online</div>

          {onlineState==="idle"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:13,color:"#64748b",marginBottom:8}}>Challenge a friend on another device</div>

              <div style={{textAlign:"left",marginBottom:4}}>
                <div style={lbl}>Innings</div>
                <div style={{display:"flex",gap:6}}>
                  {[3,5,7,9].map(n=>(
                    <button key={n} onClick={()=>setInningChoice(n)}
                      style={{flex:1,background:inningChoice===n?"#E63946":"#1e293b",
                        border:`2px solid ${inningChoice===n?"#E63946":"#334155"}`,
                        color:"#fff",borderRadius:6,padding:"6px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button style={btn("#E63946")} onClick={async()=>{
                setOnlineError("");
                setOnlineState("creating");
                const code=generateRoomCode();
                setRoomCode(code);
                setOnlineSide("away");
                // Write room skeleton — no shared game state yet
                await supa.upsertRoom(code,{
                  status:"waiting",
                  innings:inningChoice,
                  awayRoster:null,
                  homeRoster:null,
                  awayLineup:null,
                  homeLineup:null,
                });
                // Show code first — user taps "Start Draft" to continue
                setOnlineState("show_code");
              }}>🏠 Create Room & Draft</button>

              <div style={{fontSize:13,color:"#475569"}}>— or join a room —</div>

              <div style={{display:"flex",gap:8}}>
                <input value={roomInput}
                  onChange={e=>setRoomInput(e.target.value.toUpperCase())}
                  placeholder="Room code"
                  maxLength={5}
                  style={{flex:1,background:"#0f172a",border:"1px solid #334155",
                    color:"#f8fafc",borderRadius:8,padding:"10px 12px",
                    fontSize:16,fontWeight:800,textAlign:"center",letterSpacing:4,outline:"none"}}/>
                <button style={{...btn("#3b82f6"),width:"auto",padding:"10px 16px"}}
                  onClick={async()=>{
                    if(roomInput.length<3){setOnlineError("Enter a valid code");return;}
                    setOnlineError("");
                    setOnlineState("joining");
                    const row=await supa.getRoom(roomInput);
                    if(!row){setOnlineError("Room not found");setOnlineState("idle");return;}
                    if(row.status!=="waiting"&&row.status!=="home_joined"){
                      setOnlineError("Room not available");setOnlineState("idle");return;
                    }
                    setRoomCode(roomInput);
                    setOnlineSide("home");
                    // Signal host that home has joined
                    await supa.upsertRoom(roomInput,{...row,status:"home_joined"});
                    // Home drafts independently with their own fresh pool
                    // Use a different seed/shuffle so rosters differ
                    const pool=buildDraftPool();
                    const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3,new Set());
                    setG({
                      ...initGame(),
                      mode:"online",
                      phase:"draft",
                      _playoffDraft:true, // solo draft — no AI picks
                      playerSide:"home",
                      _turn:"home",
                      _onlineCode:roomInput,
                      draftPool:pool,
                      draftPick:0,
                      draftOptions:firstOptions,
                      playerRoster:{batters:[],pitchers:[]},
                      aiRoster:{batters:[],pitchers:[]},
                      lineup:{away:[],home:[]},
                      teams:{away:"Away",home:"Home"},
                      teamColors:{away:TEAM_PALETTE[0],home:TEAM_PALETTE[1]},
                      totalInnings:row.innings||3,
                    });
                    setOnlineState("home_draft");
                  }}>Join</button>
              </div>
              {onlineError&&<div style={{fontSize:12,color:"#f87171",marginTop:4}}>{onlineError}</div>}
            </div>
          )}

          {onlineState==="creating"&&(
            <div style={{color:"#64748b",padding:"20px 0"}}>Creating room…</div>
          )}

          {onlineState==="joining"&&(
            <div style={{color:"#64748b",padding:"20px 0"}}>Joining room…</div>
          )}

          {onlineState==="show_code"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>
                Share this code with your opponent, then start your draft:
              </div>
              <div style={{background:"#0f172a",borderRadius:12,padding:"16px",
                fontSize:36,fontWeight:900,letterSpacing:8,color:"#f59e0b",
                marginBottom:20,fontFamily:"monospace"}}>
                {roomCode}
              </div>
              <div style={{fontSize:11,color:"#475569",marginBottom:16}}>
                Your opponent can join while you draft — both drafts happen independently
              </div>
              <button style={btn("#E63946")} onClick={()=>{
                const pool=buildDraftPool();
                const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3,new Set());
                setG({
                  ...initGame(),
                  mode:"online",
                  phase:"draft",
                  _playoffDraft:true,
                  playerSide:"away",
                  _turn:"away",
                  _onlineCode:roomCode,
                  draftPool:pool,
                  draftPick:0,
                  draftOptions:firstOptions,
                  playerRoster:{batters:[],pitchers:[]},
                  aiRoster:{batters:[],pitchers:[]},
                  lineup:{away:[],home:[]},
                  teams:{away:"Away",home:"Home"},
                  teamColors:{away:TEAM_PALETTE[0],home:TEAM_PALETTE[1]},
                  totalInnings:inningChoice,
                });
                setOnlineState("away_draft");
              }}>Start My Draft →</button>
            </div>
          )}

          <button style={{...btn("#475569"),marginTop:16,fontSize:12}}
            onClick={()=>setG(prev=>({...prev,phase:"menu"}))}>
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }


  if(g.phase==="gameover"){
    // No ties — one team always wins (extra innings ensure this)
    const winner=g.score.away>g.score.home?g.teams.away:g.teams.home;
    const winSide=g.score.away>g.score.home?"away":"home";

    // Compute MVP: batter with most total bases (HR=4, 3B=3, 2B=2, 1B=1)
    const tbMap={};
    const rbiMap={};
    for(const ph of g.pitchHistory){
      if(!ph.batter)continue;
      const id=ph.batter.id;
      if(!tbMap[id])tbMap[id]={name:ph.batter.name,tb:0,rbi:0};
      if(ph.result==="hr"){tbMap[id].tb+=4;tbMap[id].rbi+=(ph.runsScored||0);}
      if(ph.result==="triple"){tbMap[id].tb+=3;tbMap[id].rbi+=(ph.runsScored||0);}
      if(ph.result==="double"){tbMap[id].tb+=2;tbMap[id].rbi+=(ph.runsScored||0);}
      if(ph.result==="single"){tbMap[id].tb+=1;tbMap[id].rbi+=(ph.runsScored||0);}
    }
    const mvpEntry=Object.values(tbMap).sort((a,b)=>b.tb-a.tb)[0];

    // Best dice roll moment (highest batter net)
    const bestRoll=g.pitchHistory.filter(ph=>ph.dice?.net!==undefined).sort((a,b)=>(b.dice?.net||0)-(a.dice?.net||0))[0];

    // Headline generator
    const headlines=[
      winner&&`${winner} Claim Victory in ${g.totalInnings||3} Innings`,
      mvpEntry&&`${mvpEntry.name} Leads the Way with ${mvpEntry.tb} Total Bases`,
      bestRoll&&`🎲 Dice MVP: ${bestRoll.batter?.name||"Someone"} Rolled Net +${bestRoll.dice.net}`,
      g.pitchHistory.filter(ph=>ph.result==="hr").length>0&&`🚀 ${g.pitchHistory.filter(ph=>ph.result==="hr").length} Home Run${g.pitchHistory.filter(ph=>ph.result==="hr").length>1?"s":""} Hit Tonight`,
    ].filter(Boolean);

    return(
      <div style={root}>
        <div style={{...card,maxWidth:460,margin:"30px auto 0",textAlign:"center"}}>
          <div style={{background:winSide?`linear-gradient(135deg,${g.teamColors[winSide].primary}33,#111827)`:"#111827",borderRadius:12,padding:"20px 16px 14px",marginBottom:16}}>
            <div style={{fontSize:48,marginBottom:6}}>"🏆"</div>
            <div style={{fontSize:26,fontWeight:900,marginBottom:2,color:winSide?g.teamColors[winSide].primary:"#f8fafc"}}>`${winner} Win!`</div>
          </div>

          {/* Final score */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {["away","home"].map(s=><div key={s} style={{background:"#1e293b",borderRadius:10,padding:12,border:`2px solid ${g.teamColors[s].primary}`}}><div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>{g.teams[s]}</div><div style={{fontSize:40,fontWeight:900,color:g.teamColors[s].primary}}>{g.score[s]}</div></div>)}
          </div>

          {/* Headlines */}
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px",marginBottom:12,textAlign:"left"}}>
            <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Game Summary</div>
            {headlines.map((h,i)=>(
              <div key={i} style={{fontSize:12,color:"#f8fafc",marginBottom:4,paddingBottom:4,borderBottom:i<headlines.length-1?"1px solid #1e293b":"none"}}>{h}</div>
            ))}
          </div>

          {/* MVP card */}
          {mvpEntry&&(
            <div style={{background:"#0f172a",border:"1px solid #f59e0b55",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:28}}>⭐</div>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Player of the Game</div>
                <div style={{fontSize:14,fontWeight:800,color:"#f8fafc"}}>{mvpEntry.name}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{mvpEntry.tb} total bases · {mvpEntry.rbi} RBI</div>
              </div>
            </div>
          )}

          {/* Game log */}
          <div style={{background:"#0f172a",borderRadius:8,padding:8,marginBottom:14,maxHeight:110,overflowY:"auto",textAlign:"left"}} ref={logRef}>
            {g.gameLog.map((l,i)=><div key={i} style={{fontSize:10,color:l.startsWith("---")?"#3b82f6":l.includes("HOME RUN")?"#f59e0b":"#94a3b8",marginBottom:2}}>{l}</div>)}
          </div>
          {g._playoffMatchupId&&playoff?(
            <button style={btn("#f59e0b")} onClick={()=>{
              // Compute per-batter stats from this game before stripping pitchHistory
              const gameStats={};
              (g.pitchHistory||[]).forEach(ph=>{
                if(!ph.batter) return;
                const id=ph.batter.id;
                if(!gameStats[id]) gameStats[id]={name:ph.batter.name,H:0,AB:0,R:0,RBI:0,HR:0,BB:0};
                const r=ph.result;
                if(r==="walk") gameStats[id].BB++;
                else if(r==="strikeout"||r==="out") gameStats[id].AB++;
                else if(["single","double","triple"].includes(r)){gameStats[id].AB++;gameStats[id].H++;gameStats[id].RBI+=(ph.runsScored||0);}
                else if(r==="hr"){gameStats[id].AB++;gameStats[id].H++;gameStats[id].HR++;gameStats[id].R++;gameStats[id].RBI+=(ph.runsScored||0);}
              });
              // Write game result back to playoff bracket
              setPlayoff(prev=>{
                const matchups=[...prev.matchups];
                const mi=matchups.findIndex(x=>x.id===g._playoffMatchupId);
                if(mi<0) return prev;
                const updated={...matchups[mi]};
                const aScore=g.score.away, hScore=g.score.home;
                // Also persist rosters if they were built at game launch
                const newTeams=[...prev.teams];
                const humanSide=g._playoffHumanIsAway?"away":"home";
                const aiSide=g._playoffHumanIsAway?"home":"away";
                const humIdx=g._playoffHumanIsAway?updated.awayIdx:updated.homeIdx;
                const aiIdx=g._playoffHumanIsAway?updated.homeIdx:updated.awayIdx;
                if(g.playerRoster?.batters?.length) newTeams[humIdx]={...newTeams[humIdx],roster:g.playerRoster};
                if(g.aiRoster?.batters?.length)     newTeams[aiIdx] ={...newTeams[aiIdx], roster:g.aiRoster};
                const newGame={awayScore:aScore,homeScore:hScore,simmed:false,stats:gameStats};
                updated.games=[...updated.games,newGame];
                if(aScore>hScore) updated.awayWins++; else updated.homeWins++;
                const needsW=Math.ceil(updated.seriesLen/2);
                if(updated.awayWins>=needsW){updated.winner=updated.awayIdx;updated.status="complete";}
                else if(updated.homeWins>=needsW){updated.winner=updated.homeIdx;updated.status="complete";}
                matchups[mi]=updated;
                return advanceBracket({...prev,matchups,teams:newTeams});
              });
              setG(prev=>({...initGame(),phase:"playoff_hub",_playoffMatchupId:null}));setConfirmExit(false);
            }}>← Back to Playoffs</button>
          ):(
            <button style={btn("#E63946")} onClick={resetGame}>Play Again</button>
          )}
        </div>
      </div>
    );
  }
  return null;
}
