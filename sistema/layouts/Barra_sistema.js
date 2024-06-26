function mensajeError(mensaje) {
    Swal.fire({
        position: "top-end",
        icon: "error",
        title: mensaje,
        showConfirmButton: false,
        timer: 3000
      });
}

function mensajeFunciono(mensaje) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: 3000
      });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if ($("#modalUsuario").css("display") == "block") {
            $("#modalUsuario").css("display", "none");
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    comprobarUsuario();
    obtenerUsuarioBarra();

    let barra = document.querySelector('.barra_sistema');
    let main = document.querySelector('main');
    let modal = document.querySelector('.modalUsuario');

    let barraAltura = parseFloat(barra.offsetHeight) + 5; 
    main.style.paddingTop = barraAltura + 'px';
    modal.style.paddingTop = barraAltura + 'px';
    comprobarUsuario();
});

window.addEventListener('pageshow', function(event) {
    comprobarUsuario();
});

function cerrarSesion() {
    let url = '/Controladores/conf_configuracion.php';
    let datosGenerales = {
        accion: "CONFCerrarSesion",
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGenerales)
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            window.location.href = "/Vistas/login.php";
        } else {
            alert("Error al Cerrar Sesión");
            return;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function comprobarUsuario() {
    let url = '/Controladores/conf_configuracion.php';
    let datosGenerales = {
        accion : "CONFComprobarUsuario",
    }

    fetch(url, {
        method: 'POST',
        headers: {  
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGenerales)
    })
    .then(response => response.json())
    .then(data => {
        if (!data) {
            window.open("/Vistas/login.php", "_self");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function obtenerUsuarioBarra() {
    let url = "/Controladores/log_login.php";

    let datosGenerales = {
        accion : "CONFObtenerUsuarioBarra"
    }

    fetch(url, {
        method: 'POST',
        headers: {  
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGenerales)
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            let usuario = data.nombre;
            if (data.apellidopaterno.length > 0) {
                usuario = usuario + " " + data.apellidopaterno;
            }
            if (data.apellidomaterno.length > 0) {
                usuario = usuario + " " + data.apellidomaterno;
            }
            document.getElementById("iconoUsuario").innerText = "   " + usuario;

            llenarModalUsuario(data);
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function abrirModalUsuario() {
    let modal = document.getElementById("modalUsuario");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}


function cerrarModalUsuario() {
    let nombre = $("#nombreUsuario").attr("nombre");
    let apellidoPaterno = $("#apellidoPaternoUsuario").attr("apellidoPaterno");
    let apellidoMaterno = $("#apellidoMaternoUsuario").attr("apellidoMaterno");
    let correo = $("#correoUsuario").attr("correo");
    let telefono = $("#telefonoUsuario").attr("telefono");
    let fechaNacimiento = $("#fechaUsuario").attr("fechaNacimiento");
    
    $("#nombreUsuario").val(nombre);
    $("#apellidoPaternoUsuario").val(apellidoPaterno);
    $("#apellidoMaternoUsuario").val(apellidoMaterno);
    $("#correoUsuario").val(correo);
    $("#telefonoUsuario").val(telefono);
    $("#fechaUsuario").val(fechaNacimiento);

    let modal = document.getElementById("modalUsuario");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

function llenarModalUsuario(usuario) {
    let nombre = usuario.nombre;
    let apellidoPaterno = usuario.apellidopaterno;
    let apellidoMaterno = usuario.apellidomaterno;
    let correo = usuario.email;
    let telefono = usuario.telefono;
    let fechaNacimiento = usuario.fechanacimiento;

    $("#nombreUsuario").val(nombre).attr("nombre", nombre);
    $("#apellidoPaternoUsuario").val(apellidoPaterno).attr("apellidoPaterno", apellidoPaterno);
    $("#apellidoMaternoUsuario").val(apellidoMaterno).attr("apellidoMaterno", apellidoMaterno);
    $("#correoUsuario").val(correo).attr("correo", correo);
    $("#telefonoUsuario").val(telefono).attr("telefono", telefono);

    if (fechaNacimiento != null) {
        // fechaNacimiento = fechaNacimiento.split("-").reverse().join("/");
        $("#fechaUsuario").val(fechaNacimiento).attr("fechaNacimiento", fechaNacimiento);
    } else {
        $("#fechaUsuario").val("").attr("fechaNacimiento", "");
    }
}

function guardarInformacionUsuarioModal() {
    let url = "/Controladores/log_login.php";
    let datosGenerales = prepararDatosGeneralesGuardarInformacionUsuarioModal();
    if (!datosGenerales) {
        mensajeError("Datos Invalidos");
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: {  
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGenerales)
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            setTimeout(() => {
                location.reload();
            }, 4000);
            mensajeFunciono("Usuario Modificado Correctamente");
        } else {
            mensajeError("Fallo al Modificar el Usuario");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepararDatosGeneralesGuardarInformacionUsuarioModal() {
    let nombre = $("#nombreUsuario").val();
    let apellidoPaterno = $("#apellidoPaternoUsuario").val();
    let apellidoMaterno = $("#apellidoMaternoUsuario").val();
    let correo = $("#correoUsuario").val();
    let telefono = $("#telefonoUsuario").val();
    let fechaNacimiento = $("#fechaUsuario").val();
    console.log(fechaNacimiento);

    let regexCorreo = /^(?=.*[a-z])(?=.*\d)(?=.*\.)(?=.*@)[A-Za-z\d.@]{8,}$/;
    let regexTelefono = /^\d{10}$/;
    let regexFecha = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!regexTelefono.test(telefono) || !regexFecha.test(fechaNacimiento) || !regexCorreo.test(correo)) {
    // if (!regexCorreo.test(correo) || !regexTelefono.test(telefono)) {
        return false;
    }

    // fechaNacimiento = fechaNacimiento.split("/").reverse().join("-")

    let datosGenerales = {
        accion : "CONFGuardarInformacionUsuarioModal",
        apellidoPaterno : apellidoPaterno,
        apellidoMaterno : apellidoMaterno,
        correo : correo,
        nombre : nombre,
        telefono : telefono,
        fechaNacimiento : fechaNacimiento,
    }

    return datosGenerales;
}



