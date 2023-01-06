'use-strict';

const ValidationContract = require('../validators/validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {    
        const data = await repository.get();
        
        if (data)
            res.status(200).send(data);

    } catch (error) {
        res.status(400).send({message: 'Erro ao consultar o cliente', error});
    }    
};

exports.post = async (req, res, next) => {
    const contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail invalido !');
    contract.hasMinLen(req.body.password.toString(), 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid())
        return res.status(400).send(contract.errors()).end();

    try {
        const data = await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password+global.SALT_KEY),
            roles: ['user']
        });

        // emailService.send(req.body.email, 'Bem vindo ao Node Store' , global.EMAIL_TMPL.replace('{0}', req.body.name));
        

        if (data)
            res.status(201).send({message: 'Cliente cadastrado com sucesso!'});

    } catch (error) {
        res.status(400).send({message: 'Erro ao cadastrar o cliente', error});
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password+global.SALT_KEY)
        });

        if (!customer)
            return res.status(404).send({message: 'Nenhum usuário cadastrado com esses dados !'});

        console.log(customer);

        const data = {
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        }

        const token = await authService.generateToken(data);
            
        res.status(201).send({
            token,
            data
        });

    } catch (error) {
        res.status(400).send({message: 'Erro ao realizar o login !', error});
    }
};

exports.refreshToken = async (req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer)
            return res.status(404).send({message: 'Nenhum usuário cadastrado com esses dados !'});

        console.log(customer);

        const generateToken = {
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        }

        const tokenData = await authService.generateToken(generateToken);
            
        res.status(201).send({
            token: tokenData,
            data: generateToken
        });

    } catch (error) {
        res.status(400).send({message: 'Erro ao realizar o login !', error});
    }
};