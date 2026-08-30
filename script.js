async function ejecutarAgente() {
    const btn = document.getElementById('consultBtn');
    const errorDiv = document.getElementById('errorMsg');
    const agentDiv = document.getElementById('agentRecommendation');
    
    btn.disabled = true;
    errorDiv.textContent = '';
    // Configura el estado inicial de carga en ambos elementos
    const titleDiv = document.getElementById('agentTitle');
    if (titleDiv) {
        titleDiv.textContent = 'Agente de Clima (Esperando conexión...)';
    }
    agentDiv.textContent = 'Generando informe de clima...';
    
    document.getElementById('weatherDisplay').style.display = 'block';
    try {
        const selectedValue = document.getElementById('citySelect').value;
        const params = new URLSearchParams(selectedValue);
        const lat = params.get('lat');
        const lon = params.get('lon');
        const nombreCiudad = params.get('name');

        // 1. Clima directo desde Open-Meteo
        const urlOpenMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,pressure_msl,cloud_cover,uv_index,soil_temperature_0cm,soil_moisture_0_to_1cm&timezone=auto&models=best_match`;        
        const resWeather = await fetch(urlOpenMeteo);
        const dataWeather = await resWeather.json();

        // Debajo de donde lee temp y humedad, agregue la lectura de los nuevos campos del JSON:
        const temp = dataWeather.current.temperature_2m;
        const humedad = dataWeather.current.relative_humidity_2m;
        const apparentTemp = dataWeather.current.apparent_temperature;
        const precipitation = dataWeather.current.precipitation;
        const precipProb = dataWeather.current.precipitation_probability;
        const windSpeed = dataWeather.current.wind_speed_10m;
        const windGusts = dataWeather.current.wind_gusts_10m;
        const pressure = dataWeather.current.surface_pressure;
        const uvIndex = dataWeather.current.uv_index;

        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
         });

        document.getElementById('cityName').textContent = nombreCiudad;
        document.getElementById('tempC').textContent = `${temp}°C`;
        document.getElementById('humVal').textContent = `${humedad}%`;
        document.getElementById('apparentTempVal').textContent = `${apparentTemp}°C`;
        document.getElementById('precipVal').textContent = precipitation;
        document.getElementById('windVal').textContent = windSpeed;
        document.getElementById('gustsVal').textContent = windGusts;
        document.getElementById('pressureVal').textContent = pressure;
        document.getElementById('uvVal').textContent = uvIndex;

        document.getElementById('updateTime').textContent = `Actualizado ${horaFormateada}`;
        // 2. Consulta a nuestro Backend Serverless
        const resIA = await fetch('/api/agente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
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
            })
        });

        const dataIA = await resIA.json();
        
        if (dataIA.choices && dataIA.choices[0] && dataIA.choices[0].message) {
                const titleDiv = document.getElementById('agentTitle');
                if (titleDiv && dataIA.modeloUsado) {
                    titleDiv.textContent = `Agente de Clima (${dataIA.modeloUsado})`;
                }
                
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
