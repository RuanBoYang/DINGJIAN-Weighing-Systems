const groups=[...document.querySelectorAll('.group')];
function show(group){for(const g of groups){const open=g===group;g.classList.toggle('open',open);g.querySelector('button').setAttribute('aria-expanded',open)}}
const header=document.querySelector('header'),toggle=document.querySelector('.hamb');
function menu(open){header.classList.toggle('menu',open);toggle.textContent=open?'×':'☰';toggle.setAttribute('aria-expanded',open);if(!open)show(null)}
toggle.onclick=()=>menu(!header.classList.contains('menu'));
groups.forEach(g=>{g.querySelector('button').onclick=()=>show(g.classList.contains('open')?null:g);g.onpointerenter=e=>{if(e.pointerType==='mouse'&&innerWidth>1000)show(g)}});
header.onpointerleave=()=>{if(innerWidth>1000)show(null)};
document.addEventListener('click',e=>{if(!header.contains(e.target)||e.target.closest('nav a'))menu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu(false);if(innerWidth<=1000)toggle.focus()}});
document.querySelectorAll('.notice').forEach(n=>{let k='dj-'+n.dataset.key+'-'+document.documentElement.lang;if(sessionStorage.getItem(k))n.remove();else n.querySelector('button').onclick=()=>{sessionStorage.setItem(k,'1');n.remove()}});
const f=document.querySelector('#filter');
if(f){const params=new URLSearchParams(location.search);f.value=params.get('group')||'';const q=(params.get('q')||'').trim().toLowerCase();document.querySelector('input[name=q]').value=q;function apply(){let count=0;document.querySelectorAll('article').forEach(a=>{a.hidden=!!((f.value&&a.dataset.group!==f.value)||!a.textContent.toLowerCase().includes(q));if(!a.hidden)count++});document.querySelector('#empty').hidden=count!==0}f.onchange=apply;apply()}
const searchButton=document.querySelector('.searchbtn');
searchButton.onclick=()=>{menu(false);const open=header.classList.toggle('searching');searchButton.setAttribute('aria-expanded',open);if(open)header.querySelector('input').focus()};
toggle.addEventListener('click',()=>{header.classList.remove('searching');searchButton.setAttribute('aria-expanded',false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('searching')){header.classList.remove('searching');searchButton.setAttribute('aria-expanded',false);searchButton.focus()}});
