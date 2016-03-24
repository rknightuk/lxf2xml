var message = document.getElementById('message');

function showError(msg) {
	showMessage(msg, 'error');
}

function showSuccess(msg) {
	showMessage(msg, 'success');
}

function showMessage(msg, type) {
	message.style.display = 'block';
	message.innerHTML = msg;
	message.className = 'alert ' + type;
}

function hideMessage() {
	message.style.display = 'none';
}

function fileChanged(e)
{
	hideMessage();
	var inputFile = e.currentTarget;
	var zipFile = inputFile.files[0];

	if (zipFile.type !== 'application/x-legoexchangeformat') {
		showError('Input type is not valid LXF file. Please try again.');
		return;
	}

	var fileReader = new FileReader();

	fileReader.onload = function(event)
	{
		var lxfFile = new JSZip(event.target.result);
		var partsList = null;

		for (var fileName in lxfFile.files)
		{
			if (fileName != 'IMAGE100.LXFML') continue;

			partsList = lxfFile.files[fileName];
		}

		if ( ! partsList) {
			showError("No valid parts list found");
			return;
		}

		generatePartData(partsList);

	};

	fileReader.readAsArrayBuffer(zipFile);
}

function getBricklinkColourID(LDDColourId) {
	return bricklinkIDs[LDDColourId] ? bricklinkIDs[LDDColourId] : LDDColourId;
}

function generatePartData(file) {
	showSuccess('Parts list extracted');
	var xml = file.asText();
	var parser = new DOMParser();
    var lxfml = parser.parseFromString(xml, "text/xml");
    var parts = lxfml.getElementsByTagName('Part');

    var details = {};

    for (var i = parts.length - 1; i >= 0; i--) {
    	var designID = parts[i].getAttribute('designID');
    	var colour = getBricklinkColourID((parts[i].getAttribute('materials')).split(',')[0]);
    	var uniqueID = designID + '-' + colour;

    	if (details[uniqueID]) {
    		details[uniqueID].quantity = details[uniqueID].quantity + 1;
    	}
    	else {
    		details[uniqueID] = {
	            designID: designID,
	    		colour: colour,
	    		quantity: 1
	        };
    	}
    }

	details = Object.keys(details).map(function(k) { return details[k] });

    generateWantedList(details);
}

function generateWantedList(details) {
	var xml = '<INVENTORY>\n';

	details.forEach(function(part) {
		xml += '    <ITEM>\n';
		xml += '        <ITEMTYPE>P</ITEMTYPE>\n';
		xml += '        <ITEMID>' + part.designID + '</ITEMID>\n';
		xml += '        <MINQTY>' + part.quantity + '</MINQTY>\n';
		xml += '        <COLOR>' + part.colour + '</COLOR>\n';
		xml += '    </ITEM>\n';
	});

	xml += '</INVENTORY>';

	document.getElementById('output').innerHTML = xml;
}

document.getElementById('lxf-input').addEventListener('change', fileChanged);