import { useEffect } from 'react'
import { gql, useSubscription, useQuery, useMutation } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


const GET_NEW_ORDER = gql`
  subscription {
    newOrder {
      id
      cart {
        id
      }
      orderer {
        id
        name
      }
      timeStamp
      totalItems
      totalAmounts
    }
  }
`

const ALL_ORDERS = gql`
	{
		allOrders (sortBy: timeStamp_DESC) {
      id
      cart {
        id
      }
      orderer {
        id
        name
      }
      timeStamp
      totalItems
      totalAmounts
    }
  }
`

const DELETE_ALL_ORDERS = gql`
  mutation DELETE_ALL_ORDERS ($orderIds: [ID!]) {
    deleteOrders(ids: $orderIds) {
      id
    }
  }
`

const OrderContainer = styled.div`
  display: flex;
  & > div {
    &:nth-child(1) {
      width: 100px;
      text-align: center;
      margin-left: 20px;
    }
    &:nth-child(2) {
      flex: 1;
      margin-left: 20px;
      &:hover {
        text-decoration: underline;
      }
    }
    &:nth-child(3) {
      width: 50px;
      text-align: center;
      margin-right: 20px;
    }
  }
`

const OrdersContainer = styled.div`
  width: 100%;
  height: 100%;
`

export default function Orders() {

  const { data, loading, error, subscribeToMore } = useQuery(ALL_ORDERS)
  const [deleteAllOrders] = useMutation(DELETE_ALL_ORDERS)

  useEffect(() => {
    let unsubscribe

    if (subscribeToMore) {
      unsubscribe = subscribeToMore({
        document: GET_NEW_ORDER,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newOrderItem = subscriptionData.data.newOrder;
          return Object.assign({}, prev, {
            allOrders: [newOrderItem, ...prev.allOrders]
          });
        }
      })
    }

    if(unsubscribe) return () => unsubscribe()
  },[subscribeToMore])

    console.log(data)

    const allOrders = data?.allOrders

    let orderIds = []

  for (let i=0; i<allOrders?.length; i++) {
    orderIds[i] = allOrders[i]?.id
  }

  console.log(orderIds)

  let sameDates = []


  for (let j=0; j<allOrders?.length; j++) {
    sameDates[j] = new Date(allOrders[j]?.timeStamp).getDate()
  }

  console.log(sameDates)

  function ToHourAndMinut(time) {
   return new Date(time).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    })
  }

  return (
    <OrdersContainer>
        <h2>Orders</h2>
        <button onClick={ async () => await deleteAllOrders({ variables: { orderIds }})}>delete Orders</button>
        {allOrders?.map(order => (
          <Link key={order.id} to={`/order?id=${order.id}`}>
            <OrderContainer>
              <div>{order.timeStamp ? ToHourAndMinut(order.timeStamp) : 'N/A'}</div>
              <div>{order.orderer.name} ordered flowrowista</div>
              {/* <div>{order.totalAmounts}</div> */}
              <div>x</div>
            </OrderContainer>
          </Link>
        ))}
    </OrdersContainer>
  )
}