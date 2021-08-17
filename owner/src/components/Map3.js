import { useState, useEffect, useMemo } from 'react';
import ReactMapGL, { Marker,  NavigationControl, FullscreenControl, GeolocateControl, Source, Layer } from 'react-map-gl';
import BikeRoutes from '../BikeRoutes'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXRpcXVsaGIiLCJhIjoiY2tuZ2RjaGxmMDJ6ZDJvcGcxbG5vcXNyNiJ9.gQwP__qwBsaiHcpyyQ5OIA'


const geolocateStyle = {
  top: 0,
  right: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  right: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  right: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  right: 0,
  padding: '10px'
}

export default function Map() {
  const [viewport, setViewport] = useState({
    longitude: 90.7197093,
    latitude: 24.5217333,
    zoom: 14
  })

  const [pointData, setPointData] = useState(null);

  // useEffect(() => {
  //   const animation = window.requestAnimationFrame(() => {
  //     
  //   return () => window.cancelAnimationFrame(animation);
  //   })
  // })

  const usableData = BikeRoutes.features[0].geometry

  // for(let i=0; i<usableData.coordinates.length; i++) {
  //   setTimeout(() => {
  //     setPointData({ type: usableData.type, coordinates: usableData.coordinates[i]})
  //     console.log(usableData.coordinates[i])
  //   }, 1000)
  // }


const pointLayer = {
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
}

  // Only rerender markers if props.data has changed
  // const markers = useMemo(() => data.map(
  //   city => (
  //     <Marker key={city.name} longitude={city.longitude} latitude={city.latitude} >
  //       {/* <img src="pin.png" /> */}
  //       <span>{city.name}</span>
  //     </Marker>
  //   )
  // ), [data]);

  return (
    <ReactMapGL {...viewport} width="600px" height="300px" onViewportChange={setViewport}  mapboxApiAccessToken={MAPBOX_TOKEN}>
      {/* {markers} */}
      <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        {pointData && (
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
    </ReactMapGL>
  );
}