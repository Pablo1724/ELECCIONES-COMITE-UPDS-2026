// assets/js/auth.js

// assets/js/auth.js

async function validarAcceso(inputID, inputPass) {
    try {
        // Usamos ../../ para salir de assets/js y llegar a la raíz donde está data/
        const response = await fetch('../../data/usuarios.json');
        
        if (!response.ok) {
            throw new Error("No se pudo encontrar el archivo usuarios.json");
        }

        const usuarios = await response.json();
        
        // Verificamos que 'usuarios' sea realmente una lista antes de usar .find()
        if (!Array.isArray(usuarios)) {
            throw new Error("El formato del archivo usuarios.json es incorrecto (debe empezar con [ )");
        }

        // Buscamos al usuario
        const usuarioValido = usuarios.find(u => u.id === inputID && u.password === inputPass);

        if (usuarioValido) {
            sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
            const faseActual = "postulacion"; 
            sessionStorage.setItem('faseActual', faseActual);
            
            alert(`Bienvenido/a ${usuarioValido.nombre}`);
            redirigirUsuario(faseActual);
        } else {
            alert("ID o Contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error detallado:", error);
        alert("Error técnico al validar: " + error.message);
    }
}

function redirigirUsuario(fase) {
    if (fase === "postulacion") {
        window.location.href = "postulaciones.html";
    } else if (fase === "votacion") {
        window.location.href = "votacion.html";
    }
}