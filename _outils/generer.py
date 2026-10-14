# Génère les pages du site (FR à la racine, EN dans /en/).
# Usage : python3 _outils/generer.py   (depuis la racine du dépôt)
# Le contenu de chaque page se trouve dans _outils/contenu/<langue>/<page>.html
import pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
CONTENU = RACINE / "_outils" / "contenu"

# (identifiant, fichier FR, fichier EN)
PAGES = [
    ("accueil", "index.html", "index.html"),
    ("apropos", "a-propos.html", "about.html"),
    ("cv", "cv.html", "cv.html"),
    ("engagements", "engagements.html", "involvement.html"),
    ("recos", "recommandations.html", "recommendations.html"),
]

TEXTES = {
    "fr": {
        "menu": {"accueil": "Accueil", "apropos": "À propos", "cv": "CV",
                 "engagements": "Engagements et expériences",
                 "recos": "Recommandations"},
        "contact_titre": "Me contacter",
        "contact_texte": "N'hésitez pas à m'écrire pour toute question !",
        "droits": "Tous droits réservés.",
        "autre_langue": ("en", "EN", "Read in English"),
        "theme": ("Passer en mode nuit", "Passer en mode jour"),
    },
    "en": {
        "menu": {"accueil": "Home", "apropos": "About", "cv": "CV",
                 "engagements": "Involvement and experience",
                 "recos": "Recommendations"},
        "contact_titre": "Contact me",
        "contact_texte": "Feel free to write to me with any questions!",
        "droits": "All rights reserved.",
        "autre_langue": ("fr", "FR", "Lire en français"),
        "theme": ("Switch to dark mode", "Switch to light mode"),
    },
}


def fichier(page_id, langue):
    for pid, fr, en in PAGES:
        if pid == page_id:
            return fr if langue == "fr" else en


def lien(page_id, de, vers):
    """Chemin relatif d'une page de langue `de` vers une page de langue `vers`."""
    nom = fichier(page_id, vers)
    if de == vers:
        return nom
    return ("en/" + nom) if vers == "en" else ("../" + nom)


def construire(page_id, langue):
    t = TEXTES[langue]
    p = "" if langue == "fr" else "../"
    corps = (CONTENU / langue / f"{page_id}.html").read_text(encoding="utf-8")
    titre_page = corps.split("\n", 1)[0].replace("<!-- titre:", "").replace("-->", "").strip()
    corps = corps.split("\n", 1)[1].replace("{p}", p)
    titre = "Annabelle Dussault" if page_id == "accueil" else f"{titre_page} | Annabelle Dussault"
    autre, autre_court, autre_long = t["autre_langue"]

    actif = ' class="active"'
    menu = "\n".join(
        "\t" * 10 + f'<li><a href="{lien(pid, langue, langue)}"'
        f'{actif if pid == page_id else ""}>{t["menu"][pid]}</a></li>'
        for pid, _, _ in PAGES)

    return f"""<!DOCTYPE HTML>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
	Page générée par _outils/generer.py : modifier le contenu dans _outils/contenu/
-->
<html lang="{langue}">
	<head>
		<title>{titre}</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link rel="alternate" hreflang="{autre}" href="{lien(page_id, langue, autre)}" />
		<link rel="stylesheet" href="{p}assets/css/main.css" />
		<link rel="stylesheet" href="{p}assets/css/perso.css" />
	   	<link rel="icon" type="image/svg+xml" href="{p}images/favicon.svg" />
		<script>
			// Applique le mode jour ou nuit avant l'affichage (évite un flash blanc)
			(function () {{
				var t = null;
				try {{ t = localStorage.getItem('theme'); }} catch (e) {{}}
				if (!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
				document.documentElement.setAttribute('data-theme', t);
			}})();
		</script>
	</head>
	<body class="is-preload">

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<div id="main">
						<div class="inner">

							<!-- Header -->
								<header id="header">
									<a href="{lien("accueil", langue, langue)}" class="logo"><strong>Annabelle Dussault</strong></a>
									<ul class="icons">
										<li><button type="button" class="bouton-theme" data-nuit="{t["theme"][0]}" data-jour="{t["theme"][1]}" title="{t["theme"][0]}" aria-label="{t["theme"][0]}"><span class="icon solid fa-moon"></span><span class="icon solid fa-sun"></span></button></li>
										<li><a href="https://www.linkedin.com/in/annabelle-dussault-625a05303/" class="icon brands fa-linkedin-in"><span class="label">LinkedIn</span></a></li>
										<li><a href="{lien(page_id, langue, autre)}" class="langue" hreflang="{autre}" title="{autre_long}"><span class="langue-actuelle">{langue.upper()}</span> / {autre_court}</a></li>
									</ul>
								</header>

{corps}
						</div>
					</div>

				<!-- Sidebar -->
					<div id="sidebar">
						<div class="inner">

							<!-- Menu -->
								<nav id="menu">
									<header class="major">
										<h2>Menu</h2>
									</header>
									<ul>
{menu}
									</ul>
								</nav>

							<!-- Section -->
								<section>
									<header class="major">
										<h2>{t["contact_titre"]}</h2>
									</header>
									<p>{t["contact_texte"]}</p>
									<ul class="contact">
										<li class="icon solid fa-envelope"><a href="mailto:anna5.dussault@gmail.com">anna5.dussault@gmail.com</a></li>
									</ul>
								</section>

							<!-- Footer -->
								<footer id="footer">
									<p class="copyright">&copy; Annabelle Dussault. {t["droits"]} Design: <a href="https://html5up.net">HTML5 UP</a>.</p>
								</footer>

						</div>
					</div>

			</div>

		<!-- Scripts -->
			<script src="{p}assets/js/jquery.min.js"></script>
			<script src="{p}assets/js/browser.min.js"></script>
			<script src="{p}assets/js/breakpoints.min.js"></script>
			<script src="{p}assets/js/util.js"></script>
			<script src="{p}assets/js/main.js"></script>
			<script src="{p}assets/js/theme.js"></script>

	</body>
</html>
"""


for langue in ("fr", "en"):
    dossier = RACINE if langue == "fr" else RACINE / "en"
    dossier.mkdir(exist_ok=True)
    for pid, _, _ in PAGES:
        (dossier / fichier(pid, langue)).write_text(construire(pid, langue), encoding="utf-8")
print("Pages générées.")
