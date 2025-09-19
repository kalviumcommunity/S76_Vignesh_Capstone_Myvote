import React, { useState } from 'react'
import { FloatingDock } from '../components/FloatingDock'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Vote = () => {
  const [electionId, setElectionId] = useState('')
  const [voterId, setVoterId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!electionId.trim() || !voterId.trim()) {
      setError('Both Election ID and Voter ID are required')
      return
    }

    try {
      setLoading(true)

      // Fetch election by electionId to verify voter exists in that election
      // const baseUrl = import.meta.env.VITE_SERVER_URL || ''
      // Call dedicated verification endpoint
      const res = await axios.get(`http://localhost:8000/api/election/${electionId}/voter/${voterId}`)
      const data = res.data
      if (!data || !data.success) {
        setError('Verification failed')
        setLoading(false)
        return
      }

      if (data.alreadyVoted) {
        setError('Voter has already cast their vote for this election')
        setLoading(false)
        return
      }

      // Navigate to voting page
      navigate(`/vote/${electionId}/${voterId}`)
    } catch (err) {
      console.error('Verification error', err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Server error while verifying voter')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-black inset-0'>
      <FloatingDock/>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Enter Voting Details</h2>
        <form onSubmit={handleSubmit}>
          <label className='block mb-2'>
            <span className='text-sm font-medium'>Election ID</span>
            <input
              className='w-full mt-1 p-2 border rounded'
              value={electionId}
              onChange={e => setElectionId(e.target.value)}
              placeholder='Enter Election ID'
            />
          </label>

          <label className='block mb-2'>
            <span className='text-sm font-medium'>Voter ID</span>
            <input
              className='w-full mt-1 p-2 border rounded'
              value={voterId}
              onChange={e => setVoterId(e.target.value)}
              placeholder='Enter Voter ID'
            />
          </label>

          {error && <div className='text-red-600 mb-2'>{error}</div>}

          <button
            type='submit'
            className='w-full bg-blue-600 text-white p-2 rounded mt-4'
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Vote'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Vote
