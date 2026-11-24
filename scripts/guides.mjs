import {readFile, writeFile, mkdir} from 'node:fs/promises';

const origin = 'https://dingjian-weighing-systems.charminghost4.chatgpt.site';
const read = async name => JSON.parse(await readFile('guides/' + name + '.json','utf8'));
const [index, company, applications] = await Promise.all(['index','company-products','applications'].map(read));
const copy = [...company,...applications];
const topics = index.map(entry => ({...entry,...copy.find(item => item.page === entry.page)}));
const languages = ['zh','en'];
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pathname = (lang,topic) => '/' + lang + '/' + (topic?.slug ?? 'topics') + '.html';
const addresses = [];
for (const lang of languages) {
  const en = lang === 'en';
  const t = (zh,english) => en ? english : zh;
  const groups = [null,t('企业与制造','Company and manufacturing'),t('设备与配件','Equipment and accessories'),t('系统与应用','Systems and applications')];
  const label = t('称重选型与技术指南','Weighing equipment and application guides');
  const itemLink = topic => '<a href="'+pathname(lang,topic)+'">'+escape(topic[lang])+'</a>';
  await mkdir('public/'+lang,{recursive:true});
  for (const topic of [null,...topics]) {
    const path = pathname(lang,topic);
    addresses.push(origin+path);
    const title = topic ? topic[lang] : label;
    const desc = topic ? topic[en?'summary':'description'] : t('按称重设备、系统应用和制造服务查阅技术资料，比较选型条件并联系顶尖称重。','Browse equipment, application and manufacturing guides to compare weighing options and discuss your site requirements.');
    const crumb = [[t('首页','Home'),'/'],[label,pathname(lang)]];
    if (topic) crumb.push([title,path]);
    const structured = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumb.map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:origin+url}))};
    const pageBody = topic ? topic.sections.map(s=>'<section><h2>'+escape(s[lang][0])+'</h2><p>'+escape(s[lang][1])+'</p></section>').join('') : groups.slice(1).map((g,i)=>'<section><h2>'+g+'</h2><div class="tiles">'+topics.filter(x=>x.group===i+1).map(x=>'<div>'+itemLink(x)+'<p>'+escape(x[en?'summary':'description'])+'</p></div>').join('')+'</div></section>').join('');
    const brochure='/catalog.html?lang='+lang+(topic?'&amp;p='+topic.page:'');
    const aside=topic?'<aside><h2>'+t('关联选型资料','Related guides')+'</h2>'+topic.related.map(id=>itemLink(topics.find(x=>x.page===id))).join('')+'<a href="'+pathname(lang)+'">'+label+'</a><h2>'+t('画册原页','Catalog reference')+'</h2><a href="'+brochure+'"><img loading="lazy" src="/catalog-assets/'+lang+'-'+topic.page+'.webp" alt="'+escape(title)+'">'+t('查看高清画册与图表','View the catalog spread')+'</a></aside>':'';
    const image = topic?.page===8?'split.jpg':topic?.page===15?'reactor.jpg':topic && topic.page<=7?'factory.jpg':'hero.jpg';
    const html='<!doctype html><html lang="'+t('zh-CN','en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' | '+t('顶尖称重','Dingjian Weighing')+'</title><meta name="description" content="'+escape(desc)+'"><link rel="canonical" href="'+origin+path+'">'+languages.map(l=>'<link rel="alternate" hreflang="'+(l==='zh'?'zh-CN':'en')+'" href="'+origin+pathname(l,topic)+'">').join('')+'<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/guides.css"><script type="application/ld+json">'+JSON.stringify(structured)+'</script></head><body><header><a href="/" class="brand"><img src="/assets/logo.png" width="43" alt=""><b>'+t('顶尖称重','DINGJIAN')+'</b></a><nav><a href="'+pathname(lang)+'">'+t('选型指南','Technical guides')+'</a><a href="'+brochure+'">'+t('产品画册','Catalog')+'</a><a href="/video.html">'+t('老板讲地磅','Founder’s introduction')+'</a></nav><a class="locale" hreflang="'+t('en','zh-CN')+'" href="'+pathname(en?'zh':'en',topic)+'">'+t('EN','中文')+'</a><a class="quote" href="/#contact">'+t('获取报价','Get a quote')+'</a></header><main class="guide"><div class="lead"><div><div class="trail">'+crumb.slice(0,-1).map(([n,u])=>'<a href="'+u+'">'+escape(n)+'</a>').join(' / ')+'</div><h1>'+escape(title)+'</h1><p>'+escape(desc)+'</p></div><img alt="" src="/assets/'+image+'"></div><div class="reading '+(topic?'':'hub')+'"><div>'+pageBody+'</div>'+aside+'</div><div class="consult"><h2>'+t('讨论您的称重项目','Discuss your weighing project')+'</h2><a class="cta" href="/#contact">'+t('联系顶尖称重','Contact Dingjian')+'</a></div></main><script>try{localStorage.setItem("dj-lang","'+lang+'")}catch{}</script></body></html>';
    await writeFile('public'+path,html);
  }
}
const map = Object.fromEntries(topics.map(x=>[x.page,x.slug]));
await writeFile('public/guide-paths.js','window.guidePaths = '+JSON.stringify(map)+';\n');
await writeFile('public/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[origin+'/',origin+'/catalog.html',origin+'/video.html',...addresses].map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>');
await writeFile('public/robots.txt','User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+origin+'/sitemap.xml\n');
