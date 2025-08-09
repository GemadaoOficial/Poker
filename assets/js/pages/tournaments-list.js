import { storage } from '../modules/storage.js';

export function init(){
  const tournaments=storage.get('tournaments')||[];
  const filters=document.getElementById('filters');
  const sites=[...new Set(tournaments.map(t=>t.site))];
  filters.innerHTML=`
    <label>Site<select id="filterSite"><option value="">Todos</option>${sites.map(s=>`<option>${s}</option>`).join('')}</select></label>
    <label>Busca<input id="filterText"></label>`;
  const table=document.getElementById('tournamentsTable');
  function render(){
    const fs=document.getElementById('filterSite').value;
    const ft=document.getElementById('filterText').value.toLowerCase();
    const rows=tournaments.filter(t=>(!fs||t.site===fs)&&(!ft||t.name.toLowerCase().includes(ft)));
    table.innerHTML='<tr><th>Data</th><th>Site</th><th>Nome</th><th>Buy-in</th><th>Prize</th></tr>'+rows.map(t=>`<tr><td>${t.date.slice(0,10)}</td><td>${t.site}</td><td><a href="tournaments-show.html?id=${t.id}">${t.name}</a></td><td>${t.currency} ${t.buyin}</td><td>${t.currency} ${t.prize}</td></tr>`).join('');
  }
  filters.addEventListener('input',render);
  render();
}
