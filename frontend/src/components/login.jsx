import React from 'react';
import { Redirect } from 'react-router-dom';
import Joi from 'joi-browser';
import Form from './common/form';
import auth from '../services/authService';
import UserContext from '../context/userContext';


class Login extends Form {
    static contextType = UserContext;

    state = {
        data: { email: '', password: ''},
        errors: {}
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password')
    }

    doSubmit = async () => {
        try {
            const { data } = this.state;
            await auth.login(data.email, data.password);

            this.context.onLogin(); // notify App that jwt is set

            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/'; // cause full reload because app's cdm() only called once 
            // toast.info(jwt);
            
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = {...this.state.errors};
                errors.email = ex.response.data;
                this.setState({ errors });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to="/"/>;

        return (
            <div className="form form-login center">
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