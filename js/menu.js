document.addEventListener("DOMContentLoaded", () => {
    let id_usuario = null; // guardaremos aquí el id usuario para usarlo después

    const nombreUsuario = document.getElementById("nombreUsuario");

    fetch("./php/menu.php")
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                window.location.href = "index.html";
            } else {
                nombreUsuario.textContent = data.nombre;
                id_usuario = data.id_usuario;
                console.log("ID del usuario:", id_usuario);
                // Aquí puedes llamar a la función para cargar restaurantes
                // Por ejemplo: categoryButtons[0].click(); (como en tu código)
            }
        })
        .catch((err) => {
            console.error("Error al obtener los datos:", err);
        });

    const container = document.getElementById("cardsContainer");
    const map = L.map("map").setView([19.195, -96.1348], 13); // Veracruz default

    // Mapa base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker = null;

    // Función para generar la card de restaurante con botón de favorito
    // Función para generar la card de restaurante con botón de favorito
    function crearCard(rest) {
        // Si PHP devuelve 1 / 0 en vez de true/false, conviértelo con !!
        const esFavorito = !!rest.tiene_favorito;

        // Icono y color según favorito
        const iconClass = esFavorito ? "fa-solid" : "fa-regular";
        const colorClass = esFavorito ? "text-red-600" : "text-black";

        // --- NUEVO: línea de distancia solo si existe ---
        const distanciaHTML =
            rest.distancia !== undefined
                ? `<p class="text-xs text-gray-400">Distancia: ${parseFloat(
                    rest.distancia
                ).toFixed(2)} km</p>`
                : "";

        // --- NUEVO: línea de calificación solo si existe (útil para “más valorados”) ---
        const califHTML =
            rest.calificacion !== undefined
                ? `<p class="text-xs text-gray-400">Calificación: ${Number(
                    rest.calificacion
                ).toFixed(1)}</p>`
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

<button class="info-btn text-[0.8em] absolute bottom-[1em] left-[1em] text-[#FF5800] group-hover:text-white duration-500"
        data-id="${rest.id_restaurante}">
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

    // Función para agregar listeners a botones favorito
    function agregarListenersFavorito() {
        const botones = document.querySelectorAll(".favorito-btn");
        botones.forEach((btn) => {
            btn.addEventListener("click", () => {
                event.stopPropagation();
                if (!id_usuario) {
                    Swal.fire("Error", "No se ha identificado al usuario.", "error");
                    return;
                }

                const idRest = btn.getAttribute("data-id");
                const icono = btn.querySelector("i"); // 👉 Aquí lo agregas
                const estaFavorito = btn.classList.contains("text-red-600");

                if (estaFavorito) {
                    // ➖ Quitar favorito
                    fetch("./php/quitar_favorito.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_restaurante: idRest }),
                    })
                        .then((r) => r.json())
                        .then((res) => {
                            if (res.success) {
                                btn.classList.remove("text-red-600");
                                btn.classList.add("text-black");
                                icono.classList.remove("fa-solid");
                                icono.classList.add("fa-regular");
                                Swal.fire("Quitado", "Restaurante removido de favoritos", "success");
                            } else {
                                Swal.fire("Error", res.error || "Error desconocido", "error");
                            }
                        })
                        .catch(() => {
                            Swal.fire("Error", "Error en la conexión", "error");
                        });
                } else {
                    // ➕ Agregar favorito
                    fetch("./php/agregar_favorito.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_restaurante: idRest }),
                    })
                        .then((r) => r.json())
                        .then((res) => {
                            if (res.success) {
                                btn.classList.remove("text-black");
                                btn.classList.add("text-red-600");
                                icono.classList.remove("fa-regular");
                                icono.classList.add("fa-solid");
                                Swal.fire("Agregado", "Restaurante agregado a favoritos", "success");
                            } else {
                                Swal.fire("Error", res.error || "Error desconocido", "error");
                            }
                        })
                        .catch(() => {
                            Swal.fire("Error", "Error en la conexión", "error");
                        });
                }
            });
        });
    }


    // --- listeners para botón "Más información" y para hacer clic en la card ---
    function agregarListenersInfo() {
        // Botón “Más información”
        document.querySelectorAll(".info-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                location.href = `detalle_restaurante.html?id=${btn.dataset.id}`;
            });
        });

        // Click en toda la card
        document.querySelectorAll(".div").forEach(card => {
            const btn = card.querySelector(".info-btn");
            if (!btn) return;                       // ← evita null
            const id = btn.dataset.id;
            card.addEventListener("click", () => {
                location.href = `detalle_restaurante.html?id=${id}`;
            });
        });
    }



    // Modificar función cargarRestaurantes para usar crearCard
    function cargarRestaurantes(lat, lng) {
        container.innerHTML =
            "<p class='text-gray-500'>Cargando restaurantes cercanos...</p>";

        fetch("./php/obtener_restaurantes_cercanos.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng }),
        })
            .then((r) => r.text())
            .then((textoCrudo) => {
                let data;
                try {
                    data = JSON.parse(textoCrudo);
                } catch (e) {
                    container.innerHTML = "<p>Error: formato de respuesta inválido.</p>";
                    throw e;
                }

                container.innerHTML = "";

                if (data.error) {
                    container.innerHTML = `<p>Error: ${data.error}</p>`;
                    return;
                }
                if (data.length === 0) {
                    container.innerHTML =
                        "<p>No se encontraron restaurantes cercanos.</p>";
                    return;
                }

                data.forEach((rest) => {
                    container.innerHTML += crearCard(rest);
                });

                agregarListenersFavorito();
                agregarListenersInfo();
            })
            .catch((err) => {
                container.innerHTML = "<p>Error al obtener restaurantes.</p>";
            });

    }

    // Modificar función cargarMasValorados para usar crearCard (sin distancia)
    function cargarMasValorados() {
        container.innerHTML =
            "<p class='text-gray-500'>Cargando restaurantes más valorados...</p>";

        fetch("./php/obtener_restaurantes_mas_valorados.php")
            .then((r) => r.text())
            .then((textoCrudo) => {
                let data;
                try {
                    data = JSON.parse(textoCrudo);
                } catch (e) {
                    container.innerHTML = "<p>Error: formato de respuesta inválido.</p>";
                    throw e;
                }

                if (data.error) {
                    container.innerHTML = `<p>Error: ${data.error}</p>`;
                    return;
                }
                if (data.length === 0) {
                    container.innerHTML = "<p>No se encontraron restaurantes.</p>";
                    return;
                }

                container.innerHTML = "";

                data.forEach((rest) => {
                    // En esta consulta también enviar el campo tiene_favorito
                    container.innerHTML += crearCard(rest);
                });

                agregarListenersFavorito();
                agregarListenersInfo();
            })
            .catch((err) => {
                container.innerHTML = "<p>Error al obtener restaurantes.</p>";
            });
    }

    // --- NUEVA FUNCIÓN: listar todos los restaurantes ---
    function cargarTodosRestaurantes() {
        container.innerHTML =
            "<p class='text-gray-500'>Cargando todos los restaurantes...</p>";

        fetch("./php/obtener_todos_restaurantes.php")
            .then((r) => r.text())
            .then((textoCrudo) => {
                let data;
                try {
                    data = JSON.parse(textoCrudo);
                } catch (e) {
                    container.innerHTML = "<p>Error: formato de respuesta inválido.</p>";
                    throw e;
                }

                if (data.error) {
                    container.innerHTML = `<p>Error: ${data.error}</p>`;
                    return;
                }
                if (data.length === 0) {
                    container.innerHTML = "<p>No hay restaurantes registrados.</p>";
                    return;
                }

                container.innerHTML = "";
                data.forEach((rest) => {
                    container.innerHTML += crearCard(rest);
                });
                agregarListenersFavorito();
                agregarListenersInfo();
            })
            .catch(() => {
                container.innerHTML = "<p>Error al obtener restaurantes.</p>";
            });
    }

    // Función para buscar restaurantes por texto (nombre o descripción)
    const searchInput = document.getElementById("searchInput");
    let searchTimeout = null;

    function buscarRestaurantes(query) {
        container.innerHTML =
            "<p class='text-gray-500'>Buscando restaurantes...</p>";

        fetch("./php/buscar_restaurantes.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        })
            .then((r) => r.text())
            .then((textoCrudo) => {
                let data;
                try {
                    data = JSON.parse(textoCrudo);
                } catch (e) {
                    container.innerHTML = "<p>Error: formato de respuesta inválido.</p>";
                    throw e;
                }

                container.innerHTML = "";

                if (data.error) {
                    container.innerHTML = `<p>Error: ${data.error}</p>`;
                    return;
                }
                if (data.length === 0) {
                    container.innerHTML =
                        "<p>No se encontraron restaurantes para esa búsqueda.</p>";
                    return;
                }

                data.forEach(rest => {
                    const esFavorito = !!rest.tiene_favorito; // Convierte a booleano

                    const iconClass = esFavorito ? "fa-solid" : "fa-regular";
                    const colorClass = esFavorito ? "text-red-600" : "text-gray-500";

                    container.innerHTML += `
      <div>
        <div class="div cursor-pointer shadow-[0px_4px_6px_0px_#aeafaf] h-[13em] w-[16em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
          <div class="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1]"></div>

          <!-- Botón favorito -->
          <button class="favorito-btn bg-white cursor-pointer w-9 rounded-full absolute top-2 right-2 ${colorClass} text-xl transition-colors duration-300"
                  data-id="${rest.id_restaurante}" aria-label="Favorito" title="Favorito">
              <i class="${iconClass} fa-heart"></i>
          </button>

          <!-- botón MÁS INFORMACIÓN -->
          <button class="info-btn text-[0.8em] absolute bottom-[1em] left-[1em] text-[#FF5800] group-hover:text-white duration-500"
                  data-id="${rest.id_restaurante}">
            <span class="relative before:h-[0.16em] before:absolute before:content-[''] before:bg-[#FF5800] group-hover:before:bg-white duration-300 before:bottom-0 before:left-0">
              Más información
            </span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <h1 class="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">${rest.nombre}</h1>
          <p class="text-sm text-gray-600 mt-1">${rest.descripcion}</p>
        </div>
      </div>`;
                });


                agregarListenersInfo();
                agregarListenersFavorito?.();

            })
            .catch((err) => {
                alert("Error al buscar restaurantes: " + err);
                // Mostrar mensaje de error en el contenedor   

                container.innerHTML = "<p>Error al buscar restaurantes.</p>";
            });
    }

    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim();

            if (query.length === 0) {
                // Si está vacío, mostrar la categoría activa o la de "Cerca"
                const activeButton = [...categoryButtons].find(
                    (btn) => btn.querySelector("span").style.width === "100%"
                );
                if (activeButton) {
                    activeButton.click();
                }
                return;
            }

            buscarRestaurantes(query);
        }, 500);
    });

    // Geolocalización automática
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;

                map.setView([lat, lng], 14);
                if (marker) marker.remove();
                marker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("Tu ubicación actual")
                    .openPopup();

                cargarRestaurantes(lat, lng);
            },
            (err) => {
                alert(
                    `⚠️ Geolocalización falló (${err.code}): ${err.message}\nSelecciona punto en el mapa.`
                );
            }
        );
    }

    // Click manual en el mapa
    map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        if (marker) marker.remove();
        marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Ubicación seleccionada")
            .openPopup();

        cargarRestaurantes(lat, lng);
    });

    // Manejo de botones de categoría
    const categoryButtons = document.querySelectorAll(
        "#categoryButtons .category-btn"
    );

    function activarSubrayado(buttonActivo) {
        categoryButtons.forEach((btn) => {
            const span = btn.querySelector("span");
            if (btn === buttonActivo) {
                span.style.width = "100%";
            } else {
                span.style.width = "0";
            }
        });
    }

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activarSubrayado(button);

            const texto = button.textContent.trim();

            if (texto === "Cerca") {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords;
                            cargarRestaurantes(latitude, longitude);
                            map.setView([latitude, longitude], 14);
                        },
                        () => {
                            container.innerHTML =
                                "<p>Activa la geolocalización para ver restaurantes cercanos.</p>";
                        }
                    );
                } else {
                    container.innerHTML =
                        "<p>Tu navegador no soporta geolocalización.</p>";
                }
            } else if (texto === "Mas valorados") {
                cargarMasValorados();
            } else if (texto === "Todos los restaurantes") {
                cargarTodosRestaurantes();
            }
        });
    });

    // Activar "Cerca" por defecto
    if (categoryButtons.length > 0) {
        categoryButtons[0].click();
    }

    const botonFavoritos = document.getElementById("botonFavoritos");
    if (botonFavoritos) {
        botonFavoritos.addEventListener("click", () => {
            window.location.href = "mis_favoritos.html";
        });
    }
    const botonReservaciones = document.getElementById("botonReservaciones");
    if (botonReservaciones) {
        botonReservaciones.addEventListener("click", () => {
            window.location.href = "reservaciones.html";
        });
    }
    const botonInicio = document.getElementById("botonInicio");
    if (botonInicio) {
        botonInicio.addEventListener("click", () => {
            window.location.href = "menu.html";
        });
    }

btnCerrarSesion.addEventListener("click", async () => {
    try {
        const response = await fetch("./php/logout.php");
        // Redirigir después de que el logout se complete
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        window.location.href = "index.html"; // Redirigir de todos modos
    }
});

//     document.getElementById("btnCerrarSesion").addEventListener("click", () => {
//   // Puedes hacer una petición fetch o simplemente redirigir
//   window.location.href = "./php/logout.php";
// });

});
