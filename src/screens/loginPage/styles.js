import { Platform } from 'react-native';

export default {
  container: {
    backgroundColor: "#fff"
  },
  loginButton: { 
    margin: 15
  },
  label: {
    paddingTop: Platform.OS=="android"? 5 : 0
  }
};
