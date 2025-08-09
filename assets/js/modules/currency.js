import { storage } from './storage.js';
export function convert(value,from,to,date){
  if(from===to) return value;
  const rates=storage.get('rates')||{};
  const rate=rates[date.slice(0,10)]||5;
  if(from==='USD'&&to==='BRL') return value*rate;
  if(from==='BRL'&&to==='USD') return value/rate;
  return value;
}
