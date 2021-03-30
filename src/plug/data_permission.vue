<template>
  <div :class="{sel1:ie_sle,sel2:ch_sle}"  >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title1">--数据权限--</span>
        <span aria-hidden="true" class="modal-span1" @click="close">&times;</span>
      </div>
      <div class="modal-body table-responsive">
            <div class="box-table" @scroll="table_cont">
              <table class="table table-hover text-nowrap ">
                <!-- <colgroup v-for="(colg,index) in columns" :key="index" width="300px"></colgroup> -->
                    <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                      <!-- <thead class="th" :style="{width:tabal_width+'px'}" style=""> -->
                    <tr>
                      <th v-for="(list,index) in columns" :key="index"><label>{{list.Comment}}</label></th>
                      <th><input type="checkbox" @change="th_select" v-model="th_checkbox"></th>
                    </tr>
                  </thead> 
                    <tbody class="t-body" >
                    <tr v-for="(list1,index) in data_list" :key="index" @click="tr_select(list1[fld])">
                      <td v-for="(item,key,i) in list1" :key="i">{{item}}</td>
                      <!-- <td>{{list1.fld_record_id}}</td>
                      <td>{{list1.fld_create_time}}</td>
                      <td>{{list1.fld_modif_time}}</td>
                      <td>{{list1.fld_deleted}}</td>
                      <td>{{list1.fld_project_name}}</td> -->
                      <td><input type="checkbox" v-model="td_checkbox" :value="list1[fld]"></td>
                    </tr>   
                  </tbody>                                                       
              </table>
            </div>   
      </div>
      <div class="modal-footer">
        <div class="cole">
          <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel">取消</button>
        </div>                 
        <div class="shou">
          <button type="button" class="btn btn-default-determine" @click="confirm">确定</button>
        </div> 
        <!-- 加载状态 -->
      <div class="loading" v-if="anate"><i class="fa fa-spin fa-spinner"></i></div>
      </div>
    </div>
  </div>
  <tips v-if="data_flag" :current_state="current_state"></tips>
  </div>
</template>
<script>
import tips from '../box/tips.vue'
export default {
  name:'data_list',
  data () {
    return {
      //提示组件的内容
      current_state:'',
      //显示组建的标志
      data_flag:false,
      //thead复选框的选中数据
      th_checkbox:false,
      //tbody复选框的选中数据
      td_checkbox:[],
      //显示六条数据
      list:[0,1,2,3,4],
      //固定表头
      tans_late:'' ,
      //初始加载lodding状态
      anate:true ,
      //头部数据
      columns:null,
      //列表数据
      data_list:null ,
      //表的主键字段
      fld:null,
      //ie样式
      ie_sle:false,
      //chrome样式
      ch_sle:false,
      // tabal_width:''
    }
  },
  props: {
    //项目名
    project:String,
    //数据库
    db:String,
    //表名
    table:String,
    //输入框数据
    in_data:Array
  },
  computed: {

  },
  created(){
    //获取用户信息
   this.userInfo=window.sessionStorage.getItem('userInfo');
    //执行获取数据的接口
    this.get_data();
    this.browser_compatible()
  },
  components: {
     tips
  },
  mounted () {
      
  },
  methods: {
    //浏览器不兼容的样式
    browser_compatible(){
      if(!(!!window.ActiveXObject || "ActiveXObject" in window)){
        this.ch_sle=true;
      }else{
        this.ie_sle=true;
      }
    },
    //获取数据
    get_data(){
      //头部标题的接口
      this.axios.post(this.api+'/bin/'+this.project+'/'+this.db+'/'+this.table+ '/columns',{userInfo:this.userInfo}).then((res)=>{
            //标题数据
            this.columns=res.data.FIELDS;
            //不同表中的主键的不同字段
            this.fld=res.data.PRIMARY;
            //内容的接口
            this.axios.get(this.api+'/data/'+this.project+'/'+this.db+'/'+this.table).then((res)=>{
            //判断有没有主键如果没有提示出没有主键
            res.data.forEach((item,index)=>{
              if(res.data.length>0){
                //判断数据里面有没有主键如果有渲染所有的数据
                if(Object.keys(item).some((item)=>{return item==this.fld})){
                    this.data_list=res.data;
                    return false
                }else{
                  //显示提示框
                  this.data_flag=true;
                  setTimeout(()=>{
					  	  	  this.data_flag=false;
					  	    },1000)
                  //提示设置主键
                  this.current_state='lack fld_record_id'
                  return false
                }
              }
            });
            //如果输入框中有值就根据主键中的值选中哪项
            if(this.in_data){
                if(this.td_checkbox.length==0||this.td_checkbox.every((item,index)=>{return item!=i})){
                  this.td_checkbox=this.in_data;
                  this.th_checkbox=true;
               }
            };
            //没有请求出数据时的状态
            this.anate=false
            })
        })
    },
    //固定表头
    table_cont(e){
				// 表头距离滚动条滚动的距离
        // console.log(e.target.children[0].children)
        // this.tabal_width=e.target.children[0].offsetWidth
				this.tans_late=e.target.scrollTop;
        }, 
    //点击总复选框全部选中
    th_select(){
      if(this.th_checkbox==true){
        this.data_list.forEach((data,index)=>{
          if(this.td_checkbox.length==0||this.td_checkbox.every((item,index)=>{return item!=data[this.fld]})){
            this.td_checkbox.push(data[this.fld])
          }
        })   
      }else{
        this.data_list.forEach((data,index)=>{
          this.td_checkbox=this.td_checkbox.filter((item,index)=>{return item!=data[this.fld]})
        })
      }
    },
    //点击tr列表选中复选框
    tr_select(i){
        if(this.td_checkbox.length==0||this.td_checkbox.every((item,index)=>{return item!=i})){
          this.td_checkbox.push(i)
        }else{
          this.td_checkbox=this.td_checkbox.filter((item,index)=>{return item!=i})
        };
        if(this.td_checkbox.length>0){
          this.th_checkbox=true;
        }else{
          this.th_checkbox=false;
        }
    },
    //取消按钮
    cancel(){
     this.th_checkbox=false;
     this.td_checkbox=[];
    },
     //确定按钮
    confirm(){
      var data=this.td_checkbox;
      this.$emit('confirm_data',data)
    },
    //关闭按钮
    close(){
       this.$emit('close_box')
    },
  },
  
    //  directives: {
    //         drag1: {inserted(el) {
    //             let drag_Box = el; //获取当前元素
    //             let dragBox = document.getElementsByClassName('mo-header')[0];
    //             dragBox.onmousedown = e => {
    //                 //算出鼠标相对元素的位置
    //                 let disX = e.clientX - drag_Box.offsetLeft;
    //                 let disY = e.clientY - drag_Box.offsetTop;
    //                 document.onmousemove = e => {
    //                     //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //                     let left = e.clientX - disX;
    //                     let top = e.clientY - disY;
    //                     //移动当前元素
    //                     drag_Box.style.left = left + "px";
    //                     drag_Box.style.top = top + "px";
    //                 };
    //                 document.onmouseup = e => {
    //                       //鼠标弹起来的时候不再移动
    //                       document.onmousemove = null;
    //                      //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
    //                     document.onmouseup = null;
    //                 };
    //             };
    //         }
    //     }
    // }
}
</script>
<style scoped>
  .fa-ellipsis-h{
    color: #fff;
  }
  .serch-box{
    padding: 4px 3px;
    background-color: #AAB2BD;
    cursor: pointer;
  }
  .th{
  background: white;
  }
  /* .mo-header{
    cursor: move;
  } */
  .loading{
		z-index: 1000;
		font-size: 50px;
		position: absolute;
		color: rgb(138, 132, 132);
		top: 50%;
		left: 50%;
		/* transform: translate(-50%, -50%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
		text-align: center;
	}
  .cole{
    float: left;
  }
  .shou{
    float: right;
  }
  .modal-footer{
    display: block;
  }
  .inp-check{
    width: 20px;
    height: 20px;
  }
  .box-table{
    height: 500px;
    overflow: auto;
  }
  .table{
    /* margin-top: 10px; */
   }
  .form-control{
    margin-right: 10px;
    width: 140px;
    height: 30px;
    font-size: 13px;
   }
  .lab{
    margin-right: 10px;
   }
  .form-inline{
    font-size: 14px;
   }
  .sel1{
    /* width: 600px; */
    max-width: 100%;
    position: fixed;
    top: 150px;
    left: 0;
    z-index:999;
    /* transform: translate(-40%, -40%); */
    /* transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px)); */
  }
  .sel2{
     /* width: 600px; */
    max-width: 100%;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index:999;
    /* transform: translate(-40%, -40%); */
    transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
  }
  .t-body{
    /* height: 500px; */
    overflow: auto;
    font-size: 14px;
  }
  .text{
    margin: 0 auto;
    display: block;
    outline: none;
  }
  .modal-header{
	  background:#ebecf0;
	  height:40px
	}
  .modal-span1{
	  font-size:20px;
	  margin-top:-14px;
	  cursor:pointer
	}
  .modal-title1{
	  line-height:1px
	}
  .btn-default-close{
    color:#007bff;
	  font-size:12px;
	  border:1px solid #808080;
	  padding:4px;
    float: left;
    }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
    }
</style>