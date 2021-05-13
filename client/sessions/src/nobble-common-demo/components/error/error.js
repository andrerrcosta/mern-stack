import React from "react";

export default class NobbleErrorDemo extends React.Component {

    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true });
      if(this.state.hasError) {
          /** ... */
      }
    }
  
  }