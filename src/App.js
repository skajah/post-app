import React, { Component } from 'react';
import Posts from './components/posts';
import NavBar from './components/navbar';
import './App.css';
import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="header">
          <NavBar />
        </div>
        <div id="content">
          <Switch>
            <Route path="/" component={Posts} exact />
          </Switch>
        </div>
        <div id="footer">Just a footer...</div>
      </React.Fragment>
    );
  }
}

export default App;
