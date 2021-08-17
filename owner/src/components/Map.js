import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'

const MapContainer = styled.div`
	width: 600px;
	height: 300px;
`

mapboxgl.accessToken = 'pk.eyJ1IjoiYXRpcXVsaGIiLCJhIjoiY2tuZ2RjaGxmMDJ6ZDJvcGcxbG5vcXNyNiJ9.gQwP__qwBsaiHcpyyQ5OIA'

export default function Map({ currentLocation, start }) {



  let increment = 0.01
  let lineIncrement = 1
  let map

  const nav = new mapboxgl.NavigationControl();


  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(90.7197093);
  const [lat, setLat] = useState(24.5217333);
  const [zoom, setZoom] = useState(15)

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    })

    const marker = new mapboxgl.Marker()
		.setLngLat([lng, lat])
		.addTo(map)

    map.addControl(nav, 'top-right');

    map.on('load', function() {
      map.addSource('point', {
		type: 'geojson',
		data: {
			"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "Point",
						"coordinates": [
							90.7197093,
							24.5217333
						]
					}
				}]
			}
	  })
	})

  //     map.getSource('some id').setData({
		// "type": "FeatureCollection",
		// "features": [{
		// 	"type": "Feature",
		// 	"properties": { "name": "Null Island" },
		// 	"geometry": {
		// 		"type": "Point",
		// 		"coordinates": [ 0, 0 ]
		// 	}
		// }]
	 //  })
// 	console.log(currentLocation)
// 


    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
		if (currentLocation) {
	    let { longitude, latitude } = currentLocation
	  	console.log(longitude)
	  	console.log(latitude)
	    
	    console.log(map)
	    // map.getSource("point").setData({
	    //   "type": "FeatureCollection",
	    //   "features": [{
					// 	"type": "Feature",
					// 	"properties": {},
					// 	"geometry": {
					// 		"type": "Point",
					// 		"coordinates": [ longitude, latitude ]
					// 	}
					// }]
	    // })
		}
  },[currentLocation])

  return (
    <div>
      <MapContainer ref={mapContainerRef} />
    </div>
  );
}