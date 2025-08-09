import { seed } from './modules/seed.js';
import { initAuth, currentUser, logout } from './modules/auth.js';
import { applyTheme, initThemeToggle, showToast } from './modules/ui.js';

seed();
initAuth();
applyTheme();
initThemeToggle();

const logoutLink = document.getElementById('logoutLink');
if(logoutLink) logoutLink.addEventListener('click', e=>{e.preventDefault();logout();});

const page = document.body.dataset.page;
if(page){
  import(`./pages/${page}.js`).then(m=>m.init()).catch(()=>showToast('Erro ao carregar página'));
}
