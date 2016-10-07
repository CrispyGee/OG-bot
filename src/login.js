var ogameConf = require("./ogbsettings.js");

describe('Ogame automation', function() {
    it('log in', function() {
        browser.ignoreSynchronization = true;
        login().then(function() {
            console.log("login successful");
        })
    });
});

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
