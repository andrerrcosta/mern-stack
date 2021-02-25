
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import './App.css';
import { NobbleWallet } from "./common/services/nobble-wallet.module";
import NotFoundView from "./views/404/404";
import Dashboard from "./views/dashboard/dashboard.view";
import HomeView from "./views/home/home.view";
import ZTest from "./views/ztest/ztest";

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
            <Route exact path="/test" component={ZTest} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} auth={this.state.auth} />
            <Route component={NotFoundView} />
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
