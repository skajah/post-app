import React, { Component } from 'react';
import ProfilePic from '../common/profilePic';
import TextBox from '../common/textBox';
import Camera from '../common/icons/camera';
import VideoCamera from '../common/icons/videoCamera';
import Volume from '../common/icons/volume';
import withAlert from '../hoc/withAlert';
import Media from '../common/media';
import UserContext from '../../context/userContext';
import './CreatePostBox.css';
import Button from '../common/Button';

class CreatePostBox extends Component {
    static contextType = UserContext;

    state = {
        clear: false,
        media: null,
    }

    text = ''

    handleTextChange = text => {
        this.text = text;
        if (this.state.clear)
            this.setState({ clear: false });
    }

    handleCreate = () => {
        this.props.onCreate(this.text, this.state.media);
        this.text = '';
        this.setState({ media: null, clear: true });
    }

    handleMediaUpload = (src, type) => {
        const media = { type, src, attr: {className: 'post-media'} };
        this.setState({ media })
    }

    handleClearMedia = () => {
        this.setState({ media: null })
    }

    render() { 
        const { clear, media } = this.state;

        return ( 
            <div className="card bg-light create-post-box">
                <div className="card-header create-post-header">
                    <ProfilePic src={this.context.currentUser.profilePic} /> 
                    {
                        media && 
                        <Button
                        color="whitesmoke"
                        size="btn--xsmall"
                        onClick={this.handleClearMedia}>Clear Media
                        </Button>
                    }
                    
                </div>
                <div className="card-body create-post-body">
                    <TextBox 
                    name="postText"
                    placeHolder=" What's on your mind?"
                    value={clear ? '' : null}
                    onTextChange={this.handleTextChange}
                    className="text-box"
                    type="textarea"
                    id="create-post-text-box"/>

                    { media && <Media type={media.type} src={URL.createObjectURL(media.src)} {...media.attr}/> }

                </div>
                <div className="card-footer create-post-footer">
                    <Camera 
                    extensions={['jpg', 'jpeg', 'png', 'gif']}
                    onFileChosen={src => this.handleMediaUpload(src, 'image')}
                    maxFileSize={10}
                    size="lg"/>

                    <VideoCamera 
                    extensions={['mp4', 'mov', 'mpg']}
                    onFileChosen={src => this.handleMediaUpload(src, 'video')}
                    maxFileSize={10}
                    size="lg"/>

                    <Volume
                    extensions={['mp3', 'wav', 'ogg']}
                    onFileChosen={src => this.handleMediaUpload(src, 'audio')}
                    maxFileSize={10}
                    size="lg"/>

                    <Button
                    style="btn--outline"
                    size="btn--xsmall"
                    onClick={this.handleCreate}>
                        Post
                    </Button>
                </div>
            </div>
         );
    }
}
 
export default withAlert(CreatePostBox);