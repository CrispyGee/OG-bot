var ogameConf = require("./ogameConf.js");

describe('Ogame automation', function() {
    it('should do attacks', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendAttacks();
    });
});

function sendAttacks() {
    var attackPromise;
    for (var i = 0; i < ogameConf.targets.length; i++) {
        const x = i;
        if (attackPromise) {
            attackPromise = attackPromise.then(function() {
                attackPlayer(ogameConf.targets[x]);
            });
        } else {
            attackPromise = attackPlayer(ogameConf.targets[x]);
        }
    }
}

function attackPlayer(player) {
    var playerCoords = player.coords.split(":");
    var playerGalaxy = playerCoords[0];
    var playerSystem = playerCoords[1];
    var playerPosition = playerCoords[2];
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    return element(by.id("button203")).element(by.className("level")).getText().then(function(numberTransporters) {
        return element(by.id("ship_203")).sendKeys(player.numTransporters).then(function() {
            browser.driver.sleep(2000);
            return element(by.id("continue")).click().then(function() {
                browser.driver.sleep(2000);
                element(by.id("galaxy")).click().then(function() {
                    element(by.id("galaxy")).sendKeys(playerGalaxy);
                });
                element(by.id("system")).sendKeys(playerSystem);
                element(by.id("position")).sendKeys(playerPosition);
                browser.driver.sleep(1000);
                return element(by.id("continue")).click().then(function() {
                    browser.driver.sleep(2000);
                    return element(by.id("missionButton1")).click().then(function() {
                        browser.driver.sleep(1000);
                        return element(by.id("start")).element(by.tagName("span")).click().then(function() {
                            console.log("attacked player at " + player.coords + " with " + player.numTransporters + " big transporters");
                        });
                    });
                });
            });
        });
    });
}
