import { useState } from 'react'
import { Link, Route, Switch, Redirect } from "react-router-dom"
import styled from 'styled-components'
import { IoIosMenu } from "react-icons/io"
import GlobalStyle from './globalStyles'
import Stocks from './components/Stocks'
import Products from './components/Products'
import Customers from './components/Customers'
import Employees from './components/Employees'
import Economy from './components/Economy'
import SiteStatistic from './components/SiteStatistic'
import Orders from './components/Orders'
import Order from './components/Order'
import Messages from './components/Messages'
import OverView from './components/OverView'
import Login from './components/Login'
import { useAuth } from './components/AuthState'

const AppStyle = styled.div`
  width: 100%;
  height: 100vh;
`

const MainViewStyle = styled.div`
  width: 100%;
  height: 100%;
`

const TopBar = styled.div`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  & > div {
    &:nth-child(1) {
      width: 100px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      /*background-color: blue;*/
      svg {
        transform: scale(1.5);
        cursor: pointer;
      }
    }
    &:nth-child(2) {
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      margin-right: 30px;
      & > span {
        &:nth-child(2) {
          font-size: 14px;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }
`
const Contents = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`

const SideBar = styled.div`
  width: 300px;
  height: 100%;
  float: left;
  transition: width 250ms ease-in-out;
  background-color: #F2F5FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  a {
    font-size: 1em;
    background-color: #FAFDFF;
    padding: 5px 10px;
    border-radius: 7.5px;
    margin: 5px 0;
  }
`

const Content = styled.div`
  width: calc(100% - 300px);
  height: 100%;
  float: left;
  transition: width 250ms ease-in-out;
`

function PrivateRoute ({ children, ...rest }) {
   const { isAuthenticated } = useAuth()
   console.log(isAuthenticated)
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
   console.log(isAuthenticated)
  return (
    <Route {...rest} render={() => {
      return isAuthenticated === false
        ? children
        : <Redirect to="/"/>
    }} />
  )
}


export default function App() {
  const { isAuthenticated, user, logout } = useAuth()
   console.log(isAuthenticated)
     // const { user, logout } = useAuth()
  const [sideBarAppear, setSideBarAppear] = useState(true)
    async function handleLoggintOut() {
    const res = await logout()
    console.log(res)
  }
  return (
    <>
      <GlobalStyle/>
      <AppStyle>
              <TopBar>
         <div>
           <IoIosMenu onClick={() => setSideBarAppear(!sideBarAppear)}/>
         </div>
         <div>
           <span>{user?.name}</span>
           <span onClick={handleLoggintOut}>logout</span>
         </div>
       </TopBar>
       <Contents>
         <SideBar style={sideBarAppear ? { width: '300px' } : { width: '0px' }}>
           <Link to="/">Over View</Link>
           <Link to="/stocks">Stocks</Link>
           <Link to="/products">Products</Link>
           <Link to="/customers">Customers</Link>
           <Link to="/employees">Employees</Link>
           <Link to="/economy">Economy</Link>
           <Link to="/site-statistic">Site Statistic</Link>
           <Link to="/orders">Orders</Link>
           <Link to="/messages">Messages</Link>
         </SideBar>
         <Content  style={sideBarAppear ? { width: 'calc(100% - 300px)' } : { width: '100%' }}>
          <Switch>
            {/* <PrivateRoute exact path="/login"> */}
            {/*   <OverView/> */}
            {/* </PrivateRoute>  */}
            <PrivateRoute exact path="/stocks">
              <Stocks/>
            </PrivateRoute>
            <PrivateRoute exact path="/products">
              <Products/>
            </PrivateRoute>
            <PrivateRoute exact path="/customers">
              <Customers/>
            </PrivateRoute>
            <PrivateRoute exact path="/employees">
              <Employees/>
            </PrivateRoute>
            <PrivateRoute exact path="/economy">
              <Economy/>
            </PrivateRoute>
            <PrivateRoute exact path="/site-statistic">
              <SiteStatistic/>
            </PrivateRoute>
            <PrivateRoute exact path="/orders">
              <Orders/>
            </PrivateRoute>
            <PrivateRoute exact path="/order">
              <Order/>
            </PrivateRoute>
            <PrivateRoute exact path="/messages">
              <Messages/>
            </PrivateRoute>
        {/* <Switch> */}
          <PrivateRoute exact path="/">
            <MainView/>
          </PrivateRoute>
          <PrivateRoute exact path="/messages">
              <Messages/>
            </PrivateRoute>
          <LoginRoute exact path="/login">
            <Login/>
          </LoginRoute> 
        {/* </Switch> */}
          </Switch>
         </Content>
       </Contents>
      </AppStyle>
    </>
  )
}

function MainView() {
  // const { user, logout } = useAuth()
  // const [sideBarAppear, setSideBarAppear] = useState(true)
  // 
  // async function handleLoggintOut() {
  //   const res = await logout()
  //   console.log(res)
  // }
  return (
    <MainViewStyle>
       {/*  <TopBar> */}
       {/*   <div> */}
       {/*     <IoIosMenu onClick={() => setSideBarAppear(!sideBarAppear)}/> */}
       {/*   </div> */}
       {/*   <div> */}
       {/*     <span>{user?.name}</span> */}
       {/*     <span onClick={handleLoggintOut}>logout</span> */}
       {/*   </div> */}
       {/* </TopBar> */}
       {/* <Contents> */}
       {/*   <SideBar style={sideBarAppear ? { width: '300px' } : { width: '0px' }}> */}
       {/*     <Link to="/">Over View</Link> */}
       {/*     <Link to="/stocks">Stocks</Link> */}
       {/*     <Link to="/products">Products</Link> */}
       {/*     <Link to="/customers">Customers</Link> */}
       {/*     <Link to="/employees">Employees</Link> */}
       {/*     <Link to="/economy">Economy</Link> */}
       {/*     <Link to="/site-statistic">Site Statistic</Link> */}
       {/*     <Link to="/orders">Orders</Link> */}
       {/*     <Link to="/messages">Messages</Link> */}
       {/*   </SideBar> */}
       {/*   <Content  style={sideBarAppear ? { width: 'calc(100% - 300px)' } : { width: '100%' }}> */}
       {/*    <Switch> */}
       {/*      <PrivateRoute exact path="/login"> */}
       {/*        <OverView/> */}
       {/*      </PrivateRoute>  */}
       {/*      <PrivateRoute exact path="/stocks"> */}
       {/*        <Stocks/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/products"> */}
       {/*        <Products/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/customers"> */}
       {/*        <Customers/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/employees"> */}
       {/*        <Employees/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/economy"> */}
       {/*        <Economy/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/site-statistic"> */}
       {/*        <SiteStatistic/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/orders"> */}
       {/*        <Orders/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/order"> */}
       {/*        <Order/> */}
       {/*      </PrivateRoute> */}
       {/*      <PrivateRoute exact path="/messages"> */}
       {/*        <Messages/> */}
       {/*      </PrivateRoute> */}
       {/*    </Switch> */}
       {/*   </Content> */}
       {/* </Contents> */}
    </MainViewStyle>
  )
}

