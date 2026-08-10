export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombreCiudad, temp, humedad } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key no configurada en el servidor' });
    }

    const promptAgente = `Eres un asistente meteorológico folclórico para la zona de ${nombreCiudad}. Temperatura actual: ${temp}°C. Humedad: ${humedad}%. Entrega tu recomendación sobre qué vestir o llevar hoy exclusivamente en forma de una décima espinela tradicional (10 versos octosílabos). Sé directo, creativo y mantén el tono de la zona.`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemma-4-26b-a4b-it:free',
                messages: [{ role: 'user', content: promptAgente }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
