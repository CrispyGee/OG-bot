exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['../login.js', '../saveresources.js'],
    allScriptsTimeout: 500000,
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                '--start-maximized'
            ]
        }
    },
    jasmineNodeOpts: {
      defaultTimeoutInterval: 500000
    }
};
