import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PhotoGallery from './pages/photogallery/PhotoGallery'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PhotoGallery/>
    </>
  )
}

export default App
