const express = require("express");
const router = express.Router();
const Election = require("../model/electionSchema");
const upload = require("../middleware/upload");
const Vote = require('../model/voteSchema');
let blockchainHelper;
try {
  blockchainHelper = require('../blockchain');
} catch (e) {
  // not available or not configured
  blockchainHelper = null;
}

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

// GET /:electionId/voter/:voterId -> verify voter belongs to election and voting status
router.get('/:electionId/voter/:voterId', async (req, res) => {
  try {
    const { electionId, voterId } = req.params;

    // Find election by electionId field (not _id)
    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: 'Election not found' });

    const voter = election.voters.find(v => v.voterId === voterId);
    if (!voter) return res.status(404).json({ message: 'Voter not found in this election' });

    // Check if voter already casted a vote for this election
    const alreadyVoted = await Vote.findOne({ electionId: election._id, voterId });

    res.json({
      success: true,
      election: { _id: election._id, electionId: election.electionId, electionName: election.electionName },
      voter: { votername: voter.votername, voterId: voter.voterId, age: voter.age },
      alreadyVoted: !!alreadyVoted
    });
  } catch (err) {
    console.error('Verify voter error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /:electionId/vote -> cast a vote
router.post('/:electionId/vote', async (req, res) => {
  try {
    const { electionId } = req.params;
    const { voterId, candidate } = req.body; // candidate can be name or candidate object

    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: 'Election not found' });

    const voter = election.voters.find(v => v.voterId === voterId);
    if (!voter) return res.status(404).json({ message: 'Voter not found in this election' });

    // Prevent double voting
    const already = await Vote.findOne({ electionId: election._id, voterId });
    if (already) return res.status(400).json({ message: 'Voter has already voted' });

    // Accept candidate as { name, party } or name string
    let selected = candidate;
    if (typeof candidate === 'string') {
      const found = election.candidates.find(c => c.name === candidate);
      selected = found ? { name: found.name, party: found.party } : { name: candidate };
    }

    // Try to record vote on blockchain only when env is configured
    const canUseBlockchain = blockchainHelper &&
      typeof blockchainHelper.castVoteOnChain === 'function' &&
      process.env.BLOCKCHAIN_PROVIDER_URL &&
      process.env.BLOCKCHAIN_PRIVATE_KEY &&
      process.env.ENABLE_BLOCKCHAIN === 'true';

    if (canUseBlockchain) {
      try {
        await blockchainHelper.castVoteOnChain({ electionId: election.electionId, voterId, candidate: selected.name || selected });
      } catch (chainErr) {
        // Log error but continue to save locally so users can still vote
        console.error('Blockchain cast failed, saving locally instead', chainErr);
      }
    } else {
      if (blockchainHelper) console.info('Blockchain helper loaded but provider/private key not configured; skipping blockchain recording');
    }

    const vote = new Vote({ electionId: election._id, voterId, candidate: selected });
    try {
      await vote.save();
    } catch (saveErr) {
      // Handle duplicate key errors (e.g., unique index violations)
      if (saveErr && saveErr.code === 11000) {
        console.warn('Duplicate vote detected when saving:', saveErr.keyValue || saveErr.message);
        return res.status(400).json({ success: false, message: 'Voter has already voted' });
      }
      console.error('Error saving vote to DB:', saveErr);
      return res.status(500).json({ success: false, message: 'Failed to record vote' });
    }

    res.json({ success: true, message: 'Vote recorded' });
  } catch (err) {
    console.error('Cast vote error', err);
    res.status(500).json({ message: 'Server error' });
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
    const id = req.params.id;
    let election = null;

    // Try by Mongo _id first
    try {
      election = await Election.findById(id);
    } catch (e) {
      // ignore cast errors
      election = null;
    }

    // If not found by _id, try electionId field
    if (!election) {
      election = await Election.findOne({ electionId: id });
    }

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.status(200).json(election);
  } catch (err) {
    console.error("Error fetching election:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:electionId/results -> compute vote counts and winner(s)
router.get('/:electionId/results', async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: 'Election not found' });

    // Aggregate votes for this election
    const votes = await Vote.find({ electionId: election._id });

    const counts = {};
    votes.forEach(v => {
      const name = v.candidate?.name || v.candidate || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });

    // Build result array
    const resultArray = Object.keys(counts).map(name => ({ name, votes: counts[name] }));

    // Determine winners (could be tie)
    let maxVotes = 0;
    resultArray.forEach(r => { if (r.votes > maxVotes) maxVotes = r.votes });
    const winners = resultArray.filter(r => r.votes === maxVotes).map(r => r.name);

    res.json({ election: { electionId: election.electionId, electionName: election.electionName }, results: resultArray, winners, totalVotes: votes.length });
  } catch (err) {
    console.error('Error computing results', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
