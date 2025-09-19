const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const formLogin = document.getElementById("formLogin");
const formRegister = document.getElementById("formRegister");

btnLogin.addEventListener("click", () => {
    // Mostrar formulario de inicio
    loginForm.classList.remove("hidden");
    loginForm.classList.add("flex");

    // Ocultar formulario de registro
    formRegister.classList.remove("flex");
    formRegister.classList.add("hidden");

    // Estilos del botón activo/inactivo
    btnLogin.classList.add("bg-orange-600", "text-white");
    btnLogin.classList.remove("bg-white", "text-black");

    btnRegister.classList.add("bg-white", "text-black");
    btnRegister.classList.remove("bg-orange-600", "text-white");

    // Animación en el botón Inicio
    btnLogin.classList.add("animate__animated", "animate__headShake");
    btnLogin.addEventListener("animationend", function handleAnimationEnd() {
        btnLogin.classList.remove("animate__animated", "animate__headShake");
        btnLogin.removeEventListener("animationend", handleAnimationEnd);
    });
});

btnRegister.addEventListener("click", () => {
    // Mostrar formulario de registro
    formRegister.classList.remove("hidden");
    formRegister.classList.add("flex");

    // Ocultar formulario de inicio
    loginForm.classList.remove("flex");
    loginForm.classList.add("hidden");

    // Estilos del botón activo/inactivo
    btnRegister.classList.add("bg-orange-600", "text-white");
    btnRegister.classList.remove("bg-white", "text-black");

    btnLogin.classList.add("bg-white", "text-black");
    btnLogin.classList.remove("bg-orange-600", "text-white");

    // Animación en el botón Registro
    btnRegister.classList.add("animate__animated", "animate__headShake");
    btnRegister.addEventListener("animationend", function handleAnimationEnd() {
        btnRegister.classList.remove("animate__animated", "animate__headShake");
        btnRegister.removeEventListener("animationend", handleAnimationEnd);
    });
});

const loginForm = document.querySelector("#loginForm form");
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(loginForm);

    fetch("php/iniciar_sesion.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data.includes("success")) {
            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: "Inicio de sesión exitoso.",
                confirmButtonColor: "#FF5800"
            }).then(() => {
                window.location.href = "menu.html";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data,
                confirmButtonColor: "#FF5800"
            });
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al conectar con el servidor.",
            confirmButtonColor: "#FF5800"
        });
        console.error(err);
    });
});



// Función para validar el formulario de registro
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Validar campos del formulario
    const formData = new FormData(registerForm); 

    fetch("php/registrar_usuario.php", {
        // Cambia la URL al archivo PHP que maneja el registro
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data.includes("Registrado")) {
            Swal.fire({
                icon: 'success',
                title: '¡Listo!',
                text: data,
                confirmButtonText: 'Aceptar'
            });
            registerForm.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data,
                confirmButtonText: 'Aceptar'
            });
        }
    })
    .catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el registro, intenta más tarde.',
            confirmButtonText: 'Aceptar'
        });
        console.error("Error en el registro:", err);
    });
});


