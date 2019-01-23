import NavBar from '../../common/nav-bar.js';
import lists from '../../common/lists.js'


var content = {
	template:"<div id = 'content'><v-nav-bar>  </v-nav-bar>  <router-view></router-view></div>",

	data : function(){
		return {
			
		}
	},

	components: {
		'v-nav-bar' :NavBar,
	},
};





export default content;