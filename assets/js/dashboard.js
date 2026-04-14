// assets/js/dashboard.js

async function cargarGraficos() {
    try {
        // Obtenemos los datos consolidados que genera el GitHub Action
        const response = await fetch('data/resultados_finales.json');
        const datos = await response.json();

        // Configuración para el gráfico de Secretario
        renderizarBarra('chartSecretario', datos.secretario, 'Votos para Secretario', '#003366');

        // Configuración para el gráfico de Vocal
        renderizarBarra('chartVocal', datos.vocal, 'Votos para Segundo Vocal', '#cc0000');

    } catch (error) {
        console.error("Error al cargar los resultados:", error);
    }
}

function renderizarBarra(canvasId, dataset, label, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Extraemos nombres y valores del JSON
    const etiquetas = Object.keys(dataset);
    const valores = Object.values(dataset);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: label,
                data: valores,
                backgroundColor: color,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y', // Barras horizontales para mejor lectura de nombres
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', cargarGraficos);