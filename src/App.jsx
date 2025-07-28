import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import FilePicker from './components/FilePicker'

function App() {
  const [count, setCount] = useState(0)

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
