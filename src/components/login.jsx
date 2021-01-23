import React from 'react'
import Joi from 'joi-browser';
import Form from './common/form';


class Login extends Form {
    state = {
        data: { email: '', password: '' },
        errors: {}
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password')
    }

    doSubmit = () => {
        alert(`Logged in with: ${this.state.data.email}`);
        window.location = '/';
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