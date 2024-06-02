import React from "react";

export const Row = ({children, className=""}) => {
    return <div className={`d-flex flex-row mb-3 gap-3 ${className}`}>{children}</div>
}
