const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;