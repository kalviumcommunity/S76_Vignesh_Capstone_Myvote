import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FloatingDock } from '../components/FloatingDock'

const StartVote = () => {
  const { electionId, voterId } = useParams()
  const [election, setElection] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
        const res = await axios.get(`${baseUrl}/api/election/${electionId}/voter/${voterId}`)
        if (!res.data || !res.data.success) throw new Error('Verification failed')
        const electionRes = await axios.get(`${baseUrl}/api/election/elections/${electionId}`)
        setElection(electionRes.data)
      } catch (err) {
        console.error(err)
        setError('Unable to load election or verify voter')
      } finally {
        setLoading(false)
      }
    }
    fetchElection()
  }, [electionId, voterId])

  const handleSubmit = async () => {
    if (!selected) return setError('Select a candidate')
    try {
      setError('')
      const baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
      const res = await axios.post(`${baseUrl}/api/election/${electionId}/vote`, { voterId, candidate: selected })
      if (res.data && res.data.success) {
        alert('Vote cast successfully')
        navigate('/')
      } else {
        setError(res.data.message || 'Vote failed')
      }
    } catch (err) {
      console.error('Vote error', err)
      setError(err.response?.data?.message || 'Server error while casting vote')
    }
  }

  if (loading) return <div className='text-white text-center mt-10'>Loading...</div>
  if (error) return <div className='text-red-500 text-center mt-8'>{error}</div>

  return (
    <div className='bg-black min-h-screen text-white flex flex-col items-center'>
      <FloatingDock />
      <h1 className='text-3xl font-bold mt-6'>{election?.electionName || 'Election'}</h1>
      <div className='w-full max-w-2xl bg-white/10 p-6 rounded mt-6'>
        <h2 className='text-xl font-semibold mb-4'>Candidates</h2>
        <div className='grid grid-cols-1 gap-3'>
          {election?.candidates?.map((c, idx) => (
            <label key={idx} className='flex items-center gap-3 p-3 bg-white/5 rounded cursor-pointer'>
              <input type='radio' name='candidate' value={c.name} onChange={() => setSelected(c.name)} />
              <div>
                <div className='font-bold'>{c.name}</div>
                <div className='text-sm'>{c.party}</div>
              </div>
            </label>
          ))}
        </div>

        <div className='flex gap-3 mt-6'>
          <button onClick={handleSubmit} className='bg-green-600 px-4 py-2 rounded'>Cast Vote</button>
          <button onClick={() => navigate(-1)} className='bg-gray-600 px-4 py-2 rounded'>Back</button>
        </div>
      </div>
    </div>
  )
}

export default StartVote
