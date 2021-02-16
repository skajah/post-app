import React, { Component } from 'react';
import Post from './post';
import CreatePostBox from './createPostBox';

class Posts extends Component {
    state = { 
        postText: '',
        emptyPost: false,
        media: null,
     }

    handlePostTextChange = postText => {
        this.setState({ postText });
    }

    handleCreatePost = () => {
        const { postText, media } = this.state;
        if ( !(postText.trim() || media) ) {
            this.setState({ emptyPost: true });
            return;
        }

        this.props.onCreatePost(postText, media);
        this.setState({ postText: '', emptyPost: false, media: null });
    }

    handleClearMedia = () => {
        this.setState({ media: null });
    }

    uploadMedia = (type, src) => {
        const media = { type, src, attr: {className: 'post-media'} };
        this.setState({ media, emptyPost: false });
    }


    handleUploadImage = (file) => {
        this.uploadMedia('image', file);
    }

    handleUploadVideo = (file) => {
        this.uploadMedia('video', file);
    }

    handleUploadAudio = (file) => {
        this.uploadMedia('audio', file);
    }

    render() { 
        const { postText, media, emptyPost } = this.state;
        const { posts, onDelete, onPostClick } = this.props;
        const alert = { type: 'warning', message: "Post can't be empty"};

        return ( 
            <div className="posts">
                <CreatePostBox 
                text={postText}
                onTextChange={this.handlePostTextChange} 
                onCreatePost={this.handleCreatePost}
                alert={emptyPost && alert}
                onUploadImage={this.handleUploadImage}
                onUploadVideo={this.handleUploadVideo}
                onUploadAudio={this.handleUploadAudio}
                media={media}
                onClearMedia={this.handleClearMedia}/>

                {
                    posts.map(post => {
                        return <Post 
                        key={post._id} 
                        post={post}
                        onDelete={() => onDelete(post)}
                        onPostClick={() => onPostClick(post)}/>;
                    }) 
                }
            </div>
         );
    }
}
 
export default Posts;