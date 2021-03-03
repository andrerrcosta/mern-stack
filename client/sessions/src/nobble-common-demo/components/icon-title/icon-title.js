import "./icon-title.css"

const NobbleIconTitle = (props) => {

    return (
        <div className="nobble-icon-title-container">
            <div className="header">
                {props.children}
            </div>
            <div className="title" style={props.titleStyle}>
                {props.title}
            </div>
        </div>
    )
}

export default NobbleIconTitle;