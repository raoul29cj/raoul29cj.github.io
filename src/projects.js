import { projects as existingProjects } from "./config.js";

// Les deux concepts existants et leurs informations restent dans config.js.
export const projects = [
  ...existingProjects,
  {
    id: "barber",
    name: "Atelier N°7 — Barber",
    type: "BARBER & COIFFURE",
    text: "Un univers affirmé, des prestations lisibles et un parcours de prise de rendez-vous en démonstration.",
    tags: ["Identité de marque", "Parcours rendez-vous"],
  },
  {
    id: "artisan",
    name: "Atelier Noyer",
    type: "ARTISAN & MENUISERIE",
    text: "Le savoir-faire au premier plan. Des matières, des réalisations et une demande de projet guidée.",
    tags: ["Portfolio métier", "Projet sur mesure"],
  },
];

export const demoContent = {
  alba: {
    theme: "alba-demo",
    title: ["Le temps", "pour soi."],
    intro:
      "Une parenthèse imaginée pour prendre soin de soi, dans une atmosphère douce et attentive.",
    link: "Les soins",
    eyebrow: "LES RITUELS",
    heading: "Choisissez votre pause.",
    categories: ["Visage", "Corps", "Rituels"],
    itemLabel: "SOIN CONCEPTUEL",
    offers: [
      [
        [
          "Soin éclat",
          "Un rituel doux et une attention portée à chaque geste.",
        ],
        [
          "Soin essentiel",
          "Une pause personnalisée pour retrouver du confort.",
        ],
      ],
      [
        [
          "Massage détente",
          "Un moment pour ralentir et relâcher les tensions.",
        ],
        ["Rituel corps", "Un soin enveloppant dans une atmosphère apaisante."],
      ],
      [
        ["Rituel signature", "Une parenthèse complète dans l’univers Alba."],
        [
          "Rituel découverte",
          "Une première rencontre avec les soins du studio.",
        ],
      ],
    ],
  },
  sola: {
    theme: "sola-demo",
    title: ["Le goût", "du moment."],
    intro:
      "Une table imaginée au rythme des saisons. Des produits choisis et le plaisir de recevoir.",
    link: "La carte",
    eyebrow: "À LA CARTE",
    heading: "À chaque envie, sa saison.",
    categories: ["Entrées", "Plats", "Desserts"],
    itemLabel: "CARTE CONCEPTUELLE",
    offers: [
      [
        [
          "Légumes de saison",
          "Herbes fraîches, textures croquantes et vinaigrette légère.",
        ],
        [
          "Velouté du marché",
          "Une composition qui suit les produits du moment.",
        ],
      ],
      [
        ["Assiette du jardin", "Légumes rôtis, céréales et sauce maison."],
        ["Suggestion du chef", "Une recette autour de la sélection du jour."],
      ],
      [
        ["Fruit & crème", "Une fin de repas fraîche et légère."],
        ["Chocolat de la maison", "Une création douce et généreuse."],
      ],
    ],
  },
  barber: {
    theme: "barber-demo",
    title: ["La coupe juste.", "L’allure en plus."],
    intro:
      "Atelier N°7 : un concept de barber contemporain où le geste précis rencontre une identité affirmée. Explorez les prestations et composez un rendez-vous fictif.",
    link: "Les prestations",
    eyebrow: "LE SAVOIR-FAIRE",
    heading: "Votre style, dans le détail.",
    categories: ["Coupes", "Barbe", "Rituels"],
    itemLabel: "PRESTATION CONCEPTUELLE",
    offers: [
      [
        [
          "La coupe signature",
          "Diagnostic de style, coupe aux ciseaux ou dégradé et coiffage. Durée indicative du concept : 45 min.",
        ],
        [
          "Le dégradé précis",
          "Une ligne nette, une transition maîtrisée et une finition soignée. Durée indicative : 30 min.",
        ],
      ],
      [
        [
          "La barbe dessinée",
          "Taille, contours et finition pour une barbe structurée. Durée indicative : 25 min.",
        ],
        [
          "Le rasage traditionnel",
          "Serviette chaude et gestes précis dans l’esprit du rituel barber. Durée indicative : 35 min.",
        ],
      ],
      [
        [
          "Coupe & barbe",
          "Un parcours complet pour harmoniser la coupe et la barbe. Durée indicative : 60 min.",
        ],
        [
          "Le rituel découverte",
          "Une consultation de style suivie d’une prestation imaginée sur mesure. Durée indicative : 50 min.",
        ],
      ],
    ],
  },
  artisan: {
    theme: "artisan-demo",
    title: ["Du bois.", "Du sens. Du sur-mesure."],
    intro:
      "Atelier Noyer : un concept de menuiserie qui raconte la matière, les usages et le soin du détail. Parcourez les réalisations imaginées et préparez un projet fictif.",
    link: "Les réalisations",
    eyebrow: "MATIÈRES & SAVOIR-FAIRE",
    heading: "Des espaces faits pour vivre.",
    categories: ["Agencements", "Mobilier", "Finitions"],
    itemLabel: "RÉALISATION CONCEPTUELLE",
    offers: [
      [
        [
          "Bibliothèque intégrée",
          "Un agencement du sol au plafond, dessiné selon les volumes et les usages du quotidien.",
        ],
        [
          "Entrée fonctionnelle",
          "Banc, rangements et niches pour organiser un espace d’accueil compact.",
        ],
      ],
      [
        [
          "Table de rencontre",
          "Un plateau en bois et un dessin sobre, imaginés pour les moments partagés.",
        ],
        [
          "Bureau de travail",
          "Un mobilier adapté aux gestes, aux équipements et à la lumière de votre pièce.",
        ],
      ],
      [
        [
          "Noyer naturel",
          "Une teinte profonde et un veinage expressif pour des pièces au caractère affirmé.",
        ],
        [
          "Chêne clair",
          "Une matière lumineuse et un rendu discret pour accompagner les intérieurs contemporains.",
        ],
      ],
    ],
  },
};
