import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts from './posts';
import PostSearch from './postSearch';
import CreatePostBox from './createPostBox';

import { getPosts, deletePost, createPost } from '../../services/postService';

import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';
import { makeDate, makeDates } from '../../utils/makeDate';

import UserContext from '../../context/userContext';
import { readMedia, compress, decompress } from '../../utils/media';

class PostsPage extends Component {
    static contextType = UserContext;

    state = {
        posts: null,
        keywordFilter: null,
        relativeDateFilter: null,
        dateRangeFilter: null,
        emptyPost: false,
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    componentDidMount() {
        // console.log('postsPage componentDidMount()');
        this.populatePosts();
    }

    populatePosts = async () => {
        try {
            const { data: posts } = await getPosts();
            makeDates(posts);
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
            compressedData = compress(mediaData);
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

            const posts = [...this.state.posts];
            posts.unshift(post);
            this.setState({ posts, emptyPost: false });
        } catch (ex) {
            // REVISIT
            console.log(ex.response);
        }
    }

    handleSearchByKeyword = text => { 
        const trimmed = text.trim().toLowerCase();
        if (!trimmed) return;
        this.setState({ keywordFilter: trimmed, 
                        relativeDateFilter: null, 
                        dateRangeFilter: null 
                    });
    }

    handleDateSelected = date => {
        this.setState({ keywordFilter: null, 
                        relativeDateFilter: date, 
                        dateRangeFilter: null 
                    });
    }

    handleDateRange = (start, end) => {
        this.setState({ keywordFilter: null,
                        relativeDateFilter: null,
                        dateRangeFilter: [start, end] 
                    });
    }

    getCurrentPosts = () => {
        const { 
            keywordFilter, 
            relativeDateFilter, 
            dateRangeFilter, 
            posts } = this.state;

        if (keywordFilter) 
            return posts.filter(p => p.user.username.toLowerCase().includes(keywordFilter));
        
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

    render() {  
        // console.log('postsPage render()');
        const { relativeDateFilter, posts, emptyPost } = this.state;
        const alert = { type: 'warning', message: "Post can't be empty"};

        if (!posts) return <p className="center">Loading posts...</p>;

        return (
            <div className="posts-page">
                <div className="posts-with-create">
                    <CreatePostBox 
                    onCreate={this.handleCreatePost}
                    alert={emptyPost && alert}/>
                    <Posts 
                        posts={this.getCurrentPosts()}
                        onDelete={this.handleDelete}
                        onCreatePost={this.handleCreatePost}
                        onPostClick={this.handlePostClick}/>
                </div>
                <PostSearch 
                    searchByKeyword={this.handleSearchByKeyword}
                    dates={this.relativeDates}
                    selectedDate={relativeDateFilter}
                    onDateSelected={this.handleDateSelected}
                    onDateRange={this.handleDateRange}/>
            </div>
        );
  
    }
}
 
export default PostsPage;