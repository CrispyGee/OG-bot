var ogameConf = require("./ogbsettings.js");

describe('Ogame automation', function() {
    it('should do expeditions', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendExpos();
    });
});

function sendExpos() {
    console.log("starting expeditions");
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

function sendExpedition() {
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    browser.driver.sleep(2000);
    element(by.id("slots")).element(by.tagName("span")).getText().then(function(fleetSlots) {
        var fleetSlotsSplit = fleetSlots.split(":")[1].split("/");
        var fleetSlotsLeft = fleetSlotsSplit[1] - fleetSlotsSplit[0];
        if (fleetSlotsLeft > 1) {
            return element(by.id("button203")).element(by.className("level")).getText().then(function(numberTransporters) {
                var numTransporters = ogameConf.expeditions.numTransporters;
                return element(by.id("ship_203")).sendKeys(numTransporters).then(function() {
                    browser.driver.sleep(2000);
                    return element(by.id("continue")).click().then(function() {
                        var system = randomIntFromInterval(140, 180);
                        browser.driver.sleep(2000);
                        return element.all(by.id("galaxy")).then(function(galaxy) {
                            if (galaxy.length > 0) {
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
                            }
                        });
                    });
                });
            });
        }
    });
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
