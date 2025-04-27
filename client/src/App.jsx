import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {AdminDashBoard, LandingPage, Login, Signup, ForgetPassword} from './routes/Routes'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <Router>
      <Toaster richColors position='top-center'/>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path='/login' element ={<Login/>}/>
        <Route path='/signup' element ={<Signup/>}/>
        <Route path='/admin' element ={<AdminDashBoard/>}/>
        <Route path='/forgot-password' element ={<ForgetPassword/>}/>
      </Routes>
    </Router>
  )
}

export default App
