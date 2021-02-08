import React from 'react'
import Joi from 'joi-browser';
import Form from './common/form';
import auth from '../services/authService';


class Login extends Form {
    state = {
        data: { email: '', password: ''},
        errors: {}
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password')
    }

    doSubmit = () => {
        const data = {...this.state.data};
        data.username = 'pseudo-username';
        auth.login(data);

        /* 
            If they had tried to access a protect route, get that url
            then redirect them that page
        */
        const { state } = this.props.location;

        window.location = state ? state.from.pathname : '/'
    }

    render() {
        return (
            <div className="form">
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', 'password')}
                    {this.renderButton('Login')}
                </form>
            </div>
        )
    }

}

export default Login;