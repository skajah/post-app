import React from 'react';
import Form from '../common/Form';
import _ from 'lodash';
import UserContext from '../../context/userContext';
import { makeAlert } from '../../utils/alert';
import { updateMe } from '../../services/userService';
import Joi  from 'joi-browser';

class EditPassword extends Form {
    static contextType = UserContext;

    state = {
        errors: {},
        alert: null
    }

    schema = {
        password: Joi.string().min(8),
        confirmPassword: Joi.string()
    }

    data = { password: '', confirmPassword: '' }

    doSubmit = async () => {
        const { password, confirmPassword } = this.data;
        if (confirmPassword !== password){
            const errors = { confirmPassword: "Passwords don't match"};
            this.setState({ errors });
            return;
        }
        try {
            
            await updateMe({ password });
            // console.log('newUsername: ', newUsername);
            const alert = makeAlert('success', 'Password updated');
            this.setState({ alert })
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = { password: ex.response.data };
                this.setState({ errors })
            }
        }
    }

    render() { 
        const { alert, errors } = this.state;

        return ( 
            <div className="form form-password center">
                <h1>Edit Password</h1>
                <form onSubmit={this.handleSubmit}>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('password', 'New Password', { type: 'password' })}
                    {this.renderInput('confirmPassword', 'Confirm Password', { type: 'password' })}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default EditPassword;