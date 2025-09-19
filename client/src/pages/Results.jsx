import React, { useState, useMemo } from 'react'
import axios from 'axios'
import { FloatingDock } from '../components/FloatingDock'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Results = () => {
  const [electionId, setElectionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const fetchResults = async (e) => {
    e.preventDefault()
    setError('')
    setData(null)
    if (!electionId.trim()) return setError('Enter Election ID')
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
      const res = await axios.get(`${baseUrl}/api/election/${electionId}/results`)
      setData(res.data)
    } catch (err) {
      console.error('Fetch results error', err)
      setError(err.response?.data?.message || 'Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    if (!data) return null
    const labels = data.results.map(r => r.name)
    const counts = data.results.map(r => r.votes)
    return {
      labels,
      datasets: [
        {
          label: 'Votes',
          data: counts,
          backgroundColor: ['#ef4444', '#7c3aed', '#3b82f6', '#10b981', '#f59e0b'],
          borderRadius: 6,
        }
      ]
    }
  }, [data])

  return (
    <div className='bg-black min-h-screen text-white'>
      <FloatingDock />
      <div className='max-w-6xl mx-auto p-6'>
        <h1 className='text-4xl font-bold mb-6 text-white'>Election Results</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-1 bg-white/10 p-6 rounded-md'>
            <h2 className='text-xl font-semibold mb-4'>Find Results</h2>
            <form onSubmit={fetchResults}>
              <input value={electionId} onChange={e => setElectionId(e.target.value)} placeholder='Enter Election ID' className='p-3 rounded w-full text-black' />
              <button className='mt-4 w-full bg-pink-500 hover:bg-pink-600 text-black font-bold py-2 rounded'>{loading ? 'Loading...' : 'Get Results'}</button>
            </form>
            {error && <div className='text-red-400 mt-3'>{error}</div>}
            {data && (
              <div className='mt-6'>
                <h3 className='text-lg font-bold'>{data.election.electionName}</h3>
                <p className='text-sm text-gray-300'>ID: {data.election.electionId}</p>
                <p className='mt-2'>Total votes: <span className='font-bold'>{data.totalVotes}</span></p>
                <p className='mt-2'>Winner(s): <span className='font-bold text-green-400'>{data.winners.length ? data.winners.join(', ') : 'No votes'}</span></p>
              </div>
            )}
          </div>

          <div className='md:col-span-2 bg-white/5 p-6 rounded-md'>
            {data ? (
              <>
                <h3 className='text-xl font-semibold mb-4'>Vote Counts</h3>
                {chartData ? (
                  <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                ) : (
                  <div className='text-gray-300'>No data to display</div>
                )}

                <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {data.results.map((r, idx) => (
                    <div key={idx} className='bg-white/10 p-3 rounded'>
                      <div className='font-bold'>{r.name}</div>
                      <div className='text-sm text-gray-300'>{r.votes} votes</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='text-gray-300'>Enter an Election ID to see results and charts.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
