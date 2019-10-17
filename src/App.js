import React, { PureComponent } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, google} from 'google-maps-react';
import uuid from "uuid/v4"
const locationsData = require('./sampleListingsData');

const mapStyles = {
  width: '100%',
  height: '100%'
};

const API_KEY = process.env.REACT_APP_API_KEY;

export class MapContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      markers: []
    };
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onClose = this.onClose.bind(this)

  }

  componentDidMount() {
    let renderMarkers = locationsData.map(marker => {
      let listingLatLng = {lat: marker.latitude, lng: marker.longitude}
      return <Marker key={uuid()} className={'marker'} name={`$${marker.price}, ${marker.size}`} onMouseover={this.onMarkerClick} onMouseout={this.onClose} position={listingLatLng}/> 
    }
    );
    this.setState(st => ({
      ...st, markers: renderMarkers
    })
    )
  }

  onMarkerClick(props, marker, e) {
    console.log("MARKER", marker)
    return this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      markers: this.state.markers
    })
  };

  onClose(props){
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        markers: this.state.markers
      });
    }
  };

  render() {
    console.log("MARKERS", this.state.markers)
    return (
      <Map
        id={'map'}
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: 37.7606574,
          lng: -122.4619144
        }}
        onClick={this.onMapClick}
        >
        {this.state.markers}
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