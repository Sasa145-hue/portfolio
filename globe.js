'use strict';
/* ══════════════════════════════════════════════════════════════
   GLOBE 3D GEPHI-STYLE — factory deux instances
   PRO : violet #8B5CF6  ·  PASSION : ambre #F59E0B
══════════════════════════════════════════════════════════════ */
(function () {
  if (typeof THREE === 'undefined') return;

  /* ═══════════════════════════════════════════════════════════
     DONNÉES
  ═══════════════════════════════════════════════════════════ */
  var DATA_PRO = {
    color:    0x8B5CF6,
    colorHex: '#8B5CF6',
    nodes: [
      { label: 'Marketing Digital', phi: 42, theta: 0,
        subs: [
          { name: 'Meta Ads',          level: 80, desc: 'Création et gestion de campagnes publicitaires sur Facebook & Instagram.',          url: 'https://business.facebook.com' },
          { name: 'SEO',               level: 75, desc: 'Optimisation pour les moteurs de recherche, audit technique et netlinking.',        url: 'https://search.google.com/search-console' },
          { name: 'Email Marketing',   level: 65, desc: "Conception de newsletters et séquences d'automation marketing.",                   url: '#' },
          { name: 'Community Mgmt',    level: 78, desc: 'Animation de communautés et gestion des réseaux sociaux.',                         url: '#' },
          { name: 'Strat. digitale',   level: 82, desc: 'Élaboration de plans de communication digitale 360°.',                             url: '#' },
        ]
      },
      { label: 'Data & IA', phi: 52, theta: 72,
        subs: [
          { name: 'Google Analytics',  level: 85, desc: 'Analyse du trafic web, suivi de conversions GA4 et création de rapports.',         url: 'https://analytics.google.com' },
          { name: 'Power BI',          level: 70, desc: 'Création de dashboards interactifs et visualisations de données.',                  url: 'https://powerbi.microsoft.com' },
          { name: 'Excel',             level: 88, desc: 'Tableaux croisés dynamiques, formules avancées, macros VBA.',                      url: 'https://www.microsoft.com/fr-fr/microsoft-365/excel' },
          { name: 'Analyse données',   level: 75, desc: 'Interprétation de KPIs et recommandations orientées data.',                        url: '#' },
          { name: 'IA Marketing',      level: 62, desc: "Outils IA pour la génération de contenu et l'automatisation.",                     url: '#' },
        ]
      },
      { label: 'CRM', phi: 38, theta: 144,
        subs: [
          { name: 'Relation client',      level: 90, desc: 'Gestion de la relation client et programmes de fidélisation.',              url: '#' },
          { name: 'Vente multicanal',     level: 82, desc: 'Techniques de vente en magasin, téléphone et canaux digitaux.',             url: '#' },
          { name: 'Prospection',          level: 78, desc: 'Identification et qualification de nouveaux prospects B2B/B2C.',            url: '#' },
          { name: 'Digital. commerciale', level: 72, desc: 'Transformation digitale des processus commerciaux.',                       url: '#' },
        ]
      },
      { label: 'Web & Design', phi: 130, theta: 216,
        subs: [
          { name: 'WordPress',    level: 75, desc: 'Création et administration de sites WordPress vitrines et e-commerce.',             url: 'https://wordpress.com' },
          { name: 'Figma',        level: 70, desc: 'Maquettage, prototypage et systèmes de design.',                                    url: 'https://figma.com' },
          { name: 'Web Design',   level: 68, desc: 'Conception de mises en page web modernes et responsives.',                          url: '#' },
          { name: 'UX / UI',      level: 65, desc: "Expérience utilisateur centrée sur les besoins réels.",                            url: '#' },
          { name: 'Site vitrine', level: 72, desc: 'Développement de sites vitrines pour TPE et PME.',                                  url: '#' },
        ]
      },
      { label: 'Outils', phi: 148, theta: 288,
        subs: [
          { name: 'Microsoft 365',    level: 92, desc: 'Suite bureautique complète : Word, Excel, PowerPoint, Teams.',                  url: 'https://www.microsoft.com/microsoft-365' },
          { name: 'Google Workspace', level: 88, desc: 'Docs, Sheets, Drive, Gmail — collaboration en temps réel.',                    url: 'https://workspace.google.com' },
          { name: 'Notion',           level: 80, desc: 'Organisation, gestion de projets et bases de données personnelles.',            url: 'https://notion.so' },
          { name: 'Canva',            level: 85, desc: 'Création de visuels professionnels pour les réseaux sociaux.',                  url: 'https://canva.com' },
          { name: 'Looker Studio',    level: 72, desc: 'Rapports et tableaux de bord connectés aux sources de données.',               url: 'https://lookerstudio.google.com' },
        ]
      },
      /* index 5 — Parcours (phi 1.0 rad ≈ 57°, theta 4.2 rad ≈ 241°) */
      { label: 'Parcours', phi: 57, theta: 241,
        subs: [
          { name: 'Bachelor INSEEC', desc: 'Marketing Digital, Data & IA — Bordeaux 2024-2025',                  url: '#' },
          { name: 'BTS NDRC',        desc: 'Négociation Digitalisation Relation Client — Bordeaux 2022-2024',   url: '#' },
          { name: 'Bac Général',     desc: 'SES & LLCE — Bordeaux 2021-2022',                                   url: '#' },
          { name: 'Atelier CUB',     desc: 'Alternance NDRC — Mérignac 2022-2024',                              url: '#' },
          { name: 'Evasion Gym',     desc: 'Marketing Digital & Création Web — Eysines 2022-2025',              url: '#' },
          { name: 'Ericsson',        desc: "Stage Télécom — Côte d'Ivoire 2017",                                url: '#' },
        ]
      },
    ],
    /* [5,0] Parcours↔Marketing Digital  [5,1] Parcours↔Data&IA  [5,2] Parcours↔CRM */
    mainEdges: [[0,1],[0,2],[1,2],[0,3],[1,4],[3,4],[2,4],[5,0],[5,1],[5,2]],
  };

  var DATA_PASSION = {
    color:    0xF59E0B,
    colorHex: '#F59E0B',
    nodes: [
      { label: 'Musique', phi: 42, theta: 0,
        subs: [
          { name: 'Guitare',        level: 84, desc: 'Guitare acoustique et électrique — pratique depuis 6 ans.',                        url: '#' },
          { name: 'Piano',          level: 45, desc: "Notions de piano et bases de l'harmonie musicale.",                                url: '#' },
          { name: 'Prod. musicale', level: 62, desc: 'Production de beats et arrangements sur DAW (Ableton, FL Studio).',               url: '#' },
          { name: 'Composition',    level: 55, desc: 'Écriture de morceaux originaux, mélodies et arrangements.',                       url: '#' },
        ]
      },
      { label: 'Sport', phi: 52, theta: 72,
        subs: [
          { name: 'Basketball',    level: 90, desc: "Pratique en club depuis l'enfance, poste d'ailier shooting.",                      url: '#' },
          { name: 'Fitness',       level: 75, desc: 'Entraînement régulier : musculation et cardio-training.',                          url: '#' },
          { name: 'Natation',      level: 60, desc: 'Nageur confirmé, styles crawl et dos crawlé.',                                     url: '#' },
          { name: 'Course à pied', level: 65, desc: 'Running hebdomadaire, objectif semi-marathon.',                                    url: '#' },
        ]
      },
      { label: 'Voyages', phi: 38, theta: 144,
        subs: [
          { name: 'Afrique',          level: 85, desc: "Sénégal, Côte d'Ivoire, Maroc — exploration des racines et cultures.",          url: '#' },
          { name: 'Europe',           level: 78, desc: 'Espagne, Portugal, Italie, Belgique — escapades culturelles.',                  url: '#' },
          { name: 'Cultures locales', level: 80, desc: 'Immersion dans les cultures, langues et gastronomies locales.',                 url: '#' },
          { name: 'Photo voyage',     level: 70, desc: 'Capture de moments et paysages lors des voyages.',                              url: '#' },
        ]
      },
      { label: 'Technologie', phi: 130, theta: 216,
        subs: [
          { name: 'IA & Outils', level: 82, desc: 'Veille sur les derniers modèles IA et outils no-code du moment.',                    url: '#' },
          { name: 'Veille tech', level: 75, desc: 'Suivi des tendances technologiques via newsletters et podcasts.',                    url: '#' },
          { name: 'Jeux vidéo', level: 68, desc: 'Gaming PC et console — RPG, FPS et jeux de stratégie.',                              url: '#' },
          { name: 'Podcasts',   level: 72, desc: 'Podcasts tech, marketing et développement personnel.',                                url: '#' },
        ]
      },
      { label: 'Créativité', phi: 148, theta: 288,
        subs: [
          { name: 'Photographie',  level: 75, desc: 'Portrait et street photography au quotidien.',                                     url: '#' },
          { name: 'Design graph.', level: 70, desc: 'Création de visuels et identités visuelles (Canva, Figma).',                      url: '#' },
          { name: 'Vidéo',         level: 65, desc: 'Tournage et montage vidéo pour les réseaux sociaux.',                              url: '#' },
          { name: 'Storytelling',  level: 72, desc: 'Narration visuelle et rédaction de contenu engageant.',                            url: '#' },
        ]
      },
    ],
    mainEdges: [[0,1],[0,2],[1,2],[0,3],[1,4],[3,4],[2,4]],
  };

  /* ═══════════════════════════════════════════════════════════
     MODALE PARTAGÉE (sous-nœuds)
  ═══════════════════════════════════════════════════════════ */
  var _modal = null;

  function getModal() {
    if (_modal) return _modal;
    var el = document.createElement('div');
    el.className = 'gmodal-overlay';
    el.innerHTML =
      '<div class="gmodal-card" role="dialog" aria-modal="true">' +
        '<button class="gmodal-close" aria-label="Fermer">×</button>' +
        '<h4 class="gmodal-title"></h4>' +
        '<p class="gmodal-desc"></p>' +
        '<a class="gmodal-link" target="_blank" rel="noopener">En savoir plus →</a>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('.gmodal-close').addEventListener('click', function () {
      el.classList.remove('is-open');
    });
    el.addEventListener('click', function (e) {
      if (e.target === el) el.classList.remove('is-open');
    });
    _modal = el;
    return el;
  }

  function openSubModal(sub, accentHex) {
    var ov   = getModal();
    var link = ov.querySelector('.gmodal-link');
    ov.querySelector('.gmodal-title').textContent = sub.name;
    ov.querySelector('.gmodal-desc').textContent  = sub.desc;
    if (sub.url && sub.url !== '#') {
      link.href = sub.url;
      link.style.cssText = 'display:inline;color:' + accentHex;
    } else {
      link.style.display = 'none';
    }
    ov.classList.add('is-open');
  }

  /* ═══════════════════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════════════════ */
  function d2r(d) { return d * Math.PI / 180; }

  function sphPos(r, phi, theta) {
    var p = d2r(phi), t = d2r(theta);
    return new THREE.Vector3(
      r * Math.sin(p) * Math.cos(t),
      r * Math.cos(p),
      r * Math.sin(p) * Math.sin(t)
    );
  }

  /* ═══════════════════════════════════════════════════════════
     FACTORY
  ═══════════════════════════════════════════════════════════ */
  function initGlobe(containerId, data) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var canvas = container.querySelector('.globe-canvas');
    if (!canvas) return;

    var R       = 1.85;
    var C_MAIN  = data.color;
    var C_HEX   = data.colorHex;

    /* ── Construction des nœuds plats ── */
    var NODES   = [];
    var mainIds = [];   /* index dans NODES pour chaque nœud principal */

    data.nodes.forEach(function (main, mi) {
      var mId = NODES.length;
      mainIds.push(mId);
      NODES.push({
        id: mId, label: main.label, type: 'main',
        mainIdx: mi, phi: main.phi, theta: main.theta,
        mainData: main,
      });
      main.subs.forEach(function (sub, si) {
        var ang    = (si / main.subs.length) * 2 * Math.PI;
        var spread = 22;
        NODES.push({
          id: NODES.length, label: sub.name, type: 'sub',
          mainIdx: mi, subIdx: si,
          phi:   main.phi   + spread * Math.sin(ang),
          theta: main.theta + spread * Math.cos(ang),
          subData: sub,
        });
      });
    });

    /* ── Construction des arêtes ── */
    var EDGES = [];
    NODES.forEach(function (nd) {
      if (nd.type === 'sub') EDGES.push([mainIds[nd.mainIdx], nd.id]);
    });
    data.mainEdges.forEach(function (pair) {
      EDGES.push([mainIds[pair[0]], mainIds[pair[1]]]);
    });

    /* ── Renderer ── */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (_) { return; }

    var W = container.clientWidth  || 800;
    var H = container.clientHeight || 620;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 5.5;

    var globe = new THREE.Group();
    scene.add(globe);

    /* ── Meshes ── */
    var meshes = [];   /* indexed by nd.id */

    NODES.forEach(function (nd) {
      var pos  = sphPos(R, nd.phi, nd.theta);
      var size = nd.type === 'main' ? 0.11 : 0.052;

      /* Halo additif pour les nœuds principaux */
      if (nd.type === 'main') {
        var gGeo = new THREE.SphereGeometry(size * 2.8, 12, 12);
        var gMat = new THREE.MeshBasicMaterial({
          color: C_MAIN, transparent: true, opacity: 0.18,
          depthWrite: false, blending: THREE.AdditiveBlending,
        });
        var glow = new THREE.Mesh(gGeo, gMat);
        glow.position.copy(pos);
        glow.userData.isGlow  = true;
        glow.userData.nodeId  = nd.id;
        globe.add(glow);
      }

      var geo  = new THREE.SphereGeometry(size, 16, 16);
      var mat  = new THREE.MeshBasicMaterial({
        color:       nd.type === 'main' ? C_MAIN : 0xffffff,
        transparent: true,
        opacity:     nd.type === 'main' ? 1 : 0.62,
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData.nodeId = nd.id;
      globe.add(mesh);
      meshes[nd.id] = mesh;
    });

    /* ── Arêtes ── */
    var edgeMats = [];
    EDGES.forEach(function (pair) {
      var a = pair[0], b = pair[1];
      var ma = meshes[a], mb = meshes[b];
      if (!ma || !mb) return;
      var isMain = NODES[a].type === 'main' && NODES[b].type === 'main';
      var geo = new THREE.BufferGeometry().setFromPoints([
        ma.position.clone(), mb.position.clone(),
      ]);
      var mat = new THREE.LineBasicMaterial({
        color: C_MAIN, transparent: true,
        opacity: isMain ? 0.32 : 0.20,
      });
      globe.add(new THREE.Line(geo, mat));
      edgeMats.push({ mat: mat, a: a, b: b, isMain: isMain });
    });

    /* ── DOM ── */
    var tooltip  = container.querySelector('.globe-tooltip');
    var panel    = container.querySelector('.globe-panel');
    var pTitle   = container.querySelector('.globe-panel-title');
    var pList    = container.querySelector('.globe-panel-list');
    var pClose   = container.querySelector('.globe-panel-close');
    var inviteEl = container.querySelector('.globe-invite');
    var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var invited  = false;

    function fadeInvite() {
      if (invited || !inviteEl) return;
      invited = true;
      inviteEl.style.transition = 'opacity .5s';
      inviteEl.style.opacity = '0';
    }

    function showTip(label, cx, cy) {
      if (!tooltip) return;
      var r = container.getBoundingClientRect();
      tooltip.textContent = label;
      tooltip.style.left  = (cx - r.left + 16) + 'px';
      tooltip.style.top   = (cy - r.top  - 14) + 'px';
      tooltip.classList.add('is-visible');
    }
    function hideTip() {
      if (tooltip) tooltip.classList.remove('is-visible');
    }

    function openPanel(nd) {
      if (!panel || !pTitle || !pList) return;
      pTitle.textContent = nd.label;
      pList.innerHTML = '';
      (nd.mainData.subs || []).forEach(function (sub) {
        var li = document.createElement('li');
        li.textContent = sub.name;
        li.style.cursor = 'pointer';
        li.addEventListener('click', function () { openSubModal(sub, C_HEX); });
        pList.appendChild(li);
      });
      panel.style.animation = 'none';
      panel.hidden = false;
      void panel.offsetWidth;
      panel.style.animation = '';
    }

    if (pClose) {
      pClose.addEventListener('click', function () { panel.hidden = true; });
    }

    /* ── Highlight ── */
    function resetHL() {
      NODES.forEach(function (nd) {
        var m = meshes[nd.id]; if (!m) return;
        m.material.color.set(nd.type === 'main' ? C_MAIN : 0xffffff);
        m.material.opacity = nd.type === 'main' ? 1 : 0.62;
        m.scale.setScalar(1);
      });
      edgeMats.forEach(function (e) {
        e.mat.color.set(C_MAIN);
        e.mat.opacity = e.isMain ? 0.32 : 0.20;
      });
      globe.children.forEach(function (c) {
        if (c.userData.isGlow) c.material.opacity = 0.18;
      });
    }

    function highlightNode(id) {
      var nd  = NODES[id];
      /* Nœuds qui restent visibles (le nœud + ses connexions directes) */
      var vis = new Set([id]);
      if (nd.type === 'main') {
        /* Nœud principal : montrer uniquement ses sous-nœuds directs */
        NODES.forEach(function (n) {
          if (n.type === 'sub' && n.mainIdx === nd.mainIdx) vis.add(n.id);
        });
      } else {
        /* Sous-nœud : montrer uniquement son parent */
        vis.add(mainIds[nd.mainIdx]);
      }

      NODES.forEach(function (n) {
        var m = meshes[n.id]; if (!m) return;
        if (n.id === id) {
          m.material.color.set(C_MAIN);
          m.material.opacity = 1;
          m.scale.setScalar(1.85);
        } else if (vis.has(n.id)) {
          m.material.color.set(n.type === 'main' ? C_MAIN : 0xffffff);
          m.material.opacity = 0.85;
          m.scale.setScalar(1);
        } else {
          m.material.opacity = 0.08;
          m.scale.setScalar(1);
        }
      });
      edgeMats.forEach(function (e) {
        var lit = (e.a === id || e.b === id) && vis.has(e.a) && vis.has(e.b);
        e.mat.color.set(lit ? 0xF59E0B : C_MAIN);
        e.mat.opacity = lit ? 0.90 : 0.03;
      });
      globe.children.forEach(function (c) {
        if (c.userData.isGlow)
          c.material.opacity = c.userData.nodeId === id ? 0.48 : 0.03;
      });
    }

    /* ── Zoom — focus exclusif ── */
    function applyZoomHL(mainId) {
      var mainNd = NODES[mainId];
      NODES.forEach(function (nd) {
        var m = meshes[nd.id]; if (!m) return;
        if (nd.id === mainId) {
          m.material.color.set(C_MAIN);
          m.material.opacity = 1;
          m.scale.setScalar(2.5);
        } else if (nd.type === 'sub' && nd.mainIdx === mainNd.mainIdx) {
          m.material.color.set(0xffffff);
          m.material.opacity = 0.90;
          m.scale.setScalar(1);
        } else {
          m.material.opacity = 0;
          m.scale.setScalar(1);
        }
      });
      edgeMats.forEach(function (e) {
        var isDirect =
          (e.a === mainId && NODES[e.b].type === 'sub' && NODES[e.b].mainIdx === mainNd.mainIdx) ||
          (e.b === mainId && NODES[e.a].type === 'sub' && NODES[e.a].mainIdx === mainNd.mainIdx);
        e.mat.color.set(isDirect ? 0xF59E0B : C_MAIN);
        e.mat.opacity = isDirect ? 1.0 : 0;
      });
      globe.children.forEach(function (c) {
        if (c.userData.isGlow)
          c.material.opacity = c.userData.nodeId === mainId ? 0.50 : 0;
      });
    }

    function zoomToNode(nd) {
      var worldPos = new THREE.Vector3();
      meshes[nd.id].getWorldPosition(worldPos);
      camTarget.copy(worldPos.clone().normalize().multiplyScalar(4.0));
      zoomedMainId = nd.id;
      zoomMeshes = NODES
        .filter(function (n) { return n.id === nd.id || (n.type === 'sub' && n.mainIdx === nd.mainIdx); })
        .map(function (n) { return meshes[n.id]; })
        .filter(Boolean);
      applyZoomHL(nd.id);
      tgX = 0; tgY = 0;
      autoRot = !reduced;
      backBtn.style.display = '';
      fadeInvite();
    }

    function resetZoom() {
      camTarget.set(0, 0, BASE_Z);
      zoomedMainId = -1;
      zoomMeshes   = [];
      backBtn.style.display = 'none';
      resetHL();
      autoRot = !reduced;
    }

    backBtn.addEventListener('click', resetZoom);

    /* ── Interaction ── */
    var mouse = new THREE.Vector2(-9, -9);
    var ray   = new THREE.Raycaster();
    /* Augmenter le seuil de raycasting pour faciliter le hover */
    ray.params.Line = { threshold: 0.1 };
    var interMeshes = NODES.map(function (nd) { return meshes[nd.id]; }).filter(Boolean);

    var hovId       = -1;
    var autoRot     = !reduced;
    var rotY        = 0;
    var tX = 0, tY = 0, tgX = 0, tgY = 0;
    var lastCX = 0, lastCY = 0;

    /* ── Zoom état ── */
    var BASE_Z       = 5.5;
    var camTarget    = new THREE.Vector3(0, 0, BASE_Z);
    var zoomedMainId = -1;
    var zoomMeshes   = [];

    /* Bouton ← Retour */
    var backBtn = document.createElement('button');
    backBtn.className = 'globe-back-btn';
    backBtn.textContent = '← Retour';
    backBtn.style.display = 'none';
    container.appendChild(backBtn);

    canvas.addEventListener('mousemove', function (e) {
      lastCX = e.clientX;
      lastCY = e.clientY;
      var r = canvas.getBoundingClientRect();
      mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
      mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
      /* Tilt uniquement hors zoom */
      if (zoomedMainId < 0) {
        var cx = r.left + r.width  / 2;
        var cy = r.top  + r.height / 2;
        tgY = ((e.clientX - cx) / (r.width  / 2)) * 0.18;
        tgX = ((e.clientY - cy) / (r.height / 2)) * 0.10;
      }
    }, { passive: true });

    canvas.addEventListener('mouseleave', function () {
      mouse.set(-9, -9);
      hideTip();
      if (hovId >= 0) {
        hovId = -1;
        if (zoomedMainId >= 0) applyZoomHL(zoomedMainId);
        else { resetHL(); autoRot = !reduced; }
      }
      if (zoomedMainId < 0) { tgX = 0; tgY = 0; autoRot = !reduced; }
      canvas.style.cursor = '';
    }, { passive: true });

    canvas.addEventListener('click', function () {
      fadeInvite();
      if (hovId >= 0) {
        var nd = NODES[hovId];
        if (nd.type === 'main') {
          if (zoomedMainId === nd.id) resetZoom();
          else zoomToNode(nd);
        } else {
          openSubModal(nd.subData, C_HEX);
        }
      } else if (zoomedMainId >= 0) {
        resetZoom();
      }
    });

    /* Drag tactile pour faire pivoter */
    var tPrev = null;
    canvas.addEventListener('touchstart', function (e) {
      tPrev = e.touches[0];
    }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var t = e.touches[0];
      var r = canvas.getBoundingClientRect();
      mouse.x =  ((t.clientX - r.left) / r.width)  * 2 - 1;
      mouse.y = -((t.clientY - r.top)  / r.height) * 2 + 1;
      if (tPrev) rotY += (t.clientX - tPrev.clientX) * 0.008;
      tPrev = t;
    }, { passive: false });

    /* ── Boucle de rendu ── */
    function tick() {
      requestAnimationFrame(tick);
      if (container.clientWidth === 0) return;

      if (!reduced) {
        if (autoRot) rotY += (zoomedMainId >= 0 ? 0.00034 : 0.00068);
        tX += (tgX - tX) * 0.05;
        tY += (tgY - tY) * 0.05;
        globe.rotation.y = rotY;
        globe.rotation.x = tX;
      }

      /* Zoom caméra (lerp vers la cible) */
      camera.position.lerp(camTarget, 0.055);
      camera.lookAt(0, 0, 0);

      var castMeshes = (zoomedMainId >= 0) ? zoomMeshes : interMeshes;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(castMeshes, false);

      if (hits.length) {
        var id = hits[0].object.userData.nodeId;
        if (id !== hovId) {
          if (zoomedMainId < 0) { resetHL(); autoRot = false; }
          highlightNode(id);
          hovId = id;
        }
        canvas.style.cursor = 'pointer';
        showTip(NODES[id].label, lastCX, lastCY);
      } else {
        if (hovId >= 0) {
          hovId = -1;
          hideTip();
          canvas.style.cursor = '';
          if (zoomedMainId >= 0) applyZoomHL(zoomedMainId);
          else { resetHL(); autoRot = !reduced; }
        }
      }

      renderer.render(scene, camera);
    }

    /* ── Redimensionnement ── */
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        var nW = container.clientWidth;
        var nH = container.clientHeight;
        if (nW === 0 || nH === 0) return;
        renderer.setSize(nW, nH, false);
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
      });
      ro.observe(container);
    } else {
      window.addEventListener('resize', function () {
        var nW = container.clientWidth;
        var nH = container.clientHeight;
        if (nW === 0 || nH === 0) return;
        renderer.setSize(nW, nH, false);
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
      }, { passive: true });
    }

    requestAnimationFrame(tick);
  }

  /* ═══════════════════════════════════════════════════════════
     INITIALISATION
  ═══════════════════════════════════════════════════════════ */
  initGlobe('globe-pro',   DATA_PRO);
  initGlobe('globe-perso', DATA_PASSION);

})();
