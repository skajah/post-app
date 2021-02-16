import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import ProfilePage from './components/profile/profilePage';
import ProfileEdit from './components/profile/profileEdit';
import NotFound from './components/notFound';
import PostPage from './components/posts/postPage';
import PostsPage from './components/posts/postsPage';
import Logout from './components/logout';
import ProtectedRoute from './components/common/protectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar />
        <main>
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/register" component={Register} exact />
            <ProtectedRoute path="/posts" component={PostsPage} exact />
            <ProtectedRoute path="/posts/:id" component={PostPage} exact />
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
        </main>
        <footer id="footer">Just a footer...</footer>
      </React.Fragment>
    );
  }
}

export default App;
