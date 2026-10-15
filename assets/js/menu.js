// Menu sur téléphone : le bouton « Menu » ouvre et ferme la liste des pages.
(function () {
	var bouton = document.querySelector('.bouton-menu');
	var menu = document.getElementById('menu');
	if (!bouton || !menu) return;
	bouton.addEventListener('click', function () {
		var ouvert = menu.classList.toggle('ouvert');
		bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
	});
})();
