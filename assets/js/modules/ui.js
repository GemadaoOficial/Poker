import { storage } from './storage.js';

export function applyTheme(){
  const theme=storage.get('theme')||'auto';
  if(theme==='dark'||(theme==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches))
    document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}
export function initThemeToggle(){
  const btn=document.getElementById('themeToggle');
  if(!btn) return;
  btn.textContent='Tema';
  btn.addEventListener('click',()=>{
    const isDark=document.documentElement.classList.toggle('dark');
    storage.set('theme',isDark?'dark':'light');
  });
}
export function showToast(msg){
  const div=document.createElement('div');
  div.className='toast';
  div.textContent=msg;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),3000);
}
