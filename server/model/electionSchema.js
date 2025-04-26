// models/Election.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  age: Number,
});

const voterSchema = new mongoose.Schema({
  name: String,
  voterId: String,
  age: Number,
});

const electionSchema = new mongoose.Schema({
  electionId: { type: String, unique: true, required: true },
  electionDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  numberOfCandidates: { type: Number, required: true },
  candidates: [candidateSchema],
  voters: [voterSchema],
});

module.exports = mongoose.model("Election", electionSchema);
