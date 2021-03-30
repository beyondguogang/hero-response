<template>
<transition name="fade">
  <div class="project" :style="{transform:is_ie}" v-drag>
  <div role="document">
    <div class="modal-content" >
      <div class="modal-header">
        
         <span class="modal-title"><slot></slot></span>
      <!-- <span class="modal-title">{{value}}</span> -->
      <span aria-hidden="true" class="modal-span" @click="close">&times;</span>  
      </div>
      <div class="modal-body" @scroll="table_cont">
              <!-- Table -->
              <table class="table table-hover text-nowrap" >
                  <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                    <tr>
                      <th v-for="(item,index) in heade_data" :key="index">{{item}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(list,index) in list_data" :key="index" @click="col_radio(list.fld_record_id)"> 
                      <td v-for="(child_list,child_index) in show_data" :key="child_index">{{list[child_list]}}</td>
                      <td><input type="radio" v-model="list_radio" :value="list.fld_record_id"></td> 
                    </tr>
                  </tbody>
              </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel_selection">取消</button>
        <button type="button" class="btn btn-default-determine" @click="determine">确定</button>
      </div>
      <!-- 加载状态 -->
    <div class="loading" v-if="anate"><i class="fa fa-spin fa-spinner"></i></div>
    </div>
    
  </div>
  </div>
  </transition>
</template>
<script>
export default {
  name: 'Project',
  components: {
  },
  computed:{
  },
  data(){
    return {
      //距离头部的位置
      tans_late:'',
      //加载状态
      anate:true,
      //复选框的数组
      check_data:[],
      //获取的弹框数据
      list_data:null,
      //单选按钮
      list_radio:'',
      //头部数据
      show_data:null,
      //计数
      // count:0,
      heade_data:[],
      rows:null,
      //标题
      value:'',
      //是否是ie
      is_ie:false
    }
  },
  mounted(){
    // alert('ppr')
    //获取数据
      this.get_data();
      //判断是不是ie
      this.t_ie()
  },
  props:[
    'ppr_action',
    'ppr_action_param',
    'box_fun',
    'rule_data'
  ],
  methods:{
    t_ie(){
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.is_ie='translate(-50%, -50%)'
      }
    },
    get_data(){
        //自动请求根据action的数据接口返回需要的页面数据
        this.axios.get(this.api+this.box_fun.ACTION_COLUMNS_URL).then((res1)=>{
          // alert(0)
          //返回的头部数据
          // var a=new Date().getTime();
          // console.log(a)
          this.rows=res1.data.FIELDS;
          console.log(res1)
          //根据action请求数据，在利用前一个接口字段返回需要的接口数据    
          if(this.ppr_action=="selecttion_typeid"){
             this.axios.get(this.api+this.box_fun.ACTION_DATA_URL+'?userInfo='+window.sessionStorage.getItem('userInfo')).then((res) =>{
              //  alert(3)
             //获取显示字段的数组
        this.show_data=this.box_fun.ACTION_SHOW_FIELDS;
        // console.log(this.show_data)
        //遍历显示字段
        for(var i=0;i<this.show_data.length;i++){
          //遍历头部数据
              this.rows.forEach((item,index)=>{
                        if(item.Name==this.show_data[i]){
                              this.heade_data.push(item.Comment)
                        }
                      })
        }
        this.heade_data.push('选择');
        //当显示的字段没有时显示undefind
        this.show_data.forEach((item,index)=>{
          res.data.forEach((ite,i)=>{
            if(ite.fld_record_id==undefined){
              ite.fld_record_id=i
            };
           if(ite[item]==undefined){
             ite[item]='undefined'
            }
          })
        })
        this.list_data=res.data.reverse();
        this.anate=false;
        // console.log(this.list_data)
         if(this.rule_data!=undefined){
            this.list_radio=this.rule_data;
            this.list_data.forEach((item,index)=>{
              if(item.fld_short_name){
                 if(this.rule_data==item.fld_short_name){
                this.list_radio=item.fld_record_id
                };
              };
              
            })
        }
    })
     }else{
      //  alert(4)
      // var b=new Date().getTime();
      //     console.log(b)
      //     console.log(b-a)
          this.axios.get(this.api+this.box_fun.ACTION_DATA_URL+'?fld_type_id='+this.ppr_action_param+'&userInfo='+window.sessionStorage.getItem('userInfo')).then((res) =>{
             //获取显示字段的数组
          //    var d=new Date().getTime();
          // console.log(d-b)
          // console.log(c-b)  
        this.show_data=this.box_fun.ACTION_SHOW_FIELDS;
        //遍历显示字段
        for(var i=0;i<this.show_data.length;i++){
          //遍历头部数据
              this.rows.forEach((item,index)=>{
                        if(item.Name==this.show_data[i]){
                              this.heade_data.push(item.Comment)
                        }
                      })
        }
        this.heade_data.push('选择');
        this.show_data.forEach((item,index)=>{
          res.data.forEach((ite,i)=>{
             if(ite.fld_record_id==undefined){
              ite.fld_record_id=i
            };
           if(ite[item]==undefined){
             ite[item]='undefined'
            }
          })
        })
        this.list_data=res.data.reverse();
        this.anate=false;
        // var c=new Date().getTime();
        //   // console.log(c-d)
        //   console.log(c-b)
        if(this.rule_data!=undefined){
            this.list_radio=this.rule_data;
            this.list_data.forEach((item,index)=>{
              if(item.fld_short_name){
                if(this.rule_data==item.fld_short_name){
                this.list_radio=item.fld_record_id
                }
              };
              if(item.fld_group_id){
                 if(this.rule_data==item.fld_group_id){
                this.list_radio=item.fld_record_id
                }
              };
              if(item.fld_value){
                if(this.rule_data==item.fld_value){
                  this.list_radio=item.fld_record_id
                }
              }
            })
        }
    })
    }
        })  
    },
    //固定表头
    table_cont(e){
				// alert(1)
				this.tans_late=e.target.scrollTop;
				// console.log(e.target.scrollTop)
				},
    //点击tr元素选中radio标签
    col_radio(i){
        this.list_radio=i;
    },
    //点击关闭图标
    close(){
      this.$emit('close_project')
    },
    //点击取消
    cancel_selection(){
      this.list_radio='';
    },
    //点击确定
    determine(){
      var data='';
      this.list_data.forEach((item)=>{
        if(item.fld_record_id==this.list_radio){
          if(item.fld_short_name){
            data=item.fld_short_name
          };
          if(item.fld_group_id){
            data=item.fld_group_id
          };
          if(item.fld_value){
            data=item.fld_value
          }
        }
      })
      this.$emit('input_data',data) 
    },
  },
   directives: {
            drag: {inserted(el) {
                let drag_Box = el; //获取当前元素
                let dragBox = document.getElementsByClassName('modal-header')[0];
                dragBox.onmousedown = e => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - drag_Box.offsetLeft;
                    let disY = e.clientY - drag_Box.offsetTop;
                    document.onmousemove = e => {
                      console.log(1)
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        //移动当前元素
                        drag_Box.style.left = left + "px";
                        drag_Box.style.top = top + "px";
                    };
                    document.onmouseup = e => {
                          //鼠标弹起来的时候不再移动
                          document.onmousemove = null;
                         //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
                        document.onmouseup = null;
                    };
                };
            }
        }
   }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.th{
  background: white;
}
  .fa-spin{
	    -webkit-animation: fa-spin 1s infinite linear;
      animation: fa-spin 1s infinite linear;
	}
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
  .modal-header{
    cursor: move;
  }
  .modal-body{
    max-height: 500px;
    overflow: auto;
    padding-top: 0;
  }
  .table>tbody>tr>td {
    text-align: center;
  }
  .table>thead>tr>th {
    text-align: center;
  }
	.project{
    min-width: 846px;
    position: fixed;
    top: 50%;
    left: 50%;
    height: 500px;
    z-index:999;
    /* transform: translate(-50%, -50%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
  }
 .modal-header{
		background:#ebecf0;
		height:40px
	}
 .modal-span{
		font-size:20px;
		margin-top:-14px;
		cursor:pointer
	}
	.modal-title{
		line-height:1px
	}
  .btn-default-close{
    color:#007bff;
		font-size:12px;
		border:1px solid #808080;
		padding:4px;
		margin-right: 90%;
  }
  .btn-default-determine{
    color:#007bff;
		font-size:12px;
		border: 1px solid rgb(128, 128, 128);
		padding: 4px;
  }
  td{
    font-size: 12px;
  }
</style>