import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AuthRoute from './Components/AuthRoute'
import { AuthProvider } from './Components/AuthProvider'
import Login from './Components/Login/Login'
import Home from './Components/Home/Home'
import SignUp from './Components/Signup/SignUp'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <AuthRoute exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
