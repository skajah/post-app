export default function ProfilePic({
    src,
    onClick
}) {
    const url = "https://images.unsplash.com/photo-1580250642511-1660fe42ad58?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1525&q=80";

    return (
        <img 
        src={src || url} 
        alt="Profile Pic" 
        className="profile-pic clickable" 
        onClick={ () => onClick() }
        style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '100%',
            marginRight: '10px'
        }}/>
    );
}
