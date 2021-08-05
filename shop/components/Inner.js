import { useState } from 'react'
import styled from 'styled-components'
import { useLocalState } from './LocalState'
import Cart from '../components/Cart'
import BottomNavigator from '../components/BottomNavigator'
import TopBar from '../components/TopBar'
import TopBarForMobile from '../components/TopBarForMobile'
import Notification from '../components/Notification'
import Menu from '../components/Menu'
import Chat from './Chat'
import useWindowSize from '../hooks/useWindowSize'

const InnerStyled = styled.div`
  width: 100%;
  height: 100vh;
`

const InnerInner = styled.div`
  width: 100%;
  /*top: 40px;*/
  /*height: calc(100% - 50px);*/
  transition: all 250ms ease-in-out;
  /*position: absolute;*/
`

export default function Inner({ children }) {
  const { width: windowWidth } = useWindowSize()
  const { menuState, cartState, notification, scrollingTo, topBarInfo } = useLocalState()
  const [componentsHeight, setComponentsHeight] = useState({
    topbar: 0,
    BottomNavigator: 0
  })
  return (
    <InnerStyled>
      <TopBar/>
      <TopBarForMobile/>
      {notification.initial ? <Notification/> : null }
      {menuState.initial ? <Menu/> : null}
      {cartState.initial ? <Cart/> : null}
      {/* <Chat/> */}
      <InnerInner style={ windowWidth <= 650 ? scrollingTo ? { top: '0px', height: '100%' } : { top: '0px', height: 'calc(100% - 90px)' } : { height: `calc(100% - ${topBarInfo.height}px)`} }>
        {children}
      </InnerInner>
      <BottomNavigator/>
    </InnerStyled>
  )
}