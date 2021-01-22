import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() { 
        return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="#">SBKonnect</Link>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="#">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="#">Features</NavLink>
                        </li>
                        <li className="nav-item">                        
                            <NavLink className="nav-link" to="#">Pricing</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
         );
    }
}
 
export default NavBar;
