var ogameConf = require("./ogameConf.js");

describe('Ogame automation', function() {
    it('should do transports', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        sendTransportersFromPlanets();
    });
});

function sendTransportersFromPlanets() {
    element(by.id('planetList')).all(by.tagName('div')).then(function(planetsOut) {
        for (var i = 1; i < 2; i++) {
            const x = i;
            element(by.id('planetList')).all(by.tagName('div')).then(function(planets) {
                planets[x].click().then(function() {
                    sendTransportersToPlanet();
                });
            });
            browser.pause();
        }
    });
}

function sendTransportersToPlanet() {
    var planetCoords = ogameConf.homePlanet.split(":");
    var planetGalaxy = planetCoords[0];
    var planetSystem = planetCoords[1];
    var planetPosition = planetCoords[2];
    console.log("navigating to fleet page");
    browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=fleet1");
    browser.driver.sleep(2000);
    console.log("addings transporters");
    return element(by.id("button203")).click().then(function() {
        browser.driver.sleep(2000);
        console.log("submitting");
        return element(by.id("continue")).click().then(function() {
            browser.driver.sleep(2000);
            // console.log("entering coords");
            // element(by.id("galaxy")).click().then(function() {
            //     element(by.id("galaxy")).sendKeys(planetGalaxy);
            // });
            // element(by.id("system")).sendKeys(planetSystem);
            // element(by.id("position")).sendKeys(planetPosition);
            // browser.driver.sleep(1000);
            // console.log("continuing");
            // return element(by.id("continue")).click().then(function() {
            //     browser.driver.sleep(2000);
            //     return element(by.id("missionButton3")).click().then(function() {
            //         browser.driver.sleep(500);
            //         browser.executeScript('maxMetal();');
            //         browser.executeScript('maxCrystal();');
            //         browser.executeScript('maxDeuterium();');
            //         browser.driver.sleep(500);
            //         return element(by.id("start")).element(by.tagName("span")).click();
            //     });
            // });
        });
    });
}
