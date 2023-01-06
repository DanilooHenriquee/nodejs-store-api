'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    return await Product
        .find({
            active: true
        }, 'title price slug');
};

exports.getById = async (id) => {
    return await Product        
        .findById(id);
};

exports.getBySlug = async (slug) => {
    return await Product        
        .findOne({
            active: true,
            slug
        }, 'title description price slug tags');
};

exports.getByTag = async (tag) => {
    return await Product
        .find({
            active: true,            
            tags: tag
        }, 'title description price slug tags');
};

exports.create = async (body) => {
    const product = new Product(body);
    
    return await product.save();
}

exports.update = async (id, body) => {
    return await Product
        .findByIdAndUpdate(id, {
            $set: {
                title: body.title,
                description: body.description,
                price: body.price,
                slug: body.slug
            }
        });
}

exports.delete = async (id) => {
    return await Product
        .findByIdAndRemove(id);
}