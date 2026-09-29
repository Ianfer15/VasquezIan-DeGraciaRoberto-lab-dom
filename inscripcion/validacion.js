const formulario = document.getElementById("inscripcion");
const confirmacion = document.getElementById("confirmacion");
const campoSede = document.getElementById("campo-sede");
const sede = document.getElementById("sede");
const contrasena = document.getElementById("contrasena");
const confirmarContrasena = document.getElementById("confirmarContrasena");
const fuerza = document.getElementById("fuerza");
const comentarios = document.getElementById("comentarios");
const contador = document.getElementById("contador");

const reglas = {
    nombre: {
        validar: valor => {
            const limpio = valor.trim();
            return limpio.length >= 5 &&
                limpio.length <= 60 &&
                /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'-]+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/.test(limpio);
        },
        mensaje: "Escribe tu nombre y apellido."
    },

    cedula: {
        validar: valor =>
            /^(?:[1-9]|1[0-3]|PE|E|N)-[0-9]{1,4}-[0-9]{1,6}$/i.test(valor.trim()),
        mensaje: "Usa el formato 8-123-4567."
    },

    correo: {
        validar: valor =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()),
        mensaje: "Usa un correo como nombre@dominio.com."
    },

    celular: {
        validar: valor =>
            /^(?:6\d{3}-?\d{4})$/.test(valor.trim()),
        mensaje: "El celular debe tener 8 dígitos y empezar con 6."
    },

    fechaNacimiento: {
        validar: valor => {
            if (!valor) return false;

            const fecha = new Date(valor + "T00:00:00");
            const hoy = new Date();

            if (fecha > hoy) return false;

            const limite = new Date();
            limite.setFullYear(limite.getFullYear() - 16);

            return fecha <= limite;
        },
        mensaje: "Debes tener al menos 16 años."
    },

    curso: {
        validar: valor => valor !== "",
        mensaje: "Elige un curso."
    },

    sede: {
        validar: valor => valor !== "",
        mensaje: "Elige una sede."
    },

    contrasena: {
        validar: valor =>
            valor.length >= 8 &&
            /[A-Z]/.test(valor) &&
            /[a-z]/.test(valor) &&
            /\d/.test(valor) &&
            /[^A-Za-z0-9]/.test(valor),
        mensaje: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
    },

    confirmarContrasena: {
        validar: valor => valor !== "" && valor === contrasena.value,
        mensaje: "Las contraseñas no coinciden."
    },

    comentarios: {
        validar: valor => valor.length <= 200,
        mensaje: "Máximo 200 caracteres."
    },

    terminos: {
        validar: valor => valor,
        mensaje: "Debes aceptar los términos."
    }
};

function obtenerElemento(nombre) {
    return document.getElementById(nombre);
}

function validarCampo(nombre) {
    const elemento = obtenerElemento(nombre);
    const regla = reglas[nombre];

    if (!elemento || !regla) return true;

    let valor;

    if (elemento.type === "checkbox") {
        valor = elemento.checked;
    } else {
        valor = elemento.value;
    }

    const valido = regla.validar(valor);
    const error = document.getElementById(`${nombre}-error`);

    if (error) {
        error.textContent = valido ? "" : regla.mensaje;
    }

    elemento.setAttribute("aria-invalid", String(!valido));
    elemento.classList.toggle("invalido", !valido);

    return valido;
}

function actualizarModalidad() {
    const modalidad = document.querySelector('input[name="modalidad"]:checked');
    const error = document.getElementById("modalidad-error");

    if (modalidad && modalidad.value === "presencial") {
        campoSede.hidden = false;
        sede.disabled = false;
        sede.setAttribute("aria-invalid", "false");
    } else {
        campoSede.hidden = true;
        sede.disabled = true;
        sede.value = "";
        sede.setAttribute("aria-invalid", "false");
        sede.classList.remove("invalido");
        document.getElementById("sede-error").textContent = "";
    }

    if (!modalidad) {
        error.textContent = "Elige una modalidad.";
        return false;
    }

    error.textContent = "";
    return true;
}

function actualizarFuerza() {
    const valor = contrasena.value;

    if (!valor) {
        fuerza.textContent = "Fuerza: —";
        return;
    }

    let puntos = 0;

    if (valor.length >= 8) puntos++;
    if (/[A-Z]/.test(valor)) puntos++;
    if (/[a-z]/.test(valor)) puntos++;
    if (/\d/.test(valor)) puntos++;
    if (/[^A-Za-z0-9]/.test(valor)) puntos++;

    if (puntos <= 2) {
        fuerza.textContent = "Fuerza: débil";
    } else if (puntos <= 4) {
        fuerza.textContent = "Fuerza: media";
    } else {
        fuerza.textContent = "Fuerza: fuerte";
    }
}

function actualizarContador() {
    const cantidad = comentarios.value.length;
    contador.textContent = `${cantidad} / 200`;
    contador.classList.toggle("limite", cantidad > 180);
}

function validarFormulario() {
    const campos = [
        "nombre",
        "cedula",
        "correo",
        "celular",
        "fechaNacimiento",
        "curso",
        "contrasena",
        "confirmarContrasena",
        "comentarios",
        "terminos"
    ];

    let primerError = null;
    let valido = true;

    campos.forEach(nombre => {
        if (!validarCampo(nombre)) {
            valido = false;
            if (!primerError) {
                primerError = obtenerElemento(nombre);
            }
        }
    });

    if (!actualizarModalidad()) {
        valido = false;
        if (!primerError) {
            primerError = document.querySelector('input[name="modalidad"]');
        }
    }

    if (!campoSede.hidden && !validarCampo("sede")) {
        valido = false;
        if (!primerError) {
            primerError = sede;
        }
    }

    if (primerError) {
        primerError.focus();
    }

    return valido;
}

function crearConfirmacion() {
    confirmacion.textContent = "";

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-confirmacion";

    const titulo = document.createElement("h2");
    titulo.textContent = "Inscripción realizada";

    const datos = [
        ["Nombre", document.getElementById("nombre").value],
        ["Cédula", document.getElementById("cedula").value],
        ["Correo", document.getElementById("correo").value],
        ["Celular", document.getElementById("celular").value],
        ["Fecha de nacimiento", document.getElementById("fechaNacimiento").value],
        ["Curso", document.getElementById("curso").value],
        ["Modalidad", document.querySelector('input[name="modalidad"]:checked').value],
        ["Sede", campoSede.hidden ? "No aplica" : sede.value],
        ["Comentarios", comentarios.value || "Sin comentarios"]
    ];

    tarjeta.appendChild(titulo);

    datos.forEach(([etiqueta, valor]) => {
        const parrafo = document.createElement("p");
        const fuerte = document.createElement("strong");

        fuerte.textContent = `${etiqueta}: `;
        parrafo.appendChild(fuerte);
        parrafo.appendChild(document.createTextNode(valor));

        tarjeta.appendChild(parrafo);
    });

    confirmacion.appendChild(tarjeta);
}

const campos = [
    "nombre",
    "cedula",
    "correo",
    "celular",
    "fechaNacimiento",
    "curso",
    "sede",
    "contrasena",
    "confirmarContrasena",
    "comentarios",
    "terminos"
];

campos.forEach(nombre => {
    const elemento = obtenerElemento(nombre);

    if (!elemento) return;

    elemento.addEventListener("blur", () => {
        if (nombre === "sede" && campoSede.hidden) return;
        validarCampo(nombre);
    });

    elemento.addEventListener("input", () => {
        if (nombre === "sede" && campoSede.hidden) return;
        validarCampo(nombre);

        if (nombre === "contrasena") {
            actualizarFuerza();
            validarCampo("confirmarContrasena");
        }
    });

    elemento.addEventListener("change", () => {
        if (nombre === "sede" && campoSede.hidden) return;
        validarCampo(nombre);
    });
});

document.querySelectorAll('input[name="modalidad"]').forEach(radio => {
    radio.addEventListener("change", () => {
        actualizarModalidad();
    });
});

comentarios.addEventListener("input", actualizarContador);

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    crearConfirmacion();
    formulario.reset();
    actualizarModalidad();
    actualizarFuerza();
    actualizarContador();

    campos.forEach(nombre => {
        const elemento = obtenerElemento(nombre);
        if (elemento) {
            elemento.setAttribute("aria-invalid", "false");
            elemento.classList.remove("invalido");
        }
    });
});
