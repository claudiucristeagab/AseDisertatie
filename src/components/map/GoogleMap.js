import React from 'react'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

function MapComponent(props){
    const coordinates = props.coordinates;
    return (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={coordinates}
            center={coordinates}
        >
            <Marker
                position={coordinates}
            />
        </GoogleMap>
    )
}

function withGeocode(WrappedComponent){
    return class RentalDetail extends React.Component {
        constructor(){
            super();
            this.state = {
                coordinates: {
                    lat:0,
                    lng:0
                }
            }
        }

        componentWillMount(){
            this.geocodeLocation();
        }
        
        geocodeLocation(){
            const location = this.props.location;
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({address: location}, (res, status) => {
                if(status === 'OK'){ 
                    const geometry = res[0].geometry.location;
                    const coordinates = {
                        lat: geometry.lat(),
                        lng: geometry.lng()
                    };
                    this.setState({
                        coordinates: coordinates
                    });
                }
            })
        }

        render(){
            return(
                <WrappedComponent {...this.state}/>
            )
        }
    }
}

export const MapWithAMarker = withScriptjs(withGoogleMap(withGeocode(MapComponent)));
  
