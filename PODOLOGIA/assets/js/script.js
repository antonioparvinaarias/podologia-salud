document.addEventListener("DOMContentLoaded", function () {

    /* MENÚ */

    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", function () {
            const abierto = menu.classList.toggle("mostrar");

            menuBtn.setAttribute("aria-expanded", String(abierto));
            menuBtn.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú" : "Abrir menú"
            );
        });

        menu.querySelectorAll("a").forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                menu.classList.remove("mostrar");
                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.setAttribute("aria-label", "Abrir menú");
            });
        });
    }

    /* ANIMACIONES */

    const elementos = document.querySelectorAll(".revelar");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        elementos.forEach(function (elemento) {
            observador.observe(elemento);
        });
    } else {
        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });
    }

    /* AÑO */

    const anio = document.getElementById("anio");

    if (anio) {
        anio.textContent = new Date().getFullYear();
    }

    /* MENSAJES */

    const mensaje = document.getElementById("mensaje");

    function mostrarMensaje(texto, tipo) {
        if (!mensaje) return;

        mensaje.textContent = texto;
        mensaje.hidden = false;
        mensaje.classList.remove("mensaje-exito", "mensaje-error");
        mensaje.classList.add(tipo || "mensaje-exito");
    }

    /* FORMULARIO DE CITAS */

    const formularioCita =
        document.getElementById("formularioCita") ||
        document.getElementById("formulario-cita");

    if (formularioCita) {
        formularioCita.addEventListener("submit", function (evento) {
            evento.preventDefault();

            mostrarMensaje(
                "Tu solicitud de cita fue enviada correctamente.",
                "mensaje-exito"
            );

            formularioCita.reset();
        });
    }

    /* FORMULARIO DE CONTACTO */

    const formularioContacto =
        document.getElementById("formularioContacto") ||
        document.getElementById("formulario-contacto");

    if (formularioContacto) {
        formularioContacto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            mostrarMensaje(
                "Tu mensaje fue enviado correctamente.",
                "mensaje-exito"
            );

            formularioContacto.reset();
        });
    }

    /* FECHA MÍNIMA */

    const campoFecha = document.getElementById("fecha");

    if (campoFecha) {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        campoFecha.min = `${año}-${mes}-${dia}`;
    }

    /* CARRUSEL */

    const pista =
        document.getElementById("pistaCarrusel") ||
        document.getElementById("pista");

    const botonAnterior = document.getElementById("anterior");
    const botonSiguiente = document.getElementById("siguiente");

    if (!pista || !botonAnterior || !botonSiguiente) {
        console.warn("No se encontraron los elementos del carrusel.");
        return;
    }

    const slides = pista.querySelectorAll(".profesional");
    const indicadores = document.querySelectorAll(".indicador");

    if (slides.length === 0) {
        console.warn("No hay elementos con la clase .profesional.");
        return;
    }

    let slideActual = 0;
    let intervaloCarrusel = null;

    function actualizarIndicadores() {
        indicadores.forEach(function (indicador, indice) {
            indicador.classList.toggle(
                "activo",
                indice === slideActual
            );

            indicador.setAttribute(
                "aria-current",
                indice === slideActual ? "true" : "false"
            );
        });
    }

    function mostrarSlide(indice) {
        slideActual = (indice + slides.length) % slides.length;

        pista.style.transform =
            "translateX(-" + (slideActual * 100) + "%)";

        actualizarIndicadores();
    }

    function iniciarCarrusel() {
        if (slides.length <= 1) return;

        clearInterval(intervaloCarrusel);

        intervaloCarrusel = setInterval(function () {
            mostrarSlide(slideActual + 1);
        }, 6000);
    }

    function reiniciarCarrusel() {
        iniciarCarrusel();
    }

    botonSiguiente.addEventListener("click", function () {
        mostrarSlide(slideActual + 1);
        reiniciarCarrusel();
    });

    botonAnterior.addEventListener("click", function () {
        mostrarSlide(slideActual - 1);
        reiniciarCarrusel();
    });

    indicadores.forEach(function (indicador, indice) {
        indicador.addEventListener("click", function () {
            mostrarSlide(indice);
            reiniciarCarrusel();
        });
    });

    /* DESLIZAMIENTO EN CELULARES */

    let inicioToque = 0;

    pista.addEventListener("touchstart", function (evento) {
        inicioToque = evento.touches[0].clientX;
    }, { passive: true });

    pista.addEventListener("touchend", function (evento) {
        const finalToque = evento.changedTouches[0].clientX;
        const diferencia = inicioToque - finalToque;

        if (Math.abs(diferencia) > 50) {
            mostrarSlide(
                diferencia > 0
                    ? slideActual + 1
                    : slideActual - 1
            );

            reiniciarCarrusel();
        }
    }, { passive: true });

    /* PAUSAR AL PASAR EL CURSOR */

    pista.addEventListener("mouseenter", function () {
        clearInterval(intervaloCarrusel);
    });

    pista.addEventListener("mouseleave", function () {
        iniciarCarrusel();
    });

    mostrarSlide(0);
    iniciarCarrusel();
});