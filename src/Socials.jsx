import React from "react";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import { socials } from "./config";

const icons = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
};

// Liens vers les profils : ouverts dans un nouvel onglet, sans transmettre la page d'origine.
export default function Socials({ className = "" }) {
  const links = socials.filter((s) => /^https:\/\//i.test(s.url));
  if (!links.length) return null;
  return (
    <ul className={"socials " + className} aria-label="Mes réseaux">
      {links.map(({ name, icon, url }) => {
        const Icon = icons[icon];
        return (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={name + " (nouvel onglet)"}
              title={name}
            >
              <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
