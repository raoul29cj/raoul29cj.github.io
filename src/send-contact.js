export async function sendContact(endpoint, fields) {
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint || "")) {
    throw new Error(
      "L’adresse du formulaire Formspree n’est pas configurée."
    );
  }

  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!name || !email || message.length < 10) {
    throw new Error(
      "Renseignez votre nom, votre e-mail et un message d’au moins 10 caractères."
    );
  }

  if (fields._gotcha) {
    throw new Error("La demande n’a pas pu être envoyée.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _gotcha: "",
        subject: "Junix — Nouvelle demande de projet",
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new Error(
        "Le service est temporairement limité. Réessayez plus tard."
      );
    }

    if (!response.ok) {
      throw new Error(
        "Le service n’a pas accepté la demande. Réessayez plus tard ou contactez-moi directement."
      );
    }

    const result = await response.json();

    if (result.ok !== true) {
      throw new Error(
        "La confirmation d’envoi n’a pas pu être vérifiée."
      );
    }
  } catch (error) {
    if (
      error.name === "AbortError" ||
      error instanceof TypeError
    ) {
      throw new Error(
        "La confirmation d’envoi n’a pas pu être reçue. Évitez les envois répétés et contactez-moi directement si nécessaire."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}