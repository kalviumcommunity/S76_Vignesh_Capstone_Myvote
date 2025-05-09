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

router.get("/elections", async (req, res) => {
  try {
    const today = new Date();
    const elections = await Election.find({ electionDate: { $gt: today } });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/elections/:id", async (req, res) => {
  try {
    const deletedElection = await Election.findByIdAndDelete(req.params.id);

    if (!deletedElection) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/election/elections/:id
router.put("/elections/:id", upload.array("symbols"), async (req, res) => {
  try {
    const {
      title,
      organization,
      electionType,
      numberOfCandidates,
      candidates,
      voters,
    } = req.body;

    const parsedCandidates = JSON.parse(candidates);
    const parsedVoters = JSON.parse(voters);

    const symbols = req.files;

    const updatedCandidates = parsedCandidates.map((candidate, index) => ({
      ...candidate,
      symbolUrl: symbols[index] ? `/uploads/${symbols[index].filename}` : undefined,
    }));

    await Election.findByIdAndUpdate(req.params.id, {
      title,
      organization,
      electionType,
      numberOfCandidates,
      candidates: updatedCandidates,
      voters: parsedVoters,
    });

    res.status(200).json({ message: "Election updated successfully" });
  } catch (err) {
    console.error("Update failed", err);
    res.status(500).json({ error: "Update failed" });
  }
});

router.get('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.status(200).json(election);
  } catch (err) {
    console.error("Error fetching election:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
