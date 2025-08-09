import { storage } from '../modules/storage.js';

export function init(){
  const uploads=storage.get('uploads')||[];
  const div=document.getElementById('uploadsContent');
  div.innerHTML=`<input type='file' id='fileInput'><div id='preview' class='cards'></div><h2>Uploads</h2><div id='list' class='cards'></div>`;
  const preview=document.getElementById('preview');
  const list=document.getElementById('list');
  function render(){
    list.innerHTML=uploads.map(u=>`<div class='card'><img src='${u.src}' alt='${u.id}' width='100'></div>`).join('');
  }
  render();
  document.getElementById('fileInput').addEventListener('change',e=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=evt=>{
      uploads.push({id:Date.now(),tournamentId:null,src:evt.target.result,private:false});
      storage.set('uploads',uploads); render();
    };
    reader.readAsDataURL(file);
  });
}
