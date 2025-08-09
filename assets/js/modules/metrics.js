import { storage } from './storage.js';
import { convert } from './currency.js';

export function dashboardMetrics(){
  const tournaments=storage.get('tournaments')||[];
  const base='BRL';
  let profit=0,cost=0,itm=0;
  tournaments.forEach(t=>{
    const eff=t.buyin+t.rake+t.addon+t.reentries*t.buyin;
    const prize=t.prize+t.bounties;
    cost+=convert(eff,t.currency,base,t.date);
    profit+=convert(prize-eff,t.currency,base,t.date);
    if(t.itm) itm++;
  });
  const roi=cost? (profit/cost*100):0;
  const abi= tournaments.length? cost/tournaments.length:0;
  return {
    roi:roi.toFixed(1),
    lucro:profit.toFixed(2),
    abi:abi.toFixed(2),
    itm: tournaments.length? (itm/tournaments.length*100).toFixed(1):0,
    count:tournaments.length
  };
}

export function profitByDay(days=90){
  const tournaments=storage.get('tournaments')||[];
  const base='BRL';
  const data={};
  const start=new Date(Date.now()-days*86400000);
  tournaments.filter(t=>new Date(t.date)>=start).forEach(t=>{
    const day=t.date.slice(0,10);
    const eff=t.buyin+t.rake+t.addon+t.reentries*t.buyin;
    const prize=t.prize+t.bounties;
    const val=convert(prize-eff,t.currency,base,t.date);
    data[day]=(data[day]||0)+val;
  });
  return data;
}

export function profitBySite(){
  const tournaments=storage.get('tournaments')||[]; const base='BRL';
  const data={};
  tournaments.forEach(t=>{
    const eff=t.buyin+t.rake+t.addon+t.reentries*t.buyin;
    const prize=t.prize+t.bounties;
    const val=convert(prize-eff,t.currency,base,t.date);
    data[t.site]=(data[t.site]||0)+val;
  });
  return data;
}

export function bountyVsPrize(){
  const tournaments=storage.get('tournaments')||[]; const base='BRL';
  let bounty=0,prize=0;
  tournaments.filter(t=>t.pko).forEach(t=>{
    bounty+=convert(t.bounties,t.currency,base,t.date);
    prize+=convert(t.prize,t.currency,base,t.date);
  });
  return {bounty,prize};
}
