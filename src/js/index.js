if (process.env.NODE_ENV !== 'production') {
    require('../view/index.html')
}

import '../css/indexCarousel.scss'

import header from './common/header.js';
import content from './components/index/content.js';
import 'vue-router';
import router from './router/index.js'

Vue.config.productionTip = false

new Vue({
	el: "#compact",
	data: function(){
		return {}
	},

	components: {
		'v-header': header,
		'v-content':content,
	},
	router

});




