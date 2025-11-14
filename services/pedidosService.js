const fs = require('fs');
const path = require('path');

// Rutas de archivos JSON
const rutaPedidos = path.join(__dirname, '../data/pedidos.json');
const rutaProductos = path.join(__dirname, '../data/productos.json');

// Función genérica para leer cualquier JSON
function leerJSON(ruta) {
    const data = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(data);
}

// Función para guardar datos en la ruta de pedidos
function guardar(datos) {
    fs.writeFileSync(rutaPedidos, JSON.stringify(datos, null, 2));
}

/**
 * Lista todos los pedidos con información completa de productos (Datos enriquecidos)
 * @returns {Array} Array de pedidos con productos detallados
 */
exports.listarConProductos = () => {
    const pedidos = leerJSON(rutaPedidos);
    const productos = leerJSON(rutaProductos);

    // Enriquecemos cada pedido con la información completa de sus productos
    return pedidos.map(pedido => {
        // FIX: Usamos (pedido.productos || []) para manejar pedidos sin la propiedad 'productos'
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

/**
 * Busca un pedido por ID con productos enriquecidos
 * @param {number} id - ID del pedido
 * @returns {Object|null} Pedido encontrado o null
 */
exports.buscarPorIdConProductos = (id) => {
    const pedidos = exports.listarConProductos();
    return pedidos.find(p => p.id === id) || null;
};


// Funciones CRUD existentes que usan la lectura/escritura unificada
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