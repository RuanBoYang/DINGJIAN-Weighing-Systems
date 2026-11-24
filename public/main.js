const translations = [...document.querySelectorAll('[data-en]')].map(el => [el, el.innerHTML, el.dataset.en]);
let lang = localStorage.getItem('dj-lang') === 'en' ? 'en' : 'zh';
function render() {
  const en = lang === 'en';
  document.documentElement.lang = en ? 'en' : 'zh-CN';
  document.title = en ? 'Dingjian | Industrial Weighbridges' : '顶尖称重设备 | 工业汽车衡';
  for (const [el, zh, english] of translations) el.innerHTML = en ? english : zh;
  document.querySelectorAll('[data-guide-hub]').forEach(link => link.href = '/' + lang + '/topics.html');
  document.querySelectorAll('[data-guide-page]').forEach(link => {
    const slug = window.guidePaths?.[link.dataset.guidePage];
    if (slug) link.href = '/' + lang + '/' + slug + '.html';
  });
  const toggle = document.querySelector('#lang');
  toggle.textContent = en ? '中文' : 'EN';
  toggle.setAttribute('aria-label', en ? '切换到中文' : 'Switch to English');
  document.querySelector('#cards').replaceChildren(...products.map(p => {
    const card = document.createElement('article');
    const img = document.createElement('img');
    img.src = 'assets/' + p[0];
    img.alt = p[en ? 2 : 1];
    img.loading = 'lazy';
    const heading = document.createElement('h3');
    heading.textContent = img.alt;
    const description = document.createElement('p');
    description.textContent = p[en ? 4 : 3];
    const link = document.createElement('a');
    const slug = window.guidePaths?.[p[5]];
    link.href = slug ? '/' + lang + '/' + slug + '.html' : 'catalog.html?p=' + p[5];
    link.textContent = en ? 'Product details' : '查看产品详情';
    card.append(img, heading, description, link);
    return card;
  }));
}
document.querySelector('#lang').onclick = () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('dj-lang', lang);
  render();
};
render();
