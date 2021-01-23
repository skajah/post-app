import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Posts from './components/posts';
import NavBar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import NotFound from './components/notFound';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="header">
          <NavBar />
        </div>
        <div id="content">
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/posts" component={Posts} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" to="/posts" exact />
            <Redirect to="/not-found" />
          </Switch>
        </div>
        <div id="footer">Just a footer...</div>
      </React.Fragment>
    );
  }
}

export default App;
