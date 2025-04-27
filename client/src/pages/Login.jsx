import React, { useState } from 'react'
import { FloatingDock } from '../components/FloatingDock'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import login from '../assets/images/Login.lottie'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = () => {
        if (!username || !password) {
          toast.error('Please fill in both fields.')
        } else {
            axios.post('http://localhost:8000/api/login', {
                email,
                password,
            },
            {
                withCredentials: true,
            })
            .then(response => {
                console.log(response.data)
                toast.success('Login successful!')
                navigate('/admin')
            }
            ).catch(error => {
                console.error('Login error:', error)
                toast.error('Invalid credentials. Please try again.')
            })
        }
      }

  return (
    <div className="bg-black flex flex-col items-center justify-center inset-0 overflow-x-hidden w-screen h-screen">
      <FloatingDock />
      <div className='w-screen grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 text-center lg:text-left'>
        {/* Left Side - Login Form */}
        <div className='flex flex-col items-center justify-center text-white'>
          <div className='flex flex-col items-center justify-center h-[400px] w-[400px] bg-white/15 rounded-2xl'>
            <h1 className='text-3xl font-bold text-red-500'>Administrative Login</h1>
            <div className='flex flex-col items-start justify-end w-full px-8 mt-8'>
              <label htmlFor="username">Email or Username</label>
              <input 
                id="username"
                type="text"
                placeholder='Email or Username'
                className='bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 m-2'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password</label>
              <div className="relative w-full max-w-md">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className='bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 m-2'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-white hover:text-white/50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className='flex items-center justify-between w-full px-10 pb-4 mt-4'>
              <p className='text-sm'>Don't have an account? <span  onClick={() => navigate('/signup')} className='text-blue-500 cursor-pointer hover:underline'>Sign Up</span></p>
              <p className='text-sm cursor-pointer hover:underline' onClick={() => navigate('/forgot-password')}>Forgot Password</p>
            </div>
            <button className='bg-[#080064] text-white font-bold py-2 px-4 rounded-lg w-[150px]  h-12 mt-4 text-lg' onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div className='flex flex-col items-center justify-center mt-6 lg:mt-0 text-center w-[500px]'>
          <DotLottieReact
            src={login}
            autoplay
            loop
            style={{ width: '450px', height: '450px' }}
          />
          <p className='text-red-500 text-xl sm:text-[18px] m-4'>
            *Only authorized administrative personnel are allowed to log in. Unauthorized access is strictly prohibited.
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
