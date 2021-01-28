import React, { Component } from 'react';
import _ from 'lodash';
import { getPosts } from '../services/fakePostService';
import Post from './post';
import CreatePostBox from './postBox';

class Posts extends Component {
    state = { 
        posts: [],
        postText: '',
        emptyPost: false,
        media: null,
     }

    componentDidMount(){
        const posts = getPosts();
        this.setState({ posts });
    }

    handleDelete = ({ _id }) => {
        const posts = this.state.posts.filter(post => post._id !== _id);
        this.setState({ posts });
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
        const posts = [...this.state.posts];
        const post = {
            _id: this.getNextId(),
            username: 'Anonymous',
            date : new Date(),
            likes: 0,
            text: postText,
            media,
            comments: []
        };
        posts.unshift(post);
        this.setState({ posts, postText: '', emptyPost: false, media: null });
    }

    getNextId(){
        const { posts } = this.state;
        return (_.max(posts.map(p => p._id)) + 1) || 0;
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
        const { posts, postText, media, emptyPost } = this.state;
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
                        onDelete={() => this.handleDelete(post)}/>;
                    }) 
                }
            </div>
         );
    }
}
 
export default Posts;