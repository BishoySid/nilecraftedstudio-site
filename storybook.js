/* storybook.js · Crafted Tales storybook for nilecraftedstudio.com
   Sign-in comes from nile-auth.js; the Firebase settings live in nile-firebase-config.js. */

(function(){
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene=document.getElementById('scene'), stage=document.getElementById('stage'), tilt=document.getElementById('tilt'), book=document.getElementById('book');
  var leaves=[].slice.call(book.querySelectorAll('.leaf')), N=leaves.length, MAX=N-1;
  var where=document.getElementById('where'), prevB=document.getElementById('prev'), nextB=document.getElementById('next');
  var NAMES=['Closed','Contents','Chapter I · Apparel','Chapter II · Gifts','Chapter III · Events','Chapter IV · Business','Chapter V · Still being written'];
  var s=0, open=false, focusL=true, narrow=false, busy=false;

  function size(){
    var w=stage.clientWidth, h=stage.clientHeight;
    narrow = w < 720;
    var pageW, pageH;
    if(narrow){ pageW=Math.min(w*0.86,(h-30)*0.72); }
    else { pageW=Math.min(w*0.46,590,(h-40)*0.72); }
    pageH=pageW/0.72;
    tilt.style.setProperty('--bw',(pageW*2)+'px'); tilt.style.setProperty('--bh',pageH+'px');
    layout();
  }
  var STEP=170, peeked=-1, tipShown=false;
  function leafT(i,f,extra){ extra=extra||0;
    return f ? 'rotateY('+(-180+extra)+'deg) translateZ('+(-(i+1)*0.7)+'px)' : 'rotateY('+extra+'deg) translateZ('+((N-i)*0.7)+'px)'; }
  function layout(){
    var shift='0%';
    if(!open) shift='-25%';
    else if(narrow) shift = focusL ? '25%' : '-25%';
    book.style.setProperty('--shift',shift);
    peeked=-1;
    var changed=[];
    leaves.forEach(function(l,i){ if(l.classList.contains('flipped')!==(i<s)) changed.push(i); });
    if(changed.length && leaves[changed[0]].classList.contains('flipped')) changed.reverse();
    leaves.forEach(function(l,i){
      var k=changed.indexOf(i);
      function apply(){
        var f=i<s, was=l.classList.contains('flipped');
        l.classList.toggle('flipped',f); l.style.transform=leafT(i,f);
        if(was!==f && !RM){ l.classList.remove('turning'); void l.offsetWidth; l.classList.add('turning');
          clearTimeout(l._tt); l._tt=setTimeout(function(){l.classList.remove('turning')},1900); }
      }
      if(k>0 && !RM) setTimeout(apply,k*STEP); else apply();
    });
    var lag = changed.length ? (changed.length-1)*STEP : 0;
    leaves.forEach(function(l,i){
      ink(l.querySelector('.front'), open && i===s, lag);
      ink(l.querySelector('.back'), open && i===s-1, lag);
    });
    // keep links inside unturned or hidden pages out of tab order
    leaves.forEach(function(l,i){
      var vf = open && i===s, vb = open && i===s-1;
      [].forEach.call(l.querySelector('.front').querySelectorAll('a,button'),function(b){b.tabIndex=vf?0:-1});
      [].forEach.call(l.querySelector('.back').querySelectorAll('a,button'),function(b){b.tabIndex=vb?0:-1});
    });
    where.textContent = NAMES[s];
    prevB.disabled = !open || (s<=1 && (!narrow || focusL));
    nextB.disabled = !open || (s>=MAX && (!narrow || !focusL));
  }
  function ink(face,vis,lag){
    clearTimeout(face._t);
    if(vis===face.classList.contains('on')) return;
    var d = RM ? 0 : (vis ? lag+300 : lag+1250);
    face._t=setTimeout(function(){ face.classList.toggle('on',vis); }, d);
  }
  function pose(rx,rz,ry,ty,quick){tilt.style.transition=quick?'transform .6s ease-out':'';tilt.style.setProperty('--rx',rx+'deg');tilt.style.setProperty('--rz',rz+'deg');tilt.style.setProperty('--ry',ry+'deg');tilt.style.setProperty('--ty',(ty||0)+'px')}
  pose(34,-7,0,10);

  function turnTo(n){
    n=Math.max(1,Math.min(MAX,n)); if(n===s) return;
    var dir=n>s?1:-1;
    s=n; focusL = dir>0; layout();
    if(!RM) edgeDust(dir);
  }
  function next(){ if(!open) return; if(narrow&&focusL){focusL=false;layout();return;} if(s<MAX){turnTo(s+1)} }
  function prev(){ if(!open) return; if(narrow&&!focusL){focusL=true;layout();return;} if(s>1){turnTo(s-1); if(narrow){focusL=false;layout();}} }

  function openBook(x,y){
    if(open||busy) return; busy=true; scene.classList.add('opening');
    burst(x,y,90); swirl();
    pose(12,0,0,-18);                       // the book lifts and turns toward you
    setTimeout(function(){
      leaves[0].classList.add('slow');      // then the cover swings open, slowly
      open=true; scene.classList.add('is-open'); s=1; focusL=true; layout(); pose(8,0,0,0);
      setTimeout(function(){ leaves[0].classList.remove('slow'); busy=false; showTip(); },1900);
    }, RM?0:900);
  }
  function closeBook(){
    if(!open||busy) return; busy=true; open=false; scene.classList.remove('is-open');
    var steps=s; s=0; focusL=true; leaves[0].classList.add('slow'); layout();
    var wait = RM?0:(steps-1)*STEP+1500;
    if(!RM) swirl();
    setTimeout(function(){ leaves[0].classList.remove('slow'); scene.classList.remove('opening'); pose(34,-7,0,10); busy=false; },wait);
    document.getElementById('openBtn').focus({preventScroll:true});
  }
  function showTip(){
    if(tipShown) return; tipShown=true;
    var t=document.getElementById('tip');
    t.textContent = narrow ? 'Swipe or tap the arrows to turn the page' : 'Drag a page edge, tap a page, or use the arrows';
    t.classList.add('show'); setTimeout(function(){t.classList.remove('show')},5200);
  }

  /* ---------- sign-in gate ---------- */
  var gate=document.getElementById('gate'), gateMsg=document.getElementById('gateMsg'), who=document.getElementById('who');
  var user=null, authOk=false, pendingAt=null;
  function showWho(){
    if(!user){ who.hidden=true; return; }
    document.getElementById('whoName').textContent = user.displayName || user.email || 'you';
    who.hidden=false;
  }
  var cfg=window.NILE_FIREBASE||{};
  var configured = !!(cfg.apiKey && !/^PASTE/.test(cfg.apiKey) && cfg.appId && !/^PASTE/.test(cfg.appId));
  function initAuth(){
    if(authOk || !configured || !window.NileAuth) return;
    try{
      NileAuth.init(cfg); authOk=true;
      NileAuth.ready().then(function(u){ user=u; showWho(); if(u) NileAuth.visit(u); });
    }catch(e){ authOk=false; }
  }
  if(window.NileAuth) initAuth(); else window.addEventListener('nile-auth-ready',initAuth,{once:true});
  function openGate(x,y){
    pendingAt=[x,y]; gateMsg.textContent=''; gate.hidden=false;
    requestAnimationFrame(function(){ gate.classList.add('in'); });
    if(!RM) burst(x,y,24);
    setTimeout(function(){ document.getElementById('signApple').focus({preventScroll:true}); },60);
  }
  function closeGate(){
    gate.classList.remove('in'); setTimeout(function(){ gate.hidden=true; },300);
    document.getElementById('openBtn').focus({preventScroll:true});
  }
  function signIn(which){
    if(!authOk){ gateMsg.textContent = configured ? 'Sign-in couldn’t load. Check your connection and try again.' : 'Sign-in is not switched on yet. Please check back soon.'; return; }
    gate.classList.add('busy'); gateMsg.textContent='Opening '+(which==='apple'?'Apple':'Google')+' sign-in…';
    NileAuth.signIn(which).then(function(u){
      user=u; showWho(); gate.classList.remove('busy'); closeGate();
      var at=pendingAt||[innerWidth/2,innerHeight/2]; setTimeout(function(){ openBook(at[0],at[1]); },250);
    },function(err){
      gate.classList.remove('busy');
      var c=(err&&err.code)||'';
      gateMsg.textContent =
        c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request' ? 'The sign-in window closed before it finished. Try again whenever you’re ready.' :
        c==='auth/popup-blocked' ? 'Your browser blocked the sign-in window. Allow pop-ups for this site, then try again.' :
        c==='auth/account-exists-with-different-credential' ? 'That email already signed in with the other button. Please use that one.' :
        'Sign-in didn’t go through. Try again, or text us at (862) 414-0499.';
    });
  }
  document.getElementById('signApple').addEventListener('click',function(){ signIn('apple'); });
  document.getElementById('signGoogle').addEventListener('click',function(){ signIn('google'); });
  document.getElementById('gateClose').addEventListener('click',closeGate);
  gate.addEventListener('click',function(e){ if(e.target===gate) closeGate(); });
  gate.addEventListener('keydown',function(e){ if(e.key==='Escape'){ e.stopPropagation(); closeGate(); } });
  document.getElementById('signOut').addEventListener('click',function(){
    NileAuth.signOut().then(function(){ user=null; showWho(); closeBook(); });
  });

  document.getElementById('openBtn').addEventListener('click',function(e){
    var r=book.getBoundingClientRect(), x=e.clientX||r.left+r.width*.75, y=e.clientY||r.top+r.height/2;
    if(user) openBook(x,y); else openGate(x,y);
  });
  nextB.addEventListener('click',next); prevB.addEventListener('click',prev);
  document.getElementById('closeBtn').addEventListener('click',closeBook);
  var drag=null, suppress=false;
  book.addEventListener('click',function(e){
    if(suppress) return;
    var go=e.target.closest('[data-go]'); if(go){ turnTo(+go.dataset.go); return; }
    if(!open||e.target.closest('a,button')) return;
    var r=book.getBoundingClientRect(), mid=r.left+r.width/2;
    if(e.clientX>mid) next(); else prev();
  });
  // drag a page to turn it (desktop and tablet)
  book.addEventListener('pointerdown',function(e){
    if(!open||busy||narrow||e.button!==0||e.target.closest('a,button')) return;
    var r=book.getBoundingClientRect(), right=e.clientX>r.left+r.width/2;
    if(right? s>=MAX : s<=1) return;
    drag={x:e.clientX,right:right,i:right?s:s-1,moved:false,w:r.width/2,a:0};
  });
  window.addEventListener('pointermove',function(e){
    if(drag){
      var dx=e.clientX-drag.x, l=leaves[drag.i];
      if(!drag.moved && Math.abs(dx)>6){ drag.moved=true; l.style.transition='none'; book.style.cursor='grabbing'; }
      if(drag.moved){
        drag.a = drag.right ? Math.max(-180,Math.min(0,dx/drag.w*180)) : Math.min(180,Math.max(0,dx/drag.w*180));
        l.style.transform=leafT(drag.i,!drag.right,drag.a);
        var sh=l.querySelectorAll('.face'); var o=Math.sin(Math.abs(drag.a)*Math.PI/180);
        sh[0].style.setProperty('--shade',o); sh[1].style.setProperty('--shade',o);
        l.classList.add('dragging');
      }
      return;
    }
    peek(e);
  });
  window.addEventListener('pointerup',function(){
    if(!drag) return; var d=drag; drag=null; book.style.cursor='';
    var l=leaves[d.i]; l.style.transition=''; l.classList.remove('dragging');
    if(!d.moved) return;
    suppress=true; setTimeout(function(){suppress=false},60);
    if(Math.abs(d.a)>55){ if(d.right) turnTo(s+1); else turnTo(s-1); }
    else l.style.transform=leafT(d.i,!d.right);
  });
  // the page edge lifts a little when the pointer comes near it
  function peek(e){
    if(!open||narrow||busy||e.pointerType==='touch') return;
    var r=book.getBoundingClientRect(), x=e.clientX, y=e.clientY, t=-1, a=0, edge=r.width*0.08;
    if(y>r.top && y<r.bottom){
      if(x>r.right-edge && x<r.right+14 && s<MAX){ t=s; a=-11; }
      else if(x<r.left+edge && x>r.left-14 && s>1){ t=s-1; a=11; }
    }
    if(t===peeked) return;
    if(peeked>=0) leaves[peeked].style.transform=leafT(peeked,peeked<s);
    peeked=t; book.style.cursor = t>=0 ? 'grab' : '';
    if(t>=0) leaves[t].style.transform=leafT(t,t<s,a);
  }
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight') next(); else if(e.key==='ArrowLeft') prev(); else if(e.key==='Escape' && gate.hidden) closeBook();
  });
  var sx=null; stage.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  stage.addEventListener('touchend',function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>45){ suppress=true; setTimeout(function(){suppress=false},350); if(dx<0) next(); else prev(); } },{passive:true});
  // gentle parallax once open
  if(!RM) stage.addEventListener('pointermove',function(e){
    if(!open||e.pointerType==='touch') return;
    var r=stage.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    pose(8-py*5,0,px*6,0,true);
  });
  window.addEventListener('resize',size); size();

  /* ---------- pixie dust ---------- */
  var cv=document.getElementById('dust'), cx=cv.getContext('2d'), P=[], dpr=1, sprite;
  function fit(){dpr=Math.min(2,window.devicePixelRatio||1);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;}
  fit(); window.addEventListener('resize',fit);
  (function(){ sprite=document.createElement('canvas'); sprite.width=sprite.height=64; var g=sprite.getContext('2d');
    var rg=g.createRadialGradient(32,32,0,32,32,32); rg.addColorStop(0,'rgba(255,250,225,1)'); rg.addColorStop(.25,'rgba(255,214,140,.85)'); rg.addColorStop(1,'rgba(255,180,90,0)');
    g.fillStyle=rg; g.fillRect(0,0,64,64); })();
  function add(x,y,vx,vy,life,sz,star){P.push({x:x,y:y,vx:vx,vy:vy,t:0,life:life,sz:sz,star:star,tw:Math.random()*6})}
  function burst(x,y,n){ if(RM) return; for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2, v=1+Math.random()*4.5; add(x,y,Math.cos(a)*v,Math.sin(a)*v-1.2,50+Math.random()*60,3+Math.random()*7,Math.random()<.25);} kick(); }
  function swirl(){ if(RM) return; var r=book.getBoundingClientRect(), cxm=r.left+r.width*(open?.5:.75), cym=r.top+r.height/2, rx=r.width*(open?.55:.36), ry=r.height*.55, k=0;
    var id=setInterval(function(){ for(var j=0;j<6;j++){ var a=(k/40)*Math.PI*2.2+j*.05; add(cxm+Math.cos(a)*rx*(1-k/90), cym+Math.sin(a)*ry*(1-k/90),(Math.random()-.5)*.6,-.4-Math.random()*.6,60+Math.random()*40,2+Math.random()*5,Math.random()<.2);} if(++k>48) clearInterval(id); },22); kick(); }
  function edgeDust(dir){ var r=book.getBoundingClientRect(), k=0, x0=r.left+r.width*(dir>0?.98:.02);
    var id=setInterval(function(){ var x=x0+(r.left+r.width/2-x0)*(k/30)*1.0; for(var j=0;j<4;j++) add(x+(Math.random()-.5)*20, r.top+Math.random()*r.height, (Math.random()-.5)*1.2, -.3-Math.random()*.8, 40+Math.random()*30, 2+Math.random()*4, Math.random()<.15); if(++k>30) clearInterval(id); },30); kick(); }
  function ambient(){ if(RM||document.hidden) return; var r=book.getBoundingClientRect(); add(r.left+Math.random()*r.width, r.bottom-Math.random()*r.height*.3, (Math.random()-.5)*.3, -.3-Math.random()*.5, 120+Math.random()*80, 1.5+Math.random()*3, Math.random()<.1); kick(); }
  setInterval(ambient, 420);
  var running=false;
  function kick(){ if(!running){running=true;requestAnimationFrame(tick);} }
  function tick(){
    cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,innerWidth,innerHeight); cx.globalCompositeOperation='lighter';
    for(var i=P.length-1;i>=0;i--){ var p=P[i]; p.t++; if(p.t>p.life){P.splice(i,1);continue;}
      p.vx*=.975; p.vy=p.vy*.975+.025; p.x+=p.vx; p.y+=p.vy;
      var a=Math.sin(Math.PI*p.t/p.life)*(.55+.45*Math.sin(p.t*.3+p.tw)), s2=p.sz;
      cx.globalAlpha=Math.max(0,a); cx.drawImage(sprite,p.x-s2,p.y-s2,s2*2,s2*2);
      if(p.star){ cx.strokeStyle='rgba(255,244,210,'+a+')'; cx.lineWidth=1; cx.beginPath(); cx.moveTo(p.x-s2*1.6,p.y); cx.lineTo(p.x+s2*1.6,p.y); cx.moveTo(p.x,p.y-s2*1.6); cx.lineTo(p.x,p.y+s2*1.6); cx.stroke(); }
    }
    cx.globalAlpha=1;
    if(P.length) requestAnimationFrame(tick); else { running=false; cx.clearRect(0,0,innerWidth,innerHeight); }
  }
})();
