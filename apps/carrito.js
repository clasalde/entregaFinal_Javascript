class Producto {
    constructor(id, modelo, img, descCorta, descLarga, alt, precio, stock) {
        this.id = id;
        this.modelo = modelo;
        this.img = img;
        this.descCorta = descCorta;
        this.descLarga = descLarga;
        this.alt = alt;
        this.precio = precio;
        this.cantidad = 1;
        this.stock = stock;
    }
}

class ControladorDeProductos {
    constructor() {
        this.listaDeProductos = []
        this.contenedorProductos = document.getElementById("contenedorProductos")
    }

    async uploadAndShowOnDOM(controladorCarrito){
        const resp = await fetch("./apps/productos.json")
        this.listaDeProductos = await resp.json()

        this.displayProductosDOM()
        this.clickAnadir(controladorCarrito)
    }

    displayProductosDOM() {
        this.listaDeProductos.forEach(producto => {
            this.contenedorProductos.innerHTML +=
                `<div class="d-flex card cardCustom mb-3">
                <h3 class="card-header text-center">${producto.modelo}</h3>
                <div class="d-flex contenerImagen mt-2">
                    <img class="m-auto imagenProducto" src="${producto.img}" alt="${producto.alt}">
                </div>
                <div class="card-body text-center py-1 mt-3">
                    <h5 class="card-title">${producto.descCorta}</h5>
                </div>
                <div class="card-body text-center pt-1">
                    <p class="card-text">${producto.descLarga}</p>
                </div>
                <div class="card-body text-center pt-1">
                    <p class="card-text">Precio: $${producto.precio}</p>
                </div>
                <div class="d-flex m-auto my-3">
                    <button type="button" id="${producto.id}" class="btn btn-primary hover">Añadir al Carrito</button>
                </div>
            </div>`
        })
    }

    clickAnadir(controladorCarrito) {
        this.listaDeProductos.forEach(producto => {
            const btnAP = document.getElementById(`${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.pushear(producto)
                controladorCarrito.setStorage()
                controladorCarrito.displayCarritoDOM(contenedorCarrito)

                Toastify({
                    text: `${producto.modelo} Añadido!`,
                    duration: 1500,
                    gravity: "bottom",
                }).showToast();
            })
        })
    }
}

class ControladorDelCarrito {
    constructor() {
        this.listaDelCarrito = []
        this.totalCompra = document.getElementById("totalCompra")
        this.contenedorCarrito = document.getElementById("contenedorCarrito")
    }

    pushear(producto) {
        let flag = false;

        for (let i = 0; i < this.listaDelCarrito.length; i++){
            if(this.listaDelCarrito[i].id == producto.id){
                this.listaDelCarrito[i].cantidad += 1;
                flag = true
            }
        }

        if(flag == false){
            this.listaDelCarrito.push(producto)
        }
    }

    setStorage() {
        let listaDelCarritoJSON = JSON.stringify(this.listaDelCarrito)
        localStorage.setItem("listaDelCarrito", listaDelCarritoJSON)
    }

    checkStorage() {
        this.listaDelCarrito = JSON.parse(localStorage.getItem("listaDelCarrito")) || []
        this.listaDelCarrito.length > 0 && this.displayCarritoDOM()
    }

    resetStorage() {
        localStorage.removeItem("listaDelCarrito")
    }

    eraseProducto(producto) {
        let posicion = this.listaDelCarrito.findIndex(miProducto => producto.id == miProducto.id)

        if(!(posicion == -1)) {
            this.listaDelCarrito.splice(posicion,1)
        }
    }

    displayCarritoDOM() {
        this.resetDOM(contenedorCarrito)
        this.listaDelCarrito.forEach(producto => {
            this.contenedorCarrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title">${producto.modelo}</h5>
                            <p class="card-text">${producto.descCorta}</p>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex align-content-center justify-content-end">
                        <button class="btn btn-danger" id="borrar-${producto.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>`
        })

        this.listaDelCarrito.forEach(producto => {
            const btnBorrar = document.getElementById(`borrar-${producto.id}`)
            
            btnBorrar.addEventListener("click", ()=> {
                this.eraseProducto(producto)
                this.setStorage()
                this.displayCarritoDOM()
            })
        })
        this.displayTotalDOM()
    }

    resetDOM() {
        this.contenedorCarrito.innerHTML = ""
    }

    resetListaDelCarrito() {
        this.listaDelCarrito = []
    }

    finalizarCompra() {
        finalizarCompra.addEventListener("click", () => {
            if(this.listaDelCarrito.length != 0){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Compra exitosa!',
                    showConfirmButton: false,
                    timer: 1700
                })
            
                controladorCarrito.resetDOM()
                controladorCarrito.resetStorage()
                controladorCarrito.resetListaDelCarrito()
                controladorCarrito.displayTotalDOM()
            }
        })
    }

    calcularTotal() {
        let totalCompra = 0
        this.listaDelCarrito.forEach(producto => {
            totalCompra += producto.precio * producto.cantidad
        })

        return totalCompra;
    }

    displayTotalDOM() {
        this.totalCompra.innerHTML = "$"+this.calcularTotal()
    }

    limpiarCarrito() {
        limpiarCarrito.addEventListener("click", ()=> {
            if(this.listaDelCarrito.length != 0){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Carrito Limpio!',
                    showConfirmButton: false,
                    timer: 1700
                })
            
                controladorCarrito.resetDOM()
                controladorCarrito.resetStorage()
                controladorCarrito.resetListaDelCarrito()
                controladorCarrito.displayTotalDOM()
            }
        })
    }
}

const controladorProductos = new ControladorDeProductos();
const controladorCarrito = new ControladorDelCarrito();

controladorProductos.uploadAndShowOnDOM(controladorCarrito);

controladorCarrito.checkStorage();
controladorCarrito.limpiarCarrito();
controladorCarrito.finalizarCompra();

controladorProductos.clickAnadir(controladorCarrito);