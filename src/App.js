import React, { Component } from 'react';
import Posts from './components/posts';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Posts />
      </React.Fragment>
    );
  }
}

export default App;
