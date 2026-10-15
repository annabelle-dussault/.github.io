// Animations de saison
// Hiver : flocons. Printemps : pétales. Été : lucioles. Automne : feuilles d'érable.
// Sur l'accueil, une petite vague de particules passe toutes les 20 secondes.
// Partout, un clic fait s'envoler quelques particules.
// Pour tester une autre saison : ajouter ?saison=hiver (ou printemps, ete, automne) à l'adresse.
(function () {
	// ===== Réglages faciles à modifier =====
	var REGLAGES = {
		intervalle: 20,      // secondes entre deux vagues sur l'accueil
		parVague: 10,        // nombre de particules par vague
		parClic: 4,          // nombre de particules à chaque clic
		premiereVague: 1.5   // secondes avant la première vague
	};

	var bouton = document.querySelector('.bouton-saison');
	var reduire = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduire) {
		if (bouton) bouton.hidden = true;
		return;
	}

	// ===== Quelle saison sommes-nous ? (dates des saisons au Québec) =====
	function saisonDuJour(d) {
		var m = d.getMonth() + 1, j = d.getDate(), n = m * 100 + j;
		if (n >= 1221 || n < 320) return 'hiver';
		if (n < 621) return 'printemps';
		if (n < 922) return 'ete';
		return 'automne';
	}
	var forcee = (location.search.match(/[?&]saison=(hiver|printemps|ete|automne)/) || [])[1];
	var saison = forcee || saisonDuJour(new Date());

	// ===== Bouton pour activer ou couper les animations =====
	var anglais = document.documentElement.lang === 'en';
	var icones = { hiver: 'fa-snowflake', printemps: 'fa-seedling', ete: 'fa-cloud-sun', automne: 'fa-leaf' };
	var actif = true;
	try { actif = localStorage.getItem('animations') !== 'off'; } catch (e) {}

	function majBouton() {
		if (!bouton) return;
		var texte = actif
			? (anglais ? 'Turn off seasonal animations' : 'Couper les animations de saison')
			: (anglais ? 'Turn on seasonal animations' : 'Activer les animations de saison');
		bouton.title = texte;
		bouton.setAttribute('aria-label', texte);
		bouton.setAttribute('aria-pressed', actif ? 'true' : 'false');
		bouton.classList.toggle('eteint', !actif);
	}
	if (bouton) {
		bouton.querySelector('.icon').classList.add(icones[saison]);
		bouton.addEventListener('click', function () {
			actif = !actif;
			try { localStorage.setItem('animations', actif ? 'on' : 'off'); } catch (e) {}
			if (!actif) particules.length = 0;
			majBouton();
		});
		majBouton();
	}

	// ===== Zone de dessin transparente posée sur la page =====
	var toile = document.createElement('canvas');
	toile.className = 'toile-saison';
	toile.setAttribute('aria-hidden', 'true');
	document.body.appendChild(toile);
	var ctx = toile.getContext('2d');
	var L = 0, H = 0, dpr = 1;
	function redimensionner() {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		L = window.innerWidth; H = window.innerHeight;
		toile.width = L * dpr; toile.height = H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	window.addEventListener('resize', redimensionner);
	redimensionner();

	function nuit() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
	function hasard(a, b) { return a + Math.random() * (b - a); }
	function auChoix(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

	// ===== Formes =====
	// Feuille d'érable (demi-feuille de droite, l'autre moitié est le reflet)
	var demiErable = [[0,-1],[0.14,-0.7],[0.32,-0.78],[0.26,-0.38],[0.62,-0.62],[0.56,-0.4],[0.86,-0.3],[0.72,-0.16],[0.8,-0.04],[0.4,0.06],[0.46,0.22],[0.1,0.18],[0.04,0.24],[0.04,0.62]];
	var erable = new Path2D();
	demiErable.forEach(function (p, i) { if (i === 0) erable.moveTo(p[0], p[1]); else erable.lineTo(p[0], p[1]); });
	demiErable.slice().reverse().forEach(function (p) { erable.lineTo(-p[0], p[1]); });
	erable.closePath();

	var petale = new Path2D();
	petale.moveTo(0, -1);
	petale.bezierCurveTo(0.75, -0.6, 0.6, 0.6, 0, 1);
	petale.bezierCurveTo(-0.6, 0.6, -0.75, -0.6, 0, -1);

	function dessinerFlocon(p) {
		ctx.strokeStyle = nuit() ? 'rgba(225,236,248,' + p.alpha + ')' : 'rgba(120,155,200,' + p.alpha + ')';
		ctx.lineWidth = Math.max(1, p.taille / 9);
		ctx.lineCap = 'round';
		for (var i = 0; i < 6; i++) {
			ctx.save();
			ctx.rotate(i * Math.PI / 3);
			ctx.beginPath();
			ctx.moveTo(0, 0); ctx.lineTo(0, -p.taille);
			ctx.moveTo(0, -p.taille * 0.55); ctx.lineTo(p.taille * 0.25, -p.taille * 0.78);
			ctx.moveTo(0, -p.taille * 0.55); ctx.lineTo(-p.taille * 0.25, -p.taille * 0.78);
			ctx.stroke();
			ctx.restore();
		}
	}
	function dessinerForme(p, chemin) {
		ctx.scale(p.taille * p.retournement, p.taille);
		ctx.fillStyle = p.couleur;
		ctx.globalAlpha = p.alpha;
		ctx.fill(chemin);
	}
	function dessinerLuciole(p) {
		var lueur = p.alpha * (0.55 + 0.45 * Math.sin(p.age * 3 + p.phase));
		var r = p.taille * 4;
		var g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
		var c = nuit() ? '255,214,102' : '226,160,30';
		g.addColorStop(0, 'rgba(' + c + ',' + lueur + ')');
		g.addColorStop(0.25, 'rgba(' + c + ',' + (lueur * 0.5) + ')');
		g.addColorStop(1, 'rgba(' + c + ',0)');
		ctx.fillStyle = g;
		ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
	}

	var couleurs = {
		printemps: ['#f4b6c8', '#f7c9d6', '#eea3b8', '#fbe0e8'],
		automne: ['#c0392b', '#d35400', '#e07a2e', '#d9a23a', '#a5402d']
	};

	// ===== Création d'une particule =====
	function creer(x, y, depuisClic) {
		var p = {
			x: x, y: y, age: 0, alpha: 0,
			duree: depuisClic ? hasard(1.1, 1.6) : hasard(9, 13),
			rotation: hasard(0, Math.PI * 2),
			vrot: hasard(-1.2, 1.2),
			phase: hasard(0, Math.PI * 2),
			retournement: 1,
			clic: depuisClic
		};
		if (saison === 'hiver') {
			p.taille = depuisClic ? hasard(4, 7) : hasard(5, 10);
			p.vx = hasard(-12, 12); p.vy = hasard(28, 55); p.vrot = hasard(-0.5, 0.5);
		} else if (saison === 'printemps') {
			p.taille = depuisClic ? hasard(4, 6) : hasard(5, 8);
			p.vx = hasard(15, 45); p.vy = hasard(35, 60);
			p.couleur = auChoix(couleurs.printemps);
		} else if (saison === 'automne') {
			p.taille = depuisClic ? hasard(7, 10) : hasard(9, 15);
			p.vx = hasard(40, 90); p.vy = hasard(40, 70);
			p.couleur = auChoix(couleurs.automne);
		} else {
			p.taille = depuisClic ? hasard(2, 3) : hasard(2, 3.5);
			p.vx = hasard(-12, 12); p.vy = hasard(-12, 6);
			p.duree = depuisClic ? hasard(1.4, 2) : hasard(7, 10);
		}
		if (depuisClic) {
			var angle = hasard(-Math.PI * 0.9, -Math.PI * 0.1), force = hasard(70, 140);
			p.vx = Math.cos(angle) * force; p.vy = Math.sin(angle) * force;
		}
		return p;
	}

	var particules = [];
	var enCours = false, dernier = 0;

	function boucle(t) {
		var dt = Math.min((t - dernier) / 1000, 0.05);
		dernier = t;
		ctx.clearRect(0, 0, L, H);
		for (var i = particules.length - 1; i >= 0; i--) {
			var p = particules[i];
			p.age += dt;
			// Apparition et disparition en douceur
			var debut = Math.min(p.age / (p.clic ? 0.08 : 0.8), 1);
			var fin = Math.min(Math.max((p.duree - p.age) / (p.clic ? 0.5 : 1.2), 0), 1);
			p.alpha = Math.min(debut, fin) * (saison === 'hiver' ? 0.9 : 0.85);
			// Mouvement
			if (p.clic) {
				p.vy += (saison === 'ete' ? 10 : 160) * dt;
				p.vx *= 0.98;
			} else if (saison === 'ete') {
				p.vx += Math.sin(p.age * 0.9 + p.phase) * 8 * dt;
				p.vy += Math.cos(p.age * 0.7 + p.phase) * 8 * dt;
			} else {
				p.vx += Math.sin(p.age * 1.3 + p.phase) * (saison === 'hiver' ? 6 : 20) * dt;
			}
			p.x += p.vx * dt; p.y += p.vy * dt;
			p.rotation += p.vrot * dt;
			p.retournement = (saison === 'printemps' || saison === 'automne') ? Math.cos(p.age * 2.2 + p.phase) : 1;

			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rotation);
			if (saison === 'hiver') dessinerFlocon(p);
			else if (saison === 'printemps') dessinerForme(p, petale);
			else if (saison === 'automne') dessinerForme(p, erable);
			else dessinerLuciole(p);
			ctx.restore();

			if (p.age >= p.duree || p.y > H + 40 || p.x > L + 60) particules.splice(i, 1);
		}
		if (particules.length && !document.hidden) {
			requestAnimationFrame(boucle);
		} else {
			enCours = false;
			ctx.clearRect(0, 0, L, H);
		}
	}
	function lancer() {
		if (enCours) return;
		enCours = true;
		dernier = performance.now();
		requestAnimationFrame(boucle);
	}

	// ===== Vague de particules (accueil seulement) =====
	function vague() {
		if (!actif || document.hidden) return;
		for (var i = 0; i < REGLAGES.parVague; i++) {
			(function (delai) {
				setTimeout(function () {
					if (!actif) return;
					var x, y;
					if (saison === 'ete') { x = hasard(L * 0.05, L * 0.95); y = hasard(H * 0.35, H * 0.95); }
					else if (saison === 'automne' || saison === 'printemps') { x = hasard(-L * 0.3, L * 0.8); y = hasard(-60, -20); }
					else { x = hasard(0, L); y = hasard(-40, -10); }
					particules.push(creer(x, y, false));
					lancer();
				}, delai);
			})(hasard(0, 3000));
		}
	}
	if (document.body.classList.contains('page-accueil')) {
		setTimeout(vague, REGLAGES.premiereVague * 1000);
		setInterval(vague, REGLAGES.intervalle * 1000);
	}

	// ===== Effet au clic (toutes les pages) =====
	document.addEventListener('click', function (e) {
		if (!actif || e.target.closest('a, button, iframe, input, textarea, select')) return;
		for (var i = 0; i < REGLAGES.parClic; i++) particules.push(creer(e.clientX, e.clientY, true));
		lancer();
	});

	document.addEventListener('visibilitychange', function () {
		if (!document.hidden && particules.length) lancer();
	});
})();
