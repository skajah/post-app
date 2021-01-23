import React, { Component } from 'react'
import Joi from 'joi-browser';
import Input from './input';
import SelectInput from './selectInput';

class Form extends Component {
    state = { 
        data: {},
        errors: {}
     }

     renderButton = label => {
        return (
        <button 
        type="submit" 
        className="btn btn-primary"
        disabled={this.validate()}>{label}</button>
        );
    
     }

     renderInput = (name, label, type='text') => {
        const { data, errors } = this.state;
        // console.log(options)

        return <Input 
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}/>;
     }

     renderSelectInput = (name, label, options) => {
         const { data, errors } = this.state;

         return <SelectInput 
         name={name}
         value={data[name]}
         label={label}
         options={options}
         onChange={this.handleChange}
         error={errors[name]}/>;
     }

     validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);

        if (!error)
            return null;

        const errors = {};

        for (let item of error.details){
            errors[item.path[0]] = item.message;
        }

        // console.log(errors);

        return errors;
    }

    handleSubmit = e => {
        e.preventDefault(); // to prevent reloading

        const errors = this.validate();

        this.setState({ errors: errors || {} });

        if (errors) return; // don't want to call server

        this.doSubmit();
    }

    doSubmit = () => {
        // console.log('doSubmit() in base class called');
    }

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value} ;
        const schema = { [name]: this.schema[name]};
        const { error } = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
        
    }

    handleChange = ({ currentTarget: input }) => { // e.currentTarget
        const errors = {...this.state.errors};

        const errorMessage = this.validateProperty(input);

        if (errorMessage)
            errors[input.name] = errorMessage;
        else
            delete errors[input.name];

        const data = {...this.state.data}; 
        data[input.name] = input.value;

        // console.log(errors);
        this.setState({ data, errors });
    }

}
 
export default Form;