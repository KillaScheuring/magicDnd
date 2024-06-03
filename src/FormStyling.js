import React from "react";

export const Row = ({children, className="", style}) => {
    return <div className={`d-flex flex-row mb-3 gap-3 ${className}`} style={style}>{children}</div>
}
