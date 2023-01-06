'use-strict';

const repository = require('../repositories/order-repository');
const { v4: uuid } = require('uuid');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {    
        const data = await repository.get();
        
        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o pedido', error});
    }    
};

exports.post = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: uuid().substring(0,6),
            items: req.body.items
        });
        
        res.status(201).send({message: 'Pedido cadastrado com sucesso!'});

    } catch (error) {
        res.status(400).send({message: 'Erro ao cadastrar o pedido', error});
    }
};