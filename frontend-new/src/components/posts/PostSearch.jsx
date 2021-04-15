import React, { Component } from 'react'
import SearchKeyword from '../common/SearchKeyword';
import SearchDateRange from '../common/SearchDateRange';
import DropdownList from '../common/DropdownList';
import ListGroup from '../common/ListGroup';

class PostSearch extends Component {

    state = {
        dateRangeError: false
    }

    handleDateRange = (start, end) => {
        if (start > end)
            this.setState({ dateRangeError: true });
        else{
            this.props.onDateRange(start, end);
            this.setState({ dateRangeError: false });
        }
    }

    render() { 
        const { 
            searchByKeyword, 
            dates, 
            selectedDate, 
            onDateSelected,
            onPostType } = this.props;

        const { dateRangeError } = this.state;
        const alert = { type: 'primary', message: "Start date can't be after end date "};

        return ( 
            <div className="post-search">
                <p style={{ fontSize: '2rem', margin: '0 0 1rem'}}>Filter posts</p>
                <SearchKeyword 
                placeHolder=" Enter a username"
                onKeywordSearch={searchByKeyword}/>

                <p>Pick a Type</p>

                <DropdownList 
                options={['All', 'My Posts', 'Liked Posts', 'Following']}
                onSelect={onPostType}/>

                <p>Pick a Date</p>

                <ListGroup
                items={dates} 
                selectedItem={selectedDate}
                onClick={onDateSelected}/>

                <SearchDateRange 
                onDateRange={this.handleDateRange}
                alert={dateRangeError && alert}/>
                <br />
                <span>Note: The most recent filter will be used</span>
            </div>
         );
    }
}
 
export default PostSearch;