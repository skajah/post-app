import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Post from './Post';

import { getPost, deletePost } from '../../services/postService';
import { makeDate } from '../../utils/makeDate';
import { decompress } from '../../utils/media';
import './PostsPage.css';

class PostPage extends Component {
    
    state = {
        post: null,
    }

    componentDidMount(){
        // console.log('postPage componentDidMount()');
        this.setPost();
    }

    async setPost() {
        try {
            const { id: postId } = this.props.match.params;
            const { data: post } = await getPost(postId,{ withComments: true });
            makeDate(post);

            if (post.user.profilePic)
                post.user.profilePic = await decompress(post.user.profilePic);
            
            if (post.media)
                post.media.data = await decompress(post.media.data);

            const { comments } = post;
            for (const comment of comments) {
                makeDate(comment);
                if (comment.user.profilePic)
                    comment.user.profilePic = await decompress(comment.user.profilePic);
            }
            this.setState({ post });
        } catch (ex) { 
            if (ex.response && ex.response.status === 404)
                this.props.history.replace('/not-found'); // don't want to be able to go back to invalid post
        } 
    }

    handleDelete = async (id) => {
        try {
            await deletePost(id);
            this.props.history.replace('/');
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Try refresshing");
            }
        }
    }

    handleProfileClick = id => {
        this.props.history.push(`/profile/${id}`);
    }

    render() { 
        const { post } = this.state;

        if (!post) return null;
        
        return (
            <div className="page post-page">
                <div className="posts">
                    <Post 
                    post={post}
                    showComments={true}
                    onProfileClick={this.handleProfileClick}
                    onDelete={this.handleDelete}/>
                </div>
            </div>
        );
    }
}
 
export default PostPage;