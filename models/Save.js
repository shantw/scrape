var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create Save schema

var SaveSchema = new Schema({
  // title is a required
  title: {
    type: String,
    required: true
  },
  // link is a required
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
  },
   byline: {
   type: String,
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Save = mongoose.model("Save", SaveSchema);

module.exports = Save;
