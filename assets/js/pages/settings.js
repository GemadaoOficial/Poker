import { storage } from '../modules/storage.js';
import { applyTheme } from '../modules/ui.js';

export function init(){
  const settings=storage.get('settings')||{currency:'BRL',tz:'UTC',theme:'auto'};
  const div=document.getElementById('settingsContent');
  div.innerHTML=`<form id='settingsForm' class='form-card'>
    <label>Fuso horário<input name='tz' value='${settings.tz}'></label>
    <label>Moeda base<select name='currency'><option ${settings.currency==='BRL'?'selected':''}>BRL</option><option ${settings.currency==='USD'?'selected':''}>USD</option></select></label>
    <label>Tema<select name='theme'><option value='auto' ${settings.theme==='auto'?'selected':''}>Auto</option><option value='light' ${settings.theme==='light'?'selected':''}>Claro</option><option value='dark' ${settings.theme==='dark'?'selected':''}>Escuro</option></select></label>
    <button class='btn-primary'>Salvar</button></form>`;
  const form=document.getElementById('settingsForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(form));
    storage.set('settings',data);
    storage.set('theme',data.theme);
    applyTheme();
  });
}
