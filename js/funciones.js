
function guardarLocalStorage(clave, datos){
    localStorage.setItem(clave, JSON.stringify(datos));
}  

function buscarProd (productos, id) {
    return productos.find(producto => producto.id === parseInt(id))
}

function vender(funcion,carrito, producto, prodCarrito){
    /*  descontar de stock
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
                    //console.log("sumo")
                    prodCarrito.cantStock++;    
                }
                break;
            case "sumar":
                //console.log("sumar")
                prodCarrito.cantStock++;
                break
            }
        }
        else{
            console.log("menos 0")
            alert("no hay stock!");
        }
}

//resta un articulo del carrito
function restarArticulo(e, pantalla){
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
        if (pantalla === "ppal") {
            generaPantalla("cardStock",contenedorStock, productos);        
        }
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}

//resta un articulo del carrito
function sumarArticulo(e, pantalla){
    if (e.target.classList.contains("btn-mas")) {
        console.log(e.target.dataset.id);
        const resultado = buscarProd(productos, e.target.dataset.id)
        const resultadoCarrito = buscarProd(carrito, e.target.dataset.id)
        vender("sumar", carrito, resultado, resultadoCarrito);
        generaPantalla("carrito", contenedorCarrito, carrito);
        if (pantalla === "ppal") {
            generaPantalla("cardStock",contenedorStock, productos);        
        }
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}


//elimina articulo del carrito (del array y de la pantalla)
function eliminarProductoCarrito(e, pantalla){
    if (e.target.classList.contains("btn-eliminarCarrito")) {
        const resultado = buscarProd(productos, e.target.dataset.id)
        const resultadoCarrito = buscarProd(carrito, e.target.dataset.id)
        carrito.splice(carrito.indexOf(resultadoCarrito),1)
        resultado.cantStock = resultado.cantStock + resultadoCarrito.cantStock;
    }
    generaPantalla("carrito", contenedorCarrito, carrito);
    if (pantalla === "ppal") {
        generaPantalla("cardStock",contenedorStock, productos);
    }
    guardarLocalStorage("carrito", carrito);
    guardarLocalStorage("productos", productos);
}



//crea un nuevo articulo en el carrito, descuenta de producto
function sumarCarrito(e){
    if (e.target.classList.contains("btn-carrito")) {
        const resultado = buscarProd(productos, e.target.dataset.id)
        if (!(carrito.some(prod => prod.id === parseInt(resultado.id)))) {
            
            let articuloVendido = new Producto
        /*   articuloVendido.id = resultado.id
            articuloVendido.nombre= resultado.nombre
            articuloVendido.cantStock=1
            articuloVendido.precio=resultado.precio*/
            articuloVendido = {...resultado, cantStock: 1}
            vender("agregar", carrito, resultado, articuloVendido);
        }
        else{
            let articuloCarrito = buscarProd(carrito, resultado.id)
            vender("sumar", carrito, resultado, articuloCarrito);
        
        }    
        generaPantalla("carrito", contenedorCarrito, carrito);
        generaPantalla("cardStock",contenedorStock, productos);
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}


//Crea dinamicamente la pantalla de prod en stock
function crearStockHTML(clase,  producto, pantalla) {
    let contenedor = document.createElement("div");
    let funcion = "";
    let btn_clase = "";
    const {id, nombre, cantStock, precio} = producto;
    contenedor.className = `card ${clase}`;
    contenedor.id=`StockProd${producto.id}`;
    pantalla === "admin" ? funcion = "Elminar" : funcion = "Agregar al carrito";
    pantalla === "admin" ? btn_clase = "btn-eliminar" : btn_clase = "btn-carrito";

    contenedor.innerHTML = 
        `<div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">Cant. Stock: ${cantStock}</p>
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
function crearCarritoHTML(clase, producto) {
    let contenedor = document.createElement("div");
    const {id, nombre, cantStock, precio} = producto;
        contenedor.className = `card ${clase}`;
    contenedor.id=`carrito${id}`;
    
    contenedor.innerHTML = 
    `<div class="card-body">
        <h6 class="card-title">${nombre}</h6>
        <p class="card-text">Cant: ${cantStock}</p>
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
    `<a class="btn btn-primary btn-Checkout" href="./pages/checkout.html">Finalizar Comprar</a>`;
    contenedor.appendChild(contenedorFooter);
}


//genera las pantalla de stock o carrito segun parametros
function generaPantalla (clase,contenedor, productos){
    contenedor.innerHTML = ""
    switch (clase) {
        case "cardStock":
        productos.forEach(producto=>{
            crearStockHTML(clase, producto, pantalla)   
        })
        break;
        case "carrito":
            productos.forEach(producto=>{
            crearCarritoHTML(clase, producto)
            }
        )
     //   console.log(pantalla)
        if (productos.length > 0 ){
            totalCarrito(carrito.reduce((acumulador, producto) => {
                    return acumulador + producto.precio * producto.cantStock;
                }, 0));
            pantalla === "ppal" ? generarCheckout(contenedor) : "";    
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
        carrito.forEach(prod => {
            prodHtml += `
            <div class="producto">
                <span>${prod.nombre} x ${prod.cantStock}</span>
                <span>$ ${prod.precio * prod.cantStock}</span>
            </div>`
        });
        let totalCarrito = carrito.reduce((acumulador, producto) => {
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
            guardarVenta(carrito,datos,totalCarrito);
            
            window.location.href = "../index.html";
        });
    }   
}   

function guardarVenta(carrito, datos, totalCarrito ){
    const venta = new Venta ;
    venta.id = venta.nextId();
    venta.fecha = new Date();
    venta.productos= []
    carrito.forEach(c => {
        venta.productos.push(c)
    });
    venta.Envio = { nombre: datos.get("nombre"),
                    apellido: datos.get("apellido"),
                    direccion: datos.get("direccion"),
                    email: datos.get("email")}
    venta.mpago = datos.get("mpago");
    venta.total = totalCarrito;
    ventas.push(venta);
    carrito.splice(0, carrito.length);
    guardarLocalStorage("carrito", carrito)
    guardarLocalStorage("ventas", ventas);
}

// alta de un nuevo producto en stock
function altaProducto(nombre, cantStock, precio){
    const producto = new Producto
    producto.id= producto.nextId()
    producto.nombre= nombre;
    producto.cantStock= parseInt(cantStock);
    producto.precio= parseInt(precio);
    productos.push(producto);
    guardarLocalStorage("productos", productos);
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
    const form = document.getElementById('AgregaProd');
    const datos = new FormData(form);
    articulo = datos.get("articulo")
    stock = datos.get("stock")
    precio = datos.get("precio")

    altaProducto(articulo, stock, precio)
    generaPantalla("cardStock", contenedor, productos, pantalla);
    guardarLocalStorage("productos", productos);
} 

//funcion para eliminar  un articulo
function eliminarArticulo(e){
    const prod = e.target.closest(".cardStock");
    console.log("eliminarArticulo")
    if (e.target.classList.contains("btn-eliminar")) {
        const h5 = prod.querySelector("h5");
        console.log(h5)
        bajaProducto(productos, e.target.dataset.id)
        bajaProducto(carrito, e.target.dataset.id)
        prod.remove();
        guardarLocalStorage("productos", productos);
        guardarLocalStorage("carrito", carrito);
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

function ResumenVentas(ventas){
    let resumen = document.getElementById("contenedor-ventas-lista");
    //let resumenProd = document.getElementById("resumen-productos");
    //let resumenEnvios = document.getElementById("resumen-envios");
    let totalVentas = 0;
    let totalProd = 0;
    ventas.forEach(venta => {
        totalVentas += parseFloat(venta.total);
        console.log(venta.productos)
        venta.productos.forEach(prod => {
            totalProd += parseInt(prod.cantStock)
        });
    });    

    document.getElementById("resumen-total").textContent = `$ ${totalVentas}`;
    document.getElementById("resumen-cantidad").textContent = ventas.length;
    document.getElementById("resumen-ticket").textContent = `$ ${totalVentas / ventas.length || 0}`;
    document.getElementById("resumen-productos").textContent = totalProd;
    

    /*resumen.innerHTML= `<div class="tarjeta-resumen">
                            <h2>Resumen de Ventas</h2>
                            <div class="item-resumen">
                                <span>Total Ventas</span>
                                <strong id="resumen-ventas">$ ${totalVentas}</strong>
                            </div>
                            <div class="item-resumen">
                                <span>Productos Vendidos</span>
                                <strong id="resumen-productos">${totalProd}</strong>
                            </div>
                        </div>`;*/
}   