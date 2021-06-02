import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import QRCode from 'react-qr-code'
import Firebase from '../Firebase'
import {
  IoQrCodeOutline,
  IoArrowForwardCircleOutline,
  IoOptionsOutline,
} from 'react-icons/io5'

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

  useEffect(() => {
    dataFetch()
  }, [])

  return (
    <div className='outer'>
      <div>
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
                left: '20px',
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
        <h1>{userId}</h1>

        <button onClick={() => Firebase.auth().signOut()}>Sign out</button>

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
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              />
            </>
          )}
          {showQR && <QRCode style={{}} value={userId} />}
        </div>

        <button
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '30px',
          }}
        >
          Reset Queue
        </button>
      </div>
    </div>
  )
}

export default Home
