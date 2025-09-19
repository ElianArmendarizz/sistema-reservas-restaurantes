document.addEventListener("DOMContentLoaded", () => {
    /*------------------------------------------------------------
     * 1)  Saludo (nombre del usuario)
     *-----------------------------------------------------------*/
    fetch("./php/obtener_usuario.php")
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("nombreUsuario").textContent =
                data?.nombre ?? "Invitado";
        })
        .catch(() => {
            document.getElementById("nombreUsuario").textContent = "Invitado";
        });

    /*------------------------------------------------------------
     * 2)  Botones de navegación
     *-----------------------------------------------------------*/
    document.getElementById("botonInicio").addEventListener("click", () => {
        location.href = "menu.html";
    });

    document.getElementById("botonFavoritos").addEventListener("click", () => {
        location.href = "mis_favoritos.html";
    });

    document
        .getElementById("botonReservaciones")
        .addEventListener("click", () => {
            location.href = "reservaciones.html";
        });

    /*------------------------------------------------------------
     * 3)  Cargar y mostrar reservaciones pendientes
     *-----------------------------------------------------------*/
    const tbody = document.querySelector("#tablaReservaciones tbody");
    const sinMsg = document.getElementById("sinReservaciones");

    if (tbody && sinMsg) {
        cargarReservaciones();

        function cargarReservaciones() {
            fetch("./php/obtener_reservaciones.php")
                .then((r) => r.json())
                .then((reservas) => {
                    tbody.innerHTML = "";
                    if (reservas.length === 0) {
                        sinMsg.classList.remove("hidden");
                        return;
                    }
                    sinMsg.classList.add("hidden");

                    reservas.forEach((res) => {
                        console.log(res);
                        const tr = document.createElement("tr");
                        tr.classList.add("border-t");

                        tr.innerHTML = `
                            <td class="px-4 py-2">${res.restaurante}</td>
                            <td class="px-4 py-2">${res.fecha}</td>
                            <td class="px-4 py-2">${res.hora}</td>
                            <td class="px-4 py-2">${res.personas}</td>
                            <td class="px-4 py-2 text-center">
                                <button data-id="${res.id_reservacion}" class="btnConfirmar bg-[#FF5800] hover:bg-orange-600 text-white px-3 py-1 rounded">
                                    Confirmar
                                </button>
                            </td>`;
                        tbody.appendChild(tr);
                    });
                })
                .catch(() => {
                    Swal.fire(
                        "Error",
                        "No se pudieron cargar las reservaciones.",
                        "error"
                    );
                });
        }
        tbody.addEventListener("click", async (e) => {
            if (e.target.matches(".btnConfirmar")) {
                const id = e.target.dataset.id;

                // Aquí agregas el console.log para depurar el id
                console.log("Confirmando reservación ID:", id);

                const { isConfirmed } = await Swal.fire({
                    title: "¿Confirmar asistencia?",
                    text: "Tu reservación cambiará a 'Confirmada'.",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, confirmar",
                    cancelButtonText: "Cancelar",
                });

                if (!isConfirmed) return;

                const res = await fetch("./php/confirmar_reservacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `id_reservacion=${encodeURIComponent(id)}`,
                });

                const json = await res.json();
                if (json?.exito) {
                    Swal.fire("¡Listo!", "Reservación confirmada.", "success");
                    cargarReservaciones(); // recargar lista
                } else {
                    Swal.fire("Error", json?.mensaje ?? "No se pudo confirmar.", "error");
                }
            }
        });
    }
});
