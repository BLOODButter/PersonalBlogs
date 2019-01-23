

var NavBar = {
		template : "<div id='nav-bar'><ul><li class='first'> <a  v-on:click='showBlogs = !showBlogs'>技术博客</a><transition name='fade'><ul v-if = 'showBlogs'><li><router-link to='/lists/1/0/1'>Java</router-link></li><li><router-link to='/lists/1/1/1'>spring</router-link></li><li><router-link to='/lists/1/2/1'>xxx</router-link></li></ul></transition></li><li class='first'> <a  v-on:click = 'showLifes = !showLifes'>生活点滴</a><transition name='fade'><ul v-if = 'showLifes'><li><router-link to='/lists/2/1/1'>xxx</router-link></li><li><router-link to='/lists/2/2/1'>xxx</router-link></li><li><router-link to='/lists/2/3/1'>xxx</router-link></li></ul></transition></li><li> <a href='#'>关于我</a></li><li> <a href='#'>时间线</a></li></ul></div>",
		data : function(){
			return {
				showBlogs :false,
				showLifes :false
			}
		}
};

export default NavBar;