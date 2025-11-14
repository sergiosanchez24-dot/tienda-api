const fs = require('fs');
const path = require('path');
const rutaPedidos = path.join(__dirname, '../data/pedidos.json');
const rutaProductos = path.join(__dirname, '../data/productos.json');

// Leer cualquier JSON
function leerJSON(ruta) {
    const data = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(data);
}

// Guarda datos en la ruta de pedidos
function guardar(datos) {
    fs.writeFileSync(rutaPedidos, JSON.stringify(datos, null, 2));
}

exports.listarConProductos = () => {
    const pedidos = leerJSON(rutaPedidos);
    const productos = leerJSON(rutaProductos);

    // Enriquecemos cada pedido con la información completa de sus productos
    return pedidos.map(pedido => {
        // Usamos (pedido.productos || []) para manejar pedidos sin la propiedad 'productos'
        const productosDetalle = (pedido.productos || []).map(productoId => {
            const producto = productos.find(p => p.id === productoId);
            return producto || null;
        }).filter(p => p !== null); 

        return {
            ...pedido,
            productos: productosDetalle
        };
    });
};

exports.buscarPorIdConProductos = (id) => {
    const pedidos = exports.listarConProductos();
    return pedidos.find(p => p.id === id) || null;
};

exports.listar = () => leerJSON(rutaPedidos);
exports.buscarPorId = (id) => leerJSON(rutaPedidos).find(p => p.id === id);

exports.crear = (nuevo) => {
    const datos = leerJSON(rutaPedidos);
    nuevo.id = datos.length ? Math.max(...datos.map(p => p.id)) + 1 : 1;
    datos.push(nuevo);
    guardar(datos);
    return nuevo;
};

exports.actualizar = (id, cambios) => {
    const datos = leerJSON(rutaPedidos);
    const index = datos.findIndex(p => p.id === id);
    if (index === -1) return null;
    datos[index] = { ...datos[index], ...cambios };
    guardar(datos);
    return datos[index];
};

exports.eliminar = (id) => {
    const datos = leerJSON(rutaPedidos);
    const index = datos.findIndex(p => p.id === id);
    if (index === -1) return null;
    const eliminado = datos.splice(index, 1);
    guardar(datos);
    return eliminado[0];
};