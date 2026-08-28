 async function ejecutarAgente() {
        const btn = document.getElementById('consultBtn');
        const errorDiv = document.getElementById('errorMsg');
        const agentDiv = document.getElementById('agentRecommendation');
        
        btn.disabled = true;
        errorDiv.textContent = '';
        agentDiv.textContent = 'Generando informe de clima...';
        document.getElementById('weatherDisplay').style.display = 'block';

        try {
            const selectedValue = document.getElementById('citySelect').value;
            const params = new URLSearchParams(selectedValue);
            const lat = params.get('lat');
            const lon = params.get('lon');
            const nombreCiudad = params.get('name');

            // 1. Clima directo desde Open-Meteo
            const urlOpenMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=auto&models=best_match`;
            
            const resWeather = await fetch(urlOpenMeteo);
            const dataWeather = await resWeather.json();

            const temp = dataWeather.current.temperature_2m;
            const humedad = dataWeather.current.relative_humidity_2m;

            const ahora = new Date();
            const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            document.getElementById('cityName').textContent = nombreCiudad;
            document.getElementById('tempC').textContent = `${temp}°C`;
            document.getElementById('condText').textContent = `Humedad: ${humedad}%`;
            document.getElementById('updateTime').textContent = `Actualizado a las: ${horaFormateada}`;

            // 2. Consulta segura a nuestro Backend Serverless (Sin API Key expuesta)
            const resIA = await fetch('/api/agente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreCiudad, temp, humedad })
            });

            const dataIA = await resIA.json();
            
            if (dataIA.choices && dataIA.choices[0] && dataIA.choices[0].message) {
                agentDiv.textContent = dataIA.choices[0].message.content;
            } else if (dataIA.error) {
                agentDiv.textContent = `Error del servidor: ${dataIA.error.message || JSON.stringify(dataIA.error)}`;
            } else {
                agentDiv.textContent = `Respuesta inesperada: ${JSON.stringify(dataIA)}`;
            }

        } catch (err) {
            errorDiv.textContent = 'Error de conexión: ' + err.message;
        } finally {
            btn.disabled = false;
        }
    }
