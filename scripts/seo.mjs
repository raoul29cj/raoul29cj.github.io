import fs from "node:fs";
import path from "node:path";
import { config, faq, services, socials } from "../src/config.js";
import { projects } from "../src/projects.js";
import { render } from "../.prerender/entry-server.js";

const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const fields = [
  "identity",
  "status",
  "address",
  "registration",
  "vat",
  "director",
  "host",
  "hostAddress",
  "hostPhone",
  "retention",
  "transfers",
  "logs",
];
const complete = fields.every((key) => config.legal[key]?.trim());
const url = config.siteUrl ? new URL(config.siteUrl) : null;
if (
  url &&
  (url.protocol !== "https:" ||
    !["", "/"].includes(url.pathname) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password)
)
  throw new Error(
    "siteUrl doit être le domaine HTTPS seul, sans sous-dossier, paramètres ni identifiants.",
  );
const publish = Boolean(config.indexable && complete && url);
if (config.indexable && !publish)
  throw new Error(
    "Complétez le domaine et les informations légales avant d’activer l’indexation.",
  );
const origin = url?.origin;
const template = fs.readFileSync("dist/index.html", "utf8");
const pages = [
  {
    route: "/",
    title: "Raoul.CJ — Développeur web freelance & design graphique",
    description:
      "Création de sites web sur mesure, corrections techniques et design graphique. Découvrez mes projets et échangeons sur le vôtre.",
    index: true,
  },
  ...projects.map((p) => ({
    route: `/projets/${p.id}/`,
    title: `${p.name} — Concept de site web | Raoul.CJ`,
    description:
      p.text +
      " Explorez cette démonstration fictive de design et de développement web par Raoul.CJ.",
    index: true,
    project: p,
  })),
  {
    route: "/mentions-legales/",
    title: "Mentions légales — Raoul.CJ",
    description:
      "Informations sur l’éditeur, la publication et l’hébergement du portfolio de Raoul.CJ.",
    index: false,
  },
  {
    route: "/confidentialite/",
    title: "Données personnelles — Raoul.CJ",
    description:
      "Informations sur le formulaire de contact, les données personnelles et vos droits.",
    index: false,
  },
  {
    route: "/conditions/",
    title: "Conditions d’utilisation — Raoul.CJ",
    description:
      "Conditions de consultation du portfolio, de ses concepts et de ses ressources numériques.",
    index: false,
  },
  {
    route: "/404.html",
    title: "Page introuvable — Raoul.CJ",
    description:
      "Cette page n’existe pas. Retrouvez les projets et les services de Raoul.CJ.",
    index: false,
  },
];
for (const page of pages) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escape(page.description)}"/>`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escape(page.title)}"/>`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${escape(page.description)}"/>`,
    )
    .replace(
      'content="noindex,nofollow"',
      `content="${publish && page.index ? "index,follow,max-image-preview:large" : "noindex,follow"}"`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${render(page.route)}</div>`,
    );
  const extra = [
    `<meta name="twitter:title" content="${escape(page.title)}"/>`,
    `<meta name="twitter:description" content="${escape(page.description)}"/>`,
  ];
  if (origin) {
    const canonical = origin + page.route;
    html = html.replace(
      'content="/og-image.png"',
      `content="${escape(origin)}/og-image.png"`,
    );
    extra.push(
      `<meta name="twitter:image" content="${escape(origin)}/og-image.png"/>`,
    );
    if (page.route !== "/404.html")
      extra.push(
        `<link rel="canonical" href="${escape(canonical)}"/>`,
        `<meta property="og:url" content="${escape(canonical)}"/>`,
      );
    if (publish && page.index) {
      const data =
        page.route === "/"
          ? {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": origin + "/#website",
                  url: origin + "/",
                  name: config.name,
                  inLanguage: "fr-FR",
                },
                {
                  "@type": "Person",
                  "@id": origin + "/#creator",
                  name: config.author,
                  alternateName: config.name,
                  url: origin + "/#apropos",
                  image: origin + config.portrait,
                  jobTitle: "Développeur web et designer freelance",
                  sameAs: socials
                    .map((s) => s.url)
                    .filter((u) => u.startsWith("https://")),
                  knowsAbout: [
                    "Développement web",
                    "React",
                    "JavaScript",
                    "WordPress",
                    "Laravel",
                    "Design graphique",
                    "UI design",
                  ],
                },
                {
                  "@type": "ProfessionalService",
                  "@id": origin + "/#service",
                  name: config.name + " — Développement web & design graphique",
                  url: origin + "/",
                  image: origin + "/og-image.png",
                  areaServed: "FR",
                  founder: { "@id": origin + "/#creator" },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Services",
                    itemListElement: services.map((s) => ({
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: s.title,
                        description: s.description,
                      },
                    })),
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": origin + "/#faq",
                  mainEntity: faq.map(([q, a]) => ({
                    "@type": "Question",
                    name: q,
                    acceptedAnswer: { "@type": "Answer", text: a },
                  })),
                },
                {
                  "@type": "WebPage",
                  "@id": origin + "/#webpage",
                  url: canonical,
                  name: page.title,
                  description: page.description,
                  inLanguage: "fr-FR",
                  isPartOf: { "@id": origin + "/#website" },
                  about: { "@id": origin + "/#creator" },
                },
              ],
            }
          : {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: page.project.name + " — Concept fictif",
              url: canonical,
              description: page.description,
              inLanguage: "fr-FR",
              creator: { "@type": "Person", name: config.author },
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: origin + "/" },
                  { "@type": "ListItem", position: 2, name: "Projets", item: origin + "/#projets" },
                  { "@type": "ListItem", position: 3, name: page.project.name, item: canonical },
                ],
              },
            };
      extra.push(`<script type="application/ld+json">${json(data)}</script>`);
    }
  }
  html = html.replace("</head>", extra.join("\n") + "\n</head>");
  const output =
    page.route === "/"
      ? "dist/index.html"
      : page.route === "/404.html"
        ? "dist/404.html"
        : path.join("dist", page.route, "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}
// Le noindex reste lisible par les robots : ne pas empêcher le chargement du HTML/CSS/JS.
fs.writeFileSync(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\n" +
    (publish ? `Sitemap: ${origin}/sitemap.xml\n` : ""),
);
if (publish)
  fs.writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
      .filter((p) => p.index)
      .map((p) => `<url><loc>${escape(origin + p.route)}</loc></url>`)
      .join("")}</urlset>`,
  );
else fs.rmSync("dist/sitemap.xml", { force: true });
fs.rmSync(".prerender", { recursive: true, force: true });
console.log(
  `${pages.length} pages HTML pré-rendues. ${publish ? "Indexation de production activée." : "Préparation : indexation désactivée."}`,
);
