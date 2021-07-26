import { useState, useRef } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'
import Compressor from 'compressorjs'

const ADD_STOCK = gql`
	mutation ADD_STOCK($name: String, $buyingPrice: Float, $image: Upload, $quantity: Float, $date: DateTime, $imageAttribution: String){
	  createStock(data: {
	    name: $name
	    image: $image
	    quantity: $quantity
	    buyingPrice: $buyingPrice
	    date: $date
	    imageAttribution: $imageAttribution
	  }){
	    id
	    name
	    image {
	    	id
	    	publicUrl
	    }
	    quantity
	    date
	  }
	}
`

const AddStockLayout = styled.div`
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
	& > input, div, button {
		padding: 5px;
		margin: 5px;
	}
`

export default function AddStock() {
	const [variables, setVariables] = useState({
		name: undefined,
		buyingPrice: undefined,
		image: undefined,
		quantity: undefined,
		imageAttribution: undefined
	})
	const [publish, setPublish] = useState(true)

	console.log(publish)

	const FormRef = useRef()

	const [addStock] = useMutation(ADD_STOCK, { variables: { ...variables, date: new Date() } })
	
	function handleChange(e) {
		let { value, name, type, validity: { valid }, files } = e.target

		if (type === 'number') {
			value = parseFloat(value);
		}

		if (type === 'file') {
			if(window !== 'undefined') {
				if (valid) {
					// value = files[0]
					 const image = files[0];
				    new Compressor(image, {
				      quality: 0.8,
				      success: (compressedResult) => {
				        console.log(compressedResult)       
				      },
				    });
				}
			}
		}

		setVariables({
			...variables,
			[name]: value,
		})
	}

	async function handleSubmit(e) {
		e.preventDefault();
        const res = await addStock();
        console.log(res)
        if (res.data) {
        	FormRef.current.reset()
	        setVariables({name: undefined, price: undefined, image: undefined, quantity: undefined, imageAttribution: undefined})
        }
	} 

	return (
		<AddStockLayout>
			<StyledForm ref={FormRef} onSubmit={handleSubmit}>
				<input type="text" name="name"  placeholder="Name" onChange={handleChange}/>
				<input type="file" name="image" onChange={handleChange}/>
				<input type="text" name="imageAttribution" placeholder="Image Attribution" onChange={handleChange}/>
				<input type="number" step="0.01" min={0} name="quantity"  placeholder="Quantity" onChange={handleChange}/>
				<input type="number" step="0.01" min={0} name="buyingPrice" placeholder="Price" onChange={handleChange}/>
				<div>
					<label>Publish</label>
					<input type="checkbox" value="publish" checked={publish} onChange={e => setPublish(e.target.checked)}/>
				</div>
				<button type="submit">Add Product</button>
			</StyledForm>
		</AddStockLayout>
	)
}