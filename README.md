# 🌤️ Laboratorio de Integración: 
API de Clima & Agentes de IA

Este repositorio documenta un ejercicio práctico de ingeniería enfocado en dominar la integración de servicios externos, consumo de APIs REST asíncronas y orquestación de Modelos de Lenguaje (LLM) a través de **OpenRouter**, utilizando la meteorología como caso de estudio experimental.

---

## 📐 Arquitectura de Aprendizaje

El sistema implementa una arquitectura desacoplada para evaluar la comunicación entre servicios de datos en tiempo real y motores de inferencia en la nube:

1. **Capa de Ingesta (Datos Externos):** Consulta directa a la API de **Open-Meteo** para la obtención síncrona de variables meteorológicas clave: temperatura, humedad relativa, velocidad del viento, precipitaciones y presión atmosférica.
2. **Capa Cognitiva (Orquestación de Agentes):** Conexión vía backend serverless con **OpenRouter**, diseñada para evaluar la respuesta de diversos LLM gratuitos y analizar su comportamiento al procesar datos estructurados en lenguaje natural.
3. **Capa de Presentación (Interfaz Ligera):** Panel minimalista desarrollado en **Vanilla HTML5, CSS3 y JavaScript puro**, optimizado para garantizar rendimiento sub-segundo y control de red en tiempo real.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5, CSS3 (Variables, Flexbox), Vanilla JavaScript (ES6+ Asíncrono).
* **Backend Serverless:** Node.js / Serverless Handlers orientados a la gestión de variables de entorno y peticiones HTTP.
* **APIs e Infraestructura:**
* [Open-Meteo API](https://open-meteo.com/) — Datos numéricos de la atmósfera.
* [OpenRouter API](https://openrouter.ai/) — Puerta de enlace para modelos de IA.
* Vercel / Render — Alojamiento y despliegue estático/serverless.



---

## 💡 Enfoque del Ejercicio

Este proyecto no busca replicar un software meteorológico comercial, sino servir como un entorno controlado de experimentación para:

* Comprender el ciclo de vida de una petición HTTP asíncrona (`fetch`, `async/await`, manejo de errores por red).
* Evaluar el impacto de suministrar múltiples parámetros físicos duros (*viento, presión, precipitaciones*) en la precisión y contexto de las respuestas generadas por agentes de IA.
* Dominar la parametrización de prompts orientados a la estructuración de informes técnicos limpios y directos.
