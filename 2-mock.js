(function(){
const $=id=>document.getElementById(id);
st.m=st.m||[];st.mt=st.mt||{};
const box=$('mock');let tm=null,S=st.mc||null,cfg=Object.assign({n:10,l:'',t:120},st.mcfg||{});
const fld=()=>FS.find(x=>x.id===fid);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const avail=(f,l)=>f.topics.reduce((a,t)=>a+t.q.filter(x=>!l||x[0]===l).length,0);
function pick(f,n,l){const by={};f.topics.forEach(t=>{by[t.id]=shuffle(t.q.map((x,i)=>[t.id,i,x[0]]).filter(x=>!l||x[2]===l))});
const out=[];let more=true;while(out.length<n&&more){more=false;shuffle(f.topics.slice()).forEach(t=>{if(out.length<n&&by[t.id].length){const p=by[t.id].pop();out.push([p[0],p[1]]);more=true}})}return shuffle(out)}
const fi=(f,id)=>f.topics.find(t=>t.id===id);
const item=(k)=>{const f=FS.find(x=>x.id===S.f),t=fi(f,S.ids[k][0]);return{t,it:t.q[S.ids[k][1]]}};
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const persist=()=>{st.mc=S;st.mcfg=cfg;save()};
function stopT(){if(tm){clearInterval(tm);tm=null}}
function start(ids,f){S={f:f.id,ids:ids,idx:0,r:[],txt:[],limit:cfg.t,phase:'q',left:cfg.t,ts:Date.now(),timed:false};persist();view();window.scrollTo({top:box.offsetTop-80,behavior:'smooth'})}
function chips(name,opts,val){return '<div class="mchips" data-n="'+name+'">'+opts.map(o=>'<button class="chip" data-v="'+o[0]+'" aria-pressed="'+(String(o[0])===String(val))+'">'+o[1]+'</button>').join('')+'</div>'}
function setup(){stopT();const f=fld();const A=avail(f,cfg.l);
const ns=[5,10,15,20].filter(n=>n<=A);if(!ns.length)ns.push(A);if(!ns.includes(cfg.n)){cfg.n=ns.includes(10)?10:ns[ns.length-1]}
let h='<div class="mcard"><h2 class="mh">🎯 محاكاة مقابلة: '+esc(f.name)+'</h2><p class="sub">أسئلة عشوائية من مجالك. جاوب بصوت عالي أو اكتب إجابتك، اعرض الإجابة النموذجية، وقيّم نفسك بصدق. في الآخر بتاخد نتيجتك ونقاط ضعفك.</p>';
if(S&&S.phase!=='done'){const sf=FS.find(x=>x.id===S.f);h+='<div class="mresume"><b>عندك محاكاة لسه ما خلصتش</b> ('+esc(sf.name)+'، سؤال '+(S.idx+1)+' من '+S.ids.length+')<div class="act"><button class="btn on" id="mres">كمّل</button><button class="btn" id="mdis">امسحها</button></div></div>'}
h+='<div class="mrow"><span>عدد الأسئلة</span>'+chips('n',ns.map(n=>[n,n]),cfg.n)+'</div>';
h+='<div class="mrow"><span>المستوى</span>'+chips('l',[['','الكل'],['e','سهل'],['m','متوسط'],['h','صعب']],cfg.l)+'</div>';
h+='<div class="mrow"><span>الوقت لكل سؤال</span>'+chips('t',[[0,'بدون'],[60,'دقيقة'],[120,'دقيقتين'],[180,'3 دقايق']],cfg.t)+'</div>';
h+='<button class="btn mstart" id="mgo">ابدأ المحاكاة ('+Math.min(cfg.n,A)+' سؤال)</button></div>';
const hist=st.m.filter(x=>x.f===f.id);
if(hist.length){const best=Math.max(...hist.map(x=>x.pct));h+='<div class="mcard"><h3 class="mh">سجلك في '+esc(f.name)+'</h3><div class="stats"><div class="stat"><b>'+hist.length+'</b> محاولة</div><div class="stat">أحسن نتيجة <b>'+best+'%</b></div><div class="stat">آخر نتيجة <b>'+hist[hist.length-1].pct+'%</b></div></div>';
h+='<div class="mhist">'+hist.slice(-5).reverse().map(x=>'<div class="mh1"><span>'+new Date(x.ts).toLocaleDateString('ar-EG')+'</span><span>'+x.n+' سؤال</span><b>'+x.pct+'%</b></div>').join('')+'</div>';
const wk=Object.keys(st.mt).filter(k=>k.startsWith(f.id+'/')&&st.mt[k].n>=2).map(k=>[st.mt[k],st.mt[k].s/st.mt[k].n]).sort((a,b)=>a[1]-b[1]).slice(0,4);
if(wk.length)h+='<h4 class="mh4">أضعف المحاور عندك (من كل المحاولات)</h4>'+wk.map(w=>bar(w[0].name,Math.round(w[1]*100))).join('');
h+='</div>'}
box.innerHTML=h;
box.querySelectorAll('.mchips').forEach(g=>g.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const k=g.dataset.n,v=b.dataset.v;cfg[k]=k==='l'?v:Number(v);persist();setup()}));
$('mgo').onclick=()=>start(pick(f,cfg.n,cfg.l),f);
if($('mres'))$('mres').onclick=()=>{if(S.f!==fid){setField(S.f);render()}view()};
if($('mdis'))$('mdis').onclick=()=>{S=null;persist();setup()}}
function bar(name,p){const c=p>=75?'g':p>=50?'a':'r';return '<div class="mbar"><div class="mbl"><span>'+esc(name)+'</span><b>'+p+'%</b></div><div class="bar"><div class="fill '+c+'" style="width:'+p+'%"></div></div></div>'}
function view(){stopT();if(!S)return setup();if(S.phase==='done')return result();if(S.f!==fid)return setup();return ask()}
function ask(){const k=S.idx,n=S.ids.length,{t,it}=item(k),rev=S.phase==='rev';
let h='<div class="mcard"><div class="mtop"><span class="tag">'+(k+1)+' / '+n+'</span><span class="lv '+it[0]+'">'+L[it[0]]+'</span><span class="tag">'+t.icon+' '+esc(t.name)+'</span>'+(S.limit?'<span class="mtimer" id="mtm" dir="ltr">'+mmss(S.left)+'</span>':'')+'</div>';
h+='<div class="bar mprog"><div class="fill" style="width:'+(k/n*100)+'%"></div></div><h3 class="mq">'+esc(it[1])+'</h3>';
if(!rev){h+='<textarea id="mtx" rows="4" placeholder="اكتب إجابتك هنا (اختياري) أو قولها بصوت عالي كأنك في المقابلة...">'+esc(S.txt[k]||'')+'</textarea><div class="act"><button class="btn on" id="mshow">اعرض الإجابة النموذجية</button><button class="btn" id="mquit">إنهاء المحاكاة</button></div>'}
else{if(S.txt[k])h+='<div class="mmine"><b>إجابتك:</b><p>'+esc(S.txt[k])+'</p></div>';if(S.to)h+='<p class="mto">⏰ الوقت خلص</p>';
h+='<div class="mmodel"><b>الإجابة النموذجية:</b>'+fmt(it[2])+'</div><p class="sub" style="margin:12px 0 6px">قيّم إجابتك بصدق:</p><div class="mrate"><button class="btn r1" data-r="1">✅ جاوبت صح</button><button class="btn r2" data-r="0.5">🟡 جزء منها</button><button class="btn r3" data-r="0">❌ معرفتش</button></div>'}
h+='</div>';box.innerHTML=h;
const tx=$('mtx');if(tx){tx.oninput=()=>{S.txt[k]=tx.value}}
if($('mshow'))$('mshow').onclick=()=>reveal(false);
if($('mquit'))$('mquit').onclick=()=>{if(confirm('تنهي المحاكاة؟ هتتحسب النتيجة بالأسئلة اللي جاوبتها بس.'))finish(true)};
box.querySelectorAll('.mrate .btn').forEach(b=>b.onclick=()=>rate(Number(b.dataset.r)));
if(!rev&&S.limit){S.dl=Date.now()+S.left*1000;tm=setInterval(()=>{const l=Math.max(0,Math.ceil((S.dl-Date.now())/1000));S.left=l;const e=$('mtm');if(e){e.textContent=mmss(l);e.classList.toggle('low',l<=15)}if(l<=0)reveal(true)},250)}}
function reveal(to){stopT();const tx=$('mtx');if(tx)S.txt[S.idx]=tx.value;S.phase='rev';S.to=to;persist();ask()}
function rate(r){S.r[S.idx]=r;S.idx++;S.phase='q';S.to=false;S.left=S.limit;if(S.idx>=S.ids.length)return finish(false);persist();ask();window.scrollTo({top:box.offsetTop-80,behavior:'smooth'})}
function finish(early){stopT();if(early){S.ids=S.ids.slice(0,S.r.length)}
if(!S.ids.length){S=null;persist();return setup()}
S.phase='done';const f=FS.find(x=>x.id===S.f);
if(!S.rec){S.rec=1;const sc=S.r.reduce((a,b)=>a+b,0);st.m.push({f:S.f,ts:Date.now(),n:S.ids.length,pct:Math.round(sc/S.ids.length*100)});st.m=st.m.slice(-40);
S.ids.forEach((id,k)=>{const key=S.f+'/'+id[0],o=st.mt[key]||{s:0,n:0,name:fi(f,id[0]).name};o.s+=S.r[k];o.n++;st.mt[key]=o})}
persist();result()}
function result(){const f=FS.find(x=>x.id===S.f),n=S.ids.length,sc=S.r.reduce((a,b)=>a+b,0),pct=Math.round(sc/n*100);
const msg=pct>=85?'ممتاز 🔥 جاهز للمقابلة':pct>=65?'كويس 👍 شوية مراجعة وتبقى جاهز':pct>=40?'محتاج مذاكرة 📚 راجع نقاط الضعف تحت':'ابدأ من الأساسيات 💪 ومحاولة كمان بعد المذاكرة';
const by={};S.ids.forEach((id,k)=>{const o=by[id[0]]=by[id[0]]||{s:0,n:0,name:fi(f,id[0]).name};o.s+=S.r[k];o.n++});
const rows=Object.values(by).map(o=>[o.name,Math.round(o.s/o.n*100),o.n]).sort((a,b)=>a[1]-b[1]);
const weak=rows.filter(r=>r[1]<60);const miss=S.ids.map((id,k)=>k).filter(k=>S.r[k]<1);
let h='<div class="mcard mres"><div class="mscore"><b>'+pct+'%</b><span>'+sc+' من '+n+'</span></div><h2 class="mh">'+msg+'</h2><h4 class="mh4">أداءك حسب المحور</h4>'+rows.map(r=>bar(r[0]+' ('+r[2]+')',r[1])).join('');
h+=weak.length?'<div class="tipbox">🎯 نقاط الضعف: '+weak.map(r=>esc(r[0])).join('، ')+'. ارجع لتبويب المذاكرة وراجع أسئلتها.</div>':'<div class="tipbox">مفيش محور تحت 60%، كمّل محاكاة بمستوى أصعب.</div>';
h+='<div class="act mwrap"><button class="btn on" id="magain">محاكاة جديدة</button>'+(miss.length?'<button class="btn" id="mweak">أعد الأسئلة اللي غلطت فيها ('+miss.length+')</button>':'')+'<button class="btn" id="mstudy">رجوع للمذاكرة</button></div></div>';
if(miss.length){h+='<div class="mcard"><h3 class="mh">أسئلة محتاجة مراجعة</h3>'+miss.map(k=>{const{t,it}=item(k);return '<div class="item"><button class="qh" aria-expanded="false"><span class="lv '+it[0]+'">'+(S.r[k]===0?'❌':'🟡')+'</span><span class="t">'+esc(it[1])+'</span><span class="chev">▾</span></button><div class="ans">'+fmt(it[2])+'</div></div>'}).join('')+'</div>'}
box.innerHTML=h;
box.querySelectorAll('.qh').forEach(b=>b.onclick=()=>{const d=b.parentNode,o=d.classList.toggle('open');b.setAttribute('aria-expanded',o)});
$('magain').onclick=()=>{S=null;persist();setup()};
if($('mweak'))$('mweak').onclick=()=>{const ids=miss.map(k=>S.ids[k]);start(shuffle(ids),f)};
$('mstudy').onclick=()=>mode('study')}
function mode(m){st.mode=m;save();apply()}
function apply(){const m=st.mode==='mock';['#tabs','.tools','#list'].forEach(i=>document.querySelector(i).hidden=m);box.hidden=!m;
document.querySelectorAll('#modes .mode').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===(m?'mock':'study')));
if(m)view();else stopT()}
document.querySelectorAll('#modes .mode').forEach(b=>b.onclick=()=>mode(b.dataset.m));
const R=window.render;window.render=function(){R();if(st.mode==='mock'){if(!box.hidden&&S&&S.f===fid&&S.phase!=='done'&&tm)return;apply()}};
document.addEventListener('visibilitychange',()=>{if(S&&S.phase==='q'&&S.limit&&document.hidden){persist()}});
window.addEventListener('pagehide',()=>{if(S)persist()});
if(location.hash==='#mock')st.mode='mock';
apply();
})();
