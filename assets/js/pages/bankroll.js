import { storage } from '../modules/storage.js';

export function init(){
  const wallets=storage.get('wallets')||[];
  const transactions=storage.get('transactions')||[];
  const div=document.getElementById('bankrollContent');
  const walletHtml=wallets.map(w=>`<div class='card'>${w.name}<br>${w.currency} ${w.balance}</div>`).join('');
  const transHtml=transactions.map(t=>`<tr><td>${t.date.slice(0,10)}</td><td>${t.wallet}</td><td>${t.type}</td><td>${t.amount}</td></tr>`).join('');
  div.innerHTML=`<h1>Carteiras</h1><div class='cards'>${walletHtml}</div><h2>Transações</h2><table class='responsive-table'><tr><th>Data</th><th>Carteira</th><th>Tipo</th><th>Valor</th></tr>${transHtml}</table>`;
}
