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

const roomSchema = new Schema(
    {
        room_id: { type: String, required: true, unique: true},
        picture: { type: Array, required : true},
        location: {type : Object, required : true},
        price: { type : Number, required : true},
        option: { type : Array, required : true},
        description: {type : String, required : true},
        owner : {type : String, required : true},
        enrolled_date: {type : Date, require : true},
        status: {type : String, required : true},
        comments: {type: Array},
        request_list : {type : Array},

    },
    {
        collection: 'Rooms'
    }

);

const commentSchema = new Schema(
    {
        comment_id: {type : String, required : true, unique : true},
        edit_time: {type : Date, required : true},
        editor_id: {type : String, required: true},
        content : {type : String, required: true},
        star_rating : {type : Number, required: true}
    },
    {
        collecction: 'Comments'
    }
);

const historySchema = new Schema(
    {
        history_id: {type : String, required: true, unique : true},
        room_id = {type: String, required: true},
        date = {type : Date, required : true},
        price = {type : Number, required : true},
        owner = {type : String, required : true}

    },
    {
        collection: 'Histories'
    }
);

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



const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);
const Comment = mongoose.model('Comment', commentSchema);
const History = mongoose.model('History', historySchema);
const Request = mongoose.model('Request', historySchema);

module.exports = User;
module.exports = Room;
module.exports = Comment;
module.exports = History;
module.exports = Request;

