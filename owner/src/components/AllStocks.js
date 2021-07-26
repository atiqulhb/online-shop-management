import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from '@apollo/client'
import { BsTrash } from "react-icons/bs"

const ALL_STOCKS = gql`
	query ALL_STOCKS {
		allStocks {
			id
			name
			quantity
			buyingPrice
			published
			date
		}
	}
`

// const PUBLISH_AS_PRODUCT = gql`
// 	mutation
// `

const AllStocksStyle = styled.div`
	width: 100%;
	height: 100%;
	table {
		width: 100%;
 		border-collapse: collapse;
 		td, th {
   			border: 1px solid #999;
   			text-align: center;
		}
	}
`

const Publish = styled.button`
	cursor: pointer;
	padding: 5px 15px;
	background-color: yellowgreen;
	border: none;
`

export default function AllStocks() {
	const { data } = useQuery(ALL_STOCKS)
	console.log(data)
	return (
		<AllStocksStyle>
			<table>
				<thead>
					<tr>
						<th>Added</th>
						<th>Title</th>
						<th>Quantity</th>
						<th>Buying Price</th>
						<th>Status</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{ data?.allStocks?.map(({ id, name, quantity, buyingPrice, published, date }) => (
						<tr key={id}>
							<td>{new Date(date).toLocaleString('en-US')}</td>
							<td>{name}</td>
							<td>{quantity}</td>
							<td>{buyingPrice}</td>
							<td>{published ? 'published' : <Publish>Publish</Publish>}</td>
							<td><BsTrash/></td>
						</tr>
					))}
				</tbody>
			</table>
		</AllStocksStyle>
	)
}