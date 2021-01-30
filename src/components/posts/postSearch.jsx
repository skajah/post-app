import React, { Component } from 'react'
import PostSearchKeyword from './postSearchKeyword';
import PostSearchDate from './postSearchDate';


class PostSearch extends Component {

    render() { 
        const { 
            searchByKeyword, 
            dates, 
            selectedDate, 
            onDateSelected } = this.props;

        return ( 
            <div className="post-search-box">
                <PostSearchKeyword searchByKeyword={searchByKeyword}/>
                <PostSearchDate 
                dates={dates} 
                selectedDate={selectedDate}
                onDateSelected={onDateSelected}/>
            </div>
            
         );
    }
}
 
export default PostSearch;