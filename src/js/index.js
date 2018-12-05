if (process.env.NODE_ENV !== 'production') {
    require('../view/index.html')
}

import '../css/indexCarousel.scss'

import header from './common/header.js';
import NavBar from './common/nav-bar.js';
import carousel from './components/index/crousel.js'

new Vue({
	el: "#compact",
	data: function(){
		return {}
	},

	components: {
		'v-header': header,
		'v-nav-bar':NavBar,
		'v-carousel':carousel,
	}

});
$(document).ready(function(){

var item = $(".carousel-item")[0]
console.log(item)
item.classList.add("active")
$("[data-slide-to=0]")[0].classList.add("active")

})
// import './lib/bootstrap.min.js'

