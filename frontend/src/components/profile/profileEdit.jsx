import Joi  from 'joi-browser';
import Form from '../common/form';
import TextBox from '../common/textBox';
import UserContext from '../../context/userContext';

class ProfileEdit extends Form {
    static contextType = UserContext;

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
        // console.log('profileEdit componentDidMount()');
        const user = this.context.currentUser;;
        if (!user) return;

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
        // console.log('profileEdit render()');

        return ( 
            <div className="form form-profile-edit center">
                <h1>Edit Profile</h1>
                <form onSubmit={this.doSubmit}>
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('username', 'Username')}
                    <label>Profile Description</label>
                    <TextBox 
                    name="profileDescription"
                    className="text-box"
                    id="profile-desc-text-box"
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