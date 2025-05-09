import React from 'react'
import { FloatingDock } from '../components/FloatingDock'

const Vote = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen bg-black inset-0'>
        <FloatingDock/>
        <h1 className='text-5xl sm:text-7xl md:text-5xl font-bold text-white m-4 md:m-8 uppercase'>Welcome to MyVote</h1>
    </div>
  )
}

export default Vote
