import React from 'react';
import { Redirect } from 'react-router-dom';

import _ from 'lodash';
import Joi from 'joi-browser';
import Form from './common/form';
import { register } from '../services/userService';
import auth from '../services/authService';
import UserContext from '../context/userContext';

class Register extends Form {
    static contextType = UserContext;
    
    state = {
        data: { username: '', email: '', password: '' },
        errors: {}
    }

    schema = {
        username: Joi.string().min(5).max(255).required().label('Username'),
        email: Joi.string().min(8).max(255).email().required().label('Email'),
        password: Joi.string().min(8).max(255).required().label('Password'),
        // password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }
 
    doSubmit = async () => {
        try {
            const response = await register(this.state.data);
            auth.loginWithJwt(response.headers['x-auth-token']);
            this.context.onLogin(); // notify App that jwt is set
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = {...this.state.errors};
                errors.username = ex.response.data;
                this.setState({ errors });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to='/' />;
        return (
            <div className="form form-register center">
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('username', 'Username')}
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', 'password')}
                    {//this.renderInput('confirmPassword', 'Confirm Password', 'password')
                    }
                    {this.renderButton('Register')}
                </form>
            </div>
        )
    }

}

export default Register;