import React from 'react'
import Joi from 'joi-browser';
import Form from './common/form';
import auth from '../services/authService';

class Register extends Form {
    state = {
        data: { username: '', email: '', password: '' },
        errors: {}
    }

    schema = {
        username: Joi.string().min(5).required().label('Username'),
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().min(5).required().label('Password')
    }

    doSubmit = () => {
        auth.login(this.state.data);
        window.location = '/posts';
    }

    render() {
        return (
            <div className="form">
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('username', 'Username')}
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', 'password')}
                    {this.renderButton('Register')}
                </form>
            </div>
        )
    }

}

export default Register;