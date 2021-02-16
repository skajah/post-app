import React, { Component } from 'react';
import Comment from './icons/comment';
import Delete from './icons/delete';
import Like from './icons/like';
import ProfilePic from './profilePic';

class ContentDetails extends Component {
    render() { 
        const { 
            details, 
            profilePicUrl, 
            onDelete, 
            onLike, 
            likes, 
            onClick, 
            numberComments,
            showCommentIcon} = this.props;
        // console.log(profilePicUrl, comment);
        const { username, date } = details;
        return ( 
            <div className="row content-details">
                <div 
                className={"col-9" + (onClick ? ' clickable' : '')}
                onClick={onClick}>

                    <ProfilePic src={profilePicUrl}/>
                    <div className="date-time">   
                        <span className="username">{username}</span>    
                        <span className="time">{date.toLocaleTimeString()}</span>
                        <br/>
                        <span className="date">{date.toDateString()}</span>
                    </div>
                </div>
                <div className="col-3">
                    { 
                    showCommentIcon &&
                    <Comment numberComments={numberComments} onClick={onClick}/> 
                    }
                    <Like onClick={onLike} likes={likes}/>
                    { null && <Delete onClick={onDelete}/> } 
                </div>
            </div>
         );
    }
}
 
export default ContentDetails;