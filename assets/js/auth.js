// assets/js/auth.js

async function validarAcceso(inputID, inputPass) {
    try {
        // Intentamos cargar el archivo desde la raíz
        let response = await fetch('data/usuarios.json');
        
        // Si no lo encuentra en la raíz, intentamos con ruta relativa al script
        if (!response.ok) {
            response = await fetch('./data/usuarios.json');
        }

        if (!response.ok) {
            throw new Error("No se pudo encontrar el archivo usuarios.json en ninguna ruta.");
        }

        // LEEMOS EL JSON SOLO UNA VEZ
        const usuarios = await response.json();
        
        // Verificamos que sea una lista (Array)
        if (!Array.isArray(usuarios)) {
            throw new Error("El formato de usuarios.json es incorrecto (debe empezar con [ )");
        }

        // Buscamos al usuario
        const usuarioValido = usuarios.find(u => u.id === inputID && u.password === inputPass);

        if (usuarioValido) {
            // Guardamos en la sesión
            sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
            const faseActual = "postulacion"; 
            sessionStorage.setItem('faseActual', faseActual);
            
            alert(`Bienvenido/a ${usuarioValido.nombre}`);
            
            // Redirigimos manualmente para asegurar que funcione en GitHub Pages
            window.location.href = "postulaciones.html";
        } else {
            alert("ID o Contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error detallado:", error);
        alert("Error técnico al validar: " + error.message);
    }
}

// Mantenemos esta función por si la necesitas más adelante
function redirigirUsuario(fase) {
    if (fase === "postulacion") {
        window.location.href = "postulaciones.html";
    } else if (fase === "votacion") {
        window.location.href = "votacion.html";
    }
}
