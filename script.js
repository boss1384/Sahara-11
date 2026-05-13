// =========================
// GLOBAL STATE
// =========================
let leagues = {};
let PAGE = "dashboard";
let CURRENT_MATCH = null;

// =========================
// MATCH GENERATOR
// =========================
function gen(teams){

  let arr = [];

  for(let i=0;i<20;i++){

    arr.push({
      id: Math.random(),
      home: teams[Math.floor(Math.random()*teams.length)],
      away: teams[Math.floor(Math.random()*teams.length)],
      score:[0,0],
      status:"LIVE",
      minute:Math.floor(Math.random()*80),
      events:[]
    });

  }

  return arr;
}

// =========================
// LEAGUES DATA
// =========================
leagues = {
  "Premier League": gen(["Man City","Arsenal","Chelsea","Liverpool","Man United"]),
  "Bundesliga": gen(["Bayern","Dortmund","Leipzig","Leverkusen"]),
  "Serie A": gen(["Inter","Milan","Juventus","Napoli"]),
  "Ligue 1": gen(["PSG","Marseille","Lyon","Monaco"])
};

// =========================
// LEAGUE BUTTONS
// =========================
function leagueButtons(){

  return `
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      <button class="tab" onclick="renderDashboard()">🏠 All</button>
      <button class="tab" onclick="filterLeague('Premier League')">EPL</button>
      <button class="tab" onclick="filterLeague('Bundesliga')">Bundesliga</button>
      <button class="tab" onclick="filterLeague('Serie A')">Serie A</button>
      <button class="tab" onclick="filterLeague('Ligue 1')">Ligue 1</button>
    </div>
  `;
}

// =========================
// DASHBOARD
// =========================
function renderDashboard(){

  PAGE = "dashboard";

  let html = `<h2 class="text-green-400">⚽ Live Matches</h2>`;

  html += leagueButtons();

  Object.keys(leagues).forEach(lg=>{

    html += `<h3>${lg}</h3>`;

    leagues[lg].forEach(m=>{

      html += `
        <div class="card" onclick="openMatch('${m.id}','${lg}')">

          <div class="flex justify-between">

            <div>
              <b>${m.home}</b><br>
              <b>${m.away}</b>
            </div>

            <div class="text-right">
              <div class="text-xl">${m.score[0]} - ${m.score[1]}</div>
              <div class="live">LIVE ${m.minute}'</div>
            </div>

          </div>

        </div>
      `;
    });

  });

  document.getElementById("content").innerHTML = html;
}

// =========================
// FILTER LEAGUE
// =========================
function filterLeague(name){

  let html = `<h2 class="text-green-400">${name}</h2>`;

  html += leagueButtons();

  leagues[name].forEach(m=>{

    html += `
      <div class="card" onclick="openMatch('${m.id}','${name}')">

        <div class="flex justify-between">

          <div>
            <b>${m.home}</b><br>
            <b>${m.away}</b>
          </div>

          <div class="text-right">
            <div class="text-xl">${m.score[0]} - ${m.score[1]}</div>
            <div class="live">LIVE ${m.minute}'</div>
          </div>

        </div>

      </div>
    `;
  });

  document.getElementById("content").innerHTML = html;
}

// =========================
// OPEN MATCH
// =========================
function openMatch(id, league){

  CURRENT_MATCH = leagues[league].find(m=>m.id==id);

  renderMatch();

}

// =========================
// MATCH PAGE
// =========================
function renderMatch(){

  let m = CURRENT_MATCH;

  document.getElementById("content").innerHTML = `

    <div class="card">
      <h2 class="text-green-400">${m.home} vs ${m.away}</h2>

      <div class="text-3xl">
        ${m.score[0]} - ${m.score[1]}
      </div>

      <div class="live">
        LIVE ${m.minute}'
      </div>
    </div>

    <div class="flex gap-2">

      <button class="tab" onclick="showStats()">Stats</button>
      <button class="tab" onclick="showEvents()">Events</button>
      <button class="tab" onclick="showLineups()">Lineups</button>

    </div>

    <div id="tab"></div>

    <button class="tab" onclick="renderDashboard()">⬅ Back</button>

  `;
}

// =========================
// STATS
// =========================
function showStats(){

  document.getElementById("tab").innerHTML = `
    <div class="card">
      Shots: ${Math.floor(Math.random()*10)} - ${Math.floor(Math.random()*10)}<br>
      Possession: 55% - 45%<br>
      Fouls: ${Math.floor(Math.random()*10)} - ${Math.floor(Math.random()*10)}
    </div>
  `;
}

// =========================
// EVENTS
// =========================
function showEvents(){

  let m = CURRENT_MATCH;

  let html = `<div class="card"><b>Events</b></div>`;

  (m.events || []).slice().reverse().forEach(e=>{
    html += `<div class="card">${e.min}' - ${e.text}</div>`;
  });

  document.getElementById("tab").innerHTML = html;
}

// =========================
// LINEUPS
// =========================
function showLineups(){

  let m = CURRENT_MATCH;

  document.getElementById("tab").innerHTML = `
    <div class="card">
      ${m.home}: GK - DEF - MID - ATT<br><br>
      ${m.away}: GK - DEF - MID - ATT
    </div>
  `;
}

// =========================
// LIVE ENGINE
// =========================
setInterval(()=>{

  Object.keys(leagues).forEach(lg=>{

    leagues[lg].forEach(m=>{

      if(m.status==="LIVE"){

        m.minute++;

        if(Math.random()>0.97){
          m.score[0]++;
          m.events.push({min:m.minute,text:"⚽ GOAL " + m.home});
        }

        if(Math.random()>0.985){
          m.score[1]++;
          m.events.push({min:m.minute,text:"⚽ GOAL " + m.away});
        }

        if(m.minute>=90){
          m.status="FT";
        }

      }

    });

  });

  if(PAGE==="dashboard"){
    renderDashboard();
  }

},3000);

// =========================
// INIT APP
// =========================
renderDashboard();
