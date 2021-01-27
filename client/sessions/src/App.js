
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import './App.css';
import { NobbleWallet } from "./common/services/nobble-wallet.module";
import Dashboard from "./views/dashboard/dashboard.view";
import HomeView from "./views/home/home.view";

class App extends React.Component {

  constructor() {
    super();
    this.state = { auth: false, wallet: undefined };
    // console.log("INSTANCE", NobbleWallet);
  }

  componentDidMount() {
    let subscription = NobbleWallet.subscribe("authentication", (res) => {
      console.log(res);
      this.setState({ auth: res.authorized });
    });
    this.setState({ wallet: subscription })
  }

  render() {
    return (
      <div className="container" >
        <Router>
          <Switch>
            <LoginRoute exact path="/" component={HomeView} auth={this.state.auth} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} auth={this.state.auth} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const PrivateRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route {...rest}
      render={
        props => auth ? (<Component {...props} />) : (<Redirect to={{ pathname: "/" }} />)
      }
    />
  )
}

const LoginRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route {...rest}
      render={
        props => auth ? (<Redirect to={{ pathname: "/dashboard" }} />) : (<Component {...props} />)
      }
    />
  )
}

export default App;
