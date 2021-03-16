import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Post from './post';

import { getPost, deletePost } from '../../services/postService';
import { makeDate, makeDates } from '../../utils/makeDate';
import { decompress } from '../../utils/media';

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
            makeDates(post.comments);
            makeDate(post);
            this.setState({ post });
        } catch (ex) { 
            if (ex.response && ex.response.status === 404)
                this.props.history.replace('/not-found'); // don't want to be able to go back to invalid post
        } 
    }

    handleDelete = async () => {
        try {
            await deletePost(this.state.post._id);
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

    render() { 
        const { post } = this.state;

        if (!post) return null;
        
        return (
            <div className="post-page">
               <Post 
                post={post}
                showComments={true}
                onDelete={this.handleDelete}/>
            </div>
        );
    }
}
 
export default PostPage;