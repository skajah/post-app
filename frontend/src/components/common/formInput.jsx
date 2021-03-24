import React, { Component } from 'react';
import { makeAlert } from '../../utils/alert';

class FormInput extends Component {
    
    render() {
        const { name, label, onChange, alert,  inputType, ...rest} = this.props;
        // console.log('Default value: ', rest);
        return ( 
            <div className="form-group">
                <label htmlFor={name}>{ label }</label>
                {
                    inputType === 'textarea' ?
                    <textarea
                    {...rest}
                    id={name}
                    className="form-control text-box"
                    name={name}
                    onChange={(e) => onChange(e)}/> :
                    <input 
                    {...rest}
                    id={name}
                    className="form-control text-box"
                    name={name}
                    onChange={(e) => onChange(e)}/>
                }
                {
                    alert && makeAlert(alert.type, alert.message)
                }
                
            </div>
         );
    }
    
}
 
export default FormInput;