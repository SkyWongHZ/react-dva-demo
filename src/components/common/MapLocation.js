import React from 'react'
import { Map, Marker } from 'react-amap'

const MapLocation = ({center, getPosition}) => {
  const events = {
    created: (ins) => {console.log(ins)},
    click: ({lnglat}) => {
      const latitude = lnglat.getLat();
      const longitude = lnglat.getLng();
      getPosition({latitude, longitude})
    }
  }
  const defaultPosition = { longitude: 115, latitude: 30 } 
  return (
    <Map      
      amapkey="801469fd5c7f996628f24feb2139cceb"
      events={events}
      center={center || defaultPosition}
    >
      <Marker position={center || defaultPosition}/>
    </Map>
  )
}

export default MapLocation
