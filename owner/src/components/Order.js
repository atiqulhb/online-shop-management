import { useState } from 'react'
import useQueryParam from '../hooks/useQueryParam'
import { gql, useQuery, useSubscription } from '@apollo/client'
import styled from 'styled-components'
import routes from './starterRoutes'
import MapGL, { Marker, CanvasOverlay } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Map from './Map'
import Map3 from './Map3'
import Map4 from './Map4'

const OrderStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	h1 {
		text-align: center;
		margin: 0;
	}
	& > div {
		&:nth-child(1) {
			width: 100%;
			height: 50px;
			display: flex;
			background-color: yellow;
			& > div {
				&:nth-child(1) {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					h3 {
						margin: 0;
						padding: 0;
					}
				}
				&:nth-child(2) {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}
			}
		}
	}
`

const MapArea = styled.div`
	width: 600px;
	height: 300px;
	margin: 0 auto;
	/*box-shadow: 0px 3px 30px 3px rgba(0,0,0,0.3)*/
`


const ORDER_INFO = gql`
	query QUERY_INFO ($id: ID!) {
		Order(where: {
			id: $id
		}){
			orderer {
				id
				name
				email
			}
			totalAmounts
		}
	}
`

const DELIVERYBOYS_CURRENT_LOCATION = gql`
	subscription {
	  currentLocation {
	  	id
	    longitude
	    latitude
	  }
	}
`

export default function Order() {
	let queryParam = useQueryParam()
	const id = queryParam.get('id')

	const { data, loading, error } = useQuery(ORDER_INFO, { variables: { id }})
	const { data: currentLocationData } = useSubscription(DELIVERYBOYS_CURRENT_LOCATION)

	if (loading) return <p>loading...</p>
	if (error) return <p>error occured</p>

	const { orderer, totalAmounts } = data.Order

	return (
		<OrderStyle>
			<h1>Order</h1>
			<div>
				<div>
					<h3>Order No: #456798</h3>
					<h4>{orderer.name}</h4>
					<span>{orderer.email}</span>
				</div>
				<div>
					<span>Florowista</span>
					<span>{totalAmounts}</span>
				</div>
			</div>
			<div>
				<MapArea>
					{/* <Map currentLocation={currentLocationData?.currentLocation}/> */}
					<Map4/>
				</MapArea>
			</div>
		</OrderStyle>
	)
}



const mapboxaccesstoken = 'pk.eyJ1IjoiYXRpcXVsaGIiLCJhIjoiY2tuZ2RjaGxmMDJ6ZDJvcGcxbG5vcXNyNiJ9.gQwP__qwBsaiHcpyyQ5OIA'

function Map2() {
  const [viewport, setViewPort] = useState({
    width: "100%",
    height: "100%",
    latitude: 38.889726473242526,
    longitude: -77.00320124234425,
    zoom: 12.721197192553936
  });

  const _onViewportChange = viewport =>
    setViewPort({ ...viewport, transitionDuration: 20 });

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={mapboxaccesstoken}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={_onViewportChange}
    >
      {routes.map(route => (
        <PolylineOverlay
          points={route.direction0LatLongs}
          key={route.RouteID}
        />
      ))}
    </MapGL>
  );
}

function PolylineOverlay(props) {
  function _redraw({ width, height, ctx, isDragging, project, unproject }) {
    const {
      points,
      color = "#FF482D",
      lineWidth = 3,
      renderWhileDragging = true
    } = props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  }

	return <CanvasOverlay redraw={_redraw} />;
}