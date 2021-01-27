/**
 * Created By André R. R. Costa
 * https://www.nobblecrafts.com
 */

import { Subject } from "rxjs";

export function createWallet(name) {
    let wallets = [{ name: name, $: new Subject(), pocket: {} }]

    console.log("Wallets Created, Records:", wallets);

    return {
        subscribe(wallet, observer) {
            let w = wallets.find(w => w.name === wallet);
            if (w) {
                return w.$.subscribe(observer);
            } else {
                throw new Error(`The wallet "${wallet}" does not exists`);
            }
        },
        createOrSubscribe(walletName, observer) {

            let wallet = wallets.find(w => w.name === walletName);
            if (wallet) {
                return wallet.$.subscribe(observer);
            } else {
                let newWallet = { name: walletName, $: new Subject(), pocket: {} }
                wallets.push(newWallet);
                return newWallet.$.subscribe(observer);
            }

        },
        addWallet(walletName) {
            if (wallets.find(w => w.name === walletName)) {
                throw new Error("The name of wallet you trying to add already exists");
            }
            wallets.push({ name: walletName, $: new Subject(), pocket: {} });
        },
        setPocket(walletName, key, value) {
            let wallet = wallets.find(w => w.name === walletName);
            if (wallet) {
                wallet.pocket[key] = value;
                wallet.$.next(wallet.pocket);
            } else {
                throw new Error(`The wallet "${walletName}" does not exists`);
            }
        }
    }
}

export const NobbleWallet = createWallet("config");
