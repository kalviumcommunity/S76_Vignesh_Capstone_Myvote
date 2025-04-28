import React, { useState ,useEffect } from 'react'
import { FloatingDock } from '../components/FloatingDock'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import signup from '../assets/images/SignUp.lottie'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ScrollArea } from '../components/ui/scroll-area'
import axios from 'axios'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../components/ui/input-otp'

const Signup = () => {
  const navigate = useNavigate()

  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState('Admin')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Signup handler
  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !email || !mobile || !role || !password || !confirmPassword) {
      toast.error('All fields are required')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const res = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          mobile: `${countryCode}${mobile}`,
          role,
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')

      toast.success('Registered successfully! Please check your email for OTP')
      try {
        await axios.post('http://localhost:8000/api/send-otp', { email })
        setOtpSent(true)
        setResendTimer(60)
      } catch (err) {
        console.error(err)
        toast.error(err?.message || 'Failed to send OTP')
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Signup failed')
    }
  }

  // OTP verification handler
  const handleVerifyOtp = async () => {
    try {
      await axios.post('http://localhost:8000/api/verify-otp', { email, otp })
      toast.success('OTP verified successfully')
      navigate('/login')
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to verify OTP')
    }
  }

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:8000/api/send-otp', { email })
      toast.success('OTP resent successfully')
      setResendTimer(60)
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to resend OTP')
    }
  }

  useEffect(() => {
    if (resendTimer === 0) return;
    const id = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer])

  return (
    <div className="bg-black h-screen flex justify-center items-center w-screen">
      <FloatingDock />
      <div className="w-screen grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 text-center lg:text-left">

        {/* Animation Section */}
        <div className="flex flex-col items-center justify-center ml-2 md:ml-5">
          <DotLottieReact
            autoplay
            loop
            src={signup}
            style={{ width: '400px', height: '400px' }}
          />
        </div>

        {/* Signup Form */}
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="text-red-500 text-2xl font-bold mt-4 mb-3">
            ADMINISTRATIVE REGISTER
          </h1>
          <ScrollArea className="max-h-[75vh] w-[460px] bg-white/20 flex flex-col items-center justify-center rounded-2xl overflow-y-auto">
            <form className="flex flex-col items-start w-full px-8 mt-8">

              {/* First Name */}
              <label htmlFor="firstName" className="text-white ml-2 mt-2">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 mb-2"
              />

              {/* Last Name */}
              <label htmlFor="lastName" className="text-white ml-2 mt-2">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 mb-2"
              />

              {/* Username */}
              <label htmlFor="username" className="text-white ml-2 mt-2">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 mb-2"
              />

              {/* Email */}
              <label htmlFor="email" className="text-white ml-2 mt-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 mb-2"
              />

              {/* Mobile Number */}
              <label htmlFor="mobile" className="text-white ml-2 mt-2">Mobile Number</label>
              <div className="flex gap-2 w-full mb-2">
                <input
                  id="countryCode"
                  type="text"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="bg-white/10 text-white w-[70px] h-[40px] rounded-lg border border-white p-2 text-center"
                />
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                  className="bg-white/10 text-white flex-1 h-[40px] rounded-lg border border-white p-2"
                />
              </div>

              {/* Role */}
              <label htmlFor="role" className="text-white ml-2 mt-2">Role</label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2 mb-2"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>

              {/* Password */}
              <label htmlFor="password" className="text-white ml-2 mt-2">Password</label>
              <div className="relative w-full mb-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
              <label htmlFor="confirmPassword" className="text-white ml-2 mt-2">Confirm Password</label>
              <div className="relative w-full mb-4">
                <input
                  id="confirmPassword"
                  type={showPassword2 ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="bg-white/10 text-white w-full h-[40px] rounded-lg border border-white p-2"
                />
                <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showPassword2 ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Already have account */}
              <p className="text-sm text-white mb-4">
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer hover:underline">
                  Login
                </span>
              </p>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleSignup}
                className="bg-[#080064] hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-[150px] mx-auto mb-5"
              >
                Register
              </button>

              {/* OTP Section */}
              {otpSent && (
                <div className="w-full flex flex-col items-center pt-6">
                  <label className="text-white mb-2">Enter OTP sent to your email</label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-[#080064] hover:bg-blue-600 text-white rounded-lg px-4 py-2 mt-4 w-[150px] mx-auto mb-3"
                  >
                    Verify OTP
                  </button>
                  {otpSent && (
                    <div className="mt-4 text-center mb-3">
                      <button
                        onClick={handleResendOtp}
                        type="button"
                        disabled={resendTimer > 0}
                        className={`px-2 py-2 rounded ${
                          resendTimer > 0
                            ? 'bg-gray-500 cursor-not-allowed'
                            : '  text-blue-500'
                        }`}
                      >
                        {resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : 'Resend OTP'}
                      </button>
                    </div>
                  )}


                </div>
              )}

              <p className='text-sm text-white mb-4 text-center'>
                Once You have sign ed up, you will receive an email with a verification code. Please check your spam folder if you do not see it in your inbox.
              </p>

            </form>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Signup
