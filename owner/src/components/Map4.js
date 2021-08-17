import { useEffect } from 'react'
import styled from 'styled-components'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapContainer = styled.div`
	width: 100%;
	height: 100%;
`

export default function Map4() {
	useEffect(() => {
	    var map = L.map('map').setView([14.0860746, 100.608406], 6);

	    //osm layer
	    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	    });
	    osm.addTo(map);

	    if(!navigator.geolocation) {
	        console.log("Your browser doesn't support geolocation feature!")
	    } else {
	        setInterval(() => {
	            navigator.geolocation.getCurrentPosition(getPosition)
	        }, 5000);
	    }

	    var marker, circle;

	    function getPosition(position){
	        // console.log(position)
	        var lat = position.coords.latitude
	        var long = position.coords.longitude
	        var accuracy = position.coords.accuracy

	        if(marker) {
	            map.removeLayer(marker)
	        }

	        if(circle) {
	            map.removeLayer(circle)
	        }

	        marker = L.marker([lat, long])
	        circle = L.circle([lat, long], {radius: accuracy})

	        var featureGroup = L.featureGroup([marker, circle]).addTo(map)

	        map.fitBounds(featureGroup.getBounds())

	        console.log("Your coordinate is: Lat: "+ lat +" Long: "+ long+ " Accuracy: "+ accuracy)
	    }
	},[])
	return (
		<MapContainer id="map">
			
		</MapContainer>
	)
}