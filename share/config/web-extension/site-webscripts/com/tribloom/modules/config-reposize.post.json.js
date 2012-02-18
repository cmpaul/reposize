function main() {
    var component = sitedata.getComponent(url.templateArgs.componentId);
    var refreshInterval = String(json.get("refreshInterval"));
    var units = String(json.get("units"));
    component.properties["refreshInterval"] = refreshInterval;
    component.properties["units"] = units;
    model.refreshInterval = refreshInterval;
    model.units = units;
    component.save();
}

main();
