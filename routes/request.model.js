const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema(
    {
        request_id: {type : String, required : true, unique : true},
        status = {type: String, required : true},
        room_id = {type: String, required: true},
        requested_user_id = {type : String, required: true}
    },
    {
        collection: 'Requests'
    }
);

const Request = mongoose.model('Request', historySchema);

module.exports = Request;