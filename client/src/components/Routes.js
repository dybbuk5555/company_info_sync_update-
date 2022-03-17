import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "./auth/Login";
import PrivateRoute from './common/PrivateRoute';
import Student from './pages/Student';

class Routes extends Component {
    render() {
        return (
            < div className="App" >
                <Switch>
                    <Route exact path="/" component={Login} />     
                    <PrivateRoute exact path="/student" component={Student} />
                    <Route exact path="/login" component={Login} />
                    <Redirect to="/student" />
                </Switch>
            </div >
        )
    }
}

export default Routes;
