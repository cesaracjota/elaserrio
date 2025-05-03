const { response } = require('express');
const ConceptoPago = require('../models/concepto_pago');

const getConceptosPago= async (req, res = response) => {

    try {

        const concepto_pago = await ConceptoPago.find().sort({ updatedAt: -1 });

        res.json(concepto_pago);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const getConceptoPago = async (req, res = response) => {

    try {

        const tipo_activo = await ConceptoPago.findById(req.params.id);

        if (!tipo_activo) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipos del activo no encontrado'
            });
        }

        res.json(tipo_activo);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

const registrarConceptoPago = async (req, res = response) => {
    
        try {
    
            const { nombre, precio, descripcion, estado } = req.body;
    
            const conceptoPagoDB = await ConceptoPago.findOne({ nombre });
            
            if (conceptoPagoDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe con ese nombre'
                });
            }
    
            const data = {
                nombre,
                precio,
                descripcion,
                estado,
            }
    
            const concepto_pago = new ConceptoPago(data);
    
            await concepto_pago.save();

            res.status(201).json(concepto_pago);
    
        } catch (error) {
    
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
    
        }
    
    }

const actualizarConceptoPago = async (req, res = response) => {
    try {

        const { nombre, precio, descripcion, estado } = req.body;

        const data = {
            nombre,
            precio,
            descripcion,
            estado,
        }

        const concepto_pago = await ConceptoPago.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json(concepto_pago);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

const eliminarConceptoPago = async (req, res = response) => {
    try {

        const { id } = req.params;
        
        const concepto_pago = await ConceptoPago.findByIdAndDelete(id);

        res.json(concepto_pago);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

module.exports = {
    getConceptosPago,
    getConceptoPago,
    registrarConceptoPago,
    actualizarConceptoPago,
    eliminarConceptoPago,
}