import React, { Component } from 'react'
import Comment from './comment';

class Comments extends Component {

    render() { 
        const { comments, onDelete, onProfile } = this.props;
        // console.log(comments);
        return ( 
            <div className="comments">
                {
                    comments.map(comment => {
                        return <Comment 
                        key={comment._id}
                        comment={comment}
                        onDelete={() => onDelete(comment)}
                        onProfile={onProfile}/>
                    })
                }
            </div>
         );
    }
}
 
export default Comments;