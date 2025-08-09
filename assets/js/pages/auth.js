import { login, register } from '../modules/auth.js';
import { showToast } from '../modules/ui.js';

export function init(){
  const loginForm=document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(loginForm));
      login(data);
      location.href='dashboard.html';
    });
  }
  const registerForm=document.getElementById('registerForm');
  if(registerForm){
    registerForm.addEventListener('submit',e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(registerForm));
      register(data);
      location.href='dashboard.html';
    });
  }
}
