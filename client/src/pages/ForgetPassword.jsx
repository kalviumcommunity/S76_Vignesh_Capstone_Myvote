import React, { useState, useEffect } from 'react'
import { FloatingDock } from '../components/FloatingDock'
import {toast} from 'sonner'
import axios from 'axios'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from '../components/ui/input-otp'
import {useNavigate} from 'react-router-dom'

const ForgetPassword = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [sentOtp, setSentOtp] = useState(false);
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const newPassword = Password;

    const handleVerify = () => {
        if(!email){
            toast.error('Please enter your email');
        }
        axios.post('http://localhost:8000/api/send-otp', { email })
        .then(response => {
            console.log(response.data);
            toast.success('OTP sent successfully');
            setSentOtp(true);
            setStep(2);
        })
        .catch(error => {
            console.error(error);
            toast.error('Failed to send OTP');
        });
    }

    const handleVerifyOtp = async () => {
        try {
          await axios.post('http://localhost:8000/api/verify-otp', { email, otp })
          toast.success('OTP verified successfully')
        //   navigate('/login')
          setStep(3)

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
      }, [resendTimer]);

    const handleReset = async() =>{
        try {
            axios.put('http://localhost:8000/api/forget-password', { email, newPassword})
            .then(response => {
                console.log(response.data);
                toast.success('Password reset successfully');
                navigate('/login')
            })

        } catch (error) {
            console.log(error);
            toast.error('Failed to reset password');
        }
    }
  return (
    <div className='w-screen h-screen bg-black inset-0 flex items-center justify-center flex-col text-white gap-4'>
        <FloatingDock/>
        <h1 className='text-5xl sm:text-7xl md:text-7xl font-bold'>MyVote</h1>
        <p className='text-red-400 text-xl sm:text-2xl md:text-3xl'>Reset Password</p>
        {step === 1 && (
            <div className='flex flex-col items-center justify-center gap-3'>
                <label htmlFor="email" className='text-2xl'>Enter your email</label>
                <input 
                    type="text" 
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-gray-600 p-2 rounded-md bg-transparent w-[300px]'
                />
                <button className='bg-blue-600 w-[100px] h-10 rounded-md text-xl font-bold ' onClick={handleVerify}>Verify</button> 
            </div>
        )}

        {step === 2 && (
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
                {sentOtp && (
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

        {step === 3 && (
            <div className='flex flex-col items-center justify-center gap-3'>
                <label htmlFor="email" className='text-2xl'>Enter your new password</label>
                <input 
                    type="password" 
                    placeholder="Enter your new password"
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-gray-600 p-2 rounded-md bg-transparent w-[300px]'
                />
                <label htmlFor="email" className='text-2xl'>Confirm your new password</label>
                <input 
                    type="password" 
                    placeholder="Confirm your new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='border border-gray-600 p-2 rounded-md bg-transparent w-[300px]'
                />
                <button className='bg-blue-600 w-[100px] h-10 rounded-md text-xl font-bold ' onClick={handleReset}>Submit</button> 
            </div>
        )}
    </div>
  )
}

export default ForgetPassword
