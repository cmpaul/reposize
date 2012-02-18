function main() {
    var refreshInterval = args.refreshInterval;
    var units = args.units;
    // Create XML object to pull values from configuration file
    var conf = new XML(config.script);
    if(!refreshInterval) { refreshInterval = conf.refreshInterval[0]; }
    if(!units) { units = conf.units[0]; }
    // Set values on the model for use in templates
    model.refreshInterval = "" + refreshInterval;
    model.units = "" + units;
}

main();
