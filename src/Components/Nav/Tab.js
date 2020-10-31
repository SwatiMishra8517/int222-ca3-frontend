import React from 'react'
import "./Tab.css"

function Tab(props) {
    const Icon = props.icon
    return (
        <div className="navigation__tab" {...props}>
            <Icon style={{color:"white",fontSize:props.size}} />
            <div style={{color:"white",paddingTop:"10px"}}>{props.label}</div>
        </div>
    )
}

export default Tab
