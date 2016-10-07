var ogameConf = require("./ogbsettings.js");

describe('Ogame automation', function() {
    it('should do save fleet and resources', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        saveFleetAndResources();
    });
});

function saveFleetAndResources() {
    if (ogameConf.fleetResourceSave) {
        console.log("starting to analyze fleet movements to avoid possible attacks");
        element.all(by.id('js_eventDetailsClosed')).then(function(fleetMovements) {
            if (fleetMovements.length > 0) {
                fleetMovements[0].click().then(function() {
                    browser.driver.sleep(2000);
                    //TODO replace friendly with hostile
                    element.all(by.css('.countDown.friendly.textBeefy')).then(function(friendlyMovements) {
                        if (friendlyMovements.length > 0) {
                            friendlyMovements[0].getText().then(function(text) {
                                console.log(text);
                                var minutesUntilAttack = text.split("m")[0];
                                console.log(minutesUntilAttack);
                                if (minutesUntilAttack < 20) {
                                  console.log("Attack within less than 20 mins detected, avoiding");
                                }
                            });
                        }
                    });
                });
            }
        });
    }
}

function sendTransportersToPlanet() {
    console.log("switching to next planet");
    browser.driver.sleep(2000);
    console.log("checking if fleets available");
    element.all(by.id("button203")).then(function(button203) {
        if (button203.length > 0) {
            return doActualTransport();
        }
    });
}

var planetCoords = ogameConf.savePlanet.split(":");
var planetGalaxy = planetCoords[0];
var planetSystem = planetCoords[1];
var planetPosition = planetCoords[2];

function doActualTransport() {
    return element(by.id("button203")).click().then(function() {
        browser.driver.sleep(2000);
        return element.all(by.id("continue")).then(function(continueB) {
            if (continueB.length > 0) {
                return element(by.id("continue")).click().then(function() {
                    browser.driver.sleep(2000);
                    return element.all(by.id("galaxy")).then(function(galaxy) {
                        if (galaxy.length > 0) {
                            element(by.id("galaxy")).click().then(function() {
                                element(by.id("galaxy")).sendKeys(planetGalaxy);
                            });
                            element(by.id("system")).sendKeys(planetSystem);
                            element(by.id("position")).sendKeys(planetPosition);
                            browser.driver.sleep(1000);
                            console.log("continuing");
                            return element(by.id("continue")).click().then(function() {
                                browser.driver.sleep(2000);
                                return element(by.id("missionButton3")).click().then(function() {
                                    browser.driver.sleep(500);
                                    browser.executeScript('maxMetal();');
                                    browser.executeScript('maxCrystal();');
                                    browser.executeScript('maxDeuterium();');
                                    browser.driver.sleep(1000);
                                    console.log("sending transporters home")
                                    return element(by.id("start")).element(by.tagName("span")).click();
                                });
                            });
                        } else {
                            console.log("no transporters were available")
                        }
                    });
                });
            }
        });
    });
}
