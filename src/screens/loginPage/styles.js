const React = require("react-native");
const { Platform } = React;

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
