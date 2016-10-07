var ogameConf = require("./ogbsettings.js");

describe('Ogame automation', function() {
    it('should do transports', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendTransportersFromPlanets();
    });
});

function sendTransportersFromPlanets() {
    if (ogameConf.transportToMain) {
        console.log("starting to transport resources to main planet");
        browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
        browser.driver.sleep(1000);
        element(by.id('planetList')).all(by.tagName('div')).then(function(planetsOut) {
            for (var i = 1; i < planetsOut.length; i++) {
                browser.driver.sleep(1000);
                const x = i;
                element(by.id('planetList')).all(by.tagName('div')).then(function(planets) {
                    planets[x].click().then(function() {
                        sendTransportersToPlanet();
                    });
                });
            }
        });
    }
}

function sendTransportersToPlanet() {
    console.log("switching to next planet");
    browser.driver.sleep(2000);
    console.log("checking if ships and fleetslots available");
    element(by.id("slots")).element(by.tagName("span")).getText().then(function(fleetSlots) {
        var fleetSlotsSplit = fleetSlots.split(":")[1].split("/");
        var fleetSlotsLeft = fleetSlotsSplit[1] - fleetSlotsSplit[0];
        if (fleetSlotsLeft > 1) {
            element.all(by.id("button203")).then(function(button203) {
                if (button203.length > 0) {
                    console.log("checking if enough resources")
                    return element(by.id("resources_metal")).getText().then(function(metal) {
                        return element(by.id("resources_crystal")).getText().then(function(crystal) {
                            return element(by.id("resources_deuterium")).getText().then(function(deuterium) {
                                metal = metal.replace(".", "");
                                crystal = crystal.replace(".", "");
                                deuterium = deuterium.replace(".", "");
                                var resourceSum = metal + crystal + deuterium;
                                if (resourceSum > 100000) {
                                    return doActualTransport();
                                }
                            });
                        });
                    });
                }
            });
        }
    });
}

var planetCoords = ogameConf.homePlanet.split(":");
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
                                return element(by.id("missionButton4")).click().then(function() {
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
