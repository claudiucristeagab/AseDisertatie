import React from 'react';
import { MapWithAMarker} from 'components/map/GoogleMap';

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export class RentalMap extends React.Component {
    render(){
        const location = this.props.location
        return (
            <MapWithAMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `360px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                location={location}
            />
        )
    }
}
