export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombreCiudad, temp, humedad } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key no configurada en el servidor' });
    }

const promptAgente = `Eres un poeta y asistente meteorológico folclórico de la zona de ${nombreCiudad}. 
Temperatura actual: ${temp}°C. Humedad: ${humedad}%. 

Entrega tu recomendación sobre cómo vestir hoy redactando EXCLUSIVAMENTE una Décima Espinela clásica respetando estrictamente estas reglas métricas:
1. Exactamente 10 versos octosílabos (8 sílabas poéticas por verso).
2. Esquema de rima consonante obligatorio: A-B-B-A-A-C-C-D-D-C.
   - Verso 1 rima con 4 y 5 (A)
   - Verso 2 rima con 3 (B)
   - Verso 6 rima con 7 y 10 (C)
   - Verso 8 rima con 9 (D)
3. Lenguaje folclórico chileno directo, astuto y enfocado en el clima actual.`;
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
