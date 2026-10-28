export const config = {
  name: "Raoul.CJ",
  author: "Raoul",
  email: "junix.sie.web@gmail.com",
  phone: "+33744877359",
  phoneLabel: "+33 7 44 87 73 59",
  formEndpoint: "https://formspree.io/f/xppqyyrp",
  portrait: "/cj.webp",
  cv: "/cv-raoul.pdf",
  // Renseignez le domaine exact, puis indexable: true quand le site est prêt.
  siteUrl: "",
  indexable: false,
  shopUrl: "",
  legal: {
    identity: "",
    status: "",
    address: "",
    registration: "",
    vat: "",
    director: "",
    host: "",
    hostAddress: "",
    hostPhone: "",
    retention: "",
    transfers: "",
    logs: "",
  },
};
export const services = [
  {
    title: "Sites web sur mesure",
    icon: "web",
    category: "CRÉATION",
    description:
      "Une présence en ligne qui vous ressemble. Claire, rapide et agréable à utiliser.",
    points: [
      "Design adapté à votre identité",
      "Responsive mobile & ordinateur",
      "Accompagnement à la mise en ligne",
    ],
    price: "399 €",
  },
  {
    title: "Dépannage & évolutions",
    icon: "code",
    category: "SITE EXISTANT",
    description:
      "Un problème technique ou une idée à intégrer ? Faisons avancer votre site existant.",
    points: [
      "Diagnostic avant intervention",
      "React, JavaScript, WordPress, Laravel",
      "Corrections et améliorations ciblées",
    ],
    price: "49 €",
  },
  {
    title: "Design graphique",
    icon: "design",
    category: "IDENTITÉ & COMMUNICATION",
    description:
      "Des créations soignées pour donner une direction claire à votre communication.",
    points: [
      "Pack de 3 visuels personnalisés",
      "Formats adaptés à vos supports",
      "Une série de retouches",
    ],
    price: "59 €",
  },
];
// Le produit « featured » est mis à la une : il doit parler au même public que les services.
export const products = [
  {
    title: "Visuels entrepreneurs",
    type: "KIT MARKETING",
    description:
      "Des modèles de communication à personnaliser pour votre activité.",
    price: "29 €",
    image: "/pack-visuels.png",
    url: "",
    featured: true,
  },
  {
    title: "Créer son premier site web",
    type: "EBOOK",
    description:
      "Un guide progressif pour passer de l’idée à votre premier site.",
    price: "14,90 €",
    image: "/ebook-web.png",
    url: "",
  },
  {
    title: "Kit CV & candidature",
    type: "PACK CARRIÈRE",
    description:
      "Des modèles et un guide pour préparer une candidature cohérente.",
    price: "9,90 €",
    image: "/kit-cv.png",
    url: "",
  },
];
export const projects = [
  {
    id: "alba",
    name: "Maison Alba",
    type: "BEAUTÉ & BIEN-ÊTRE",
    text: "Une identité douce et une expérience pensée autour des soins.",
    tags: ["Design éditorial", "Site vitrine"],
  },
  {
    id: "sola",
    name: "Sola Restaurant",
    type: "RESTAURATION",
    text: "Une table de saison, des contrastes affirmés et une carte facile à explorer.",
    tags: ["Direction artistique", "Expérience interactive"],
  },
];
export const journey = [
  {
    label: "ALGÉRIE · 3 ANS",
    title: "Développement web & mobile",
    text: "Un parcours de trois ans à l’INSFP de Ouled Fayet, consacré au développement web et mobile.",
  },
  {
    label: "FRANCE · EN COURS",
    title: "Cycle ingénieur — ESIEA",
    text: "Je poursuis mon parcours à l’ESIEA avec une orientation Software Engineering — ingénierie logicielle.",
  },
  {
    label: "MON PROJET",
    title: "Raoul.CJ, développeur freelance",
    text: "Réunir développement web, design graphique et ressources numériques dans une approche claire et attentive.",
  },
];
