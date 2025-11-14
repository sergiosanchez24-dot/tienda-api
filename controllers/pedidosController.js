const pedidosService = require('../services/pedidosService');

exports.obtenerTodos = (req, res) => {
    // Usamos la nueva función enriquecida
    const pedidos = pedidosService.listarConProductos(); 
    res.json(pedidos);
};

exports.obtenerPorId = (req, res) => {
    // Usamos la nueva función enriquecida
    const pedido = pedidosService.buscarPorIdConProductos(parseInt(req.params.id));
    pedido ? res.json(pedido) : res.status(404).json({ mensaje: 'No encontrado' });
};

exports.crear = (req, res) => {
    const nuevo = pedidosService.crear(req.body);
    res.status(201).json(nuevo);
};

exports.actualizar = (req, res) => {
    const actualizado = pedidosService.actualizar(parseInt(req.params.id), req.body);
    actualizado ? res.json(actualizado) : res.status(404).json({ mensaje: 'No encontrado' });
};

exports.eliminar = (req, res) => {
    const eliminado = pedidosService.eliminar(parseInt(req.params.id));
    eliminado ? res.json(eliminado) : res.status(404).json({ mensaje: 'No encontrado' });
};