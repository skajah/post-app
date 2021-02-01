import React, { Component } from 'react'
import SearchKeyword from '../common/searchKeyword';
import SearchRelativeDate from '../common/searchRelativeDate';
import SearchDateRange from '../common/searchDateRange';

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
            onDateSelected } = this.props;

        const { dateRangeError } = this.state;
        const alert = { type: 'danger', message: "Start date can't be after end date "};

        return ( 
            <div className="post-search-box">
                <SearchKeyword 
                placeHolder=" Search posts by user"
                searchByKeyword={searchByKeyword}/>

                <SearchRelativeDate 
                dates={dates} 
                selectedDate={selectedDate}
                onDateSelected={onDateSelected}/>

                <SearchDateRange 
                onDateRange={this.handleDateRange}
                alert={dateRangeError && alert}/>
            </div>
         );
    }
}
 
export default PostSearch;