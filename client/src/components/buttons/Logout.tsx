import React from 'react'
import axios from "axios"
import { Button } from '../ui/button'
const Logout = () => {
  const handleLogout = () =>{
    axios.post("")
  }
   return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Logout
