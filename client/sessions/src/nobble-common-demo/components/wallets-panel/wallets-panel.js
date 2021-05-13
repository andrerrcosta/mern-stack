import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { sortBy } from "../../utils/array.utils";
import { Undefined } from "../../utils/optional";
import NobbleIconTitle from "../icon-title/icon-title";
import NobbleJsonPanel from "../json-panel/json-panel";
import "./wallets-panel.css";

export default class NobbleWalletsPanel extends Customizable {
    constructor(props) {
        super(props, "nobble-wallets-panel-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaults();
        // console.log('MOUNT', this.props.wallets);
    }

    setDefaults() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("wallets-panel-colorA", $.colorScheme.getColor(0))
            .addProperty("wallets-panel-colorB", $.colorScheme.getColor(1))
            .addProperty("wallets-panel-colorC", $.colorScheme.getColor(2))
            .addProperty("wallets-panel-colorD", $.colorScheme.getColor(3))
            .addProperty("wallets-panel-colorE", $.colorScheme.getColor(4))
            .addProperty("wallets-panel-colorF", $.colorScheme.getColor(5))
            .getStyle();
    }

    classifyWallet(wallet) {
        let output = this.addClass("icon");
        output += `-${wallet?.$?.observers?.length > 0 ? "consumed" : "notconsumed"}`;
        output += `-${wallet.data.isEmpty() ? "empty" : "filled"}`;
        if (wallet.state) {
            output += `${wallet?.state?.loading ? "-loading" : ""}`;
            output += `${wallet?.state?.error ? "-error" : ""}`;
            output += `${wallet?.state?.complete ? "-complete" : ""}`;
        } else {
            output += "-complete";
        }
        return output;
    }

    getWalletIcon(wallet) {
        if (wallet?.data.isEmpty() && wallet?.$?.observers?.length < 1) return <div className={this.classifyWallet(wallet)}>
            <span className="material-icons-outlined">folder</span>
        </div>;
        else if (wallet?.data?.isEmpty() && wallet?.$?.observers?.length > 0) return <div className={this.classifyWallet(wallet)}>
            <span className="material-icons">folder</span>
        </div>;
        else if (wallet?.$?.observers?.length < 1) return <div className={this.classifyWallet(wallet)}>
            <span className="material-icons-outlined">source</span>
        </div>;
        else return <div className={this.classifyWallet(wallet)}>
            <span className="material-icons">source</span>
        </div>;
    }

    walletAction(wallet) {
        this.setState({ selected: this.state.selected === wallet ? undefined : wallet })
    }

    sortWallets(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
    }


    render() {
        const p = this.props;
        const $ = this.state;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>
                    {$.selected ?
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <NobbleIconTitle title={$.selected.name}>
                                <span className={`material-icons ${this.classifyWallet($.selected)}`}>
                                    {this.getWalletIcon($.selected)}
                                </span>
                            </NobbleIconTitle>
                            <div className={this.addClass("return-button")} onClick={() => this.setState({ selected: undefined })}>
                                Return
                        </div>
                        </div> :
                        <div>
                            <b>WALLETS:</b> {p.wallets?.length}
                            <b style={{ color: Undefined($.colorScheme.getColor(5), "#03a9f4") }}>
                                LOADING:
                        </b> {p.wallets?.filter(w => w.state?.loading).length}
                            <b style={{ color: Undefined($.colorScheme.getColor(4), "rgb(255, 88, 88)") }}>
                                ERRORS:
                        </b> {p.wallets?.filter(w => w.state?.error).length}
                            <b style={{ color: Undefined($.colorScheme.getColor(3), "#27b139") }}>
                                COMPLETE:
                            </b> {p.wallets?.filter(w => w.state?.complete).length}
                        </div>
                    }
                </div>
                <div className={this.addClass("content")}>
                    {$.selected ? null : sortBy(p.wallets, "name").map((wallet, key) => {
                        return <div key={key} className={this.addClass(`${$.selected === key ? "wallet-selected" : "wallet"}`)}
                            id={this.addId(key)} onClick={() => this.walletAction(wallet)}>
                            <div className={this.addClass("wallet-icon")}>
                                <span className={`material-icons ${this.classifyWallet(wallet)}`}>
                                    {this.getWalletIcon(wallet)}
                                </span>
                                <div style={{ textAlign: "center" }}>{wallet.name}</div>
                            </div>
                        </div>
                    })}
                    {$.selected ? <div className={this.addClass("wallet-details")}>
                        <div className={this.addClass("wallet-details-item")}>
                            <div className={this.addClass("wallet-details-param")}>Data</div>
                            <NobbleJsonPanel data={$.selected.data?.object} />
                        </div>
                        <div className={this.addClass("wallet-details-item")}>
                            <div className={this.addClass("wallet-details-param")}>Handler</div>
                            <NobbleJsonPanel data={$.selected.handler} />
                        </div>
                        <div className={this.addClass("wallet-details-item")}>
                            <div className={this.addClass("wallet-details-param")}>State</div>
                            <NobbleJsonPanel data={$.selected.state} />
                        </div>
                        <div className={this.addClass("wallet-details-item")}>
                            <div className={this.addClass("wallet-details-param")}>Observers</div>
                            <NobbleJsonPanel data={$.selected.$?.observers?.length} />
                        </div>
                    </div> : null}
                </div>
            </div>
        );
    }
}