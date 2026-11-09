import "./Button.css"

function Button({
    children,
    type="button",
    varient="primary",
    onClick,
    disabled=false,
    className=""
}){
    return(
        <button type={type} varient={varient} 
            onClick={onClick} disabled={disabled} 
            className={`btn btn-${varient} ${className}`}
        >
            {children}
        </button>
    )
}

export default Button