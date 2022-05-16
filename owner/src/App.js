import { Link, Route, Switch, Redirect } from "react-router-dom"
import styled from 'styled-components'
import GlobalStyle from './globalStyles'
import Login from './components/Login'
import { useAuth } from './components/AuthState'
import MainView from './components/MainView'

const AppStyle = styled.div`
  width: 100%;
  height: 100vh;
`

function PrivateRoute ({ children, ...rest }) {
   const { isAuthenticated } = useAuth()
  return (
    <Route {...rest} render={({ location }) => {
      return isAuthenticated === true
        ? children
        : <Redirect to={{
            pathname: '/login',
            state: { from: location }
          }}/>
    }} />
  )
}


function LoginRoute ({ children, ...rest }) {
   const { isAuthenticated } = useAuth()
  return (
    <Route {...rest} render={() => {
      return isAuthenticated === false
        ? children
        : <Redirect to="/"/>
    }} />
  )
}


export default function App() {
  const { isAuthenticated, isLoading } = useAuth()
  return (
    <>
      <GlobalStyle/>
      <AppStyle>
         {/* <Switch> */}
         {/*    <LoginRoute exact path="/login"> */}
         {/*      <Login/> */}
         {/*    </LoginRoute>  */}
         {/*    <PrivateRoute exact path="/"> */}
         {/*      <MainView/> */}
         {/*    </PrivateRoute> */}
         {/*  </Switch> */}
        { isAuthenticated ? <MainView/> : <Login/> }
      </AppStyle>
    </>
  )
}