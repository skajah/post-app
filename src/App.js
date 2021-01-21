import React, { Component } from 'react';
import Post from './components/post';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Post />
      </React.Fragment>
    );
  }
}

export default App;
