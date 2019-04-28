import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Container, Header, Title, Content, Text, Button,
  Icon, Left, Right, Body, Spinner, Toast
} from "native-base";
import { Location, } from 'expo';


import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {getDistance} from "../../helpers/googleApiClient"

import carMarkerImage1 from "../../../assets/car-top-view-1.png";
import carMarkerImage2 from "../../../assets/car-top-view-2.png";
import carMarkerImage3 from "../../../assets/car-top-view-3.png";
import carMarkerImage4 from "../../../assets/car-top-view-4.png";

const carMarkerImages = [carMarkerImage1, carMarkerImage2, carMarkerImage3, carMarkerImage4];

const { width, height } = Dimensions.get('window');

const ratio = width / height;
const coordinates = {
  latitude: 22.28552, 
  longitude: 114.15769,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5 * ratio,
};

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      markers: [],
      drivers: [],
      mapRegion: null,
      GOOGLE_MAP_API_KEY: null,
      isSearching: false,
    };

    this.displayRegion = {
      ...coordinates,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    }

    this.mapView = null;
    this.markerId = 0;
    this.dirKey = 0;
    this.pathColor = '#091fc6';
  }

  componentWillMount() {
    networkClient.POSTWithJWT(
      config.serverURL + '/api/secret/google-map-api-key', 
      {},
      (data)=>{
        if(!data) return;

        if(data.googleMapApiKey){
          this.setState({
            GOOGLE_MAP_API_KEY: data.googleMapApiKey,
            loading: false
          });
        }
      }
    );

    this._updateDriverLocationWorker = setInterval(this.getDriverLocation, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._updateDriverLocationWorker);
  }

  getDriverLocation = async () => {
    if(!this.props.navigation.isFocused()){
      return;
    }

    const url = config.serverURL + '/api/driver/get-all-drivers-location';
    const body = {};
    networkClient.POSTWithJWT(url, body, (data)=>{
      if(data===undefined) return;

      if(data.matchedDriver){
        // has a matched driver
        const newDrivers = [data.matchedDriver].map( (driverLocation, idx) =>{
          return {
            key: 'driver' + idx,
            coordinate: driverLocation.location
          };
        });;

        this.setState({ 
          drivers: newDrivers,
          isSearching: data.isSearching,
        });

      }else if(data.allDrivers && data.allDrivers.length>0){
        // has some online drivers
        const drivers = data.allDrivers;
        const newDrivers = drivers.map( (driverLocation, idx) =>{
          return {
            key: 'driver' + idx,
            coordinate: driverLocation.location
          };
        });
        this.setState({ 
          drivers: newDrivers,
          isSearching: data.isSearching,
        });
      }else{
        // no drivers at all
        this.setState({ 
          drivers: [],
          isSearching: data.isSearching,
        });
      }
      
    });
    
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const { GOOGLE_MAP_API_KEY, isSearching } = this.state;

    const numberOfMarkers = this.state.markers.length;
    
    if(this.state.loading){
      return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon type="MaterialIcons" name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Find Ride</Title>
          </Body>
          <Right />
        </Header>

        <Content scrollEnabled={false}>
          <View style={{ width, height }}>
            <Loading />
          </View>
        </Content>
      </Container>
      )
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon type="MaterialIcons" name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Find Ride</Title>
          </Body>
          <Right />
        </Header>

        <Content scrollEnabled={false}>
          <View style={{ width, height }}>

            <MapView 
              style={styles.map} 
              initialRegion={coordinates}
              showsMyLocationButton={true}
              region = {this.state.mapRegion || undefined} 
              showsUserLocation={true}
              onPress={(e) => this.onMapPress(e)}
              onMapReady={ this.moveToUserLocation }
              ref={c => this.mapView = c}
            >

              {this.state.markers.map( (marker, idx) => {
                if(idx===0){
                  return (
                    <Marker
                      key={marker.key}
                      coordinate={marker.coordinate}
                      pinColor={this.pathColor}
                    />
                  )
                }else{
                  return (
                    <Marker
                      key={marker.key}
                      coordinate={marker.coordinate}
                      pinColor={this.pathColor}
                    >
                      <Icon
                        type="FontAwesome"
                        name="flag"
                        style={{ width: 40, color: this.pathColor }}
                      />
                    </Marker>
                  )
                }
              })}


              {this.state.drivers.map( (driver, idx) => {
                  return (
                  <Marker
                    key={idx}
                    coordinate={driver.coordinate}
                    style={{ width: 50, height: 50 }}
                  >
                    <Image
                      source={carMarkerImages[idx%carMarkerImages.length]}
                      style={{ width: 50, height: 50 }}
                    />
                  </Marker>
                  );
                }
              )}

              {numberOfMarkers == 2 &&
                <MapViewDirections
                  key={this.dirKey++}
                  origin={this.state.markers[0].coordinate}
                  destination={this.state.markers[1].coordinate}
                  apikey={GOOGLE_MAP_API_KEY}
                  strokeWidth={3}
                  strokeColor={this.pathColor}
                  // // I think not zoom to the user selected pickup and drop off point is better for UX
                  // onReady={(result) => {
                  //   this.mapView.fitToCoordinates(result.coordinates, {
                  //     edgePadding: {
                  //       right: (width / 20),
                  //       bottom: (height / 20),
                  //       left: (width / 20),
                  //       top: (height / 20),
                  //     }
                  //   });
                  // }}
                />
              }
              
            </MapView>

            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed={false}   // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => this.changeMapRegion(data, details)}
              editable={ numberOfMarkers == 2 ? false : true }
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: GOOGLE_MAP_API_KEY,
                language: 'en', // language of the results
                // secondary_text: 'Hong Kong'
                // types: 'HK' // default: 'geocode'
                components: 'country:hk'
              }}
              
              styles={styles.searchBar}
              
              // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
              // currentLocationLabel="Current location"
              // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={500} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={
              //   ()  => numberOfMarkers == 0 && <Text>Start point</Text> 
              //   || numberOfMarkers == 1 && <Text>End point</Text>
              // }

              ref={(instance) => { this.GooglePlacesRef = instance }}
            />

            { isSearching?
              <View style={styles.contentContainer}>
                <View style={styles.centerGroup}>
                  <View style={styles.bubbleButtonContainer}>
                    <TouchableOpacity
                      style={[styles.bubble, styles.bubbleButton]}
                    >
                      <Text style={styles.buttonText}>Searching...</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              :
              null
            }
            

          </View>
          
          
        </Content>
      </Container>
    );
  }
  
  alert = () => {
    const { markers, GOOGLE_MAP_API_KEY } = this.state;

    getDistance(markers[0].coordinate, markers[1].coordinate, GOOGLE_MAP_API_KEY)
      .then((distance_duration) => {
        Alert.alert(
          'Ride details',
          'Travel distance: ' + distance_duration[0] + ' m\n' +
          'Estimate time: '+ Math.round(distance_duration[1]/60) +' mins',
          [ 
            {text: 'Submit', onPress: () => {
                this.submitRideRequest(distance_duration);
              } 
            },
            {text: 'Cancel', onPress: this.resetMarker}
          ],
          {cancelable: false},
        );

      })
      .catch((error) => {
        console.error(error);
      });
   
  }
  submitRideRequest = (distance_duration) => {
    const { markers, isSearching } = this.state;
    
    const estimatedOptimal = {
      distance: distance_duration[0],
      duration: distance_duration[1],
    };
    let body = {
      startLocation: markers[0].coordinate,
      endLocation: markers[1].coordinate,
      timestamp: (new Date()).getTime(),
      estimatedOptimal,
    };

    networkClient.POSTWithJWT(
      config.serverURL + '/api/rider/real-time-ride-request',
      body,
      (data)=>{
        Toast.show({
          text: 'Request sent, matching in progress ...',
          textStyle: { textAlign: 'center' },
          type: "success",
          position: "top",
          duration: 6000,
        });
        this.getDriverLocation();
      }
    );

    this.resetMarker();
  }

  changeMapRegion = (data, details) => {
    if(this.state.markers.length <= 1){
      this.setState({
        mapRegion: {
          latitude: details.geometry.location.lat, 
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ratio,
        }
      });
  
      this.GooglePlacesRef.setAddressText("");
    }
  }
  
  onMapPress = (e) => {
    const numberOfMarkers = this.state.markers.length;
    const {isSearching} = this.state;

    if( numberOfMarkers <= 1 && !isSearching){

      let newMarkers = JSON.parse(JSON.stringify(this.state.markers));
      newMarkers.push({
        coordinate: e.nativeEvent.coordinate,
        key: this.markerId++,
        color: this.pathColor,
      });

      this.setState({
        markers: newMarkers
      });

      if(numberOfMarkers == 1){
        setTimeout(()=>{
          this.alert();
        }, 2000);
      }
    }
  }
  
  resetMarker = () => {
    this.setState({ 
      markers: [], 
    });
    this.markerId = 0;
  }

  // randomColor = () => {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  moveToUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const coordinates = {
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    };

    if(this.mapView) {
      this.mapView.animateToRegion(coordinates, 1000);
    }
  }

}


const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default Search;