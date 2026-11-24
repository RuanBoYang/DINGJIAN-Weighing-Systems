const $ = s=>document.querySelector(s);
let english = localStorage.getItem("dj-lang")==="en";
let message=["",""];
const content=[...document.querySelectorAll("[data-en]")].map(el=>[el,el.textContent,el.dataset.en]);
function translate(){
  content.forEach(([el,zh,en])=>el.textContent=english?en:zh);
  document.documentElement.lang=english?"en":"zh-CN";
  document.title=english?"Founder’s introduction | DINGJIAN":"老板讲地磅 | DINGJIAN";
  document.querySelector('[data-guide-hub]').href = english ? '/en/topics.html' : '/zh/topics.html';
  $("#lang").textContent=english?"中文":"EN";
  $("#lang").setAttribute("aria-label",english?"切换为中文":"Switch to English");
  $("#state").textContent=message[+english];
}
function notify(zh,en){message=[zh,en];translate()}
$("#lang").onclick=()=>{english=!english;localStorage.setItem("dj-lang",english?"en":"zh");translate()};
function showFilm(){
  $("#empty").style.display="none";$("#player").hidden=false;$("#player").src="/api/video?t="+Date.now();
}
translate();
fetch("/api/status").then(r=>r.json()).then(data=>{
  $("#form").hidden=!data.edit;if(data.film)showFilm();
}).catch(()=>notify("视频服务暂时不可用。","The video service is temporarily unavailable."));
$("#form").onsubmit=async e=>{
  e.preventDefault();const file=$("#file").files[0];
  if(!file || !["video/mp4","video/webm"].includes(file.type) || file.size>95*1024*1024 || !file.size)
    return notify("请选择 95 MiB 以内的 MP4 或 WebM 视频。","Choose an MP4 or WebM video up to 95 MiB.");
  const button=e.currentTarget.querySelector("button");button.disabled=true;
  notify("正在上传，请保持页面打开。","Uploading. Keep this page open.");
  try{
    const response=await fetch("/api/video",{method:"PUT",body:file,headers:{"content-type":file.type}});
    if(!response.ok)throw Error();
    showFilm();$("#file").value="";notify("视频已发布。","Video published.");
  }catch{notify("上传失败，请检查网络并重试。","Upload failed. Check your connection and retry.")}
  finally{button.disabled=false}
};
