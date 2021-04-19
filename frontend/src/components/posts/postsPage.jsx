import React, { Component } from 'react';
import { toast } from 'react-toastify';

import Posts from './Posts';
import PostSearch from './PostSearch';
import CreatePostBox from './CreatePostBox';

import { getPosts, deletePost, createPost } from '../../services/postService';

import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';
import { makeDate } from '../../utils/makeDate';

import UserContext from '../../context/userContext';
import { readMedia, compress, decompress } from '../../utils/media';

import './PostsPage.css';

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

    componentDidMount() {
        // console.log('postsPage componentDidMount()');
        window.addEventListener('resize', this.resize);
        this.resize();
        this.populatePosts();
    }

    resize = () => {
        const mobile = window.innerWidth < 760;
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

    handleDelete = async ({ _id }) => {
        const originalPosts = this.state.posts;
        const posts = originalPosts.filter(post => post._id !== _id);
        this.setState({ posts });
        try {
            await deletePost(_id);
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
            this.setState({ posts: originalPosts });
        }
    }

    handleCreatePost = async (text, media) => {
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
            console.log(ex.response);
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

    handlePostClick = ({ _id }) => {
        this.props.history.push(`/posts/${_id}`);
    }
    handleProfileClick = id => {
        this.props.history.push(`/profile/${id}`);
    }

    handleShowSearch = () => {
        this.setState({ showSearch: !this.state.showSearch });
    }

    render() {  
        // console.log('postsPage render()');
        const { relativeDateFilter, posts, emptyPost, mobile, showSearch } = this.state;
        const alert = { type: 'warning', message: "Post can't be empty"};

        if (!posts) 
            return (
                <p style={{ textAlign: 'center' }}>Loading posts...</p>
            );
        return (
            <div className="posts-page">
                <div className={'post-search-container ' + (mobile && !showSearch ? "hide" : '' )}>
                    {
                        mobile &&
                        <div className={"btn-post-search"}>
                            <span onClick={this.handleShowSearch} className="clickable">
                                Show results
                            </span>
                        </div>
                    }
                    
                    <PostSearch 
                    searchByKeyword={this.handleSearchByKeyword}
                    onPostType={this.handlePostType}
                    dates={this.relativeDates}
                    selectedDate={relativeDateFilter}
                    onDateSelected={this.handleDateSelected}
                    onDateRange={this.handleDateRange}/>
                </div>
                <div className={'posts-container ' + (mobile && showSearch ? "hide" : '' )}>
                    {
                        mobile &&
                        <div className={"btn-post-search"}>
                            <span onClick={this.handleShowSearch} className="clickable">
                                Filter posts
                            </span>
                        </div>
                    }
                    <CreatePostBox 
                    onCreate={this.handleCreatePost}
                    alert={emptyPost && alert}/>

                    <Posts 
                    posts={this.getCurrentPosts()}
                    onDelete={this.handleDelete}
                    onCreatePost={this.handleCreatePost}
                    onPostClick={this.handlePostClick}
                    onProfile={this.handleProfileClick}/>
                </div>
            </div>
        );
  
    }
}
 
export default PostsPage;