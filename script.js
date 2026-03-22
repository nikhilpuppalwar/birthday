/* ===== BULB — tap bulb to turn on + click sound ===== */
var bulbClicked = false;
function turnOnLight() {
  if (bulbClicked) return;
  bulbClicked = true;

  var landing = document.getElementById('landing');
  var ripple = document.getElementById('light-ripple');
  var hint = document.getElementById('bulb-hint');
  var landText = document.getElementById('landing-text');
  var clickSound = document.getElementById('click-sound');

  if (clickSound) { clickSound.currentTime = 0; clickSound.play().catch(function(){}); }
  var bg = document.getElementById('bg-music');
  if (bg) {
    bg.volume = 0.35;
    bg.play().catch(function(){});
  }
  landing.classList.add('on');
  if (hint) hint.classList.add('hidden');

  var lightEl = document.querySelector('#landing .light');
  setTimeout(function() { if (lightEl) lightEl.classList.add('light--hidden'); }, 700);

  setTimeout(function() { if (ripple) ripple.classList.add('expand'); }, 60);
  setTimeout(function() { landing.style.background = '#F9C74F'; }, 800);
  setTimeout(function() { landing.style.background = '#F3722C'; }, 1050);
  setTimeout(function() { landing.style.background = '#FFF0E6'; landing.classList.add('washed'); }, 1300);
  setTimeout(function() { if (landText) landText.classList.add('show'); }, 1600);
}
document.getElementById('bulb-btn').addEventListener('click', turnOnLight);

/* ===== 3D CAROUSEL — SMART FRONT DETECTION (multiple sliders) ===== */
(function() {
  var sliders = document.querySelectorAll('.slider');
  if (!sliders.length) return;
  var duration = 30000; // 30s full rotation = matches CSS

  function initSlider(slider) {
    var items = slider.querySelectorAll('.item');
    var quantity = items.length;
    if (!quantity) return;
    var angleStep = 360 / quantity;
    var animStart = null;

    function getActiveIndex(angle) {
      var norm = ((angle % 360) + 360) % 360;
      var best = 0, bestDiff = 999;
      for (var i = 0; i < quantity; i++) {
        var itemAngle = ((i * angleStep) % 360 + 360) % 360;
        var diff = Math.min(Math.abs(norm - itemAngle), 360 - Math.abs(norm - itemAngle));
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      }
      return best;
    }

    function tick(ts) {
      if (!animStart) animStart = ts;
      var elapsed = (ts - animStart) % duration;
      var currentAngle = (elapsed / duration) * 360;
      var activeIdx = getActiveIndex(currentAngle);
      items.forEach(function(item, i) {
        i === activeIdx ? item.classList.add('active') : item.classList.remove('active');
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  sliders.forEach(initSlider);
})();

/* ===== BEGIN ===== */
document.getElementById('begin-btn').addEventListener('click', function() {
  document.getElementById('landing').classList.add('hide');
  document.getElementById('main-content').classList.add('show');
  setTimeout(startTyping, 1200);
  triggerConfetti();
});

/* ===== MUSIC ===== */
var musicOn = true;
document.getElementById('music-btn').addEventListener('click', function() {
  var m = document.getElementById('bg-music');
  if (musicOn) { m.pause(); this.textContent = '🔇'; }
  else { m.play().catch(function(){}); this.textContent = '🎵'; }
  musicOn = !musicOn;
});

/* ===== TYPING ===== */
var phrases = ["Happy Birthday Apeksha Didi! 🎂","You are my role model 💖","So proud of you, didi! 🌟","23 looks amazing on you! ✨","Love you always — Nikhil 💙"];
var pi=0,ci=0,del=false;
function startTyping() {
  var el = document.getElementById('typing'); if (!el) return;
  if (!del && ci <= phrases[pi].length) { el.textContent = phrases[pi].substring(0,ci++); }
  else if (del && ci >= 0) { el.textContent = phrases[pi].substring(0,ci--); }
  if (ci === phrases[pi].length+1 && !del) { del=true; setTimeout(startTyping,1500); return; }
  if (ci === 0 && del) { del=false; pi=(pi+1)%phrases.length; }
  setTimeout(startTyping, del?50:90);
}

/* ===== CAKE ===== */
var blown = false;
document.getElementById('blow-btn').addEventListener('click', function() {
  if (blown) return; blown = true;
  document.getElementById('flames').style.display = 'none';
  this.textContent = '🎂 Wish Made!';
  this.disabled = true;
  document.getElementById('cake-msg').classList.add('show');
  triggerConfetti();
});

/* ===== CONFETTI ===== */
var cc = document.getElementById('confetti-canvas');
var cx = cc.getContext('2d');
cc.width = window.innerWidth; cc.height = window.innerHeight;
var cols = ['#F3722C','#F9C74F','#fbbf24','#34d399','#60a5fa','#F9C74F','#fff','#F9AFAF'];
function triggerConfetti() {
  var p = Array.from({length:150}, function() {
    return {x:Math.random()*cc.width,y:-20,r:Math.random()*8+3,d:Math.random()*3+1,color:cols[~~(Math.random()*cols.length)],t:0,ts:Math.random()*0.1+0.05,s:Math.random()>.5?'c':'r'};
  });
  var f=0;
  (function anim(){
    cx.clearRect(0,0,cc.width,cc.height);
    p.forEach(function(q){
      cx.beginPath(); cx.fillStyle=q.color;
      q.s==='c'?cx.arc(q.x,q.y,q.r,0,Math.PI*2):cx.rect(q.x,q.y,q.r*2,q.r);
      cx.fill(); q.y+=q.d; q.t+=q.ts; q.x+=Math.sin(q.t)*2;
      if(q.y>cc.height){q.y=-10;q.x=Math.random()*cc.width;}
    });
    if(++f<300) requestAnimationFrame(anim); else cx.clearRect(0,0,cc.width,cc.height);
  })();
}

/* ===== SCROLL ANIM ===== */
var obs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.fade-up,.fade-in').forEach(function(el){obs.observe(el);});

/* ===== GALLERY MODAL ===== */
document.querySelectorAll('.polaroid').forEach(function(card){
  card.addEventListener('click', function(){
    document.getElementById('modal-img').src = this.getAttribute('data-img');
    document.getElementById('photo-modal').classList.add('open');
  });
});
document.getElementById('modal-close').addEventListener('click', function(){
  document.getElementById('photo-modal').classList.remove('open');
});
document.getElementById('photo-modal').addEventListener('click', function(e){
  if(e.target===this) this.classList.remove('open');
});

/* ===== 23 REASONS ===== */
var reasons=["Your beautiful smile 😊","Your caring heart 💖","Your hardworking nature 💪","Your IT skills 💻","Always being there 🤗","Your patience 🙏","Making Maa & Papa proud 🌟","Your fashion sense 👗","Your laughter 😄","Being the best big sister 💙","Your inner strength 💫","Your kindness to all 🌸","How you handle problems 🧠","Your dedication at Capgemini 🏢","Our card game nights 🃏","Your love for family 💕","Being a Capgemini girl 🏆","Your warm hugs 🤗","Your Diwali rangoli art 🪔","Our childhood memories 👧👦","Your big dreams 🌙","How far you've come 🚀","Simply being YOU 💖"];
var g=document.getElementById('reasons-grid');
reasons.forEach(function(r,i){var d=document.createElement('div');d.className='reason-card';d.innerHTML='<div class="reason-num">'+(i+1)+'</div><div class="reason-text">'+r+'</div>';g.appendChild(d);});

/* ===== WISH STARS ===== */
document.getElementById('wish-btn').addEventListener('click', function(){
  var v=document.getElementById('wish-input').value.trim(); if(!v) return;
  var em=['⭐','🌟','✨','💫','🌠','💖','🎊','🌸'];
  for(var i=0;i<7;i++){(function(idx){setTimeout(function(){
    var s=document.createElement('div'); s.className='flying-star';
    s.textContent=em[~~(Math.random()*em.length)];
    s.style.left=(Math.random()*80+10)+'vw'; s.style.top='70vh';
    document.body.appendChild(s); setTimeout(function(){s.remove();},2100);
  },idx*180);})(i);}
  document.getElementById('wish-input').value='';
});

/* ===== HUG ===== */
document.getElementById('hug-btn').addEventListener('click', function(){
  var e=document.getElementById('hug-exp'); e.classList.add('show'); triggerConfetti();
  setTimeout(function(){e.classList.remove('show');},3000);
});

/* ===== REPLAY ===== */
document.getElementById('replay-btn').addEventListener('click', function(){
  window.scrollTo({top:0,behavior:'smooth'});
});

window.addEventListener('resize',function(){cc.width=window.innerWidth;cc.height=window.innerHeight;});
