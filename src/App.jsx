import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Portfolio from './Portfolio'
import { Route, Routes } from 'react-router-dom'
import ProjectUpload from './ProjectUpload'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Portfolio/>}/>
             <Route path='/upload' element={<ProjectUpload/>}/>

    </Routes>
     
    </>
  )
}

export default App
