const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
      room_id: { type: String, required: true, unique: true},
      picture: { type: Array, required : true},
      location: {lat: Number, lng : Number, required : true},
      deposit: { type : Number, required : true},
      monthly: {type : Number, required: true},
      option: { type : Array, required : true},
      description: {type : String, required : true},
      owner : {type : String, required : true},
      enrolled_date: {type : String, require : true},
      status: {type : String, required : true},
      comments: {type: Array},
      request_list : {type : Array},
      type : {type : String, required : true},
      address : { type: String}
  },
  {
      collection: 'Rooms'
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;