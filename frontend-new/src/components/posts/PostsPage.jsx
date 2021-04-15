import React, { Component } from 'react';
import { toast } from 'react-toastify';

import PostSearch from './PostSearch';
import CreatePostBox from './CreatePostBox';

import { getPosts, deletePost, createPost } from '../../services/postService';

import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';
import { makeDate } from '../../utils/makeDate';

import UserContext from '../../context/UserContext';
import { readMedia, compress, decompress } from '../../utils/media';
import './PostsPage.css';
import Posts from './Posts';

class PostsPage extends Component {
    static contextType = UserContext;

    state = {
        posts: null,
        keywordFilter: null,
        postTypeFilter: null,
        relativeDateFilter: null,
        dateRangeFilter: null,
        emptyPost: false,
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']
    firstRender = true

    componentDidMount() {
        // console.log('postsPage componentDidMount()');
        window.addEventListener('resize', this.resize);
        this.resize();
        this.populatePosts();
    }

    resize = () => {
        const mobile = window.innerWidth < 1000;
        if (this.state.mobile !== mobile) 
            this.setState({ mobile });
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize);
    }

    populatePosts = async () => {
        try {
            const { data: posts } = await getPosts();
            for (const post of posts) {
                makeDate(post);
                if (post.media)
                    post.media.data = await decompress(post.media.data);
                if (post.user.profilePic)
                    post.user.profilePic = await decompress(post.user.profilePic);
            }
            this.setState({ posts });
        } catch (ex) {
            // Axios will catch any unexpected erros
        }
    }

    handleDelete = async id => {
        try {
            await deletePost(id);
            const posts = this.state.posts.filter(post => post._id !== id);
            this.setState({ posts });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
        }
    }

    handleCreate = async (text, media) => {
        if ( !(text.trim() || media) ) {
            if (!this.state.emptyPost)
                this.setState({ emptyPost: true }); // avoid rerender of posts
            return;
        }

        const { currentUser } = this.context;
        const newPost = {
            userId: currentUser._id,
            text
        };

        let mediaData;
        let compressedData;

        if (media){
            mediaData =  await readMedia(media.src);
            compressedData = await compress(mediaData);
            newPost.media = { 
                mediaType: media.type, 
                data: compressedData
            };
        }

        try {
            const { data: post } = await createPost(newPost);
            makeDate(post);

            if (media)
                post.media.data = mediaData;
            post.user.profilePic = currentUser.profilePic;
            const posts = [...this.state.posts];
            posts.unshift(post);
            this.setState({ 
                posts, 
                emptyPost: false
                });
        } catch (ex) {
            // REVISIT
            if (ex.response && ex.response.status === 400)
                toast.error('Something went wrong creating post');
        }
    }

    handleSearchByKeyword = text => { 
        const trimmed = text.trim().toLowerCase();
        if (!trimmed) return;
        this.setState({ keywordFilter: trimmed, 
                        postTypeFilter: null,
                        relativeDateFilter: null, 
                        dateRangeFilter: null,
                        showSearch: false 
                    });
    }

    handlePostType = type => {
        this.setState({ keywordFilter: null, 
            postTypeFilter: type,
            relativeDateFilter: null, 
            dateRangeFilter: null,
        });
    }

    handleDateSelected = date => {
        this.setState({ keywordFilter: null, 
                        postTypeFilter: null,
                        relativeDateFilter: date, 
                        dateRangeFilter: null, 
                    });
    }

    handleDateRange = (start, end) => {
        this.setState({ keywordFilter: null,
                        postTypeFilter: null,
                        relativeDateFilter: null,
                        dateRangeFilter: [start, end],
                    });
    }

    getCurrentPosts = () => {
        const { 
            keywordFilter, 
            postTypeFilter,
            relativeDateFilter, 
            dateRangeFilter, 
            posts } = this.state;

        if (keywordFilter) 
            return posts.filter(p => p.user.username.toLowerCase().includes(keywordFilter));
        
        if (postTypeFilter){
            if (postTypeFilter === 'All')
                return posts;
            else if (postTypeFilter === 'My Posts')
                return posts.filter(p => p.user._id === this.context.currentUser._id);
            else if (postTypeFilter === 'Liked Posts')
                return posts.filter(p => this.context.currentUser.likedPosts[p._id]);
            else if (postTypeFilter === 'Following')
                return posts.filter(p => this.context.currentUser.following[p.user._id]);
        
        }

        if (relativeDateFilter)
            return filterByRelativeDate(posts, relativeDateFilter);
        
        if (dateRangeFilter){
            const [start, end] = this.state.dateRangeFilter;
            return filterByDateRange(posts, start, end);
        }

        // console.log('Current posts: ', posts);
        return posts;
    }


    handlePostClick = id => {
        this.props.history.push(`/posts/${id}`);
    }

    handleProfileClick = id => {
        this.props.history.push(`/profile/${id}`);
    }

    handleShowSearch = () => {
        this.setState({ showSearch: !this.state.showSearch });
    }

    render() {  
        const { relativeDateFilter, posts, emptyPost, mobile, showSearch } = this.state;
        const currentPosts = this.getCurrentPosts();
        
        const alert = { type: 'secondary', message: "Post can't be empty"};

        if (!posts) 
            return (
                <p style={{ textAlign: 'center' }}>Loading posts...</p>
            );
        return (
            <div className="page posts-page">
                {
                    mobile &&
                    <div
                    style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '500px',
                    justifyContent: 'flex-end',
                    padding: '10px 20px',
                    }}>
                        <span 
                        className="clickable"
                        onClick={this.handleShowSearch}>
                        {
                            showSearch ? 'See results' : 'Filter'
                        }
                        </span>
                </div>
                }
                <div 
                className={ "post-search-container " + 
                (mobile ?
                    (showSearch ? 
                    'animate__animated animate__fadeIn' : 
                    'hide' 
                    ) :
                    ''
                )
                }>
                    <PostSearch 
                    searchByKeyword={this.handleSearchByKeyword}
                    dates={this.relativeDates} 
                    selectedDate={relativeDateFilter}
                    onDateSelected={this.handleDateSelected}
                    onDateRange={this.handleDateRange}
                    onPostType={this.handlePostType}
                    />
                </div>
                <div 
                className={
                    "posts-container " + 
                    (mobile ?
                        (!showSearch ? 
                        'animate__animated animate__fadeIn' : 
                        'hide' 
                        ) :
                        ''
                    )
                    }>
                    <CreatePostBox 
                    onCreate={this.handleCreate}
                    alert={emptyPost && alert}/>
                    {
                    !currentPosts.length ? 
                    <p style={{ textAlign: 'center' }}>No posts found</p> :
                    <Posts
                    posts={currentPosts}
                    onPostClick={this.handlePostClick}
                    onProfileClick={this.handleProfileClick}
                    onDelete={this.handleDelete}
                    />
                    }
                </div>
            </div>
        );
  
    }
}
 
export default PostsPage;