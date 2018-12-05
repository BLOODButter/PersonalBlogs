class canvas {

	constructor (id){
		this.id = id
	}
	init() {
        window.addEventListener('resize', () => this.resize(), false)
		var canvas = document.getElementById(this.id);
        this.ele = canvas
		if (canvas.getContext){
			this.context = canvas.getContext("2d");
		}
		this.resize()
		return this.context;
	}

	resize(){
		this.width = this.ele.width
        // console.log(this.ele.height)
        this.height = this.ele.height
	}
	run (callback){
        requestAnimationFrame(() => {
        this.run(callback)
})
		callback(this.context)
	}

}

export default canvas