if (process.env.NODE_ENV !== 'production') {
    require('../view/news.html')
}

import '../css/index.scss'

import header from './common/header.js';


new Vue({
    el: "#compact",
    data: function(){
        return {}
    },

    components: {
        'v-header': header,
    }

});