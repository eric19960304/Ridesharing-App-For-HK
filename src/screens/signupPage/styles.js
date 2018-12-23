import { Platform } from 'react-native';

export default {
  container: {
    backgroundColor: "#fff"
  },
  signupButton: { 
    margin: 15
  },
  label: {
    paddingTop: Platform.OS=="android"? 5 : 0
  }
};
