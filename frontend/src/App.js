import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from './context/UserContext';
import PostsPage from './components/posts/PostsPage';
import NotFound from './components/NotFound';
import PostPage from './components/posts/PostPage';
import Login from './components/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import NavBar from './components/Navbar';
import Logout from './components/Logout';
import ProfilePage from './components/profile/ProfilePage';
import EditDescription from './components/profile/EditDescription';
import EditUsername from './components/profile/EditUsername';
import EditEmail from './components/profile/EditEmail';
import EditPassword from './components/profile/EditPassword';
import ProfileEdit from './components/profile/ProfileEdit';
import ScrollToTop from './components/ScrollToTop';

import auth from './services/authService';
import { getMe } from './services/userService';
import { decompress } from './utils/media';
import Register from './components/Register';

class App extends Component {
  state = {
    currentUser: null,
  };

  componentDidMount() {
    console.log('App componentDidMount()');
    this.setUser();
    // auth.logout();
  }

  setUser = async () => {
    console.log('Setting user...');
    if (!auth.hasCurrentUser()) {
      console.log('No user found');
      return;
    }
    try {
      this.handleLogin();
    } catch (ex) {
      if (ex.response) {
        const status = ex.response.status;
        console.log('Resonse: ', ex.response.data);
        if (status >= 400 && status < 500)
          console.log('Unabled to get current user');
      }
      console.log('Error: ', ex);
      console.log('Logging out...');
      auth.logout();
    }
  };

  handleLogin = async () => {
    console.log('handleLogin()');
    console.log('Getting me...');
    const currentUser = await getMe();

    if (currentUser.profilePic)
      currentUser.profilePic = await decompress(currentUser.profilePic);
    this.setState({ currentUser });
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

  handleFollow = (id) => {
    const currentUser = { ...this.state.currentUser };
    const isFollowing = currentUser.following[id];
    if (isFollowing) delete currentUser.following[id];
    else currentUser.following[id] = 1;

    if (currentUser._id === id) {
      // follow/unfollow self; need to update followers
      if (isFollowing) delete currentUser.followers[id];
      else currentUser.followers[id] = 1;
    }

    this.setState({ currentUser });
  };

  updateUser = (property, value) => {
    const currentUser = { ...this.state.currentUser };
    currentUser[property] = value;
    // console.log(`Changing [${property}] to [${value}]`);
    this.setState({ currentUser });
  };

  render() {
    if (auth.hasCurrentUser() && !this.state.currentUser) return null;

    return (
      <UserContext.Provider
        value={{
          currentUser: this.state.currentUser,
          onLogin: this.handleLogin,
          onLike: this.handleLike,
          onFollow: this.handleFollow,
          updateUser: this.updateUser,
        }}
      >
        <React.Fragment>
          <ToastContainer />
          <NavBar />
          <main>
            <ScrollToTop>
              <Switch>
                <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <ProtectedRoute path="/posts/:id" component={PostPage} exact />
                <ProtectedRoute path="/posts" component={PostsPage} exact />
                <ProtectedRoute
                  path="/profile/edit"
                  component={ProfileEdit}
                  exact
                />
                <ProtectedRoute
                  path="/profile/:id"
                  component={ProfilePage}
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
            </ScrollToTop>
          </main>
          <footer></footer>
        </React.Fragment>
      </UserContext.Provider>
    );
  }
}

export default App;
