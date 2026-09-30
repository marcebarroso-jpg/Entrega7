
// este simuproductor de abm de productos
class ItemVendido{
    constructor(id, nombre, cant, precio) {
        this.id = id;
        this.nombre = nombre;
        this.cant = cant;
        this.precio = precio;
    }
}

class Carrito{
    constructor(id) {
        this.id = id;
        this.productoVendidos = [];
        this.precioTotal = 0;
    }
    agregar(itemVendido){
        this.productoVendidos.push(itemVendido);
        this.precioTotal = this.precioTotal + (itemVendido.cant * itemVendido.precio);  
    }
    sumarItem(id){
        const item = this.productoVendidos.find(itemVendido => itemVendido.id === parseInt(id))
        item.cant++;
        this.precioTotal = this.precioTotal + item.precio
    }
    restarItem(id){
        const item = this.productoVendidos.find(productoVendido => productoVendido.id === parseInt(id))
        console.log(item)
        item.cant = item.cant-1;
        this.precioTotal = this.precioTotal - item.precio
        if (item.cant <= 0) {
            this.productoVendidos.splice(this.productoVendidos.indexOf(item),1);
        }
        
    }
}


class Producto{
    constructor(id, nombre, cantStock, precio) {
        this.id = id;
        this.nombre = nombre;
        this.cantStock = cantStock;
        this.precio = precio;
    }
    cargaStock (cant){
        this.cantStock = this.cantStock + cant;
    }
    vender(){
        if (this.cantStock > 0){
            this.cantStock--;
        }
        else{
            console.log("menos 0")
            alert("no hay stock!");
        }
    }
}

function altaProducto(id, nombre, cantStock, precio){

    const producto = new Producto(id, nombre, parseInt(cantStock), parseInt(precio));
    productos.push(producto);
}

function bajaProducto(productos, prodId){
    const resultados = productos.filter(producto => producto.id != prodId)
    productos.splice(0, productos.length)
    resultados.forEach(resultado => {
        productos.push(resultado);
    });       
}

function sumarArticulo(e){
   
    if (e.target.classList.contains("btn-mas")) {
        const resultado = productos.find(producto => producto.id === parseInt(e.target.dataset.id))
        const resultadoCarrito = carrito.productoVendidos.find(producto => producto.id === parseInt(e.target.dataset.id))
        carrito.sumarItem(resultadoCarrito.id);
        resultado.vender();
        console.log(carrito)
        console.log(productos)
        generaPantallaCarrito(carrito.productoVendidos);
        generaPantallaStock(productos);
        
    }   
}

function restarArticulo(e){

    if (e.target.classList.contains("btn-menos")) {
        console.log(e.target.dataset.id);
        const resultado = productos.find(producto => producto.id === parseInt(e.target.dataset.id))
        const resultadoCarrito = carrito.productoVendidos.find(producto => producto.id === parseInt(e.target.dataset.id))
        carrito.restarItem(resultadoCarrito.id);
        resultado.cargaStock(1);
        generaPantallaCarrito(carrito.productoVendidos);
        generaPantallaStock(productos);
        
    }   
}


function sumarCarrito(e){
  
    if (e.target.classList.contains("btn-carrito")) {
        const resultado = productos.find(producto => producto.id === parseInt(e.target.dataset.id))
        console.log(resultado)
        resultado.vender(1);
        crearItemVendido(resultado.id, resultado.nombre, 1, resultado.precio)
        crearCarritoHTML("carrito",  resultado.id, resultado.nombre ,resultado.precio, 1)        
        generaPantallaCarrito(carrito.productoVendidos);
        generaPantallaStock(productos);
    }   
}





function crearItemVendido(id, nombre, cant, precio){
    const hay = carrito.productoVendidos.some(prod => prod.id === parseInt(id));
    if (!hay){     
        const item = new ItemVendido(id,nombre, cant,precio);
        carrito.agregar(item);
    }
    else{
        carrito.sumarItem(id);
    } 
}

function cargarActiculo(){
    crearStockHTML("cardStock", productos.length, articulo.value, precio.value, stock.value)
    altaProducto(productos.length, articulo.value,  stock.value, precio.value)
    articulo.value = "";
    precio.value = "";
    stock.value = "";                   
}    




function eliminarArticulo(e){
    const prod = e.target.closest(".cardStock");
    if (e.target.classList.contains("btn-eliminar")) {
        const h3 = prod.querySelector("h3");
        console.log(h3)
        bajaProducto(productos, e.target.dataset.id)
        prod.remove();
        alert(`se dio de baja el producto ${h3.textContent}` );
    }
      
};

function crearStockHTML(clase,  id, nombre, precio, stock) {
    let contenedor = document.createElement("div");
    contenedor.className = clase;
    contenedor.id=`StockProd${id}`;
    contenedor.innerHTML = `<h3> Articulo: ${nombre} </h3> 
                            <h4> precio: ${precio} </h4>
                            <h4> Cantidad Stock: ${stock} </h4>
                            <button 
                                id="btn-Carrito${id}" 
                                class="btn-carrito" 
                                data-id="${id}">
                                llevar al carrito
                            </button>
                            <button 
                                id="btn-Eliminar${id}" 
                                class="btn-eliminar" 
                                data-id="${id}">
                                eliminar Stock
                            </button>`;
                            
    contenedorStock.appendChild(contenedor);
}

function crearCarritoHTML(clase,  id, nombre, precio, cantidad) {
    let contenedor = document.createElement("div");
    contenedor.className = clase;
    contenedor.id=`StockProd${id}`;
    contenedor.innerHTML = `<h3> Articulo: ${nombre} </h3> 
                            <h4> precio: ${precio} </h4>
                            <h4> Cantidad: ${cantidad} </h4>
                            <button 
                                id="btn-Carrito${id}" 
                                class="btn-mas" 
                                data-id="${id}">
                                +
                            </button>
                            <button 
                                id="btn-Eliminar${id}" 
                                class="btn-menos" 
                                data-id="${id}">
                                -
                            </button>`;
                            
    contenedorCarrito.appendChild(contenedor);
}

function generaPantallaStock (productos){
    contenedorStock.innerHTML = ""
    productos.forEach(producto=>{
    crearStockHTML("cardStock", producto.id, producto.nombre, producto.precio, producto.cantStock)   
})

}
function generaPantallaCarrito (productos){
    contenedorCarrito.innerHTML = ""
    if (productos.length != 0) {
        productos.forEach(producto=>{
        crearCarritoHTML("carrito", producto.id, producto.nombre, producto.precio, producto.cant)
        })
    }
}



console.log("simula ser un ABM de productos");



const productos= [
    {
        id: 0,
        nombre: "monitor",
        cantStock: 50,
        precio: 300
    },
    {
        id: 1,
        nombre: "teclado",
        cantStock: 50,
        precio:10
    },
    {
        id: 2,
        nombre: "impresora",
        cantStock: 55,
        precio:150
    },
    {
        id: 3,
        nombre: "mouse",
        cantStock: 50,
        precio:50 
    },
    {
        id: 4,
        nombre: "auriculares",
        cantStock: 50,
        precio:350
    }
].map(prod => new Producto(prod.id, prod.nombre, prod.cantStock, prod.precio));

const articulo = document.getElementById("articulo");
const precio= document.getElementById("precio");
const stock = document.getElementById("stock");
const btnAgregar = document.getElementById("btn-agregar");

let contenedorCarrito = document.getElementById("contenedor-carrito")
let contenedorStock = document.getElementById("contenedor-stock")   
let carrito = new Carrito(1);


generaPantallaStock (productos);
generaPantallaCarrito (carrito.productoVendidos);



btnAgregar.addEventListener('click', cargarActiculo) ;

contenedorStock.addEventListener('click', eliminarArticulo);
contenedorStock.addEventListener('click', sumarCarrito);

contenedorCarrito.addEventListener('click', restarArticulo);
contenedorCarrito.addEventListener('click', sumarArticulo);
