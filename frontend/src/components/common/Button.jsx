import React from 'react';
import './Button.css';

const STYLES = ['btn--outline', 'btn--rounded']

const SIZES = ['btn--xsmall', 'btn--small', 'btn--medium', 'btn--wide']

const COLORS = ['primary', 'gold', 'whitesmoke']

function Button({
    children,
    style,
    size,
    color,
    onClick
}) {
    return (
        <button 
        className={`btn ${getStyle(style)} ${getSize(size)} ${getColor(color)}`}
        onClick={onClick}>
            {children}
        </button>
    );
}

const getStyle = style => { return STYLES.includes(style) ? style : ''; }
const getSize = size => { return SIZES.includes(size) ? size : SIZES[1]; }
const getColor = color => { 
    return `btn--${COLORS.includes(color) ? color : ''}`; 
}

export default Button;

