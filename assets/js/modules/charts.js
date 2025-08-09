export function lineChart(ctx,labels,data){

  return new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Lucro',data,borderColor:'#e91e63'}]}});
}
export function barChart(ctx,labels,data){
  return new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Lucro',data,backgroundColor:'#e91e63'}]}});
}
export function doughnutChart(ctx,labels,data){
  return new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:['#e91e63','#3f51b5']}]} });

}
