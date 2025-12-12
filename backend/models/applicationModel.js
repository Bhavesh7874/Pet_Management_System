const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
