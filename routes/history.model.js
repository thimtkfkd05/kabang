const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const History = mongoose.model('History', historySchema);

module.exports = History;