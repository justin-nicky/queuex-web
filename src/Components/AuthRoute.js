import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const AuthRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext)
  //console.log(currentUser)
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/login'} />
        )
      }
    />
  )
}

export default AuthRoute
