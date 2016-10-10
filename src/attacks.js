var ogameConf = require("./conf/botConf.js");

describe('Ogame automation', function() {
    it('should do attacks', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendAttacks();
    });
});

function sendAttacks() {
    console.log("starting fleet attacks");
    var attackPromise;
    var targets = ogameConf.targets;
    shuffle(targets);
    element(by.id("planetList")).element(by.tagName("a")).click();
    browser.driver.sleep(2000);
    for (var i = 0; i < targets.length; i++) {
        const x = i;
        if (attackPromise) {
            attackPromise = attackPromise.then(function() {
                attackPlayer(targets[x]);
            });
        } else {
            attackPromise = attackPlayer(targets[x]);
        }
    }
}

function attackPlayer(player) {
    var playerCoords = player.coords.split(":");
    var playerGalaxy = playerCoords[0];
    var playerSystem = playerCoords[1];
    var playerPosition = playerCoords[2];
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    element(by.id("slots")).element(by.tagName("span")).getText().then(function(fleetSlots) {
        var fleetSlotsSplit = fleetSlots.split(":")[1].split("/");
        var fleetSlotsLeft = fleetSlotsSplit[1] - fleetSlotsSplit[0];
        if (fleetSlotsLeft > 1) {
            return element(by.id("button203")).element(by.className("level")).getText().then(function(numberTransporters) {
                return element(by.id("ship_203")).sendKeys(player.numTransporters).then(function() {
                    browser.driver.sleep(2000);
                    return element(by.id("continue")).click().then(function() {
                        browser.driver.sleep(2000);
                        return element.all(by.id("galaxy")).then(function(galaxy) {
                            if (galaxy.length > 0) {
                                element(by.id("galaxy")).click().then(function() {
                                    element(by.id("galaxy")).sendKeys(playerGalaxy);
                                });
                                element(by.id("system")).sendKeys(playerSystem);
                                element(by.id("position")).sendKeys(playerPosition);
                                browser.driver.sleep(1000);
                                return element(by.id("continue")).click().then(function() {
                                    browser.driver.sleep(2000);
                                    checkIfAttackPossibleAndDoIt(player);
                                });
                            }
                        });
                    });
                });
            });
        }
    });
}

function checkIfAttackPossibleAndDoIt(player) {
    return element.all(by.id("missionButton1")).then(function(missionButton1) {
        if (missionButton1.length > 0) {
            return element(by.id("missionButton1")).click().then(function() {
                browser.driver.sleep(1000);
                return element(by.id("start")).element(by.tagName("span")).click().then(function() {
                    console.log("attacking player at " + player.coords + " with " + player.numTransporters + " big transporters");
                });
            });
        }
    });
}

/**
 * Shuffles array in place.
 * @param {Array} a The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
