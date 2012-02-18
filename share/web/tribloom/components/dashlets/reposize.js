(function() {

	// YUI Helpers
	var Dom = YAHOO.util.Dom;
	var Event = YAHOO.util.Event;
	var Connect = YAHOO.util.Connect;

	// Constants
	var PRECISION = 2; // Number of decimal places to show
	var ELEM_ID_UNITS = "-reposize-units";
	var ELEM_ID_CONTENTSTORE = "-reposize-contentStoreSize";
	var ELEM_ID_INDEX = "-reposize-indexesSize";
	var ELEM_ID_INDEXBACKUP = "-reposize-indexesBackupSize";
	var ELEM_ID_STOREFREE = "-reposize-storeFreeSpace";
	var ELEM_ID_STORETOTAL = "-reposize-storeTotalSpace";
	var ELEM_ID_CONTENTSTORE_LABEL = "-contentStore-label";
	var ELEM_ID_INDEX_LABEL = "-indexes-label";
	var ELEM_ID_INDEXBACKUP_LABEL = "-indexesBackup-label";
	var MAX_FAILURES = 3;

	Alfresco.dashlet.Reposize = function _constructor(htmlId) {
		Alfresco.dashlet.Reposize.superclass.constructor.call(this, "Alfresco.dashlet.Reposize",
				htmlId);
		this.configDialog = null;
		return this;
	};
	YAHOO.extend(Alfresco.dashlet.Reposize, Alfresco.component.Base, {
		options : {
				componentId : "",
				refreshInterval : "60",
				units : "B",
				consecutiveFailures: 0
			},
			onReady : function _onReady() {
				// Add click handler to config Reposize link that
				// will be visible if user is site manager.
				var configReposizeLink = Dom.get(this.id + "-configReposize-link");
				if (configReposizeLink) {
					Event.addListener(configReposizeLink, "click",
							this.onConfigReposizeClick, this, true);
				}
				this.startRefresh();
			},
			/**
			 * Called when the user clicks the config Reposize link.
			 * Will open a Reposize config dialog
			 * 
			 * @param e The click event
			 */
			onConfigReposizeClick : function _onConfigReposizeClick(e) {
				Event.stopEvent(e);
				var actionUrl = Alfresco.constants.URL_SERVICECONTEXT
						+ "reposize/config/" + this.options.componentId;
				if (!this.configDialog) {
					this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog");
					this.configDialog.setOptions(
					{
						width : "30em",
						templateUrl : Alfresco.constants.URL_SERVICECONTEXT
								+ "reposize/config",
						actionUrl : actionUrl,
						onSuccess : {
							fn : function Reposize_onConfigFeed_callback(
									response) {
								var config = response.json;
								this.options.refreshInterval = config.refreshInterval;
								this.options.units = config.units;
								this.startRefresh();
							},
							scope : this
						},
						doSetupFormsValidation : {
							fn : function Reposize_doSetupForm_callback(form) {
								form.setShowSubmitStateDynamically(true, false);
								var select = Dom.get(this.configDialog.id
										+ "-refreshInterval"), options = select.options, option, i, j;
								for (i = 0, j = options.length; i < j; i++) {
									option = options[i];
									if (option.value
											.localeCompare(this.options.refreshInterval) == 0) {
										option.selected = true;
										break;
									}
								}
								select = Dom.get(this.configDialog.id
										+ "-units");
								if (select) {
									options = select.options, option, i, j;
									for (i = 0, j = options.length; i < j; i++) {
										option = options[i];
										if (option.value
												.localeCompare(this.options.units) == 0) {
											option.selected = true;
											break;
										}
									}
								}
							},
							scope : this
						}
					});
				}
				this.configDialog.setOptions({
					actionUrl : actionUrl
				});
				this.configDialog.show();
			},
			/**
			 * Converts the given value (in bytes) to the currently selected
			 * unit (B, KB, MB, or GB). Returns the converted value to a 
			 * predefined PRECISION.
			 * 
			 * @param value size (in bytes) to be converted
			 * @return convertedValue 
			 */
			calculateSize : function _calculateSize(value) {
				if (this.options.units == 'B') {
					return value;
				}  
				var conversionFactor = 1024;
				if (this.options.units == 'MB') {
					conversionFactor = 1024 * 1024;
				} else if (this.options.units == 'GB') {
					conversionFactor = 1024 * 1024 * 1024;
				}
				return (value / conversionFactor).toFixed(PRECISION);
			},
			/**
			 * Updates the Dashlet UI with new values provided by the 
			 * JSON object returned by a webscript call (data).
			 * 
			 * @param data JSON object
			 */
			updateDashlet : function _updateDashlet(data) {
				// Update the title attributes of the labels (for tooltips)
				var contentStoreLabelEl = Dom.get(this.id
						+ ELEM_ID_CONTENTSTORE_LABEL);
				if (contentStoreLabelEl) {
					contentStoreLabelEl.title = data.contentStorePath;
				}
				var indexesLabelEl = Dom.get(this.id + ELEM_ID_INDEX_LABEL);
				if (indexesLabelEl) {
					indexesLabelEl.title = data.indexesPath;
				}
				var indexesBackupLabelEl = Dom.get(this.id
						+ ELEM_ID_INDEXBACKUP_LABEL);
				if (indexesBackupLabelEl) {
					indexesBackupLabelEl.title = data.indexesBackupPath;
				}
				// Update the Units label
				var unitsEl = Dom.get(this.id + ELEM_ID_UNITS);
				if (unitsEl) {
					var curUnits = unitsEl.innerHTML;
					if (curUnits != this.options.units) {
						unitsEl.innerHTML = this.options.units;
					}
				}
				// Update the size table items
				var storeSizeEl = Dom.get(this.id + ELEM_ID_CONTENTSTORE);
				if (storeSizeEl) {
					storeSizeEl.innerHTML = this.calculateSize(data.contentStoreSize);
				}
				var indexSizeEl = Dom.get(this.id + ELEM_ID_INDEX);
				if (indexSizeEl) {
					indexSizeEl.innerHTML = this.calculateSize(data.indexesSize);
				}
				var indexesBackupSizeEl = Dom.get(this.id
						+ ELEM_ID_INDEXBACKUP);
				if (indexesBackupSizeEl) {
					indexesBackupSizeEl.innerHTML = this
							.calculateSize(data.indexesBackupSize);
				}
				var storeFreeSpaceEl = Dom.get(this.id + ELEM_ID_STOREFREE);
				if (storeFreeSpaceEl) {
					storeFreeSpaceEl.innerHTML = this
							.calculateSize(data.storeFreeSpace);
				}
				var storeTotalSpaceEl = Dom.get(this.id
						+ ELEM_ID_STORETOTAL);
				if (storeTotalSpaceEl) {
					storeTotalSpaceEl.innerHTML = this
							.calculateSize(data.storeTotalSpace);
				}
			},
			/**
			 * Performs an asynchronous request to the GetRepoSize webscript, 
			 * retrieving the latest values for the dashlet, and updates the
			 * UI component with the new data.
			 */
			refreshComponent : function _refreshComponent() {
				var self = this;
				var success = function _success(response) {
					if (response.responseText != "") {
						var data = eval('(' + response.responseText + ')');
						if (data) {
							self.consecutiveFailures = 0;
							self.updateDashlet(data);
							return;
						}
					}
					// Repository is unavailable or sending an incorrect response
					failure();
				};
				var failure = function _failure(response) {
					if (self.consecutiveFailures < MAX_FAILURES) {
						self.consecutiveFailures++;
						Alfresco.logger.error("Reposize webscript call failed " + self.consecutiveFailures + " time(s).");
					} else {
						self.stopRefresh();
						self.options.refreshInterval = -1;
						Alfresco.logger.error(MAX_FAILURES + " failures reached. Auto-refresh cancelled.");
					}
				};
				Connect.asyncRequest("GET", Alfresco.constants.PROXY_URI + 'reposize',
					{
						success : success,
						failure : failure
					}, 
					null
				);
			},
			/**
			 * Performs a dashlet update and renews the auto-refresh interval. 
			 */
			startRefresh : function _startRefresh() {
				this.stopRefresh();
				this.refreshComponent();
				if (this.options.refreshInterval > 0) {
					var self = this;
					this.interval = setInterval(function() {
						self.refreshComponent();
					}, this.options.refreshInterval * 1000);
				}
			},
			/**
			 * Cancels the current auto-refresh.
			 */
			stopRefresh : function _stopRefresh() {
				if (this.interval) {
					clearInterval(this.interval);
					this.interval == null;
				}
			}
		}
	);
})();
