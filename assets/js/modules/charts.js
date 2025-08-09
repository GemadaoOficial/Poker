export function lineChart(ctx,labels,data){
  return new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Lucro',data,borderColor:'#e91e63'}]},options:{responsive:true,maintainAspectRatio:false}});
}
export function barChart(ctx,labels,data){
  return new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Lucro',data,backgroundColor:'#e91e63'}]},options:{responsive:true,maintainAspectRatio:false}});
}
export function doughnutChart(ctx,labels,data){
  return new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:['#e91e63','#3f51b5']}]} ,options:{responsive:true,maintainAspectRatio:false}});
}
