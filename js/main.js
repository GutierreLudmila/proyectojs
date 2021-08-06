//Selectores 
const productosCont = document.querySelector('.productos-container'); 
const tablaCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
const buscador = document.querySelector('#formulario');
let carrito = [];

//Animaciones
$('.productos-container').hide();

$('nav h3').click ( () => {
    $('.productos-container').toggle(2000)});

//Eventos
$('.productos-container').on('click',agregarProducto)
$('#lista-carrito tbody').on('click',borrarProducto);
$('#vaciar-carrito').on('click',vaciarCarrito);
$('#formulario').on('submit',buscarArticulo);

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    
    insertarCarrito();
    
});


function buscarArticulo (e){
    e.preventDefault();
    const inputBuscador = document.querySelector('#buscador').value;
    const filtrado = inputBuscador.trim().toLowerCase();
    
    const resultado = articulos.filter (articulo => articulo.nombre.toLowerCase().includes(filtrado));
    
    productosCont.innerHTML = '';
    
    resultado.forEach(articulo =>{
        const {imagen, nombre, precio,id} = articulo; 
        
        const div = document.createElement ('div');
        div.classList.add("producto"); 
        div.innerHTML = `
        <img src="${imagen}" alt="">
        <p class="nombre">${nombre}</p>
        <p class="precio">${precio}</p>
        <a href="#" class="agregar-carrito" data-id="${id}">Agregar al carrito</a>
        `
        productosCont.appendChild(div);
    });
}

function vaciarCarrito(e) {
    e.preventDefault();
    carrito = [];
    insertarCarrito();
}


function borrarProducto (e){
    e.preventDefault();
    
    if( e.target.classList.contains("borrar-producto")){
        const productoSeleccionado = e.target.parentElement.parentElement;
        const productoId = e.target.getAttribute('data-id');
        
        productoSeleccionado.remove();
        
        carrito = carrito.filter(producto => producto.id !== productoId);
        
        guardarCarrito();
        insertarCarrito();
        
    }
}

function agregarProducto (e){
    e.preventDefault()
    
    if( e.target.classList.contains("agregar-carrito")){
        const cardProducto = e.target.parentElement;
        
        obtenerDatos(cardProducto);
    }
    
}

function obtenerDatos(cardProducto){
    
    const productoAgregado = {
        imagen: cardProducto.querySelector('img').src,
        nombre: cardProducto.querySelector ('.nombre').textContent,
        precio: cardProducto.querySelector('.precio').textContent,
        cantidad: 1, 
        id: cardProducto.querySelector('a').getAttribute('data-id'),         
    }
    
    const existe = carrito.find(producto => producto.id === productoAgregado.id && producto.nombre === productoAgregado.nombre);
    
    if (existe) {
        const productos = carrito.map(producto => {
            if (producto.id === productoAgregado.id) {
                producto.cantidad++;
                producto.precio = `$${Number(productoAgregado.precio.slice(1)) * producto.cantidad}`
                return producto;
            } else {
                return producto;
            }
        });
        
        carrito = [...productos];
        
    }else{
        carrito.push(productoAgregado);
    }
    
    insertarCarrito();
}

function insertarCarrito (){
    
    borrarCarrito ();
    
    carrito.forEach ( producto => {
        const {imagen, nombre, precio, cantidad, id} = producto
        
        const fila = document.createElement('tr')
        fila.innerHTML = `
        <td>
        <img src="${imagen}" width='100%'>
        </td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
        <a href="#" class="borrar-producto" data-id="${id}">X</a>
        </td>`
        
        tablaCarrito.appendChild (fila);
    });
    
    guardarCarrito();
}

function borrarCarrito () {
    while (tablaCarrito.firstChild) {
        tablaCarrito.removeChild(tablaCarrito.firstChild);
    }
};

function guardarCarrito (){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}



$.ajax ({
    url: 'json/sucs.json',

    success: function (result,status,jqXHR){
        console.log(result), 

        result.forEach (sucursal => {
            const {zona, direccion, telefono} = sucursal; 

            $("footer").append (`
              <ul>
              <li>
                 Sucursal ${zona}: ${direccion} - ${telefono}
              </li>
              </ul>`
            )
        })
    },

    error: function (jqXHR, status, error){
        console.log(jqXHR),
        console.log(status),
        console.log(error)


    },
})
