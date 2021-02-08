import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import ProfilePage from './components/profile/profilePage';
import ProfileEdit from './components/profile/profileEdit';
import NotFound from './components/notFound';
import PostPage from './components/posts/postPage';
import Logout from './components/logout';
import ProtectedRoute from './components/common/protectedRoute';
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
            <Route path="/logout" component={Logout} exact />
            <Route path="/register" component={Register} exact />
            <ProtectedRoute path="/posts" component={PostPage} exact />
            <ProtectedRoute path="/profile" component={ProfilePage} exact />
            <ProtectedRoute
              path="/profile/edit"
              component={ProfileEdit}
              exact
            />
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
