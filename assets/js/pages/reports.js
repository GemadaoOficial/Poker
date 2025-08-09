import { storage } from '../modules/storage.js';

export function init(){
  const tournaments=storage.get('tournaments')||[];
  const div=document.getElementById('reportsContent');
  div.innerHTML=`<button id='exportCsv' class='btn-primary'>Exportar CSV</button><table id='repTable' class='responsive-table'></table>`;
  const table=document.getElementById('repTable');
  table.innerHTML='<tr><th>Data</th><th>Site</th><th>Nome</th><th>Lucro</th></tr>'+tournaments.map(t=>{
    const eff=t.buyin+t.rake+t.addon+t.reentries*t.buyin;
    const lucro=(t.prize+t.bounties-eff).toFixed(2);
    return `<tr><td>${t.date.slice(0,10)}</td><td>${t.site}</td><td>${t.name}</td><td>${t.currency} ${lucro}</td></tr>`;
  }).join('');
  document.getElementById('exportCsv').addEventListener('click',()=>{
    const rows=[['data','site','nome','lucro'],...tournaments.map(t=>[t.date.slice(0,10),t.site,t.name,(t.prize+t.bounties-(t.buyin+t.rake+t.addon+t.reentries*t.buyin)).toFixed(2)])];
    const csv=rows.map(r=>r.join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='relatorio.csv'; a.click();
  });
}
