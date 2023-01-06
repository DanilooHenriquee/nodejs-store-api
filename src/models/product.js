'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'O Title é obrigatório'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'O Slug é obrigatório'],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: [true,'A Description é obrigatória']
    },
    price: {
        type: Number,
        required: [true, 'O Price é obrigatório']
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{
        type: String,
        required: [true, 'As Tags são obrigatórias']
    }],
    // image: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }
});

module.exports = mongoose.model('Product', schema);