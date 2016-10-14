module.exports = {
    getExpoSlots: function() {
        return new Promise(function(resolve, reject) {
            return element(by.id("slots")).getText().then(function(expSlots) {
                expSlots = expSlots.split(":")[2];
                expSlots = expSlots.replace(" ", "");
                expSlots = expSlots.split("/");
                console.log("returning expo slots")
                resolve(expSlots[1] - expSlots[0]);
            });
        });
    },
    getFleetSlots: function() {
        return new Promise(function(resolve, reject) {
            return element(by.id("slots")).getText().then(function(fleetSlots) {
                fleetSlots = fleetSlots.split(":")[1];
                fleetSlots = fleetSlots.replace(" ", "");
                fleetSlots = fleetSlots.replace("Expeditionen", "");
                fleetSlots = fleetSlots.replace("\n", "");
                fleetSlots = fleetSlots.split("/");
                console.log("returning fleet slots")
                resolve(fleetSlots[1] - fleetSlots[0]);
            });
        });
    }
}
