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
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  centerEverything: {
    width: '100%',
    height: '100%',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerContainer: {
    flex:1, 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerText: {
    width: '80%',
    alignItems: 'center', 
    justifyContent: 'center',
    textAlign: 'center'
  },
  centerButton: {
    marginTop: 30, 
    width: '50%',
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf:'center'
  },
  bubbleButtonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
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
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: { 
    flexDirection: "column", 
    alignItems: "center",
  },
};