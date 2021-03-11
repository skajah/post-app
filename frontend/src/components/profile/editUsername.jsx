import React from 'react';
import Form from '../common/form';
import _ from 'lodash';
import UserContext from '../../context/userContext';
import { makeAlert } from '../../utils/alert';
import { updateMe } from '../../services/userService';
import Joi  from 'joi-browser';

class EditUsername extends Form {
    static contextType = UserContext;

    state = {
        errors: {},
        alert: null
    }

    schema = {
        username: Joi.string()
    }

    data = {}

    componentDidMount() {
        this.data.username = this.context.currentUser.username;
    }

    doSubmit = async () => {
        try {
            const { username } = this.data;
            const { data: newUsername } = await updateMe({ username });
            // console.log('newUsername: ', newUsername);
            const alert = makeAlert('success', 'Username updated');
            this.setState({ alert })
            this.context.updateUser('username', newUsername);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = { username: ex.response.data };
                this.setState({ errors })
            }
        }
    }

    render() { 
        const { username } = this.context.currentUser;
        const { alert, errors } = this.state;

        return ( 
            <div className="form form-username center">
                <h1>Edit Username</h1>
                <form onSubmit={this.handleSubmit}>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('username', 'Username', { defaultValue: username })}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default EditUsername;