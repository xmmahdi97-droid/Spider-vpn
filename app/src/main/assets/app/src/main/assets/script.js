'use strict';
/* Spider VPN prototype — UI and config management only. No tunnel exists. */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

const T = {
en:{proto:'Prototype',home:'Home',servers:'Servers',configs:'Configurations',configsShort:'Configs',stats:'Statistics',settings:'Settings',about:'About Spider VPN',ping:'Ping',duration:'Duration',down:'Download',up:'Upload',total:'Total traffic',session:'Session',search:'Search servers',sName:'Name',sPing:'Ping',sFav:'Favorites',auto:'Auto select',demoPing:'Demo ping',group:'Group by country',pasteHint:'Paste a vless:// or trojan:// link',save:'Save',file:'Import file',scan:'Scan QR',simNote:'Simulated demonstration data. No real traffic is measured.',week:'Last 7 days (simulated)',lang:'Language',dark:'Dark theme',anim:'Animations',manage:'Manage configurations',clear:'Clear local data',tag:'A modern VPN client interface.',by:'Created by:',author:'Mehdi Ebrahimi',noVpn:'Frontend prototype. No real VPN connection exists yet.',back:'Back',close:'Close',name:'Name',disc:'Disconnected',conn:'Connecting…',noEngine:'Native VPN engine not available in this prototype.',tapNo:'Add a configuration to begin',tapGo:'Tap to try connecting',noSel:'No server selected',choose:'Choose a server',noCfg:'No configurations yet. Paste a link, import a file or scan a QR code.',pingNone:'Not measured',pingSim:'Values marked "demo" are simulated, not real measurements.',pingReal:'Real ping needs the native engine. Nothing measured yet.',edit:'Rename',dup:'Duplicate',del:'Delete',fav:'Favorite',use:'Use',selected:'Selected',unknown:'Other',saved:'Saved',deleted:'Deleted',copied:'Duplicated',cleared:'Local data cleared',confirmClear:'Delete all configurations and settings?',confirmDel:'Delete this configuration?',selAuto:'Auto-selected',eEmpty:'Paste a configuration link first.',eScheme:'Unsupported protocol. Only vless:// and trojan:// are supported.',eParse:'The link is malformed.',eHost:'Missing server address.',ePort:'Port must be between 1 and 65535.',eUuid:'VLESS needs a valid UUID before the @.',ePass:'Trojan needs a password before the @.',eDup:'This configuration is already saved.',eNone:'No valid vless:// or trojan:// link found.',qrAsk:'Point the camera at a QR code.',qrNo:'QR scanning is not available here. Paste the link or import a file instead.',qrDenied:'Camera access was denied. Paste the link or import a file instead.',imported:'imported'},
fa:{proto:'نسخه نمایشی',home:'خانه',servers:'سرورها',configs:'پیکربندی‌ها',configsShort:'کانفیگ',stats:'آمار',settings:'تنظیمات',about:'درباره اسپایدر وی‌پی‌ان',ping:'پینگ',duration:'مدت',down:'دانلود',up:'آپلود',total:'کل ترافیک',session:'نشست',search:'جستجوی سرور',sName:'نام',sPing:'پینگ',sFav:'علاقه‌مندی‌ها',auto:'انتخاب خودکار',demoPing:'پینگ آزمایشی',group:'گروه‌بندی بر اساس کشور',pasteHint:'لینک vless:// یا trojan:// را جای‌گذاری کنید',save:'ذخیره',file:'وارد کردن فایل',scan:'اسکن QR',simNote:'داده‌های نمایشی و شبیه‌سازی‌شده. ترافیک واقعی اندازه‌گیری نمی‌شود.',week:'۷ روز گذشته (شبیه‌سازی)',lang:'زبان',dark:'تم تیره',anim:'انیمیشن‌ها',manage:'مدیریت پیکربندی‌ها',clear:'پاک کردن داده‌های محلی',tag:'یک رابط کاربری مدرن برای کلاینت VPN.',by:'ساخته شده توسط',author:'مهدی ابراهیمی',noVpn:'نمونه اولیه رابط کاربری. هنوز اتصال VPN واقعی وجود ندارد.',back:'بازگشت',close:'بستن',name:'نام',disc:'قطع',conn:'در حال اتصال…',noEngine:'موتور بومی VPN در این نمونه موجود نیست.',tapNo:'برای شروع یک پیکربندی اضافه کنید',tapGo:'برای تلاش اتصال لمس کنید',noSel:'سروری انتخاب نشده',choose:'انتخاب سرور',noCfg:'هنوز پیکربندی‌ای نیست. لینک را جای‌گذاری کنید، فایل وارد کنید یا QR اسکن کنید.',pingNone:'اندازه‌گیری نشده',pingSim:'مقادیر «آزمایشی» شبیه‌سازی هستند، نه اندازه‌گیری واقعی.',pingReal:'پینگ واقعی نیازمند موتور بومی است. هنوز چیزی اندازه‌گیری نشده.',edit:'تغییر نام',dup:'تکثیر',del:'حذف',fav:'علاقه‌مندی',use:'استفاده',selected:'انتخاب‌شده',unknown:'سایر',saved:'ذخیره شد',deleted:'حذف شد',copied:'تکثیر شد',cleared:'داده‌های محلی پاک شد',confirmClear:'همه پیکربندی‌ها و تنظیمات حذف شود؟',confirmDel:'این پیکربندی حذف شود؟',selAuto:'انتخاب خودکار انجام شد',eEmpty:'ابتدا لینک پیکربندی را جای‌گذاری کنید.',eScheme:'پروتکل پشتیبانی نمی‌شود. فقط vless:// و trojan:// پشتیبانی می‌شوند.',eParse:'ساختار لینک نامعتبر است.',eHost:'آدرس سرور وجود ندارد.',ePort:'پورت باید بین ۱ تا ۶۵۵۳۵ باشد.',eUuid:'VLESS به UUID معتبر قبل از @ نیاز دارد.',ePass:'Trojan به رمز عبور قبل از @ نیاز دارد.',eDup:'این پیکربندی قبلاً ذخیره شده است.',eNone:'لینک معتبر vless:// یا trojan:// پیدا نشد.',qrAsk:'دوربین را روی QR بگیرید.',qrNo:'اسکن QR در اینجا در دسترس نیست. لینک را جای‌گذاری یا فایل را وارد کنید.',qrDenied:'دسترسی به دوربین رد شد. لینک را جای‌گذاری یا فایل را وارد کنید.',imported:'وارد شد'}
};

const store = {
 get(k,d){try{const v=localStorage.getItem('spider.'+k);return v===null?d:JSON.parse(v)}catch{return d}},
 set(k,v){try{localStorage.setItem('spider.'+k,JSON.stringify(v))}catch{}}
};

const S={cfgs:store.get('configs',[]),sel:store.get('selected',null),favs:store.get('favs',[]),set:Object.assign({lang:'en',dark:true,anim:true},store.get('settings',{})),demo:{},state:'disconnected'};
const t=k=>(T[S.set.lang]&&T[S.set.lang][k])||T.en[k]||k;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
const toast=m=>{const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2600)};

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseLink(raw){
 const s=(raw||'').trim();if(!s)return{err:'eEmpty'};
 const m=s.match(/^([a-z0-9+.-]+):\/\//i);if(!m)return{err:'eParse'};
 const proto=m[1].toLowerCase();if(proto!=='vless'&&proto!=='trojan')return{err:'eScheme'};
 let u;try{u=new URL(s)}catch{return{err:'eParse'}}
 const host=u.hostname.replace(/^\[|\]$/g,'');if(!host)return{err:'eHost'};
 const port=Number(u.port);if(!Number.isInteger(port)||port<1||port>65535)return{err:'ePort'};
 const id=decodeURIComponent(u.username||'');
 if(proto==='vless'&&!UUID.test(id))return{err:'eUuid'};
 if(proto==='trojan'&&!id)return{err:'ePass'};
 const params=Object.fromEntries(u.searchParams.entries());
 const name=decodeURIComponent((u.hash||'').slice(1))||`${host}:${port}`;
 return{cfg:{id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),name,proto,host,port,params,link:s,country:detectCountry(name)}};
}

function detectCountry(name){
 const m=name.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
 if(!m)return null;
 const cp=[...m[0]].map(c=>String.fromCharCode(c.codePointAt(0)-0x1F1E6+65)).join('');
 return{code:cp,flag:m[0]};
}

function extractLinks(text){return(text.match(/(vless|trojan):\/\/[^\s"'<>]+/gi)||[])}

function addFromText(text){
 const links=extractLinks(text),err=$('#cfgErr');err.textContent='';
 if(!links.length){
  const r=parseLink(text);
  err.textContent=t(r.err==='eScheme'||r.err==='eEmpty'?r.err:(text.trim()?'eNone':'eEmpty'));
  if(r.err&&r.err!=='eScheme'&&r.err!=='eEmpty'&&text.trim())err.textContent=t(r.err);
  return 0;
 }
 let n=0,last='';
 links.forEach(l=>{
  const r=parseLink(l);
  if(r.err){last=t(r.err);return}
  if(S.cfgs.some(c=>c.link===r.cfg.link)){last=t('eDup');return}
  S.cfgs.push(r.cfg);n++;if(!S.sel)S.sel=r.cfg.id;
 });
 if(n){persist();$('#paste').value='';toast(`${n} ${t('saved')}`);renderAll()}
 else err.textContent=last;
 return n;
}

function persist(){store.set('configs',S.cfgs);store.set('selected',S.sel);store.set('favs',S.favs);store.set('settings',S.set)}

function go(id){
 $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
 const tab=['about'].includes(id)?'settings':id;
 $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===tab));
 scrollTo({top:0});if(id==='stats')drawChart();
}

document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});

function applyLang(){
 const fa=S.set.lang==='fa';
 document.documentElement.lang=S.set.lang;
 document.documentElement.dir=fa?'rtl':'ltr';
 $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $$('[data-ph]').forEach(e=>e.placeholder=t(e.dataset.ph));
 $('#lang').value=S.set.lang;renderAll();
}

function applyTheme(){
 document.documentElement.dataset.theme=S.set.dark?'dark':'light';
 document.body.classList.toggle('no-anim',!S.set.anim);
 $('#dark').checked=S.set.dark;$('#anim').checked=S.set.anim;
}

const cur=()=>S.cfgs.find(c=>c.id===S.sel)||null;
const flag=c=>c.country?c.country.flag:'🌐';

function renderHome(){
 const c=cur(),st=S.state;
 $('#statusText').textContent=st==='connecting'?t('conn'):t('disc');
 $('#statusSub').textContent=st==='connecting'?'':(c?t('tapGo'):t('tapNo'));
 $('#orb').className='orb '+st;
 $('#selCard').innerHTML=c
 ?`<span class="fl">${flag(c)}</span><div><b>${esc(c.name)}</b><small>${c.proto.toUpperCase()} · ${esc(c.host)}</small></div><span class="tag">${S.demo[c.id]?S.demo[c.id]+' ms (demo)':'—'}</span>`
 :`<span class="fl">🌐</span><div><b>${t('noSel')}</b><small>${t('choose')}</small></div>`;
 $('#hPing').textContent=c&&S.demo[c.id]?S.demo[c.id]+' ms (demo)':'—';
}

$('#orb').addEventListener('click',()=>{
 if(S.state==='connecting')return;
 if(!cur()){toast(t('tapNo'));go('configs');return}
 S.state='connecting';renderHome();
 setTimeout(()=>{
  const ok=window.SpiderNative&&typeof window.SpiderNative.isConnected==='function'&&window.SpiderNative.isConnected();
  S.state=ok?'connected':'disconnected';
  if(!ok)toast(t('noEngine'));
  renderHome();
 },1800);
});

function serverRow(c){
 const fav=S.favs.includes(c.id),p=S.demo[c.id];
 return `<div class="card item ${c.id===S.sel?'on':''}" data-id="${c.id}"><span class="fl">${flag(c)}</span>
 <div class="m" data-act="use"><b>${esc(c.name)}</b><small><span class="tag">${c.proto.toUpperCase()}</span> ${p?p+' ms (demo)':t('pingNone')}${c.id===S.sel?' · '+t('selected'):''}</small></div>
 <button class="ic fav" data-act="fav" aria-label="${t('fav')}">${fav?'★':'☆'}</button></div>`;
}

function renderServers(){
 const q=$('#q').value.trim().toLowerCase(),sort=$('#sort').value;
 let l=S.cfgs.filter(c=>!q||(c.name+c.host).toLowerCase().includes(q));
 l.sort((a,b)=>sort==='ping'?(S.demo[a.id]??1e9)-(S.demo[b.id]??1e9):sort==='fav'?(S.favs.includes(b.id)-S.favs.includes(a.id))||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
 $('#pingNote').textContent=Object.keys(S.demo).length?t('pingSim'):t('pingReal');
 let h='';
 if(!l.length)h=`<p class="note">${t('noCfg')}</p>`;
 else if($('#group').checked){
  const g={};l.forEach(c=>(g[c.country?c.country.flag+' '+c.country.code:'🌐 '+t('unknown')]??=[]).push(c));
  Object.keys(g).forEach(k=>h+=`<div class="gh">${k}</div>`+g[k].map(serverRow).join(''));
 }else h=l.map(serverRow).join('');
 $('#serverList').innerHTML=h;
}

$('#serverList').addEventListener('click',e=>{
 const row=e.target.closest('.item');if(!row)return;
 const id=row.dataset.id,a=e.target.closest('[data-act]')?.dataset.act;
 if(a==='fav')S.favs=S.favs.includes(id)?S.favs.filter(x=>x!==id):[...S.favs,id];
 else if(a==='use'){S.sel=id;toast(t('selected'))}
 persist();renderAll();
});

$('#q').addEventListener('input',renderServers);
$('#sort').addEventListener('change',renderServers);
$('#group').addEventListener('change',renderServers);
$('#demoPing').addEventListener('click',()=>{S.cfgs.forEach(c=>S.demo[c.id]=30+Math.floor(Math.random()*220));renderAll()});

$('#autoBtn').addEventListener('click',()=>{
 if(!S.cfgs.length){toast(t('tapNo'));return}
 const best=[...S.cfgs].sort((a,b)=>(S.demo[a.id]??1e9)-(S.demo[b.id]??1e9))[0];
 S.sel=best.id;persist();renderAll();toast(t('selAuto'));
});

function renderCfgs(){
 $('#cfgList').innerHTML=S.cfgs.length?S.cfgs.map(c=>`<div class="card item ${c.id===S.sel?'on':''}" data-id="${c.id}"><span class="fl">${flag(c)}</span>
 <div class="m" data-act="use"><b>${esc(c.name)}</b><small>${c.proto.toUpperCase()} · ${esc(c.host)}:${c.port}</small></div>
 <button class="ic" data-act="edit" title="${t('edit')}" aria-label="${t('edit')}">✎</button>
 <button class="ic" data-act="dup" title="${t('dup')}" aria-label="${t('dup')}">⧉</button>
 <button class="ic" data-act="del" title="${t('del')}" aria-label="${t('del')}">🗑</button></div>`).join(''):`<p class="note">${t('noCfg')}</p>`;
}

let editId=null;
$('#cfgList').addEventListener('click',e=>{
 const row=e.target.closest('.item');if(!row)return;
 const id=row.dataset.id,a=e.target.closest('[data-act]')?.dataset.act,c=S.cfgs.find(x=>x.id===id);
 if(a==='use'){S.sel=id;persist();renderAll();toast(t('selected'))}
 if(a==='edit'){editId=id;$('#editName').value=c.name;$('#editModal').hidden=false;$('#editName').focus()}
 if(a==='dup'){S.cfgs.splice(S.cfgs.indexOf(c)+1,0,{...c,id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:c.name+' (2)'});persist();renderAll();toast(t('copied'))}
 if(a==='del'&&confirm(t('confirmDel'))){
  S.cfgs=S.cfgs.filter(x=>x.id!==id);S.favs=S.favs.filter(x=>x!==id);
  if(S.sel===id)S.sel=S.cfgs[0]?.id||null;
  persist();renderAll();toast(t('deleted'));
 }
});

$('#editOk').onclick=()=>{
 const n=$('#editName').value.trim(),c=S.cfgs.find(x=>x.id===editId);
 if(c&&n){c.name=n;c.country=detectCountry(n)||c.country;persist();renderAll();toast(t('saved'))}
 $('#editModal').hidden=true;
};
$('#editNo').onclick=()=>$('#editModal').hidden=true;
$('#saveCfg').onclick=()=>addFromText($('#paste').value);
$('#fileBtn').onclick=()=>$('#file').click();

$('#file').addEventListener('change',async e=>{
 const f=e.target.files[0];if(!f)return;
 if(f.size>1e6){$('#cfgErr').textContent=t('eParse');return}
 addFromText(await f.text());e.target.value='';
});

let stream=null,scanning=false;
function stopQR(){
 scanning=false;stream?.getTracks().forEach(x=>x.stop());stream=null;$('#qrModal').hidden=true;
}
$('#qrClose').onclick=stopQR;
$('#qrBtn').onclick=async()=>{
 const msg=$('#qrMsg');$('#qrModal').hidden=false;msg.textContent=t('qrAsk');
 if(!('BarcodeDetector'in window)||!navigator.mediaDevices?.getUserMedia){msg.textContent=t('qrNo');return}
 try{
  const det=new BarcodeDetector({formats:['qr_code']});
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
  const v=$('#qrVideo');v.srcObject=stream;await v.play();scanning=true;
  (async function loop(){
   while(scanning){
    try{const r=await det.detect(v);if(r.length){const n=addFromText(r[0].rawValue);stopQR();if(!n)go('configs');return}}
    catch{}
    await new Promise(r=>setTimeout(r,300));
   }
  })();
 }catch(err){msg.textContent=(err&&err.name==='NotAllowedError')?t('qrDenied'):t('qrNo')}
};

const week=[34,58,41,76,52,90,63];
function drawChart(){
 const mx=Math.max(...week);
 $('#chart').innerHTML=week.map((v,i)=>`<rect x="${i*40+6}" y="${120-v/mx*108}" width="28" height="${v/mx*108}" rx="6" style="animation-delay:${i*70}ms"/>`).join('');
 const d=week.reduce((a,b)=>a+b,0);
 $('#sDown').textContent=(d*.8).toFixed(0)+' MB';
 $('#sUp').textContent=(d*.2).toFixed(0)+' MB';
 $('#sTot').textContent=d+' MB';
 $('#sDur').textContent='00:00:00';
}

$('#lang').onchange=e=>{S.set.lang=e.target.value;persist();applyLang()};
$('#dark').onchange=e=>{S.set.dark=e.target.checked;persist();applyTheme()};
$('#anim').onchange=e=>{S.set.anim=e.target.checked;persist();applyTheme()};

$('#clear').onclick=()=>{
 if(!confirm(t('confirmClear')))return;
 Object.keys(localStorage).filter(k=>k.startsWith('spider.')).forEach(k=>localStorage.removeItem(k));
 S.cfgs=[];S.sel=null;S.favs=[];S.demo={};S.set={lang:S.set.lang,dark:true,anim:true};
 applyTheme();applyLang();toast(t('cleared'));
};

function renderAll(){renderHome();renderServers();renderCfgs()}
$('.about .logo').innerHTML=$('.top .logo').innerHTML;
$('.about .logo').setAttribute('viewBox','0 0 48 48');
$('.about .logo').style.color='var(--g)';
applyTheme();applyLang();go('home');

window.SpiderVPNTest=()=>{
 const u='123e4567-e89b-12d3-a456-426614174000';
 return{
  vless:!parseLink(`vless://${u}@example.com:443?type=ws#Test`).err,
  trojan:!parseLink('trojan://pw@example.com:443#T').err,
  vmewRejected:parseLink('vmess://abc').err==='eScheme',
  ssRejected:parseLink('ss://abc').err==='eScheme',
  badPort:parseLink(`vless://${u}@example.com:99999`).err==='ePort',
  badUuid:parseLink('vless://nope@example.com:443').err==='eUuid'
 };
};
