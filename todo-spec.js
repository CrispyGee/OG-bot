
var ogameConf = require("./ogameConf.js");

describe('Ogame automation', function() {
    it('should send out fleets', function() {
        browser.ignoreSynchronization = true;
        login().then(function() {
            browser.driver.sleep(1000);
            console.log("login successful");
            sendAttacks();
            sendExpos();
        })
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

function sendExpos() {
    var expoPromise;
    for (var i = 0; i < ogameConf.expeditions.num; i++) {
        if (expoPromise) {
            expoPromise = expoPromise.then(function() {
                sendExpedition();
            });
        } else {
            expoPromise = sendExpedition();
        }
    }
}

function login() {
    browser.get('https://de.ogame.gameforge.com/');
    return element(by.id('loginBtn')).click().then(function() {
        return element(by.id('serverLogin')).click().then(function() {
            return element(by.id('serverLogin')).all(by.tagName('option')).then(function(options) {
                for (var i = 0; i < options.length; ++i) {
                    const x = i;
                    options[x].getText().then(function(text) {
                        if (text.includes("Nusakan")) {
                            options[x].click();
                        }
                    });
                }
            }).then(function() {
                element(by.id('usernameLogin')).sendKeys(ogameConf.username);
                element(by.id('passwordLogin')).sendKeys(ogameConf.password);
            }).then(function() {
                return element(by.id("loginSubmit")).click().then(function() {});
            });
        });
    });
}


function sendExpedition() {
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    return element(by.id("button203")).element(by.className("level")).getText().then(function(numberTransporters) {
        var numTransporters = ogameConf.expeditions.numTransporters;
        return element(by.id("ship_203")).sendKeys(numTransporters).then(function() {
            browser.driver.sleep(2000);
            return element(by.id("continue")).click().then(function() {
                var system = randomIntFromInterval(140, 180);
                browser.driver.sleep(2000);
                return element(by.id("position")).sendKeys(16).then(function() {
                    element(by.id("system")).sendKeys(system);
                    browser.driver.sleep(1000);
                    return element(by.id("continue")).click().then(function() {
                        browser.driver.sleep(1000);
                        return element(by.id("start")).element(by.tagName("span")).click().then(function() {
                            console.log("expedtion with " + numTransporters + " big transporters was sent to system " + system);
                        });
                    })
                });
            });
        });
    });
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


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
