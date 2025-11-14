const fs = require('fs');
const path = require('path');
const rutaCarritos = path.join(__dirname, '../data/carritos.json');
const rutaProductos = path.join(__dirname, '../data/productos.json');

// Función genérica para leer cualquier JSON
function leerJSON(ruta) {
    const data = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(data);
}

// Función para guardar datos en la ruta de carritos
function guardar(datos) {
    fs.writeFileSync(rutaCarritos, JSON.stringify(datos, null, 2));
}

exports.listarConProductos = () => {
    const carritos = leerJSON(rutaCarritos);
    const productos = leerJSON(rutaProductos);

    // Enriquecemos cada carrito con la información completa de sus productos
    return carritos.map(carrito => {
        // Usamos (carrito.productos || []) para manejar carritos sin la propiedad 'productos'
        const productosDetalle = (carrito.productos || []).map(productoId => {
            const producto = productos.find(p => p.id === productoId);
            return producto || null;
        }).filter(p => p !== null); 

        return {
            ...carrito,
            productos: productosDetalle
        };
    });
};

exports.buscarPorIdConProductos = (id) => {
    const carritos = exports.listarConProductos();
    return carritos.find(c => c.id === id) || null;
};

exports.listar = () => leerJSON(rutaCarritos);
exports.buscarPorId = (id) => leerJSON(rutaCarritos).find(p => p.id === id);

exports.crear = (nuevo) => {
    const datos = leerJSON(rutaCarritos);
    nuevo.id = datos.length ? Math.max(...datos.map(p => p.id)) + 1 : 1;
    datos.push(nuevo);
    guardar(datos);
    return nuevo;
};

exports.actualizar = (id, cambios) => {
    const datos = leerJSON(rutaCarritos);
    const index = datos.findIndex(p => p.id === id);
    if (index === -1) return null;
    datos[index] = { ...datos[index], ...cambios };
    guardar(datos);
    return datos[index];
};

exports.eliminar = (id) => {
    const datos = leerJSON(rutaCarritos);
    const index = datos.findIndex(p => p.id === id);
    if (index === -1) return null;
    const eliminado = datos.splice(index, 1);
    guardar(datos);
    return eliminado[0];
};