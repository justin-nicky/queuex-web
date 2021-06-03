import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import QRCode from 'react-qr-code'
import Firebase from '../Firebase'
import {
  IoQrCodeOutline,
  IoArrowForwardCircleOutline,
  IoOptionsOutline,
  IoLogOutOutline
} from 'react-icons/io5'
import { Button } from 'react-bootstrap'

const Home = () => {
  const [showQR, setshowQR] = useState(false)
  const userId = firebase.auth().currentUser.uid
  const [currentT, setcurrentT] = useState(0)
  const [totalT, settotalT] = useState(null)
  const [doc, setdoc] = useState(null)
  const [currentUid, setcurrentUid] = useState(null)
  const [userdata, setuserdata] = useState(null)

  const dataFetch = () => {
    const subscriber = Firebase.firestore()
      .collection('Queues')
      .doc(userId)
      .onSnapshot((documentSnapshot) => {
        setdoc(documentSnapshot.data())
        setcurrentUid(
          documentSnapshot.data().Tokens[documentSnapshot.data().CurrentT + 1]
        )
        setcurrentT(documentSnapshot.data().CurrentT)
        settotalT(documentSnapshot.data().TotalT)
      })

    return () => subscriber()
  }

  const updateQueue = () => {
    console.log('updateQueue')
    if (currentT < totalT) {
      Firebase.firestore()
        .collection('Users')
        .doc(currentUid)
        .onSnapshot((documentSnapshot) => {
          setuserdata(documentSnapshot.data())
        })

      Firebase.firestore()
        .collection('Queues')
        .doc(userId)
        .update({
          CurrentT: currentT + 1,
        })
      dataFetch()
    }
  }

  const reset = () => {
    Firebase.firestore().collection('Queues').doc(userId).update({
      TotalT: 0,
      CurrentT: 0,
      Tokens: {},
    })
  }

  useEffect(() => {
    dataFetch()
  }, [])

  return (
    <>
    <div style={{
            backgroundColor: 'white',
            left: '20px',
            position: 'fixed',
            borderRadius: '5px',
          }}>
        <IoLogOutOutline style={{
                width: '50px',
                height: '50px',
                padding: '5px',
                transform: 'rotateY(180deg)'
              }} onClick={() => Firebase.auth().signOut()}>Sign out</IoLogOutOutline>

        </div>
        <div
          style={{
            backgroundColor: 'white',
            right: '20px',
            position: 'fixed',
            borderRadius: '5px',
          }}
        >
          {!showQR ? (
            <IoQrCodeOutline
              onClick={() => setshowQR(true)}
              style={{
                width: '50px',
                height: '50px',
                padding: '5px',
              }}
            />
          ) : (
            <IoOptionsOutline
              onClick={() => setshowQR(false)}
              style={{
                width: '50px',
                height: '50px',
                left: '20px',
                padding: '5px',
              }}
            />
          )}
        </div>
    <div>
        <div className='inner'>
          {!showQR && doc && (
            <>
              <h1 style={{ textAlign: 'center' }}>{doc.InstitutionName}</h1>
              <h3 style={{ textAlign: 'center', paddingBottom: '50px' }}>
                {doc.Place}
              </h3>

              <h1 style={{ textAlign: 'center' }}>{currentT}</h1>
              <h4 style={{ textAlign: 'center' }}>Total tokens: {totalT} </h4>
              {userdata ? (
                <>
                  <h5 style={{ textAlign: 'center' }}>
                    Customer Name: {userdata.firstname}
                  </h5>
                  <h5 style={{ textAlign: 'center' }}>
                    Customer Email: {userdata.email}
                  </h5>
                </>
              ) : (
                <>
                  <h5 style={{ textAlign: 'center' }}>Customer Name:</h5>
                  <h5 style={{ textAlign: 'center' }}>Customer Email:</h5>
                </>
              )}
              <IoArrowForwardCircleOutline
                onClick={() => {
                  updateQueue()
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  marginTop: '30px',
                }}
              />
            </>
          )}
          <div style={{textAlign:'center'}}>
          {showQR && <QRCode size={386} style={{}} value={userId} />}
          </div>
        </div>
        <div style={{textAlign:'center', paddingTop:'30px'}}>
        <Button variant="outline-danger" onClick={reset}>Reset Queue</Button>{' '}
        </div>
    </div>
    </>
  )
}

export default Home
