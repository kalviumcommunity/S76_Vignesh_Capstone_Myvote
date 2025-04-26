import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {AdminDashBoard, LandingPage, Login, Signup} from './routes/Routes'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path='/login' element ={<Login/>}/>
        <Route path='/signup' element ={<Signup/>}/>
        <Route path='/admin' element ={<AdminDashBoard/>}/>
      </Routes>
    </Router>
  )
}

export default App
