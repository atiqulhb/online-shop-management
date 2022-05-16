import { createContext, useState, useContext, useLayoutEffect, useEffect, memo } from 'react'
import { gql, useMutation, useQuery, useApolloClient } from '@apollo/client'
import { useAuth } from '../lib/authentication'
import { QUERY_CART } from '../graphql/queries'

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;


const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      success
    }
  }
`

const ADD_TO_CART = gql`
  mutation ADD_TO_CART (
    $productId: ID!
    $quantity: Int!
    $userId: ID!
  ) {
    addToCart(
      productId: $productId
      quantity: $quantity
      userId: $userId
    ){
      cart {
        id
      }
      item {
        name
      }
      quantity
    }
  } 
`


function LocalState({ children }) {
  const { user } = useAuth()
  const [viewportHeight, setViewportHeight] = useState(0)
  const [reloadShoppingCart, setReloadShoppingCart] = useState(0)
  const [reFetchCartItems, setReFetchCartItems] = useState(0)
  const [reloadCartComponent, setReloadCartComponent] = useState(0)
  const [cartItemNumber, setCartItemNumber] = useState(0)
  const [scrollingTo, setScrollingTo] = useState(undefined)
  const [notification, setNotification] = useState({
    initial: false,
    open: false,
    message: undefined
  })
  const [reloadCartForLocalStorage, setReloadCartForLocalStorage] = useState(0)
  const [reloadCartItemBadgeNumber, setReloadCartItemBadgeNumber] = useState(0)

  const [cartState, setCartState] = useState({
    initial: false,
    comeIn: false,
  })

  const [menuState, setMenuState] = useState({
    initial: false,
    comeIn: false,
  })

  const [cartInfo, setCartInfo] = useState({
    totalItems: 0,
    totalAmounts: 0
  })

  const [topBarInfo, setTopBarInfo] = useState({
    height: 0,    
  })

  useEffect(() => {
    if (navigator.sendBeacon) {
      // console.log('Beacon Api supported')
    } else {
      // console.log('Beacon Api not supported')
    }
    if (user) {
      console.log(user)
      const cartItemsInLocalStorage_serialized = localStorage.getItem('osm-cart')
      const cartItemsInLocalStorage = JSON.parse(cartItemsInLocalStorage_serialized)

      // console.log(cartItemsInLocalStorage)

      let cartItemsInServer = [],
          i = 0

      for (i;i<user.cart?.cartItems.length;i++) {
        let cartItemInServer = { ...user.cart.cartItems[i].item, quantity: user.cart.cartItems[i].quantity }
        cartItemsInServer.push(cartItemInServer)
      }


    }
  },[user])

  function SaveToLocalStorage(item) {
    if (typeof window !== 'undefined') {
      const ItemsInCart = localStorage.getItem('ecomm-cart')
      if (ItemsInCart == null) {
        let ItemsInCart = []
        ItemsInCart.push(item)
        const ItemsInCart_serialized = JSON.stringify(ItemsInCart)
        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
        console.log('added to cart')
      }
      else {
        const ItemsInCart_deserialized = JSON.parse(ItemsInCart)
        const ItemInCart = ItemsInCart_deserialized.find(c => c.id === item.id);
        if (ItemInCart) {
          const index = ItemsInCart_deserialized.indexOf(ItemInCart)
          if (index >= 0) { ItemsInCart_deserialized.splice(index, 1)}
          ItemInCart.quantity += item.quantity
          // ItemsInCart_deserialized.push(ItemInCart)
          ItemsInCart_deserialized.splice(index, 0, ItemInCart)
        }
        else {
          ItemsInCart_deserialized.push(item)
        }
        const ItemsInCart_serialized = JSON.stringify(ItemsInCart_deserialized)
        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
      }
      setReloadShoppingCart(Math.random())
    }
  }

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [ { query: QUERY_CART, variables: { id: user?.id } }]
  })

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [ { query: QUERY_CART, variables: { id: user?.id } }]
  })

  function AddToCart2(item) {
    if (typeof window !== 'undefined') {
      const ItemsInCart = localStorage.getItem('osm-cart')
      if (ItemsInCart == null) {
        let ItemsInCart = []
        ItemsInCart.push(item)
        const ItemsInCart_serialized = JSON.stringify(ItemsInCart)
        localStorage.setItem('osm-cart', ItemsInCart_serialized)
        console.log('added to cart')
      }
      else {
        const ItemsInCart_deserialized = JSON.parse(ItemsInCart)
        const ItemInCart = ItemsInCart_deserialized.find(c => c.id === item.id);
        if (ItemInCart) {
          // const index = ItemsInCart_deserialized.indexOf(ItemInCart)
          // if (index >= 0) { ItemsInCart_deserialized.splice(index, 1)}
          let newHistory = ItemInCart.history.concat(item.history)
          ItemInCart.history = newHistory
          // ItemsInCart_deserialized.push(ItemInCart)
          // ItemsInCart_deserialized.splice(index, 0, ItemInCart)
        }
        else {
          ItemsInCart_deserialized.push(item)
        }
        const ItemsInCart_serialized = JSON.stringify(ItemsInCart_deserialized)
        localStorage.setItem('osm-cart', ItemsInCart_serialized)
      }
      setReloadCartComponent(Math.random())
    }
  }

  

  return (
    <LocalStateProvider value={{
      viewportHeight,
      SaveToLocalStorage,
      reloadShoppingCart,
      setReloadShoppingCart,
      removeFromCart,
      reFetchCartItems,
      setReFetchCartItems,
      reloadCartComponent,
      setReloadCartComponent,
      cartItemNumber,
      setCartItemNumber,
      menuState,
      setMenuState,
      notification,
      setNotification,
      reloadCartForLocalStorage,
      setReloadCartForLocalStorage,
      addToCart,
      cartState,
      setCartState,
      scrollingTo,
      setScrollingTo,
      cartInfo,
      setCartInfo,
      topBarInfo,
      setTopBarInfo,
      AddToCart2,
      reloadCartItemBadgeNumber,
      setReloadCartItemBadgeNumber
     }}>
      {children}
    </LocalStateProvider>
  );
}

function useLocalState() {
  const all = useContext(LocalStateContext);
  return all;
}

export { LocalState, LocalStateContext, useLocalState };