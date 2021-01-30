import React, { Component } from 'react'
import TextBox from './common/textBox';
import Search from './common/icons/search';

class PostSearch extends Component {
    state = { 
        searchText: '',
        searchDateFrom: null,
        searchDateTo: null
     }

    handleSearchTextChange = text => {
        this.props.searchByKeyword(text);
    }
    
    render() { 
        return ( 
            <div className="post-search-box">
                <TextBox 
                name="postSearch" 
                placeHolder=" Search for posts" 
                className="post-search-text-box"
                type="input"
                onTextChange={this.handleSearchTextChange}
                />
    
                <Search disabled={true} size="lg"/> 
            </div>
            
            // Date Range
         );
    }
}
 
export default PostSearch;