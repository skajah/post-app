import React from 'react';
import Form from '../common/form';
import TextBox from '../common/textBox';
import UserContext from '../../context/userContext';
import { updateMe } from '../../services/userService';
import { toast } from 'react-toastify';

class ProfileEdit extends Form {
    static contextType = UserContext;

    state = {
        alert: null,
        username: '',
        email: '',
        description: ''
    }

    componentDidMount() {
        const { email, username, description } = this.context.currentUser;
        this.email = email;
        this.username = username;
        this.deescription = description;
        this.setState({ email, username, description });
    }

    handleTextChange = (text, type) => {
        switch (type) {
            case 'username':
                this.username = text;
                break;
            case 'email':
                this.email = text;
                break;
            case 'description':
                this.description = text;
            default:
                break;
        }
    }
    
    makeAlert(type, message){
        return (
            <div className={"alert alert-" + type} style={{width: '35%'}}>
                { message }
            </div>
        );
    }
    handleEmailUpadate = async () => {
        try {
            const { data: newEmail } = await updateMe({ email: this.email });
            console.log('newEmail: ', newEmail);
            const alert = this.makeAlert('success', 'Email updated');
            this.setState({ alert, email: this.email });
            this.context.updateUser('email', newEmail);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = this.makeAlert('danger', ex.response.data);
                this.setState({ alert })
            }
        }
    }

    handleUsernameUpdate = async () => {
        try {
            const { data: newUsername } = await updateMe({ username: this.username });
            console.log('newUsername: ', newUsername);
            const alert = this.makeAlert('success', 'Username updated');
            this.setState({ alert, username: this.username })
            this.context.updateUser('username', newUsername);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = this.makeAlert('danger', ex.response.data);
                this.setState({ alert })
            }
        }
    }

    handleDescriptionUpdate = async () => {
        try {
            const { data: newDescription } = await updateMe({ description: this.description });
            console.log('newDescription: ', newDescription);
            const alert = this.makeAlert('success', 'Description updated');
            this.setState({ alert, description: this.description });
            this.context.updateUser('description', newDescription);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = this.makeAlert('danger', ex.response.data);
                this.setState({ alert })
            }
        }
    }

    render() { 
        // console.log('profileEdit render()');
        const { email, username, description } = this.context.currentUser;
        if (!email) return null; // must not bee loaded yet 

        return ( 
            <React.Fragment>
                { this.state.alert }
                <div className="profile-edit">
                
                <div className="profile-edit-text-boxes">
                    <label>Email</label>
                    <TextBox 
                    name="editEmail"
                    defaultValue={email}
                    type="input"
                    className="text-box"
                    onTextChange={(text) => this.handleTextChange(text, 'email')}/>
                    
                    <label>Username</label>
                    <TextBox 
                    name="editUsername"
                    defaultValue={username}
                    type="input"
                    className="text-box"
                    onTextChange={(text) => this.handleTextChange(text, 'username')}/>
                    
                    <label>Description</label>
                    <TextBox 
                    name="editDescription"
                    defaultValue={description}
                    type="textbox"
                    className="text-box"
                    onTextChange={(text) => this.handleTextChange(text, 'description')}
                    id="profile-desc-text-box"/>
                </div>
                
                <div className="profile-edit-buttons">

                    <button 
                    className="btn-profile-edit"
                    onClick={this.handleEmailUpadate}>Save</button>

                    <button 
                    className="btn-profile-edit"
                    onClick={this.handleUsernameUpdate}>Save</button>

                    <button 
                    className="btn-profile-edit"
                    onClick={this.handleDescriptionUpdate}>Save</button>
                </div> 
            </div>
            </React.Fragment>
         );
    }
}
 
export default ProfileEdit;