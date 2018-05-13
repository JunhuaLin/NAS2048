/**
 * Created by junhua on 18-5-13.
 */
"use strict";

const CHAIN_ID = 1;
const TX_HASH = "6c5b55e2bc6786dc8b6916f925c83d046cd77934d4624a2046dbeff3e14a9ede";
const CONTRACT_ADDR = "n1y62eeh6koSVGJj5RJU2WYjy91xUxpavXD";


function ScoreDao() {

    var nebulas = require('nebulas');
    this.neb = new nebulas.Neb();
    this.neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

    this.Account = nebulas.Account;
    this.Transaction = this.neb.Transaction;
    this.api = this.neb.api;
    this.admin = this.neb.admin;

    this.sAccount = null;

    this.nonce = 0;
}


ScoreDao.prototype.unlockKeyStore = function () {
    var self = this;
    var fileReader = new FileReader();
    fileReader.onload = function (ev) {
        var parse = JSON.parse(ev.target.result);

        var address = parse.address;
        var password = "nebulas2018";
        var account = new Account();
        account.fromKey(parse, password, false);
        self.sAccount = account;

        self.api.getAccountState(address)
            .then(function (resp) {
                self.nonce = parseInt(resp.nonce);
            })
            .catch(function (reason) {
                console.log(reason)
            });
    };

    try {
        //读取keystore
        fileReader.readAsText(file);
        var file = document.getElementById('fileSelector').files[0];
    } catch (err) {

    }
};

ScoreDao.prototype.setScore = function (name, score) {
    var self = this;
    self.api.call({
        from: self.sAccount.getAddressString(),
        to: CONTRACT_ADDR,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {function: 'setScore', args: '["' + name + '","' + score + '"]'}
    })
        .then(function (resp) {
            console.log("succ:" + resp.result);
        })
        .catch(function (err) {
            console.log(err + " : " + resp);
        });

};

ScoreDao.prototype.getScore = function (name) {
    var self = this;
    self.api.call({
        from: self.sAccount.getAddressString(),
        to: CONTRACT_ADDR,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {function: 'getScore', args: '["' + name + '"]'}
    })
        .then(function (resp) {
            console.log("succ:" + resp.result);
        })
        .catch(function (err) {
            console.log(err + " : " + resp);
        });
};

ScoreDao.prototype.getRank = function () {
    var self = this;
    self.api.call({
        from: self.sAccount.getAddressString(),
        to: CONTRACT_ADDR,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {function: 'getRank'}
    })
        .then(function (resp) {
            console.log("succ:" + resp.result);
        })
        .catch(function (err) {
            console.log(err + " : " + resp);
        });
}
