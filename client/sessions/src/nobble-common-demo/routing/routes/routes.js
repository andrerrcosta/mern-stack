import { Redirect, Route } from "react-router"

/**
 * Ternary operator route
 * @param {*} param0 
 * @returns 
 */
export const SwitcherRoute = ({ switch: value, pathA, pathB, ...params }) => {
    return (
        <Route {...params}
            render={
                () => value ? (<Redirect to={{ pathname: pathA }} />) : (<Redirect to={{ pathname: pathB }} />)
            }
        />
    )
}

/**
 * Redirect on true
 * @param {*} param0 
 * @returns 
 */
export const RedirectableRoute = ({ component: Component, redirectTo, on, ...params }) => {
    return (    
        <Route {...params}
            render={
                props => on ? (<Redirect to={{ pathname: String(redirectTo) }} />) : (<Component {...props} />)
            }
        />
    )
}
