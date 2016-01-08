var osa = require("osa");
var osx = {};

/**
 * Wrap an OSA function so that the osa module
 * doesn't shit itself if we do not pass a callback.
 * @param  {Function} callback The code to execute in the OSA environment.
 * @param  {Number}   argCount The number of arguments to pass to the callback.
 * @return {Function}
 */
function wrapFunction(callback, argCount) {
    if(typeof argCount === "undefined") argCount = 0;

    return function() {
        var args = Array.prototype.slice.call(arguments);

        // Push a noop because osa shits itself without a callback
        if(args.length <= argCount) args.push(function() {});

        // Push in the code to execute
        args.unshift(callback);

        return osa.apply(osa, args);
    };
};

/**
 * Get the volume of the machine.
 *
 * WARNING: These functions are executed in the context of the
 * machine's JavaScript.
 * 
 * @param  {function} Callback with volume settings.
 */
osx.getVolume = wrapFunction(function() {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;

    return app.getVolumeSettings()
});

/**
 * Set the volume of the system.
 * @param  {Number} volume The absolute volume.
 */
osx.setVolume = wrapFunction(function(volume) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;

    var settings = app.getVolumeSettings();
    settings.outputVolume = Math.max(0, Math.min(100, volume));
    app.setVolume(null, settings);
}, 1);

/**
 * Adjust the volume relative to the current setting.
 * @param  {Number} adjustment The adjustment.
 */
osx.adjustVolume = wrapFunction(function(adjustment) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;

    var settings = app.getVolumeSettings();
    settings.outputVolume = Math.max(0, Math.min(100, settings.outputVolume + adjustment));
    app.setVolume(null, settings);
}, 1);

module.exports = osx;