import React, { Component } from 'react';
import _ from 'lodash';
import Posts from './posts';
import PostSearch from './postSearch';
import { getPosts } from '../../services/fakePostService';
import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';

class PostPage extends Component {
    state = {
        posts: [],
        keywordFilter: null,
        relativeDateFilter: null,
        dateRangeFilter: null
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    componentDidMount() {
        this.setState({ posts: getPosts()});
    }

    handleDelete = ({ _id }) => {
        const posts = this.state.posts.filter(post => post._id !== _id);
        this.setState({ posts });
    }

    handleCreatePost = (postText, media) => {
        const post = {
            _id: this.getNextId(),
            username: 'Anonymous',
            date : new Date(),
            likes: 0,
            text: postText,
            media,
            comments: []
        };

        const posts = [...this.state.posts];
        posts.unshift(post);
        this.setState({ posts });
    }

    getNextId(){
        const { posts } = this.state;
        return (_.max(posts.map(p => p._id)) + 1) || 0;
    }

    handleSearchByKeyword = text => { 
        const trimmed = text.trim().toLowerCase();
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
            return posts.filter(p => p.username.toLowerCase().includes(keywordFilter));
        
        if (relativeDateFilter)
            return filterByRelativeDate(posts, relativeDateFilter);
        
        if (dateRangeFilter){
            const [start, end] = this.state.dateRangeFilter;
            return filterByDateRange(posts, start, end);
        }

            
        return posts;
    }

    render() {  
        const { relativeDateFilter } = this.state;

        return ( 
            <div className="post-page">
                <Posts 
                    posts={this.getCurrentPosts()}
                    onDelete={this.handleDelete}
                    onCreatePost={this.handleCreatePost}/>
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
 
export default PostPage;