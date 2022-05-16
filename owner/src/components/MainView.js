import { useState } from 'react'
import { Link, Route, Switch, Redirect, NavLink } from "react-router-dom"
import styled from 'styled-components'
import { IoIosMenu } from "react-icons/io"
import Stocks from './Stocks'
import Products from './Products'
import Customers from './Customers'
import Employees from './Employees'
import Economy from './Economy'
import SiteStatistic from './SiteStatistic'
import Orders from './Orders'
import Order from './Order'
import Messages from './Messages'
import OverView from './OverView'
import Deliveries from './Deliveries'
import { useAuth } from './AuthState'

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
  // a {
  //   font-size: 1em;
  //   background-color: #FAFDFF;
  //   padding: 5px 10px;
  //   border-radius: 7.5px;
  //   margin: 5px 0;
  // }
`

const Content = styled.div`
  width: calc(100% - 300px);
  height: 100%;
  float: left;
  transition: width 250ms ease-in-out;
`

// const StyledNavLink = styled(NavLink).attrs({ activeClassName })`

//   &.${activeClassName} {
//     background: red;
//   }
// `

const StyledLink = styled(NavLink)`
  width:150px;
  padding: 10px 0;
  border-radius: 50px;
  text-align: center;
  margin: 5px 0;
  color: #000;
  &: hover {
    box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.25)
  }

  &.active {
    box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.5)
  }
`

// const StyledLink = styled(NavLink)`
//   width:150px;
//   padding: 10px;
//   border-radius: 50px;
//   text-align: center;
//   margin: 5px 0;
//   color: #000;
//   &:hover {
//     /*background-color:rgba(255,215,0,0.3);*/
//     box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.05)
//   }

//   &.${props => props.activeClassName} {
//     box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.1)
//   }
// `

export default function MainView() {
  const { user, logout } = useAuth()
  const [sideBarAppear, setSideBarAppear] = useState(true)
  
  async function handleLoggintOut() {
    const res = await logout()
    console.log(res)
  }
  return (
    <MainViewStyle>
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
           <StyledLink to="/" exact strict>Over View</StyledLink>
           <StyledLink to="/stocks" exact strict>Stocks</StyledLink>
           <StyledLink to="/products" exact strict>Products</StyledLink>
           <StyledLink to="/customers" exact strict>Customers</StyledLink>
           <StyledLink to="/employees" exact strict>Employees</StyledLink>
           <StyledLink to="/deliveries" exact strict>Deliveries</StyledLink>
           <StyledLink to="/economy" exact strict>Economy</StyledLink>
           <StyledLink to="/site-statistic" exact strict>Site Statistic</StyledLink>
           <StyledLink to="/orders" exact strict>Orders</StyledLink>
           <StyledLink to="/messages" exact strict>Messages</StyledLink>
         </SideBar>
         <Content  style={sideBarAppear ? { width: 'calc(100% - 300px)' } : { width: '100%' }}>
          <Switch>
            <Route exact path="/">
              <OverView/>
            </Route> 
            <Route exact path="/stocks">
              <Stocks/>
            </Route>
            <Route exact path="/products">
              <Products/>
            </Route>
            <Route exact path="/customers">
              <Customers/>
            </Route>
            <Route exact path="/employees">
              <Employees/>
            </Route>
            <Route exact path="/deliveries">
              <Deliveries/>
            </Route>
            <Route exact path="/economy">
              <Economy/>
            </Route>
            <Route exact path="/site-statistic">
              <SiteStatistic/>
            </Route>
            <Route exact path="/orders">
              <Orders/>
            </Route>
            <Route exact path="/order">
              <Order/>
            </Route>
            <Route exact path="/messages">
              <Messages/>
            </Route>
          </Switch>
         </Content>
       </Contents>
    </MainViewStyle>
  )
}