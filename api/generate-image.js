import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Metodo non consentito");
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).send("Prompt mancante");
        }

        const finalPrompt =
            prompt +
            ", detailed medical anatomical illustration, isolated on black background, neon hologram style";

        const url =
            "https://image.pollinations.ai/prompt/" +
            encodeURIComponent(finalPrompt) +
            "?width=512&height=512&nologo=true";

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        if (!response.ok) {
            return res.status(500).send("Errore Pollinations");
        }

        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", "image/png");
        res.status(200).send(Buffer.from(buffer));

    } catch (err) {
        console.error(err);
        res.status(500).send("Errore server");
    }
}
