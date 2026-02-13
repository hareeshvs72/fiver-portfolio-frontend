import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Portfolio from './Portfolio'
import { Route, Routes } from 'react-router-dom'
import ProjectUpload from './ProjectUpload'
import Pnf from './components/Pnf'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Portfolio/>}/>
            <Route path='*' element={<Pnf/>}/>

             <Route path='/upload' element={<ProjectUpload/>}/>

    </Routes>
     
    </>
  )
}

export default App
