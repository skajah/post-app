import React, { Component } from 'react';
import ProfilePic from './common/profilePic';
import TextBox from './common/textBox';
import withWarning from './hoc/withWarning';

class CreatePostBox extends Component {
    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { text, onTextChange, onCreatePost } = this.props;

        return ( 
            <div className="card bg-light post-box">
                <div className="card-header">
                    <ProfilePic // default style prop to make size 60x60
                    src={url}/> 
                </div>
                <div className="card-body">
                    <TextBox 
                    name="postText"
                    placeHolder=" What's on your mind?"
                    value={text}
                    onTextChange={onTextChange}
                    className="post-text-box"/>
                </div>
                <div className="card-footer create-post-footer">
                    <i className="fa fa-camera"/>
                    <i className="fa fa-video-camera"/>
                    <i className="fa fa-volume-up"/>
                    <button 
                    className="btn btn-secondary" 
                    onClick={onCreatePost}>Post</button>
                </div>
            </div>
         );
    }
}
 
export default withWarning(CreatePostBox);