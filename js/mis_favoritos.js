document.addEventListener("DOMContentLoaded", () => {
    let id_usuario = null;
    const container = document.getElementById("cardsContainer");
    const nombreUsuario = document.getElementById("nombreUsuario");
    let map, markerUsuario;
    let markersFavoritos = [];

    // Inicializar mapa con vista por defecto (Veracruz)
    function inicializarMapa() {
        map = L.map("map").setView([19.195, -96.1348], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);
    }

    // Agrega marcadores de favoritos en mapa
    function agregarMarcadoresFavoritos(favoritos) {
        // Limpia marcadores previos
        markersFavoritos.forEach(m => map.removeLayer(m));
        markersFavoritos = [];

        favoritos.forEach(rest => {
            if (rest.lat && rest.lng) {
                const m = L.marker([rest.lat, rest.lng])
                    .addTo(map)
                    .bindPopup(`<b>${rest.nombre}</b><br>${rest.descripcion}<br>Distancia: ${rest.distancia.toFixed(2)} km`);
                markersFavoritos.push(m);
            }
        });
    }

    // Nueva función crearCard con diseño solicitado
    function crearCard(rest) {
        const iconClass = "fa-solid"; // siempre favorito aquí
        const colorClass = "text-red-600";
        const califHTML = rest.calificacion !== undefined
            ? `<p class="text-xs text-gray-400">Calificación: ${Number(rest.calificacion).toFixed(1)}</p>` : "";

        const distanciaHTML = rest.distancia !== undefined
            ? `<p class="text-xs text-gray-400">Distancia: ${rest.distancia.toFixed(2)} km</p>`
            : "";

        return `
        <div>
          <div class="div cursor-pointer shadow-[0px_4px_6px_0px_#aeafaf] h-[13em] w-[16em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
            <div class="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1]"></div>

            <!-- Botón favorito -->
            <button class="favorito-btn bg-white cursor-pointer w-9 rounded-full absolute top-2 right-2 ${colorClass} text-xl transition-colors duration-300"
                    data-id="${rest.id_restaurante}" aria-label="Favorito" title="Favorito">
                <i class="${iconClass} fa-heart"></i>
            </button>

            <button class="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#FF5800] group-hover:text-white duration-500">
              <span class="relative before:h-[0.16em] before:absolute before:content-[''] before:bg-[#FF5800] group-hover:before:bg-white duration-300 before:bottom-0 before:left-0">
                Más información
              </span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>

            <h1 class="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
              ${rest.nombre}
            </h1>

            <p class="text-sm text-gray-600 mt-1">${rest.descripcion}</p>

            ${distanciaHTML}
            ${califHTML}
          </div>
        </div>`;
    }

    // Carga favoritos con distancia, muestra en cards y mapa
    function cargarFavoritos(lat, lng) {
        container.innerHTML = "<p class='text-gray-500'>Cargando favoritos...</p>";

        fetch("./php/obtener_favoritos.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng })
        })
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    container.innerHTML = `<p>${data.error}</p>`;
                    return;
                }
                if (data.length === 0) {
                    container.innerHTML = "<p>No tienes favoritos aún.</p>";
                    return;
                }
                container.innerHTML = "";
                data.forEach(rest => {
                    container.innerHTML += crearCard(rest);
                });

                agregarMarcadoresFavoritos(data);
                agregarListenersQuitar();

                // Centrar mapa en la ubicación del usuario
                if (markerUsuario) markerUsuario.remove();
                markerUsuario = L.marker([lat, lng], { title: "Tu ubicación" }).addTo(map).bindPopup("Tu ubicación").openPopup();
                map.setView([lat, lng], 13);
            })
            .catch(() => (container.innerHTML = "<p>Error al cargar favoritos.</p>"));
    }

    // Botones para quitar favoritos
    function agregarListenersQuitar() {
        document.querySelectorAll(".favorito-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idRest = btn.getAttribute("data-id");
                fetch("./php/quitar_favorito.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_restaurante: idRest })
                })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Quitado',
                            text: 'Restaurante removido de favoritos',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        // Eliminar card visualmente
                        btn.closest("div.div").classList.add("animate__fadeOut");
                        setTimeout(() => btn.closest("div.div").remove(), 400);
                    } else {
                        Swal.fire("Error", res.error || "Error desconocido", "error");
                    }
                })
                .catch(() => {
                    Swal.fire("Error", "Error en la conexión", "error");
                });
            });
        });
    }

    // Para filtrar cards según texto en búsqueda
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll("#cardsContainer h1").forEach(h1 => {
            const card = h1.closest("div.div");
            const visible = h1.textContent.toLowerCase().includes(term);
            card.style.display = visible ? "block" : "none";
        });
    });

    // Variables para ubicación del usuario
    let latUser = null;
    let lngUser = null;

    // Inicialización general
    inicializarMapa();

    // Obtener usuario y cargar favoritos con ubicación
    fetch("./php/menu.php")
        .then(r => r.json())
        .then(data => {
            if (data.error) return location.href = "index.html";
            id_usuario = data.id_usuario;
            nombreUsuario.textContent = data.nombre;

            // Obtener ubicación
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        latUser = pos.coords.latitude;
                        lngUser = pos.coords.longitude;
                        cargarFavoritos(latUser, lngUser);
                    },
                    () => {
                        // Si falla, cargar sin ubicación (usar default Veracruz)
                        latUser = 19.195;
                        lngUser = -96.1348;
                        cargarFavoritos(latUser, lngUser);
                    }
                );
            } else {
                latUser = 19.195;
                lngUser = -96.1348;
                cargarFavoritos(latUser, lngUser);
            }
        });

        // Botones de navegación
    document.getElementById("botonInicio").addEventListener("click", () => {
        location.href = "menu.html"; // o la página de inicio correcta
    });

    document.getElementById("botonFavoritos").addEventListener("click", () => {
        location.href = "mis_favoritos.html"; // o la página donde estás mostrando favoritos
    });

    document.getElementById("botonReservaciones").addEventListener("click", () => {
        location.href = "reservaciones.html"; // asegúrate que esta página exista
    });

});
