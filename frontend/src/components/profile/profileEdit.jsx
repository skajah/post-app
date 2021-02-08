import Joi  from 'joi-browser';
import Form from '../common/form';
import TextBox from '../common/textBox';
import auth from '../../services/authService';

class ProfileEdit extends Form {
    state = { 
        data: { email: '', username: '' },
        errors: {},
        description: ''
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
        const { data, description } = this.state;
        const { email, username } = data;
        alert(`Profile Saved!\nEmail: ${email}\nUsername: ${username}\nDescription: ${description}`);
        this.props.history.push('/profile');
        // Should call user service to post new info
    }
    
    handleDescriptionChange = text => {
        this.setState({ description: text });
    }

    render() { 
        // const user = auth.getCurrentUser();
        // if (!user) return <Redirect to="/login"/>;
        return ( 
            <div className="form">
                <h1>Edit Profile</h1>
                <form onSubmit={this.doSubmit}>
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('username', 'Username')}
                    <label>Profile Description</label>
                    <TextBox 
                    name="profileDescription"
                    placeHolder=" Share about yourself"
                    style={{width: '100%', marginBottom: 10}}
                    onTextChange={this.handleDescriptionChange}
                    />
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default ProfileEdit;