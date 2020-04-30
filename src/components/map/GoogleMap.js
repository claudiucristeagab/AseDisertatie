import React from 'react'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import {CacheService} from 'services/cacheService';

function MapComponent(props){
    const {coordinates, isError, isLocationLoaded} = props;
    return (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={coordinates}
            center={coordinates}
            options={{disableDefaultUI: isError ? true : false}}
        >
            {!isError && isLocationLoaded && <Marker
                position={coordinates}
            />} 
            {isError && isLocationLoaded && <InfoWindow position={coordinates} options={{maxWidth:300}}>
                <div>
                    There was an error while loading the location of the property. Please contact the host for information about its location.
                </div>
            </InfoWindow>}
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
                },
                isError: false,
                isLocationLoaded: false
            }
            this.cacheService = new CacheService();
        }

        componentWillMount(){
            this.getGeocodedLocation();
        }
        
        updateCoordinates(coordinates){
            this.setState({
                coordinates: coordinates,
                isLocationLoaded: true
            });
        }

        geocodeLocation(location){
            return new Promise((resolve, reject) => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({address: location}, (res, status) => {
                    if(status === 'OK'){ 
                        const geometry = res[0].geometry.location;
                        const coordinates = {
                            lat: geometry.lat(),
                            lng: geometry.lng()
                        };
                        this.cacheService.cacheValue(location, coordinates);
                        resolve(coordinates);
                    }
                    else{
                        reject("Geocoder error!");
                    }
                })
            });
        }

        getGeocodedLocation(){
            const location = this.props.location;
            const cachedCoordinates = this.cacheService.isValueCached(location);
            if (cachedCoordinates){
                this.updateCoordinates(cachedCoordinates);
            }
            else {
                this.geocodeLocation(location).then(
                    (coordinates)=>{
                        this.updateCoordinates(coordinates);
                    },
                    (error)=>{
                        this.setState({
                            isError: true,
                            isLocationLoaded: true
                        });
                    });
            }
        }

        render(){
            return(
                <WrappedComponent {...this.state}/>
            )
        }
    }
}

export const MapWithAMarker = withScriptjs(withGoogleMap(withGeocode(MapComponent)));
  
