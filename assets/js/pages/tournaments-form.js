import { storage } from '../modules/storage.js';

export function init(){
  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const tournaments=storage.get('tournaments')||[];
  const form=document.getElementById('tournamentForm');
  const data=id? tournaments.find(t=>t.id==id):{site:'',name:'',date:'',currency:'BRL',buyin:0,rake:0,reentries:0,addon:0,bounties:0,prize:0,itm:false,pko:false,position:'',players:0,notes:'',tags:''};
  form.innerHTML=`
    <label>Site<input name="site" value="${data.site}" required></label>
    <label>Nome<input name="name" value="${data.name}" required></label>
    <label>Data<input type="datetime-local" name="date" value="${data.date?data.date.slice(0,16):''}" required></label>
    <label>Moeda<select name="currency"><option ${data.currency==='BRL'?'selected':''}>BRL</option><option ${data.currency==='USD'?'selected':''}>USD</option></select></label>
    <label>Buy-in<input type="number" name="buyin" value="${data.buyin}" required></label>
    <label>Rake<input type="number" name="rake" value="${data.rake}"></label>
    <label>Reentries<input type="number" name="reentries" value="${data.reentries}"></label>
    <label>Addon<input type="number" name="addon" value="${data.addon}"></label>
    <label>Bounties<input type="number" name="bounties" value="${data.bounties}"></label>
    <label>Prêmio<input type="number" name="prize" value="${data.prize}"></label>
    <label>ITM<input type="checkbox" name="itm" ${data.itm?'checked':''}></label>
    <label>PKO<input type="checkbox" name="pko" ${data.pko?'checked':''}></label>
    <button class="btn-primary">Salvar</button>`;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const obj=Object.fromEntries(new FormData(form));
    obj.itm=!!obj.itm; obj.pko=!!obj.pko; obj.id=id?parseInt(id):Date.now();
    obj.date=new Date(obj.date).toISOString();
    if(id){
      const idx=tournaments.findIndex(t=>t.id==id); tournaments[idx]=obj;
    }else{
      tournaments.push(obj);
    }
    storage.set('tournaments',tournaments);
    location.href='tournaments.html';
  });
}
