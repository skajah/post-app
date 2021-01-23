import React from 'react'
import Joi from 'joi-browser';
import Form from './common/form';


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
        alert(`Registered with: ${this.state.data.email}`);
        window.location = '/';
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