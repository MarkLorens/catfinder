import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import FilePicker from './components/FilePicker'

function App() {
  return (
    <>
    <div className="container">
      <Navbar />
      <FilePicker />
    </div>
    </>
  )
}

export default App
