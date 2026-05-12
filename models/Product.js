const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['bracelet', 'necklace', 'earring', 'ring', 'pendant', 'other']
    },
    material: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        type: String
    },
    origin: {
        type: String,
        default: 'Myanmar'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);