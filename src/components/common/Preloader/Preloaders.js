import React from "react" 

export const Preloader = ({alignCenter = false, height = '80vh'}) => (
    <div style={alignCenter ? {'display':'flex','justifyContent':'center','height':`${height}`,'alignItems':'center'} : {'display':'flex','justifyContent':'center'}}>
        <div style={{'width':'40px','height':'40px'}} className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
)