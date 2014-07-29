// via http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
var pressKey = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
        get : function() {
            return this.keyCodeVal;
        }
    });     
    Object.defineProperty(oEvent, 'which', {
        get : function() {
            return this.keyCodeVal;
        }
    });     

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent('keydown', true, true, document.defaultView, false, false, false, false, k, k);
    } else {
        oEvent.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;

    document.dispatchEvent(oEvent);
};
