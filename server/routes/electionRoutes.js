const express = require("express");
const router = express.Router();
const Election = require("../model/electionSchema");
const upload = require("../middleware/upload");

// POST /new-election
router.post("/new-election", upload.array("symbols"), async (req, res) => {
  try {
    const {
      electionId,
      electionName,
      electionDate,
      startTime,
      endTime,
      numberOfCandidates,
      candidates,
      voters
    } = req.body;

    // Parse candidate and voter JSON
    const parsedCandidates = JSON.parse(candidates);
    const parsedVoters = JSON.parse(voters);

    // Attach Cloudinary image URLs to candidates
    parsedCandidates.forEach((candidate, index) => {
      candidate.symbol = req.files[index]?.path || "";
    });

    const election = new Election({
      electionId,
      electionName,
      electionDate,
      startTime,
      endTime,
      numberOfCandidates,
      candidates: parsedCandidates,
      voters: parsedVoters
    });

    const savedElection = await election.save();
    res.status(201).json(savedElection);
  } catch (error) {
    console.error("Error saving election:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET /voter/:voterId
router.get("/voter/:voterId", async (req, res) => {
  try {
    const { voterId } = req.params;

    const election = await Election.findOne({ "voters.voterId": voterId });

    if (!election) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const voter = election.voters.find(v => v.voterId === voterId);

    if (!voter) {
      return res.status(404).json({ message: "Voter not found in election" });
    }

    res.json({ name: voter.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
