//agrupo variables de input del formulario en un objeto
const inputUsuario = {
    nombre: document.getElementById("campoNombre"),
    apellido: document.getElementById("campoApellido"),
    email: document.getElementById("campoEmail"),
    tel: document.getElementById("campoTelefono"),
    mensaje: document.getElementById("campoMensaje"),
};

//función para manejar las entradas del usuario y la asignacion de valores al localStorage
function manejarEntradaUsuario(input, clave) {
    input.addEventListener("input", () => {
        localStorage.setItem(clave, input.value);
    });
}

manejarEntradaUsuario(inputUsuario.nombre, "campoNombre");
manejarEntradaUsuario(inputUsuario.apellido, "campoApellido");
manejarEntradaUsuario(inputUsuario.email, "campoEmail");
manejarEntradaUsuario(inputUsuario.tel, "campoTelefono");
manejarEntradaUsuario(inputUsuario.mensaje, "campoMensaje");


// Recuperamos los datos del storage
window.addEventListener("load", () => {
    inputUsuario.nombre.value = localStorage.getItem("campoNombre") || "";
    inputUsuario.apellido.value = localStorage.getItem("campoApellido") || "";
    inputUsuario.email.value = localStorage.getItem("campoEmail") || "";
    inputUsuario.tel.value = localStorage.getItem("campoTelefono") || "";
    inputUsuario.mensaje.value = localStorage.getItem("campoMensaje") || "";
});

// Preparamos los campos para enviarlos por mail y poder utilizarlos
function prepararCampos() {
    const nombre = inputUsuario.nombre.value;
    const apellido = inputUsuario.apellido.value;
    const email = inputUsuario.email.value;
    const tel = inputUsuario.tel.value;
    const mensaje = inputUsuario.mensaje.value;

    const cuerpoCorreo = `Nombre: ${nombre}\nApellido: ${apellido}\nEmail: ${email}\nTeléfono: ${tel}\nMensaje: ${mensaje}`;

    return cuerpoCorreo;
}

// BTN Enviar y envío de mail con la info del cliente a INDARG SRL
const btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener("click", () => {
    const cuerpoCorreo = prepararCampos();
    const url = `mailto:calasalde@gmail.com?subject=Formulario de contacto&body=${encodeURIComponent(cuerpoCorreo)}`;
    window.open(url);
});

// BTN Limpiar el formulario
const btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.addEventListener("click", () => {
    document.getElementById("formularioMaster").reset();
});