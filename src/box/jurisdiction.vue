<template>
  <div class="project" v-drag> 
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      <span class="modal-title">--user roles--</span>
      <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
      <div class="modal-body">
              <!-- Table -->
              <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th v-for="(item,index) in head_data" :key="index">{{item}}</th>
                      <th><input type="checkbox" v-model="btn_check" @change="btn_sel"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(list,index) in list_data" :key="index" @click="col_check(list.Name)"> 
                      <td v-for="(child_list,child_index) in list" :key="child_index">{{child_list}}</td>
                      <td><input type="checkbox" v-model="check_data" :value="list.Name"></td> 
                    </tr>                   
                  </tbody>
              </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel_selection">取消</button>
        <button type="button" class="btn btn-default-determine" @click="determine">确定</button>
      </div>
      <div class="loading" v-if="anate"><i class="fa fa-spin fa-spinner"></i></div>
    </div>
  </div>
  </div>
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
       //加载状态
      anate:true,
      head_data:['角色名','说明'],
      btn_check:'',
      check_data:[],
      //数据列表
      list_data:null,
      show_data:[],
      btn_data:this.rule_data
    }
  },
  mounted(){
    // alert('jurisdiction')
    console.log(Boolean(this.rule_data))
    if(Boolean(this.btn_data)){
      
        this.check_data=JSON.parse(this.btn_data);
        this.btn_check=true;
    }
    
    this.axios.get(this.api+'/Admin/UserAuthRoles'+'?userInfo='+window.sessionStorage.getItem('userInfo')).then(res=>{
      this.list_data=res.data.roles_list
      console.log(this.list_data)
      this.list_data.forEach(item=>{
        //获取数据里的对象
        this.show_data.push(item)
      })
       this.anate=false;
    })
  },
  props:{
    ppr_action:String,
    ppr_action_param:String,
    rule_data:String
  },
  methods:{
    //点击tr元素选中checkbox标签
     col_check(i){
       //当复选框绑定的数组长度为0时把value值push进数组
        if(this.check_data.length==0){
            this.check_data.push(i);
        }else if(this.check_data.every((item,index)=>{return item!=i})){//当数组中的每一项都不等于当前的value值时把值push进去
            this.check_data.push(i);
        }else{
             this.check_data=this.check_data.filter((item,index)=>{//当数组中的某一项和当前点击的value项有相同的就移除出去
                return i!=item
            });
        }
        //当数组长度大于0时总按钮选中
        if(this.check_data.length>0){
            this.btn_check=true;
        };
        //当数组长度等于0时总按钮取消选中
        if(this.check_data.length==0){
            this.btn_check=false;
        };
    },
    //点击关闭图标
    close(){
      this.$emit('close_project')
    },
    //点击取消
    cancel_selection(){
      this.check_data=[];
      this.btn_check='';
    },
    //点击确定
    determine(){
        var data=[];
          this.check_data.forEach((item,index)=>{
                data.push(item)
          })
        data=JSON.stringify(data)
      this.$emit('input_data',data) 
    },
    //头部复选框
    btn_sel(){
        if(this.btn_check==true){
            this.list_data.forEach((item,i)=>{
        if(this.check_data.length==0){
            this.check_data.push(item.Name);
        }else if(this.check_data.every((item,index)=>{return item!=item.Name})){//当数组中的每一项都不等于当前的value值时把值push进去
            this.check_data.push(item.Name);
        }
            })
        }else{
            this.list_data.forEach((ite,i)=>{
                 this.check_data=this.check_data.filter((item,index)=>{//当数组中的某一项和当前点击的value项有相同的就移除出去
                return ite.Name!=item
            });
            })
        }
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
  .modal-header{
    cursor: move;
  }
  .modal-body{
    max-height: 500px;
    overflow: auto;
  }
  .table>tbody>tr>td {
     text-align: center;
  } 
  .table>thead>tr>th {
      text-align: center;
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
	.project{
    position: fixed;
    top: 50%;
    left: 50%;
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
		margin-right: 393px;
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