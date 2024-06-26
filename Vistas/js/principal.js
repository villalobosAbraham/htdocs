let url = '../Controladores/conf_configuracion.php';

document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        filtrarLibros();
    } else if (event.key === 'Escape') {
        if ($("#myModal").css("display") == "block") {
            $("#myModal").css("display", "none");
        }
    }
});

window.addEventListener('pageshow', function(event) {
    comprobarUsuario();
});

document.addEventListener('DOMContentLoaded', function() {
    let barra = document.querySelector('.barra');
    let main = document.querySelector('main');
    let barraAltura = barra.offsetHeight; 
    main.style.paddingTop = barraAltura + 'px';

    comprobarUsuario();
    obtenerLibrosPopulares();
    obtenerLibrosRecomendados();
    obtenerFiltros();
});

function comprobarUsuario() {
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
            // return true;
        } //else {
        //     return false;;
        // } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function obtenerLibrosPopulares() {
    let datosGenerales = {
        accion : "CONFObtenerLibrosPopulares",
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
            mostrarLibros("listaPopulares", "listaPopularesPaginacion", data);
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function mostrarLibros(listaDatos, listaPaginacion, data) {
    let lista = document.getElementById(listaDatos);
    lista.innerHTML = '';
    for (let registro of data) {
        let idLibro = registro.idlibro;
        let titulo = registro.titulo;
        let precio = registro.precio;
        let descuento = registro.descuento;
        let iva = registro.iva;
        let fechaPublicacion = registro.fechapublicacion;
        let portada = registro.portada;
        let autores = registro.autores
        
        let completoAutor = prepararTextoAutor(autores);
        let costoIndividual = precio - descuento + iva;

        let elementoLista = document.createElement('li');
        elementoLista.classList.add('libroPrincipal');

        let imagen = document.createElement('img');
        
        let tituloElemento = document.createElement('h3');
        let autorElemento = document.createElement('h4');
        let fechaElemento = document.createElement('h5');
        let totalElemento = document.createElement('h5');
        
        let botonAgregarCarrito = document.createElement('button');
        let botonDetallesLibro = document.createElement('button');

        let iconoAgregar = document.createElement('i');
        let iconoDetalles = document.createElement('i');

        tituloElemento.classList.add("tituloElemento");
        iconoAgregar.classList.add('fa-solid', 'fa-plus'); // Agregar clases para el ícono
        iconoDetalles.classList.add('fa-solid', 'fa-info'); // Agregar clases para el ícono
        botonAgregarCarrito.classList.add("botonLibroPrincipal");
        botonDetallesLibro.classList.add("botonDetallesLibro");
        autorElemento.classList.add('autorElemento');
        
        tituloElemento.textContent = titulo;
        autorElemento.textContent = completoAutor;
        fechaElemento.textContent = "Fecha de Publicacion: " + fechaPublicacion.split("-").reverse().join("/");
        totalElemento.textContent = 'Costo: $' + costoIndividual + " M.X.N";
        
        botonAgregarCarrito.textContent = "Agregar a Carrito ";
        botonAgregarCarrito.setAttribute("idLibro", idLibro);
        botonAgregarCarrito.setAttribute("costoIndividual", costoIndividual);
        botonAgregarCarrito.appendChild(iconoAgregar);
        
        botonAgregarCarrito.addEventListener('click', function() {
            agregarLibroCarrito(botonAgregarCarrito);
            registrarVisualizacion(idLibro);
        });
        
        botonDetallesLibro.textContent = "Ver Detalles ";
        botonDetallesLibro.appendChild(iconoDetalles);

        botonDetallesLibro.addEventListener('click', function() {
            verDatellesLIbro(registro);
        });

        imagen.src = "../Controladores/" + portada;
        imagen.alt = "Imagen " + titulo;
        
        elementoLista.appendChild(imagen);
        elementoLista.appendChild(tituloElemento);
        elementoLista.appendChild(autorElemento);
        elementoLista.appendChild(fechaElemento);
        elementoLista.appendChild(totalElemento);
        elementoLista.appendChild(botonAgregarCarrito);
        elementoLista.appendChild(botonDetallesLibro);
        
        lista.appendChild(elementoLista);
    }

    paginacion(listaDatos, listaPaginacion);
}

function prepararTextoAutor(autores) {
    autores = autores.replace("  ", " y ");
    return autores;
}

function obtenerLibrosRecomendados() {
    let datosGenerales = {
        accion : "CONFObtenerLibrosRecomendados",
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
            mostrarLibros("listaRecomendaciones", "listaRecomendacionesPaginacion", data);
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function agregarLibroCarrito(boton) {
    let datosGenerales = prepararDatosGeneralesAgregarCarrito(boton);

    fetch(url, {
        method: 'POST',
        headers: {  
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGenerales)
    })
    .then(response => response.json())
    .then(data => {
        comprobarCarritoCantidad();
        if (data) {
            mensajeFunciono("Libro Agregado Correctamente");
        } else {
            mensajeError("Limite Alcanzado");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
function prepararDatosGeneralesAgregarCarrito(boton) {
    let idLibro = boton.getAttribute('idLibro');

    let datosGenerales = {
        accion : "VENAgregarAumentarLibroCarrito",
        idLibro : idLibro,
        aumento : 1,
    }

    return datosGenerales;
}

function verDatellesLIbro(libro) {
    let titulo = libro.titulo;
    let portada = libro.portada;
    let autores = prepararTextoAutor(libro.autores);
    let fechaPublicacion = libro.fechapublicacion;
    let genero = libro.genero;
    let paginas = libro.paginas;
    let idioma = libro.idioma;
    let editorial = libro.editorial;
    let sinopsis = libro.sinopsis;

    document.getElementById('tituloModal').textContent = titulo;
    document.getElementById('autoresLibro').textContent = "Autor(es): " + autores;
    document.getElementById('añoPublicacionLibro').textContent = "Fecha de Publicacion: " + fechaPublicacion.split("-").reverse().join("/");
    document.getElementById('generoLibroDetalles').textContent = "Genero: " + genero;
    document.getElementById('cantidadPaginas').textContent = "Cantidad de Paginas: " + paginas;
    document.getElementById('idiomaLibro').textContent = "Idioma del Libro: " + idioma;
    document.getElementById('editorialLibro').textContent = "Editorial: " + editorial;
    document.getElementById('pSinopsisLibro').innerText = sinopsis;
    document.getElementById('imagenLibroDetalles').src =  "../Controladores/" + portada;;


    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    let barra = document.querySelector('.barra');
    // let main = document.querySelector('main');
    let barraAltura = barra.offsetHeight; 
    modal.style.paddingTop = barraAltura + 'px';

    registrarVisualizacion(libro.idlibro);
}

function registrarVisualizacion(idLibro) {
    let datosGenerales = {
        accion : "INVRegistrarVisualizacion",
        idLibro : idLibro
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
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cerrarModalDetalles() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

function paginacion(listaBase, listaPaginacion) {
    let list = document.getElementById(listaBase);
    let pagination = document.getElementById(listaPaginacion);
    let items = list.getElementsByTagName('li');
    let itemsPerPage = 4;
    let maxPageButtons = 3; // Máximo de botones de paginación mostrados
    let currentPage = 1;

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        for (let i = 0; i < items.length; i++) {
            items[i].style.display = (i >= start && i < end) ? 'block' : 'none';
        }
        setupPagination(page);
    }

    function setupPagination(page) {
        const pageCount = Math.ceil(items.length / itemsPerPage);
        pagination.innerHTML = '';

        let startPage = Math.max(page - Math.floor(maxPageButtons / 2), 1);
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > pageCount) {
            endPage = pageCount;
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        if (startPage > 1) {
            const firstPage = document.createElement('li');
            firstPage.textContent = '1';
            firstPage.addEventListener('click', function() {
                currentPage = 1;
                showPage(currentPage);
            });
            pagination.appendChild(firstPage);

            if (startPage > 2) {
                const dots = document.createElement('li');
                dots.textContent = '...';
                dots.style.pointerEvents = 'none';
                pagination.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.textContent = i;
            li.addEventListener('click', function() {
                currentPage = i;
                showPage(currentPage);
            });
            if (i === currentPage) {
                li.classList.add('active');
            }
            pagination.appendChild(li);
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const dots = document.createElement('li');
                dots.textContent = '...';
                dots.style.pointerEvents = 'none';
                pagination.appendChild(dots);
            }

            const lastPage = document.createElement('li');
            lastPage.textContent = pageCount;
            lastPage.addEventListener('click', function() {
                currentPage = pageCount;
                showPage(currentPage);
            });
            pagination.appendChild(lastPage);
        }
    }

    showPage(currentPage);
};

function obtenerFiltros() {
    let datosGenerales = {
        accion : "CONFObtenerGenerosFiltros",
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
            mostrarFiltros(data);
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function mostrarFiltros(generos) {
    let lista = document.getElementById("listaFiltros");
    for(let genero of generos) {
        let listItem = document.createElement('li');
        let h2Genero = prepararH3GeneroFiltro(genero.genero);
        let h6GeneroCantidad = prepararH6GeneroFiltro(genero.cantidad);

        // Crear el checkbox
        let checkboxGenero = prepararCheckBoxGeneroFiltro(genero.idgenero);

        // Añadir h3 y checkbox al li
        listItem.appendChild(h2Genero);
        listItem.appendChild(checkboxGenero);
        listItem.appendChild(h6GeneroCantidad);

        // Añadir el li a la lista
        lista.appendChild(listItem);
    }

    $('input[name="boxFiltro"]').on('change', function() {
        filtrarLibros();
    });
}

function prepararH3GeneroFiltro(genero) {
    let h2Genero = document.createElement('h3');
    h2Genero.textContent = genero;

    return h2Genero;
}

function prepararCheckBoxGeneroFiltro(idGenero) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'boxFiltro';
    checkbox.value = idGenero;

    return checkbox;
}

function prepararH6GeneroFiltro(cantidad) {
    let h2Genero = document.createElement('h6');
    h2Genero.textContent = "(" + cantidad + ")";

    return h2Genero;
}

function filtrarLibros() {
    let datosGenerales = prepararDatosGeneralesFiltrarLibros();

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
            mostrarLibros("listaBusqueda", "listaBusquedaPaginacion", data);
            $("#busqueda").css("display", "block");
        } else {
            mensajeError("Libros no Coincidentes <br>/<br>Sin Inventario");
            $("#busqueda").css("display", "none");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepararDatosGeneralesFiltrarLibros() {
    let libro = document.getElementById("inputBuscarLibro").value;
    let checkboxes = document.querySelectorAll('input[name="boxFiltro"]:checked');
    
    let generos = Array.from(checkboxes).map(cb => cb.value);

    let datosGenerales = {
        accion : "CONFFiltrarLibros",
        libro : libro,
        generos : generos,
    }

    return datosGenerales;

}

function limpiarFiltros() {
    $('input[name="boxFiltro"]').prop('checked', false);
    $("#busqueda").css("display", "none");
}
