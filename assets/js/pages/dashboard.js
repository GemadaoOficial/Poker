import { dashboardMetrics, profitByDay, profitBySite, bountyVsPrize } from '../modules/metrics.js';
import { lineChart, barChart, doughnutChart } from '../modules/charts.js';

export function init(){
  const m=dashboardMetrics();
  const cards=document.getElementById('metricsCards');
  cards.innerHTML=`
    <div class="card">ROI%<br>${m.roi}</div>
    <div class="card">Lucro Total<br>R$ ${m.lucro}</div>
    <div class="card">ABI Efetivo<br>R$ ${m.abi}</div>
    <div class="card">ITM%<br>${m.itm}</div>
    <div class="card">#Torneios<br>${m.count}</div>`;

  const daily=profitByDay();
  lineChart(document.getElementById('chartProfitDaily').getContext('2d'),Object.keys(daily),Object.values(daily));
  const site=profitBySite();
  barChart(document.getElementById('chartProfitSite').getContext('2d'),Object.keys(site),Object.values(site));
  const bp=bountyVsPrize();
  doughnutChart(document.getElementById('chartBounty').getContext('2d'),['Bounties','Prêmios'],[bp.bounty,bp.prize]);
}
