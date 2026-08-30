export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { 
           nombreCiudad, 
           temp, 
           humedad, 
           apparentTemp, 
           precipitation, 
           precipProb, 
           windSpeed, 
           windGusts, 
           pressure, 
           uvIndex 
    } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY || "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";

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key no configurada en el servidor' });
    }

const promptAgente = `Eres un meteorólogo de televisión en vivo, sumamente carismático, analítico y perspicaz.
Estás reportando en vivo para la ciudad de ${nombreCiudad}.
Parámetros actuales en tiempo real:
- Temperatura: ${temp}°C (Sensación térmica: ${apparentTemp}°C)
- Humedad Relativa: ${humedad}%
- Precipitación: ${precipitation} mm
- Viento: ${windSpeed} km/h (Ráfagas: ${windGusts} km/h)
- Presión Atmosférica: ${pressure} hPa
- Índice UV: ${uvIndex}

Tu objetivo es entregar un reporte meteorológico cruzando inteligentemente las combinaciones de datos (por ejemplo: baja temperatura con alta humedad y viento genera sensación de escarcha y frío penetrante; alta presión con baja humedad indica ambiente seco y estable). 
REGLA DE LONGITUD: Tu respuesta DEBE tener un mínimo de 25 palabras y un máximo de 30 palabras.

Escala fisiológica de referencia según temperatura (${temp}°C):
- Menor o igual a -6 °C: Alerta de congelamiento inmediato. El aire quema al respirar y congela líquidos al contacto.
- De -5 °C a -3 °C: Frío severo. Sensación agudamente helada en rostro y vías respiratorias.
- De -2 °C a 0 °C: Helada activa y congelación de superficie (escarcha, hielo). Tolerable en movimiento pero incómodo.
- De 1 °C a 3 °C: Riesgo agrometeorológico. Frío penetrante, aire helado en la nariz.
- De 4 °C a 7 °C: Frío acentuado. Requiere abrigo pesado; manejable si te mantienes en movimiento.
- De 8 °C a 11 °C: Fresco invernal/otoñal. Frío soportable con abrigo estándar.
- De 12 °C a 15 °C: Fresco suave / Transición.
- De 16 °C a 19 °C: Confort térmico inicial (Templado agradable).
- De 20 °C a 23 °C: Confort pleno / Día ideal.
- De 24 °C a 27 °C: Cálido moderado.
- De 28 °C a 31 °C: Calor activo. Inicio de sudoración en movimiento.
- De 32 °C a 34 °C: Calor intenso. Pesado bajo el sol directo.
- De 35 °C a 37 °C: Calor muy fuerte. Alta dependencia de sombra e hidratación.
- De 38 °C a 40 °C: Calor sofocante/extremo. Sensación de abrumamiento.
- De 41 °C a 43 °C: Aire hirviente. Sensación de bochorno directo y deshidratación rápida.
- Mayor o igual a 44 °C: Ambiente hostil/extremo. El aire se siente caliente al inhalar.

Instrucciones de formato:
1. Incluye o menciona la ciudad (${nombreCiudad}) en tu reporte.
2. No uses saludos ni despedidas formales (ej. "Hola", "Buenas noches", "Buenos dias") segun corresponda, si dia de 7 hasta 19 horas , el resto es de noche.
3. Sintetiza en una sola narración fluida cómo interactúan el viento, la lluvia, la presión y la temperatura real sobre el cuerpo.`;
   const modelos = [
        { id: 'z-ai/glm-5.2:free', nombre: 'GLM 5.2 IA' },
        { id: 'google/gemma-4-26b-a4b-it:free', nombre: 'Gemma 4 IA' },
        { id: 'nvidia/nemotron-3.5-lightning:free', nombre: 'Nemotron IA' },
        { id: 'dots-studio/dots-3-note-preview:free', nombre: 'Dots 3 IA' }
    ];

    let ultimoError = null;

    for (const modelo of modelos) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelo.id,
                    messages: [{ role: 'user', content: promptAgente }]
                })
            });

            if (!response.ok) {
                continue;
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                // Adjuntamos la información del modelo exacto que respondió
                return res.status(200).json({
                    ...data,
                    modeloUsado: modelo.nombre
                });
            }
        } catch (error) {
            ultimoError = error.message;
        }
    }

    return res.status(500).json({ error: ultimoError || 'Todos los modelos fallaron en responder' });
}
