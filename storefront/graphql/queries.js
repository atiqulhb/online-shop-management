import { gql } from '@apollo/client'

export const QUERY_CART = gql`
	query QUERY_CART($id: ID!){
		User(where: { id: $id }) {
			cart {
		      id
		      cartItems {
		      	id
		        item {
		          id
		          name
		          price
		          image {
				    id
				    publicUrl
				  }
		        }
		        quantity
		      }
		      _cartItemsMeta {
		        count
		      }
		    }
		}
	}
`