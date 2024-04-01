import React from 'react'

const ToolTip = ({ text, children }) => {
    return (
        <div className="relative group">
            {children}
            <div className="group-hover:opacity-90 absolute z-20 px-2 py-1 bg-gray-800 text-white text-sm rounded-md bottom-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300">
                <div className="w-2 h-2 bg-gray-800 absolute mt-5 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                {text}
            </div>
        </div>
    )
}

export default ToolTip;