'use-strict';

const ValidationContract = require('../validators/validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const { v4: uuid } = require('uuid');

exports.get = async (req, res, next) => {
    try {    
        const data = await repository.get();
        
        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o produto', error});
    }    
};

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);

        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o produto', error});
    }
};

exports.getBySlug = async (req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug);

        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o produto', error});
    }
};

exports.getByTag = async (req,res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);

        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o produto', error});
    }
};

exports.post = async (req, res, next) => {
    const contract = new ValidationContract();

    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A description deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');

    if (!contract.isValid())
        return res.status(400).send(contract.errors()).end();

    try {
        // Cria o Blob Service
        // const blobSvc = azure.createBlobService(config.containerConnectionString);

        // let filename = uuid().toString() + '.jpg';
        // let rawdata = req.body.image;
        // let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // let type = matches[1];
        // let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        // await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
        //     contentType: type
        // }, function (error, result, response) {
        //     if (error) {
        //         filename = 'default-product.png'
        //     }
        // });

        const data = await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            // image: 'https://nodestr.blob.core.windows.net/product-images/' + filename
        });

        if (data)
            res.status(201).send({message: 'Produto cadastrado com sucesso!'});

    } catch (error) {
        res.status(400).send({message: 'Erro ao cadastrar o produto', error});
    }
};

exports.put = async (req, res, next) => {
    const contract = new ValidationContract();

    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A description deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');

    if (!contract.isValid())
        return res.status(400).send(contract.errors()).end();

    try {
        const data = await repository.update(req.params.id, req.body);

        if (data)
            res.status(200).send({ message: 'Produto atualizado com sucesso !'});

    } catch (error) {
        res.status(400).send({ message: 'Erro ao atualizar o produto', error});
    }
};

exports.delete = async (req, res, next) => {    
    try {
        const data = await repository.delete(req.params.id);

        if (data)
            res.status(200).send({ message: 'Produto excluído com sucesso !'});

    } catch (error) {
        res.status(400).send({ message: 'Erro ao excluir o produto', error});
    }
};

