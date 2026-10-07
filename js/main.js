// definicion Clase producto
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
    
}


function vender(funcion,carrito, producto, prodCarrito){
    /* descontar de stock
       carrito: 1ra vta - genero carrito
                sgte vta - sumo 1 stoc de carrito */
        if (producto.cantStock > 0){
            producto.cantStock--;
            switch (funcion) {
            case "agregar": 
                console.log("agregar")
                if (!(carrito.some(prod => prod.id === parseInt(prodCarrito.id)))) {
                    console.log("agrego")
                    carrito.push(prodCarrito);
                }
                else{
                    console.log("sumo")
                    prodCarrito.cantStock++;    
                }
                break;
            case "sumar":
                console.log("sumar")
                prodCarrito.cantStock++;
                break
            }
        }
        else{
            console.log("menos 0")
            alert("no hay stock!");
        }
}


function buscarProd (productos, id) {
    return productos.find(producto => producto.id === parseInt(id))
}

//resta un articulo del carrito
function restarArticulo(e, carrito){
    console.log("restarArticulo")
    if (e.target.classList.contains("btn-menos")) {
        console.log(e.target.dataset.id);
        const resultado = buscarProd(productos, e.target.dataset.id)
        const resultadoCarrito = buscarProd(carrito, e.target.dataset.id)
        if (resultadoCarrito.cantStock > 1){
            resultadoCarrito.cantStock--;
            resultado.cantStock++;
        }
        else{
            carrito.splice(carrito.indexOf(resultadoCarrito),1)
            resultado.cantStock++;
        }
        generaPantalla("carrito", contenedorCarrito, carrito);
        generaPantalla("cardStock",contenedorStock, productos);
    }   
}

//resta un articulo del carrito
function sumarArticulo(e, carrito){
    if (e.target.classList.contains("btn-mas")) {
        console.log(e.target.dataset.id);
        const resultado = buscarProd(productos, e.target.dataset.id)
        const resultadoCarrito = buscarProd(carrito, e.target.dataset.id)
        vender("sumar", carrito, resultado, resultadoCarrito);
        generaPantallaCarrito(carrito);
        generaPantallaStock(productos);         
    }   
}


//elimina articulo del carrito (del array y de la pantalla)
function eliminarProductoCarrito(e, carrito){
    if (e.target.classList.contains("btn-eliminarCarrito")) {
        const resultado = buscarProd(productos, e.target.dataset.id)
        const resultadoCarrito = buscarProd(carrito, e.target.dataset.id)
        carrito.splice(carrito.indexOf(resultadoCarrito),1)
        resultado.cantStock = resultado.cantStock + resultadoCarrito.cantStock;
    }
    generaPantalla("carrito", contenedorCarrito, carrito);
    generaPantalla("cardStock",contenedorStock, productos);
}



//crea un nuevo articulo en el carrito, descuenta de producto
function sumarCarrito(e){
    if (e.target.classList.contains("btn-carrito")) {
        const resultado = buscarProd(productos, e.target.dataset.id)
        if (!(carrito.some(prod => prod.id === parseInt(resultado.id)))) {
            
            let articuloVendido = new Producto
            articuloVendido.id = resultado.id
            articuloVendido.nombre= resultado.nombre
            articuloVendido.cantStock=1
            articuloVendido.precio=resultado.precio
            
            vender("agregar", carrito, resultado, articuloVendido);
        }
        else{
        //    const articuloCarrito = buscarProd(carrito, resultado.id)
        //    articuloCarrito.cantStock++;
            let articuloCarrito = buscarProd(carrito, resultado.id)
            vender("sumar", carrito, resultado, articuloCarrito);
        
        }    
        generaPantalla("carrito", contenedorCarrito, carrito);
        generaPantalla("cardStock",contenedorStock, productos);
    }   
}


//Crea dinamicamente la pantalla de prod en stock
function crearStockHTML(clase,  id, nombre, precio, stock, pantalla) {
    let contenedor = document.createElement("div");
    let funcion = "";
    let btn_clase = "";
    contenedor.className = `card ${clase}`;
    contenedor.id=`StockProd${id}`;
    if (pantalla === "admin"){
        funcion = "Elminar"
        btn_clase = "btn-eliminar"  
    }
    else{
        funcion = "Agregar al carrito";
        btn_clase = "btn-carrito";
    }
    contenedor.innerHTML = 
        `<div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">Cant. Stock: ${stock}</p>
            <p class="card-text">precio: ${precio}</p>
            <a class="btn btn-primary ${btn_clase}" data-id="${parseInt(id)}" id="btn-Carrito${parseInt(id)}">${funcion}</a>
       </div>`             
    contenedorStock.appendChild(contenedor);
}

//creo el apartado de total de carrito
function totalCarrito(totalCarrito){
    let contenedor = document.createElement("div");
    contenedor.className="card total_carrito";
    contenedor.innerHTML=
       `<div class="card-body">
            <h6 class="card-title">Total Carrito</h6>
            <p class="card-text">precio: ${totalCarrito}</p>
       </div>`;
    contenedorCarrito.appendChild(contenedor);
}

//Crea dinamicamente la pantalla de carrito de compras
function crearCarritoHTML(clase,  id, nombre, precio, cantidad) {
    let contenedor = document.createElement("div");
    contenedor.className = `card ${clase}`;
    contenedor.id=`carrito${id}`;
    contenedor.innerHTML = 
    `<div class="card-body">
        <h6 class="card-title">${nombre}</h6>
        <p class="card-text">Cant: ${cantidad}</p>
        <p class="card-text">precio: ${precio}</p>
        <a class="btn btn-primary btn-mas" data-id="${parseInt(id)}" id="btn-mas${parseInt(id)}">+</a>
        <a class="btn btn-primary btn-menos" data-id="${parseInt(id)}" id="btn-menos${parseInt(id)}">-</a>
        <a class="btn btn-primary btn-eliminarCarrito" data-id="${parseInt(id)}" id="btn-menos${parseInt(id)} ">Quitar</a>
    </div>`;
    contenedorCarrito.appendChild(contenedor);
}


//Crea dinamicamente el boton de Finalizar compra
function generarCheckout (contenedor){

    let contenedorFooter = document.createElement("div");
    contenedorFooter.className = 'Checkout';
    contenedorFooter.id=`checkout`;
    contenedorFooter.innerHTML = 
    `<a class="btn btn-primary btn-Checkout" href="/pages/checkout.html">Finalizar Comprar</a>
       </div>
     </div>`;
    contenedor.appendChild(contenedorFooter);
}


//genera las pantalla de stock o carrito segun parametros
function generaPantalla (clase,contenedor, productos, pantalla){
    contenedor.innerHTML = ""
    switch (clase) {
        case "cardStock":
        productos.forEach(producto=>{
           // crearStockHTML(clase, producto.id, producto.nombre, producto.precio, producto.cantStock)   
            crearStockHTML(clase, producto.id, producto.nombre, producto.precio, producto.cantStock,pantalla)   
        })
        break;
        case "carrito":
           productos.forEach(producto=>{
            crearCarritoHTML(clase, producto.id, producto.nombre, producto.precio, producto.cantStock)
           }
        )
        console.log(pantalla)
        if (productos.length > 0 ){    
            if (pantalla === "checkout"){
                totalCarrito(carrito_checkout.reduce((acumulador, producto) => {
                    return acumulador + producto.precio * producto.cantStock;
                }, 0));
            }
            else{
                totalCarrito(carrito.reduce((acumulador, producto) => {
                            return acumulador + producto.precio * producto.cantStock;
                            }, 0));
                generarCheckout (contenedor)
            } 
        }
        break;
    }
}


// dibuja la pantalla para ofrecer el resumen de la comprar 
function checkout(e){
    //armar pantalla resumen
    // 1. datos de envio y metodo de pago 
    // 2. lista de productos
    // 3. total a pagado
    let nombre ="";
    let apellido = "";
    let direccion = ""; 
    let email= "";
    let mpago = "";
   
    const pantalla = document.getElementById("ppal-checkout"); 
    if (e.target.classList.contains("btn-confirmar")) {

        const form = document.getElementById('contactoForm');
        const datos = new FormData(form);
        nombre = datos.get("nombre")
        apellido = datos.get("apellido")
        direccion = datos.get("direccion")
        email = datos.get("email")
        mpago = datos.get("mpago")
        
        let prodHtml = ""
        carrito_checkout.forEach(prod => {
            prodHtml += `
            <div class="producto">
                <span>${prod.nombre} x ${prod.cantStock}</span>
                <span>$ ${prod.precio * prod.cantStock}</span>
            </div>`
        });
        let totalCarrito = carrito_checkout.reduce((acumulador, producto) => {
                    return acumulador + producto.precio * producto.cantStock;
                }, 0)

        pantalla.innerHTML= '';
        pantalla.innerHTML= 
        `<div class="checkout">
            <section class="checkout-datos">
                <h2>Datos de envío</h2>
                <div class="dato">
                    <strong>Nombre:</strong> ${nombre}
                </div>
                <div class="dato">
                    <strong>Apellido:</strong> ${apellido}
                </div>
                <div class="dato">
                    <strong>Email:</strong> ${email}
                </div>
                <div class="dato">
                    <strong>Dirección:</strong> ${direccion}
                </div>
                <h3>Método de pago</h3>
                <div class="dato">
                    ${mpago}
                </div>
            </section>
            <aside class="checkout-resumen">
                <h2>Resumen de compra</h2>
                ${prodHtml}
                <hr>
                <div class="totales total-final">
                    <span>Total</span>
                    <span> $ ${totalCarrito}</span>
                </div>  
                <button type="button" class="btn btn-primary btn-final" data-bs-toggle="modal" data-bs-target="#modalCompra">
                    Confirmar compra
                </button>
            </aside>
        </div>
        <div class="modal fade" id="modalCompra" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">      
                    <div class="modal-header">
                        <h5 class="modal-title">Compra confirmada</h5>
                    </div>
                    <div class="modal-body">
                        Tu compra fue realizada exitosamente.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;  
        zonaPpal.replaceWith(pantalla);

        const modal = document.getElementById("modalCompra");
        modal.addEventListener("hidden.bs.modal", () => {
            window.location.href = "../index.html";
        });
    }   
}   

// alta de un nuevo producto en stock
function altaProducto(id, nombre, cantStock, precio){
    const producto = new Producto(id, nombre, parseInt(cantStock), parseInt(precio));
    productos.push(producto);
}

//aca va la funcion genere pantalla stock
//elimina articulo 
function bajaProducto(productos, prodId){
    const resultados = productos.filter(producto => producto.id != prodId)
    productos.splice(0, productos.length)
    resultados.forEach(resultado => {
        productos.push(resultado);
    });       
}

//funcion para generar un nuevo articulo
function cargarActiculo(e, productos,contenedor){
    e.preventDefault();
    console.log("carga articulo")
    let articulo = "";
    let precio = "";
    let stock = "";
    const form = document.getElementById('AgredaProd');
    const datos = new FormData(form);
    articulo = datos.get("articulo")
    stock = datos.get("stock")
    precio = datos.get("precio")

    altaProducto(productos.length, articulo, stock, precio)
    console.log(contenedorStock);
    console.log(productos)
    console.log(pantalla)
    generaPantalla("cardStock", contenedor, productos, pantalla);            
} 

//funcion para eliminar  un articulo
function eliminarArticulo(e){
    const prod = e.target.closest(".cardStock");
    console.log("eliminarArticulo")
    if (e.target.classList.contains("btn-eliminar")) {
        const h5 = prod.querySelector("h5");
        console.log(h5)
        bajaProducto(productos, e.target.dataset.id)
        prod.remove();
        alert(`se dio de baja el producto ${h5.textContent}` );
    }
      
};

function verificarUsuario(user, pass){
    const userOK= "Mbarroso"
    const passOK = "1234"
    return (userOK === user) && (passOK === pass);
}
function login(e){
    e.preventDefault()
   
    console.log("dentro")
    let user = "";
    let pass = "";
    const form = document.getElementById('loginForm');
    const datos = new FormData(form);
    user = datos.get("usuario")
    pass = datos.get("password")
    if (verificarUsuario(user, pass)){
        window.location.href = "admin.html";
    }   
    else{
        alert("acceso denegado") ;
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
];

const carrito= [];
const carrito_checkout= [
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
];

const pantalla = document.body.id;

let contenedorCarrito = "";
let contenedorStock = "";   
let articulo="";
let precio= "";
let stock= "";
let btnAgregar= "";
let zonaForm = "";
let zonaPass = "";
let zonaPpal= "";


switch (pantalla){
    case "ppal":
        contenedorCarrito = document.getElementById("contenedor-carrito")
        contenedorStock = document.getElementById("contenedor-stock") 
        generaPantalla ("cardStock", contenedorStock, productos);
        generaPantalla ("carrito", contenedorCarrito, carrito);
        contenedorStock.addEventListener('click', sumarCarrito);
        contenedorCarrito.addEventListener('click', (e) => {
            sumarArticulo(e, carrito);
        });
        contenedorCarrito.addEventListener('click', (e) => {
            restarArticulo(e, carrito);
        });
        contenedorCarrito.addEventListener('click', (e) => {
            eliminarProductoCarrito(e, carrito);
        });
        contenedorCarrito.addEventListener('click', checkout); 
    break;
    case "admin":
        console.log("admin");
        articulo = document.getElementById("articulo");
        precio= document.getElementById("precio");
        stock = document.getElementById("stock");
        btnAgregar = document.getElementById("btn-agregar");
        contenedorStock = document.getElementById("contenedor-stock")   
        generaPantalla ("cardStock", contenedorStock, productos, pantalla);  
        contenedorStock.addEventListener('click', eliminarArticulo);
        btnAgregar.addEventListener('click', (e) => {
            cargarActiculo(e, productos,contenedorStock);
        });
    break;
    case "checkout":
        console.log("checkout")
        contenedorCarrito = document.getElementById("contenedor-carrito")
        zonaForm = document.getElementById("zona-form")
        zonaPpal= document.getElementById("ppal-checkout");
        generaPantalla ("carrito", contenedorCarrito, carrito_checkout, pantalla);     
        contenedorCarrito.addEventListener('click', (e) => {
            sumarArticulo(e, carrito_checkout);
        });
        contenedorCarrito.addEventListener('click', (e) => {
            restarArticulo(e, carrito_checkout);
        });
        contenedorCarrito.addEventListener('click', (e) => {
            eliminarProductoCarrito(e, carrito_checkout);
        });
        zonaForm.addEventListener('click', checkout);
        zonaPpal.addEventListener('click', checkout);
    break;  
    case "pass":
        console.log("pass")
        zonaPass = document.getElementById("loginForm")
        zonaPass.addEventListener('submit', login);
    break;
}
