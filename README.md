# 🌤️ Agente Meteorológico Poético (Ñuble / Bío Bío)

Un microagente web minimalista y resiliente que consulta datos meteorológicos en tiempo real y los transforma en recomendaciones de vestimenta mediante **décimas poéticas tradicionales chilenas**, procesadas por modelos de Lenguaje de Gran Escala (LLM) a través de la API de OpenRouter.

---

## 📐 Arquitectura del Sistema

El proyecto implementa una arquitectura **Fullstack Client-Side (Serverless & Dependency-Free)** orientada al alto rendimiento y al mínimo consumo de recursos.

1. **Capa de Captura (El Cuerpo):** Consume la API REST de **Open-Meteo** para la obtención de datos meteorológicos precisos (temperatura y humedad relativa) según coordenadas geográficas sin requerir autenticación ni librerías pesadas.
2. **Capa del Agente (El Cerebro):** Implementa un pipeline de prompt engineering estructurado hacia la API de **OpenRouter**, delegando la generación de inferencia poética al modelo `google/gemma-4-26b-a4b-it:free`.
3. **Capa de Presentación (UI/UX):** Interfaz ergonómica e híper-liviana desarrollada en **Vanilla HTML5/CSS3**, optimizada bajo un esquema de colores oscuros (*Dark Mode*) para prevenir la fatiga visual y garantizar tiempos de carga sub-segundo.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Variables CSS, Flexbox), Vanilla JavaScript (ES6+ Async/Await).
* **APIs Externas:**
  * [Open-Meteo API](https://open-meteo.com/) — Geolocalización y datos meteorológicos.
  * [OpenRouter API](https://openrouter.ai/) — Inferencia de LLM en la nube.
* **Tipografía:** Google Fonts (`Poppins`).
* **Despliegue:** Render / Vercel (Static Site Hosting).

---

## 💡 Prompt Engineering & Lógica Folclórica

El sistema utiliza la estructura poética de la **décima** (10 versos octosílabos con rima consonante) como formato de salida ergonómico y cultural para entregar la sugerencia meteorológica:

```javascript
const promptAgente = `Eres un asistente meteorológico folclórico para la zona de ${nombreCiudad}. 
Temperatura actual: ${temp}°C. Humedad: ${humedad}%. 
Entrega tu recomendación sobre qué vestir o llevar hoy exclusivamente en forma de una décima poética tradicional (10 versos octosílabos). Sé directo, creativo y mantén el tono de la zona.`;
