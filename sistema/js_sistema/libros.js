let url = '/Controladores/conf_configuracion.php';

$('#tablaLibros').DataTable({
    paging: true,        // Activa la paginación
    pageLength : 10,
    lengthChange : false,
    searching: true,     // Activa el cuadro de búsqueda
    ordering: true,      // Activa el ordenamiento de columnas
    info: true,         // Muestra información sobre la tabla
    columnDefs: [
        {"width": "5%", "targets": 0},
        {"width": "15%", "targets": 1},
        {"width": "15%", "targets": 2},
        {"width": "15%", "targets": 3},
        {"width": "10%", "targets": 4},
        {"width": "15%", "targets": 5},
        {"width": "10%", "targets": 6},
        {"width": "10%", "targets": 7},
        {"width": "5%", "targets": 8},
    ],
});

$(document).ready(function() {
    obtenerLibros();
    inicializarModalAgregarLibro();
    comprobarUsuario();
    obtenerUsuarioBarra();

    let barra = document.querySelector('.barra_sistema');
    let modal = document.querySelector('.modalLibro');
    let barraAltura = parseFloat(barra.offsetHeight) + 5; 
    modal.style.paddingTop = barraAltura + 'px';
    // modal.style.paddingTop = barraAltura + 'px';
});

window.addEventListener('pageshow', function(event) {
    comprobarUsuario();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if ($("#modalLibro").css("display") == "block") {
            $("#modalLibro").css("display", "none");
        }
    }
});

function obtenerLibros() {
    let datosGenerales = {
        accion : "CONFObtenerLibros"
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
        if (data.length > 0) {
            mostrarLibros(data);
        } else { 
            mensajeError("Fallo al Cargar Los Libros");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function mostrarLibros(libros) {
    let tabla = $("#tablaLibros").DataTable();
    tabla.clear().draw();

    libros.forEach(function(libro) {
        let titulo = libro.titulo;
        let genero = libro.genero;
        let idioma = libro.idioma;
        let editorial = libro.editorial;
        let paginas = libro.paginas;

        let input = prepararInputLibros(libro.idlibro); 
        let autores = prepararAutores(libro.autores);
        let fechaPublicacion = prepararFecha(libro.fechapublicacion);
        let estado = prepararEstadoLibro(libro.activo);

        tabla.row.add([
            input,
            titulo,
            autores,
            genero,
            idioma,
            editorial,
            fechaPublicacion,
            paginas,
            estado,
        ]).draw(false);

        tabla.draw();
    });
}

function prepararInputLibros(idLibro) {
    let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = "opcionLibro";
        radioInput.setAttribute('idLibro', idLibro);
    return radioInput;
}

function prepararAutores(autores) {
    autores = autores.replace("  ", " y ");
    return autores;
}

function prepararFecha(fecha) {
    return fecha.split("-").reverse().join("/")
}

function prepararEstadoLibro(estado) {
    if (estado == "S") {
        return "Activo";
    } else {
        return "Inactivo"
    }
}

function abrirModalAgregarCarrito() {
    let modal = document.getElementById("modalLibro");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function cerrarModalLibro() {
    let uploadedImage = document.getElementById('uploadedImage');
    let imagenRuta = uploadedImage.getAttribute("urlImagen"); 
    if (imagenRuta) {
        borrarImagenSubida();
    }
    let modal = document.getElementById("modalLibro");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    limpiarModalLibro();
}

function limpiarModalLibro() {
    let autor = $('<option>').attr('value', '-1').text('Seleccionar Autor'); 
    let genero = $('<option>').attr('value', '-1').text('Seleccionar Genero'); 
    let editorial = $('<option>').attr('value', '-1').text('Seleccionar Editorial'); 
    let idioma = $('<option>').attr('value', '-1').text('Seleccionar Idioma'); 
    
    $("#autorLibro").empty().append(autor);
    $("#generoLibro").empty().append(genero);
    $("#editorialLibro").empty().append(editorial);
    $("#idiomaLibro").empty().append(idioma);
    
    $("#nombreLibro").val("").text("");
    $("#fechaLibro").val("");
    $("#sinopsis").val("");
    $("#precioBaseLibro").val("0").trigger("change");

    inicializarAutores();
    inicializarGeneros();
    inicializarEditoriales();
    inicializarIdioma();
}

function inicializarModalAgregarLibro() {
    inicializarAutores();
    inicializarGeneros();
    inicializarEditoriales();
    inicializarIdioma();
}

function inicializarAutores() {
    let datosGenerales = {
        accion : "CONFObtenerAutoresActivos"
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
            let autor = $("<option>").attr("value", "-1").text("Seleccionar Autor");
            $("#autorLibro").empty().append(autor);
            data.forEach(function(registro) {
                let idAutor = registro.idautor;
                let nombreAutor = registro.nombre;
                let apellidoPaternoAutor = registro.apellidopaterno;
                let apellidoMaternoAutor = registro.apellidomaterno;
                let nombreCompleto = nombreAutor + " " + apellidoPaternoAutor + " " + apellidoMaternoAutor;
                autor = $("<option>").attr("value", idAutor).text(nombreCompleto)
                $("#autorLibro").append(autor);
            });
        } else { 
            mensajeError("Fallo al Obtener Autores, Se Recomienda Recargar");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function inicializarGeneros() {
    let datosGenerales = {
        accion : "CONFObtenerGenerosActivos"
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
            let genero = $("<option>").attr("value", "-1").text("Seleccionar Género");
            $("#generoLibro").empty().append(genero);
            data.forEach(function(registro) {
                let idGenero = registro.idgenero;
                let nombreGenero = registro.genero;
                genero = $("<option>").attr("value", idGenero).text(nombreGenero)
                $("#generoLibro").append(genero);
            });
        } else { 
            mensajeError("Fallo al Obtener Generos, Se Recomienda Recargar");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function inicializarEditoriales() {
    let datosGenerales = {
        accion : "CONFObtenerEditorialesActivos"
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
            let editorial = $("<option>").attr("value", "-1").text("Seleccionar Editorial");
            $("#editorialLibro").empty().append(editorial);
            data.forEach(function(registro) {
                let idEditorial = registro.ideditorial;
                let nombreEditorial = registro.editorial;
                editorial = $("<option>").attr("value", idEditorial).text(nombreEditorial)
                $("#editorialLibro").append(editorial);
            });
        } else { 
            mensajeError("Fallo al Obtener Editoriales, Se Recomienda Recargar");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function inicializarIdioma() {
    let datosGenerales = {
        accion : "CONFObtenerIdiomasActivos"
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
            let idioma = $("<option>").attr("value", "-1").text("Seleccionar idioma");
            $("#idiomaLibro").empty().append(idioma);
            data.forEach(function(registro) {
                let idIdioma = registro.ididioma;
                let nombreIdioma = registro.idioma;
                idioma = $("<option>").attr("value", idIdioma).text(nombreIdioma)
                $("#idiomaLibro").append(idioma);
            });
        } else { 
            mensajeError("Fallo al Obtener Editoriales, Se Recomienda Recargar");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function subirImagen() {
    let confirmaciondatos = confirmarDatosParaImagen();
    if (confirmaciondatos !== true) {
        mensajeError(confirmaciondatos);
        return;
    }

    let uploadForm = document.getElementById('uploadForm');
    let imageInput = document.getElementById('imageInput');
    let uploadedImage = document.getElementById('uploadedImage');
    let deleteButton = document.getElementById('deleteButton');

    let currentImageUrl = '';

    let url = '/Controladores/upload.php'; 

    let formData = new FormData();
    formData.append('image', imageInput.files[0]);
    
    let titulo = $("#nombreLibro").val();
    titulo = titulo.substring(0, 3);
    let fecha = $("#fechaLibro").val().split("-").join("");
    let autor = $("#autorLibro").find(":selected").text();
    autor = autor.substring(0, 3);
    let fechaHoy = fechaHoyFormateadaCadena();
    nombreConstruido = titulo + "_" + autor + "_" + fecha + "_" + fechaHoy;
    formData.append('customName', nombreConstruido);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.imageUrl) {
            mensajeFunciono("Imagen Cargada Con Exito");
            currentImageUrl = "/Controladores/" + data.imageUrl;
            uploadedImage.src = currentImageUrl;
            uploadedImage.style.display = 'block';
            deleteButton.style.display = 'block';
            uploadedImage.urlImagen = currentImageUrl;
            uploadedImage.setAttribute("urlImagen", data.imageUrl);
        } else {
            console.error('Error uploading image.');
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}

function confirmarDatosParaImagen() {
    let titulo = $("#nombreLibro").val();
    let fechaPublicacion = $("#fechaLibro").val();
    let autor = $("#autorLibro").find(":selected").val();
    let genero = $("#generoLibro").find(":selected").val();
    let editorial = $("#editorialLibro").find(":selected").val();
    let idioma = $("#idiomaLibro").find(":selected").val();
    let paginasLibro = $("#paginasLibro").val();
    let sinopsis = $('#sinopsis').val();
    let imagen = $("#imageInput")[0];
    let precioBase = parseFloat($("#precioBaseLibro").val());
    let ivaLibro = parseFloat($("#ivaLibro").val());
    let descuentoLibro = parseFloat($("#descuentoLibro").val());
    let totalLibro = parseFloat($("#totalLibro").val());

    let regexTitulo = /^[A-Za-z\s]{3,}$/;
    let regexFecha = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    let regexPaginas = /^\d{1,4}$/;
    let regexSinopsis = /^[A-Za-zÁ-ÿ0-9\s.,;:!?'"()\-]{30,}$/;

    if (!regexTitulo.test(titulo)) {
        return "Titulo Invalido, Minimo 3 carácteres";
    } else if(autor == "-1") {
        return "Seleccione un Autor";
    } else if(genero == "-1") {
        return "Seleccione un Genero";
    } else if(editorial == "-1") {
        return "Seleccione una Editorial";
    } else if(idioma == "-1") {
        return "Seleccione un Idioma";
    } else if(!regexPaginas.test(paginasLibro) || paginasLibro <= 0) {
        return "Numero Invalido (minimo 1, maximo 9999)";
    } else if(!regexFecha.test(fechaPublicacion)) {
        return "Fecha Invalida";
    } else if(!regexSinopsis.test(sinopsis)) {
        return "Sinopsis Invalida, Solo Texto y Minimo 30 Carácteres";
    } else if(precioBase <= 0 || descuentoLibro > precioBase) {
        return "Ingrese Costos Validos";
    } else if(imagen.files.length === 0) {
        return "Imagen Sin Cargar";
    }

    return true;
}

function borrarImagenSubida() {
    let url = '/Controladores/upload.php'; 
    let imagen = document.getElementById('uploadedImage');
    let currentImageUrl = imagen.getAttribute("urlImagen");
    let deleteButton = document.getElementById('deleteButton');
    let imageInput = document.getElementById('imageInput');
    if (currentImageUrl) {
        let formData = new FormData();
        formData.append('deleteImage', currentImageUrl);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                mensajeFunciono("Imagen Borrada Con Exito");
                uploadedImage.src = '';
                uploadedImage.style.display = 'none';
                deleteButton.style.display = 'none';
                imagen.setAttribute("urlImagen", "");
                imageInput.value = '';
            } else {
                mensajeError("Fallo al Eliminar Imagen: " + currentImageUrl);
                console.error(currentImageUrl);
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting image:', error);
        });
    } else {
        mensajeError("Imagen Sin Subir");
    }
}

function fechaHoyFormateadaCadena() {
    let date = new Date();

    // Obtener el día
    let day = date.getDate().toString();
    if (day.length < 2) {
        day = '0' + day;
    }

    // Obtener el mes (los meses en JavaScript van de 0 a 11)
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
        month = '0' + month;
    }

    // Obtener el año
    let year = date.getFullYear().toString();

    // Concatenar el día, mes y año
    let formattedDate = day + month + year;

    return formattedDate;
}

function abrirModalConfirmarAgregar() {
    Swal.fire({
        title: "Estas Seguro?",
        text: "Confirmar Agregar Libro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agregar"
      }).then((result) => {
        if (result.isConfirmed) {
            agregarLibro();
        }
      });
}

function agregarLibro() {
    let datosGenerales = prepararDatosGeneralesAgregarLibro();

    if (!datosGenerales) {
        mensajeError("Datos Incompletos, Rellenar Completamente");
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
            mensajeFunciono("Libro Agregado Correctamente");
            limpiarModalLibro();

            let modal = document.getElementById("modalLibro");
            modal.style.display = "none";
            document.body.style.overflow = "auto"
            obtenerLibros();

        } else { 
            mensajeError("Fallo al Agregar el Libro");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepararDatosGeneralesAgregarLibro() {
    let titulo = $("#nombreLibro").val();
    let fechaPublicacion = $("#fechaLibro").val();
    let idAutor = $("#autorLibro").find(":selected").val();
    let idGenero = $("#generoLibro").find(":selected").val();
    let idEditorial = $("#editorialLibro").find(":selected").val();
    let idIdioma = $("#idiomaLibro").find(":selected").val();
    let paginasLibro = $("#paginasLibro").val();
    let sinopsis = $('#sinopsis').val();
    let precioBase = parseFloat($("#precioBaseLibro").val());
    let ivaLibro = parseFloat($("#ivaLibro").val());
    let descuentoLibro = parseFloat($("#descuentoLibro").val());
    let totalLibro = parseFloat($("#totalLibro").val());
    let portada = document.getElementById('uploadedImage').getAttribute("urlImagen");

    let regexTitulo = /^[A-Za-z\s]{3,}$/;
    let regexFecha = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    let regexSinopsis = /^[A-Za-zÁ-ÿ0-9\s.,;:!?'"()\-]{30,}$/;
    let regexPaginas = /^\d{1,4}$/;

    if (idAutor == "-1" || idGenero == "-1" || idEditorial == "-1" || idIdioma == "-1") {
        return false;
    } else if(!regexTitulo.test(titulo) || !regexFecha.test(fechaPublicacion) || !regexSinopsis.test(sinopsis)) {
        return false;
    } else if(!comprobarCostosAgregarLibro()) {
        return false;
    } else if(portada == "") {
        return false;
    } else if (!regexPaginas.test(paginasLibro) || paginasLibro <= 0) {
        return false;
    }

    let datosGenerales = {
        accion : "CONFAgregarLibroCatalogo",
        titulo : titulo,
        fechaPublicacion : fechaPublicacion,
        idAutor : idAutor,
        idGenero : idGenero,
        idEditorial : idEditorial,
        idIdioma : idIdioma,
        paginasLibro : paginasLibro,
        sinopsis : sinopsis,
        precioBase : precioBase,
        ivaLibro : ivaLibro,
        descuentoLibro : descuentoLibro,
        totalLibro : totalLibro,
        portada : portada,
    };

    return datosGenerales;
}

function comprobarCostosAgregarLibro() {
    let precioBaseLibro = $("#precioBaseLibro").val();
    let descuentoLibro = $("#descuentoLibro").val();
    let regexNumeros = /^\d{1,4}(\.\d+)?$/;
    if (!comprobarFloat(precioBaseLibro) || !comprobarFloat(descuentoLibro) || !regexNumeros.test(precioBaseLibro) || !regexNumeros.test(descuentoLibro)) {
        $("#precioBaseLibro, #descuentoLibro, #ivaLibro, #totalLibro").val("0");
        return false;
    }
    if (descuentoLibro > precioBaseLibro) {
        $("#descuentoLibro").val("0");
        return false;;
    }
    precioBaseLibro = parseFloat(precioBaseLibro);
    descuentoLibro = parseFloat(descuentoLibro);

    let iva = (precioBaseLibro - descuentoLibro) * 0.16;
    let total = precioBaseLibro - descuentoLibro + iva;

    $("#ivaLibro").val(iva.toFixed(2));
    $("#totalLibro").val(total.toFixed(2));

    return true;
}

function comprobarFloat(numero) {
    let float = parseFloat(numero);
    return !isNaN(float) && isFinite(float);
}

function abrirModalConfirmarDeshabilitar() {
    Swal.fire({
        title: "Estas Seguro?",
        text: "Confirmar Dehsabilitar Libro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Deshabilitar"
    }).then((result) => {
    if (result.isConfirmed) {
        inhabilitarLibro();
    }
    });
}


function inhabilitarLibro() {
    let datosGenerales = prepararDatosGeneralesDeshabilitarLibro();
    if (!datosGenerales) {
        mensajeError("Libro no Seleccionado");
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
            mensajeFunciono("Libro Deshabilitado Correctamente");
            obtenerLibros();
        } else { 
            mensajeError("Fallo al Deshabilitar Libro");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepararDatosGeneralesDeshabilitarLibro() {
    let seleccionado = $('input[name="opcionLibro"]:checked');
    if (seleccionado.length <= 0) {
        return false;
    }

    let idLibro = $('input[name="opcionLibro"]:checked').attr('idLibro');

    let datosGenerales = {
        accion : "CONFDeshabilitarLibro",
        idLibro : idLibro
    };

    return datosGenerales;
}

function abrirModalConfirmarHabilitar() {
    Swal.fire({
        title: "Estas Seguro?",
        text: "Confirmar Habilitar Libro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Habilitar"
    }).then((result) => {
    if (result.isConfirmed) {
        habilitarLibro();
    }
    });
}


function habilitarLibro() {
    let datosGenerales = prepararDatosGeneralesHabilitarLibro();
    if (!datosGenerales) {
        mensajeError("Libro no Seleccionado");
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
            mensajeFunciono("Libro Habilitado Correctamente");
            obtenerLibros();
        } else { 
            mensajeError("Fallo Habilitar Libro");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepararDatosGeneralesHabilitarLibro() {
    let seleccionado = $('input[name="opcionLibro"]:checked');
    if (seleccionado.length <= 0) {
        return false;
    }

    let idLibro = $('input[name="opcionLibro"]:checked').attr('idLibro');

    let datosGenerales = {
        accion : "CONFHabilitarLibro",
        idLibro : idLibro
    };

    return datosGenerales;
}

