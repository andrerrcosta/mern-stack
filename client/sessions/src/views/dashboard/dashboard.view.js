import StorageComponent from "../../interfaces/storage-component";
import NobbleLogChart from "../../nobble-common-demo/components/logchart/logchart";
import System from "../../services/system";
import NobbleDropdown from "../../nobble-common-demo/components/dropdown/dropdown";
import "./dashboard.view.css";
import NobbleBImg from "../../nobble-common-demo/components/b-img/b-img";
import NobbleIconTitle from "../../nobble-common-demo/components/icon-title/icon-title";

export default class Dashboard extends StorageComponent {

    constructor(props) {
        super(props);
        this.state = {
            hostData: []
        }
    }

    componentDidMount() {
        System.webSocket("log-test",
            data => {
                this.addHostData(data)
            },
            err => console.log(err),
            () => console.log('complete'));
    }

    addHostData(hostData) {
        let newData = this.state.hostData;
        newData.push(hostData);
        this.setState({ hostData: newData });
    }

    render() {
        return (
            <div className="dashboard-container">
                <div className="dashboard-menu">
                    <div className="dashboard-title">
                        <b>nobble</b>crafts
                        <div>demo</div>
                    </div>
                    <div className="dashboard-session-tools">
                        <div style={{marginRight: "10px"}}>Hello, Default</div>
                        <NobbleDropdown bound="right">
                            <NobbleBImg source="assets/users/001.jpg" width="50" height="50" radius="50%" />
                            <div className="dropdown-box">
                                <div className="dropdown-item">
                                    <NobbleIconTitle title="Account">
                                        <span className="material-icons">account_circle</span>
                                    </NobbleIconTitle>
                                </div>
                            </div>
                        </NobbleDropdown>
                    </div>
                </div>
                <div className="dashboard-content">

                    <div className="dashboard-main-tools">

                    </div>

                    <NobbleLogChart data={this.state.hostData}
                        // style={{ height: "450px" }}
                        live={true}
                    />
                    {/* I think really hard to believe that companies prefer to use
                    React instead Angular. And i think even harder to believe
                    in composition over inheritance. That really does not make any
                    sense to me. The only advantages i can see about this approach
                    is that this "functional programming" (because it is only functional
                    in the sense you are dealing with functions in a declarative style)
                    will make you think less and repeat functionalities throught functions
                    (composition). Javascript frameworks are non-blocking concurrent anyway.
                    These are the main reasons why react programmers need something like
                    reducer. Just to pretend to be writing code the same way
                    they speak. Because even in a million of years of poor and complex
                    jquery callback hells I would sugest to anybody to use some crap like reducer.
                    They are just hiding from the programmer what is happening under
                    the hood. Just events, events, events, all about the observable pattern.
                    Lets face it. Reducer is just a disguised way to make you application
                    reducer dependent. If you use reducer outside your component you will
                    need to expect your component only works with a reducer orquestration.
                    What makes reducer the most important part of you application. With RxJs
                    you can manage the states of your component by inner logic and delivery
                    independent trades. Reducer is just a spoon for the kids not hurt their
                    mouths with a fork.

                    Of course. You may argue you still can do whatever you want with react because
                    react is just javascript. But poor anyway. Think with me: If React says: If you need
                    something that is more than what the life cycle of a react component provides,
                    you can write it yourself and not couple your classes and functions.
                    I could say: Well, I can manage my life cycle components myself as well.
                    so why do i need you anyway? */}
                </div>
            </div>
        );
    }
}