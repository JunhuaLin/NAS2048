/**
 * Created by junhua on 18-5-13.
 */

const REFRESH_TIME = 10 * 1000;

function RankManager(score_dao) {
    var self = this;
    this.scoreDao = score_dao;
    this.rankTable = document.querySelector(".rank-table");
    self.daUpdateRankData([]);
    self.updateRankData();
    window.setInterval(function () {
        self.updateRankData();
    }, REFRESH_TIME);
}

RankManager.prototype.daUpdateRankData = function (rankList) {
    if (!rankList) {
        rankList = [];
    }
    var self = this;
    for (var rowIndex = 1; rowIndex < self.rankTable.rows.length; rowIndex++) {
        var row = self.rankTable.rows[rowIndex];
        row.cells[0].innerHTML = rowIndex + "";

        var scoreObj = null;
        if (rowIndex - 1 < rankList.length) {
            scoreObj = rankList[rowIndex - 1];
        }
        console.log("daUpdateRankData:" + scoreObj);

        if (scoreObj) {
            var username = scoreObj.name;
            var index = username.lastIndexOf('@');
            if (index > 0) {
                username = username.substring(0, index);
            }
            row.cells[1].innerHTML = username;
            row.cells[2].innerHTML = scoreObj.score;
        } else {
            row.cells[1].innerHTML = "--";
            row.cells[2].innerHTML = "--";
        }
    }
};


RankManager.prototype.updateRankData = function () {
    var self = this;
    this.scoreDao.getRank(function (rankList) {
        self.daUpdateRankData(rankList);
    });
};

RankManager.prototype.mockData = function () {
    var data = [];
    for (var i = 0; i < 9; i++) {
        data[i] = {
            name: "junhua" + i + "@" + i,
            score: 666 - i
        };
    }
    return data;
};




