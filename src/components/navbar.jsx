import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() { 
        return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <Link className="navbar-brand " to="/posts">
                    <i class="fa fa-comments" style={{marginRight: 5}} />
                    SBKonnect
                </Link>
                <div className="nav-items">
                    <NavLink className="nav-link nav-item" to="/register">Register</NavLink>
                    <NavLink className="nav-link nav-item" to="/login">Login</NavLink>
                    <NavLink className="nav-link nav-item" to="/profile">Profile</NavLink>
                    <NavLink className="nav-link nav-item" to="#">Logout</NavLink>
                </div>
            </nav>
         );
    }
}
 
export default NavBar;
