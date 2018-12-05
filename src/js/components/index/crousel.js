
import axios from 'axios';
import common from "../../common/url.js";
// import  '../../lib/jquery-3.3.1.min.js';
var carousel = {
	template : '<div id="demo" class="carousel slide" data-ride="carousel"><ul class="carousel-indicators"> <li v-for="i in imgList" data-target="#demo" v-bind:data-slide-to="i.id-1"></li> </ul><div class="carousel-inner"> <div v-for="j in imgList" class="carousel-item"><a class="test" href="http://www.baidu.com"></a> <img v-bind:src="j.location"/> </div> </div><a class="carousel-control-prev" href="#demo" data-slide="prev"><span class="carousel-control-prev-icon"></span></a><a class="carousel-control-next" href="#demo" data-slide="next"><span class="carousel-control-next-icon"></span></a></div>',

	data:function(){

        return{
            list:0,
            imgList:[
	            {
	            	id:1,
	            	location:"../img/assests/img/index/no1.jpg"
	            },
	            {
	            	id:2,
	            	location:"../img/assests/img/index/no1.jpg"
	            }
            ]
        }
    }
};

export default carousel;