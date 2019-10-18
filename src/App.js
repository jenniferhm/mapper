import React, { PureComponent } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
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
      selectedPlace: {},        //Shows the infoWindow to the selected place upon a marker
      listings: {},             //Listings as nested objects of a addresses/whole listings
      markers: new Set()               //Markers -> made from Set for non-duplicate listings
    };
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  componentDidMount() {
    let listingsLatLng = new Set()
    for (let listing of locationsData) {
      if (!listingsLatLng.has(listing.address_1)) {
        listingsLatLng.add(<Marker key={uuid()}
          className={'listing'}
          name={`$${listing.price}, ${listing.size}`}
          onMouseover={this.onMouseOver}
          onMouseout={this.onMouseOut}
          position={{ lat: listing.latitude, lng: listing.longitude }} />)
      }
    }

    let listingsObj = {}

    locationsData.map(marker => {
      // Create listing for info
      return listingsObj[marker.address_1] = marker.address_1 in listingsObj 
      ? { ...listingsObj[marker.address_1], [marker.id]: marker } 
      : { [marker.id]: marker }
    });

    this.setState(st => ({
      ...st,
      listings: listingsObj,
      markers: listingsLatLng
    })
    )
  }

  onMouseOver(props, marker, e) {
    return this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      markers: this.state.markers
    })
  };

  onMouseOut(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        markers: this.state.markers
      });
    }
  };

  render() {
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
      >
        {this.state.markers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onMouseOut={this.onMouseOut}
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