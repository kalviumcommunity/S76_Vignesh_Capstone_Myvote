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

// Ensure a voter can vote only once per election (compound unique index)
voteSchema.index({ electionId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
