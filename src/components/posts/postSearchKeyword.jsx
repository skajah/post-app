import React, { Component } from 'react'
import TextBox from '../common/textBox';
import Search from '../common/icons/search';

class PostSearchKeyword extends Component {

    handleSearchTextChange = text => {
        this.props.searchByKeyword(text);
    }
    
    render() { 
        return ( 
            <div className="post-search-keyword">
                <TextBox 
                name="postSearchKeyword" 
                placeHolder=" Search posts by user" 
                className="post-search-keyword-text-box"
                type="input"
                onTextChange={this.handleSearchTextChange}
                />
    
                <Search disabled={true} size="lg"/> 
            </div>
         );
    }
}
 
export default PostSearchKeyword;