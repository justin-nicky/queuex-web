import React, { useCallback, useContext } from 'react'
import { withRouter, Redirect } from 'react-router'
import { AuthContext } from '../AuthProvider'
import Firebase from '../Firebase'
import 'firebase/auth'
import firebase from 'firebase/app'
import '../Login/Login.css'

const SignUp = ({ history }) => {
  const addData = (InstitutionName, InstitutionPlace, UPIId) => {
    try {
      const userId = firebase.auth().currentUser.uid
      Firebase.firestore().collection('Queues').doc(userId).set({
        InstitutionName: InstitutionName.value,
        Place: InstitutionPlace.value,
        UpiId: UPIId.value,
        TotalT: 0,
        CurrentT: 0,
        Tokens: {},
      })
    } catch (error) {
      console.error('Error writing document: ', error)
    }
  }
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()
      const { InstitutionName, InstitutionPlace, UPIId, email, password } =
        event.target.elements
      try {
        await Firebase.auth().createUserWithEmailAndPassword(
          email.value,
          password.value
        )
        history.push('/')
        addData(InstitutionName, InstitutionPlace, UPIId)
      } catch (e) {
        console.log(e.code)
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
        <form onSubmit={handleSignUp}>
          <h3>SignUp</h3>
          <div className='form-group'>
            <label>Institution Name</label>
            <input
              name='InstitutionName'
              type='text'
              className='form-control'
              placeholder='name of Institution'
            />
          </div>
          <div className='form-group'>
            <label>Institution Place</label>
            <input
              name='InstitutionPlace'
              type='text'
              className='form-control'
              placeholder='Place'
            />
          </div>
          <div className='form-group'>
            <label>UPI Id</label>
            <input
              name='UPIId'
              type='text'
              className='form-control'
              placeholder='UPI Id'
            />
          </div>
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
          <div className='form-group'></div>
          <button type='submit' className='btn btn-dark btn-lg btn-block'>
            Sign Up
          </button>
        </form>
        <div>
          <p>Already a user?</p>
          <a href='/login'> Login here!</a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(SignUp)
