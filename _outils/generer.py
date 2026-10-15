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
                 "engagements": "Engagements", "recos": "Recommandations"},
        "description": "Annabelle Dussault, étudiante à la maîtrise en science politique à l'Université Laval.",
        "pied": "Étudiante à la maîtrise en science politique, Université Laval",
        "droits": "Tous droits réservés.",
        "autre_langue": ("en", "EN", "Read in English"),
        "theme": ("Passer en mode nuit", "Passer en mode jour"),
        "menu_bouton": "Menu",
        "evitement": "Aller au contenu",
    },
    "en": {
        "menu": {"accueil": "Home", "apropos": "About", "cv": "CV",
                 "engagements": "Involvement", "recos": "Recommendations"},
        "description": "Annabelle Dussault, master's student in political science at Université Laval.",
        "pied": "Master's student in political science, Université Laval",
        "droits": "All rights reserved.",
        "autre_langue": ("fr", "FR", "Lire en français"),
        "theme": ("Switch to dark mode", "Switch to light mode"),
        "menu_bouton": "Menu",
        "evitement": "Skip to content",
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

    actif = ' class="active" aria-current="page"'
    menu = "\n".join(
        "\t\t\t\t\t" + f'<li><a href="{lien(pid, langue, langue)}"'
        f'{actif if pid == page_id else ""}>{t["menu"][pid]}</a></li>'
        for pid, _, _ in PAGES)

    return f"""<!DOCTYPE html>
<!-- Page générée par _outils/generer.py : modifier le contenu dans _outils/contenu/ -->
<html lang="{langue}">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>{titre}</title>
	<meta name="description" content="{t["description"]}" />
	<link rel="alternate" hreflang="{autre}" href="{lien(page_id, langue, autre)}" />
	<link rel="icon" type="image/svg+xml" href="{p}images/favicon.svg" />
	<link rel="preload" href="{p}assets/fonts/newsreader-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin />
	<link rel="stylesheet" href="{p}assets/css/fontawesome-all.min.css" />
	<link rel="stylesheet" href="{p}assets/css/perso.css" />
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
<body class="page-{page_id}">
	<a class="lien-evitement" href="#contenu">{t["evitement"]}</a>

	<!-- En-tête et menu -->
	<header class="entete">
		<div class="page">
			<a class="nom" href="{lien("accueil", langue, langue)}">Annabelle Dussault</a>
			<nav class="menu" id="menu" aria-label="Menu">
				<ul>
{menu}
				</ul>
			</nav>
			<div class="outils">
				<button type="button" class="bouton-saison" aria-pressed="true"><span class="icon solid"></span></button>
				<button type="button" class="bouton-theme" data-nuit="{t["theme"][0]}" data-jour="{t["theme"][1]}" title="{t["theme"][0]}" aria-label="{t["theme"][0]}"><span class="icon solid fa-moon"></span><span class="icon solid fa-sun"></span></button>
				<a href="https://www.linkedin.com/in/annabelle-dussault-625a05303/" class="icon brands fa-linkedin-in" title="LinkedIn"><span class="label">LinkedIn</span></a>
				<a href="{lien(page_id, langue, autre)}" class="langue" hreflang="{autre}" title="{autre_long}"><span class="langue-actuelle">{langue.upper()}</span> / {autre_court}</a>
				<button type="button" class="bouton-menu" aria-controls="menu" aria-expanded="false"><span class="icon solid fa-bars"></span> {t["menu_bouton"]}</button>
			</div>
		</div>
	</header>

	<main id="contenu">
		<div class="page">
{corps}
		</div>
	</main>

	<!-- Pied de page -->
	<footer class="pied">
		<div class="page">
			<div>
				<p class="nom">Annabelle Dussault</p>
				<p>{t["pied"]}</p>
			</div>
			<ul>
				<li><a href="mailto:anna5.dussault@gmail.com">anna5.dussault@gmail.com</a></li>
				<li><a href="https://www.linkedin.com/in/annabelle-dussault-625a05303/">LinkedIn</a></li>
			</ul>
			<p class="droits">&copy; 2026 Annabelle Dussault. {t["droits"]}</p>
		</div>
	</footer>

	<script src="{p}assets/js/theme.js"></script>
	<script src="{p}assets/js/menu.js"></script>
	<script src="{p}assets/js/saisons.js"></script>
</body>
</html>
"""


for langue in ("fr", "en"):
    dossier = RACINE if langue == "fr" else RACINE / "en"
    dossier.mkdir(exist_ok=True)
    for pid, _, _ in PAGES:
        (dossier / fichier(pid, langue)).write_text(construire(pid, langue), encoding="utf-8")
print("Pages générées.")
