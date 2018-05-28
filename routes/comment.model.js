const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;