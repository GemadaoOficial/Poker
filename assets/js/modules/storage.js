const ns = 'poker_';
export const storage = {
  get(key){
    const val = localStorage.getItem(ns+key);
    try{return JSON.parse(val);}catch{return val;}
  },
  set(key,val){
    localStorage.setItem(ns+key, JSON.stringify(val));
  },
  remove(key){localStorage.removeItem(ns+key);}
};
