import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs';
import TextBox from './TextBox';

class SearchKeyword extends Component {

    text = ''

    handleSearchTextChange = text => {
        this.text = text;
    }

    handleKeywordSearch = () => {
        this.props.onKeywordSearch(this.text);
    }
    
    render() { 
        const { placeHolder } = this.props;

        return ( 
            <div className="input-group">
                <TextBox 
                name="searchKeyword" 
                placeHolder={placeHolder} 
                className="text-box"
                type="input"
                onTextChange={this.handleSearchTextChange}
                />
                <span className="icon clickable" onClick={() => this.handleKeywordSearch()}>
                    <BsSearch />
                </span>
                 
            </div>
         );
    }
}
 
export default SearchKeyword;