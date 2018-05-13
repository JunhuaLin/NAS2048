/**
 * Created by junhua on 18-5-13.
 */

function RankManager(score_dao) {
    var self = this;
    this.scoreDao = score_dao;
    this.rankTable = document.querySelector(".rank-table");
    self.updateRankData();
    window.setInterval(function () {
        self.updateRankData();
    }, 60 * 1000);
}

RankManager.prototype.updateRankData = function () {
    var rankList = [];
    try {
        rankList = this.scoreDao.getRank();
    } catch (err) {
        rankList = [];
    }

    console.log(JSON.stringify(rankList));
    for (var rowIndex = 1; rowIndex < this.rankTable.rows.length; rowIndex++) {
        var row = this.rankTable.rows[rowIndex];
        row.cells[0].innerHTML = rowIndex;

        var scoreObj = rankList[rowIndex - 1];
        console.log(JSON.stringify(scoreObj));
        if (scoreObj) {
            var username = scoreObj.name;
            row.cells[1].innerHTML = username.substring(0, username.lastIndexOf('@'));
            row.cells[2].innerHTML = scoreObj.score;
        } else {
            row.cells[1].innerHTML = "--";
            row.cells[2].innerHTML = "--";
        }

    }

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




