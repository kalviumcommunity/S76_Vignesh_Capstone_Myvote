import React from 'react'
import { FloatingDock } from '../components/FloatingDock'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import flag from '../assets/images/Flag.lottie'
import { FaInstagram, FaWhatsapp, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from '../components/Loder'


const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);


    useEffect(() => {
        // simulate data loading
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }, []);
  return (
      <>
      {loading ? (<Loader/>) : (
        <div className="bg-black flex flex-col items-center justify-center inset-0 overflow-x-hidden w-screen">
        <FloatingDock/>
        <div className='w-screen min-h-screen flex items-center justify-center bg-black inset-0'>

            {/* <!-- Background gradient --> */}
            <div className="absolute w-screen h-screen bg-[radial-gradient(ellipse_at_top,_#050058,_#000000,_#000000)]"></div>

            {/*  <!-- {Hero Page}--> */}
            <div className='absolute w-full min-h-screen flex flex-col md:flex-row items-center justify-around px-4 text-center md:text-left'>

                {/* hero page left container */}
                <div className='flex flex-col items-center justify-center ml-2 md:ml-5'>
                    <h1 className='text-5xl sm:text-7xl md:text-9xl font-bold text-white m-4 md:m-8'
                        style={{ textShadow: '2px 5px 2px #4C4B4B',fontFamily: 'New Rocker' }}
                        >MyVote</h1>
                    <p className='text-white/80 text-xl sm:text-2xl md:text-4xl m-4'
                        style={{ fontFamily:'Protest Revolution'}}
                        >"Click, Vote, Change the future"</p>

                    {/* Button at first */}
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-9 m-4'>
                            <button className='bg-[#080064] text-white w-[200px] h-[50px] text-xl md:text-2xl font-bold rounded-lg border-1 hover:scale-105'>
                                Vote Now
                            </button>
                            <button className='bg-white text-[#080064] w-[200px] h-[50px] text-xl md:text-2xl font-bold rounded-lg hover:scale-105'
                                    onClick={() => navigate('/login')}>
                                Admin Login
                            </button>
                        </div>
                        <button className='bg-white/0 m-4 text-white w-[200px] h-[50px] text-xl md:text-2xl font-bold rounded-lg border-1 hover:scale-105 hover:bg-red-600'>
                            Results
                        </button>
                        
                    </div>
                </div>

                {/* hero page right container */}
                <div className='flex items-center justify-center mt-6 md:mt-0'>
                    <DotLottieReact
                        src = {flag}
                        autoplay
                        loop
                        style={{ width: '300px', height: '300px', maxWidth: '500px', maxHeight: '500px' }}
                    />
                </div>
            </div>
        </div>
       
        {/* Features Section */}
        <section className="z-10 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-6 max-w-7xl mx-auto mt-10">
            {features.map(({ title, description, icon }, index) => (
            <div key={index} className="border-1 border-white rounded-lg p-6 text-center">
                <div className="text-4xl md:text-7xl m-4 md:m-6">{icon}</div>
                <h2 className="text-red-600 font-bold text-xl md:text-2xl mb-2">{title}</h2>
                <p className="text-base md:text-lg text-gray-300">{description}</p>
            </div>
            ))}
        </section>

        {/* Information Section */}
        <section className='relative z-10 flex flex-col items-center justify-center bg-black/50 mt-10 px-4'>
            <div className='flex items-center justify-center m-4 md:m-10 text-center'>
                <p className='text-white/80 text-lg sm:text-xl md:text-3xl'
                    style={{ fontFamily:'Protest Revolution'}}
                >
                    Voting is a fundamental right in a democracy that allows citizens to choose their representatives and have a say in the governance of their country. In India, elections are conducted by the Election Commission of India in a free and fair manner. Citizens who are 18 years or older are eligible to vote and can do so at designated polling stations using Electronic Voting Machines (EVMs). Elections are held at various levels such as the Lok Sabha (Parliament), State Legislative Assemblies, and local governing bodies. The candidate who secures the highest number of votes is declared the winner and goes on to represent the people.
                </p>
            </div>
        </section>
        
        {/* Second button */}
        <div className='flex flex-col sm:flex-row items-center justify-center relative m-5 gap-6'>
            <button className='bg-[#080064] text-white w-[200px] h-[50px] text-xl md:text-2xl font-bold rounded-lg border-1 hover:scale-105'>
                Vote Now
            </button>
            <button className='bg-white text-[#080064] w-[200px] h-[50px] text-xl md:text-2xl font-bold rounded-lg hover:scale-105'>
                Admin Login
            </button>
        </div>

        {/* Footer */}
        <div className='relative flex flex-col md:flex-row items-center justify-around bg-gradient-to-b from-[#080064]/10 to-[#080064] w-full px-4 py-10'>
            <div className='flex flex-col items-center justify-center mb-6 md:mb-0'>
                <h1 className='text-white text-4xl md:text-6xl font-bold'
                    style={{fontFamily: 'New Rocker'}}>MyVote</h1>
                <div className='flex items-center justify-center mt-6 space-x-4 gap-4'>
                    <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer'>
                        <FaInstagram className='text-pink-600 hover:scale-110 transition-transform duration-200' size={30} />
                    </a>
                    <a href='https://www.whatsapp.com' target='_blank' rel='noopener noreferrer'>
                        <FaWhatsapp className='text-green-500 hover:scale-110 transition-transform duration-200' size={30} />
                    </a>
                    <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer'>
                        <FaLinkedin className='text-blue-700 hover:scale-110 transition-transform duration-200' size={30} />
                    </a>
                    <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer'>
                        <FaTwitter className='text-blue-400 hover:scale-110 transition-transform duration-200' size={30} />
                    </a>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 md:mt-0'>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-white text-base md:text-lg font-bold'>New Election</p>
                    <p className='text-white text-base md:text-lg font-bold'>Admin Login</p>
                    <p className='text-white text-base md:text-lg font-bold'>Vote</p>
                    <p className='text-white text-base md:text-lg font-bold'>Result</p>
                </div>
                <div className='h-0.5 sm:h-[150px] w-[150px] sm:w-0.5 bg-white m-4'></div>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-white text-base md:text-lg font-bold'>About us</p>
                    <p className='text-white text-base md:text-lg font-bold'>Contact Us</p>
                    <p className='text-white text-base md:text-lg font-bold'>Info</p>
                </div>
            </div>
        </div>
    </div>
      )}
      </>
  )
}

const features = [
    {
      title: 'Secure Voter Authentication',
      description: 'Voters must log in using a unique voter ID and OTP/email verification to ensure only authorized users can cast a vote, preventing fraud and duplication.',
      icon: '👤',
    },
    {
      title: 'Real-Time Vote Count Display',
      description: 'Admins can monitor live updates of vote counts per candidate or party in a secure dashboard, while users will only see results after polls close.',
      icon: '🗳️',
    },
    {
      title: 'Voting with Lock Mechanism',
      description: 'Once a voter casts their vote, the system locks their session, preventing any further access to the voting page — enforcing one person, one vote.',
      icon: '🔒',
    },
    {
      title: 'Candidate Profiles with Verification Badge',
      description: 'Each candidate has a profile with their bio, manifesto, and a verified badge indicating they’ve been approved by the election committee/admin',
      icon: '🆔',
    },
    {
      title: 'Voting Countdown Timer',
      description: 'A visible countdown shows the time remaining until the poll closes, increasing urgency and helping voters stay aware of deadlines.',
      icon: '⏰',
    },
    {
      title: 'Blockchain-based Vote',
      description: 'Votes are stored in a blockchain-like structure (or simulated one) to ensure transparency and immutability, making tampering nearly impossible.',
      icon: '⛓️',
    },
];

export default LandingPage
