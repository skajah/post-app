import React from 'react';
import { Redirect } from 'react-router-dom';

import _ from 'lodash';
import Joi from 'joi-browser';
import Form from './common/form';
import { register } from '../services/userService';
import auth from '../services/authService';
import UserContext from '../context/userContext';
import { makeAlert } from '../utils/alert';

class Register extends Form {
    static contextType = UserContext;
    
    state = {
        errors: {},
        data: {},
        alert: null
    }

    data = { username: '', email: '', password: '' }

    schema = {
        username: Joi.string().min(5).max(255).required().label('Username'),
        email: Joi.string().min(8).max(255).email().required().label('Email'),
        password: Joi.string().min(8).max(255).required().label('Password'),
        // password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }

    doSubmit = async () => {
        try {
            const response = await register(this.data);
            auth.loginWithJwt(response.headers['x-auth-token']);
            this.context.onLogin(); // notify App that jwt is set
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = makeAlert('danger', ex.response.data);
                this.setState({ alert });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to='/' />;

        const { alert, errors } = this.state;
        console.log(errors);
        return (
            <div className="form form-register center">
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('username', 'Username')}
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', { type: 'password' })}
                    {//this.renderInput('confirmPassword', 'Confirm Password', 'password')
                    }
                    {this.renderButton('Register')}
                </form>
            </div>
        )
    }

}

export default Register;