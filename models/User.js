const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        default: "Nombre no señalado",
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: true,
        default: "Apellido no señalado",
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 16,
        max: 90,
        required: true
    },
    newsletter: {
        type: Boolean,
    },
    favoriteProducts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'product' 
        }
    ]
})

const User = mongoose.model('user', userSchema);

module.exports = User;
