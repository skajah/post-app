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
import UserContext from './context/userContext';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import auth from './services/authService';
import { getMe } from './services/userService';
import EditUsername from './components/profile/editUsername';
import EditEmail from './components/profile/editEmail';
import EditPassword from './components/profile/editPassword';
import EditDescription from './components/profile/editDescription';

class App extends Component {
  state = {
    currentUser: null,
  };

  componentDidMount() {
    // console.log('App componentDidMount()');
    if (auth.hasCurrentUser()) this.setUser();
  }

  setUser = async () => {
    try {
      const { data: jwt } = await getMe();
      auth.loginWithJwt(jwt);
      this.handleLogin();
      console.log('User set: ');
    } catch (ex) {
      if (ex.response) {
        const status = ex.response.status;
        console.log('Resonse: ', ex.response.data);
        if (status >= 400 && status < 500)
          console.log('Unabled to get current user');
      }
      console.log('Error: ', ex);
    }
  };

  handleLogin = () => {
    this.setState({ currentUser: auth.getCurrentUser() });
  };

  handleLike = (id, type, liked) => {
    const currentUser = { ...this.state.currentUser };
    if (type === 'post') {
      const { likedPosts } = currentUser;
      if (liked) likedPosts[id] = 1;
      else delete likedPosts[id];
    } else if (type === 'comment') {
      const { likedComments } = currentUser;
      if (liked) likedComments[id] = 1;
      else delete likedComments[id];
    }
    this.setState({ currentUser });
  };

  updateUser = (property, value) => {
    const currentUser = { ...this.state.currentUser };
    currentUser[property] = value;
    console.log(`Changing [${property}] to [${value}]`);
    this.setState({ currentUser });
  };

  render() {
    // console.log('App render()');

    // The user's jwt might be set in local storage
    // but the state might not have been upadated yet
    if (auth.hasCurrentUser() && !this.state.currentUser) return null;
    return (
      <UserContext.Provider
        value={{
          currentUser: this.state.currentUser,
          onLogin: this.handleLogin,
          onLike: this.handleLike,
          updateUser: this.updateUser,
        }}
      >
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
              <ProtectedRoute
                path="/profile/edit/username"
                component={EditUsername}
                exact
              />
              <ProtectedRoute
                path="/profile/edit/email"
                component={EditEmail}
                exact
              />
              <ProtectedRoute
                path="/profile/edit/description"
                component={EditDescription}
                exact
              />
              <ProtectedRoute
                path="/profile/edit/password"
                component={EditPassword}
                exact
              />

              <Route path="/not-found" component={NotFound} />
              <Redirect from="/" to="/posts" exact />
              <Redirect to="/not-found" />
            </Switch>
          </main>
          <footer id="footer">Just a footer...</footer>
        </React.Fragment>
      </UserContext.Provider>
    );
  }
}

export default App;
