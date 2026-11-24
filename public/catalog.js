const groups=[['全部类别','All categories'],['公司与制造','Company & manufacturing'],['地磅与配件','Scales & accessories'],['系统与应用','Systems & applications']];
const entries=[
[1,'公司画册与联系方式','Company brochure and contacts','企业中英文名称、咨询热线、电子邮箱及生产地址。','Company identity, sales hotline, email and manufacturing address.'],
[1,'画册目录','Brochure contents','按企业简介、公司环境、公司资质、企业优势、产品介绍和客户案例查阅画册。','Contents covering company profile, facilities, qualifications, capabilities, product introductions and customer examples.'],
[1,'企业简介','Company profile','河源市台衡顶尖称重设备有限公司成立于 2014 年 7 月。本页介绍企业沿革、称重设备制造业务和生产基地。','Established in July 2014, Heyuan Taiheng Top Weighing Equipment Co., Ltd. introduces its history, manufacturing operations and production base.'],
[1,'公司环境与生产车间','Facilities and production workshop','浏览公司正门、办公区、厂区、秤台加工与焊接车间实拍。','See the entrance, offices, factory grounds and the workshops used to fabricate and weld scale platforms.'],
[1,'公司资质与荣誉','Company qualifications and honors','查看画册收录的证书与荣誉图片，放大跨页可阅读证书细节。','Inspect the certificates and honors reproduced in the company brochure. Open the full-size spread for details.'],
[1,'资质证书展示','Certificate gallery','资质展示续页，集中陈列企业证书和质量管理相关资料。','Additional certificates and quality-related documentation from the company catalog.'],
[1,'制造能力与售后服务','Manufacturing and after-sales service','了解生产管理、加工设备、生产线及售后服务。售后服务热线为 4000-566-765。','Review the production lines, machining equipment, manufacturing management and after-sales service. The service hotline is 4000-566-765.'],
[2,'出口分体式汽车衡与传感器','Split truck scales and load cells','SCS 系列提供 20、30、50、60、80、100、120 和 150 吨量程。查看型号对照、安装方式、应用场景与称重传感器参数。','The SCS range offers 20, 30, 50, 60, 80, 100, 120 and 150 tonne capacities. Compare models, installation layouts, applications and load cell specifications.'],
[2,'称重模块与通行配件','Weigh modules and access equipment','查看各类称重模块，以及读卡器、车牌识别设备、摄像装置与红绿灯的图片和参数。','Compare weigh modules and vehicle access accessories, including card readers, license plate recognition devices, cameras and traffic lights.'],
[2,'称重仪表、打印机与小地磅','Indicators, printers and floor scales','对照仪表、打印机及小地磅的产品说明，查阅台面尺寸、量程及可选不锈钢材质。','Review indicators and printers, then compare floor scale dimensions, capacities and optional stainless steel construction.'],
[3,'畜牧称重、料塔与屠宰轨道秤','Livestock scales, feed bins and rail scales','介绍屠宰轨道秤、料塔称重系统及牲畜秤的适用场景，并展示设备及安装现场。','Explore slaughterhouse rail scales, feed bin weighing systems and livestock scales, with equipment and installation photographs.'],
[3,'一卡通称重与装车管理系统','Card-based weighing and loading management','按示意图了解车辆进场、自动称重、装料、复称和放行之间的衔接，以及散装和定量装料设备。','Follow vehicles through entry, weighing, loading, check weighing and release. Diagrams show bulk cargo and quantitative loading arrangements.'],
[3,'无人值守系统','Unattended weighing systems','结合现场图片，了解无人值守地磅的系统组成、车辆过磅流程和管理功能。','Review the components, vehicle weighing workflow and management functions of an unattended weighbridge, illustrated by a site installation.'],
[3,'无人值守系统配置','Unattended system configuration','查阅无人值守系统的配套功能和布局示意，了解车辆识别、现场显示与通行控制设备之间的关系。','Study the system layout and supporting functions, including vehicle identification, on-site displays and access controls.'],
[3,'皮带秤、叉车秤、轨道衡与反应釜称重','Belt, forklift, rail and reactor weighing','浏览输送、搬运、轨道车辆和化工容器称重设备实拍，以及洗轮机和自助称重终端的现场应用。','See weighing equipment for conveyors, material handling, rail vehicles and chemical reactors, alongside wheel washers and self-service weighing terminals.'],
[3,'智慧搅拌站与部分客户案例','Smart mixing plants and customer examples','了解智慧搅拌站的系统功能和适用范围，查看企业画册列举的客户案例。','Explore the smart mixing plant system, its functions and applications, followed by the customer examples listed in the company brochure.']
];
const $=id=>document.getElementById(id);
const strings=[...document.querySelectorAll('[data-en]')].map(el=>[el,el.textContent]);
const requestedLanguage = new URL(location.href).searchParams.get('lang');
if (['en','zh'].includes(requestedLanguage)) localStorage.setItem('dj-lang',requestedLanguage);
let en=localStorage.getItem('dj-lang')==='en',page=readPage();
function readPage(){return Math.min(16,Math.max(1,parseInt(new URL(location.href).searchParams.get('p'),10)||1));}
function list(){
 const q=$('search').value.toLowerCase().trim(),category=+$('group').value;
 const links=[];entries.forEach((entry,i)=>{
  if(category && category!==entry[0] || !entry.join(' ').toLowerCase().includes(q))return;
  const a=document.createElement('a');a.href='?p='+(i+1);a.textContent=entry[en?2:1];
  if(page===i+1)a.setAttribute('aria-current','page');
  const slug = window.guidePaths?.[i+1];
  if (slug) {
    a.href = '/' + (en ? 'en' : 'zh') + '/' + slug + '.html';
    links.push(a);
    return;
  }
  a.href += '&lang=' + (en ? 'en' : 'zh');
  a.onclick=e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();select(i+1);};links.push(a);
 });$('matches').replaceChildren(...links);if(!links.length)$('matches').textContent=en?'No matching topics.':'未找到相关资料。';
}
function select(n){
 page=n;const u=new URL(location.href);u.searchParams.set('p',page);history.pushState(null,'',u);render();
 if(matchMedia('(max-width:750px)').matches)$('detail').scrollIntoView();
}
function render(){
 const e=entries[page-1],l=en?1:0;
 document.documentElement.lang=en?'en':'zh-CN';document.title=e[1+l]+' | DINGJIAN';
 for(const [el,zh] of strings)el.textContent=en?el.dataset.en:zh;
 $('lang').textContent=en?'中文':'EN';$('search').placeholder=en?'Model, product or topic':'型号、产品或主题';
 document.querySelectorAll('[data-guide-hub]').forEach(link => link.href = en ? '/en/topics.html' : '/zh/topics.html');
 const cat=$('group').value||'0';$('group').replaceChildren(...groups.map((g,i)=>new Option(g[l],String(i))));$('group').value=cat;
 $('category').textContent=groups[e[0]][l];$('title').textContent=e[1+l];$('summary').textContent=e[3+l];
 const src='catalog-assets/'+(en?'en':'zh')+'-'+page+'.webp';
 $('art').src=src;$('art').alt=e[1+l];$('zoom').href=src;$('artlink').href=src;
 $('pagination').textContent=page+' / '+entries.length;$('prev').disabled=page===1;$('next').disabled=page===entries.length;
 list();
}
$('prev').onclick=()=>select(page-1);$('next').onclick=()=>select(page+1);
$('group').onchange=list;$('search').oninput=list;
$('lang').onclick=()=>{en=!en;localStorage.setItem('dj-lang',en?'en':'zh');const u=new URL(location.href);u.searchParams.set('lang',en?'en':'zh');history.replaceState(null,'',u);render();};
window.onpopstate=()=>{page=readPage();render();};render();

