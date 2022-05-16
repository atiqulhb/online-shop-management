import React, { useState } from 'react'
import styled from 'styled-components'
import AddProduct from '../components/AddProduct'
import AllProducts from '../components/AllProducts'
import AddStock from '../components/AddStock'

const ProductsLayout = styled.div`
	width: 100%;
	height: 100vh;
	h2 {
		text-align: center;
	}
`

const Nav = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	span {
		cursor: pointer;
		&.active {
			border-bottom: 1px solid black;
		}
	}
`

const Contents = styled.div

export default function Products() {
	const [tab, setTab] = useState('all-products')
	return (
		<ProductsLayout>
			<h2>Products</h2>
			<Nav>
				<span className={ tab === 'all-products' ? 'active' : null } onClick={() => setTab('all-products')}>All Products</span>
				<span className={ tab === 'add-product' ? 'active' : null } onClick={() => setTab('add-product')}>Add Product</span>
				<span className={ tab === 'stock-info' ? 'active' : null } onClick={() => setTab('stock-info')}>Stock Information</span>
				<span className={ tab === 'add-stock' ? 'active' : null } onClick={() => setTab('add-stock')}>Add Stock</span>
			</Nav>
			{{
				'all-products': <AllProducts/>,
				'add-product': <AddProduct/>,
				'stock-info': <Employees />,
				'add-stock': <AddStock />,
		    } [tab] }
		</ProductsLayout>
	)
}

function Employees() {
	return <h3>Employees</h3>
}