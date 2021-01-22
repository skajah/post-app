import React, { Component } from 'react'
import Comment from './comment';

class Comments extends Component {

    render() { 
        const { comments, onDelete } = this.props;
        // console.log(comments);
        return ( 
            <div className="comments">
                {
                    comments.map(comment => {
                        return <Comment 
                        key={comment._id}
                        comment={comment}
                        onDelete={() => onDelete(comment)}/>
                    })
                }
            </div>
         );
    }
}
 
export default Comments;