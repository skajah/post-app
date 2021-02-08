import React, { Component } from 'react'

class SelectInput extends Component {

    render() { 
        const { name, label, error, options, ...rest} = this.props;
        // console.log(options);

        return ( 
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select 
                className="form-control" 
                {...rest} 
                id={name}
                name={name}>
                    <option default="default"></option>
                    {
                        options.map(o => 
                        <option key={o._id} value={o._id}>{o.name}</option>)
                    }
                </select>
                { error && <div className="alert alert-danger">{ error }</div> }

            </div>
         );
    }
}
 
export default SelectInput;