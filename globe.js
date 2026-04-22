'use strict';
/* ══════════════════════════════════════════════════════════════
   GLOBE 3D GEPHI-STYLE — Three.js r128
══════════════════════════════════════════════════════════════ */
(function () {

  function showFallback() {
    const sec = document.getElementById('globe-section');
    if (!sec) return;
    sec.style.display = 'flex';
    sec.style.alignItems = 'center';
    sec.style.justifyContent = 'center';
    sec.innerHTML = '<p style="color:var(--text-faint);font-size:.75rem;letter-spacing:.22em;text-transform:uppercase">Globe non disponible sur ce navigateur</p>';
  }

  if (typeof THREE === 'undefined') { showFallback(); return; }

  const container = document.getElementById('globe-section');
  const canvas    = document.getElementById('globe-canvas');
  if (!canvas || !container) return;

  /* ── DONNÉES ──────────────────────────────────────────── */
  const R = 1.85;

  const NODES = [
    { id:0, label:'Marketing Digital', type:'main', phi:45,  theta:0,
      skills:[
        {name:'Meta Ads',              url:'https://business.facebook.com'},
        {name:'SEO',                   url:'https://search.google.com/search-console'},
        {name:'Email Marketing',       url:'#'},
        {name:'Community Management',  url:'#'},
        {name:'Stratégie digitale',   url:'#'},
      ]},
    { id:1, label:'Data & IA', type:'main', phi:50, theta:72,
      skills:[
        {name:'Google Analytics',  url:'https://analytics.google.com'},
        {name:'Reporting',         url:'#'},
        {name:'Excel',             url:'https://www.microsoft.com/fr-fr/microsoft-365/excel'},
        {name:'Analyse données',   url:'#'},
        {name:'Data-driven',       url:'#'},
      ]},
    { id:2, label:'CRM', type:'main', phi:38, theta:144,
      skills:[
        {name:'Relation client',             url:'#'},
        {name:'Vente multicanal',            url:'#'},
        {name:'Prospection',                 url:'#'},
        {name:'Digitalisation commerciale', url:'#'},
      ]},
    { id:3, label:'Web', type:'main', phi:132, theta:216,
      skills:[
        {name:'CMS',          url:'#'},
        {name:'Figma',        url:'https://figma.com'},
        {name:'Web Design',   url:'#'},
        {name:'Site vitrine', url:'#'},
        {name:'UX',           url:'#'},
      ]},
    { id:4, label:'Outils', type:'main', phi:140, theta:288,
      skills:[
        {name:'Microsoft 365',    url:'https://www.microsoft.com/microsoft-365'},
        {name:'Power BI',         url:'https://powerbi.microsoft.com'},
        {name:'Google Workspace', url:'https://workspace.google.com'},
        {name:'Notion',           url:'https://notion.so'},
        {name:'Canva',            url:'https://canva.com'},
      ]},
    /* Sous-nœuds Marketing Digital */
    {id:5,  label:'Meta Ads',            type:'sub', parent:0, phi:28,  theta:345},
    {id:6,  label:'SEO',                 type:'sub', parent:0, phi:34,  theta:18 },
    {id:7,  label:'Email Marketing',     type:'sub', parent:0, phi:62,  theta:8  },
    {id:8,  label:'Community Mgmt',      type:'sub', parent:0, phi:65,  theta:348},
    {id:9,  label:'Stratégie digitale', type:'sub', parent:0, phi:22,  theta:12 },
    /* Sous-nœuds Data & IA */
    {id:10, label:'Google Analytics', type:'sub', parent:1, phi:30, theta:55 },
    {id:11, label:'Reporting',        type:'sub', parent:1, phi:26, theta:88 },
    {id:12, label:'Excel',            type:'sub', parent:1, phi:68, theta:60 },
    {id:13, label:'Analyse données',  type:'sub', parent:1, phi:70, theta:88 },
    {id:14, label:'Data-driven',      type:'sub', parent:1, phi:22, theta:72 },
    /* Sous-nœuds CRM */
    {id:15, label:'Relation client',          type:'sub', parent:2, phi:20, theta:126},
    {id:16, label:'Vente multicanal',         type:'sub', parent:2, phi:30, theta:162},
    {id:17, label:'Prospection',              type:'sub', parent:2, phi:55, theta:128},
    {id:18, label:'Digital. commerciale',     type:'sub', parent:2, phi:56, theta:162},
    /* Sous-nœuds Web */
    {id:19, label:'CMS',          type:'sub', parent:3, phi:112, theta:198},
    {id:20, label:'Figma',        type:'sub', parent:3, phi:118, theta:228},
    {id:21, label:'Web Design',   type:'sub', parent:3, phi:152, theta:196},
    {id:22, label:'Site vitrine', type:'sub', parent:3, phi:158, theta:232},
    {id:23, label:'UX',           type:'sub', parent:3, phi:148, theta:250},
    /* Sous-nœuds Outils */
    {id:24, label:'Microsoft 365',    type:'sub', parent:4, phi:118, theta:272},
    {id:25, label:'Power BI',         type:'sub', parent:4, phi:122, theta:305},
    {id:26, label:'Google Workspace', type:'sub', parent:4, phi:150, theta:268},
    {id:27, label:'Notion',           type:'sub', parent:4, phi:158, theta:305},
    {id:28, label:'Canva',            type:'sub', parent:4, phi:148, theta:320},
  ];

  const EDGES = [
    ...NODES.filter(n => n.type === 'sub').map(n => [n.parent, n.id]),
    [0,1],[0,2],[1,2],[0,3],[1,4],[3,4],[2,4],
  ];

  /* ── HELPERS ──────────────────────────────────────────── */
  function d2r(d) { return d * Math.PI / 180; }
  function sphPos(r, phi, theta) {
    const p = d2r(phi), t = d2r(theta);
    return new THREE.Vector3(r*Math.sin(p)*Math.cos(t), r*Math.cos(p), r*Math.sin(p)*Math.sin(t));
  }

  /* ── RENDERER ─────────────────────────────────────────── */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  } catch(_) { showFallback(); return; }

  let W = container.clientWidth, H = container.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
  camera.position.z = 5.5;

  const globe = new THREE.Group();
  scene.add(globe);

  /* ── NODES ─────────────────────────────────────────────── */
  const meshes    = new Array(NODES.length).fill(null);
  const glows     = new Array(5).fill(null);   /* only main nodes */

  NODES.forEach(nd => {
    const pos  = sphPos(R, nd.phi, nd.theta);
    const size = nd.type === 'main' ? 0.10 : 0.048;
    const col  = nd.type === 'main' ? 0x4F8EF7 : 0xffffff;

    if (nd.type === 'main') {
      const glowGeo = new THREE.SphereGeometry(size * 2.6, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color:0x4F8EF7, transparent:true, opacity:0.14,
        depthWrite:false, blending:THREE.AdditiveBlending,
      });
      const g = new THREE.Mesh(glowGeo, glowMat);
      g.position.copy(pos);
      globe.add(g);
      glows[nd.id] = g;
    }

    const geo  = new THREE.SphereGeometry(size, 16, 16);
    const mat  = new THREE.MeshBasicMaterial({
      color:col, transparent:true,
      opacity: nd.type === 'main' ? 1 : 0.70,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.userData.nodeId = nd.id;
    globe.add(mesh);
    meshes[nd.id] = mesh;
  });

  /* ── EDGES ─────────────────────────────────────────────── */
  const edgeMats = [];
  EDGES.forEach(([a, b]) => {
    const isMain = NODES[a].type === 'main' && NODES[b].type === 'main';
    const geo = new THREE.BufferGeometry().setFromPoints([
      meshes[a].position.clone(),
      meshes[b].position.clone(),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: isMain ? 0xF0DC80 : 0x4F8EF7,
      transparent:true,
      opacity: isMain ? 0.22 : 0.18,
    });
    globe.add(new THREE.Line(geo, mat));
    edgeMats.push({mat, a, b, isMain});
  });

  /* ── DOM ───────────────────────────────────────────────── */
  const tooltip    = document.getElementById('globe-tooltip');
  const panel      = document.getElementById('globe-panel');
  const panelTitle = document.getElementById('globe-panel-title');
  const panelList  = document.getElementById('globe-panel-list');
  const panelClose = document.getElementById('globe-panel-close');
  const inviteEl   = document.querySelector('.globe-invite');
  const reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let   interacted = false;

  function fadeInvite() {
    if (interacted || !inviteEl) return;
    interacted = true;
    inviteEl.style.transition = 'opacity .5s ease';
    inviteEl.style.opacity = '0';
    setTimeout(() => { inviteEl.style.visibility = 'hidden'; }, 520);
  }

  function showTip(label, cx, cy) {
    if (!tooltip) return;
    const r = container.getBoundingClientRect();
    tooltip.textContent = label;
    tooltip.style.left = (cx - r.left + 14) + 'px';
    tooltip.style.top  = (cy - r.top  - 12) + 'px';
    tooltip.classList.add('is-visible');
  }
  function hideTip() { if (tooltip) tooltip.classList.remove('is-visible'); }

  function openPanel(nd) {
    if (!panel || !panelTitle || !panelList) return;
    panelTitle.textContent = nd.label;
    panelList.innerHTML = '';
    (nd.skills || []).forEach(s => {
      const li = document.createElement('li');
      if (s.url && s.url !== '#') {
        const a = document.createElement('a');
        a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = s.name + ' →';
        li.appendChild(a);
      } else {
        li.textContent = s.name;
      }
      panelList.appendChild(li);
    });
    /* Restart entry animation */
    panel.style.animation = 'none';
    panel.hidden = false;
    void panel.offsetWidth;
    panel.style.animation = '';
  }

  if (panelClose) panelClose.addEventListener('click', () => { panel.hidden = true; });

  /* ── HIGHLIGHT ─────────────────────────────────────────── */
  function resetHL() {
    NODES.forEach(nd => {
      const m = meshes[nd.id]; if (!m) return;
      m.material.opacity = nd.type === 'main' ? 1 : 0.70;
      m.scale.setScalar(1);
    });
    edgeMats.forEach(({mat, isMain}) => {
      mat.opacity = isMain ? 0.22 : 0.18;
      mat.color.set(isMain ? 0xF0DC80 : 0x4F8EF7);
    });
    glows.forEach(g => { if (g) g.material.opacity = 0.14; });
  }

  function highlightNode(id) {
    const conn = new Set();
    EDGES.forEach(([a,b]) => {
      if (a===id) conn.add(b);
      if (b===id) conn.add(a);
    });
    NODES.forEach(nd => {
      const m = meshes[nd.id]; if (!m) return;
      if (nd.id === id) {
        m.material.opacity = 1; m.scale.setScalar(1.7);
      } else if (conn.has(nd.id)) {
        m.material.opacity = 0.85; m.scale.setScalar(1);
      } else {
        m.material.opacity = 0.15; m.scale.setScalar(1);
      }
    });
    edgeMats.forEach(({mat, a, b}) => {
      if (a===id||b===id) { mat.opacity = 0.9; mat.color.set(0xffffff); }
      else                { mat.opacity = 0.04; }
    });
    glows.forEach((g, i) => {
      if (!g) return;
      g.material.opacity = i === id ? 0.42 : 0.04;
    });
  }

  /* ── ANIMATION ─────────────────────────────────────────── */
  let rotY=0, tX=0, tY=0, tgX=0, tgY=0;
  let autoRot = !reduced;
  let hovId = -1, lastMs = 0;
  const mouse = new THREE.Vector2(-9,-9);
  let mev = {clientX:0, clientY:0};
  const ray = new THREE.Raycaster();
  const interMeshes = NODES.map(n => meshes[n.id]).filter(Boolean);

  canvas.addEventListener('mousemove', e => {
    mev = e;
    const r = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX-r.left)/r.width)  * 2 - 1;
    mouse.y = -((e.clientY-r.top) /r.height)  * 2 + 1;
    const cx = r.left+r.width/2, cy = r.top+r.height/2;
    tgY = ((e.clientX-cx)/(r.width /2)) * 0.18;
    tgX = ((e.clientY-cy)/(r.height/2)) * 0.10;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.set(-9,-9); hideTip();
    if (hovId>=0){ resetHL(); hovId=-1; }
    tgX=0; tgY=0; autoRot=!reduced;
    canvas.style.cursor='';
  });

  canvas.addEventListener('click', () => {
    if (hovId<0) return;
    fadeInvite();
    if (NODES[hovId].type==='main') openPanel(NODES[hovId]);
  });

  /* Touch drag to rotate */
  let tPrev=null;
  canvas.addEventListener('touchstart', e=>{ tPrev=e.touches[0]; },{passive:true});
  canvas.addEventListener('touchmove', e=>{
    e.preventDefault();
    const t=e.touches[0];
    const r=canvas.getBoundingClientRect();
    mouse.x= ((t.clientX-r.left)/r.width) *2-1;
    mouse.y=-((t.clientY-r.top) /r.height)*2+1;
    if(tPrev) rotY+=(t.clientX-tPrev.clientX)*0.008;
    tPrev=t;
  },{passive:false});

  function tick(ms) {
    requestAnimationFrame(tick);
    lastMs = ms;

    if (!reduced) {
      if (autoRot) rotY += 0.00065;
      tX += (tgX-tX)*0.05;
      tY += (tgY-tY)*0.05;
      globe.rotation.y = rotY;
      globe.rotation.x = tX;
    }

    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(interMeshes, false);

    if (hits.length) {
      const id = hits[0].object.userData.nodeId;
      if (id!==hovId) {
        resetHL(); highlightNode(id);
        hovId=id; autoRot=false;
      }
      canvas.style.cursor='pointer';
      showTip(NODES[id].label, mev.clientX, mev.clientY);
    } else {
      if (hovId>=0) {
        resetHL(); hovId=-1;
        autoRot=!reduced; hideTip();
        canvas.style.cursor='';
      }
    }

    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);

  /* ── RESIZE ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    W=container.clientWidth; H=container.clientHeight;
    renderer.setSize(W,H,false);
    camera.aspect=W/H;
    camera.updateProjectionMatrix();
  },{passive:true});

})();
