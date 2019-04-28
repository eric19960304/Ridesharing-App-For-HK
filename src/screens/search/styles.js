import {
  StyleSheet,
} from 'react-native';

export default {
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    position: 'absolute',
    top: 70,
    left: 10
  },
  viewContainer:{
    flex: 1
  },
  searchBar: { 
    textInputContainer: {
      width: '100%',
    },
    listView: {
      backgroundColor: 'white',
    },
    description: {
      fontWeight: 'bold',
    },
  },
  bubbleButtonContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    marginHorizontal: 100,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(250, 10, 10, 0.80)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bubbleButton: {
    width: 150,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20
  },
  centerGroup: { 
    marginBottom: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: { 
    flexDirection: "column", 
    alignItems: "center"
  },
};