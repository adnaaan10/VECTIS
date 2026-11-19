import { useState } from 'react'
import { ToastContainer } from "react-toastify";
import AppRouter from './routes/AppRouter'
import ProfileCompletionHandler from './components/user/profile/ProfileCompletionHandler';

function App() {

  return (
    <>
      <AppRouter/>

      <ProfileCompletionHandler/>
      
      <ToastContainer/>
    </>
  )
}

export default App
