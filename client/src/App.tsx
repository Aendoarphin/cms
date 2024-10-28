import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [array, setArray] = useState([])

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/api")
    console.log(response.data["Phone Brands"])
    setArray(response.data.phones)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
      {array.map((phone, index) => (
        <div key={index}> <h1>{phone}</h1> </div>
      ))}
    </>
  )
}

export default App
