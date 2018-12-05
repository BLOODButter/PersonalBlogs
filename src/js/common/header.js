

import drawCanvas from './function/drawCanvas'

var header = {
	template : "<div id='header'> <canvas id = 'canvas'></canvas><div></div> </div>",
	data:function(){
		window.onload=drawCanvas;
		return {}
	}
};
export default header;