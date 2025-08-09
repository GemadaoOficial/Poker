import { storage } from '../modules/storage.js';

export function init(){
  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const t=(storage.get('tournaments')||[]).find(t=>t.id==id);
  const div=document.getElementById('tournamentDetail');
  if(!t){div.textContent='Não encontrado';return;}
  div.innerHTML=`
    <h1>${t.name}</h1>
    <p>Site: ${t.site}</p>
    <p>Data: ${t.date.slice(0,16)}</p>
    <p>Buy-in: ${t.currency} ${t.buyin}</p>
    <p>Prêmio: ${t.currency} ${t.prize}</p>
    <p>Bounties: ${t.currency} ${t.bounties}</p>
    <p>ITM: ${t.itm?'Sim':'Não'}</p>
    <p>PKO: ${t.pko?'Sim':'Não'}</p>
  `;
}
