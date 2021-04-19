import React from 'react'
import ProfilePic from './ProfilePic';


export default function ContentDetails({
    profilePicSrc,
    onProfileClick,
    username,
    date
}) {
    return (
        <div className="content-details">
            <ProfilePic src={profilePicSrc} onClick={ () => onProfileClick() }/>
            <span className="inline-block user-date">
                <span className="username">{ username }</span> <br/>
                <span className="date">{ date.toDateString() }</span>
            </span>
        </div>
    )
}