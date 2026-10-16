// Bouton soleil / lune : bascule entre le mode jour et le mode nuit.
// Le choix est mémorisé dans le navigateur du visiteur.
(function () {
	var bouton = document.querySelector('.bouton-theme');
	if (!bouton) return;

	function mettreAJourEtiquette() {
		var nuit = document.documentElement.getAttribute('data-theme') === 'dark';
		var etiquette = nuit ? bouton.getAttribute('data-jour') : bouton.getAttribute('data-nuit');
		bouton.setAttribute('title', etiquette);
		bouton.setAttribute('aria-label', etiquette);
	}

	bouton.addEventListener('click', function () {
		var nuit = document.documentElement.getAttribute('data-theme') === 'dark';
		var nouveau = nuit ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', nouveau);
		try { sessionStorage.setItem('theme', nouveau); } catch (e) {}
		mettreAJourEtiquette();
   	});

   	mettreAJourEtiquette();
   })();
// Bouton « retour en haut »
(function () {
	var anglais = document.documentElement.lang === 'en';
	var texte = anglais ? 'Back to top' : 'Retour en haut';

	var bouton = document.createElement('button');
	bouton.type = 'button';
	bouton.className = 'retour-haut';
	bouton.title = texte;
	bouton.setAttribute('aria-label', texte);
	bouton.innerHTML = '<span class="icon solid fa-arrow-up"></span>';
	document.body.appendChild(bouton);

	window.addEventListener('scroll', function () {
		bouton.classList.toggle('visible', window.scrollY > 500);
	});

	bouton.addEventListener('click', function () {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
})();
