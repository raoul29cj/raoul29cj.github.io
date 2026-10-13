export const site = {
  name: "Junix",
  logo: "/logojunix.png",
  initials: "Jx",
  email: "junix.sie.web@gmail.com",
  location: "France · Travail à distance",
  availability: "Ouvert aux nouveaux projets",
  headline: "Votre présence en ligne mérite mieux que le banal.",
  subtitle:
    "Sites web, corrections techniques et design graphique pour donner vie à vos idées, avec une approche claire et sur mesure.",
};

// Tarifs de départ : à adapter selon le périmètre du projet.
export const services = [
  {
    number: "01",
    icon: "grid",
    category: "WEB DESIGN & DEV",
    title: "Site vitrine",
    description:
      "Un site moderne, responsive et facile à utiliser, pensé pour présenter votre activité.",
    points: [
      "Design sur mesure",
      "Jusqu’à 4 pages",
      "Formulaire de contact",
    ],
    price: "399 €",
    suffix: "à partir de",
    accent: "yellow",
  },
  {
    number: "02",
    icon: "code",
    category: "DÉVELOPPEMENT",
    title: "Correction de bugs",
    description:
      "Un bouton cassé, un problème d’affichage ou une fonctionnalité qui bloque ? On le résout.",
    points: [
      "WordPress / JavaScript",
      "React / Laravel",
      "Devis après diagnostic",
    ],
    price: "49 €",
    suffix: "à partir de",
    accent: "peach",
  },
  {
    number: "03",
    icon: "brush",
    category: "DESIGN GRAPHIQUE",
    title: "Pack visuels",
    description:
      "Des créations cohérentes pour rendre vos publications plus visibles et professionnelles.",
    points: [
      "3 visuels personnalisés",
      "Formats réseaux sociaux",
      "1 série de retouches",
    ],
    price: "59 €",
    suffix: "à partir de",
    accent: "lavender",
  },
];

// Ces projets sont des concepts de démonstration.
export const projects = [
  {
    id: "salon",
    number: "01",
    category: "SITE VITRINE · DÉMONSTRATION",
    name: "Maison Alba",
    description:
      "Concept de site pour un salon de beauté : élégant, fluide et pensé pour la réservation.",
    tech: ["HTML / CSS", "Responsive"],
    style: "salon",
  },
  {
    id: "restaurant",
    number: "02",
    category: "LANDING PAGE · DÉMONSTRATION",
    name: "Sola Restaurant",
    description:
      "Concept de vitrine pour un restaurant : une présentation forte et des appels à l’action visibles.",
    tech: ["React", "Design UI"],
    style: "restaurant",
  },
];

// Produits en préparation : aucun paiement intégré.
export const products = [
  {
    type: "PACK CARRIÈRE",
    icon: "document",
    title: "Kit CV & candidature",
    description:
      "Modèles de CV, lettres de motivation et guide de personnalisation.",
    price: "9,90 €",
    style: "product-one",
  },
  {
    type: "EBOOK",
    icon: "book",
    title: "Créer son premier site web",
    description:
      "Un guide progressif pour découvrir la création d’un site Internet.",
    price: "14,90 €",
    style: "product-two",
  },
  {
    type: "KIT MARKETING",
    icon: "spark",
    title: "Pack visuels entrepreneurs",
    description:
      "Templates de communication prêts à adapter à votre activité.",
    price: "29 €",
    style: "product-three",
  },
];
