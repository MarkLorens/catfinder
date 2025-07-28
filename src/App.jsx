import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import FilePicker from './components/FilePicker'
import Generator from './components/Generator'

function App() {
  return (
    <>
    <div className="container">
      <Navbar />
      <FilePicker />
      <Generator />
    </div>
    </>
  )
}

export default App
