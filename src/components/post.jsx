import React, { Component } from 'react'
import { getComments } from '../services/fakeCommentService';
import Comments from './comments';
import ContentDetails from './common/contentDetails';
import CreateCommentBox from './commentBox';
import _ from 'lodash';

class Post extends Component {
    state = { 
        username: 'Sam',
        date: new Date(),
        comments: []
    }
    componentDidMount() {
        const comments = getComments();
        this.setState({ comments });
    }

    handleDelete = ({ _id }) => {
        // console.log('Deleting: ' + _id);
        const comments  = this.state.comments.filter(c => c._id !== _id );
        this.setState({ comments });
    }

    handleCreate = text => {
        // console.log('Handling creation: ', text);
        const comments = [...this.state.comments];
        const nextId = _.max(comments.map(c => c._id)) + 1;
        const newComment = { _id: nextId, username: 'User' + nextId, date: new Date(), text};
        comments.push(newComment);
        this.setState({ comments });
    }
    

    render() { 
        const { username, date } = this.state;
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";

        return ( 
            <div className="post">
                <ContentDetails 
                details={{username, date}}
                profilePicUrl={url}/> 

                <Comments 
                comments={this.state.comments}
                onDelete={this.handleDelete}/>

                <CreateCommentBox 
                onEnter={this.handleCreate}/>
            </div>
         );
    }
}
 
export default Post;