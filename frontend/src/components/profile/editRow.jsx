import React from 'react';
import withFileChooser from '../hoc/withFileChooser';

const EditRow = (props) => {
    const { label, text, icon, ...rest } = props;
    return ( 
        <div {...rest}>
            <span>{ label }</span>
            <span>{ text }</span>
            { icon }
        </div>
     );
}

const EditRowWithFile = withFileChooser(EditRow);

export {
    EditRow,
    EditRowWithFile
}

