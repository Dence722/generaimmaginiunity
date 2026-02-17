import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const body = req.body;

    if (!body || !body.prompt) {
      return res.status(400).json({ error: "Prompt mancante" });
    }

    const prompt = body.prompt;

    const finalPrompt =
      prompt +
      ", detailed medical anatomical illustration, isolated on black background, neon hologram style";

    const url =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(finalPrompt) +
      "?width=512&height=512&nologo=true";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*",
      },
    });

    if (!response.ok) {
      console.error("Errore Pollinations:", response.status);
      return res.status(502).json({ error: "Errore servizio immagini" });
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Errore backend:", err);
    res.status(500).json({ error: "Errore interno backend" });
  }
}
