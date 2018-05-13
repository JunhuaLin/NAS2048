/**
 * Created by junhua on 18-5-13.
 */
function NameManager(localStorageManager, scoreDao, listener) {
    var self = this;
    this.localStorageManager = localStorageManager;
    this.scoreDao = scoreDao;

    this.inputName = document.querySelector(".input-name");
    this.input = document.querySelector("#input");
    this.btn = document.querySelector("#btn");

    this.showName = document.querySelector("#show-name");
    this.spanName = document.querySelector("#span-name");

    this.inputName.style.display = "";
    this.showName.style.display = "none";

    this.btn.onclick = function () {
        var name = self.input.value;
        if (name === '') {
            alert('昵称不能为空！');
            return;
        }
        var timestamp = Date.parse(new Date());
        name = name + "@" + timestamp;
        self.localStorageManager.setUserName(name);
        self.doListener(listener);
        self.updateUserNameDisplay();
        console.log("this.btnUsername.onclick:" + name);
    };
    self.doListener(listener);
    self.updateUserNameDisplay();
}

NameManager.prototype.updateUserNameDisplay = function () {
    var username = this.localStorageManager.getUserName();
    username = username.substring(0, username.lastIndexOf('@'));
    try {
        var score = this.scoreDao.getScore(username);
        this.localStorageManager.setBestScore(score);
    } catch (err) {
    }
    this.spanName.innerHTML = username;
    this.showName.style.display = "";
    this.inputName.style.display = "none";
};

NameManager.prototype.doListener = function (listener) {
    var username = this.localStorageManager.getUserName();
    if (username) {
        listener && typeof (listener) === "function" && listener();
    }
};
