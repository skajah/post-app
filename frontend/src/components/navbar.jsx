import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom';
import auth from '../services/authService';
import UserContext from '../context/userContext';
import './Navbar.css';

class NavBar extends Component {
    static contextType = UserContext

    render() { 
        const { currentUser } = this.context;
        return ( 
            <nav className="navbar navbar-expand-lg justify-content-between">
                <Link className="navbar-brand" to="/posts">
                    <i className="fa fa-comments" style={{marginRight: 5}} />
                    SBKonnect
                </Link>
                <div className="nav-items">
                    {
                        auth.hasCurrentUser() ?
                        <React.Fragment>
                            <NavLink className="nav-link nav-item" to={`/profile/${currentUser._id}`}>Profile</NavLink>
                            <NavLink className="nav-link nav-item" to="/logout">Logout</NavLink>
                        </React.Fragment> :
                        <React.Fragment>
                            <NavLink className="nav-link nav-item" to="/register">Register</NavLink>
                            <NavLink className="nav-link nav-item" to="/login">Login</NavLink>
                        </React.Fragment> 
                    }
                    
                </div>
            </nav>
         );
    }
}
 
export default NavBar;
