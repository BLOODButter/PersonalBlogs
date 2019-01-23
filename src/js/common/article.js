
import axios from 'axios';
import common from './url';

var article = {
    template: '<div id = "article"><header class="head"><h1 class="title">{{article.title}}</h1> <ul class="details"><li><span class="author">{{article.authorName}}</span> </li> <li><span class="date">{{article.addTime}}</span> </li> <li><span class="views">{{article.views}}</span> </li></ul> </header> <div class="article"> <article class="panel"> <div class="content"><div class="array">{{article.content}}</div></div> </article> </div> </div>',
    data: function () {


        return {
            article :{

            },
            // id:0
        }

    },
    computed: {
        id:function () {
            axios.get(common.url+"/getArticleById",{
                params:{
                    'id': this.$route.params.id
                }
            }).then((response) => {
                this.article = response.data.body;
            });
            return this.$route.params.id;
        },

    },
    watch:{
        id:function (newID) {
            axios.get(common.url+"/getArticleById",{
                params:{
                    'id': newID
                }
            }).then((response) => {
                this.array = response.data.body;
            })
        }
    }
};

export default article;