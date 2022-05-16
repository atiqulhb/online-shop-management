import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'

const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT(
    $name: String
    $brand: String
    $category: String
    $price: Float
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        brand: $brand
        category: $category
        price: $price
        image: $image
      }
    ){
      id
      name
      brand
      category
      price
      image {
      	id
      	publicUrl
      }
    }
  }
`

const AddProductLayout = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

const StyledForm = styled.form`
	width: 300px;
	height: auto;
	display: flex;
	flex-direction: column;
`


export default function AddProduct() {
	const [variables, setVariables] = useState({
		name: undefined,
		brand: undefined,
		category: undefined,
		price: undefined,
		image: undefined
	})

	const [addProduct] = useMutation(ADD_PRODUCT, {
		variables,
		update(cache, { data: { createProduct } }) {
			cache.modify({
			  fields: {
				allProducts(existingProducts = []) {
				  const newProductRef = cache.writeFragment({
					data: createProduct,
					fragment: gql`
					  fragment NewProduct on Product {
						id
						name
						price
					  }
					`
				  });
				  return [...existingProducts, newProductRef]
				}
			  }
			})
		}
	})

	function handleChange(e) {
		let { value, name, type, validity: { valid }, files } = e.target

		if (type === 'number') {
			value = parseFloat(value);
		}

		if (type === 'file') {
			if(window !== 'undefined') {
				if (valid) {
					value = files[0]
				}
			}
		}

		setVariables({
			...variables,
			[name]: value,
		})
	}

	async function handleSubmit(e) {
		e.preventDefault()
        const res = await addProduct()
        console.log(res);
        document.getElementById('form').reset()
        setVariables({ name: undefined, brand: undefined, category: undefined, price: undefined, image: undefined })
	}

	return (
		<AddProductLayout>
			<StyledForm id="form" onSubmit={handleSubmit}>
				<input type="text" name="name" placeholder="Name" onChange={handleChange}/>
				<input type="text" name="brand" placeholder="Brand" onChange={handleChange}/>
				<input type="text" name="category" placeholder="Category" onChange={handleChange}/>
				<input type="number" step="0.01" min={0} name="price" placeholder="Price" onChange={handleChange}/>
				<input type="file" name="image" placeholder="Image" onChange={handleChange}/>
				<button type="submit">Add Product</button>
			</StyledForm>
		</AddProductLayout>
	)
}