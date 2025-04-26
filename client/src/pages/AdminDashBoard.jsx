import React from 'react'
import { FloatingDock } from '../components/FloatingDock'
import Loader from '../components/Loder'
import { useEffect, useState } from 'react'

const AdminDashBoard = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // useEffect(()=>{
  //   const name = axios.get('http://localhost:8000/api/admin/user');
  //   console.log(name.data.name)

  // })

  return (
    <>
    {loading ? (<Loader/>):(
      <div className='flex items-center justify-center h-screen w-screen inset-0 bg-black'>
        <FloatingDock />
        {/* <h1>{`Hello, ${name.data.name}`}</h1> */}
      </div>
    )}
    </>
  )
}

export default AdminDashBoard
