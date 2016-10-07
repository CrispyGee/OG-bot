var ogameConf = require("./ogbsettings.js");

describe('Ogame automation', function() {
    it('should build transporters', function() {
        browser.ignoreSynchronization = true;
        browser.driver.sleep(1000);
        buildTransportersOnPlanets();
    });
});

function buildTransportersOnPlanets() {
    if (ogameConf.transportToMain) {
        console.log("starting to build transporters on side planets");
        console.log("navigating to build ships page")
        browser.get("https://s140-de.ogame.gameforge.com/game/index.php?page=shipyard");
        browser.driver.sleep(1000);
        element(by.id('planetList')).all(by.tagName('div')).then(function(planetsOut) {
            console.log("reached")
            for (var i = 1; i < planetsOut.length; i++) {
                browser.driver.sleep(1000);
                const x = i;
                element(by.id('planetList')).all(by.tagName('div')).then(function(planets) {
                    planets[x].click().then(function() {
                        buildTransporterOnPlanet();
                    });
                });
            }
        });
    }
}

function buildTransporterOnPlanet() {
    console.log("switching to next planet");
    browser.driver.sleep(2000);
    return element(by.id("details203")).click().then(function() {
        browser.driver.sleep(2000);
        element(by.id("number")).sendKeys(5);
        browser.driver.sleep(1000);
        return element(by.id("resources_metal")).getText().then(function(metal) {
            return element(by.id("resources_crystal")).getText().then(function(crystal) {
                console.log("metal: " + metal);
                console.log("crystal: " + crystal);
                metal = metal.replace(".", "");
                crystal = crystal.replace(".", "");
                if (metal > 120000 && crystal > 60000) {
                    console.log("building 5 transporters");
                    return element(by.className("build-it")).click();
                } else {
                    console.log("not enough resources")
                }
            });
        });
    });
}
