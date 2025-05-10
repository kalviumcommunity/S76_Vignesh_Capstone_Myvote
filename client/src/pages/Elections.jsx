import React, { useEffect, useState } from 'react';
import { FloatingDock } from '../components/FloatingDock';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/election/elections');
        if (!res.ok) throw new Error('Failed to fetch elections');
        const data = await res.json();
        setElections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleUpdate = (id) => {
    console.log(`Update election with ID: ${id}`);
    navigate(`/edit-election/${id}`);
  };

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this election?')) return;

  try {
    const res = await axios.delete(`http://localhost:8000/api/election/elections/${id}`);
    if (res.status !== 200) throw new Error('Delete failed');

    setElections((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error(err.message);
    alert('An error occurred while deleting the election.');
  }
};



  return (
    <div className='bg-black w-screen h-screen inset-0 flex items-center justify-center flex-col'>
      <FloatingDock />
      <h1 className='text-5xl sm:text-7xl md:text-5xl font-bold text-red-600 m-4 md:m-8 uppercase'>Upcoming Elections</h1>

      <div className='w-[90%] max-w-[800px] min-h-[400px] bg-white/20 rounded-md p-4 overflow-y-auto'>
        {loading ? (
          <p className='text-white text-center'>Loading...</p>
        ) : error ? (
          <p className='text-red-500 text-center'>{error}</p>
        ) : elections.length === 0 ? (
          <p className='text-white text-center'>No upcoming elections found.</p>
        ) : (
          elections.map((election) => (
            <div
              key={election._id}
              className='bg-white/80 text-black p-4 mb-4 rounded-md shadow-md flex justify-between items-center'
            >
              <div>
                <h2 className='font-bold text-xl'>{election.electionName}</h2>
                <p>ID: {election.electionId}</p>
                <p>Candidates: {election.numberOfCandidates}</p>
                <p>Voters: {election.voters.length}</p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleUpdate(election._id)}
                  className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(election._id)}
                  className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
          
        )}
      </div>
    </div>
  );
};

export default Elections;