import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, google} from 'google-maps-react';
import uuid from "uuid/v4"

const mapStyles = {
  width: '100%',
  height: '100%'
};

const API_KEY = process.env.REACT_APP_API_KEY;

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      markers: []
    };
  }

  onMapClick = (props, location, e) => {
    let newMarker = <Marker key={uuid()} onClick={this.onMarkerClick} position={e.latLng}/>
    console.log("coordinates", `${newMarker.props.position.lat()}, ${newMarker.props.position.lng()}`)
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        markers: [...this.state.markers, newMarker]
      })
    }

    onMarkerClick = (props, marker, e) => {
    return this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  };

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    let renderMarkers = this.state.markers.map(marker => (
      marker
    ));
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: 37.7606574,
          lng: -122.4619144
        }}
        onClick={this.onMapClick}
        >
        {renderMarkers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapContainer);