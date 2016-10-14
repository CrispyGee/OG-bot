var ogameConf = require("./conf/botConf.js");
var utils = require("./utils.js");

describe('Ogame automation', function() {
    it('should do expeditions', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendExpos();
    });
});

function sendExpos() {
    console.log("starting expeditions");
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    Promise.all([utils.getFleetSlots(), utils.getExpoSlots()]).then(function(slots) {
        browser.driver.sleep(1000);
        var slotsLeft = Math.min(slots[0], slots[1]);
        console.log("exp slots left: " + slotsLeft);
        var expoPromise;
        if (slotsLeft >=1 ){
          expoPromise = sendExpedition();
        }
        for (var i = 1; i < slotsLeft; i++) {
            expoPromise.then(sendExpedition());
        }
    })
}

function sendExpedition() {
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
