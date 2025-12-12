const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true, // e.g., 'Dog', 'Cat'
    },
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['adoption', 'sale'],
        default: 'adoption',
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted', 'sold'],
        default: 'available',
    },
    images: [{
        type: String,
    }],
}, {
    timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
