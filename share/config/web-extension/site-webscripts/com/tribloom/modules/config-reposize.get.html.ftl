<div id="${args.htmlid}-configDialog" class="config-reposize">
    <div class="hd">${msg("label.dialogTitle")}</div>
    <div class="bd">
        <form id="${args.htmlid}-form" action="" method="POST">
            <div class="yui-gd">
                <div class="yui-u first"><label for="${args.htmlid}-refreshInterval">${msg("label.refreshInterval")}:</label></div>
                <div class="yui-u">
                    <select id="${args.htmlid}-refreshInterval" name="refreshInterval">
                    	<option value="-1">${msg("label.refreshInterval.off")}</option>
                    	<option value="1">2 ${msg("label.refreshInterval.seconds")}</option>
                        <option value="5">5 ${msg("label.refreshInterval.seconds")}</option>
                        <option value="10">10 ${msg("label.refreshInterval.seconds")}</option>
                        <option value="30">30 ${msg("label.refreshInterval.seconds")}</option>
                        <option value="60">60 ${msg("label.refreshInterval.seconds")}</option>
                        <option value="300">5 ${msg("label.refreshInterval.minutes")}</option>
                        <option value="600">10 ${msg("label.refreshInterval.minutes")}</option>
                        <option value="1800">30 ${msg("label.refreshInterval.minutes")}</option>
                        <option value="3600">60 ${msg("label.refreshInterval.minutes")}</option>
                    </select>
                </div>
            </div>
            <div class="yui-gd">
                <div class="yui-u first"><label for="${args.htmlid}-units">${msg("label.units")}:</label></div>
                <div class="yui-u">
                    <select id="${args.htmlid}-units" name="units">
                        <option value="B">${msg("label.units.bytes")}</option>
                        <option value="KB">${msg("label.units.kilobytes")}</option>
                        <option value="MB">${msg("label.units.megabytes")}</option>
                        <option value="GB">${msg("label.units.gigabytes")}</option>
                    </select>
                </div>
            </div>
            <div class="bdft">
                <input type="submit" id="${args.htmlid}-ok" value="${msg("button.ok")}" />
                <input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
            </div>
        </form>
    </div>
</div>
