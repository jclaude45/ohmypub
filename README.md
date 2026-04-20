# OohMyPub — Site officiel

Site vitrine moderne et responsive pour **Ooh my pub!**, agence
publicitaire 360° basée à Kinshasa (RDC).

> Atteignons. Engageons. Impactons.

## Stack

- HTML5 sémantique
- CSS3 vanilla (variables, grid, flexbox, animations, halftone en CSS)
- JavaScript vanilla (IntersectionObserver, tabs, mobile menu, validation formulaire)
- Polices : Bebas Neue, Montserrat, Inter (Google Fonts)
- Aucune dépendance, aucune étape de build

## Structure

```
/
├── index.html          # Page unique, toutes les sections
├── css/
│   └── style.css       # Design system + sections + responsive
├── js/
│   └── script.js       # Interactions (nav, tabs, reveal, form)
├── assets/
│   └── favicon.svg
└── README.md
```

## Sections

1. Header sticky + navigation
2. Hero (fond rouge + halftone + poster + marquee)
3. Qui sommes-nous (3 piliers)
4. Vision (section noire, halftone rouge)
5. Services (6 cartes en onglets)
6. Réalisations (portfolio en grille asymétrique)
7. Pourquoi nous choisir
8. Contact (infos + formulaire validé)
9. Footer complet

## Fonctionnalités

- 100% responsive (mobile-first)
- Animations reveal au scroll
- Onglets services accessibles (ARIA)
- Formulaire de contact avec validation
- Menu mobile avec burger
- Bouton retour en haut
- Respect `prefers-reduced-motion`
- Métadonnées SEO + Open Graph

## Lancement local

Ouvrir simplement `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Contact

- Téléphone : +243 813 065 034
- Email : Janclyeale@oohmypub.com
- Instagram : [@ooh_mypub](https://instagram.com/ooh_mypub)
- Kinshasa, RDC
