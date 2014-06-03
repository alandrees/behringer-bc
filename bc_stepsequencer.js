////////////////////copy/pasted...not working yet

function Page()
{
	this.canScrollLeft = false;
	this.canScrollRight = false;
	this.canScrollUp = false;
	this.canScrollDown = false;
};

function setCellLED(col, row, ledState)
{
	var key = row * 8 + col;
	// testing if works
	// pendingLEDs[key] = ledState;
}

seqPage = new Page();

seqPage.stepSet = initArray(false, 16);
seqPage.playingStep = -1;
seqPage.noteOn = initArray(false, 128);

seqPage.onStepExists = function(col, row, state)
{
	seqPage.stepSet[col] = state;
	seqPage.drawSequencer();
};

seqPage.onStepPlay = function(step)
{
	seqPage.playingStep = step;
	seqPage.drawSequencer();
};
seqPage.gridToKey = function(x, y)
{
	return (3 - y) * 4 + x + this.drumScroll;
};

seqPage.drawSequencer = function()
{
	// if (activeModePage != MODE_PAGE.STEPSEQ) return;

	for ( var y = 0; y < 2; y++)
	{
		for ( var x = 0; x < 8; x++)
		{
			var index = y * 8 + x;

			var isSet = this.stepSet[index];
			var isPlaying = index == this.playingStep;

			var ledIndication = isSet ? (isPlaying ? Led.OFF : Led.ON) : (isPlaying ? Led.ON : Led.OFF);
		//////////////////////////////////////////	buttonPages[BUTTON_PAGE.STEPSEQ].setButton(upperRow, col, on ? 127 : 0); //umsetzung?
			setCellLED(x, y, colour);
		}
	}

	// for(var x=0; x<8; x++) setRightLED(x, (this.velocityStep == x) ? Colour.AMBER_FULL : Colour.OFF);

};