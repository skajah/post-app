import React from 'react';

const DrowdownList = (props) => {
    const { options, onSelect, ...rest } = props;
    return ( 
        <select {...rest}>
            <option value=""></option>
            {
                options.map(option => {
                    return <option 
                    key={option}
                    value={option} 
                    onClick={() => onSelect(option)}>{ option }</option>
                })
            }
        </select>
     );
}
 
export default DrowdownList;