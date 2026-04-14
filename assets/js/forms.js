// Configuración global del repositorio
const OWNER = 'Pablo1724'; // Reemplaza con tu nombre de usuario de GitHub
const REPO = 'ELECCIONES-COMITE-UPDS-2026'; // Reemplaza con el nombre de tu repositorio
const TOKEN = ''; 

// 1. Función para cargar el personal del JSON en los buscadores (Tom Select)
async function cargarPersonalUPDS() {
    try {
        const response = await fetch('./data/personal_upds.json');
        const personal = await response.json();
        
        const selectores = ['select-secretario', 'select-vocal'];
        
        selectores.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return; // Si el elemento no existe en la página, saltar

            select.innerHTML = '<option value="">Escriba para buscar...</option>';
            
            // Ordenar alfabéticamente y llenar el selector
            personal.sort((a, b) => a.nombre.localeCompare(b.nombre)).forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.nombre;
                option.textContent = `${emp.nombre} — ${emp.cargo}`;
                select.appendChild(option);
            });

            // Inicializar el buscador inteligente Tom Select
            new TomSelect(`#${id}`, {
                create: false,
                sortField: { field: "text", order: "asc" },
                placeholder: "Buscar por nombre o cargo...",
                maxOptions: 50
            });
        });
    } catch (error) {
        console.error("Error al inicializar el personal:", error);
    }
}

// 2. Función para enviar la POSTULACIÓN (Fase 1)
async function enviarPostulacion(propuesta) {
    const btn = document.getElementById('btn-enviar');
    btn.disabled = true;
    btn.innerText = "Enviando...";

    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
            method: 'POST',
            headers: {
                
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'nueva_postulacion',
                client_payload: propuesta
            })
        });

        if (response.ok || response.status === 204) {
            actualizarEstadoLocal('ha_postulado');
        } else {
            throw new Error('Error en la comunicación con GitHub');
        }
    } catch (error) {
        manejarError(btn, "Enviar Postulación");
    }
}

// 3. Función para enviar el VOTO FINAL (Fase 2)
async function enviarVotoFinal(voto) {
    const btn = document.getElementById('btn-votar');
    btn.disabled = true;
    btn.innerText = "Procesando Voto...";

    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
            method: 'POST',
            headers: {
                
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'nuevo_voto',
                client_payload: voto
            })
        });

        if (response.ok) {
            actualizarEstadoLocal('ha_votado');
        } else {
            throw new Error('Error al registrar el voto');
        }
    } catch (error) {
        manejarError(btn, "Emitir Voto Secreto");
    }
}

// Funciones de ayuda (Helpers)
function actualizarEstadoLocal(campo) {
    alert("Acción registrada. El sistema se actualizará en breve.");
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogueado'));
    usuario[campo] = true;
    sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    window.location.reload();
}

function manejarError(btn, textoOriginal) {
    alert("Error: No se pudo conectar con el servidor. Verifique su conexión.");
    btn.disabled = false;
    btn.innerText = textoOriginal;
}

// Ejecutar carga de personal si estamos en la página de postulaciones
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('select-secretario')) {
        cargarPersonalUPDS();
    }
});
