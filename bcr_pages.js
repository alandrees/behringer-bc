var ENCROW =
{
	MIXER :
	{
		VOL : 0,
		PAN : 1,
		SEND : 2,
		DEVICE : 3
	},
	STEPSEQ :
	{
		ROW0 : 0,
		ROW1 : 1,
		ROW2 : 2,
		ROW3 : 3
	}
};

function ButtonPage(page)
{
	this.ledBuffer = new Array(2);
	this.ledBuffer[0] = initArray(0, 8);
	this.ledBuffer[1] = initArray(0, 8);
	this.page = page;
}
ButtonPage.prototype.sendButtonLED = function(row, col)
{
	if (activeButtonPage != this.page) return;
	if (row == lowerRow)
	{
		sendNoteOn(0, NOTE.BUTTONROW_LOWER0 + col, this.ledBuffer[row][col]);
	}
	else if (row == upperRow)
	{
		sendNoteOn(0, NOTE.BUTTONROW_UPPER0 + col, this.ledBuffer[row][col]);
	}
};

ButtonPage.prototype.sendAllButtonLEDs = function()
{
	for ( var j = 0; j < 2; j++)
	{
		for ( var i = 0; i < 8; i++)
		{
			this.sendButtonLED(j, i);
		}
	}
};
ButtonPage.prototype.setButton = function(row, col, value)
{
	this.ledBuffer[row][col] = value;
	this.sendButtonLED(row, col);

};
function setButtonPage(page)
{
	activeButtonPage = page;
	buttonPages[activeButtonPage].sendAllButtonLEDs();
}

function ModePage(page)
{
	this.ledBuffer = new Array(4);
	this.ledBuffer[0] = initArray(0, 8);
	this.ledBuffer[1] = initArray(0, 8);
	this.ledBuffer[2] = initArray(0, 8);
	this.ledBuffer[3] = initArray(0, 8);
	this.page = page;

}

ModePage.prototype.sendEncoderToBControl = function(row, col)
{
	if (activeModePage != this.page) return;

	var buffer = this.ledBuffer[row][col];

	switch (row)
	{
		case ENCROW.MIXER.VOL:
			sendChannelController(0, CC.ENCLOW0 + col, buffer);
			break;
		case ENCROW.MIXER.PAN:
			sendChannelController(0, CC.ENCMID0 + col, buffer);
			break;
		case ENCROW.MIXER.SEND:
			sendChannelController(0, CC.ENCTOP0 + col, buffer);
			break;
		case ENCROW.MIXER.DEVICE:
			sendChannelController(0, CC.CLICKENC0 + col, buffer);
			break;

	}
};

ModePage.prototype.sendAllEncodersToDevice = function()
{
	for ( var j = 0; j < 4; j++)
	{
		for ( var i = 0; i < 8; i++)
		{
			this.sendEncoderToBControl(j, i);
		}
	}
};

ModePage.prototype.setEncoder = function(row, col, value)
{
	var t = (Math.round(value));

	this.ledBuffer[row][col] = t;

	// if (activeModePage === this.page) {
	this.sendEncoderToBControl(row, col);
	// }
};

function setModePage(page)
{
	activeModePage = page;
	modePages[page].sendAllEncodersToDevice();
}

function setIndications(page)
{
	switch (page)
	{
		case "mixer":
			for ( var i = 0; i < 8; i++)
			{
				var track = trackBank.getTrack(i);
				var parameter = cursorDevice.getParameter(i);
				var macro = primaryInstrument.getMacro(i).getAmount();
				track.getPan().setIndication(true);
				track.getVolume().setIndication(true);
				macro.setIndication(true);
				parameter.setIndication(true);
				cursorDevice.getEnvelopeParameter(i).setIndication(false);
				cursorDevice.getCommonParameter(i).setIndication(false);
				track.getSend(0).setIndication(false);
				track.getSend(1).setIndication(false);
				track.getSend(2).setIndication(false);
			}
			break;
		case "send":
			for ( var i = 0; i < 8; i++)
			{
				var track = trackBank.getTrack(i);
				var parameter = cursorDevice.getParameter(i);
				var macro = primaryInstrument.getMacro(i).getAmount();
				track.getPan().setIndication(false);
				track.getVolume().setIndication(false);
				cursorDevice.getEnvelopeParameter(i).setIndication(false);
				cursorDevice.getCommonParameter(i).setIndication(false);
				macro.setIndication(true);
				parameter.setIndication(false);
				for ( var s = 0; s < 3; s++)
				{
					track.getSend(s).setIndication(true);
				}
			}
			break;
		case "device":
			for ( var i = 0; i < 8; i++)
			{
				var track = trackBank.getTrack(i);
				var parameter = cursorDevice.getParameter(i);
				var macro = primaryInstrument.getMacro(i).getAmount();
				parameter.setIndication(true);
				macro.setIndication(true);
				cursorDevice.getEnvelopeParameter(i).setIndication(true);
				cursorDevice.getCommonParameter(i).setIndication(true);
				track.getPan().setIndication(false);
				track.getVolume().setIndication(false);
				for ( var s = 0; s < 3; s++)
				{
					track.getSend(s).setIndication(false);
				}
			}
			break;
		case "off":
			for ( var i = 0; i < 8; i++)
			{
				var track = trackBank.getTrack(i);
				var parameter = cursorDevice.getParameter(i);
				var macro = primaryInstrument.getMacro(i).getAmount();
				macro.setIndication(false);
				parameter.setIndication(false);
				track.getPan().setIndication(false);
				track.getVolume().setIndication(false);
				for ( var s = 0; s < 3; s++)
				{
					track.getSend(s).setIndication(false);
				}
			}
			break;
	}
}
