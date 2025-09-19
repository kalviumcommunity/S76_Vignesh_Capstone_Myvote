import React, { useEffect, useState } from 'react'
import { FloatingDock } from '../components/FloatingDock'
import Loader from '../components/Loder'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconLogout2 , IconPlus } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'
import { useSelector } from 'react-redux'

const AdminDashBoard = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [electionCount , setElectionCount] = useState(0)

  const email = useSelector((state) => state.user.email)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dash/dash-user', {
          params: { email },  // wrap email in object
          withCredentials: true
        })
        setUser(response.data)
        console.log(response.data.firstName)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    if (email) {
      fetchUserData()
    }
  }, [email])

  useEffect(() => {
    const fetchElectionCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dash/election-count')
        setElectionCount(response.data)
      } catch (error) {
        console.error('Failed to fetch election count:', error)
      }
    }
    fetchElectionCount()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='flex flex-col items-center justify-center h-screen w-screen inset-0 bg-black gap-4 p-3'>
          <FloatingDock />
          <h1 className='text-5xl font-bold text-white mt-4'>
            Hello, <span className='text-pink-500'>{user?.firstName || 'User'}</span>
          </h1>
          <div className='w-full h-full flex justify-center items-center gap-4 p-2'>
            <div className='h-full w-[400px] flex justify-center items-center ml-9'>
              <div className='w-full h-full flex flex-col justify-start items-center bg-white/20 rounded-md gap-2 p-4'>
                <h1 className='text-2xl font-bold text-white cursor-pointer'>Live Status</h1>
                <h1 className='text-2xl font-bold text-white cursor-pointer' onClick={() => navigate('/new-election')}>New Election</h1>
                <h1 className='text-2xl font-bold text-white cursor-pointer'>Result</h1>
                <h1 className='text-2xl font-bold text-white cursor-pointer'>Voter List</h1>
                <h1 className='text-2xl font-bold text-white cursor-pointer'>Profile</h1>
                <h1 className='text-2xl font-bold text-white cursor-pointer'>Settings</h1>
                <div
                  className='w-[180px] h-[50px] bg-white flex justify-center items-center mt-40 rounded-lg gap-2'
                  onClick={handleLogout}
                >
                  <h1 className='text-2xl font-bold text-black'>Logout</h1>
                  <IconLogout2 />
                </div>
              </div>
            </div>
            <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
              <div className='flex justify-center items-center gap-3'>
                <div className='w-[150px] h-[150px] bg-red-500 hover:scale-125 rounded-md flex justify-center items-center '>
                  <h1 className='text-2xl font-bold text-black'>Live Status</h1>
                </div>
                <div className='w-[150px] h-[150px] bg-violet-600 hover:scale-125 rounded-md flex justify-center items-center flex-col p-3 text-center'
                      onClick={() => navigate('/elections')}>
                  <h1 className='text-xl font-bold text-black'>Upcoming Elections</h1>
                  <p className='text-5xl font-bold text-red-600'>{electionCount}</p>
                </div>
              </div>
              <div className='flex justify-center items-center gap-3'>
                <div className='w-[150px] h-[150px] bg-blue-600 hover:scale-125 rounded-md flex justify-center items-center'>
                  <h1 className='text-2xl font-bold text-black'>Result</h1>
                </div>
                <div
                  className='w-[150px] h-[150px] bg-green-500 hover:scale-125 preserve-3d flex justify-center items-center flex-col gap-3 p-3 rounded-md'
                  onClick={() => navigate('/new-election')}
                >
                  <IconPlus className='w-10 h-10' />
                  <p className='text-xl font-bold text-black'>New Election</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashBoard
