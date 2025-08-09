import { storage } from './storage.js';

export function initAuth(){
  const page=document.body.dataset.page;
  if(['auth'].includes(page)) return;
  if(!currentUser()) location.href='auth-login.html';
}
export function currentUser(){
  return storage.get('user');
}
export function login(data){
  storage.set('user',data);
}
export function register(data){
  storage.set('user',data);
}
export function logout(){
  storage.remove('user');
  location.href='auth-login.html';
}
