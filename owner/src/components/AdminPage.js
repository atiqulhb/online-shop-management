import React, { useState, useEffect } from 'react'
import { gql, useSubscription, useQuery } from '@apollo/client'
import styled from 'styled-components'
import ProductsAdmin from './ProductsAdmin'
import Orders from './Orders'
import ScrollBar from './ScrollBar'
import { useAuth } from '../components/AuthState'
import Customers from './Customers'



const AdminPageLayout = styled.div`
  width: 100%;
  height: 100vh;
  /*display: flex;*/
`

const Sidebar = styled.div`
  /*flex: 1;*/
  width: 20%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
`

const SideNav = styled.button`
  width: 100%;
  height: 50px;
  border: 1px solid black;
  cursor: pointer;
  background-color: #fff;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #000;
    color: #fff;
    font-weight: bold;
    outline: none;
  }
`

const Contents = styled.div`
  /*flex: 5;*/
  width: 80%;
  height: 100%;
  float: right;
  /*text-align: center;*/
`


export default function AdminPage() {
  const { data:AuthData } = useAuth()
  console.log(AuthData)
  const [tab, setTab] = useState('overview')
  return (
    <AdminPageLayout>
      <Sidebar>
        <SideNav className={ tab === 'overview' ? 'active' : null } onClick={() => setTab('overview')}>Over View</SideNav>
        <SideNav className={ tab === 'products' ? 'active' : null } onClick={() => setTab('products')}>Products</SideNav>
        <SideNav className={ tab === 'customers' ? 'active' : null } onClick={() => setTab('customers')}>Customers</SideNav>
        <SideNav className={ tab === 'employees' ? 'active' : null } onClick={() => setTab('employees')}>Employees</SideNav>
        <SideNav className={ tab === 'economy' ? 'active' : null } onClick={() => setTab('economy')}>Economy</SideNav>
        <SideNav className={ tab === 'site-statistic' ? 'active' : null } onClick={() => setTab('site-statistic')}>Site Statistic</SideNav>
        <SideNav className={ tab === 'orders' ? 'active' : null } onClick={() => setTab('orders')}>Orders</SideNav>
        <SideNav className={ tab === 'messages' ? 'active' : null } onClick={() => setTab('messages')}>Messages</SideNav>
      </Sidebar>
      <Contents>
        <ScrollBar>
          {{
                'overview': <OverView/>,
                'products': <ProductsAdmin/>,
                'customers': <Customers />,
                'employees': <Employees />,
                'economy': <Economy/>,
                'site-statistic': <SiteStatistic/>,
                'orders': <Orders/>,
                'messages': <Messages/>
            } [tab] }
        </ScrollBar>
      </Contents>
    </AdminPageLayout>
  )
}

function OverView() {
  return <h2></h2>
}

function Products() {
  return <h2>Products</h2>
}

function Employees() {
  return <h2>Employees</h2>
}

function Economy() {
  return <h2>Economy</h2>
}

function SiteStatistic() {
  return <h2>Site Statistic</h2>
}

function Messages() {
  return <h2>Messages</h2>
}

