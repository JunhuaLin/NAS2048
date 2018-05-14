/**
 * Created by junhua on 18-5-13.
 */
"use strict";

const MAIN_CHAIN_ID = 1;
const MAIN_TX_HASH = "0d130f54a2ee4f056aa379339c8c217b873c6dcdeaa560fefbba486f6fdb0671";
const MAIN_CONTRACT_ADDR = "n1eJBEG4Z7xqq4c7yBfXjEpYWgsbA2KRZeH";
const MAIN_NAS_URL = "https://mainnet.nebulas.io";

const TEST_CHAIN_ID = 1001;
const TEST_TX_HASH = "896963628593923c8bae934ac98aba15afeb9e14927dbdca35d213db33450c67";
const TEST_CONTRACT_ADDR = "n1z1VWZ6RttEFHYBb1pVFWsW96fyJ3QhJup";
const TEST_NAS_URL = "https://testnet.nebulas.io";

var NAS_ADDR = MAIN_CONTRACT_ADDR;
var CHAIN_ID = MAIN_CHAIN_ID;

function ScoreDao() {
    this.sAccount = null;
    this.nonce = 0;

    this.init(false);
    this.doInput();
}

ScoreDao.prototype.init = function (isDebug) {
    var nas_url;
    if (isDebug) {
        nas_url = TEST_NAS_URL;
        NAS_ADDR = TEST_CONTRACT_ADDR;
        CHAIN_ID = TEST_CHAIN_ID;
    } else {
        nas_url = MAIN_NAS_URL;
        NAS_ADDR = MAIN_CONTRACT_ADDR;
        CHAIN_ID = MAIN_CHAIN_ID;
    }


    var nebulas = require('nebulas');
    this.neb = new nebulas.Neb();
    this.neb.setRequest(new nebulas.HttpRequest(nas_url));
    this.Account = nebulas.Account;
    this.Transaction = nebulas.Transaction;
    this.api = this.neb.api;
    this.admin = this.neb.admin;
};

ScoreDao.prototype.doInput = function () {
    var payInput = document.querySelector(".pay-input");
    var keystoreFile = document.querySelector("#keystore");
    var passwordText = document.querySelector("#password");
    var loginBtn = document.querySelector("#pay-login");

    var payShow = document.querySelector(".pay-show");
    var showAddress = document.querySelector("#show-address");

    var self = this;
    loginBtn.onclick = function () {
        var file = keystoreFile.files[0];
        var pwd = passwordText.value;

        console.log("file:" + file.name + " pwd:" + pwd);
        if (!file) {
            alert("please select keystore!");
            return;
        }
        if (!pwd) {
            alert("please input password!");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            var result = ev.target.result;
            var parse = null;
            try {
                parse = JSON.parse(result);
            } catch (e) {
                alert("keystore error!");
                return;
            }

            var account = new self.Account();
            account.fromKey(parse, pwd, false);
            self.unlockKeyStore(account, function (isSucceed, address) {
                if (isSucceed) {
                    payShow.style.display = "";
                    payInput.style.display = "none";
                    showAddress.innerHTML = address;
                } else {
                    payShow.style.display = "none";
                    payInput.style.display = "";
                    showAddress.innerHTML = "";
                    alert("keystore or password error!");
                }
            });
        };
        try {
            //读取keystore
            fileReader.readAsText(file);
        } catch (err) {
        }
    };
};

ScoreDao.prototype.getAddress = function () {
    return this.sAccount ? this.sAccount.getAddress() : null;
};

ScoreDao.prototype.isUnlockKeyStore = function () {
    return this.sAccount != null;
};

ScoreDao.prototype.unlockKeyStore = function (account, listener) {
    var self = this;
    var address = account.getAddressString();
    self.api.getAccountState(address)
        .then(function (resp) {
            self.sAccount = account;
            self.nonce = parseInt(resp.nonce);
            listener && typeof (listener) === "function" && listener(true, address);
        })
        .catch(function (reason) {
            console.log(reason);
            self.sAccount = null;
            self.nonce = 0;
            listener && typeof (listener) === "function" && listener(false, address);
        });
};

ScoreDao.prototype.setScore = function (name, score) {
    var self = this;
    if (!self.isUnlockKeyStore()) {
        return;
    }
    var tx = new self.Transaction({
        chainID: CHAIN_ID,
        from: self.sAccount,
        to: NAS_ADDR,
        value: 0,
        nonce: ++self.nonce,
        gasPrice: 1000000,
        gasLimit: 3000000,
        contract: {function: 'setScore', args: '["' + name + '",' + score + ']'} // owner , alias
    });

    tx.signTransaction();
    self.api.sendRawTransaction(tx.toProtoString())
        .then(function (resp) {
            console.log("setScore succ:" + JSON.stringify(resp));
        })
        .catch(function (err) {
            console.error(err);
        });

    //测试
    // self.api.call({
    //     from: self.sAccount.getAddressString(),
    //     to: NAS_ADDR,
    //     value: 0,
    //     nonce: self.nonce + 1,
    //     gasPrice: 1000000,
    //     gasLimit: 3000000,
    //     contract: {function: 'setScore', args: '["' + name + '",' + score + ']',}
    // })
    //     .then(function (resp) {
    //         console.log("setScore succ:" + resp.result);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //     });

};

ScoreDao.prototype.getScore = function (name, listener) {
    var self = this;
    if (!self.isUnlockKeyStore()) {
        return;
    }

    self.api.call({
        from: self.sAccount.getAddressString(),
        to: NAS_ADDR,
        value: 0,
        nonce: self.nonce,
        gasPrice: 1000000,
        gasLimit: 3000000,
        contract: {function: 'getScore', args: '["' + name + '"]',}
    })
        .then(function (resp) {
            listener && typeof (listener) === "function" && listener(resp.result);
            console.log("getScore succ:" + resp.result);
        })
        .catch(function (err) {
            console.log(err + " : " + resp);
        });
};

ScoreDao.prototype.getRank = function (listener) {
    var self = this;
    if (!self.isUnlockKeyStore()) {
        return;
    }

    self.api.call({
        from: self.sAccount.getAddressString(),
        to: NAS_ADDR,
        value: 0,
        nonce: self.nonce,
        gasPrice: 1000000,
        gasLimit: 3000000,
        contract: {function: 'getRank',}
    })
        .then(function (resp) {
            console.log("getRank succ:" + resp.result + "  typeof:" + typeof (resp.result));
            listener && typeof (listener) === "function" && listener(JSON.parse(resp.result));
        })
        .catch(function (err) {
            console.log("getRank failed:" + err);
        });
};
