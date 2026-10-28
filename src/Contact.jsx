import React, { useRef, useState } from "react";
import { ArrowUpRight, Mail, Phone, Copy, Send } from "lucide-react";
import { config } from "./config";
import { Reveal } from "./Effects";

export default function Contact() {
  const empty = {
    name: "",
    email: "",
    message: "",
    _gotcha: "",
  };

  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const lock = useRef(false);

  function change(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

    setStatus("");
  }

  async function submit(event) {
    event.preventDefault();

    if (lock.current) return;

    if (
      !form.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ||
      form.message.trim().length < 10 ||
      form._gotcha
    ) {
      setSuccess(false);
      setStatus("Vérifiez votre nom, votre e-mail et votre message.");
      return;
    }

    lock.current = true;
    setSending(true);
    setStatus("");
    setSuccess(false);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(config.formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: "Junix — Nouvelle demande de projet",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "Service temporairement limité. Contactez-moi par e-mail."
            : "Le service n’a pas accepté la demande. Votre texte est conservé."
        );
      }

      const data = await response.json();

      if (data.ok !== true) {
        throw new Error(
          "La confirmation est indisponible. Votre texte est conservé."
        );
      }

      setSuccess(true);
      setStatus(
        "Votre demande a été transmise. Merci, je reviendrai vers vous par e-mail."
      );
      setForm(empty);
    } catch (error) {
      setStatus(
        error.name === "AbortError" || error instanceof TypeError
          ? "Impossible de confirmer l’envoi. Évitez les envois répétés ; contactez-moi par e-mail si nécessaire."
          : error.message
      );
    } finally {
      clearTimeout(timer);
      lock.current = false;
      setSending(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `À : ${config.email}\n` +
          `Nom : ${form.name}\n` +
          `E-mail : ${form.email}\n\n${form.message}`
      );

      setSuccess(true);
      setStatus("Votre demande a été copiée.");
    } catch {
      setSuccess(false);
      setStatus("Écrivez directement à " + config.email);
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <Reveal>
          <span className="eyebrow">
            06 / PARLONS DE VOTRE PROJET
          </span>

          <h2>
            La prochaine
            <br />
            belle idée,
            <br />
            <em>c’est la vôtre.</em>
          </h2>

          <p className="lead">
            Quelques mots suffisent pour commencer. Expliquez-moi ce que
            vous souhaitez créer ou améliorer.
          </p>

          <a
            className="contact-line"
            href={"mailto:" + config.email}
          >
            <Mail size={19} />
            {config.email}
            <ArrowUpRight size={16} />
          </a>

          <a
            className="contact-line"
            href={"tel:" + config.phone}
          >
            <Phone size={19} />
            {config.phoneLabel}
          </a>

          <a
            className="subtle-link"
            href={"sms:" + config.phone}
          >
            <span>Une précision ? Envoyer un SMS</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal>
          <form
            className="panel contact-form"
            onSubmit={submit}
            aria-busy={sending}
          >
            <div className="form-heading">
              <h3>Décrivez votre projet.</h3>
              <Send size={22} />
            </div>

            <div className="trap" aria-hidden="true">
              <label>
                Ne pas remplir
                <input
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form._gotcha}
                  onChange={change}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Votre nom
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  value={form.name}
                  onChange={change}
                  disabled={sending}
                  placeholder="Prénom et nom"
                />
              </label>

              <label>
                Votre e-mail
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={140}
                  value={form.email}
                  onChange={change}
                  disabled={sending}
                  placeholder="vous@exemple.fr"
                />
              </label>
            </div>

            <label>
              Votre besoin
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={2500}
                rows={5}
                value={form.message}
                onChange={change}
                disabled={sending}
                placeholder="Votre idée, vos objectifs, votre délai…"
              />
            </label>

            <button
              className="button primary wide"
              disabled={sending}
            >
              {sending ? "Envoi en cours…" : "Envoyer ma demande"}
              <ArrowUpRight size={18} />
            </button>

            <p className="form-note">
              Envoi via Formspree. Vos informations servent à traiter
              votre demande.{" "}
              <a href="#/confidentialite">Données personnelles</a>.
            </p>

            <button
              className="copy-button"
              type="button"
              onClick={copy}
              disabled={sending}
            >
              <Copy size={13} />
              Copier ma demande
            </button>

            {status && (
              <p
                className={
                  "feedback " + (success ? "success" : "error")
                }
                role="status"
              >
                {status}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}