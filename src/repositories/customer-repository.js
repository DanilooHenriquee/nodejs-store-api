'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async () => {
    return await Customer.find({});
}

exports.create = async (body) => {
    const customer = new Customer(body);
    
    return await customer.save();
}

exports.authenticate = async (body) => {
    return await Customer.findOne({
        email: body.email,
        password: body.password
    });
}

exports.getById = async (id) => {
    return await Customer.findById(id);
}