/* ════════════════════════════════════════════════════════════════
   COUPE DU MONDE 2026 — APP.JS
   Canvas · Drapeaux flottants · Ticker · Avatar joueur
════════════════════════════════════════════════════════════════ */

const GITHUB_TOKEN  = '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';
const GITHUB_OWNER  = 'LaMuerte94';
const GITHUB_REPO   = 'coupdumonde202694';
const GITHUB_FILE   = 'data.json';
const GITHUB_BRANCH = 'main';

let currentUser    = null;
let playerToDelete = null;
let _cache         = null;
let _fileSha       = null;
let _saveTimer     = null;
let _chatPoll      = null;
let _chatLastSeen  = 0;
let _chatOpen      = false;

// ════════════════════════════════════════════════════════════
// DRAPEAUX — liste complète CDM 2026 + extras avatars
// ════════════════════════════════════════════════════════════
const CDM_FLAGS = [
    {e:'🇲🇽',n:'Mexique'},{e:'🇿🇦',n:'Afrique du Sud'},{e:'🇰🇷',n:'Corée du Sud'},{e:'🇨🇿',n:'Tchéquie'},
    {e:'🇨🇦',n:'Canada'},{e:'🇧🇦',n:'Bosnie'},{e:'🇶🇦',n:'Qatar'},{e:'🇨🇭',n:'Suisse'},
    {e:'🇧🇷',n:'Brésil'},{e:'🇲🇦',n:'Maroc'},{e:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',n:'Écosse'},{e:'🇭🇹',n:'Haïti'},
    {e:'🇺🇸',n:'États-Unis'},{e:'🇹🇷',n:'Turquie'},{e:'🇵🇾',n:'Paraguay'},{e:'🇦🇺',n:'Australie'},
    {e:'🇩🇪',n:'Allemagne'},{e:'🇪🇨',n:'Équateur'},{e:'🇨🇮',n:"Côte d'Ivoire"},{e:'🇨🇼',n:'Curaçao'},
    {e:'🇳🇱',n:'Pays-Bas'},{e:'🇸🇪',n:'Suède'},{e:'🇹🇳',n:'Tunisie'},{e:'🇯🇵',n:'Japon'},
    {e:'🇧🇪',n:'Belgique'},{e:'🇮🇷',n:'Iran'},{e:'🇳🇿',n:'Nouvelle-Zélande'},{e:'🇪🇬',n:'Égypte'},
    {e:'🇪🇸',n:'Espagne'},{e:'🇺🇾',n:'Uruguay'},{e:'🇨🇻',n:'Cap-Vert'},{e:'🇸🇦',n:'Arabie Saoudite'},
    {e:'🇫🇷',n:'France'},{e:'🇸🇳',n:'Sénégal'},{e:'🇳🇴',n:'Norvège'},{e:'🇮🇶',n:'Irak'},
    {e:'🇦🇷',n:'Argentine'},{e:'🇩🇿',n:'Algérie'},{e:'🇦🇹',n:'Autriche'},{e:'🇯🇴',n:'Jordanie'},
    {e:'🇵🇹',n:'Portugal'},{e:'🇨🇴',n:'Colombie'},{e:'🇺🇿',n:'Ouzbékistan'},{e:'🇨🇩',n:'RD Congo'},
    {e:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',n:'Angleterre'},{e:'🇭🇷',n:'Croatie'},{e:'🇵🇦',n:'Panama'},{e:'🇬🇭',n:'Ghana'}
];

const EXTRA_FLAGS = [
    {e:'🇮🇹',n:'Italie'},{e:'🇩🇰',n:'Danemark'},{e:'🇵🇱',n:'Pologne'},{e:'🇷🇸',n:'Serbie'},
    {e:'🇷🇺',n:'Russie'},{e:'🇺🇦',n:'Ukraine'},{e:'🇨🇱',n:'Chili'},{e:'🇵🇪',n:'Pérou'},
    {e:'🇻🇪',n:'Venezuela'},{e:'🇧🇴',n:'Bolivie'},{e:'🇨🇷',n:'Costa Rica'},{e:'🇭🇳',n:'Honduras'},
    {e:'🇳🇬',n:'Nigéria'},{e:'🇨🇲',n:'Cameroun'},{e:'🇹🇿',n:'Tanzanie'},{e:'🇰🇪',n:'Kenya'},
    {e:'🇨🇳',n:'Chine'},{e:'🇮🇳',n:'Inde'},{e:'🇹🇭',n:'Thaïlande'},{e:'🇻🇳',n:'Vietnam'},
    {e:'🇬🇷',n:'Grèce'},{e:'🇷🇴',n:'Roumanie'},{e:'🇭🇺',n:'Hongrie'},{e:'🇸🇰',n:'Slovaquie'},
    {e:'🇮🇪',n:'Irlande'},{e:'🇧🇬',n:'Bulgarie'},{e:'🇦🇱',n:'Albanie'},{e:'🇷🇸',n:'Serbie'},
    {e:'🇲🇦',n:'Maroc'},{e:'🇹🇳',n:'Tunisie'},{e:'🇸🇳',n:'Sénégal'},{e:'🇧🇫',n:'Burkina'}
];

const FUN_FLAGS = [
    {e:'⭐',n:'Étoile'},{e:'🌟',n:'Star'},{e:'🔥',n:'Feu'},{e:'💫',n:'Cosmos'},
    {e:'🎯',n:'Cible'},{e:'🦁',n:'Lion'},{e:'🐺',n:'Loup'},{e:'🦅',n:'Aigle'},
    {e:'🐉',n:'Dragon'},{e:'⚡',n:'Éclair'},{e:'🏆',n:'Trophée'},{e:'👑',n:'Couronne'},
    {e:'💎',n:'Diamant'},{e:'🌈',n:'Arc-en-ciel'},{e:'🎭',n:'Masque'},{e:'🛡️',n:'Bouclier'}
];

const ALL_AVATAR_FLAGS = [
    ...CDM_FLAGS, ...EXTRA_FLAGS, ...FUN_FLAGS
];

const FLAG_CATEGORIES = {
    'Tous'    : null,
    'CDM 2026': CDM_FLAGS,
    'Europe'  : [...CDM_FLAGS.filter(f=>['🇩🇪','🇫🇷','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇪🇸','🇵🇹','🇳🇱','🇧🇪','🇭🇷','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🇸🇪','🇳🇴','🇨🇭','🇦🇹'].includes(f.e)),
               ...EXTRA_FLAGS.filter(f=>['🇮🇹','🇩🇰','🇵🇱','🇷🇸','🇺🇦','🇬🇷','🇷🇴','🇭🇺','🇮🇪'].includes(f.e))],
    'Amériques': CDM_FLAGS.filter(f=>['🇧🇷','🇦🇷','🇺🇸','🇲🇽','🇨🇦','🇨🇴','🇺🇾','🇵🇾','🇪🇨','🇵🇦'].includes(f.e)),
    'Afrique' : CDM_FLAGS.filter(f=>['🇲🇦','🇸🇳','🇿🇦','🇪🇬','🇬🇭','🇨🇮','🇩🇿','🇨🇩','🇨🇻'].includes(f.e)),
    'Asie'    : CDM_FLAGS.filter(f=>['🇯🇵','🇰🇷','🇸🇦','🇮🇷','🇦🇺','🇳🇿','🇶🇦','🇮🇶','🇯🇴','🇺🇿'].includes(f.e)),
    'Fun'     : FUN_FLAGS
};

// Drapeaux emoji seulement (pour animations)
const CDM_EMOJIS = CDM_FLAGS.map(f=>f.e);

// ════════════════════════════════════════════════════════════
// MAP drapeaux pays (pour l'affichage matchs)
// ════════════════════════════════════════════════════════════
const FLAGS = {
    'Mexique':'🇲🇽','Afrique du Sud':'🇿🇦','Corée du Sud':'🇰🇷','Tchéquie':'🇨🇿',
    'Canada':'🇨🇦','Bosnie-Herzégovine':'🇧🇦','Qatar':'🇶🇦','Suisse':'🇨🇭',
    'Brésil':'🇧🇷','Maroc':'🇲🇦','Écosse':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Haïti':'🇭🇹',
    'États-Unis':'🇺🇸','Turquie':'🇹🇷','Paraguay':'🇵🇾','Australie':'🇦🇺',
    'Allemagne':'🇩🇪','Équateur':'🇪🇨',"Côte d'Ivoire":'🇨🇮','Curaçao':'🇨🇼',
    'Pays-Bas':'🇳🇱','Suède':'🇸🇪','Tunisie':'🇹🇳','Japon':'🇯🇵',
    'Belgique':'🇧🇪','Iran':'🇮🇷','Nouvelle-Zélande':'🇳🇿','Égypte':'🇪🇬',
    'Espagne':'🇪🇸','Uruguay':'🇺🇾','Cap-Vert':'🇨🇻','Arabie saoudite':'🇸🇦',
    'France':'🇫🇷','Sénégal':'🇸🇳','Norvège':'🇳🇴','Irak':'🇮🇶',
    'Argentine':'🇦🇷','Algérie':'🇩🇿','Autriche':'🇦🇹','Jordanie':'🇯🇴',
    'Portugal':'🇵🇹','Colombie':'🇨🇴','Ouzbékistan':'🇺🇿','RD Congo':'🇨🇩',
    'Angleterre':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatie':'🇭🇷','Panama':'🇵🇦','Ghana':'🇬🇭',
    'À déterminer':'🏳️'
};
const flag = t => FLAGS[t]||'🏳️';

// ════════════════════════════════════════════════════════════
// FUSEAUX HORAIRES — conversion heure stade (Amérique) → heure française
// Les heures saisies dans buildMatches() sont les heures LOCALES du stade.
// On ajoute le décalage ci-dessous pour obtenir l'heure de Paris (CEST, UTC+2).
// ════════════════════════════════════════════════════════════
const STADIUM_TZ_OFFSET = {
    // Mexique — Heure du Centre (UTC-6) → Paris UTC+2 = +8h
    'Mexico':8, 'Guadalajara':8, 'Monterrey':8,
    // USA/Canada Est — Heure de l'Est (UTC-4 en été) → Paris UTC+2 = +6h
    'Atlanta':6, 'Boston':6, 'Houston':6, 'Kansas City':6, 'Miami':6,
    'New York / New Jersey':6, 'Philadelphie':6, 'Toronto':6, 'Dallas':6,
    // USA/Canada Ouest — Heure du Pacifique (UTC-7 en été) → Paris UTC+2 = +9h
    'Los Angeles':9, 'San Francisco':9, 'Seattle':9, 'Vancouver':9
};

// Ordre des dates (index) pour gérer le décalage de jour (+1 jour si l'heure dépasse minuit en France)
const DATE_SEQUENCE = ['11 juin','12 juin','13 juin','14 juin','15 juin','16 juin','17 juin','18 juin','19 juin','20 juin','21 juin','22 juin','23 juin','24 juin','25 juin','26 juin','27 juin','28 juin','29 juin','30 juin','1 juil.','2 juil.','3 juil.','4 juil.','5 juil.','6 juil.','7 juil.','8 juil.','9 juil.','10 juil.','11 juil.','12 juil.','13 juil.','14 juil.','15 juil.','16 juil.','17 juil.','18 juil.','19 juil.'];

// Convertit une heure locale stade ("21h", "22h", "00h", "19h30") + date + stade
// en heure française, en renvoyant éventuellement la date du lendemain.
// Si stadium === 'FR', les données sont déjà en heure française : retour immédiat.
function toFrenchTime(date, time, stadium){
    if(!time)return{date,time:''};
    if(stadium==='FR')return{date,time}; // déjà en heure FR
    const offset = STADIUM_TZ_OFFSET[stadium];
    if(offset===undefined)return{date,time};
    const m=time.match(/(\d+)h(\d*)/);
    if(!m)return{date,time};
    let h=parseInt(m[1]), min=m[2]?parseInt(m[2]):0;
    h+=offset;
    let dayShift=0;
    while(h>=24){h-=24;dayShift++;}
    while(h<0){h+=24;dayShift--;}
    let newDate=date;
    if(dayShift!==0){
        const idx=DATE_SEQUENCE.indexOf(date);
        if(idx!==-1){
            const newIdx=idx+dayShift;
            if(newIdx>=0&&newIdx<DATE_SEQUENCE.length)newDate=DATE_SEQUENCE[newIdx];
        }
    }
    const hh=String(h).padStart(2,'0');
    const newTime=min>0?`${hh}h${String(min).padStart(2,'0')}`:`${hh}h`;
    return{date:newDate,time:newTime};
}

// ════════════════════════════════════════════════════════════
// CANVAS ANIMÉ
// ════════════════════════════════════════════════════════════
(function initCanvas(){
    const canvas = document.getElementById('bgCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const stars  = [];
    const floats = [];

    function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
    window.addEventListener('resize', resize); resize();

    for(let i=0;i<150;i++) stars.push({
        x:Math.random()*3000, y:Math.random()*3000,
        r:Math.random()*1.4+.2, speed:Math.random()*.004+.001, pulse:Math.random()*Math.PI*2
    });

    const ballEmojis=['⚽','🏆','⭐','⚽','⚽','🥅'];
    for(let i=0;i<8;i++) floats.push({
        x:Math.random()*3000, y:Math.random()*3000,
        size:Math.random()*16+8,
        vx:(Math.random()-.5)*.25, vy:-Math.random()*.35-.1,
        opacity:Math.random()*.05+.02,
        emoji:ballEmojis[Math.floor(Math.random()*ballEmojis.length)],
        rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.008
    });

    function draw(){
        ctx.clearRect(0,0,W,H);
        const g = ctx.createLinearGradient(0,0,W,H);
        g.addColorStop(0,'#0a0e1a'); g.addColorStop(.5,'#12182b'); g.addColorStop(1,'#1e2a45');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

        const lueurs=[
            {x:.15*W,y:.3*H,r:280,c:'rgba(200,16,46,.04)'},
            {x:.85*W,y:.7*H,r:320,c:'rgba(0,48,135,.06)'},
            {x:.5*W, y:.1*H,r:220,c:'rgba(255,215,0,.03)'}
        ];
        lueurs.forEach(o=>{
            const lg=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
            lg.addColorStop(0,o.c); lg.addColorStop(1,'transparent');
            ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill();
        });

        stars.forEach(s=>{
            s.pulse+=s.speed;
            const a=(Math.sin(s.pulse)*.5+.5)*.45+.05;
            ctx.beginPath(); ctx.arc(s.x%W,s.y%H,s.r,0,Math.PI*2);
            ctx.fillStyle=`rgba(255,255,255,${a})`; ctx.fill();
        });

        floats.forEach(b=>{
            b.x+=b.vx; b.y+=b.vy; b.rot+=b.rs;
            if(b.y<-60){b.y=H+60;b.x=Math.random()*W;}
            if(b.x<-60)b.x=W+60; if(b.x>W+60)b.x=-60;
            ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.rot);
            ctx.globalAlpha=b.opacity; ctx.font=`${b.size}px serif`;
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(b.emoji,0,0); ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

// ════════════════════════════════════════════════════════════
// DRAPEAUX FLOTTANTS (couche z-index au-dessus du canvas)
// ════════════════════════════════════════════════════════════
function initFloatingFlags(){
    const layer = document.getElementById('floatingFlags');
    if(!layer) return;
    const all = [...CDM_EMOJIS, ...CDM_EMOJIS]; // densité x2
    all.forEach((emoji,i)=>{
        const el = document.createElement('span');
        el.className = 'ff-item';
        el.textContent = emoji;
        const left     = Math.random()*98;
        const duration = 14+Math.random()*22;
        const delay    = Math.random()*25;
        const size     = 1.2+Math.random()*1.6;
        el.style.cssText = `left:${left}%;font-size:${size}rem;animation-duration:${duration}s;animation-delay:${delay}s;`;
        layer.appendChild(el);
    });
}

// ════════════════════════════════════════════════════════════
// TICKER DRAPEAUX (défilement horizontal)
// ════════════════════════════════════════════════════════════
function buildTicker(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    // Triple le contenu pour le scroll infini
    const triple = [...CDM_EMOJIS,...CDM_EMOJIS,...CDM_EMOJIS];
    triple.forEach(emoji=>{
        const s = document.createElement('span');
        s.textContent = emoji;
        container.appendChild(s);
    });
}

// ════════════════════════════════════════════════════════════
// BANDEAU DRAPEAUX DANS LA LOGIN BOX
// ════════════════════════════════════════════════════════════
function buildLoginFlagsStrip(){
    const strip = document.getElementById('loginFlagsStrip');
    if(!strip) return;
    const shuffled = [...CDM_EMOJIS].sort(()=>Math.random()-.5);
    shuffled.forEach((emoji,i)=>{
        const s = document.createElement('span');
        s.className = 'lf-item';
        s.textContent = emoji;
        const dur   = 1.8+Math.random()*1.4;
        const delay = Math.random()*2;
        s.style.cssText = `animation-duration:${dur}s;animation-delay:${delay}s;`;
        strip.appendChild(s);
    });
}

// ════════════════════════════════════════════════════════════
// DONNÉES
// ════════════════════════════════════════════════════════════
function getDefaultPlayers(){
    const defaults = [
        {name:'Anthony',code:'1111',avatar:'🇫🇷'},
        {name:'Marvin',  code:'2222',avatar:'🇧🇷'},
        {name:'Alexandre',code:'3333',avatar:'🇦🇷'},
        {name:'Ludovic', code:'4444',avatar:'🇩🇪'},
        {name:'Kamel',   code:'5555',avatar:'🇲🇦'},
        {name:'Marouane',code:'6666',avatar:'🇩🇿'},
        {name:'Nour',    code:'7777',avatar:'🇸🇦'},
        {name:'Bruno',   code:'8888',avatar:'🇵🇹'},
        {name:'Yvan',    code:'9999',avatar:'🇳🇱'},
        {name:'Florian', code:'1010',avatar:'🇪🇸'},
        {name:'Eugene',  code:'1212',avatar:'🇧🇪'},
        {name:'Gaston',  code:'1313',avatar:'🇨🇴'}
    ];
    return defaults;
}

function initEmptyData(){
    return {
        players:getDefaultPlayers(),
        bets:{},playoffBets:{},championBets:{},
        results:{},playoffResults:{},championResult:null,
        chat:[],
        challenges:[],
        adminCode:'admin2026',adminId:'admin'
    };
}

function getPlayerAvatar(playerName){
    const d = loadData();
    const p = (d.players||[]).find(pl=>pl.name===playerName);
    return p?.avatar || '🏳️';
}

// ════════════════════════════════════════════════════════════
// GITHUB + PERSISTANCE
// ════════════════════════════════════════════════════════════
function setSaveStatus(state,text){
    const el=document.getElementById('saveStatus');
    const icon=document.getElementById('saveStatusIcon');
    const txt=document.getElementById('saveStatusText');
    if(!el)return;
    el.className='save-status visible '+state;
    txt.textContent=text;
    icon.textContent=state==='saving'?'⏳':state==='saved'?'☁️':'⚠️';
    if(state==='saved'||state==='error'){
        clearTimeout(el._t);
        el._t=setTimeout(()=>el.classList.remove('visible'),3000);
    }
}

async function githubGet(){
    try{
        const url=`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;
        const r=await fetch(url,{headers:{'Authorization':`token ${GITHUB_TOKEN}`,'Accept':'application/vnd.github.v3+json'}});
        if(r.status===404)return null;
        if(!r.ok)throw new Error('HTTP '+r.status);
        const json=await r.json();
        _fileSha=json.sha;
        return JSON.parse(atob(json.content.replace(/\n/g,'')));
    }catch(e){console.warn('GitHub GET:',e);return null;}
}

async function githubSet(data){
    try{
        setSaveStatus('saving','Sauvegarde…');
        const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
        const body={message:`💾 CDM2026 - ${new Date().toLocaleString('fr-FR')}`,content,branch:GITHUB_BRANCH};
        if(_fileSha)body.sha=_fileSha;
        const r=await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`,{
            method:'PUT',
            headers:{'Authorization':`token ${GITHUB_TOKEN}`,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},
            body:JSON.stringify(body)
        });
        if(!r.ok){const e=await r.json();throw new Error(e.message);}
        const res=await r.json();
        _fileSha=res.content.sha;
        setSaveStatus('saved','Sauvegardé ✓');
        localStorage.setItem('cdm2026',JSON.stringify(data));
        return true;
    }catch(e){
        console.error('GitHub SET:',e);
        setSaveStatus('error','Erreur sauvegarde !');
        localStorage.setItem('cdm2026',JSON.stringify(data));
        return false;
    }
}

async function loadDataAsync(){
    if(_cache)return _cache;
    let d=await githubGet();
    if(!d){const s=localStorage.getItem('cdm2026');if(s){try{d=JSON.parse(s);}catch(e){}}}
    if(!d)d=initEmptyData();
    d.players       =d.players       ||getDefaultPlayers();
    d.bets          =d.bets          ||{};
    d.playoffBets   =d.playoffBets   ||{};
    d.championBets  =d.championBets  ||{};
    d.results       =d.results       ||{};
    d.playoffResults=d.playoffResults||{};
    d.championResult=d.championResult||null;
    d.chat          =d.chat          ||[];
    d.challenges    =d.challenges    ||[];
    d.adminCode     =d.adminCode     ||'admin2026';
    d.adminId       =d.adminId       ||'admin';
    // S'assurer que chaque joueur a un avatar
    d.players.forEach((p,i)=>{ if(!p.avatar) p.avatar=CDM_EMOJIS[i%CDM_EMOJIS.length]; });
    _cache=d;
    localStorage.setItem('cdm2026',JSON.stringify(d));
    return d;
}

function loadData(){
    if(_cache)return JSON.parse(JSON.stringify(_cache));
    const s=localStorage.getItem('cdm2026');
    if(s){try{return JSON.parse(s);}catch(e){}}
    return initEmptyData();
}

function saveData(data){
    _cache=JSON.parse(JSON.stringify(data));
    localStorage.setItem('cdm2026',JSON.stringify(data));
    clearTimeout(_saveTimer);
    _saveTimer=setTimeout(()=>githubSet(data),1200);
}

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════
function toggleAdminZone(){
    const zone=document.getElementById('adminLoginZone');
    const link=document.getElementById('adminToggleLink');
    const hidden=zone.classList.contains('hidden');
    zone.classList.toggle('hidden',!hidden);
    link.textContent=hidden?"✖️ Masquer l'accès admin":'⚙️ Accès administrateur';
    if(!hidden){
        document.getElementById('adminLoginId').value='';
        document.getElementById('adminLoginPwd').value='';
        document.getElementById('adminLoginError').classList.add('hidden');
    }
}

function initLogin(){
    const d=loadData();
    const sel=document.getElementById('loginName');
    sel.innerHTML='<option value="">— Choisissez votre nom —</option>';
    (d.players||[]).forEach(p=>{
        sel.innerHTML+=`<option value="${p.name}">${p.avatar||'🏳️'} ${p.name}</option>`;
    });
}

function login(){
    const d=loadData();
    const name=document.getElementById('loginName').value;
    const code=document.getElementById('loginCode').value.trim();
    document.getElementById('loginError').classList.add('hidden');
    if(!name){showLoginError('loginError','⚠️ Choisissez votre nom !');return;}
    if(!code){showLoginError('loginError','⚠️ Entrez votre code !');return;}
    const player=(d.players||[]).find(p=>p.name===name);
    if(player&&player.code===code){
        currentUser={name:player.name,isAdmin:false,avatar:player.avatar||'🏳️'};
        startApp();
    }else{
        showLoginError('loginError','❌ Nom ou code incorrect !');
        document.getElementById('loginCode').value='';
    }
}

function loginAdmin(){
    const d=loadData();
    const id=document.getElementById('adminLoginId').value.trim();
    const pwd=document.getElementById('adminLoginPwd').value.trim();
    document.getElementById('adminLoginError').classList.add('hidden');
    if(!id||!pwd){showLoginError('adminLoginError','⚠️ Remplissez les deux champs !');return;}
    if(id===(d.adminId||'admin')&&pwd===(d.adminCode||'admin2026')){
        currentUser={name:'Administrateur',isAdmin:true,avatar:'👑'};
        startApp();
    }else{
        showLoginError('adminLoginError','❌ Identifiant ou mot de passe incorrect !');
        document.getElementById('adminLoginPwd').value='';
    }
}

function showLoginError(id,msg){
    const el=document.getElementById(id);
    el.textContent=msg; el.classList.remove('hidden');
    setTimeout(()=>el.classList.add('hidden'),3500);
}

function startApp(){
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');

    // Init animations header
    buildTicker('headerTicker');

    const badge=document.getElementById('userBadge');
    if(currentUser.isAdmin){
        badge.innerHTML='<span class="badge-admin">👑 ADMIN</span>';
        document.querySelectorAll('.admin-only').forEach(el=>el.classList.remove('hidden'));
    }else{
        badge.innerHTML=`<span class="badge-player">
            <span class="badge-avatar-flag">${currentUser.avatar}</span>
            ${currentUser.name}
        </span>`;
        document.querySelectorAll('.admin-only').forEach(el=>el.classList.add('hidden'));
    }

    const info=document.getElementById('matchInfo');
    if(info){
        if(currentUser.isAdmin) info.innerHTML='<span class="info-admin">👑 Admin — tout modifiable</span>';
        else info.innerHTML=`<span class="info-player">${currentUser.avatar} ${currentUser.name} — votre ligne en bleu</span>`;
    }
    app.init();

    // Chat global
    document.getElementById('chatFab')?.classList.remove('hidden');
    _chatOpen=false;
    const d0=loadData();
    const msgs0=d0.chat||[];
    _chatLastSeen=msgs0.length?msgs0[msgs0.length-1].ts:Date.now();
    renderChatMessages();
    startChatPolling();
}

function logout(){
    currentUser=null;
    stopChatPolling();
    document.getElementById('chatFab')?.classList.add('hidden');
    document.getElementById('chatPanel')?.classList.add('hidden');
    _chatOpen=false;
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    // Vider le ticker header
    const ht=document.getElementById('headerTicker');
    if(ht)ht.innerHTML='';
    document.getElementById('loginCode').value='';
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('adminLoginZone').classList.add('hidden');
    document.getElementById('adminLoginId').value='';
    document.getElementById('adminLoginPwd').value='';
    document.getElementById('adminLoginError').classList.add('hidden');
    document.getElementById('adminToggleLink').textContent='⚙️ Accès administrateur';
    initLogin();
}

// ════════════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════════════
function toast(msg,type='success'){
    const container=document.getElementById('toastContainer');
    const t=document.createElement('div');
    t.className=`toast toast-${type}`;
    const icons={success:'✅',lock:'🔒',info:'ℹ️',warn:'⚠️'};
    t.innerHTML=`<span>${icons[type]||'✅'}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(()=>{t.classList.add('removing');setTimeout(()=>t.remove(),300);},2800);
}

// ════════════════════════════════════════════════════════════
// CONFETTIS — célébration d'un score exact (3 pts)
// ════════════════════════════════════════════════════════════
function launchConfetti(){
    const layer=document.createElement('div');
    layer.className='confetti-layer';
    const colors=['#003087','#c8102e','#ffd700','#00a651','#ffffff','#1a4db5'];
    const shapes=['🎉','⚽','🎊','⭐'];
    for(let i=0;i<60;i++){
        const piece=document.createElement('span');
        const useEmoji=Math.random()<0.18;
        if(useEmoji){
            piece.className='confetti-piece confetti-emoji';
            piece.textContent=shapes[Math.floor(Math.random()*shapes.length)];
        }else{
            piece.className='confetti-piece';
            piece.style.background=colors[Math.floor(Math.random()*colors.length)];
            piece.style.width=piece.style.height=(4+Math.random()*6)+'px';
            piece.style.borderRadius=Math.random()<0.5?'50%':'2px';
        }
        piece.style.left=(Math.random()*100)+'vw';
        piece.style.animationDuration=(2.2+Math.random()*1.8)+'s';
        piece.style.animationDelay=(Math.random()*0.4)+'s';
        piece.style.setProperty('--rot',(Math.random()*720-360)+'deg');
        layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(()=>layer.remove(),4200);
}

// Vérifie si de nouveaux scores exacts sont apparus pour le joueur connecté
// et déclenche les confettis + un toast festif (une seule fois par match, mémorisé localement)
function celebrateExactScores(app){
    if(!currentUser||currentUser.isAdmin)return;
    const d=loadData();
    const me=currentUser.name;
    let celebrated=[];
    try{celebrated=JSON.parse(localStorage.getItem('cdm2026_celebrated')||'[]');}catch(e){}
    const celebratedSet=new Set(celebrated);
    let newOnes=[];

    app.matches.forEach(m=>{
        const r=d.results[m.id];if(!r||r.s1===undefined)return;
        const b=d.bets[me]?.[m.id];
        if(b&&b.s1===r.s1&&b.s2===r.s2){
            const key='m_'+m.id;
            if(!celebratedSet.has(key)){newOnes.push(key);}
        }
    });
    app.playoffs.forEach(p=>{
        const r=d.playoffResults[p.id];if(!r||r.s1===undefined)return;
        const b=d.playoffBets[me]?.[p.id];
        if(b&&b.s1===r.s1&&b.s2===r.s2){
            const key='p_'+p.id;
            if(!celebratedSet.has(key)){newOnes.push(key);}
        }
    });

    if(newOnes.length){
        launchConfetti();
        toast(`🎉 Score exact ! +3 points 🎯`,'success');
        celebrated=[...celebrated,...newOnes];
        localStorage.setItem('cdm2026_celebrated',JSON.stringify(celebrated));
    }
}

// ════════════════════════════════════════════════════════════
// CHAT GLOBAL — fonctions de polling et affichage
// ════════════════════════════════════════════════════════════
function chatTimeStr(ts){
    const d=new Date(ts);
    return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
}

function escapeChatHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const CHAT_REACTION_EMOJIS=['👍','😂','🔥','😮','❤️','⚽'];

function renderChatMessages(){
    const d=loadData();
    const box=document.getElementById('chatMessages');
    if(!box)return;
    const msgs=d.chat||[];
    const wasAtBottom=(box.scrollHeight-box.scrollTop-box.clientHeight)<60;
    if(!msgs.length){
        box.innerHTML='<div class="chat-empty">💬 Aucun message — soyez le premier à écrire !</div>';
    }else{
        box.innerHTML=msgs.map(m=>{
            const isMe=currentUser&&!currentUser.isAdmin&&m.player===currentUser.name;
            const isAdminMsg=m.isAdmin===true;
            const reactions=m.reactions||{};
            const myName=currentUser?currentUser.name:'';
            let reactionsHtml='';
            const activeEmojis=Object.entries(reactions).filter(([emoji,users])=>users&&users.length>0);
            if(activeEmojis.length){
                reactionsHtml=`<div class="chat-reactions">${activeEmojis.map(([emoji,users])=>{
                    const mine=users.includes(myName);
                    return `<span class="chat-reaction-chip${mine?' chat-reaction-mine':''}" onclick="app.toggleReaction('${m.id}','${emoji}')">${emoji} <span class="chat-reaction-count">${users.length}</span></span>`;
                }).join('')}</div>`;
            }
            const pickerHtml=`<div class="chat-reaction-picker">${CHAT_REACTION_EMOJIS.map(e=>`<span class="chat-reaction-opt" onclick="app.toggleReaction('${m.id}','${e}')">${e}</span>`).join('')}</div>`;
            return `<div class="chat-msg ${isMe?'chat-msg-me':''} ${isAdminMsg?'chat-msg-admin':''}">
                <span class="chat-msg-avatar">${m.avatar||'🏳️'}</span>
                <div class="chat-msg-body">
                    <div class="chat-msg-meta"><span class="chat-msg-name">${escapeChatHtml(m.player)}</span><span class="chat-msg-time">${chatTimeStr(m.ts)}</span></div>
                    <div class="chat-msg-text">${escapeChatHtml(m.text)}</div>
                    ${reactionsHtml}
                    <div class="chat-reaction-trigger" onclick="this.nextElementSibling.classList.toggle('show')">😊+</div>
                    ${pickerHtml}
                </div>
            </div>`;
        }).join('');
    }
    if(wasAtBottom||_chatOpen)box.scrollTop=box.scrollHeight;
}

function updateChatUnread(){
    const d=loadData();
    const msgs=d.chat||[];
    const badge=document.getElementById('chatUnreadBadge');
    if(!badge)return;
    if(_chatOpen||!msgs.length){badge.classList.add('hidden');return;}
    const unread=msgs.filter(m=>m.ts>_chatLastSeen).length;
    if(unread>0){
        badge.textContent=unread>9?'9+':unread;
        badge.classList.remove('hidden');
    }else{
        badge.classList.add('hidden');
    }
}

async function pollChat(){
    try{
        const fresh=await githubGet();
        if(fresh){
            fresh.chat=fresh.chat||[];
            fresh.results=fresh.results||{};
            fresh.playoffResults=fresh.playoffResults||{};
            fresh.championResult=fresh.championResult||null;
            if(_cache){
                // Ne remplace que le chat + les résultats officiels pour éviter d'écraser des modifs locales non sauvegardées (pronos en cours de saisie)
                _cache.chat=fresh.chat;
                _cache.results=fresh.results;
                _cache.playoffResults=fresh.playoffResults;
                _cache.championResult=fresh.championResult;
                localStorage.setItem('cdm2026',JSON.stringify(_cache));
            }else{
                _cache=fresh;
            }
            renderChatMessages();
            updateChatUnread();
            if(window.app)celebrateExactScores(window.app);
        }
    }catch(e){console.warn('pollChat:',e);}
}

function startChatPolling(){
    if(_chatPoll)clearInterval(_chatPoll);
    pollChat();
    _chatPoll=setInterval(pollChat,6000);
}

function stopChatPolling(){
    if(_chatPoll){clearInterval(_chatPoll);_chatPoll=null;}
}

// ════════════════════════════════════════════════════════════
// CONSTRUCTEUR GRILLE DRAPEAUX (pour avatar)
// ════════════════════════════════════════════════════════════
function buildFlagGrid(gridId, selectedEmoji, onSelect, showSearch=true, maxH=240){
    let currentCat = 'Tous';
    let searchVal  = '';
    let tempSelected = selectedEmoji;

    function render(containerId){
        const c = document.getElementById(containerId);
        if(!c) return;
        const list = FLAG_CATEGORIES[currentCat] || ALL_AVATAR_FLAGS;
        const filtered = list.filter(f=>
            !searchVal || f.n.toLowerCase().includes(searchVal.toLowerCase()) || f.e.includes(searchVal)
        );
        // Mise à jour seulement de la grille
        const gridEl = c.querySelector('.avatar-flag-grid, .afc-grid');
        if(!gridEl) return;
        gridEl.innerHTML = '';
        filtered.forEach(f=>{
            const el=document.createElement('div');
            el.className=`fg-opt${f.e===tempSelected?' selected':''}`;
            el.dataset.emoji=f.e; el.dataset.name=f.n;
            el.innerHTML=`<span class="fg-emoji">${f.e}</span><span class="fg-name">${f.n}</span>`;
            el.onclick=()=>{
                tempSelected=f.e;
                gridEl.querySelectorAll('.fg-opt').forEach(o=>o.classList.remove('selected'));
                el.classList.add('selected');
                onSelect(f.e, f.n);
            };
            gridEl.appendChild(el);
        });
    }
    return {render, getCat:()=>currentCat, setCat:(c)=>{currentCat=c;}, setSearch:(s)=>{searchVal=s;}, getSelected:()=>tempSelected};
}

// ════════════════════════════════════════════════════════════
// CLASSE APP
// ════════════════════════════════════════════════════════════
class App{
    constructor(){ this.matches=[]; this.playoffs=[]; this.buildMatches(); this.buildPlayoffs(); }

    d()   { return loadData(); }
    save(data){ saveData(data); toast('✅ Sauvegardé !','success'); }
    init(){ this.populateFilters(); this.showTab('bydate'); }

    // ════════════════════════════════════════════════════
    // CHAT GLOBAL
    // ════════════════════════════════════════════════════
    toggleChat(){
        const panel=document.getElementById('chatPanel');
        const fab=document.getElementById('chatFab');
        if(!panel)return;
        _chatOpen=!panel.classList.contains('hidden')?false:true;
        panel.classList.toggle('hidden');
        if(_chatOpen){
            renderChatMessages();
            const d=loadData();
            const msgs=d.chat||[];
            _chatLastSeen=msgs.length?msgs[msgs.length-1].ts:Date.now();
            updateChatUnread();
            setTimeout(()=>document.getElementById('chatInput')?.focus(),300);
        }else{
            updateChatUnread();
        }
    }

    async sendChatMessage(){
        const input=document.getElementById('chatInput');
        if(!input)return;
        const text=input.value.trim();
        if(!text)return;
        input.value='';
        input.disabled=true;
        try{
            // Recharger les données fraîches pour ne pas écraser d'autres messages
            const fresh=await githubGet()||this.d();
            fresh.chat=fresh.chat||[];
            fresh.players       =fresh.players       ||getDefaultPlayers();
            fresh.bets          =fresh.bets          ||{};
            fresh.playoffBets   =fresh.playoffBets   ||{};
            fresh.championBets  =fresh.championBets  ||{};
            fresh.results       =fresh.results       ||{};
            fresh.playoffResults=fresh.playoffResults||{};
            fresh.challenges    =fresh.challenges    ||[];
            fresh.adminCode     =fresh.adminCode     ||'admin2026';
            fresh.adminId       =fresh.adminId       ||'admin';
            fresh.chat.push({
                id:Date.now()+'_'+Math.random().toString(36).slice(2,7),
                player:currentUser.name,
                avatar:currentUser.avatar||'🏳️',
                isAdmin:currentUser.isAdmin===true,
                text:text.slice(0,300),
                ts:Date.now()
            });
            // Limiter l'historique
            if(fresh.chat.length>200)fresh.chat=fresh.chat.slice(-200);
            _cache=JSON.parse(JSON.stringify(fresh));
            localStorage.setItem('cdm2026',JSON.stringify(fresh));
            renderChatMessages();
            _chatLastSeen=Date.now();
            await githubSet(fresh);
        }catch(e){
            console.error('sendChatMessage:',e);
            toast('⚠️ Erreur envoi message','warn');
        }finally{
            input.disabled=false;
            input.focus();
        }
    }

    // Ajoute/retire une réaction emoji sur un message de chat
    async toggleReaction(messageId,emoji){
        if(!currentUser)return;
        try{
            const fresh=await githubGet()||this.d();
            fresh.chat=fresh.chat||[];
            const msg=fresh.chat.find(m=>m.id===messageId);
            if(!msg)return;
            if(!msg.reactions)msg.reactions={};
            if(!msg.reactions[emoji])msg.reactions[emoji]=[];
            const me=currentUser.name;
            const idx=msg.reactions[emoji].indexOf(me);
            if(idx>=0)msg.reactions[emoji].splice(idx,1);
            else msg.reactions[emoji].push(me);
            if(msg.reactions[emoji].length===0)delete msg.reactions[emoji];
            _cache=JSON.parse(JSON.stringify(fresh));
            localStorage.setItem('cdm2026',JSON.stringify(fresh));
            renderChatMessages();
            await githubSet(fresh);
        }catch(e){
            console.error('toggleReaction:',e);
        }
    }

    showTab(tab){
        document.querySelectorAll('.nav-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
        document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
        const el=document.getElementById(tab);if(el)el.classList.add('active');
        if(tab==='bydate')     this.renderByDate();
        if(tab==='today')      this.renderToday();
        if(tab==='matches')    this.renderMatches();
        if(tab==='playoffs')   this.renderPlayoffs();
        if(tab==='champion')   this.renderChampionTab();
        if(tab==='ranking')    this.renderRanking();
        if(tab==='stats')      this.renderStatsTab();
        if(tab==='wall')       this.renderWallTab();
        if(tab==='challenges') this.renderChallengesTab();
        if(tab==='avatar')     this.renderAvatarTab();
        if(tab==='setup')      this.renderSetup();
    }

    populateFilters(){
        const gf=document.getElementById('groupFilter');
        const groups=[...new Set(this.matches.map(m=>m.group))];
        gf.innerHTML='<option value="all">Tous les groupes</option>'+
            groups.map(g=>`<option value="${g}">Groupe ${g}</option>`).join('');
        this.populateDateFilter();
    }

    populateDateFilter(){
        const df=document.getElementById('dateFilter');if(!df)return;
        const allDates=new Set([...this.matches.map(m=>m.date),...this.playoffs.map(p=>p.date)]);
        const sorted=[...allDates].sort((a,b)=>this.dateOrder(a)-this.dateOrder(b));
        df.innerHTML='<option value="all">Toutes les dates</option>'+
            sorted.map(d=>`<option value="${d}">${this.dayName(d)}</option>`).join('');
    }

    filterMatches() {this.renderMatches();}
    filterPlayoffs(){this.renderPlayoffs(document.getElementById('phaseFilter').value);}
    filterByDate()  {this.renderByDate();}

    teamDisplay(name,big=false){
        return `<span class="${big?'team-flag-big':'team-flag'}">${flag(name)}</span><span>${name}</span>`;
    }

    dateOrder(d){
        const m={'11 juin':1,'12 juin':2,'13 juin':3,'14 juin':4,'15 juin':5,'16 juin':6,'17 juin':7,'18 juin':8,'19 juin':9,'20 juin':10,'21 juin':11,'22 juin':12,'23 juin':13,'24 juin':14,'25 juin':15,'26 juin':16,'27 juin':17,'28 juin':18,'29 juin':19,'30 juin':20,'1 juil.':21,'2 juil.':22,'3 juil.':23,'4 juil.':24,'5 juil.':25,'6 juil.':26,'7 juil.':27,'8 juil.':28,'9 juil.':29,'10 juil.':30,'11 juil.':31,'12 juil.':32,'13 juil.':33,'14 juil.':34,'15 juil.':35,'16 juil.':36,'17 juil.':37,'18 juil.':38,'19 juil.':39,'20 juil.':40,'21 juil.':41,'22 juil.':42,'23 juil.':43,'24 juil.':44,'25 juil.':45,'26 juil.':46};
        return m[d]||99;
    }
    dayName(d){
        const m={'11 juin':'Jeudi 11 juin 2026','12 juin':'Vendredi 12 juin 2026','13 juin':'Samedi 13 juin 2026','14 juin':'Dimanche 14 juin 2026','15 juin':'Lundi 15 juin 2026','16 juin':'Mardi 16 juin 2026','17 juin':'Mercredi 17 juin 2026','18 juin':'Jeudi 18 juin 2026','19 juin':'Vendredi 19 juin 2026','20 juin':'Samedi 20 juin 2026','21 juin':'Dimanche 21 juin 2026','22 juin':'Lundi 22 juin 2026','23 juin':'Mardi 23 juin 2026','24 juin':'Mercredi 24 juin 2026','25 juin':'Jeudi 25 juin 2026','26 juin':'Vendredi 26 juin 2026','27 juin':'Samedi 27 juin 2026','28 juin':'Dimanche 28 juin 2026','29 juin':'Lundi 29 juin 2026','30 juin':'Mardi 30 juin 2026','1 juil.':'Mercredi 1er juillet 2026','2 juil.':'Jeudi 2 juillet 2026','3 juil.':'Vendredi 3 juillet 2026','4 juil.':'Samedi 4 juillet 2026','5 juil.':'Dimanche 5 juillet 2026','6 juil.':'Lundi 6 juillet 2026','7 juil.':'Mardi 7 juillet 2026','8 juil.':'Mercredi 8 juillet 2026','9 juil.':'Jeudi 9 juillet 2026','10 juil.':'Vendredi 10 juillet 2026','11 juil.':'Samedi 11 juillet 2026','12 juil.':'Dimanche 12 juillet 2026','13 juil.':'Lundi 13 juillet 2026','14 juil.':'Mardi 14 juillet 2026','15 juil.':'Mercredi 15 juillet 2026','16 juil.':'Jeudi 16 juillet 2026','17 juil.':'Vendredi 17 juillet 2026','18 juil.':'Samedi 18 juillet 2026','19 juil.':'Dimanche 19 juillet 2026'};
        return m[d]||d;
    }

    // ════════════════════════════════════════════════════
    // ONGLET PAR DATE
    // ════════════════════════════════════════════════════
    renderByDate(){
        const sel=document.getElementById('dateFilter');
        const date=sel?sel.value:'all';
        const d=this.d();
        let all=[...this.matches.map(m=>({...m,_type:'match'})),...this.playoffs.map(p=>({...p,_type:'playoff'}))];
        if(date!=='all')all=all.filter(x=>x.date===date);
        all.sort((a,b)=>{const dif=this.dateOrder(a.date)-this.dateOrder(b.date);if(dif)return dif;return(typeof a.id==='number'?a.id:999)-(typeof b.id==='number'?b.id:999);});
        const info=document.getElementById('byDateInfo');
        if(info){const done=all.filter(x=>x._type==='match'?d.results[x.id]?.s1!==undefined:d.playoffResults[x.id]?.s1!==undefined).length;info.innerHTML=`<span class="info-player">⚽ ${done}/${all.length} terminés</span>`;}
        if(!all.length){document.getElementById('byDateList').innerHTML='<div class="no-teams-msg">📭 Aucun match</div>';return;}
        const byDate={};all.forEach(x=>{(byDate[x.date]=byDate[x.date]||[]).push(x);});
        let html='';
        Object.keys(byDate).sort((a,b)=>this.dateOrder(a)-this.dateOrder(b)).forEach(dt=>{
            const items=byDate[dt];
            const done=items.filter(x=>x._type==='match'?d.results[x.id]?.s1!==undefined:d.playoffResults[x.id]?.s1!==undefined).length;
            html+=`<div class="day-separator"><span class="day-icon">📅</span><span class="day-label">${this.dayName(dt)}<span class="day-label-sub">(date US — voir heures FR ci-dessous)</span></span><span class="day-count">${done}/${items.length} terminé${items.length>1?'s':''}</span></div>`;
            html+=this.buildDeroulement(items);
            items.forEach(x=>{html+=x._type==='match'?this.buildMatchCard(x):this.buildPlayoffCard(x);});
        });
        document.getElementById('byDateList').innerHTML=html;
    }

    // ════════════════════════════════════════════════════
    // ONGLET AUJOURD'HUI (résumé du jour, heure française)
    // ════════════════════════════════════════════════════
    // Calcule la date "française" (clé DATE_SEQUENCE) la plus proche d'aujourd'hui
    getTodayKey(){
        const now=new Date();
        // La CDM 2026 va du 11 juin au 19 juillet (clés dispo dans DATE_SEQUENCE jusqu'au 26 juil. inclus pour la finale)
        const year=now.getFullYear();
        // On compare uniquement mois/jour pour rester robuste hors année 2026
        const mmdd=(now.getMonth()+1)*100+now.getDate();
        const map=[
            [611,'11 juin'],[612,'12 juin'],[613,'13 juin'],[614,'14 juin'],[615,'15 juin'],[616,'16 juin'],[617,'17 juin'],[618,'18 juin'],[619,'19 juin'],[620,'20 juin'],[621,'21 juin'],[622,'22 juin'],[623,'23 juin'],[624,'24 juin'],[625,'25 juin'],[626,'26 juin'],[627,'27 juin'],[628,'28 juin'],[629,'29 juin'],[630,'30 juin'],
            [701,'1 juil.'],[702,'2 juil.'],[703,'3 juil.'],[704,'4 juil.'],[705,'5 juil.'],[706,'6 juil.'],[707,'7 juil.'],[709,'9 juil.'],[710,'10 juil.'],[711,'11 juil.'],[714,'14 juil.'],[715,'15 juil.'],[718,'18 juil.'],[719,'19 juil.']
        ];
        // Cherche une correspondance exacte
        const exact=map.find(([k])=>k===mmdd);
        if(exact)return exact[1];
        // Sinon, avant le tournoi → premier jour ; après → dernier jour
        if(mmdd<611)return '11 juin';
        return '19 juil.';
    }

    renderToday(){
        const d=this.d();
        const todayKey=this.getTodayKey();
        // On rassemble tous les matchs/playoffs dont l'heure FRANÇAISE tombe sur "aujourd'hui"
        let all=[...this.matches.map(m=>({...m,_type:'match'})),...this.playoffs.map(p=>({...p,_type:'playoff'}))];
        const todays=all.filter(x=>{
            const ft=toFrenchTime(x.date,x.time,x.stadium);
            return (ft.date||x.date)===todayKey;
        });

        let html=`<div class="today-hero">
            <div class="today-hero-bg"></div>
            <span class="today-hero-icon">📍</span>
            <div class="today-hero-text">
                <h2>Résumé du jour</h2>
                <p>${this.dayName(todayKey)} <span class="today-hint">(heure française)</span></p>
            </div>
        </div>`;

        if(!todays.length){
            html+=`<div class="no-teams-msg">📭 Aucun match aujourd'hui (heure française). Consultez l'onglet "Par date" pour voir le calendrier complet.</div>`;
        }else{
            html+=this.buildDeroulement(todays);
            todays
                .sort((a,b)=>this.timeOrder(a.time)-this.timeOrder(b.time))
                .forEach(x=>{html+=x._type==='match'?this.buildMatchCard(x):this.buildPlayoffCard(x);});
        }
        document.getElementById('todayContent').innerHTML=html;
    }

    renderMatches(){
        const group=document.getElementById('groupFilter').value;
        let list=group==='all'?[...this.matches]:this.matches.filter(m=>m.group===group);
        list.sort((a,b)=>a.group<b.group?-1:a.group>b.group?1:a.id-b.id);
        const byGroup={};list.forEach(m=>{(byGroup[m.group]=byGroup[m.group]||[]).push(m);});
        const d=this.d();let html='';
        Object.keys(byGroup).sort().forEach(g=>{
            const gm=byGroup[g];const done=gm.filter(m=>d.results[m.id]?.s1!==undefined).length;
            html+=`<div class="day-separator group-sep"><span class="day-icon">🏆</span><span class="day-label">Phase de Groupes ${g}</span><span class="day-count">${done}/${gm.length} terminé${gm.length>1?'s':''}</span></div>`;
            html+=this.buildDeroulement(gm.map(m=>({...m,_type:'match'})));
            html+=gm.map(m=>this.buildMatchCard(m)).join('');
        });
        document.getElementById('matchesList').innerHTML=html;
    }

    // Petit récap chronologique (date + heure FR + équipes + stade) pour un groupe de matchs
    buildDeroulement(items){
        if(!items||!items.length)return'';
        const d=this.d();
        const isAdmin=currentUser.isAdmin,me=currentUser.name;
        const sorted=[...items].sort((a,b)=>{
            const ta=this.timeOrder(a.time),tb=this.timeOrder(b.time);
            return ta-tb;
        });
        const rows=sorted.map(x=>{
            const team1=x._type==='match'?x.team1:(d.playoffResults[x.id]?.team1||x.team1);
            const team2=x._type==='match'?x.team2:(d.playoffResults[x.id]?.team2||x.team2);
            const ft=toFrenchTime(x.date,x.time,x.stadium);
            const dateTxt=ft.date?this.shortDayName(ft.date):'';
            const time=ft.time?`<span class="dr-time">🕐 ${ft.time}</span>`:'';
            const dateBadge=dateTxt?`<span class="dr-date">📅 ${dateTxt}</span>`:'';
            const stadium=x.venue?`<span class="dr-stadium">📍 ${x.venue}</span>`:'';
            // Score si dispo
            const result=x._type==='match'?d.results[x.id]:d.playoffResults[x.id];
            const hasRes=result&&result.s1!==undefined&&result.s2!==undefined;
            let teamsHtml;
            if(hasRes){
                teamsHtml=`${flag(team1)} ${team1} <strong class="dr-score">${result.s1} - ${result.s2}</strong> ${team2} ${flag(team2)}`;
            }else{
                teamsHtml=`${flag(team1)} ${team1} <span class="dr-vs">vs</span> ${team2} ${flag(team2)}`;
            }
            const cardId=`match-${x.id}`;

            // Mon pronostic validé pour ce match
            let myBetHtml='';
            if(!isAdmin){
                const betStore=x._type==='match'?d.bets:d.playoffBets;
                const bet=betStore[me]?.[x.id];
                const hasBet=bet&&bet.s1!==undefined&&bet.s2!==undefined;
                if(hasBet){
                    const locked=bet.locked===true;
                    if(hasRes){
                        const pts=x._type==='match'
                            ?this.calcPoints({s1:bet.s1,s2:bet.s2},{s1:result.s1,s2:result.s2})
                            :this.calcPlayoffPoints({s1:bet.s1,s2:bet.s2},{s1:result.s1,s2:result.s2});
                        myBetHtml=`<span class="dr-mybet dr-mybet-done">🎯 Mon prono : ${bet.s1}-${bet.s2}</span><span class="pts-badge pts${pts} dr-pts">${pts} pt${pts===1?'':'s'}</span>`;
                    }else{
                        myBetHtml=`<span class="dr-mybet ${locked?'dr-mybet-locked':''}">🎯 Mon prono : ${bet.s1}-${bet.s2}${locked?' 🔒':''}</span>`;
                    }
                }else if(!hasRes){
                    myBetHtml=`<span class="dr-mybet dr-mybet-empty">✏️ Pas encore pronostiqué</span>`;
                }
            }

            return `<div class="dr-row" onclick="app.goToMatch('${cardId}')" title="Cliquez pour voir / pronostiquer ce match">
                ${dateBadge}
                ${time}
                <span class="dr-teams">${teamsHtml}</span>
                ${stadium}
                ${myBetHtml}
                <span class="dr-arrow">▸</span>
            </div>`;
        }).join('');
        return `<div class="deroulement-box">
            <div class="dr-title"><span>📋</span> Déroulement <span class="dr-hint">(heure française · cliquez pour pronostiquer)</span></div>
            <div class="dr-list">${rows}</div>
        </div>`;
    }

    // Fait défiler la page jusqu'à la carte du match et la met en surbrillance
    goToMatch(cardId){
        const el=document.getElementById(cardId);
        if(!el)return;
        el.scrollIntoView({behavior:'smooth',block:'center'});
        el.classList.add('match-highlight');
        setTimeout(()=>el.classList.remove('match-highlight'),2000);
    }

    // Nom de jour court pour le déroulement, ex: "Jeu. 11 juin"
    shortDayName(d){
        const m={'11 juin':'Jeu. 11 juin','12 juin':'Ven. 12 juin','13 juin':'Sam. 13 juin','14 juin':'Dim. 14 juin','15 juin':'Lun. 15 juin','16 juin':'Mar. 16 juin','17 juin':'Mer. 17 juin','18 juin':'Jeu. 18 juin','19 juin':'Ven. 19 juin','20 juin':'Sam. 20 juin','21 juin':'Dim. 21 juin','22 juin':'Lun. 22 juin','23 juin':'Mar. 23 juin','24 juin':'Mer. 24 juin','25 juin':'Jeu. 25 juin','26 juin':'Ven. 26 juin','27 juin':'Sam. 27 juin','28 juin':'Dim. 28 juin','29 juin':'Lun. 29 juin','30 juin':'Mar. 30 juin','1 juil.':'Mer. 1 juil.','2 juil.':'Jeu. 2 juil.','3 juil.':'Ven. 3 juil.','4 juil.':'Sam. 4 juil.','5 juil.':'Dim. 5 juil.','6 juil.':'Lun. 6 juil.','7 juil.':'Mar. 7 juil.','8 juil.':'Mer. 8 juil.','9 juil.':'Jeu. 9 juil.','10 juil.':'Ven. 10 juil.','11 juil.':'Sam. 11 juil.','12 juil.':'Dim. 12 juil.','13 juil.':'Lun. 13 juil.','14 juil.':'Mar. 14 juil.','15 juil.':'Mer. 15 juil.','16 juil.':'Jeu. 16 juil.','17 juil.':'Ven. 17 juil.','18 juil.':'Sam. 18 juil.','19 juil.':'Dim. 19 juil.','20 juil.':'Lun. 20 juil.','21 juil.':'Mar. 21 juil.','22 juil.':'Mer. 22 juil.','23 juil.':'Jeu. 23 juil.','24 juil.':'Ven. 24 juil.','25 juil.':'Sam. 25 juil.','26 juil.':'Dim. 26 juil.'};
        return m[d]||d;
    }

    timeOrder(t){
        if(!t)return 999;
        const m=t.match(/(\d+)h(\d*)/);
        if(!m)return 999;
        return parseInt(m[1])*60+(m[2]?parseInt(m[2]):0);
    }

    buildMatchCard(match){
        const d=this.d(),result=d.results[match.id]||{};
        const hasRes=result.s1!==undefined&&result.s2!==undefined;
        const isAdmin=currentUser.isAdmin,me=currentUser.name;
        const ft=toFrenchTime(match.date,match.time,match.stadium);
        let html=`<div class="match-card ${hasRes?'is-finished':''}" id="match-${match.id}">
            <div class="match-header">
                <span class="group-badge">Phase de Groupes ${match.group}</span>
                <span class="match-date">📅 ${ft.date}</span>
                ${ft.time?`<span class="match-time">🕐 ${ft.time} (heure FR)</span>`:''}
                ${match.venue?`<span class="match-stadium">📍 ${match.venue}</span>`:''}
                <span class="${hasRes?'badge-finished':'badge-open'}" style="margin-left:auto">${hasRes?'✅ Terminé':'⏳ En cours'}</span>
            </div>
            <div class="match-teams">`;
        if(hasRes){
            html+=`<div class="team-name team-result"><span class="team-flag-big">${flag(match.team1)}</span><span class="team-name-txt">${match.team1}</span><span class="team-score-badge">${result.s1}</span></div>
                <div class="versus versus-final">—</div>
                <div class="team-name team-result"><span class="team-score-badge">${result.s2}</span><span class="team-name-txt">${match.team2}</span><span class="team-flag-big">${flag(match.team2)}</span></div>`;
        }else{
            html+=`<div class="team-name">${this.teamDisplay(match.team1,true)}</div>
                <div class="versus">VS</div>
                <div class="team-name">${this.teamDisplay(match.team2,true)}</div>`;
        }
        html+=`</div>`;
        if(hasRes)html+=`<div class="official-result">⚽ Résultat officiel : <strong>${flag(match.team1)} ${match.team1} ${result.s1} - ${result.s2} ${match.team2} ${flag(match.team2)}</strong></div>`;
        if(isAdmin)html+=`<div class="admin-box"><div class="admin-box-title">🔐 Résultat officiel ${hasRes?`<button onclick="app.clearResult(${match.id},'match')" class="btn-icon-red">🗑️</button>`:''}</div>
            <div class="admin-score-row">
                <span class="admin-team">${flag(match.team1)} ${match.team1}</span>
                <input type="number" min="0" class="score-input admin-input" value="${result.s1!==undefined?result.s1:''}" placeholder="0" onchange="app.saveResult(${match.id},'s1',this.value,'match')">
                <span class="admin-dash">—</span>
                <input type="number" min="0" class="score-input admin-input" value="${result.s2!==undefined?result.s2:''}" placeholder="0" onchange="app.saveResult(${match.id},'s2',this.value,'match')">
                <span class="admin-team">${flag(match.team2)} ${match.team2}</span>
            </div></div>`;
        html+=`<div class="bets-table"><div class="bets-header">📊 Pronostics</div>`;
        d.players.forEach(player=>{
            const bet=d.bets[player.name]?.[match.id]||{};
            const hasBet=bet.s1!==undefined&&bet.s2!==undefined;
            const locked=bet.locked===true,isMe=player.name===me&&!isAdmin;
            const canEdit=isAdmin?true:(isMe&&!locked&&!hasRes);
            let pts='';
            if(hasRes&&hasBet){const p=this.calcPoints({s1:bet.s1,s2:bet.s2},{s1:result.s1,s2:result.s2});pts=`<span class="pts-badge pts${p}">${p} pts</span>`;}
            const av=player.avatar||'🏳️';
            html+=`<div class="bet-row ${isMe?'bet-row-me':''}">
                <div class="bet-player">
                    <span class="bet-player-flag">${av}</span>
                    ${isMe?'<span class="dot-me">●</span>':''}
                    <strong>${player.name}</strong>
                    ${isMe?'<span class="tag-me">Vous</span>':''}
                    ${locked&&!hasRes?'<span class="lock-icon">🔒</span>':''}
                </div>
                <div class="bet-score-zone">`;
            if(canEdit){
                const cls=isAdmin?'admin-input':'my-input';
                html+=`<input type="number" min="0" class="score-input ${cls}" value="${bet.s1!==undefined?bet.s1:''}" placeholder="0" onchange="app.saveBet('${player.name}',${match.id},'s1',this.value,'match')">
                    <span class="bet-sep">—</span>
                    <input type="number" min="0" class="score-input ${cls}" value="${bet.s2!==undefined?bet.s2:''}" placeholder="0" onchange="app.saveBet('${player.name}',${match.id},'s2',this.value,'match')">`;
                if(!isAdmin&&isMe)html+=`<button onclick="app.lockBet('${player.name}',${match.id},'match')" class="btn-validate">✅ Valider</button>`;
                if(isAdmin&&hasBet)html+=`<button onclick="app.adminUnlockBet('${player.name}',${match.id},'match')" class="btn-icon">🔓</button><button onclick="app.adminClearBet('${player.name}',${match.id},'match')" class="btn-icon-red">🗑️</button>`;
            }else{
                html+=hasBet?`<span class="readonly-score">${bet.s1} — ${bet.s2}</span>`:`<span class="no-bet">Pas de pronostic</span>`;
                if(isAdmin&&locked)html+=`<button onclick="app.adminUnlockBet('${player.name}',${match.id},'match')" class="btn-icon">🔓</button>`;
                if(isAdmin&&hasBet)html+=`<button onclick="app.adminClearBet('${player.name}',${match.id},'match')" class="btn-icon-red">🗑️</button>`;
            }
            html+=`</div><div class="bet-pts">${pts}</div></div>`;
        });
        html+=`</div></div>`;return html;
    }

    // ════════════════════════════════════════════════════
    // PHASES FINALES
    // ════════════════════════════════════════════════════
    renderPlayoffs(phase='all'){
        const list=phase==='all'?this.playoffs:this.playoffs.filter(p=>p.phase===phase);
        document.getElementById('playoffsList').innerHTML=list.map(p=>this.buildPlayoffCard(p)).join('');
    }

    buildPlayoffCard(playoff){
        const d=this.d(),res=d.playoffResults[playoff.id]||{};
        const team1=res.team1||playoff.team1,team2=res.team2||playoff.team2;
        const hasTeams=team1!=='À déterminer'&&team2!=='À déterminer';
        const hasRes=res.s1!==undefined&&res.s2!==undefined;
        const isAdmin=currentUser.isAdmin,me=currentUser.name;
        let html=`<div class="match-card playoff-card ${hasRes?'is-finished':''}" id="match-${playoff.id}">
            <div class="match-header">
                <span class="group-badge playoff-badge">${playoff.phase} · Match ${playoff.match}</span>
                <span class="match-date">📅 ${playoff.date}</span>
                ${playoff.time?`<span class="match-time">🕐 ${playoff.time} (heure FR)</span>`:''}
                ${playoff.venue?`<span class="match-stadium">📍 ${playoff.venue}</span>`:''}
                <span class="${hasRes?'badge-finished':'badge-open'}" style="margin-left:auto">${hasRes?'✅ Terminé':'⏳ En attente'}</span>
            </div>`;
        if(isAdmin){
            html+=`<div class="admin-box"><div class="admin-box-title">🔐 Configurer équipes et résultat</div>
                <div class="playoff-teams-row">
                    <input type="text" class="team-edit-input" placeholder="Équipe 1" value="${team1!=='À déterminer'?team1:''}" onchange="app.savePlayoffTeam('${playoff.id}','team1',this.value)">
                    <span class="versus">VS</span>
                    <input type="text" class="team-edit-input" placeholder="Équipe 2" value="${team2!=='À déterminer'?team2:''}" onchange="app.savePlayoffTeam('${playoff.id}','team2',this.value)">
                </div>
                <div class="admin-score-row" style="margin-top:12px">
                    <span class="admin-team">${flag(team1)} ${team1}</span>
                    <input type="number" min="0" class="score-input admin-input" value="${res.s1!==undefined?res.s1:''}" placeholder="0" onchange="app.saveResult('${playoff.id}','s1',this.value,'playoff')">
                    <span class="admin-dash">—</span>
                    <input type="number" min="0" class="score-input admin-input" value="${res.s2!==undefined?res.s2:''}" placeholder="0" onchange="app.saveResult('${playoff.id}','s2',this.value,'playoff')">
                    <span class="admin-team">${flag(team2)} ${team2}</span>
                    ${hasRes?`<button onclick="app.clearResult('${playoff.id}','playoff')" class="btn-icon-red">🗑️</button>`:''}
                </div></div>`;
        }else if(hasRes){
            html+=`<div class="match-teams">
                <div class="team-name team-result"><span class="team-flag-big">${flag(team1)}</span><span class="team-name-txt">${team1}</span><span class="team-score-badge">${res.s1}</span></div>
                <div class="versus versus-final">—</div>
                <div class="team-name team-result"><span class="team-score-badge">${res.s2}</span><span class="team-name-txt">${team2}</span><span class="team-flag-big">${flag(team2)}</span></div>
            </div>`;
        }else{
            html+=`<div class="match-teams"><div class="team-name">${this.teamDisplay(team1,true)}</div><div class="versus">VS</div><div class="team-name">${this.teamDisplay(team2,true)}</div></div>`;
        }
        if(hasRes)html+=`<div class="official-result">🏆 Résultat : <strong>${flag(team1)} ${team1} ${res.s1} - ${res.s2} ${team2} ${flag(team2)}</strong></div>`;
        if(hasTeams){
            html+=`<div class="bets-table"><div class="bets-header">📊 Pronostics</div>`;
            d.players.forEach(player=>{
                const bet=d.playoffBets[player.name]?.[playoff.id]||{};
                const hasBet=bet.s1!==undefined&&bet.s2!==undefined;
                const locked=bet.locked===true,isMe=player.name===me&&!isAdmin;
                const canEdit=isAdmin?true:(isMe&&!locked&&!hasRes);
                let pts='';
                if(hasRes&&hasBet){const p=this.calcPlayoffPoints({s1:bet.s1,s2:bet.s2},{s1:res.s1,s2:res.s2});pts=`<span class="pts-badge pts${p}">${p} pts</span>`;}
                const av=player.avatar||'🏳️';
                html+=`<div class="bet-row ${isMe?'bet-row-me':''}">
                    <div class="bet-player">
                        <span class="bet-player-flag">${av}</span>
                        ${isMe?'<span class="dot-me">●</span>':''}
                        <strong>${player.name}</strong>
                        ${isMe?'<span class="tag-me">Vous</span>':''}
                        ${locked&&!hasRes?'<span class="lock-icon">🔒</span>':''}
                    </div>
                    <div class="bet-score-zone">`;
                if(canEdit){
                    const cls=isAdmin?'admin-input':'my-input';
                    html+=`<input type="number" min="0" class="score-input ${cls}" value="${bet.s1!==undefined?bet.s1:''}" placeholder="0" onchange="app.saveBet('${player.name}','${playoff.id}','s1',this.value,'playoff')">
                        <span class="bet-sep">—</span>
                        <input type="number" min="0" class="score-input ${cls}" value="${bet.s2!==undefined?bet.s2:''}" placeholder="0" onchange="app.saveBet('${player.name}','${playoff.id}','s2',this.value,'playoff')">`;
                    if(!isAdmin&&isMe)html+=`<button onclick="app.lockBet('${player.name}','${playoff.id}','playoff')" class="btn-validate">✅ Valider</button>`;
                    if(isAdmin&&hasBet)html+=`<button onclick="app.adminUnlockBet('${player.name}','${playoff.id}','playoff')" class="btn-icon">🔓</button><button onclick="app.adminClearBet('${player.name}','${playoff.id}','playoff')" class="btn-icon-red">🗑️</button>`;
                }else{
                    html+=hasBet?`<span class="readonly-score">${bet.s1} — ${bet.s2}</span>`:`<span class="no-bet">Pas de pronostic</span>`;
                    if(isAdmin&&locked)html+=`<button onclick="app.adminUnlockBet('${player.name}','${playoff.id}','playoff')" class="btn-icon">🔓</button>`;
                    if(isAdmin&&hasBet)html+=`<button onclick="app.adminClearBet('${player.name}','${playoff.id}','playoff')" class="btn-icon-red">🗑️</button>`;
                }
                html+=`</div><div class="bet-pts">${pts}</div></div>`;
            });
            html+=`</div>`;
        }else{html+=`<div class="no-teams-msg">⏳ Équipes à déterminer</div>`;}
        html+=`</div>`;return html;
    }

    savePlayoffTeam(id,field,value){
        if(!currentUser.isAdmin)return;
        const d=this.d();if(!d.playoffResults[id])d.playoffResults[id]={};
        d.playoffResults[id][field]=value;this.save(d);
        this.renderPlayoffs(document.getElementById('phaseFilter').value);
    }

    // ════════════════════════════════════════════════════
    // PRONOSTICS
    // ════════════════════════════════════════════════════
    saveBet(pN,mId,field,value,type){
        const d=this.d();
        if(!currentUser.isAdmin&&pN!==currentUser.name)return;
        if(!currentUser.isAdmin){const store=type==='match'?d.bets:d.playoffBets;if(store[pN]?.[mId]?.locked){toast('🔒 Pronostic verrouillé !','lock');return;}}
        if(type==='match'){if(!d.bets[pN])d.bets[pN]={};if(!d.bets[pN][mId])d.bets[pN][mId]={};d.bets[pN][mId][field]=parseInt(value)||0;}
        else{if(!d.playoffBets[pN])d.playoffBets[pN]={};if(!d.playoffBets[pN][mId])d.playoffBets[pN][mId]={};d.playoffBets[pN][mId][field]=parseInt(value)||0;}
        this.save(d);
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
    }

    lockBet(pN,mId,type){
        const d=this.d(),store=type==='match'?d.bets:d.playoffBets,bet=store[pN]?.[mId];
        if(!bet||bet.s1===undefined||bet.s2===undefined){toast('⚠️ Remplissez les deux scores !','warn');return;}
        store[pN][mId].locked=true;this.save(d);toast('🔒 Pronostic verrouillé !','lock');
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
    }

    adminUnlockBet(pN,mId,type){
        if(!currentUser.isAdmin)return;
        const d=this.d(),store=type==='match'?d.bets:d.playoffBets;
        if(store[pN]?.[mId])store[pN][mId].locked=false;
        this.save(d);toast(`🔓 ${pN} déverrouillé !`,'info');
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
    }

    adminClearBet(pN,mId,type){
        if(!currentUser.isAdmin)return;if(!confirm(`Effacer le pronostic de ${pN} ?`))return;
        const d=this.d(),store=type==='match'?d.bets:d.playoffBets;if(store[pN])delete store[pN][mId];
        this.save(d);toast(`🗑️ Pronostic effacé`,'info');
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
    }

    saveResult(mId,field,value,type){
        if(!currentUser.isAdmin)return;
        const d=this.d();
        if(type==='match'){if(!d.results[mId])d.results[mId]={};d.results[mId][field]=parseInt(value)||0;}
        else{if(!d.playoffResults[mId])d.playoffResults[mId]={};d.playoffResults[mId][field]=parseInt(value)||0;}
        this.save(d);
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
        this.renderRanking();
    }

    clearResult(mId,type){
        if(!currentUser.isAdmin)return;if(!confirm('Effacer ce résultat ?'))return;
        const d=this.d();
        if(type==='match')delete d.results[mId];
        else if(d.playoffResults[mId]){delete d.playoffResults[mId].s1;delete d.playoffResults[mId].s2;}
        this.save(d);
        type==='match'?this.renderMatches():this.renderPlayoffs(document.getElementById('phaseFilter').value);
        this.renderRanking();
    }

    unlockAll(target){
        if(!currentUser.isAdmin)return;
        const msgs={matches:'Déverrouiller TOUS les pronostics (Phase de Groupes) ?',playoffs:'Déverrouiller TOUS les pronostics (playoffs) ?',champion:'Déverrouiller TOUS les paris champion ?',results:'⚠️ Effacer TOUS les résultats ?'};
        if(!confirm(msgs[target]))return;
        const d=this.d();
        if(target==='matches'){Object.keys(d.bets).forEach(p=>Object.keys(d.bets[p]).forEach(id=>{d.bets[p][id].locked=false;}));this.save(d);this.renderMatches();toast('🔓 Phase de Groupes déverrouillée !','info');}
        else if(target==='playoffs'){Object.keys(d.playoffBets).forEach(p=>Object.keys(d.playoffBets[p]).forEach(id=>{d.playoffBets[p][id].locked=false;}));this.save(d);this.renderPlayoffs(document.getElementById('phaseFilter').value);toast('🔓 Playoffs déverrouillés !','info');}
        else if(target==='champion'){d.championBets={};this.save(d);this.renderChampionTab();toast('🔓 Paris champion effacés !','info');}
        else{d.results={};d.playoffResults={};this.save(d);this.renderMatches();this.renderPlayoffs();this.renderRanking();toast('🗑️ Résultats effacés !','info');}
    }

    calcPoints(bet,result){
        const{s1:b1,s2:b2}=bet,{s1:r1,s2:r2}=result;
        if(b1===undefined||r1===undefined)return 0;
        if(b1===r1&&b2===r2)return 3;
        const bD=b1-b2,rD=r1-r2,bR=bD>0?'W':bD<0?'L':'D',rR=rD>0?'W':rD<0?'L':'D';
        if(bR===rR)return 1;return 0;
    }

    calcPlayoffPoints(bet,result){
        const{s1:b1,s2:b2}=bet,{s1:r1,s2:r2}=result;
        if(b1===undefined||r1===undefined)return 0;
        if(b1===r1&&b2===r2)return 3;
        const bW=b1>b2?'1':b1<b2?'2':'D',rW=r1>r2?'1':r1<r2?'2':'D';
        return bW===rW?1:0;
    }

    // ════════════════════════════════════════════════════
    // CLASSEMENT
    // ════════════════════════════════════════════════════
    renderRanking(){
        const d=this.d(),ranking=this.calcRanking(d);
        const nbG=Object.values(d.results).filter(r=>r.s1!==undefined).length;
        const nbP=Object.values(d.playoffResults).filter(r=>r.s1!==undefined).length;
        document.getElementById('statsSummary').innerHTML=`
            <div class="stat-card"><div class="stat-icon">⚽</div><div class="stat-label">Groupes joués</div><div class="stat-value">${nbG}<span>/72</span></div></div>
            <div class="stat-card"><div class="stat-icon">🏅</div><div class="stat-label">Playoffs joués</div><div class="stat-value">${nbP}<span>/56</span></div></div>
            <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-label">Participants</div><div class="stat-value">${d.players.length}</div></div>
            <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-label">Leader</div><div class="stat-value leader">${ranking[0]?.avatar||''} ${ranking[0]?.name||'—'}</div></div>`;

        // Mini-classements par phase
        const byGroups=[...ranking].sort((a,b)=>b.gPts-a.gPts);
        const byPlayoffs=[...ranking].sort((a,b)=>b.pPts-a.pPts);
        const phaseRankingHtml=`<div class="phase-rankings">
            <div class="phase-rank-card">
                <div class="phase-rank-title">⚽ Top Phase de Groupes</div>
                ${byGroups.slice(0,3).map((p,i)=>`<div class="phase-rank-row"><span class="phase-rank-pos">${i===0?'🥇':i===1?'🥈':'🥉'}</span><span class="phase-rank-avatar">${p.avatar}</span><span class="phase-rank-name">${this.escHtml(p.name)}</span><span class="phase-rank-pts">${p.gPts} pts</span></div>`).join('')}
            </div>
            <div class="phase-rank-card">
                <div class="phase-rank-title">🏅 Top Phases Finales</div>
                ${byPlayoffs.slice(0,3).map((p,i)=>`<div class="phase-rank-row"><span class="phase-rank-pos">${i===0?'🥇':i===1?'🥈':'🥉'}</span><span class="phase-rank-avatar">${p.avatar}</span><span class="phase-rank-name">${this.escHtml(p.name)}</span><span class="phase-rank-pts">${p.pPts} pts</span></div>`).join('')}
            </div>
        </div>`;

        document.getElementById('rankingTable').innerHTML=`
        <table class="rank-table">
            <thead><tr><th>#</th><th>Joueur</th><th>⚽ Groupes</th><th>🏅 Playoffs</th><th>🏆 Champion</th><th>📊 Total</th><th>Paris</th><th>Moy.</th></tr></thead>
            <tbody>${ranking.map((p,i)=>`
            <tr class="${p.name===currentUser.name&&!currentUser.isAdmin?'rank-me':''}" style="animation-delay:${i*.04}s">
                <td class="rank-pos">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td>
                <td><span style="font-size:18px;margin-right:6px">${p.avatar||'🏳️'}</span><strong>${p.name}</strong>${p.name===currentUser.name&&!currentUser.isAdmin?'<span class="tag-me">Vous</span>':''}</td>
                <td>${p.gPts}</td><td>${p.pPts}</td>
                <td>${p.cPts>0?`<span class="pts-badge pts10">${p.cPts} pts</span>`:p.cPts===0&&d.championResult&&d.championBets?.[p.name]?'<span class="pts-badge pts0">0 pt</span>':'—'}</td>
                <td class="rank-total">${p.total}</td><td>${p.played}</td><td>${p.avg}</td>
            </tr>`).join('')}</tbody>
        </table>
        ${phaseRankingHtml}
        <div class="ranking-rules"><div class="ranking-rules-title">📖 Règles du jeu</div>
        <div class="ranking-rules-grid">
            <div class="ranking-rule-item"><span class="pts-badge pts3">3 pts</span><span>Score exact</span></div>
            <div class="ranking-rule-item"><span class="pts-badge pts1">1 pt</span><span>Bon vainqueur / nul</span></div>
            <div class="ranking-rule-item"><span class="pts-badge pts0">0 pt</span><span>Mauvais pronostic</span></div>
            <div class="ranking-rule-item"><span class="pts-badge pts10">10 pts</span><span>🏆 Champion du Monde : bon pays</span></div>
        </div></div>`;
    }

    calcRanking(d){
        return d.players.map(player=>{
            let gPts=0,pPts=0,cPts=0,played=0;
            Object.entries(d.results).forEach(([id,r])=>{if(r.s1===undefined)return;const b=d.bets[player.name]?.[id];if(!b||b.s1===undefined)return;gPts+=this.calcPoints(b,r);played++;});
            Object.entries(d.playoffResults).forEach(([id,r])=>{if(r.s1===undefined)return;const b=d.playoffBets[player.name]?.[id];if(!b||b.s1===undefined)return;pPts+=this.calcPlayoffPoints(b,r);played++;});
            const champBet=d.championBets?.[player.name];
            const champRes=d.championResult;
            if(champBet&&champRes&&champBet===champRes){cPts=10;played++;}
            else if(champBet&&champRes){played++;}
            return{name:player.name,avatar:player.avatar||'🏳️',gPts,pPts,cPts,total:gPts+pPts+cPts,played,avg:played>0?((gPts+pPts+cPts)/played).toFixed(2):'0.00'};
        }).sort((a,b)=>b.total-a.total);
    }

    // ════════════════════════════════════════════════════
    // STATISTIQUES DÉTAILLÉES & BADGES
    // ════════════════════════════════════════════════════
    // Construit, pour un joueur, la liste chronologique des points obtenus
    // sur chaque match terminé (groupes + playoffs), triée par date/heure.
    playerPointsTimeline(player,d){
        const timeline=[];
        this.matches.forEach(m=>{
            const r=d.results[m.id];
            if(!r||r.s1===undefined)return;
            const b=d.bets[player.name]?.[m.id];
            const hasBet=b&&b.s1!==undefined&&b.s2!==undefined;
            const pts=hasBet?this.calcPoints(b,r):0;
            timeline.push({order:this.dateOrder(m.date)*1000+this.timeOrder(m.time),pts,exact:hasBet&&b.s1===r.s1&&b.s2===r.s2,hasBet});
        });
        this.playoffs.forEach(p=>{
            const r=d.playoffResults[p.id];
            if(!r||r.s1===undefined)return;
            const b=d.playoffBets[player.name]?.[p.id];
            const hasBet=b&&b.s1!==undefined&&b.s2!==undefined;
            const pts=hasBet?this.calcPlayoffPoints(b,r):0;
            timeline.push({order:this.dateOrder(p.date)*1000+9000,pts,exact:hasBet&&b.s1===r.s1&&b.s2===r.s2,hasBet});
        });
        timeline.sort((a,b)=>a.order-b.order);
        return timeline;
    }

    // Statistiques détaillées d'un joueur : taux de réussite, équipe favorite, etc.
    calcPlayerDetailStats(player,d){
        let exact=0,goodWinner=0,wrong=0,total=0;
        const teamCount={};
        const countBet=(b,r,calcFn,team1,team2)=>{
            if(!b||b.s1===undefined||b.s2===undefined)return;
            total++;
            const pts=calcFn(b,r);
            if(pts===3)exact++;else if(pts===1)goodWinner++;else wrong++;
            [team1,team2].forEach(t=>{if(t&&t!=='À déterminer')teamCount[t]=(teamCount[t]||0)+1;});
        };
        this.matches.forEach(m=>{
            const r=d.results[m.id];if(!r||r.s1===undefined)return;
            countBet(d.bets[player.name]?.[m.id],r,(b,rr)=>this.calcPoints(b,rr),m.team1,m.team2);
        });
        this.playoffs.forEach(p=>{
            const r=d.playoffResults[p.id];if(!r||r.s1===undefined)return;
            const team1=r.team1||p.team1,team2=r.team2||p.team2;
            countBet(d.playoffBets[player.name]?.[p.id],r,(b,rr)=>this.calcPlayoffPoints(b,rr),team1,team2);
        });
        const favTeam=Object.entries(teamCount).sort((a,b)=>b[1]-a[1])[0];
        const accuracy=total>0?Math.round(((exact+goodWinner)/total)*100):0;
        const exactRate=total>0?Math.round((exact/total)*100):0;
        return{exact,goodWinner,wrong,total,accuracy,exactRate,favTeam:favTeam?favTeam[0]:null};
    }

    // Calcule les badges débloqués pour un joueur
    calcPlayerBadges(player,d){
        const timeline=this.playerPointsTimeline(player,d);
        const stats=this.calcPlayerDetailStats(player,d);
        const badges=[];

        // Série de scores exacts consécutifs
        let bestStreak=0,curStreak=0;
        timeline.forEach(t=>{
            if(!t.hasBet){curStreak=0;return;}
            if(t.exact){curStreak++;bestStreak=Math.max(bestStreak,curStreak);}
            else curStreak=0;
        });
        if(bestStreak>=3)badges.push({icon:'🔥',name:'En feu',desc:`${bestStreak} scores exacts d'affilée`});
        else if(bestStreak>=2)badges.push({icon:'✨',name:'Sur sa lancée',desc:'2 scores exacts d\'affilée'});

        // 100% sur un groupe
        const groupsByLetter={};
        this.matches.forEach(m=>{
            const r=d.results[m.id];if(!r||r.s1===undefined)return;
            const b=d.bets[player.name]?.[m.id];
            if(!groupsByLetter[m.group])groupsByLetter[m.group]={done:0,exact:0};
            groupsByLetter[m.group].done++;
            if(b&&b.s1===r.s1&&b.s2===r.s2)groupsByLetter[m.group].exact++;
        });
        const perfectGroup=Object.entries(groupsByLetter).find(([g,v])=>v.done===6&&v.exact===6);
        if(perfectGroup)badges.push({icon:'💯',name:'Groupe parfait',desc:`100% sur le groupe ${perfectGroup[0]}`});

        // Premier de la classe
        const ranking=this.calcRanking(d);
        if(ranking.length&&ranking[0].name===player.name&&ranking[0].total>0)badges.push({icon:'👑',name:'Leader',desc:'1er au classement général'});

        // Buteur de précision (taux de score exact ≥ 30% sur au moins 5 pronos)
        if(stats.total>=5&&stats.exactRate>=30)badges.push({icon:'🎯',name:'Précision chirurgicale',desc:`${stats.exactRate}% de scores exacts`});

        // Régularité (taux de réussite global ≥ 60% sur au moins 8 pronos)
        if(stats.total>=8&&stats.accuracy>=60)badges.push({icon:'📈',name:'Métronome',desc:`${stats.accuracy}% de bons pronostics`});

        // Champion confirmé (pari champion correct)
        if(d.championResult&&d.championBets?.[player.name]===d.championResult)badges.push({icon:'🏆',name:'Voyant',desc:'A trouvé le futur champion du monde'});

        // Participation totale
        if(stats.total>=20)badges.push({icon:'🎟️',name:'Assidu',desc:`${stats.total} pronostics joués`});

        // Mauvaise passe
        let worstStreak=0,curBad=0;
        timeline.forEach(t=>{
            if(!t.hasBet){curBad=0;return;}
            if(t.pts===0){curBad++;worstStreak=Math.max(worstStreak,curBad);}else curBad=0;
        });
        if(worstStreak>=4)badges.push({icon:'🌧️',name:'Jour de pluie',desc:`${worstStreak} pronostics ratés d'affilée`});

        return badges;
    }

    // ════════════════════════════════════════════════════
    // ONGLET STATS & BADGES
    // ════════════════════════════════════════════════════
    renderStatsTab(){
        const d=this.d();
        const isAdmin=currentUser.isAdmin;
        const me=currentUser.name;
        const defaultPlayer=isAdmin?(d.players[0]?.name||''):me;
        const selected=this._statsSelectedPlayer&&d.players.some(p=>p.name===this._statsSelectedPlayer)
            ?this._statsSelectedPlayer:defaultPlayer;
        this._statsSelectedPlayer=selected;

        let html=`<div class="stats-hero">
            <div class="stats-hero-bg"></div>
            <span class="stats-hero-icon">📈</span>
            <div class="stats-hero-text">
                <h2>Statistiques & Badges</h2>
                <p>Performance détaillée et trophées débloqués</p>
            </div>
        </div>`;

        // Sélecteur de joueur
        html+=`<div class="stats-player-select">
            <label class="filter-lbl">👤 Joueur</label>
            <div class="select-wrap">
                <select onchange="app.changeStatsPlayer(this.value)">
                    ${d.players.map(p=>`<option value="${this.escHtml(p.name)}"${p.name===selected?' selected':''}>${p.avatar||'🏳️'} ${p.name}${p.name===me&&!isAdmin?' (Vous)':''}</option>`).join('')}
                </select>
                <span class="sel-arrow">▾</span>
            </div>
        </div>`;

        const player=d.players.find(p=>p.name===selected);
        if(!player){document.getElementById('statsContent').innerHTML=html+'<div class="no-teams-msg">Aucun joueur</div>';return;}

        const stats=this.calcPlayerDetailStats(player,d);
        const badges=this.calcPlayerBadges(player,d);
        const ranking=this.calcRanking(d);
        const rank=ranking.findIndex(p=>p.name===player.name)+1;
        const myRankData=ranking.find(p=>p.name===player.name);

        // Cartes stats
        html+=`<div class="stats-cards-grid">
            <div class="stat-card-big"><div class="scb-icon">🎯</div><div class="scb-value">${stats.exactRate}%</div><div class="scb-label">Scores exacts</div><div class="scb-sub">${stats.exact}/${stats.total} pronostics</div></div>
            <div class="stat-card-big"><div class="scb-icon">✅</div><div class="scb-value">${stats.accuracy}%</div><div class="scb-label">Taux de réussite</div><div class="scb-sub">exact + bon vainqueur</div></div>
            <div class="stat-card-big"><div class="scb-icon">📊</div><div class="scb-value">${myRankData?.total||0}</div><div class="scb-label">Points totaux</div><div class="scb-sub">${rank}${rank===1?'er':'e'} au classement</div></div>
            <div class="stat-card-big"><div class="scb-icon">⚽</div><div class="scb-value">${stats.favTeam?flag(stats.favTeam):'—'}</div><div class="scb-label">Équipe favorite</div><div class="scb-sub">${stats.favTeam||'Aucun prono'}</div></div>
        </div>`;

        // Détail répartition
        html+=`<div class="stats-breakdown">
            <div class="sbd-title">📋 Répartition des pronostics</div>
            <div class="sbd-bars">
                <div class="sbd-row"><span class="sbd-label">🎯 Score exact (3 pts)</span><div class="sbd-bar-track"><div class="sbd-bar sbd-bar-exact" style="width:${stats.total?Math.round(stats.exact/stats.total*100):0}%"></div></div><span class="sbd-count">${stats.exact}</span></div>
                <div class="sbd-row"><span class="sbd-label">✅ Bon vainqueur (1 pt)</span><div class="sbd-bar-track"><div class="sbd-bar sbd-bar-winner" style="width:${stats.total?Math.round(stats.goodWinner/stats.total*100):0}%"></div></div><span class="sbd-count">${stats.goodWinner}</span></div>
                <div class="sbd-row"><span class="sbd-label">❌ Raté (0 pt)</span><div class="sbd-bar-track"><div class="sbd-bar sbd-bar-wrong" style="width:${stats.total?Math.round(stats.wrong/stats.total*100):0}%"></div></div><span class="sbd-count">${stats.wrong}</span></div>
            </div>
        </div>`;

        // Badges
        html+=`<div class="badges-section">
            <div class="sbd-title">🏅 Badges débloqués (${badges.length})</div>`;
        if(!badges.length){
            html+=`<div class="no-teams-msg">Aucun badge débloqué pour le moment — continuez à pronostiquer !</div>`;
        }else{
            html+=`<div class="badges-grid">${badges.map(b=>`
                <div class="badge-card">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-info"><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div></div>
                </div>`).join('')}</div>`;
        }
        html+=`</div>`;

        // Graphique d'évolution
        html+=`<div class="evolution-section">
            <div class="sbd-title">📈 Évolution du classement (points cumulés)</div>
            <div id="evolutionChart">${this.buildEvolutionChart(d)}</div>
        </div>`;

        document.getElementById('statsContent').innerHTML=html;
    }

    changeStatsPlayer(name){
        this._statsSelectedPlayer=name;
        this.renderStatsTab();
    }

    // Construit un graphique SVG d'évolution des points cumulés pour tous les joueurs
    buildEvolutionChart(d){
        const players=d.players;
        if(!players.length)return'<div class="no-teams-msg">Aucun joueur</div>';

        // Construit la timeline de tous les matchs terminés (groupes + playoffs), triée chronologiquement
        const events=[];
        this.matches.forEach(m=>{
            const r=d.results[m.id];if(!r||r.s1===undefined)return;
            events.push({order:this.dateOrder(m.date)*1000+this.timeOrder(m.time),type:'match',id:m.id,result:r});
        });
        this.playoffs.forEach(p=>{
            const r=d.playoffResults[p.id];if(!r||r.s1===undefined)return;
            events.push({order:this.dateOrder(p.date)*1000+9000,type:'playoff',id:p.id,result:r});
        });
        events.sort((a,b)=>a.order-b.order);

        if(!events.length)return'<div class="no-teams-msg">📭 Aucun match terminé pour le moment — le graphique apparaîtra dès les premiers résultats.</div>';

        // Pour chaque joueur, calcule la série cumulée de points
        const series={};
        players.forEach(p=>series[p.name]=[0]);
        events.forEach(ev=>{
            players.forEach(p=>{
                const last=series[p.name][series[p.name].length-1];
                let pts=0;
                if(ev.type==='match'){
                    const b=d.bets[p.name]?.[ev.id];
                    if(b&&b.s1!==undefined)pts=this.calcPoints(b,ev.result);
                }else{
                    const b=d.playoffBets[p.name]?.[ev.id];
                    if(b&&b.s1!==undefined)pts=this.calcPlayoffPoints(b,ev.result);
                }
                series[p.name].push(last+pts);
            });
        });

        const maxVal=Math.max(1,...Object.values(series).map(s=>Math.max(...s)));
        const W=800,H=320,padL=40,padR=20,padT=20,padB=30;
        const plotW=W-padL-padR,plotH=H-padT-padB;
        const nPoints=events.length+1;
        const xStep=nPoints>1?plotW/(nPoints-1):0;

        const colors=['#003087','#c8102e','#00a651','#ffb300','#8e44ad','#16a085','#e67e22','#2980b9','#d35400','#27ae60','#c0392b','#7f8c8d'];

        let svg=`<svg viewBox="0 0 ${W} ${H}" class="evo-svg" preserveAspectRatio="xMidYMid meet">`;
        // Grille horizontale
        for(let i=0;i<=4;i++){
            const y=padT+plotH-(plotH*i/4);
            const val=Math.round(maxVal*i/4);
            svg+=`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" class="evo-grid"/>`;
            svg+=`<text x="${padL-6}" y="${y+4}" class="evo-axis-label" text-anchor="end">${val}</text>`;
        }
        // Lignes par joueur
        players.forEach((p,pi)=>{
            const s=series[p.name];
            const color=colors[pi%colors.length];
            const pts=s.map((v,i)=>{
                const x=padL+xStep*i;
                const y=padT+plotH-(plotH*v/maxVal);
                return `${x},${y}`;
            }).join(' ');
            svg+=`<polyline points="${pts}" class="evo-line" style="stroke:${color}" />`;
            // Point final + label
            const lastX=padL+xStep*(s.length-1);
            const lastY=padT+plotH-(plotH*s[s.length-1]/maxVal);
            svg+=`<circle cx="${lastX}" cy="${lastY}" r="4" style="fill:${color}" />`;
        });
        svg+=`</svg>`;

        // Légende
        const legend=players.map((p,pi)=>{
            const color=colors[pi%colors.length];
            const finalScore=series[p.name][series[p.name].length-1];
            return `<div class="evo-legend-item"><span class="evo-legend-dot" style="background:${color}"></span>${p.avatar||'🏳️'} ${this.escHtml(p.name)} <strong>${finalScore}</strong></div>`;
        }).join('');

        return `<div class="evo-chart-wrap">${svg}</div><div class="evo-legend">${legend}</div>`;
    }

    // ════════════════════════════════════════════════════
    // ONGLET MUR DES PRONOSTICS
    // ════════════════════════════════════════════════════
    renderWallTab(){
        const d=this.d();
        const todayKey=this.getTodayKey();

        // Matchs du jour (heure FR) non encore joués
        let all=[...this.matches.map(m=>({...m,_type:'match'})),...this.playoffs.map(p=>({...p,_type:'playoff'}))];
        const todays=all.filter(x=>{
            const ft=toFrenchTime(x.date,x.time,x.stadium);
            return (ft.date||x.date)===todayKey;
        }).sort((a,b)=>this.timeOrder(a.time)-this.timeOrder(b.time));

        let html=`<div class="wall-hero">
            <div class="wall-hero-bg"></div>
            <span class="wall-hero-icon">📰</span>
            <div class="wall-hero-text">
                <h2>Mur des pronostics</h2>
                <p>Les pronos de tout le monde pour les matchs du jour</p>
            </div>
        </div>`;

        if(!todays.length){
            html+=`<div class="no-teams-msg">📭 Aucun match aujourd'hui — revenez le jour d'un match pour voir le mur se remplir !</div>`;
        }else{
            todays.forEach(x=>{
                const team1=x._type==='match'?x.team1:(d.playoffResults[x.id]?.team1||x.team1);
                const team2=x._type==='match'?x.team2:(d.playoffResults[x.id]?.team2||x.team2);
                const betStore=x._type==='match'?d.bets:d.playoffBets;
                const ft=toFrenchTime(x.date,x.time,x.stadium);
                html+=`<div class="wall-match-block">
                    <div class="wall-match-header">
                        <span class="wall-match-teams">${flag(team1)} ${team1} <span class="dr-vs">vs</span> ${team2} ${flag(team2)}</span>
                        <span class="wall-match-time">🕐 ${ft.time||x.time||''}</span>
                    </div>
                    <div class="wall-bets-grid">`;
                d.players.forEach(player=>{
                    const bet=betStore[player.name]?.[x.id];
                    const hasBet=bet&&bet.s1!==undefined&&bet.s2!==undefined;
                    const locked=bet?.locked===true;
                    if(hasBet){
                        html+=`<div class="wall-bet-chip ${locked?'wall-bet-locked':'wall-bet-pending'}">
                            <span class="wall-bet-avatar">${player.avatar||'🏳️'}</span>
                            <span class="wall-bet-name">${this.escHtml(player.name)}</span>
                            <span class="wall-bet-score">${bet.s1}-${bet.s2}</span>
                            ${locked?'<span class="wall-bet-lock">🔒</span>':'<span class="wall-bet-lock-empty">✏️</span>'}
                        </div>`;
                    }else{
                        html+=`<div class="wall-bet-chip wall-bet-empty">
                            <span class="wall-bet-avatar">${player.avatar||'🏳️'}</span>
                            <span class="wall-bet-name">${this.escHtml(player.name)}</span>
                            <span class="wall-bet-score">—</span>
                        </div>`;
                    }
                });
                html+=`</div></div>`;
            });
        }

        document.getElementById('wallContent').innerHTML=html;
    }

    // ════════════════════════════════════════════════════
    // ONGLET DÉFIS ENTRE JOUEURS
    // ════════════════════════════════════════════════════
    renderChallengesTab(){
        const d=this.d();
        const isAdmin=currentUser.isAdmin;
        const me=currentUser.name;

        let html=`<div class="challenges-hero">
            <div class="challenges-hero-bg"></div>
            <span class="challenges-hero-icon">⚔️</span>
            <div class="challenges-hero-text">
                <h2>Défis entre joueurs</h2>
                <p>Lancez un défi 1v1 sur un match : le plus proche du score exact gagne !</p>
            </div>
        </div>`;

        if(!isAdmin){
            // Formulaire de création de défi
            const opponents=d.players.filter(p=>p.name!==me);
            const allMatches=[...this.matches.map(m=>({...m,_type:'match'})),...this.playoffs.filter(p=>p.team1!=='À déterminer'&&p.team2!=='À déterminer').map(p=>({...p,_type:'playoff'}))]
                .filter(x=>{
                    const res=x._type==='match'?d.results[x.id]:d.playoffResults[x.id];
                    return !(res&&res.s1!==undefined);
                });
            html+=`<div class="challenge-create-card">
                <div class="sbd-title">➕ Lancer un défi</div>
                <div class="challenge-form">
                    <div class="form-group">
                        <label>🆚 Adversaire</label>
                        <div class="select-wrap">
                            <select id="challengeOpponent">
                                ${opponents.map(p=>`<option value="${this.escHtml(p.name)}">${p.avatar||'🏳️'} ${p.name}</option>`).join('')}
                            </select>
                            <span class="sel-arrow">▾</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>⚽ Match</label>
                        <div class="select-wrap">
                            <select id="challengeMatch">
                                ${allMatches.map(x=>{
                                    const team1=x._type==='match'?x.team1:(d.playoffResults[x.id]?.team1||x.team1);
                                    const team2=x._type==='match'?x.team2:(d.playoffResults[x.id]?.team2||x.team2);
                                    const ft=toFrenchTime(x.date,x.time,x.stadium);
                                    return `<option value="${x._type}_${x.id}">${team1} vs ${team2} — ${ft.date}${ft.time?' '+ft.time:''}</option>`;
                                }).join('')}
                            </select>
                            <span class="sel-arrow">▾</span>
                        </div>
                    </div>
                    <button onclick="app.createChallenge()" class="btn-primary">⚔️ Envoyer le défi</button>
                </div>
                <p class="setup-info" style="margin-top:10px">Le défi compare vos pronostics déjà saisis sur ce match. Celui qui obtient le plus de points (selon les règles habituelles) gagne le défi. En cas d'égalité : match nul.</p>
            </div>`;
        }

        // Liste des défis
        const challenges=[...(d.challenges||[])].sort((a,b)=>b.createdAt-a.createdAt);
        html+=`<div class="challenges-list">`;
        if(!challenges.length){
            html+=`<div class="no-teams-msg">📭 Aucun défi en cours — soyez le premier à en lancer un !</div>`;
        }else{
            challenges.forEach(ch=>{
                html+=this.buildChallengeCard(ch,d);
            });
        }
        html+=`</div>`;

        document.getElementById('challengesContent').innerHTML=html;
    }

    buildChallengeCard(ch,d){
        const me=currentUser.name;
        const isAdmin=currentUser.isAdmin;
        // Retrouve le match concerné
        let item=null,team1='',team2='',result=null;
        if(ch.matchType==='match'){
            item=this.matches.find(m=>m.id===ch.matchId);
            if(item){team1=item.team1;team2=item.team2;result=d.results[item.id];}
        }else{
            item=this.playoffs.find(p=>p.id===ch.matchId);
            if(item){const r=d.playoffResults[item.id]||{};team1=r.team1||item.team1;team2=r.team2||item.team2;result=d.playoffResults[item.id];}
        }
        if(!item)return'';
        const ft=toFrenchTime(item.date,item.time,item.stadium);
        const hasRes=result&&result.s1!==undefined;

        const betA=ch.matchType==='match'?d.bets[ch.from]?.[ch.matchId]:d.playoffBets[ch.from]?.[ch.matchId];
        const betB=ch.matchType==='match'?d.bets[ch.to]?.[ch.matchId]:d.playoffBets[ch.to]?.[ch.matchId];
        const hasBetA=betA&&betA.s1!==undefined,hasBetB=betB&&betB.s1!==undefined;

        const playerA=d.players.find(p=>p.name===ch.from);
        const playerB=d.players.find(p=>p.name===ch.to);

        let statusHtml='';
        let cardClass='challenge-pending';
        if(ch.status==='refused'){
            statusHtml=`<div class="challenge-status challenge-status-refused">❌ Défi refusé</div>`;
            cardClass='challenge-refused';
        }else if(ch.status==='pending'){
            if(!isAdmin&&ch.to===me){
                statusHtml=`<div class="challenge-actions">
                    <button onclick="app.respondChallenge('${ch.id}','accepted')" class="btn-validate">✅ Accepter</button>
                    <button onclick="app.respondChallenge('${ch.id}','refused')" class="btn-icon-red">❌ Refuser</button>
                </div>`;
            }else{
                statusHtml=`<div class="challenge-status challenge-status-pending">⏳ En attente de réponse de ${this.escHtml(ch.to)}</div>`;
            }
            cardClass='challenge-pending';
        }else if(ch.status==='accepted'){
            if(hasRes){
                const ptsA=hasBetA?(ch.matchType==='match'?this.calcPoints(betA,result):this.calcPlayoffPoints(betA,result)):0;
                const ptsB=hasBetB?(ch.matchType==='match'?this.calcPoints(betB,result):this.calcPlayoffPoints(betB,result)):0;
                let winnerHtml='';
                if(ptsA>ptsB)winnerHtml=`<div class="challenge-result challenge-win">🏆 ${this.escHtml(ch.from)} gagne le défi !</div>`;
                else if(ptsB>ptsA)winnerHtml=`<div class="challenge-result challenge-win">🏆 ${this.escHtml(ch.to)} gagne le défi !</div>`;
                else winnerHtml=`<div class="challenge-result challenge-draw">🤝 Match nul !</div>`;
                statusHtml=`<div class="challenge-scores">
                    <div class="challenge-score-row"><span>${playerA?.avatar||'🏳️'} ${this.escHtml(ch.from)}</span><span class="challenge-score-val">${hasBetA?`${betA.s1}-${betA.s2}`:'—'} <span class="pts-badge pts${ptsA}">${ptsA} pt${ptsA===1?'':'s'}</span></span></div>
                    <div class="challenge-score-row"><span>${playerB?.avatar||'🏳️'} ${this.escHtml(ch.to)}</span><span class="challenge-score-val">${hasBetB?`${betB.s1}-${betB.s2}`:'—'} <span class="pts-badge pts${ptsB}">${ptsB} pt${ptsB===1?'':'s'}</span></span></div>
                </div>${winnerHtml}`;
                cardClass='challenge-done';
            }else{
                statusHtml=`<div class="challenge-status challenge-status-accepted">✅ Défi accepté — résultat à venir</div>
                <div class="challenge-scores">
                    <div class="challenge-score-row"><span>${playerA?.avatar||'🏳️'} ${this.escHtml(ch.from)}</span><span class="challenge-score-val">${hasBetA?`${betA.s1}-${betA.s2}`:'Pas encore pronostiqué'}</span></div>
                    <div class="challenge-score-row"><span>${playerB?.avatar||'🏳️'} ${this.escHtml(ch.to)}</span><span class="challenge-score-val">${hasBetB?`${betB.s1}-${betB.s2}`:'Pas encore pronostiqué'}</span></div>
                </div>`;
                cardClass='challenge-accepted';
            }
        }

        return `<div class="challenge-card ${cardClass}">
            <div class="challenge-header">
                <span class="challenge-vs">${playerA?.avatar||'🏳️'} ${this.escHtml(ch.from)} <span class="dr-vs">défie</span> ${playerB?.avatar||'🏳️'} ${this.escHtml(ch.to)}</span>
                ${isAdmin?`<button onclick="app.deleteChallenge('${ch.id}')" class="btn-icon-red" style="margin-left:auto">🗑️</button>`:''}
            </div>
            <div class="challenge-match-info">⚽ ${flag(team1)} ${team1} vs ${team2} ${flag(team2)} — 📅 ${ft.date}${ft.time?` 🕐 ${ft.time}`:''}</div>
            ${statusHtml}
        </div>`;
    }

    createChallenge(){
        const opponent=document.getElementById('challengeOpponent')?.value;
        const matchVal=document.getElementById('challengeMatch')?.value;
        if(!opponent||!matchVal){toast('⚠️ Sélectionnez un adversaire et un match !','warn');return;}
        const[matchType,matchId]=matchVal.split('_');
        const id=matchType==='match'?parseInt(matchId):matchId;
        const d=this.d();
        if(!d.challenges)d.challenges=[];
        d.challenges.push({
            id:Date.now()+'_'+Math.random().toString(36).slice(2,7),
            from:currentUser.name,
            to:opponent,
            matchType,
            matchId:id,
            status:'pending',
            createdAt:Date.now()
        });
        this.save(d);
        this.renderChallengesTab();
        toast(`⚔️ Défi envoyé à ${opponent} !`,'success');
    }

    respondChallenge(challengeId,response){
        const d=this.d();
        if(!d.challenges)d.challenges=[];
        const ch=d.challenges.find(c=>c.id===challengeId);
        if(!ch)return;
        if(!currentUser.isAdmin&&ch.to!==currentUser.name)return;
        ch.status=response;
        this.save(d);
        this.renderChallengesTab();
        toast(response==='accepted'?'✅ Défi accepté !':'❌ Défi refusé','info');
    }

    deleteChallenge(challengeId){
        if(!currentUser.isAdmin)return;
        const d=this.d();
        d.challenges=(d.challenges||[]).filter(c=>c.id!==challengeId);
        this.save(d);
        this.renderChallengesTab();
        toast('🗑️ Défi supprimé','info');
    }

    // ════════════════════════════════════════════════════
    // ONGLET AVATAR (tous les joueurs + admin)
    // ════════════════════════════════════════════════════
    renderAvatarTab(){
        const d = this.d();
        const isAdmin = currentUser.isAdmin;
        const me = currentUser.name;

        let html = `<div class="avatar-hero">
            <span class="avatar-hero-icon">🎌</span>
            <div class="avatar-hero-text">
                <h2>${isAdmin?'Drapeaux de tous les joueurs':'Mon avatar drapeau'}</h2>
                <p>${isAdmin?'Modifiez l\'avatar de chaque joueur':'Choisissez votre drapeau national'}</p>
            </div>
        </div>`;

        // Si admin → affiche tous les joueurs
        // Si joueur → affiche seulement sa carte
        const playersToShow = isAdmin ? d.players : d.players.filter(p=>p.name===me);

        playersToShow.forEach((player,pIdx)=>{
            const currentAvatar = player.avatar||'🏳️';
            const currentFlagObj = ALL_AVATAR_FLAGS.find(f=>f.e===currentAvatar);
            const currentFlagName = currentFlagObj?.n||currentAvatar;
            const cardId = `acard_${player.name.replace(/\s/g,'_')}`;
            const previewId = `aprev_${player.name.replace(/\s/g,'_')}`;
            const badgeId  = `abadge_${player.name.replace(/\s/g,'_')}`;
            const gridId   = `agrid_${player.name.replace(/\s/g,'_')}`;
            const searchId = `asearch_${player.name.replace(/\s/g,'_')}`;
            const catsId   = `acats_${player.name.replace(/\s/g,'_')}`;
            const previewNameId=`aprevname_${player.name.replace(/\s/g,'_')}`;
            const previewSpanId=`aprevspan_${player.name.replace(/\s/g,'_')}`;

            html+=`<div class="avatar-player-card" id="${cardId}" style="animation-delay:${pIdx*.06}s">
                <div class="avatar-card-top">
                    <div class="avatar-preview-big" id="${previewId}">${currentAvatar}</div>
                    <div class="avatar-player-info">
                        <div class="avatar-player-name">${player.name}</div>
                        <div class="avatar-current-info">
                            <span class="avatar-current-flag" id="${previewNameId}">${currentAvatar}</span>
                            <span id="${previewSpanId}">${currentFlagName}</span>
                        </div>
                    </div>
                    <span class="avatar-saved-badge" id="${badgeId}">✅ Sauvegardé !</span>
                </div>
                <div class="avatar-search">
                    <span class="avatar-search-icon">🔍</span>
                    <input type="text" id="${searchId}" placeholder="Rechercher un drapeau…"
                        oninput="app.filterAvatarGrid('${player.name}')">
                </div>
                <div class="avatar-cats" id="${catsId}">`;

            Object.keys(FLAG_CATEGORIES).forEach((cat,ci)=>{
                html+=`<span class="acat${ci===0?' active':''}"
                    onclick="app.setAvatarCat(this,'${player.name}','${cat}')">${cat}</span>`;
            });

            html+=`</div>
                <div class="avatar-flag-grid" id="${gridId}">`;

            // Grille initiale (toutes les catégories)
            ALL_AVATAR_FLAGS.forEach(f=>{
                const isSel=f.e===currentAvatar;
                html+=`<div class="fg-opt${isSel?' selected':''}"
                    data-emoji="${f.e}" data-name="${f.n}"
                    onclick="app.selectAvatar('${player.name}','${f.e}','${f.n}')">
                    <span class="fg-emoji">${f.e}</span>
                    <span class="fg-name">${f.n}</span>
                </div>`;
            });

            html+=`</div>
                <div class="avatar-card-footer">
                    <div class="avatar-selected-preview">
                        <span class="asprv-emoji" id="asprv_${player.name.replace(/\s/g,'_')}">${currentAvatar}</span>
                        <span id="asprvn_${player.name.replace(/\s/g,'_')}">${currentFlagName}</span>
                    </div>
                    <button onclick="app.saveAvatar('${player.name}')" class="btn-save-avatar">
                        ✨ Sauvegarder
                    </button>
                </div>
            </div>`;
        });

        document.getElementById('avatarContent').innerHTML=html;
        // Stocker les sélections temporaires
        this._avatarSelections = {};
        d.players.forEach(p=>{ this._avatarSelections[p.name]=p.avatar||'🏳️'; });
    }

    // Sélection avatar
    _avatarSelections = {};

    selectAvatar(playerName, emoji, flagName){
        this._avatarSelections[playerName] = emoji;
        const gridId = `agrid_${playerName.replace(/\s/g,'_')}`;
        const grid = document.getElementById(gridId);
        if(grid){
            grid.querySelectorAll('.fg-opt').forEach(el=>el.classList.remove('selected'));
            const opt=grid.querySelector(`[data-emoji="${emoji}"]`);
            if(opt)opt.classList.add('selected');
        }
        // Mettre à jour la preview
        const prev=document.getElementById(`aprev_${playerName.replace(/\s/g,'_')}`);
        if(prev){prev.textContent=emoji;prev.classList.add('selected-anim');setTimeout(()=>prev.classList.remove('selected-anim'),500);}
        const prevName=document.getElementById(`aprevname_${playerName.replace(/\s/g,'_')}`);
        if(prevName)prevName.textContent=emoji;
        const prevSpan=document.getElementById(`aprevspan_${playerName.replace(/\s/g,'_')}`);
        if(prevSpan)prevSpan.textContent=flagName;
        const sprvEmoji=document.getElementById(`asprv_${playerName.replace(/\s/g,'_')}`);
        if(sprvEmoji)sprvEmoji.textContent=emoji;
        const sprvName=document.getElementById(`asprvn_${playerName.replace(/\s/g,'_')}`);
        if(sprvName)sprvName.textContent=flagName;
    }

    saveAvatar(playerName){
        const emoji = this._avatarSelections[playerName];
        if(!emoji){toast('⚠️ Sélectionnez un drapeau !','warn');return;}
        const d = this.d();
        const player = d.players.find(p=>p.name===playerName);
        if(!player){toast('❌ Joueur introuvable','warn');return;}
        player.avatar = emoji;
        saveData(d);
        // Badge saved
        const badge=document.getElementById(`abadge_${playerName.replace(/\s/g,'_')}`);
        if(badge){badge.classList.add('show');setTimeout(()=>badge.classList.remove('show'),2500);}
        // Mettre à jour si c'est le joueur connecté
        if(playerName===currentUser.name){
            currentUser.avatar=emoji;
            const badge2=document.getElementById('userBadge');
            if(badge2&&!currentUser.isAdmin){
                badge2.innerHTML=`<span class="badge-player"><span class="badge-avatar-flag">${emoji}</span>${currentUser.name}</span>`;
            }
        }
        toast(`✅ Avatar ${emoji} sauvegardé pour ${playerName} !`,'success');
        initLogin();
    }

    filterAvatarGrid(playerName){
        const searchId=`asearch_${playerName.replace(/\s/g,'_')}`;
        const gridId  =`agrid_${playerName.replace(/\s/g,'_')}`;
        const input   =document.getElementById(searchId);
        const grid    =document.getElementById(gridId);
        if(!input||!grid)return;
        const q=input.value.toLowerCase();
        grid.querySelectorAll('.fg-opt').forEach(el=>{
            const name=(el.dataset.name||'').toLowerCase();
            const emoji=el.dataset.emoji||'';
            const hide=q.length>0&&!name.includes(q)&&!emoji.includes(q);
            el.classList.toggle('hidden',hide);
        });
    }

    setAvatarCat(btn, playerName, cat){
        // Mettre à jour le bouton actif
        const catsId=`acats_${playerName.replace(/\s/g,'_')}`;
        const catsEl=document.getElementById(catsId);
        if(catsEl)catsEl.querySelectorAll('.acat').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        // Filtrer la grille
        const gridId=`agrid_${playerName.replace(/\s/g,'_')}`;
        const grid=document.getElementById(gridId);
        if(!grid)return;
        const list=FLAG_CATEGORIES[cat]||ALL_AVATAR_FLAGS;
        const emojisInCat=new Set(list.map(f=>f.e));
        grid.querySelectorAll('.fg-opt').forEach(el=>{
            const inCat=cat==='Tous'||emojisInCat.has(el.dataset.emoji);
            el.classList.toggle('hidden',!inCat);
        });
    }

    // ════════════════════════════════════════════════════
    // SETUP ADMIN
    // ════════════════════════════════════════════════════
    renderSetup(){
        const d=this.d();
        const ai=document.getElementById('newAdminCode');if(ai)ai.value=d.adminCode||'admin2026';
        const aii=document.getElementById('newAdminId');if(aii)aii.value=d.adminId||'admin';

        // Populate champion select in admin
        const champSel=document.getElementById('adminChampionSelect');
        if(champSel){
            champSel.innerHTML='<option value="">— Choisir le champion —</option>'+
                CDM_FLAGS.map(f=>`<option value="${f.n}"${d.championResult===f.n?' selected':''}>${f.e} ${f.n}</option>`).join('');
        }

        // Joueurs
        document.getElementById('playersSetup').innerHTML=d.players.map((p,i)=>`
            <div class="player-setup-card">
                <div class="player-setup-num" style="font-size:16px">${p.avatar||'🏳️'}</div>
                <div class="player-setup-fields">
                    <div class="form-group"><label>Nom</label><input type="text" value="${this.escHtml(p.name)}" class="setup-input" onchange="app.updatePlayer(${i},'name',this.value)"></div>
                    <div class="form-group"><label>Code secret</label><input type="text" value="${this.escHtml(p.code)}" class="setup-input" onchange="app.updatePlayer(${i},'code',this.value)"></div>
                </div>
                <button onclick="app.promptDeletePlayer(${i},'${this.escHtml(p.name)}')" class="btn-delete-player">🗑️</button>
            </div>`).join('')+
            `<div class="player-add-zone" onclick="app.addPlayer()"><span class="add-player-plus">＋</span><span>Ajouter un joueur</span></div>`;

        // Grille avatars admin rapide
        const afgGrid=document.getElementById('adminFlagsGrid');
        if(afgGrid){
            afgGrid.innerHTML=d.players.map((player,pIdx)=>{
                const av=player.avatar||'🏳️';
                return `<div class="admin-flag-card">
                    <div class="afc-top">
                        <div class="afc-avatar">${av}</div>
                        <div class="afc-name">${player.name}</div>
                    </div>
                    <div class="afc-grid" id="afcg_${pIdx}">
                        ${ALL_AVATAR_FLAGS.slice(0,60).map(f=>`
                        <div class="afc-opt${f.e===av?' selected':''}" data-emoji="${f.e}"
                            onclick="app.adminQuickFlag(${pIdx},'${f.e}',this)">
                            <span class="afc-emoji">${f.e}</span>
                        </div>`).join('')}
                    </div>
                    <button onclick="app.adminSaveFlag(${pIdx})" class="afc-save-btn">✨ Sauvegarder le drapeau</button>
                </div>`;
            }).join('');
        }
    }

    // Flags admin rapide
    _adminFlagSelections={};
    adminQuickFlag(pIdx,emoji,el){
        this._adminFlagSelections[pIdx]=emoji;
        const grid=document.getElementById(`afcg_${pIdx}`);
        if(grid)grid.querySelectorAll('.afc-opt').forEach(o=>o.classList.remove('selected'));
        el.classList.add('selected');
        // Mettre à jour l'avatar dans la carte
        const card=el.closest('.admin-flag-card');
        if(card){const av=card.querySelector('.afc-avatar');if(av)av.textContent=emoji;}
    }
    adminSaveFlag(pIdx){
        const emoji=this._adminFlagSelections[pIdx];
        if(!emoji){toast('⚠️ Sélectionnez un drapeau !','warn');return;}
        const d=this.d();
        if(!d.players[pIdx])return;
        d.players[pIdx].avatar=emoji;
        saveData(d);
        // Mettre à jour le badge dans setup
        const numEl=document.querySelectorAll('.player-setup-num')[pIdx];
        if(numEl)numEl.textContent=emoji;
        toast(`✅ Avatar ${emoji} de ${d.players[pIdx].name} !`,'success');
        initLogin();
    }

    escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    updatePlayer(i,f,v){const d=this.d();d.players[i][f]=v;saveData(d);}

    addPlayer(){
        if(!currentUser.isAdmin)return;
        const d=this.d(),num=d.players.length+1;
        d.players.push({name:`Joueur ${num}`,code:`${num}${num}${num}${num}`,avatar:CDM_EMOJIS[num%CDM_EMOJIS.length]});
        saveData(d);this.renderSetup();initLogin();toast('✅ Joueur ajouté !','success');
    }

    promptDeletePlayer(index,name){
        if(!currentUser.isAdmin)return;
        playerToDelete=index;
        document.getElementById('deleteModalMsg').textContent=`Supprimer « ${name} » ? Tous ses pronostics seront supprimés.`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }
    closeDeleteModal(){playerToDelete=null;document.getElementById('deleteModal').classList.add('hidden');}
    confirmDeletePlayer(){
        if(playerToDelete===null||!currentUser.isAdmin){this.closeDeleteModal();return;}
        const d=this.d(),player=d.players[playerToDelete];
        if(!player){this.closeDeleteModal();return;}
        const name=player.name;
        d.players.splice(playerToDelete,1);delete d.bets[name];delete d.playoffBets[name];
        saveData(d);this.closeDeleteModal();this.renderSetup();initLogin();toast(`🗑️ ${name} supprimé !`,'info');
    }

    savePlayersSetup(){
        const d=this.d();
        const names=d.players.map(p=>p.name.trim()).filter(Boolean);
        if(new Set(names).size!==names.length){alert('⚠️ Deux joueurs ont le même nom !');return;}
        if(d.players.some(p=>!p.name.trim())){alert('⚠️ Tous les joueurs doivent avoir un nom !');return;}
        if(d.players.some(p=>!p.code.trim())){alert('⚠️ Tous les joueurs doivent avoir un code !');return;}
        this.save(d);initLogin();toast('✅ Joueurs sauvegardés !','success');
    }

    saveAdminCode(){
        if(!currentUser.isAdmin)return;
        const newId=document.getElementById('newAdminId').value.trim();
        const newCode=document.getElementById('newAdminCode').value.trim();
        if(!newId){alert("⚠️ L'identifiant ne peut pas être vide !");return;}
        if(!newCode){alert('⚠️ Le mot de passe ne peut pas être vide !');return;}
        if(newCode.length<4){alert('⚠️ Mot de passe trop court !');return;}
        if(!confirm(`Changer ?\nIdentifiant → « ${newId} »\nMot de passe → « ${newCode} »`))return;
        const d=this.d();d.adminId=newId;d.adminCode=newCode;this.save(d);
        toast('✅ Identifiants mis à jour !','success');
    }

    exportData(){
        if(!currentUser.isAdmin)return;
        const blob=new Blob([JSON.stringify(this.d(),null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download=`cdm2026_${new Date().toISOString().split('T')[0]}.json`;a.click();
    }

    importData(event){
        if(!currentUser.isAdmin)return;
        const file=event.target.files[0];if(!file)return;
        const reader=new FileReader();
        reader.onload=e=>{try{const loaded=JSON.parse(e.target.result);_cache=loaded;_fileSha=null;saveData(loaded);alert('✅ Données importées !');location.reload();}catch{alert('❌ Fichier invalide !');}};
        reader.readAsText(file);
    }

    // ════════════════════════════════════════════════════
    // DONNÉES
    // ════════════════════════════════════════════════════
    // ════════════════════════════════════════════════════
    // ONGLET CHAMPION DU MONDE
    // ════════════════════════════════════════════════════
    renderChampionTab(){
        const d=this.d();
        const isAdmin=currentUser.isAdmin;
        const me=currentUser.name;
        const champRes=d.championResult||null;
        const myBet=d.championBets?.[me]||null;
        const myLocked=d.championBets?.[me+'_locked']||false;

        let html=`<div class="champion-hero">
            <div class="champion-hero-bg"></div>
            <div class="champion-trophy-anim">🏆</div>
            <div class="champion-hero-text">
                <h2>Champion du Monde 2026</h2>
                <p>Pariez sur le pays vainqueur — <strong class="pts-gold">10 points</strong> si vous avez raison !</p>
            </div>
        </div>`;

        if(champRes){
            html+=`<div class="champion-result-banner">
                <span class="champion-result-icon">${flag(champRes)}</span>
                <div>
                    <div class="champion-result-label">🏆 Champion officiel</div>
                    <div class="champion-result-country">${champRes}</div>
                </div>
            </div>`;
        }

        // Zone de paris joueurs
        html+=`<div class="champion-bets-grid">`;
        d.players.forEach(player=>{
            const bet=d.championBets?.[player.name]||null;
            const locked=d.championBets?.[player.name+'_locked']||false;
            const isMe=player.name===me&&!isAdmin;
            const canEdit=isAdmin?true:(isMe&&!locked&&!champRes);
            let pts='';
            if(bet&&champRes){
                pts=bet===champRes?`<span class="pts-badge pts10">+10 pts 🎉</span>`:`<span class="pts-badge pts0">0 pt</span>`;
            }
            html+=`<div class="champion-bet-card ${isMe?'champ-card-me':''} ${bet&&champRes&&bet===champRes?'champ-card-win':''}">
                <div class="champ-card-player">
                    <span class="champ-player-avatar">${player.avatar||'🏳️'}</span>
                    <span class="champ-player-name">${player.name}${isMe?'<span class="tag-me" style="margin-left:5px">Vous</span>':''}</span>
                    ${locked&&!champRes?'<span class="lock-icon" style="margin-left:auto">🔒</span>':''}
                </div>
                <div class="champ-card-bet">`;
            if(canEdit){
                // Build select
                html+=`<div class="champ-select-wrap">
                    <div class="select-wrap" style="flex:1">
                        <select id="champSel_${player.name.replace(/\s/g,'_')}" class="champ-select" onchange="app.saveChampionBetDirect('${player.name}',this.value)">
                            <option value="">— Choisir un pays —</option>
                            ${CDM_FLAGS.map(f=>`<option value="${f.n}"${bet===f.n?' selected':''}>${f.e} ${f.n}</option>`).join('')}
                        </select>
                        <span class="sel-arrow">▾</span>
                    </div>
                </div>`;
                if(!isAdmin&&isMe&&bet){
                    html+=`<button onclick="app.lockChampionBet('${player.name}')" class="btn-validate" style="margin-top:10px;width:100%">✅ Valider mon choix</button>`;
                }
                if(isAdmin&&bet){
                    html+=`<div style="display:flex;gap:6px;margin-top:8px">
                        <button onclick="app.adminClearChampionBet('${player.name}')" class="btn-icon-red" style="font-size:11px;padding:4px 9px">🗑️</button>
                    </div>`;
                }
            }else{
                html+=bet?`<div class="champ-readonly-bet">${flag(bet)} ${bet}</div>`:`<div class="no-bet">Pas de pronostic</div>`;
                if(isAdmin&&locked&&!champRes){
                    html+=`<button onclick="app.adminUnlockChampionBet('${player.name}')" class="btn-icon" style="font-size:11px;padding:4px 9px;margin-top:6px">🔓</button>`;
                }
            }
            html+=`</div>`;
            if(pts)html+=`<div class="champ-card-pts">${pts}</div>`;
            html+=`</div>`;
        });
        html+=`</div>`;

        document.getElementById('championContent').innerHTML=html;
    }

    saveChampionBetDirect(playerName,country){
        if(!currentUser.isAdmin&&playerName!==currentUser.name)return;
        const d=this.d();
        if(!d.championBets)d.championBets={};
        if(country){d.championBets[playerName]=country;}
        else{delete d.championBets[playerName];}
        saveData(d);
        // No re-render needed, the select is already updated
    }

    lockChampionBet(playerName){
        const d=this.d();
        if(!d.championBets||!d.championBets[playerName]){toast('⚠️ Choisissez un pays !','warn');return;}
        if(!d.championBets)d.championBets={};
        d.championBets[playerName+'_locked']=true;
        saveData(d);toast('🔒 Pari champion verrouillé !','lock');
        this.renderChampionTab();
    }

    adminUnlockChampionBet(playerName){
        if(!currentUser.isAdmin)return;
        const d=this.d();
        if(d.championBets)delete d.championBets[playerName+'_locked'];
        saveData(d);toast(`🔓 ${playerName} déverrouillé !`,'info');
        this.renderChampionTab();
    }

    adminClearChampionBet(playerName){
        if(!currentUser.isAdmin)return;
        const d=this.d();
        if(d.championBets){delete d.championBets[playerName];delete d.championBets[playerName+'_locked'];}
        saveData(d);toast(`🗑️ Pari de ${playerName} effacé`,'info');
        this.renderChampionTab();
    }

    saveChampionResult(){
        if(!currentUser.isAdmin)return;
        const val=document.getElementById('adminChampionSelect')?.value;
        if(!val){toast('⚠️ Choisissez un pays !','warn');return;}
        const d=this.d();d.championResult=val;this.save(d);
        this.renderChampionTab();this.renderRanking();
        toast(`🏆 Champion : ${flag(val)} ${val} !`,'success');
    }

    clearChampionResult(){
        if(!currentUser.isAdmin)return;
        if(!confirm('Effacer le résultat champion ?'))return;
        const d=this.d();d.championResult=null;this.save(d);
        this.renderChampionTab();this.renderRanking();
        toast('🗑️ Résultat champion effacé','info');
    }

    buildMatches(){
        // ══════════════════════════════════════════════════════════════
        // Heures et dates en heure FRANÇAISE (CEST = UTC+2).
        // Source : worldcupwiki.com + ESPN (ET+6h = heure FR).
        // stadium:'FR' = pas de conversion dans toFrenchTime().
        // venue = localisation affichée (info seule, sans impact horaire).
        // ══════════════════════════════════════════════════════════════
        this.matches=[
            // ── GROUPE A ──
            {id:1, group:'A',team1:'Mexique',       team2:'Afrique du Sud', date:'11 juin',time:'21h00',stadium:'FR',venue:'Estadio Azteca, Mexico City'},
            {id:2, group:'A',team1:'Corée du Sud',  team2:'Tchéquie',       date:'12 juin',time:'04h00',stadium:'FR',venue:'Estadio Akron, Zapopan'},
            {id:3, group:'A',team1:'Tchéquie',      team2:'Afrique du Sud', date:'18 juin',time:'18h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'},
            {id:4, group:'A',team1:'Mexique',       team2:'Corée du Sud',   date:'19 juin',time:'03h00',stadium:'FR',venue:'Estadio Akron, Zapopan'},
            {id:5, group:'A',team1:'Tchéquie',      team2:'Mexique',        date:'25 juin',time:'03h00',stadium:'FR',venue:'Estadio Azteca, Mexico City'},
            {id:6, group:'A',team1:'Afrique du Sud',team2:'Corée du Sud',   date:'25 juin',time:'03h00',stadium:'FR',venue:'Estadio BBVA, Monterrey'},

            // ── GROUPE B ──
            {id:7, group:'B',team1:'Canada',            team2:'Bosnie-Herzégovine',date:'12 juin',time:'21h00',stadium:'FR',venue:'BMO Field, Toronto'},
            {id:8, group:'B',team1:'Qatar',             team2:'Suisse',            date:'13 juin',time:'21h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"},
            {id:9, group:'B',team1:'Suisse',            team2:'Bosnie-Herzégovine',date:'18 juin',time:'21h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'},
            {id:10,group:'B',team1:'Canada',            team2:'Qatar',             date:'19 juin',time:'00h00',stadium:'FR',venue:'BC Place, Vancouver'},
            {id:11,group:'B',team1:'Suisse',            team2:'Canada',            date:'24 juin',time:'21h00',stadium:'FR',venue:'BC Place, Vancouver'},
            {id:12,group:'B',team1:'Bosnie-Herzégovine',team2:'Qatar',             date:'24 juin',time:'21h00',stadium:'FR',venue:'Lumen Field, Seattle'},

            // ── GROUPE C ──
            {id:13,group:'C',team1:'Brésil', team2:'Maroc', date:'14 juin',time:'00h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'},
            {id:14,group:'C',team1:'Haïti',  team2:'Écosse',date:'14 juin',time:'03h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'},
            {id:15,group:'C',team1:'Écosse', team2:'Maroc', date:'20 juin',time:'00h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'},
            {id:16,group:'C',team1:'Brésil', team2:'Haïti', date:'20 juin',time:'02h30',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'},
            {id:17,group:'C',team1:'Écosse', team2:'Brésil',date:'25 juin',time:'00h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'},
            {id:18,group:'C',team1:'Maroc',  team2:'Haïti', date:'25 juin',time:'00h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'},

            // ── GROUPE D ──
            {id:19,group:'D',team1:'États-Unis',team2:'Paraguay',  date:'13 juin',time:'03h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'},
            {id:20,group:'D',team1:'Australie', team2:'Turquie',   date:'14 juin',time:'06h00',stadium:'FR',venue:'BC Place, Vancouver'},
            {id:21,group:'D',team1:'États-Unis',team2:'Australie', date:'19 juin',time:'21h00',stadium:'FR',venue:'Lumen Field, Seattle'},
            {id:22,group:'D',team1:'Turquie',   team2:'Paraguay',  date:'20 juin',time:'05h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"},
            {id:23,group:'D',team1:'Turquie',   team2:'États-Unis',date:'26 juin',time:'04h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'},
            {id:24,group:'D',team1:'Paraguay',  team2:'Australie', date:'26 juin',time:'04h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"},

            // ── GROUPE E ──
            {id:25,group:'E',team1:'Allemagne',     team2:'Curaçao',      date:'14 juin',time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'},
            {id:26,group:'E',team1:"Côte d'Ivoire", team2:'Équateur',     date:'15 juin',time:'01h00',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'},
            {id:27,group:'E',team1:'Allemagne',     team2:"Côte d'Ivoire",date:'20 juin',time:'22h00',stadium:'FR',venue:'BMO Field, Toronto'},
            {id:28,group:'E',team1:'Équateur',      team2:'Curaçao',      date:'21 juin',time:'02h00',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'},
            {id:29,group:'E',team1:'Équateur',      team2:'Allemagne',    date:'25 juin',time:'22h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'},
            {id:30,group:'E',team1:'Curaçao',       team2:"Côte d'Ivoire",date:'25 juin',time:'22h00',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'},

            // ── GROUPE F ──
            {id:31,group:'F',team1:'Pays-Bas',team2:'Japon',  date:'14 juin',time:'22h00',stadium:'FR',venue:'AT&T Stadium, Arlington'},
            {id:32,group:'F',team1:'Suède',   team2:'Tunisie',date:'15 juin',time:'04h00',stadium:'FR',venue:'Estadio BBVA, Monterrey'},
            {id:33,group:'F',team1:'Pays-Bas',team2:'Suède',  date:'20 juin',time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'},
            {id:34,group:'F',team1:'Tunisie', team2:'Japon',  date:'21 juin',time:'06h00',stadium:'FR',venue:'Estadio BBVA, Monterrey'},
            {id:35,group:'F',team1:'Tunisie', team2:'Pays-Bas',date:'26 juin',time:'01h00',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'},
            {id:36,group:'F',team1:'Japon',   team2:'Suède',  date:'26 juin',time:'01h00',stadium:'FR',venue:'AT&T Stadium, Arlington'},

            // ── GROUPE G ──
            {id:37,group:'G',team1:'Belgique',         team2:'Égypte',          date:'15 juin',time:'21h00',stadium:'FR',venue:'Lumen Field, Seattle'},
            {id:38,group:'G',team1:'Iran',              team2:'Nouvelle-Zélande',date:'16 juin',time:'03h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'},
            {id:39,group:'G',team1:'Belgique',          team2:'Iran',            date:'21 juin',time:'21h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'},
            {id:40,group:'G',team1:'Nouvelle-Zélande',  team2:'Égypte',          date:'22 juin',time:'03h00',stadium:'FR',venue:'BC Place, Vancouver'},
            {id:41,group:'G',team1:'Nouvelle-Zélande',  team2:'Belgique',        date:'27 juin',time:'05h00',stadium:'FR',venue:'BC Place, Vancouver'},
            {id:42,group:'G',team1:'Égypte',            team2:'Iran',            date:'27 juin',time:'05h00',stadium:'FR',venue:'Lumen Field, Seattle'},

            // ── GROUPE H ──
            {id:43,group:'H',team1:'Espagne',        team2:'Cap-Vert',        date:'15 juin',time:'18h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'},
            {id:44,group:'H',team1:'Arabie Saoudite',team2:'Uruguay',         date:'16 juin',time:'00h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'},
            {id:45,group:'H',team1:'Espagne',        team2:'Arabie Saoudite', date:'21 juin',time:'18h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'},
            {id:46,group:'H',team1:'Uruguay',        team2:'Cap-Vert',        date:'22 juin',time:'00h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'},
            {id:47,group:'H',team1:'Uruguay',        team2:'Espagne',         date:'28 juin',time:'02h00',stadium:'FR',venue:'Estadio Akron, Zapopan'},
            {id:48,group:'H',team1:'Cap-Vert',       team2:'Arabie Saoudite', date:'28 juin',time:'02h00',stadium:'FR',venue:'NRG Stadium, Houston'},

            // ── GROUPE I ──
            {id:49,group:'I',team1:'France',  team2:'Sénégal', date:'16 juin',time:'21h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'},
            {id:50,group:'I',team1:'Irak',    team2:'Norvège', date:'17 juin',time:'00h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'},
            {id:51,group:'I',team1:'France',  team2:'Irak',    date:'22 juin',time:'23h00',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'},
            {id:52,group:'I',team1:'Norvège', team2:'Sénégal', date:'23 juin',time:'02h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'},
            {id:53,group:'I',team1:'Norvège', team2:'France',  date:'26 juin',time:'21h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'},
            {id:54,group:'I',team1:'Sénégal', team2:'Irak',    date:'26 juin',time:'21h00',stadium:'FR',venue:'BMO Field, Toronto'},

            // ── GROUPE J ──
            {id:55,group:'J',team1:'Argentine',team2:'Algérie',  date:'16 juin',time:'21h00',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'},
            {id:56,group:'J',team1:'Autriche', team2:'Jordanie', date:'17 juin',time:'21h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"},
            {id:57,group:'J',team1:'Argentine',team2:'Autriche', date:'22 juin',time:'19h00',stadium:'FR',venue:'AT&T Stadium, Arlington'},
            {id:58,group:'J',team1:'Jordanie', team2:'Algérie',  date:'23 juin',time:'05h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"},
            {id:59,group:'J',team1:'Algérie',  team2:'Autriche', date:'28 juin',time:'04h00',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'},
            {id:60,group:'J',team1:'Jordanie', team2:'Argentine',date:'28 juin',time:'04h00',stadium:'FR',venue:'AT&T Stadium, Arlington'},

            // ── GROUPE K ──
            {id:61,group:'K',team1:'Portugal',   team2:'RD Congo',    date:'17 juin',time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'},
            {id:62,group:'K',team1:'Ouzbékistan',team2:'Colombie',    date:'17 juin',time:'22h00',stadium:'FR',venue:'Estadio Azteca, Mexico City'},
            {id:63,group:'K',team1:'Portugal',   team2:'Ouzbékistan', date:'23 juin',time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'},
            {id:64,group:'K',team1:'Colombie',   team2:'RD Congo',    date:'24 juin',time:'04h00',stadium:'FR',venue:'Estadio Akron, Zapopan'},
            {id:65,group:'K',team1:'Colombie',   team2:'Portugal',    date:'28 juin',time:'01h30',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'},
            {id:66,group:'K',team1:'RD Congo',   team2:'Ouzbékistan', date:'28 juin',time:'01h30',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'},

            // ── GROUPE L ──
            {id:67,group:'L',team1:'Angleterre',team2:'Croatie',    date:'17 juin',time:'22h00',stadium:'FR',venue:'AT&T Stadium, Arlington'},
            {id:68,group:'L',team1:'Ghana',     team2:'Panama',     date:'18 juin',time:'01h00',stadium:'FR',venue:'BMO Field, Toronto'},
            {id:69,group:'L',team1:'Angleterre',team2:'Ghana',      date:'23 juin',time:'22h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'},
            {id:70,group:'L',team1:'Panama',    team2:'Croatie',    date:'24 juin',time:'01h00',stadium:'FR',venue:'BMO Field, Toronto'},
            {id:71,group:'L',team1:'Panama',    team2:'Angleterre', date:'27 juin',time:'23h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'},
            {id:72,group:'L',team1:'Croatie',   team2:'Ghana',      date:'27 juin',time:'23h00',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'}
        ];
    }

    buildPlayoffs(){
        // Dates et heures en heure FR (CEST = ET+6h). Source: worldcupwiki.com
        // venue = stade affiché à titre informatif uniquement.
        this.playoffs=[];

        // ── 32es de finale (Round of 32) — 28 juin au 3 juillet
        this.playoffs.push({id:'R32_1', phase:'32es de finale',match:1, team1:'À déterminer',team2:'À déterminer',date:'28 juin', time:'21h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'});
        this.playoffs.push({id:'R32_2', phase:'32es de finale',match:2, team1:'À déterminer',team2:'À déterminer',date:'29 juin', time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'});
        this.playoffs.push({id:'R32_3', phase:'32es de finale',match:3, team1:'À déterminer',team2:'À déterminer',date:'29 juin', time:'22h30',stadium:'FR',venue:'Gillette Stadium, Foxborough'});
        this.playoffs.push({id:'R32_4', phase:'32es de finale',match:4, team1:'À déterminer',team2:'À déterminer',date:'30 juin', time:'03h00',stadium:'FR',venue:'Estadio BBVA, Monterrey'});
        this.playoffs.push({id:'R32_5', phase:'32es de finale',match:5, team1:'À déterminer',team2:'À déterminer',date:'30 juin', time:'19h00',stadium:'FR',venue:'AT&T Stadium, Arlington'});
        this.playoffs.push({id:'R32_6', phase:'32es de finale',match:6, team1:'À déterminer',team2:'À déterminer',date:'30 juin', time:'23h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'});
        this.playoffs.push({id:'R32_7', phase:'32es de finale',match:7, team1:'À déterminer',team2:'À déterminer',date:'1 juil.', time:'03h00',stadium:'FR',venue:'Estadio Azteca, Mexico City'});
        this.playoffs.push({id:'R32_8', phase:'32es de finale',match:8, team1:'À déterminer',team2:'À déterminer',date:'1 juil.', time:'18h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'});
        this.playoffs.push({id:'R32_9', phase:'32es de finale',match:9, team1:'À déterminer',team2:'À déterminer',date:'1 juil.', time:'22h00',stadium:'FR',venue:'Lumen Field, Seattle'});
        this.playoffs.push({id:'R32_10',phase:'32es de finale',match:10,team1:'À déterminer',team2:'À déterminer',date:'2 juil.', time:'02h00',stadium:'FR',venue:"Levi's Stadium, Santa Clara"});
        this.playoffs.push({id:'R32_11',phase:'32es de finale',match:11,team1:'À déterminer',team2:'À déterminer',date:'2 juil.', time:'21h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'});
        this.playoffs.push({id:'R32_12',phase:'32es de finale',match:12,team1:'À déterminer',team2:'À déterminer',date:'3 juil.', time:'01h00',stadium:'FR',venue:'BMO Field, Toronto'});
        this.playoffs.push({id:'R32_13',phase:'32es de finale',match:13,team1:'À déterminer',team2:'À déterminer',date:'3 juil.', time:'05h00',stadium:'FR',venue:'BC Place, Vancouver'});
        this.playoffs.push({id:'R32_14',phase:'32es de finale',match:14,team1:'À déterminer',team2:'À déterminer',date:'3 juil.', time:'20h00',stadium:'FR',venue:'AT&T Stadium, Arlington'});
        this.playoffs.push({id:'R32_15',phase:'32es de finale',match:15,team1:'À déterminer',team2:'À déterminer',date:'4 juil.', time:'00h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'});
        this.playoffs.push({id:'R32_16',phase:'32es de finale',match:16,team1:'À déterminer',team2:'À déterminer',date:'4 juil.', time:'03h30',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'});

        // ── 16es de finale (Round of 16) — 4 au 7 juillet
        this.playoffs.push({id:'R16_1',phase:'16es de finale',match:1,team1:'À déterminer',team2:'À déterminer',date:'4 juil.', time:'19h00',stadium:'FR',venue:'NRG Stadium, Houston'});
        this.playoffs.push({id:'R16_2',phase:'16es de finale',match:2,team1:'À déterminer',team2:'À déterminer',date:'4 juil.', time:'23h00',stadium:'FR',venue:'Lincoln Financial Field, Philadelphia'});
        this.playoffs.push({id:'R16_3',phase:'16es de finale',match:3,team1:'À déterminer',team2:'À déterminer',date:'5 juil.', time:'22h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'});
        this.playoffs.push({id:'R16_4',phase:'16es de finale',match:4,team1:'À déterminer',team2:'À déterminer',date:'6 juil.', time:'02h00',stadium:'FR',venue:'Estadio Azteca, Mexico City'});
        this.playoffs.push({id:'R16_5',phase:'16es de finale',match:5,team1:'À déterminer',team2:'À déterminer',date:'6 juil.', time:'21h00',stadium:'FR',venue:'AT&T Stadium, Arlington'});
        this.playoffs.push({id:'R16_6',phase:'16es de finale',match:6,team1:'À déterminer',team2:'À déterminer',date:'7 juil.', time:'02h00',stadium:'FR',venue:'Lumen Field, Seattle'});
        this.playoffs.push({id:'R16_7',phase:'16es de finale',match:7,team1:'À déterminer',team2:'À déterminer',date:'7 juil.', time:'18h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'});
        this.playoffs.push({id:'R16_8',phase:'16es de finale',match:8,team1:'À déterminer',team2:'À déterminer',date:'7 juil.', time:'22h00',stadium:'FR',venue:'BC Place, Vancouver'});

        // ── Quarts de finale — 9 au 11 juillet
        this.playoffs.push({id:'QF_1',phase:'Quarts de finale',match:1,team1:'À déterminer',team2:'À déterminer',date:'9 juil.',  time:'22h00',stadium:'FR',venue:'Gillette Stadium, Foxborough'});
        this.playoffs.push({id:'QF_2',phase:'Quarts de finale',match:2,team1:'À déterminer',team2:'À déterminer',date:'10 juil.',time:'21h00',stadium:'FR',venue:'SoFi Stadium, Inglewood'});
        this.playoffs.push({id:'QF_3',phase:'Quarts de finale',match:3,team1:'À déterminer',team2:'À déterminer',date:'11 juil.',time:'23h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'});
        this.playoffs.push({id:'QF_4',phase:'Quarts de finale',match:4,team1:'À déterminer',team2:'À déterminer',date:'12 juil.',time:'03h00',stadium:'FR',venue:'Arrowhead Stadium, Kansas City'});

        // ── Demi-finales — 14 et 15 juillet
        this.playoffs.push({id:'SF_1',phase:'Demi-finales',match:1,team1:'À déterminer',team2:'À déterminer',date:'14 juil.',time:'21h00',stadium:'FR',venue:'AT&T Stadium, Arlington'});
        this.playoffs.push({id:'SF_2',phase:'Demi-finales',match:2,team1:'À déterminer',team2:'À déterminer',date:'15 juil.',time:'21h00',stadium:'FR',venue:'Mercedes-Benz Stadium, Atlanta'});

        // ── Match 3e place — 18 juillet
        this.playoffs.push({id:'THIRD',phase:'Match 3e place',match:1,team1:'À déterminer',team2:'À déterminer',date:'18 juil.',time:'23h00',stadium:'FR',venue:'Hard Rock Stadium, Miami Gardens'});

        // ── Finale — 19 juillet
        this.playoffs.push({id:'FINAL',phase:'FINALE',match:1,team1:'À déterminer',team2:'À déterminer',date:'19 juil.',time:'21h00',stadium:'FR',venue:'MetLife Stadium, East Rutherford'});
    }
}

// ════════════════════════════════════════════════════════════
// DÉMARRAGE
// ════════════════════════════════════════════════════════════
const app = new App();
window.app = app;

// Init animations login
initFloatingFlags();
buildTicker('loginTicker');
buildLoginFlagsStrip();

(async()=>{
    const d = await loadDataAsync();
    _cache  = d;
    localStorage.setItem('cdm2026', JSON.stringify(d));
    initLogin();
})();