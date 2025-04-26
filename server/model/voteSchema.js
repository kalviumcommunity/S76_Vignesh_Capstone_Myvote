const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  voterId: {
    type: String, 
    required: true,
    unique: true, 
  },
  candidate: {
    name: String,
    party: String,
  },
  castedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vote", voteSchema);
