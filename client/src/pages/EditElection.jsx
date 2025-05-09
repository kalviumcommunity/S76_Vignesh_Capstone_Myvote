import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ScrollArea } from '../components/ui/scroll-area';
import { FloatingDock } from '../components/FloatingDock';
import { Trash2 } from 'lucide-react';
import { IconFileExcel } from '@tabler/icons-react';

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
);

const UpdateElection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/election/elections/${id}`);
        setElection(res.data);
      } catch (err) {
        console.error("Failed to fetch election:", err);
        alert("Failed to load election data");
        navigate('/elections');
      }
    };
    fetchElection();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElection((prev) => ({ ...prev, [name]: value }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updated = [...election.candidates];
    updated[index][field] = value;
    setElection({ ...election, candidates: updated });
  };

  const handleVoterChange = (index, field, value) => {
    const updated = [...election.voters];
    updated[index][field] = value;
    setElection({ ...election, voters: updated });
  };

  const addCandidate = () => {
    const updated = [...election.candidates, { name: "", party: "", symbol: null }];
    setElection({ ...election, candidates: updated, numberOfCandidates: updated.length });
  };

  const deleteCandidate = (index) => {
    const updated = election.candidates.filter((_, i) => i !== index);
    setElection({ ...election, candidates: updated, numberOfCandidates: updated.length });
  };

  const addVoter = () => {
    setElection({ ...election, voters: [...election.voters, { votername: "", voterId: "", age: "" }] });
  };

  const deleteVoter = (index) => {
    const updated = election.voters.filter((_, i) => i !== index);
    setElection({ ...election, voters: updated });
  };

  const handleSymbolUpload = (index, file) => {
    const updated = [...election.candidates];
    updated[index].symbol = file;
    setElection({ ...election, candidates: updated });
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

      Object.entries(election).forEach(([key, val]) => {
        if (key === "candidates") {
          val.forEach((c) => {
            if (c.symbol instanceof File) formData.append("symbols", c.symbol);
          });
          const cList = val.map(({ name, party }) => ({ name, party }));
          formData.append("candidates", JSON.stringify(cList));
        } else if (key === "voters") {
          formData.append("voters", JSON.stringify(val));
        } else {
          formData.append(key, val);
        }
      });

      await axios.put(`http://localhost:8000/api/election/elections/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Election updated successfully!");
      navigate("/elections");
    } catch (err) {
      console.error("Error updating election:", err);
      alert("Update failed.");
    }
  };

  if (!election) return <div className='text-white text-2xl text-center mt-10'>Loading...</div>;

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-black inset-0 flex-col gap-2'>
      <FloatingDock />
      <h1 className='text-5xl font-bold mb-6 text-center text-yellow-500'>Update Election</h1>
      <ScrollArea className='flex flex-col justify-center items-center w-[900px] h-full bg-white/20 p-6 gap-8 overflow-y-auto'>
        <div className='grid grid-cols-3 gap-8'>
          <InputGroup label="Election Id" type="text" id="electionid" name="electionId" value={election.electionId} onChange={handleChange} />
          <InputGroup label="Election Name" type="text" id="electionName" name="electionName" value={election.electionName} onChange={handleChange} />
          <InputGroup label="Election Date" type="date" id="electionDate" name="electionDate" value={election.electionDate} onChange={handleChange} />
          <InputGroup label="Start Time" type="time" id="startTime" name="startTime" value={election.startTime} onChange={handleChange} />
          <InputGroup label="End Time" type="time" id="endTime" name="endTime" value={election.endTime} onChange={handleChange} />
          <InputGroup label="Number of Candidates" type="number" id="numberOfCandidates" name="numberOfCandidates" value={election.numberOfCandidates} onChange={handleChange} />
        </div>

        <div className='flex flex-col gap-4 mt-6 justify-center items-center'>
          <h2 className='text-red-600 text-2xl font-bold'>Candidates</h2>
          {election.candidates.map((candidate, index) => (
            <div key={index} className='flex gap-4 items-end'>
              <InputGroup label="Name" type="text" id={`cname-${index}`} name="name" value={candidate.name} onChange={(e) => handleCandidateChange(index, "name", e.target.value)} />
              <InputGroup label="Party" type="text" id={`party-${index}`} name="party" value={candidate.party} onChange={(e) => handleCandidateChange(index, "party", e.target.value)} />
              <div className='flex flex-col gap-2'>
                <label className='text-white text-xl font-bold'>Symbol</label>
                <input type="file" accept="image/*" onChange={(e) => handleSymbolUpload(index, e.target.files[0])} />
              </div>
              <button onClick={() => deleteCandidate(index)} className='text-red-500'><Trash2 /></button>
            </div>
          ))}
          <button onClick={addCandidate} className='text-white bg-green-600 px-4 py-2 rounded'>+ Add Candidate</button>
        </div>

        <div className='flex flex-col gap-4 mt-6 justify-center items-center'>
          <h2 className='text-red-600 text-2xl font-bold'>Voters</h2>
          {election.voters.map((voter, index) => (
            <div key={index} className='flex gap-4 items-end'>
              <InputGroup label="Name" type="text" id={`vname-${index}`} name="votername" value={voter.votername} onChange={(e) => handleVoterChange(index, "votername", e.target.value)} />
              <InputGroup label="Voter ID" type="text" id={`vid-${index}`} name="voterId" value={voter.voterId} onChange={(e) => handleVoterChange(index, "voterId", e.target.value)} />
              <InputGroup label="Age" type="number" id={`vage-${index}`} name="age" value={voter.age} onChange={(e) => handleVoterChange(index, "age", e.target.value)} />
              <button onClick={() => deleteVoter(index)} className='text-red-500'><Trash2 /></button>
            </div>
          ))}
          <button onClick={addVoter} className='text-white bg-green-600 px-4 py-2 rounded'>+ Add Voter</button>
          <label className='text-white text-xl font-bold mt-4'>Import Voters from Excel:</label>
          <div className='flex items-center gap-3'>
           <label className='px-4 py-2 mt-2 text-green-600 text-xl rounded-md border-2 border-green-600 flex gap-2 hover:bg-green-700 hover:text-white cursor-pointer'>
                <IconFileExcel />
                    Import from Excel
                    <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className='px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white text-xl rounded-md mb-20 ml-[330px] mt-8 '
        >
          Update Election
        </button>
      </ScrollArea>
    </div>
  );
};

export default UpdateElection;
