import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { ScrollArea } from '../components/ui/scroll-area'
import { FloatingDock } from '../components/FloatingDock'
import { Trash2 } from 'lucide-react'
import { IconFileExcel } from '@tabler/icons-react'
import axios from 'axios'

const InputGroup = ({ label, type, id, name, value, onChange }) => (
  <div className='flex flex-col gap-2'>
    <label htmlFor={id} className='text-white text-xl font-bold'>{label}:</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className='w-[230px] h-10 p-2 text-black font-bold text-xl'
    />
  </div>
)

const NewElection = () => {
  const [election, setElection] = useState({
    electionId: "",
    electionName: "",
    electionDate: "",
    startTime: "",
    endTime: "",
    numberOfCandidates: 1,
    candidates: [{ name: "", party: "", symbol: null }],
    voters: [{ votername: "", voterId: "", age: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElection((prev) => ({ ...prev, [name]: value }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updated = [...election.candidates];
    updated[index][field] = value;
    setElection({ ...election, candidates: updated });
  };

  const addCandidate = () => {
    setElection({
      ...election,
      candidates: [...election.candidates, { name: "", party: "", symbol: null }],
      numberOfCandidates: election.candidates.length + 1,
    });
  };

  const deleteCandidate = (index) => {
    const updated = election.candidates.filter((_, i) => i !== index);
    setElection({ ...election, candidates: updated, numberOfCandidates: updated.length });
  };

  const handleVoterChange = (index, field, value) => {
    const updated = [...election.voters];
    updated[index][field] = value;
    setElection({ ...election, voters: updated });
  };

  const addVoter = () => {
    setElection({
      ...election,
      voters: [...election.voters, { votername: "", voterId: "", age: "" }],
    });
  };

  const deleteVoter = (index) => {
    const updated = election.voters.filter((_, i) => i !== index);
    setElection({ ...election, voters: updated });
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const parsedVoters = data.slice(1).map(row => ({
        votername: row[0] || "",
        voterId: row[1] || "",
        age: row[2] || ""
      }));

      setElection(prev => ({
        ...prev,
        voters: [...prev.voters, ...parsedVoters]
      }));
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
  
      formData.append("electionId", election.electionId);
      formData.append("electionName", election.electionName);
      formData.append("electionDate", election.electionDate);
      formData.append("startTime", election.startTime);
      formData.append("endTime", election.endTime);
      formData.append("numberOfCandidates", election.numberOfCandidates);
  
      // 1. Add symbols to formData
      election.candidates.forEach((candidate) => {
        if (candidate.symbol) {
          formData.append("symbols", candidate.symbol); // backend expects `symbols` as array
        }
      });
  
      // 2. Append candidates and voters as JSON strings
      const candidateData = election.candidates.map(({ name, party }) => ({ name, party }));
      formData.append("candidates", JSON.stringify(candidateData));
      formData.append("voters", JSON.stringify(election.voters));
  
      const response = await axios.post(
        "http://localhost:8000/api/election/new-election",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      alert("Election created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election");
    }
  };
  
  

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-black inset-0 flex-col gap-2'>
      <FloatingDock />
      <h1 className='text-5xl font-bold mb-6 text-center text-red-500'>New Election Creation</h1>
      <ScrollArea className='flex flex-col justify-center items-center w-[900px] h-full bg-white/20 p-6 gap-8 overflow-y-auto'>
      <div className='flex justify-around items-center gap-2 w-full rounded-md'>
          <InputGroup
            label="Election ID"
            type="text"
            id="electionId"
            name="electionId"
            value={election.electionId}
            onChange={handleChange}
          />
          <InputGroup
            label="Election Name"
            type="text"
            id="electionName"
            name="electionName"
            value={election.electionName}
            onChange={handleChange}
          />
          <InputGroup
            label="Election Date"
            type="date"
            id="electionDate"
            name="electionDate"
            value={election.electionDate}
            onChange={handleChange}
          />
        </div>

        <div className='flex justify-around items-center gap-2 w-full mt-8 mb-8'>
          <InputGroup
            label="Start Time"
            type="time"
            id="startTime"
            name="startTime"
            value={election.startTime}
            onChange={handleChange}
          />
          <InputGroup
            label="End Time"
            type="time"
            id="endTime"
            name="endTime"
            value={election.endTime}
            onChange={handleChange}
          />
          <InputGroup
            label="Number of Candidates"
            type="number"
            id="numberOfCandidates"
            name="numberOfCandidates"
            value={election.numberOfCandidates}
            onChange={handleChange}
          />
        </div>

        {/* Candidates */}
        <div className='flex flex-col items-center gap-4 w-full'>
          <h1 className='text-3xl font-bold text-center text-red-500'>Candidates</h1>
          {election.candidates.map((candidate, index) => (
            <div key={index} className='flex justify-between items-center gap-4 w-full'>
              <InputGroup
                label="Name"
                type="text"
                id={`candidate-name-${index}`}
                name="name"
                value={candidate.name}
                onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
              />
              <InputGroup
                label="Party"
                type="text"
                id={`candidate-party-${index}`}
                name="party"
                value={candidate.party}
                onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
              />
              <div className='flex flex-col gap-2'>
                <label htmlFor={`symbol-${index}`} className='text-white text-xl font-bold'>Symbol:</label>
                <input
                  type="file"
                  id={`symbol-${index}`}
                  name="symbol"
                  onChange={(e) => handleCandidateChange(index, "symbol", e.target.files[0])}
                  className='w-[230px] h-10 p-1 text-black font-bold text-xl bg-white rounded'
                />
              </div>
              <button
                onClick={() => deleteCandidate(index)}
                className='p-2 text-red-600 hover:text-red-800 mt-8'
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
          <button
            onClick={addCandidate}
            className='px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 text-white text-xl rounded-md'
          >
            + Add Candidate
          </button>
        </div>

        {/* Voters */}
        <div className='flex flex-col items-center gap-4 w-full mt-8 mb-8'>
          <h1 className='text-3xl font-bold text-center text-red-500'>Voters List:</h1>
          {election.voters.map((voter, index) => (
            <div key={index} className='flex justify-between items-center gap-4 w-full'>
              <InputGroup
                label="Name"
                type="text"
                id={`voter-name-${index}`}
                name="votername"
                value={voter.votername}
                onChange={(e) => handleVoterChange(index, "votername", e.target.value)}
              />
              <InputGroup
                label="Voter Id"
                type="text"
                id={`voter-id-${index}`}
                name="voterId"
                value={voter.voterId}
                onChange={(e) => handleVoterChange(index, "voterId", e.target.value)}
              />
              <InputGroup
                label="Age"
                type="text"
                id={`voter-age-${index}`}
                name="age"
                value={voter.age}
                onChange={(e) => handleVoterChange(index, "age", e.target.value)}
              />
              <button
                onClick={() => deleteVoter(index)}
                className='p-2 text-red-600 hover:text-red-800 mt-8'
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
          <div className='flex items-center justify-evenly w-full'>
            <label className='px-4 py-2 mt-2 text-green-600 text-xl rounded-md border-2 border-green-600 flex gap-2 hover:bg-green-700 hover:text-white cursor-pointer'>
              <IconFileExcel />
              Import from Excel
              <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
            </label>
            <button
              onClick={addVoter}
              className='px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 text-white text-xl rounded-md'
            >
              + Add Voter
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-md mb-20 ml-[330px]'
        >
          Submit Election
        </button>
      </ScrollArea>
    </div>
  );
};

export default NewElection;
