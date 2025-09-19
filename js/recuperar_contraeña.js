document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRecuperarPass");
  const newPassSection = document.getElementById("newPassSection");
  const emailInput = document.getElementById("emailRecuperar");

  let correoVerificado = null; // para guardar el correo si es válido

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      Swal.fire("Error", "Por favor ingresa un correo válido.", "error");
      return;
    }

    try {
      const res = await fetch("./php/verificar_correo.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`,
      });

      const json = await res.json();

      if (json.existe) {
        correoVerificado = email;
        newPassSection.classList.remove("hidden");
        Swal.fire("Éxito", "Correo encontrado. Ahora ingresa tu nueva contraseña.", "success");
      } else {
        Swal.fire("Error", "El correo no existe en el sistema.", "error");
      }
    } catch {
      Swal.fire("Error", "Error en la comunicación con el servidor.", "error");
    }
  });

  document.getElementById("btnCambiarPassword").addEventListener("click", async () => {
    const nuevaPass = document.getElementById("nuevaContrasena").value.trim();

    if (!nuevaPass) {
      Swal.fire("Error", "Ingresa una nueva contraseña válida.", "error");
      return;
    }

    try {
      const res = await fetch("./php/actualizar_contrasena.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(correoVerificado)}&nueva_pass=${encodeURIComponent(nuevaPass)}`
      });

      const json = await res.json();

      if (json.exito) {
        Swal.fire("¡Listo!", "Contraseña actualizada correctamente.", "success").then(() => {
          window.location.href = "index.html";
        });
      } else {
        Swal.fire("Error", json.mensaje || "No se pudo cambiar la contraseña.", "error");
      }
    } catch {
      Swal.fire("Error", "Error en el servidor.", "error");
    }
  });
});
