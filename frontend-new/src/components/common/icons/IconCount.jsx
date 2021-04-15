import React from 'react'

export default function IconCount({
    children,
    count,
    onClick,
    margins
}) {
    return (
        <span 
        className="icon-count"
        style={{ 
            display: 'flex', 
            margin: margins ? '0 15px' : 0
            }}>
            <span 
            className={`icon${onClick ? ' clickable' : ''}`}
            onClick={onClick}>{ children }</span>
            
            <span style={{ marginLeft: '5px' }}>{ count || null } </span>
        </span>
    )
}
