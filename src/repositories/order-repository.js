'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async () => {
    return await Order.find({}, 'number status')
        .populate('customer', 'name')
        .populate('items.product', 'title');
}

exports.create = async (body) => {
    const order = new Order(body);
    
    return await order.save();
}