import VueRouter from 'vue-router';
import lists from '../common/lists.js';
import article from '../common/article';

const router = new VueRouter({
	routes : [
		{path : '/', redirect :'/lists/1/0/1'},
		{ path : '/lists/:type/:subtype/:page', component: lists },
		{ path : '/article/:id', component: article}
	]
});

export default router;

