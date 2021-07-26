import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement, CardElement } from "@stripe/react-stripe-js"
import CartItems from '../components/CartItems'
import useUser from '../hooks/useUser'
import { gql, useMutation, useQuery } from '@apollo/client'

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const CHECKOUT = gql`
	mutation CHECKOUT ($token: String!, $price: Float) {
		checkout(token: $token, price: $price) {
			success
		}
	}
`

const CheckoutStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	& > div {
		flex: 1;
		&:nth-child(2) {
			box-shadow: 0px 20px 25px 0px rgba(0,0,0,0.1);
		}
	}
`

const CheckoutAreaStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`
const CheckoutFormStyle = styled.form`
	width: 300px;
	display: flex;
	flex-direction: column;
	h2 {
		font-size: 24px;
		margin-bottom: 30px;

	}
	label {
		font-size: 12px;
	}
	div {
		width: 100%;
		display: flex;
		& > input {
			width: 50%;
			&:nth-child(1) {
				float: left;
				margin-right: 5px;
			}
			&:nth-child(2) {
				float: right;
				margin-left: 5px;
			}
		}
	}
	input {
		margin: 5px 0;
	}
	button {
		margin-top: 20px;
		cursor: pointer;
	}
`

export default function Checkout() {
	const user = useUser()
	return (
		<CheckoutStyle>
			<div>
				<CartItems userId={user?.id} showCartInfo={false}/>
			</div>
			<div>
				<CheckoutArea/>
			</div>
		</CheckoutStyle>
	)
}

function CheckoutArea() {
	return (
		<CheckoutAreaStyle>
			<Elements stripe={stripeLib}>
	        	<CheckoutForm/>
	    	</Elements>
		</CheckoutAreaStyle>
	)
}

function CheckoutForm() {
	 const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const [checkout] = useMutation(CHECKOUT)

	 const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)
    });
    console.log("[PaymentMethod]", payload);

    const res = await checkout({ variables: { token: payload.paymentMethod.id, price: 500 }})
		console.log(res)
  };

	return (
		<CheckoutFormStyle onSubmit={handleSubmit}>
			<h2>Pay with card</h2>
			<label>Card Information</label>
			{/* <input/> */}
			{/* <div> */}
			{/* 	<input/> */}
			{/* 	<input/> */}
			{/* </div> */}
			{/* <input/> */}
			<label>
        Card number
        <CardNumberElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
      <label>
        Expiration date
        <CardExpiryElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
      <label>
        CVC
        <CardCvcElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
			<button type="submit">Checkout</button>
		</CheckoutFormStyle>
	)
}

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
}


function useResponsiveFontSize() {
  const getFontSize = () => (typeof window !== 'undefined' && window.innerWidth < 450 ? "16px" : "18px");
  const [fontSize, setFontSize] = useState(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return fontSize;
}