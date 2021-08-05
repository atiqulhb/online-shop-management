import React from 'react'
import { gql, useSubscription } from '@apollo/client'

const CURRENT_LOCATION = gql`
	subscription {
	  currentLocation {
	    latitude
	    longitude
	  }
	}

`

export default function Deliveries() {
	const { data } = useSubscription(CURRENT_LOCATION)
	
	if (!data) return null

	let { latitude, longitude } = data.currentLocation
	return (
		<div>
			<p>current location of delivery boy</p>
			<p>latitude: {latitude}</p>
			<p>longitude: {longitude}</p>
		</div>
	)
}