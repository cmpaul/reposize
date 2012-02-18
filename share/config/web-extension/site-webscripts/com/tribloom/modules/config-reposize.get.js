function main() {
	var component = null;
	if (url.templateArgs.length > 0) {
		component = sitedata.getComponent(url.templateArgs.componentId);
	}
	model.refreshInterval = 60;
	model.units = "B";
	if (component != null) {
		if (component.properties["refreshInterval"]) {
			model.refreshInterval = component.properties["refreshInterval"];
		}
		if (component.properties["units"]) {
			model.units = component.properties["units"];
		}
	}
}
main();