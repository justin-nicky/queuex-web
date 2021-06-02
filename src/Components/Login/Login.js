import React, { useCallback, useContext } from 'react'
import { withRouter, Redirect } from 'react-router'
import { AuthContext } from '../AuthProvider'
import Firebase from '../Firebase'
import './Login.css'

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault()
      const { email, password } = event.target.elements

      try {
        await Firebase.auth().signInWithEmailAndPassword(
          email.value,
          password.value
        )
        history.push('/')
      } catch (error) {
        alert(error)
      }
    },
    [history]
  )
  const { currentUser } = useContext(AuthContext)
  if (currentUser) {
    return <Redirect to='/' />
  }

  return (
    <div className='outer'>
      <div className='inner'>
        <form onSubmit={handleLogin}>
          <h3>Log in</h3>
          <div className='form-group'>
            <label>Email</label>
            <input
              name='email'
              type='email'
              className='form-control'
              placeholder='Enter email'
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              name='password'
              type='password'
              className='form-control'
              placeholder='Enter password'
            />
          </div>
          <button type='submit' className='btn btn-dark btn-lg btn-block'>
            Sign in
          </button>
        </form>
        <div>
            <p>New user?</p>
             <a href="/signup">  SignUp here!</a>
          </div>
      </div>
    </div>
  )
}

export default withRouter(Login)
