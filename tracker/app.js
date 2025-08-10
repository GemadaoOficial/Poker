/* Poker Tracker Offline
   Todo o estado é salvo em localStorage para funcionar 100% offline. */

// ---------- Persistência ----------
const data = {
  ledger: JSON.parse(localStorage.getItem('ledger') || '[]'),
  tournaments: JSON.parse(localStorage.getItem('tournaments') || '[]'),
  settings: JSON.parse(localStorage.getItem('settings') || '{"brm":100,"theme":"light"}')
};

function saveAll(){
  localStorage.setItem('ledger', JSON.stringify(data.ledger));
  localStorage.setItem('tournaments', JSON.stringify(data.tournaments));
  localStorage.setItem('settings', JSON.stringify(data.settings));
}

// ---------- Utils ----------
function formatMoney(v){return 'R$ '+Number(v).toFixed(2);}
function byId(id){return document.getElementById(id);}

// ---------- Dashboard ----------
function updateDashboard(){
  const totalCost = data.tournaments.reduce((s,t)=>s+t.cost,0);
  const totalProfit = data.tournaments.reduce((s,t)=>s+t.profit,0);
  const ledgerSum = data.ledger.reduce((s,l)=>{
    const sign = (l.type==='deposito'||l.type==='stake'||l.type==='manual')?1:-1;
    return s + sign*Number(l.amount);
  },0);
  const bankroll = ledgerSum + totalProfit;
  const itm = data.tournaments.filter(t=>t.prize>0).length;
  byId('kpiBankroll').textContent = formatMoney(bankroll);
  byId('kpiProfit').textContent = formatMoney(totalProfit);
  byId('kpiROI').textContent = totalCost?((totalProfit/totalCost*100).toFixed(2)+'%'):'0%';
  byId('kpiITM').textContent = data.tournaments.length?((itm/data.tournaments.length*100).toFixed(1)+'%'):'0%';
  byId('kpiABI').textContent = data.settings.brm?formatMoney(bankroll/data.settings.brm):'-';
}

// ---------- Ledger ----------
function renderLedger(){
  const tbody = byId('ledgerTable').querySelector('tbody');
  tbody.innerHTML='';
  data.ledger.forEach(l=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${new Date(l.date).toLocaleDateString()}</td><td>${l.type}</td><td>${formatMoney(l.amount)}</td><td>${l.note||''}</td>`;
    tbody.appendChild(tr);
  });
}
byId('ledgerForm').addEventListener('submit',e=>{
  e.preventDefault();
  const entry={
    date:new Date().toISOString(),
    type:byId('ledgerType').value,
    amount:Number(byId('ledgerAmount').value),
    note:byId('ledgerNote').value
  };
  data.ledger.push(entry);
  saveAll();
  renderLedger();
  updateDashboard();
  e.target.reset();
});

// ---------- Torneios ----------
let editId=null;
function renderTournaments(){
  const tbody=byId('tTable').querySelector('tbody');
  tbody.innerHTML='';
  const siteFilter = byId('filterSite').value.toLowerCase();
  const itmFilter = byId('filterITM').value;
  let list=data.tournaments.slice();
  if(siteFilter) list=list.filter(t=>t.site.toLowerCase().includes(siteFilter));
  if(itmFilter) list=list.filter(t=>itmFilter==='sim'?t.prize>0:t.prize===0);
  list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  list.forEach(t=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${t.date}</td><td>${t.site}</td><td>${formatMoney(t.buyin)}</td><td>${t.format}</td><td>${t.prize>0?'Sim':'Não'}</td><td>${formatMoney(t.profit)}</td>`;
    const actions=document.createElement('td');
    const btnE=document.createElement('button');btnE.textContent='Editar';btnE.onclick=()=>loadToForm(t.id);
    const btnD=document.createElement('button');btnD.textContent='Dup';btnD.onclick=()=>duplicateTournament(t.id);
    const btnX=document.createElement('button');btnX.textContent='X';btnX.onclick=()=>deleteTournament(t.id);
    actions.append(btnE,btnD,btnX);tr.appendChild(actions);
    tbody.appendChild(tr);
  });
}
function loadToForm(id){
  const t=data.tournaments.find(t=>t.id===id);if(!t) return;
  editId=id;
  byId('tDate').value=t.date;byId('tTime').value=t.time;byId('tSite').value=t.site;
  byId('tFormat').value=t.format;byId('tBuyin').value=t.buyin;byId('tFee').value=t.fee;
  byId('tRebuys').value=t.rebuys;byId('tAddon').value=t.addon;byId('tBountyPaid').value=t.bountyPaid;
  byId('tBountyWon').value=t.bountyWon;byId('tPrize').value=t.prize;byId('tNotes').value=t.notes;
}
function duplicateTournament(id){
  const t=data.tournaments.find(t=>t.id===id);if(!t) return;
  const copy=Object.assign({},t,{id:Date.now()});
  data.tournaments.push(copy);
  saveAll();renderTournaments();updateDashboard();updateCharts();
}
function deleteTournament(id){
  data.tournaments=data.tournaments.filter(t=>t.id!==id);
  saveAll();renderTournaments();updateDashboard();updateCharts();
}
byId('tForm').addEventListener('submit',e=>{
  e.preventDefault();
  const t={
    id: editId||Date.now(),
    date: byId('tDate').value,
    time: byId('tTime').value,
    site: byId('tSite').value,
    format: byId('tFormat').value,
    buyin: Number(byId('tBuyin').value),
    fee: Number(byId('tFee').value),
    rebuys: Number(byId('tRebuys').value),
    addon: Number(byId('tAddon').value),
    bountyPaid: Number(byId('tBountyPaid').value),
    bountyWon: Number(byId('tBountyWon').value),
    prize: Number(byId('tPrize').value),
    notes: byId('tNotes').value
  };
  t.cost = (t.buyin+t.fee)*(1+t.rebuys) + t.addon + t.bountyPaid;
  t.profit = t.prize + t.bountyWon - t.cost;
  const idx=data.tournaments.findIndex(o=>o.id===t.id);
  if(idx>=0) data.tournaments[idx]=t; else data.tournaments.push(t);
  saveAll();
  renderTournaments();
  updateDashboard();
  updateCharts();
  editId=null;e.target.reset();
});
byId('filterSite').addEventListener('input',renderTournaments);
byId('filterITM').addEventListener('change',renderTournaments);
byId('clearFilters').onclick=()=>{byId('filterSite').value='';byId('filterITM').value='';renderTournaments();};

// ---------- Templates ----------
const templates=[
  {name:'$1.10 NLH', site:'PokerStars', format:'NLH', buyin:1, fee:0.1},
  {name:'$5.50 NLH', site:'PartyPoker', format:'NLH', buyin:5, fee:0.5}
];
const templateSelect=byId('templateSelect');
templates.forEach((t,i)=>{
  const opt=document.createElement('option');opt.value=i;opt.textContent=t.name;templateSelect.appendChild(opt);
});
byId('applyTemplate').onclick=()=>{
  const t=templates[templateSelect.value];if(!t) return;
  byId('tSite').value=t.site;
  byId('tFormat').value=t.format;
  byId('tBuyin').value=t.buyin;
  byId('tFee').value=t.fee;
};

// ---------- Gráficos ----------
function updateCharts(){
  drawProfitLine();
  drawSitePie();
  drawStakeBar();
  drawDowBar();
  drawHeatmap();
}
// Gráfico de linha: lucro acumulado
function drawProfitLine(){
  const c=byId('chartProfit');const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  let cum=0;ctx.beginPath();ctx.moveTo(0,c.height/2);
  data.tournaments.sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach((t,i)=>{
    cum+=t.profit;const x=i/(data.tournaments.length-1||1)*c.width;const y=c.height/2 - cum;ctx.lineTo(x,y);
  });
  ctx.strokeStyle='green';ctx.stroke();
}
// Pizza por site
function drawSitePie(){
  const c=byId('chartSite');const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const map={};data.tournaments.forEach(t=>map[t.site]=(map[t.site]||0)+t.profit);
  const total=Object.values(map).reduce((a,b)=>a+b,0)||1;let start=0;Object.entries(map).forEach(([site,val])=>{
    const slice=val/total*2*Math.PI;ctx.beginPath();ctx.moveTo(c.width/2,c.height/2);ctx.arc(c.width/2,c.height/2,80,start,start+slice);ctx.closePath();ctx.fillStyle=randomColor(site);ctx.fill();start+=slice;});
}
// Barras por stake
function drawStakeBar(){
  const c=byId('chartStake');const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const map={};data.tournaments.forEach(t=>{const k=t.buyin;map[k]=(map[k]||0)+t.profit;});
  const keys=Object.keys(map);const max=Math.max(...Object.values(map),0);
  keys.forEach((k,i)=>{const x=i*(c.width/keys.length);const h=max?map[k]/max*c.height:0;ctx.fillStyle='steelblue';ctx.fillRect(x,c.height-h,c.width/keys.length-2,h);});
}
// Barras por dia da semana
function drawDowBar(){
  const c=byId('chartDow');const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const map=new Array(7).fill(0);data.tournaments.forEach(t=>{const d=new Date(t.date).getDay();map[d]+=t.profit;});
  const max=Math.max(...map,0);map.forEach((v,i)=>{const x=i*(c.width/7);const h=max?v/max*c.height:0;ctx.fillStyle='orange';ctx.fillRect(x,c.height-h,c.width/7-2,h);});
}
// Heatmap hora x dia
function drawHeatmap(){
  const c=byId('chartHeat');const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const grid=[...Array(7)].map(()=>Array(24).fill(0));
  data.tournaments.forEach(t=>{const d=new Date(`${t.date}T${t.time}`);grid[d.getDay()][d.getHours()]+=t.profit;});
  const max=Math.max(...grid.flat().map(Math.abs),1);
  const cellW=c.width/24, cellH=c.height/7;
  grid.forEach((row,y)=>row.forEach((v,x)=>{const intensity=Math.abs(v)/max;ctx.fillStyle=v>=0?`rgba(0,128,0,${intensity})`:`rgba(220,20,60,${intensity})`;ctx.fillRect(x*cellW,y*cellH,cellW,cellH);}));
}
function randomColor(str){
  let h=0;for(let i=0;i<str.length;i++)h=str.charCodeAt(i)+((h<<5)-h);
  const c=(h&0x00FFFFFF).toString(16).toUpperCase();return '#'+('000000'.substring(0,6-c.length))+c;
}

// ---------- Importação / Exportação ----------
byId('exportJSON').onclick=()=>{
  const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='poker.json';a.click();
};
byId('exportCSV').onclick=()=>{
  const header='date,time,site,format,buyin,fee,rebuys,addon,bountyPaid,bountyWon,prize,notes\n';
  const rows=data.tournaments.map(t=>`${t.date},${t.time},${t.site},${t.format},${t.buyin},${t.fee},${t.rebuys},${t.addon},${t.bountyPaid},${t.bountyWon},${t.prize},${t.notes}`);
  const blob=new Blob([header+rows.join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='poker.csv';a.click();
};
byId('importFile').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file) return;
  const reader=new FileReader();reader.onload=evt=>{
    if(file.name.endsWith('.json')){Object.assign(data,JSON.parse(evt.target.result));}
    else{const lines=evt.target.result.trim().split(/\n/).slice(1);data.tournaments=lines.map(l=>{const [date,time,site,format,buyin,fee,rebuys,addon,bountyPaid,bountyWon,prize,notes]=l.split(',');const t={id:Date.now()+Math.random(),date,time,site,format,buyin:Number(buyin),fee:Number(fee),rebuys:Number(rebuys),addon:Number(addon),bountyPaid:Number(bountyPaid),bountyWon:Number(bountyWon),prize:Number(prize),notes};t.cost=(t.buyin+t.fee)*(1+t.rebuys)+t.addon+t.bountyPaid;t.profit=t.prize+t.bountyWon-t.cost;return t;});}
    saveAll();renderLedger();renderTournaments();updateDashboard();updateCharts();
  };reader.readAsText(file);
});

// ---------- Tema ----------
if(data.settings.theme==='dark') document.body.classList.add('dark');
byId('themeToggle').onclick=()=>{document.body.classList.toggle('dark');data.settings.theme=document.body.classList.contains('dark')?'dark':'light';saveAll();};

// ---------- Seed ----------
byId('seedData').onclick=seed;
function seed(){
  data.ledger=[{date:new Date().toISOString(),type:'deposito',amount:1000,note:'seed'}];
  data.tournaments=[];
  const sites=['PokerStars','PartyPoker','888'];
  for(let i=0;i<100;i++){
    const buy=[1,2,5,10][Math.floor(Math.random()*4)];
    const fee=buy*0.1;
    const rebuys=Math.random()<0.3?1:0;
    const prize=Math.random()<0.2?buy*10:0;
    const bountyWon=Math.random()<0.1?buy:0;
    const t={
      id:Date.now()+i,
      date:new Date(Date.now()-i*86400000).toISOString().slice(0,10),
      time:'20:00',
      site:sites[Math.floor(Math.random()*sites.length)],
      format:'NLH',
      buyin:buy,
      fee:fee,
      rebuys:rebuys,
      addon:0,
      bountyPaid:0,
      bountyWon:bountyWon,
      prize:prize,
      notes:''
    };
    t.cost=(t.buyin+t.fee)*(1+t.rebuys)+t.bountyPaid;
    t.profit=t.prize+t.bountyWon-t.cost;
    data.tournaments.push(t);
  }
  saveAll();renderLedger();renderTournaments();updateDashboard();updateCharts();
}

// ---------- Service Worker ----------
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
}

// Inicialização
renderLedger();renderTournaments();updateDashboard();updateCharts();
