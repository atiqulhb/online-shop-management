import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from '@apollo/client'
import { BsTrash } from "react-icons/bs"

const All_PRODUCT_QUERY = gql`
	{
		allProducts {
			id
			name
			price
		}
	}
`

const DELETE_PRODUCT = gql`
	mutation DELETE_PRODUCT($id: ID!){
	  deleteProduct(id: $id) {
	    id
	  }
	}
	`

const ProductsTable = styled.div`
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

export default function AllProducts() {
	const { data } = useQuery(All_PRODUCT_QUERY)
	console.log(data)
	const [ deleteProduct ] = useMutation(DELETE_PRODUCT)
	return (
		<ProductsTable>
			<table>
				<thead>
					<tr>
						<th>Number</th>
						<th>Name</th>
						<th>Price</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{ data?.allProducts.map(({ id, name, price}, key) => (
						<tr key={id}>
							<td>{key+1}</td>
							<td>{name}</td>
							<td>{price}</td>
							<td
								onClick={() => {
									deleteProduct({ variables: { id }})
									.catch(err => {
							            alert(err.message)
							        })
							    }}
							><BsTrash/></td>
						</tr>
					))}
				</tbody>
			</table>
		</ProductsTable>

	)
}