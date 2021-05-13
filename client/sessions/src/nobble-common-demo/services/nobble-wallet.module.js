import { Subject, Subscription } from "rxjs";
import { Undefined } from "../../nobble-common-demo/utils/optional";
import ObjectMapper from "../models/object-mapper";
import QueryState from "../models/query-state";
import updatable from "../models/updatable";
import { emptyOrUndefinedArray } from "../utils/array.utils";
import Assert from "../utils/assertions";
import { isValid } from "../utils/optional";

export function createWallet(name) {

    const $multi = [];

    const Wallets = [{
        name: name,
        $: new Subject(),
        handler: { method: undefined, params: undefined },
        state: QueryState.complete(),
        data: updatable()
    }];

    function find(name) {
        return Wallets.find(wallet => wallet.name === name);
    }

    function findWithOption(name, autoCreate) {
        let wallet = Wallets.find(wallet => wallet.name === name);
        if (!wallet) {
            if (autoCreate) return create(name);
            else {
                let err = new Error(`The wallet "${name}" does not exist.\nThe auto-create is disabled`);
                // let stackTrace = err.stack;
                // let stack = stackTrace.split('\n').filter(function (line, index) { return index !== 1 }).join('\n');
                // console.log(stack);
                throw err;
            }
        }
        return wallet;
    }

    function findWallets(...wallets) {
        return Wallets.filter(wallet => wallets.includes(wallet.name));
    }

    function callHandler(wallet) {
        if (wallet.handler) {
            if (isValid(...wallet.handler.params))
                wallet.handler.method(...wallet.handler.params);
            else
                wallet.handler.method();
        }
    }

    function next(wallet) {
        wallet.$.next({ data: wallet.data.object, state: wallet.state });
        if (!emptyOrUndefinedArray($multi)) multicast(wallet);
    }


    /**
     *
     * @param {*} wallet 
     */
    function multicast(wallet) {

        let whole = $multi.filter(m => m.tag === "wallet");
        let multiSingle = $multi.filter(m => m.tag === "multi-single");
        let multi = $multi.filter(m => m.tag === "multi");

        //This is a wallet subscription. Possibly this should be composed by data and state. not sure...
        if (!emptyOrUndefinedArray(whole)) whole.forEach(m => m.$.next(Wallets.filter(w => !m.select.includes(w.name))));

        //This is a multicast data subscription
        if (!emptyOrUndefinedArray(multiSingle)) multiSingle.forEach(m => {
            if (m.select.includes(wallet.name)) m.$.next({ data: wallet.data.object, state: wallet.state })
        });

        //This is a multicast data subscription
        if (!emptyOrUndefinedArray(multi)) multi.forEach(m => {
            if (m.select.includes(wallet.name)) {
                let wallets = findWallets(...m.select);
                m.$.next(ObjectMapper.builder()
                    .create(wallets.map(w => w.name), wallets.map(w => {
                        return { data: w.data.object, state: w.state }
                    })).object
                )
            }
        });
    }

    function nextIfNotEmpty(wallet) {
        if (!wallet.data.isEmpty()) wallet.$.next({ data: wallet.data.object, state: wallet.state });
    }

    function create(name, handler, ...params) {
        let wallet = {};
        Object.defineProperties(wallet, {
            name: {
                writable: false,
                enumerable: false,
                value: name
            },
            handler: {
                writable: true,
                enumerable: false,
                value: {
                    method: handler,
                    params: params
                }
            },
            $: {
                enumerable: false,
                writable: false,
                value: new Subject()
            },
            state: {
                writable: true,
                enumerable: true,
                state: QueryState.complete()
            },
            data: {
                writable: true,
                enumerable: true,
                value: updatable()
            }
        });
        Wallets.push(wallet);
        return wallet;
    }

    return {
        addWallet(wallet, handler, ...params) {
            if (find(wallet))
                throw new Error(`The wallet "${wallet}" already exist`);
            else create(wallet, handler, ...params);
            return this;
        },
        addHandler(wallet, handler, ...params) {
            let w = find(wallet);
            if (isValid(w)) {
                w.handler = {
                    method: handler,
                    params: params
                }
            }
            else throw new Error(`The wallet "${wallet}" does not exist`);
            return this;
        },
        bindUseState(wallet, useState, autoCreate) {
            let w = findWithOption(wallet, autoCreate);
            let subscription = w.$.subscribe((next) => {
                // console.info(String(wallet).toUpperCase(), next);
                useState(next);
            });
            nextIfNotEmpty(w);
            return subscription;
        },
        bindUseStateAndCall(wallet, useState, autoCreate) {
            let w = findWithOption(wallet, autoCreate);
            let subscription = w.$.subscribe((next) => {
                // console.info(String(wallet).toUpperCase(), next);
                useState(next);
            });
            callHandler(w);
            return subscription;
        },
        call(wallet) {
            callHandler(find(wallet));
            return this;
        },
        createOrSubscribe(wallet, observer) {
            let w = findWithOption(wallet, true);
            return w.$.subscribe(observer);
        },
        createOrSubscribeAndCall(wallet, observer) {
            let w = findWithOption(wallet, true);
            let subscription = w.$.subscribe(observer);
            callHandler(w);
            return subscription;
        },
        has(wallet) {
            return find(wallet) ? true : false;
        },
        isEmpty(wallet) {
            let w = find(wallet);
            return w ? w.data.isEmpty() : true;
        },
        refresh(wallet) {
            let w = findWithOption(wallet);
            callHandler(w);
            return this;
        },
        set(wallet, data, autoCreate) {
            let w = findWithOption(wallet, autoCreate);
            w.data.set(data);
            w.state = QueryState.complete();
            next(w);
            return this;
        },
        setPocket(wallet, pocket, data, autoCreate) {
            let w = findWithOption(wallet, autoCreate);
            w.data.add(pocket, data);
            w.state = QueryState.complete();
            next(w);
            return this;
        },
        setQueryState(wallet, autoCreate, queryState) {
            let w = findWithOption(wallet, autoCreate);
            w.state = queryState;
            return {
                complete(data) {
                    w.state = QueryState.complete(data);
                    next(w);
                },
                loading(data) {
                    w.state = QueryState.loading(data);
                    next(w);
                },
                error(data) {
                    w.state = QueryState.error(data);
                    next(w);
                }
            }
        },
        subscribe(wallet, observer) {
            let w = findWithOption(wallet);
            return w.$.subscribe(observer);
        },
        unsubscribe(...subscriptions) {
            subscriptions.forEach(subscription => {
                Assert.sameTypeOf(new Subscription(), subscription);
                // console.error("Unsubscribing from", subscription);
                if (subscription) subscription.unsubscribe();
            });
            return this;
        },
        update(wallet, data) {
            let w = findWithOption(wallet);
            w.data.update(data);
            next(w);
        },
        init(data, state) {
            return { data: Undefined(data, {}), state: Undefined(state, QueryState.complete()) }
        },
        /**
         * The wallets must exist before its subscriptions.
         * 
         * @param {*} observer 
         * @param  {...any} wallets 
         * @returns 
         */
        uni(observer, ...wallets) {
            Assert.isArray(wallets).notEmpty().typeOf(String);
            let w = findWallets(...wallets);
            if (w.length !== wallets.length) {
                throw new Error(`You tried to subscribe to 
                the wallets "[${wallets.join(", ")}]", but only the [${w.map(w => w.name).join(", ")}] was found`);
            } else {
                let multi = {
                    $: new Subject(),
                    select: wallets,
                    tag: "multi-single"
                };
                $multi.push(multi);
                return multi.$.subscribe(observer);
            }
        },
        multi(observer, ...wallets) {
            Assert.isArray(wallets).notEmpty().typeOf(String);
            let w = findWallets(...wallets);
            if (w.length !== wallets.length) {
                throw new Error(`You tried to subscribe to 
                the wallets "[${wallets.join(", ")}]", but only the [${w.map(w => w.name).join(", ")}] was found`);
            } else {
                let multi = {
                    $: new Subject(),
                    select: wallets,
                    tag: "multi"
                };
                $multi.push(multi);
                return multi.$.subscribe(observer);
            }
        },
        subscribeToWallets(observer, ...exclude) {
            let multi = {
                $: new Subject(),
                select: exclude,
                tag: "wallet"
            };
            $multi.push(multi);
            return multi.$.subscribe(observer);
        },
        get wallets() {
            return Wallets;
        },
        get empty() {
            return { data: {}, state: QueryState.complete() }
        },
        get loading() {
            return { data: {}, state: QueryState.loading() }
        }
    }
}

export const NobbleWallet = createWallet("config");
