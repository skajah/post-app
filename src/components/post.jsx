import React, { Component } from 'react'
import { getComments } from '../services/fakeCommentService';
import Comments from './comments';
import ContentDetails from './common/contentDetails';
import CreateCommentBox from './commentBox';
import _ from 'lodash';
import Media from './common/media';

class Post extends Component {
    state = { 
        username: 'Sam',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae nostrum quod accusantium temporibus accusamus aperiam aliquam dolor, odit animi vel.',
        media: {
            type: 'audio',
            src: 'https://www.computerhope.com/jargon/m/example.mp3',
            controls: true
        },
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
        const { username, date, text, media } = this.state;
        const url = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";

        return ( 
            <div className="post">
                <ContentDetails 
                details={{username, date}}
                profilePicUrl={url}/> 

                <p>{text}</p> 

                {
                    media ? 
                    <Media 
                    type={media.type}
                    src={media.src}
                    controls={media.controls}/> : 
                    null
                }



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