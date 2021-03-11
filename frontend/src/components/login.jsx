import React from 'react';
import { Redirect } from 'react-router-dom';
import Joi from 'joi-browser';
import _ from 'lodash';
import Form from './common/form';
import auth from '../services/authService';
import UserContext from '../context/userContext';
import { makeAlert } from '../utils/alert';


class Login extends Form {
    static contextType = UserContext;

    data = { email: '', password: ''}

    state = {
        errors: {},
        alert: null
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().min(8).required().label('Password')
    }

    doSubmit = async () => {
        try {
            const { email, password } = this.data;
            await auth.login(email, password);

            this.context.onLogin(); // notify App that jwt is set

            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/'; // cause full reload because app's cdm() only called once 
            // toast.info(jwt);
            
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = makeAlert('danger', ex.response.data);
                this.setState({ alert });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to="/"/>;

        const { alert, errors } = this.state;
        return (
            <div className="form form-login center">
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    {  _.isEmpty(errors) && alert }
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', { type: 'password' })}
                    {this.renderButton('Login')}
                </form>
            </div>
        )
    }

}

export default Login;