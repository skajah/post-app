import React, { Component } from 'react'
import TextBox from './textBox';
import Search from './icons/search';

class SearchKeyword extends Component {

    handleSearchTextChange = text => {
        this.props.searchByKeyword(text);
    }
    
    render() { 
        const { placeHolder } = this.props;

        return ( 
            <div className="search-keyword">
                <Search disabled={true} size="lg"/> 

                <TextBox 
                name="searchKeyword" 
                placeHolder={placeHolder} 
                className="text-box search-keyword-text-box"
                type="input"
                onTextChange={this.handleSearchTextChange}
                />
            </div>
         );
    }
}
 
export default SearchKeyword;