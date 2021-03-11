import React, { Component } from 'react';
import ProfilePic from '../common/profilePic';
import TextBox from '../common/textBox';
import Camera from '../common/icons/camera';
import VideoCamera from '../common/icons/videoCamera';
import Volume from '../common/icons/volume';
import withAlert from '../hoc/withAlert';
import Media from '../common/media';

class CreatePostBox extends Component {
    state = {
        clear: false,
        media: null
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
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";

        const { clear, media } = this.state;

        return ( 
            <div className="card bg-light create-post-box">
                <div className="card-header create-post-header">
                    <ProfilePic src={url}/>  
                    {
                        media && 
                        <button 
                        className="btn clear-media-button"
                        onClick={this.handleClearMedia}>Clear Media</button>
                    }
                    
                </div>
                <div className="card-body create-post-body">
                    <TextBox 
                    name="postText"
                    placeHolder=" What's on your mind?"
                    value={clear ? '' : null}
                    onTextChange={this.handleTextChange}
                    className="text-box"
                    type="textbox"
                    id="create-post-text-box"/>

                    { media && <Media type={media.type} src={URL.createObjectURL(media.src)} {...media.attr}/> }

                </div>
                <div className="card-footer create-post-footer">
                    <span className="upload-icons">
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
                    </span>
                    
                    <button 
                    className="btn create-post-button" 
                    onClick={this.handleCreate}>Post</button>
                </div>
            </div>
         );
    }
}
 
export default withAlert(CreatePostBox);