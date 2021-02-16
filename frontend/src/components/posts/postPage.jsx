import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getPost } from '../../services/postService';
import Post from './post';
import { getComments } from '../../services/commentService';
import { makeDate, makeDates } from '../../utils/makeDate';

class PostPage extends Component {
    
    state = {
        post: null,
        comments: null,
        validId: true,
    }

    async componentDidMount(){
        await this.setPost();
    }

    async setPost() {
        try {
            const { id: postId } = this.props.match.params;
            const { data: post } = await getPost(postId);
            if (!post) return this.setState({ validId: false }); 
            const { data: comments } = await getComments(postId);
            makeDates(comments);
            post.comments = comments;
            makeDate(post);
            this.setState({ post, comments });
        } catch (ex) { 
            if (ex.response && ex.response.status === 404)
                this.props.history.replace('/not-found'); // don't want to be able to go back to invalid post
        } 
    }

    render() { 
        const { post, comments, validId } = this.state;

        if (!validId) return <Redirect to="/not-found" />;

        if (!(post && comments)) return null;

        return (
            <div className="post-page">
               <Post 
                post={post}
                comments={comments}
                showComments={true}/>
            </div>
        );
    }
}
 
export default PostPage;