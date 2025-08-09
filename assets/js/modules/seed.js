import { storage } from './storage.js';

export function seed(){
  if(storage.get('seeded')) return;
  const tournaments=[];
  const sites=['GG','Suprema','Stars'];
  const currencies=['BRL','USD'];
  const now=Date.now();
  for(let i=0;i<120;i++){
    const daysAgo=Math.floor(Math.random()*180);
    const date=new Date(now-daysAgo*86400000);
    const site=sites[Math.floor(Math.random()*sites.length)];
    const currency=currencies[Math.floor(Math.random()*currencies.length)];
    const buyin=10+Math.floor(Math.random()*50);
    const rake=buyin*0.1;
    const pko=Math.random()<0.35;
    const itm=Math.random()<0.25;
    const prize=itm?buyin* (2+Math.random()*5):0;
    const bounties=pko?Math.random()*buyin:0;
    tournaments.push({
      id:i+1,
      site,
      name:`Torneio ${i+1}`,
      date:date.toISOString(),
      currency,
      buyin,rake,reentries:0,addon:0,bounties,prize,position: itm?Math.floor(Math.random()*50)+1:null,itm,pko,players:200+Math.floor(Math.random()*800),tags:[]
    });
  }
  const wallets=[
    {id:1,name:'GG USD',currency:'USD',balance:500},
    {id:2,name:'Suprema BRL',currency:'BRL',balance:2000},
    {id:3,name:'Pix BRL',currency:'BRL',balance:1500}
  ];
  const transactions=[];
  for(let i=0;i<30;i++){
    const wallet=wallets[Math.floor(Math.random()*wallets.length)].id;
    transactions.push({id:i+1,wallet,type:'deposit',amount:100,date:new Date(now-i*86400000).toISOString()});
  }
  const uploads=[];
  for(let i=0;i<10;i++){
    uploads.push({id:i+1,tournamentId:null,src:`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150'><rect fill='%23ccc' width='200' height='150'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20'>Upload ${i+1}</text></svg>`,private:false});
  }
  const rates={};
  for(let i=0;i<180;i++){
    const d=new Date(now-i*86400000);const ds=d.toISOString().slice(0,10);
    rates[ds]=4.8+Math.random()*0.4;
  }
  storage.set('tournaments',tournaments);
  storage.set('wallets',wallets);
  storage.set('transactions',transactions);
  storage.set('uploads',uploads);
  storage.set('rates',rates);
  storage.set('seeded',true);
}
