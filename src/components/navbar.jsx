import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom';
import auth from '../services/authService';

class NavBar extends Component {
    render() { 
        const user = auth.getCurrentUser();
        return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <Link className="navbar-brand " to="/posts">
                    <i class="fa fa-comments" style={{marginRight: 5}} />
                    SBKonnect
                </Link>
                <div className="nav-items">
                    {
                        user ?
                        <React.Fragment>
                            <NavLink className="nav-link nav-item" to="/profile/edit">Profile</NavLink>
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
