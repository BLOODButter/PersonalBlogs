
import axios from 'axios';
import common from './url.js';
let lists = {
    // language=HTML
    template: "<div id = 'lists'><div v-for='i in length'  class = 'array-list'> <img class='img' src=''\> <div class='fonts'> <p class='title'><a v-bind:href='hrefs[i-1]'>{{arrayList[i-1].title}}</a></p>   <p class='content'>{{arrayList[i-1].content}}</p>  <div class='line'></div> <P class='details'> <span class='author'>{{arrayList[i-1].authorName}}</span> <span class='time'>{{arrayList[i-1].addTime}}</span>  </P>  </div>  </div></div>",

    data : function () {
        let src=window.location.href;
        let indexID=src.indexOf("lists");
        let type = src.substring(indexID+6,indexID+7);
        let subType = src.substring(indexID+8,indexID+9);
        let page = src.substring(indexID+10);
        console.log(type,subType,page);
        axios.get(common.url+'/getArticlesByType',{
            params : {
                'type': type,
                'subType': subType,
                'page': page,
            }
        }).then((response) => {
            this.arrayList = response.data.body.articles;
            this.hrefs = this.$options.methods.turnTo(this.arrayList);
        });

		return {
			arrayList : {
			},
            hrefs:[],
            length : 0
		}
    },

	computed: {
		type : function () {
			return this.$route.params.type;
        },
		subType : function () {
            return this.$route.params.subtype;
        },
		page : function () {
			return this.$route.params.page;
        },
        
	},
	watch : {
		type : function (newType) {
            axios.get(common.url+'/getArticlesByType',{
                	params : {
                		'type': newType,
                		'subType': this.subType,
                		'page': this.page
                	}
                }).then((response) => {

                this.arrayList = response.data.body.articles;
                this.hrefs = this.$options.methods.turnTo(this.arrayList);
            });

        },
        arrayList : function (newArrayList) {
			this.arrayList = newArrayList;
			this.length = newArrayList.length;
        },
        subType : function (newSubType) {
            axios.get(common.url+'/getArticlesByType',{
                params : {
                    'type': this.type,
                    'subType': newSubType,
                    'page': this.page
                }
            }).then((response) => {

                this.arrayList = response.data.body.articles;
                this.hrefs = this.$options.methods.turnTo(this.arrayList);
            });

        },
        page : function (newPage) {
            axios.get(common.url+'/getArticlesByType',{
                params : {
                    'type': this.type,
                    'subType': this.subType,
                    'page': newPage
                }
            }).then((response) => {
                this.arrayList = response.data.body.articles;
                this.hrefs = this.$options.methods.turnTo(this.arrayList);
            });

        },
	},
    methods:{
        turnTo : function(arrayList){

            // console.log(links);
            let a = [];
            let i = 0;
            for (;i<arrayList.length; i++){
                let array = arrayList[i];
                let str = "/view/index.html#/article/" + array.id;
                // let item = {array:str};
                a.push(str);
            }
            return a;
        },
        findOut: function (arrayList,array) {
            let i = 0;
            for (;i<arrayList.length; i++){
                let arr = arrayList[i];
                if(arr === array){
                    return this.hrefs[i];
                }
            }
        }
    },


};

export default lists;