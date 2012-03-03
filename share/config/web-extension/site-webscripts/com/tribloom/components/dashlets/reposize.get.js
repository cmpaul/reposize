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
