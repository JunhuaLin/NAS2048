// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {

    var localStorageManager = new LocalStorageManager();
    var scoreDao = new ScoreDao();

    new RankManager(scoreDao);

    new NameManager(localStorageManager, scoreDao, function () {
        var keyboardInputManager = new KeyboardInputManager();
        var htmlActuator = new HTMLActuator();

        var terminated = function (isWon, score, bestScore) {
            console.log("Terminated: score=" + score + "  bestScore:" + bestScore);
            var username = localStorageManager.getUserName();
            scoreDao.setScore(username, bestScore);
        };
        var updateScore = function (score, bestScore) {
            // console.log("UpdateScore: score=" + score + "  bestScore:" + bestScore);
            // var username = localStorageManager.getUserName();
            // scoreDao.setScore(username, bestScore);
        };

        htmlActuator.setOnTerminatedListener(terminated);
        htmlActuator.setOnUpdateScoreListener(updateScore);

        new GameManager(4, keyboardInputManager, htmlActuator, localStorageManager);
    });
});
