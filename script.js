(function(){
  var r=document.documentElement,b=document.getElementById("theme");
  try{var s=localStorage.getItem("theme");if(s)r.setAttribute("data-theme",s)}catch(e){}
  b.addEventListener("click",function(){
    var n=r.getAttribute("data-theme")==="dark"?"light":"dark";
    r.setAttribute("data-theme",n);
    try{localStorage.setItem("theme",n)}catch(e){}
  });
})();


(function(){
var hero=document.querySelector(".hero"),stage=hero.querySelector(".stage"),btn=document.getElementById("replay");
var E={hi:hero.querySelector(".hi"),name:document.getElementById("t-name"),role:document.getElementById("t-role"),pic:document.getElementById("t-pic"),btns:document.getElementById("t-btns"),ghost:hero.querySelector(".ghost")};
var run=0;
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){btn.hidden=true;return}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function rect(el){var h=hero.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left-h.left,y:r.top-h.top,w:r.width,h:r.height}}
function split(el){el._t=el._t||el.textContent;el.textContent="";return Array.from(el._t).map(function(c){var s=document.createElement("span");s.className="ch";s.textContent=c;el.appendChild(s);return s})}
function restore(){["hi","name","role"].forEach(function(k){if(E[k]._t)E[k].textContent=E[k]._t});E.name.style.background="";E.pic.style.clipPath="";E.btns.style.opacity="";E.ghost.style.opacity=""}
function cursor(color,label,x,y){var c=document.createElement("div");c.className="cur";c.style.setProperty("--c",color);c.innerHTML='<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1l15 9-6.5 1.8L7.2 19z" style="fill:var(--c)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span>'+label+"</span>";c.style.setProperty("--t","0s");c.style.transform="translate("+x+"px,"+y+"px)";stage.appendChild(c);c.offsetWidth;return c}
function move(c,x,y,t){c.style.setProperty("--t",t+"s");c.style.transform="translate("+x+"px,"+y+"px)"}
async function pick(c,el,id){
 var r=rect(el),p=8,b=document.createElement("div");
 move(c,r.x-p,r.y-p,.8);await wait(850);if(id!==run)return null;
 b.className="box";b.style.left=r.x-p+"px";b.style.top=r.y-p+"px";b.innerHTML="<i></i><i></i><i></i><i></i>";stage.appendChild(b);b.offsetWidth;
 b.style.width=r.w+2*p+"px";b.style.height=r.h+2*p+"px";move(c,r.x+r.w+p,r.y+r.h+p,.6);await wait(700);
 return id===run?b:null}
async function typeIn(c,chars,id,gap){
 for(var i=0;i<chars.length;i++){if(id!==run)return false;chars[i].classList.add("on");var r=rect(chars[i]);move(c,r.x+r.w,r.y+r.h*.7,.1);await wait(gap)}
 return true}
function drop(b){if(!b)return;b.style.opacity=0;setTimeout(function(){b.remove()},600)}
async function play(){
 var id=++run;stage.innerHTML="";restore();
 var H=split(E.hi),N=split(E.name),R=split(E.role);
 E.name.style.background="transparent";E.pic.style.clipPath="inset(0 0 100% 0)";E.btns.style.opacity="0";E.ghost.style.opacity="0";
 await Promise.race([document.fonts?document.fonts.ready:wait(0),wait(1200)]);
 if(id!==run)return;
 var hr=hero.getBoundingClientRect();
 var A=cursor("#4d9bff","Design",hr.width-60,hr.height-40),B=cursor("#ff2a33","Code",-20,60);
 async function ta(){
  move(A,hr.width*.55,hr.height*.12,1);await wait(1000);if(id!==run)return;
  E.ghost.style.opacity="";await wait(900);
  var b=await pick(A,E.pic,id);if(!b)return;
  E.pic.style.clipPath="inset(0)";await wait(1100);drop(b);
  if(id!==run)return;
  move(A,hr.width-70,hr.height-60,1.2)}
 async function tb(){
  var q=rect(E.hi);move(B,q.x,q.y+10,.6);await wait(650);
  if(!await typeIn(B,H,id,45))return;
  var b=await pick(B,E.name,id);if(!b)return;
  E.name.style.background="";await wait(200);
  if(!await typeIn(B,N,id,110))return;drop(b);
  b=await pick(B,E.role,id);if(!b)return;
  if(!await typeIn(B,R,id,22))return;drop(b);
  b=await pick(B,E.btns,id);if(!b)return;
  E.btns.style.opacity="1";await wait(900);drop(b);
  move(B,hr.width*.45,hr.height-30,1.1)}
 await Promise.all([ta(),tb()]);
 if(id!==run)return;
 await wait(900);A.style.opacity=0;B.style.opacity=0;await wait(500);
 if(id!==run)return;
 stage.innerHTML="";restore()}
btn.addEventListener("click",play);
play();
})();


(function(){
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var layer=document.createElement("div");layer.className="cursors";layer.setAttribute("aria-hidden","true");document.body.appendChild(layer);
var defs=[["#4d9bff","Design"],["#ff2a33","Code"],["#2fbf71","Copy"],["#a46bff","Motion"]];
var pool=defs.map(function(d){var c=document.createElement("div");c.className="cur";c.style.setProperty("--c",d[0]);c.style.opacity=0;c.innerHTML='<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1l15 9-6.5 1.8L7.2 19z" style="fill:var(--c)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span>'+d[1]+"</span>";layer.appendChild(c);return c});
var steps=[],idle=0,ticking=false;
function cl(v,a,b){return Math.max(a,Math.min(b,v))}
function add(sel,kind){document.querySelectorAll(sel).forEach(function(el){var s={el:el,kind:kind,p:0,k:0,ci:steps.length%4};
 if(kind==="type"){el._t=el.textContent;el.textContent="";s.ch=Array.from(el._t).map(function(c){var e=document.createElement("span");e.className="ch";e.textContent=c;el.appendChild(e);return e})}
 else if(kind==="wipe")el.style.clipPath="inset(0 100% 0 0)";
 else if(kind==="card")el.style.clipPath="inset(0 0 100% 0)";
 else el.style.opacity=0;
 steps.push(s)})}
function measure(){steps.forEach(function(s){var r=s.el.getBoundingClientRect();s.top=r.top+window.scrollY;s.span=s.kind==="type"?cl(s.ch.length*4,140,380):s.kind==="card"?380:s.kind==="wipe"?200:140})}
function apply(s){var p=s.p,el=s.el;
 if(s.kind==="type"){var k=Math.ceil(p*s.ch.length);for(var i=s.k;i<k;i++)s.ch[i].classList.add("on");s.k=k;if(p>=1)el.textContent=el._t}
 else if(s.kind==="wipe"){el.style.clipPath=p>=1?"":"inset(0 "+(100-p*100)+"% 0 0)"}
 else if(s.kind==="card"){var t=cl((p-.4)/.6,0,1);el.style.clipPath=p>=1?"":"inset(0 0 "+(100-t*100)+"% 0)"}
 else el.style.opacity=p>=1?"":p}
function getBox(s){if(!s.box){var b=document.createElement("div");b.className="box";b.style.opacity=0;b.innerHTML="<i></i><i></i><i></i><i></i>";layer.appendChild(b);s.box=b}return s.box}
function place(s){var c=pool[s.ci],r=s.el.getBoundingClientRect(),p=s.p,x,y;
 if(s.kind==="type"){var q=s.ch[cl(Math.ceil(p*s.ch.length)-1,0,s.ch.length-1)].getBoundingClientRect();x=q.right;y=q.bottom-q.height*.3}
 else if(s.kind==="wipe"){x=r.left+r.width*p;y=r.top+r.height/2}
 else if(s.kind==="card"){var b=getBox(s),pad=6,f=Math.min(1,p/.4);
  b.style.left=r.left-pad+"px";b.style.top=r.top-pad+"px";b.style.width=(r.width+2*pad)*f+"px";b.style.height=(r.height+2*pad)*f+"px";b.style.opacity=1;
  if(p<.4){x=r.left-pad+(r.width+2*pad)*f;y=r.top-pad+(r.height+2*pad)*f}else{var t=(p-.4)/.6;x=r.right-14;y=r.top+r.height*t}}
 else{x=r.left+r.width/2;y=r.top+r.height/2}
 c.style.setProperty("--t",c._v?".12s":"0s");c.style.transform="translate("+x+"px,"+y+"px)";c._u=true}
function hide(){pool.forEach(function(c){c.style.opacity=0;c._v=false});steps.forEach(function(s){if(s.box)s.box.style.opacity=0})}
function frame(){ticking=false;var y=window.scrollY,vh=window.innerHeight,live=[];
 steps.forEach(function(s){if(s.p>=1)return;var p=cl((y+vh*.88-s.top)/s.span,0,1);
  if(p>s.p+.001||(p>=1&&s.p<1)){s.p=p;apply(s);if(p<1)live.push(s)}});
 pool.forEach(function(c){c._u=false});
 live.forEach(place);
 pool.forEach(function(c){c.style.opacity=c._u?1:0;c._v=c._u});
 steps.forEach(function(s){if(s.box&&live.indexOf(s)<0)s.box.style.opacity=0});
 clearTimeout(idle);if(live.length)idle=setTimeout(hide,1000)}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
add("#about h2","type");add("#about .two p","type");add("#about .facts li","wipe");
add("#work h2","type");add(".card","card");
add("#skills h2","type");add(".col","card");
add("#contact h2","type");add(".mail","type");add(".links","fade");
measure();
steps.forEach(function(s){var p=cl((window.scrollY+window.innerHeight*.88-s.top)/s.span,0,1);if(p>0){s.p=p;apply(s)}});
window.addEventListener("scroll",req,{passive:true});
window.addEventListener("resize",function(){measure();req()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();req()});
})();
