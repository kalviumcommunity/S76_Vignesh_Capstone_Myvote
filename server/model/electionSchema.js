// models/Election.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  symbol: String
});

const voterSchema = new mongoose.Schema({
  votername: String,
  voterId: String,
  age: Number,
});

const electionSchema = new mongoose.Schema({
  electionId: { type: String, unique: true, required: true },
  electionName: { type: String, unique: true, required: true },
  electionDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  numberOfCandidates: { type: Number, required: true },
  candidates: [candidateSchema],
  voters: [voterSchema],
});

module.exports = mongoose.model("Election", electionSchema);
