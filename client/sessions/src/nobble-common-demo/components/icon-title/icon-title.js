import "./icon-title.css";

const NobbleIconTitle = (props) => {
    


    return (
        <div className="nobble-icon-title-container" style={props.style}>
            <div className="nobble-icon-title-icon">
                {props.children}
            </div>
            <div className="nobble-icon-title-content">
                <div className="title" style={props.titleStyle}>
                    {props.title}
                </div>
                <div className="description" style={props.descriptionStyle}>
                    {props.description}
                </div>
            </div>
        </div>
    )
}

export default NobbleIconTitle;