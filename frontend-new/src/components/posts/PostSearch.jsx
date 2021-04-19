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
            searchByUsername, 
            dates, 
            selectedDate, 
            onDateSelected,
            onPostType } = this.props;

        const { dateRangeError } = this.state;
        const alert = { type: 'primary', message: "End date can't be before start date"};

        return ( 
            <div className="post-search">
                <p style={{ fontSize: '2rem', margin: '0 0 1rem'}}>Filter posts</p>
                <SearchKeyword 
                placeholder=" Enter a username"
                onKeywordSearch={searchByUsername}/>

                <p>Pick a Type</p>

                <DropdownList 
                options={['All', 'Liked Posts', 'Following']}
                onSelect={onPostType}/>

                <p>Pick a Date</p>

                <ListGroup
                items={dates} 
                selectedItem={selectedDate}
                onClick={onDateSelected}/>

                <SearchDateRange 
                onDateRange={this.handleDateRange}
                alert={dateRangeError && alert}/>
            </div>
         );
    }
}
 
export default PostSearch;