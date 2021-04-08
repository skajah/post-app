import React from 'react';
import withFileChooser from '../hoc/withFileChooser';

const EditRow = (props) => {
    const { label, text, icon, ...rest } = props;
    return ( 
        <div {...rest}>
            <span className="edit-row-label">{ label }</span>
            <span className="edit-row-text">{ text }</span>
            { icon }
        </div>
     );
}

const EditRowWithFile = withFileChooser(EditRow);

export {
    EditRow,
    EditRowWithFile
}

