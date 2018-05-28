const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        type: { type: String, required: true },
        verify_code: String,
        is_verified: { type: Boolean, default: false }
    },
    {
        collection: 'Users'
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;