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
     * 2)  Comprobamos que venga ?id=XX en la URL
     *-----------------------------------------------------------*/
    const params = new URLSearchParams(location.search);
    const idRestaurante = params.get("id");

    if (!idRestaurante) {
        Swal.fire("Error", "Restaurante no especificado.", "error").then(() =>
            history.back()
        );
        return;
    }

    /*------------------------------------------------------------
     * 3)  Referencias a elementos del DOM
     *-----------------------------------------------------------*/
    const hNombre = document.getElementById("nombreRest");
    const pDesc = document.getElementById("descripcionRest");
    const divInfo = document.getElementById("infoExtra");
    const imgPrincipal = document.getElementById("imagenPrincipal");
    const contenedorMiniaturas = document.getElementById("contenedorMiniaturas");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const horariosGrid = document.getElementById("horariosGrid");

    // Nuevas referencias para el sistema de reservaciones
    const formReservacion = document.getElementById("formReservacion");
    const selectPersonas = document.getElementById("personas");
    const inputFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");
    const idRestauranteInput = document.getElementById("idRestaurante");

    // Variables para controlar la galería
    let imagenes = [];
    let imagenActual = 0;

    /*------------------------------------------------------------
     * 4)  Configuración inicial del formulario de reservación
     *-----------------------------------------------------------*/
    // Configurar fecha mínima (hoy)
    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.min = hoy;

    // Horarios disponibles (puedes obtenerlos de la BD si varían por restaurante)
    const horariosDisponibles = [
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
    ];

    // Llenar select de horas
    horariosDisponibles.forEach((hora) => {
        const option = document.createElement("option");
        option.value = hora + ":00"; // Formato HH:MM:SS
        option.textContent = hora;
        selectHora.appendChild(option);
    });

    /*------------------------------------------------------------
     * 5)  Petición: detalle del restaurante
     *-----------------------------------------------------------*/
    fetch("./php/obtener_detalle_restaurante.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_restaurante: idRestaurante }),
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.error) throw new Error(data.error);

            // Título, descripción y datos extra
            hNombre.textContent = data.nombre;
            pDesc.textContent = data.descripcion ?? "";
            divInfo.innerHTML = `
                <p><b>Calificación:</b> ${data.calificacion ?? "N/A"}</p>
                <p><b>Rango de precio:</b> $${data.precio_min} – $${data.precio_max
                }</p>
                <p><b>Dirección:</b> ${data.direccion}</p>
                <p><b>Teléfono:</b> ${data.telefono}</p>
            `;

            // Configurar el ID del restaurante en el formulario
            idRestauranteInput.value = idRestaurante;

            /*----------------------------------------
             *  Mapa ↴
             *---------------------------------------*/
            if (data.lat && data.lng) {
                const map = L.map("mapDetalle").setView([+data.lat, +data.lng], 15);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap · Leaflet",
                }).addTo(map);

                L.marker([+data.lat, +data.lng])
                    .addTo(map)
                    .bindPopup(data.nombre)
                    .openPopup();

                const direccionMapa = document.getElementById("direccionMapa");
                if (direccionMapa && data.direccion) {
                    direccionMapa.textContent = data.direccion;
                }
            }

            /*----------------------------------------
             * 6)  Ahora pedimos las imágenes y horarios
             *---------------------------------------*/
            return Promise.all([
                fetch("./php/obtener_imagenes_restaurante.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_restaurante: idRestaurante }),
                }),
                fetch("./php/obtener_horarios_restaurante.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_restaurante: idRestaurante }),
                }),
            ]);
        })
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        .then(([imagenesData, horariosData]) => {
            /* `imagenes` → array de objetos:
             * [{url_imagen, descripcion_imagen, es_principal}, ...]
             */
            if (!Array.isArray(imagenesData) || imagenesData.length === 0) {
                imgPrincipal.src =
                    "https://via.placeholder.com/800x500?text=Sin+imágenes+disponibles";
                imgPrincipal.alt = "Sin imágenes disponibles";
            } else {
                // Guardamos las imágenes en la variable global
                imagenes = imagenesData;

                // Ordenamos para que la principal esté primero
                imagenes.sort((a, b) => (b.es_principal ?? 0) - (a.es_principal ?? 0));

                // Mostrar la primera imagen como principal
                mostrarImagenPrincipal(0);

                // Crear miniaturas
                crearMiniaturas();

                // Mostrar flechas si hay más de una imagen
                if (imagenes.length > 1) {
                    btnAnterior.classList.remove("hidden");
                    btnSiguiente.classList.remove("hidden");
                }

                // Event listeners para las flechas
                btnAnterior.addEventListener("click", () => {
                    imagenActual = (imagenActual - 1 + imagenes.length) % imagenes.length;
                    mostrarImagenPrincipal(imagenActual);
                    actualizarMiniaturaActiva();
                });

                btnSiguiente.addEventListener("click", () => {
                    imagenActual = (imagenActual + 1) % imagenes.length;
                    mostrarImagenPrincipal(imagenActual);
                    actualizarMiniaturaActiva();
                });
            }

            /*----------------------------------------
             * 7)  Mostrar horarios
             *---------------------------------------*/
            /* Mostrar horarios */
            console.log("Datos de horarios recibidos:", JSON.stringify(horariosData));
            if (!horariosData || !Array.isArray(horariosData)) {
                console.error("Datos de horarios inválidos:", horariosData);
                if (horariosGrid) {
                    horariosGrid.innerHTML =
                        '<p class="text-red-500">Horarios no disponibles</p>';
                }
                return;
            }

            if (horariosGrid) {
                mostrarHorarios(horariosData);
            } else {
                // alert.error("Elemento horariosGrid no encontrado");
            }
        })
        .catch((err) => {
            console.error(err);
            Swal.fire(
                "Error",
                err.message || "No se pudo cargar la información.",
                "error"
            );
        });

    /*------------------------------------------------------------
     * 8)  Manejar envío del formulario de reservación
     *-----------------------------------------------------------*/
    formReservacion.addEventListener("submit", function (e) {
        e.preventDefault();

        // Verificar si el usuario está logueado
        fetch("./php/obtener_usuario.php")
            .then((res) => res.json())
            .then((usuario) => {
                if (!usuario || !usuario.id_usuario) {
                    throw new Error("Debes iniciar sesión para hacer una reservación");
                }

                const datosReservacion = {
                    id_usuario: usuario.id_usuario,
                    id_restaurante: idRestauranteInput.value,
                    fecha_reservacion: inputFecha.value,
                    hora_reservacion: selectHora.value,
                    cantidad_personas: selectPersonas.value,
                };

                return fetch("./php/crear_reservacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosReservacion),
                });
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);

                Swal.fire({
                    title: "¡Reservación exitosa!",
                    text: `Tu reservación para ${selectPersonas.value
                        } personas el ${formatearFecha(
                            inputFecha.value
                        )} a las ${selectHora.value.slice(0, 5)} ha sido confirmada.`,
                    icon: "success",
                    confirmButtonColor: "#FF5800",
                });
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    title: "Error",
                    text: err.message || "No se pudo completar la reservación",
                    icon: "error",
                    confirmButtonColor: "#FF5800",
                });
            });
    });

    /*------------------------------------------------------------
     * Funciones auxiliares
     *-----------------------------------------------------------*/

    // Función para mostrar la imagen principal
    function mostrarImagenPrincipal(index) {
        const img = imagenes[index];
        imgPrincipal.src = img.url_imagen;
        imgPrincipal.alt = img.descripcion_imagen || "Imagen del restaurante";
        imagenActual = index;
    }

    // Función para crear las miniaturas
    function crearMiniaturas() {
        if (!contenedorMiniaturas) {
            console.error("El contenedor de miniaturas no fue encontrado en el DOM");
            return;
        }

        contenedorMiniaturas.innerHTML = "";

        imagenes.forEach((img, index) => {
            const miniatura = document.createElement("img");
            miniatura.src = img.url_imagen;
            miniatura.alt = img.descripcion_imagen || `Imagen ${index + 1}`;
            miniatura.className =
                "w-full h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-[#FF5800] transition";

            if (index === 0) {
                miniatura.classList.add("border-blue-500", "border-2");
            }

            miniatura.addEventListener("click", () => {
                mostrarImagenPrincipal(index);
                actualizarMiniaturaActiva();
            });

            contenedorMiniaturas.appendChild(miniatura);
        });
    }

    // Función para actualizar la miniatura activa
    function actualizarMiniaturaActiva() {
        const miniaturas = contenedorMiniaturas.querySelectorAll("img");
        miniaturas.forEach((miniatura, index) => {
            if (index === imagenActual) {
                miniatura.classList.add("border-blue-500", "border-2");
            } else {
                miniatura.classList.remove("border-blue-500", "border-2");
            }
        });
    }

    // Función para formatear fecha (DD/MM/YYYY)
    function formatearFecha(fechaISO) {
        const [year, month, day] = fechaISO.split("-");
        return `${day}/${month}/${year}`;
    }

    // Función para mostrar horarios en formato de tabla como en la imagen
    function mostrarHorarios(horarios) {
        if (!horariosGrid) {
            console.error("El contenedor de horarios no fue encontrado");
            return;
        }

        // Verificar y corregir datos incompletos
        const horariosCorregidos = horarios.map((h) => ({
            dia_semana: h.dia_semana,
            apertura: h.apertura || "00:00",
            cierre: h.cierre && h.cierre.length >= 5 ? h.cierre : "00:00",
        }));

        // Convertir a objeto por día
        const horariosPorDia = {};
        horariosCorregidos.forEach((h) => {
            horariosPorDia[h.dia_semana] = `${h.apertura} - ${h.cierre}`;
        });

        const paresDias = [
            ["Domingo", "Jueves"],
            ["Lunes", "Viernes"],
            ["Martes", "Sábado"],
            ["Miércoles", ""],
        ];

        let html = "";
        paresDias.forEach((par) => {
            html += '<div class="grid grid-cols-2 gap-x-4 mb-2">';
            par.forEach((dia) => {
                if (dia) {
                    html += `
                    <div class="flex justify-between">
                        <span class="font-medium">${dia}</span>
                        <span>${horariosPorDia[dia] || "Cerrado"}</span>
                    </div>
                `;
                } else {
                    html += "<div></div>";
                }
            });
            html += "</div>";
        });

        horariosGrid.innerHTML = html;
    }

    // Botones de navegación
    document.getElementById("botonInicio").addEventListener("click", () => {
        location.href = "menu.html"; // o la página de inicio correcta
    });

    document.getElementById("botonFavoritos").addEventListener("click", () => {
        location.href = "mis_favoritos.html"; // o la página donde estás mostrando favoritos
    });

    document
        .getElementById("botonReservaciones")
        .addEventListener("click", () => {
            location.href = "reservaciones.html"; // asegúrate que esta página exista
        });

    /*------------------------------------------------------------
     * 9)  Mostrar y enviar reseñas
     *-----------------------------------------------------------*/

    const estrellas = document.querySelectorAll("#formResena .rating i");
    const califInput = document.getElementById("calificacion");
    const formResena = document.getElementById("formResena");
    const resenasBox = document.getElementById("resenasContainer");
    const idRest = idRestaurante; // ya lo tienes de la URL

    let currentRating = 0;

    estrellas.forEach((star) => {
        star.addEventListener("mouseover", () => pintar(star.dataset.rating));
        star.addEventListener("mouseout", () => pintar(currentRating));
        star.addEventListener("click", () => {
            currentRating = star.dataset.rating;
            califInput.value = currentRating;
            pintar(currentRating);
        });
    });

    const pintar = (rating) => {
        estrellas.forEach((star) => {
            star.classList.toggle("text-yellow-400", star.dataset.rating <= rating);
            star.classList.toggle("text-gray-300", star.dataset.rating > rating);
        });
    };

    const cargarResenas = () => {
        // alert("PIDO reseñas para ID = " + idRest);

        fetch(`./php/obtener_resenas.php?id_restaurante=${idRest}`)
            .then((r) => r.text()) // ① lee como texto
            .then((txt) => {
                // alert("RAW desde PHP:\n" + txt); // ② muestra lo que llegó

                let lista;
                try {
                    lista = JSON.parse(txt); // ③ intenta convertir a JSON
                } catch (e) {
                    // alert("JSON inválido: " + e.message);
                    resenasBox.innerHTML =
                        '<p class="text-red-500">Respuesta JSON inválida.</p>';
                    return;
                }

                resenasBox.innerHTML = "";
                if (!lista.length) {
                    resenasBox.innerHTML =
                        '<p class="text-gray-500">Sé el primero en reseñar este lugar.</p>';
                    return;
                }
                lista.forEach((r) => resenasBox.appendChild(card(r)));
            })
            .catch((err) => {
                // alert("Fallo fetch: " + err);
                resenasBox.innerHTML =
                    '<p class="text-red-500">No se pudieron cargar las reseñas.</p>';
            });
    };

    const card = ({ usuario, calificacion, comentario, fecha_publicacion }) => {
        const div = document.createElement("div");
        div.className = "border-b py-4";
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <h4 class="font-semibold">${usuario}</h4>
                <div>${renderStars(calificacion)}</div>
            </div>
            <p class="text-sm text-gray-600">${new Date(
            fecha_publicacion
        ).toLocaleDateString()}</p>
            <p class="mt-2">${comentario}</p>`;
        return div;
    };

    const renderStars = (rating) => {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            html += `<i class="fas fa-star ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                } mr-1"></i>`;
        }
        return html;
    };

    formResena.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentRating == 0) {
            Swal.fire("Error", "Selecciona una calificación", "warning");
            return;
        }

        // Obtener usuario primero
        fetch("./php/obtener_usuario.php")
            .then((res) => res.json())
            .then((usuario) => {
                if (!usuario || !usuario.id_usuario) {
                    throw new Error("Debes iniciar sesión para dejar una reseña");
                }

                const data = {
                    id_restaurante: idRest,
                    id_usuario: usuario.id_usuario, // Añadir ID de usuario
                    calificacion: currentRating,
                    comentario: document.getElementById("comentario").value.trim(),
                };

                return fetch("./php/insertar_resena.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    Swal.fire("¡Éxito!", "Tu reseña ha sido guardada", "success");
                    formResena.reset();
                    currentRating = 0;
                    pintar(0);
                    cargarResenas();
                } else {
                    throw new Error(r.error || "Error al guardar");
                }
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
                console.error("Error al guardar reseña:", err);
            });
    });

    cargarResenas(); // Llama al inicio
});
