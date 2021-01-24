import { Redirect } from 'react-router-dom';
import Joi  from 'joi-browser';
import Form from './common/form';
import auth from '../services/authService';

class ProfileEdit extends Form {
    state = { 
        data: { email: '', username: '' },
        errors: {}
     }

    schema = {
        email: Joi.string().email().required().label('Email'),
        username: Joi.string().min(5).required().label('Username')
    }

    componentDidMount() {
        const user = auth.getCurrentUser();
        if (!user) return

        const { email, username } = user;
        const data = { email, username };
        this.setState({ data });
    }

    doSubmit = () => {
        const { email, username } = this.state.data;
        alert(`Profile Saved!\nEmail: ${email}\nUsername: ${username}`);
        this.props.history.push('/profile');
        // Should call user service to post new info
    }
    
    render() { 
        const user = auth.getCurrentUser();
        if (!user) return <Redirect to="/login"/>;
        return ( 
            <div className="form">
                <h1>Edit Profile</h1>
                <form onSubmit={this.doSubmit}>
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('username', 'Username')}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default ProfileEdit;