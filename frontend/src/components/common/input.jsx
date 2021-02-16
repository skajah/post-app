import React, { Component } from 'react'

class Input extends Component {

    render() {
        const { name, label, error, ...rest} = this.props;
        // no htmlFor because don't want auto focus
        return ( 
            <div htmlFor={name} className="form-group">
                <label>{ label }</label>
                <input 
                {...rest}
                id={name}
                className="form-control text-box"
                name={name}/>
                
                { error && <div className="alert alert-danger">{ error }</div> }
                
            </div>
         );
    }
    
}
 
export default Input;