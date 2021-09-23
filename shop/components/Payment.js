import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

const PaymentStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const Button = styled.button`
	padding: 10px 20px;
	border-radius: 50px;
	margin: 10px;
	cursor: pointer;
	border: 1px solid black;
	background-color: white;
	&:focus {
		outline: none;
	}
`

const PaymentTypesStyle = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	& > * {
		opacity: 0.3;
  		animation: fadeIn 300ms ease forwards;
	}
`

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`

const PaymentMethods = styled.div``

const OnlinePaymentStyle = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export default function Payment() {
	const [paymentType, setPaymentType] = useState('')
	return (
		<PaymentStyle>
			{ paymentType === '' ? (
				<PaymentTypes selectedType={type => setPaymentType(type)}/>
			) : (
				<PaymentMethods>
					<span onClick={() => setPaymentType('')}>&lt;</span>
					{{
						'': null,
						'online-payment': <OnlinePayment/>,
						'cash-on-delivery': <CashOnDelivery/>
					}[paymentType]}
				</PaymentMethods>
			)}
		</PaymentStyle>
	)
}

function PaymentTypes({ selectedType }) {
	function handleSelection(type) {
		selectedType && selectedType(type)
	}
	return (
		<PaymentTypesStyle>
			<Button onClick={() => handleSelection('online-payment')}>Pay Online</Button>
			<span>Or</span>
			<Button onClick={() => handleSelection('cash-on-delivery')}>Cash On Delivert</Button>
		</PaymentTypesStyle>
	)
}

function OnlinePayment() {
	return (
		<OnlinePaymentStyle>
			<Button onClick={() => handleSelection('online-payment')}>Stripe</Button>
			<span>Or</span>
			<Button onClick={() => handleSelection('cash-on-delivery')}>Paypal</Button>
		</OnlinePaymentStyle>
	)
}

function CashOnDelivery() {
	return (
		<p>Cash On Delivert</p>
	)
}