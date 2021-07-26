import React, { useState } from 'react'
import styled from 'styled-components'
import AllStocks from '../components/AllStocks'
import AddStock from '../components/AddStock'

const StocksStyle = styled.div`
	width: 100%;
	height: 100vh;
	& > h2 {
		text-align: center;
	}
	& > div:nth-child(2) {
		width: 100%;
		display: flex;
		justify-content: space-around;
		span {
			height: 25px;
			cursor: pointer;
			&.active {
				border-bottom: 1px solid black;
			}
		}
	}
	& > div:nth-child(3) {
		padding-top: 20px;
	}
`

const Nav = styled.div`
	
`

export default function Stocks() {
	const [tab, setTab] = useState('stock-details')
	return (
		<StocksStyle>
			<h2>Stocks</h2>
			<div>
				<span className={ tab === 'stock-details' ? 'active' : null } onClick={() => setTab('stock-details')}>Stock Details</span>
				<span className={ tab === 'add-to-stock' ? 'active' : null } onClick={() => setTab('add-to-stock')}>Add To Stock</span>
			</div>
			<div>
				{{
					'stock-details': <AllStocks/>,
					'add-to-stock': <AddStock />,
			    } [tab] }
			</div>
		</StocksStyle>
	)
}