import React, { Component } from 'react';
import { getPost } from '../../services/postService';
import Post from './post';
import { makeDate, makeDates } from '../../utils/makeDate';

class PostPage extends Component {
    
    state = {
        post: null,
    }

    async componentDidMount(){
        await this.setPost();
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

    render() { 
        const { post } = this.state;

        if (!post) return null;

        // console.log(post);
        
        return (
            <div className="post-page">
               <Post 
                post={post}
                comments={post.comments}
                showComments={true}/>
            </div>
        );
    }
}
 
export default PostPage;