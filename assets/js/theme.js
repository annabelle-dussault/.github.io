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
		try { localStorage.setItem('theme', nouveau); } catch (e) {}
		mettreAJourEtiquette();
	});

	mettreAJourEtiquette();
})();
