/**
 *    Copyright 2012 Tribloom
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
