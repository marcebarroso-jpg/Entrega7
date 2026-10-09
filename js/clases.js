// definicion Clase producto
class Producto{
    constructor(id, nombre, cantStock, precio) {
        this.id = id;
        this.nombre = nombre;
        this.cantStock = cantStock;
        this.precio = precio;
    }
    nextId(){
        let id = 0;
        if (localStorage.getItem("productos")){
            const prods = JSON.parse(localStorage.getItem("productos"));
            if (prods.length > 0){
                id = prods[prods.length - 1].id + 1;
            }
        }
        return id;
    }
    cargaStock (cant){
        this.cantStock = this.cantStock + cant;
    }
    
}
class Venta{
    constructor(id, fecha, productos, envio, mpago, total) {
        this.id = id;
        this.fecha = fecha;
        this.productos = productos;
        this.envio = envio;
        this.mpago = mpago;
        this.total = total;
    }
    nextId(){
        let id = 1;
        if (localStorage.getItem("ventas")){
            const ventas = JSON.parse(localStorage.getItem("ventas"));
            if (ventas.length > 0){
                id = ventas[ventas.length - 1].id + 1;
            }
        }
        return id;
    }
}
