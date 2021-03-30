<template>
  <div class="project" v-drag> 
  <div  role="document">
    <div class="modal-content">
      <div class="modal-header">
      <span class="modal-title">--选择发行包--</span>
      <span aria-hidden="true" class="modal-span" @click="close">&times;</span> 
      </div>
      <div class="modal-body" @scroll="table_cont">
              <!-- Table -->
              <table class="table table-hover text-nowrap" v-show="tabel_shows">
                  <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                    <tr>
                      <th v-for="(item,index) in heade_data" :key="index">{{item}}</th>
                      <th><input type="checkbox" v-model="btn_check" @change="btn_sel"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(list,index) in list_data" :key="index" @click="col_check(list.fld_record_id)"> 
                      <td v-for="(child_list,child_index) in show_data" :key="child_index">{{list[child_list]}}</td>
                      <td><input type="checkbox" v-model="check_data" :value="list.fld_record_id"></td> 
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
      tabel_shows:false,
      //加载状态
      anate:true,
      //头部复选框
      btn_check:false,
      //复选框的数组
      check_data:[],
      //获取的弹框数据
      list_data:null,
      //单选按钮
      //list_radio:'',
      //头部数据
      show_data:null,
      //计数
      count:0,
      heade_data:[],
      rows:null,
      //编辑时复选框中的数据
      btn_data:this.rule_data
    }
  },
  mounted(){
    alert('pro')
    console.log(window.sessionStorage.getItem('userInfo'))
    // console.log(this.check_data)
   
        switch (this.ppr_action){
          //当点击列表时选择列表项中的哪一项作为输入框的值
          case "SelectMoreClientPacketTank":
            this.count=0;
            break;
        }
        //自动请求根据action的数据接口返回需要的页面数据
        this.axios.get(this.api+this.box_fun.ACTION_COLUMNS_URL).then((res1)=>{
          // alert(1)
          //返回的头部数据
          this.rows=res1.data.FIELDS;
          //根据action请求数据，在利用前一个接口字段返回需要的接口数据    
          if(this.ppr_action=="SelectMoreClientPacketTank"){
            // alert(1)
             this.axios.get(this.api+this.box_fun.ACTION_DATA_URL+'?userInfo='+window.sessionStorage.getItem('userInfo')).then((res) =>{
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
        this.list_data=res.data.reverse();
        // this.list_data.forEach(item=>{console.log(item)})
        // this.anate=false;
    })
     }else if(this.ppr_action=="ServerGroupChooseTank"){
      //  alert(2)
          this.axios.get(this.api+this.box_fun.ACTION_DATA_URL+'?fld_type_id='+this.ppr_action_param+'&'+'userInfo='+window.sessionStorage.getItem('userInfo')).then((res) =>{
             //获取显示字段的数组
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
        this.list_data=res.data.reverse();
        this.list_data.forEach(item=>{console.log(item)})
        //编辑时获取输入框的值并在组选框中选中
         if(this.btn_data!=undefined){
      this.btn_data.split(';').forEach((item,index)=>{
        // console.log(item)
        this.list_data.forEach((ite,i)=>{
          if(ite.fld_group_id==item){
            this.check_data.push(ite.fld_record_id);
             this.btn_check=true;
          }
        })
        
      })
    }
        // this.anate=false;
    })
    }
     this.anate=false;
     this.tabel_shows=true;
        })
  },
  props:{
    ppr_action:String,
    ppr_action_param:String,
    box_fun:Object,
    rule_data:String,
  },
  methods:{
    //固定表头
    table_cont(e){
				// alert(1)
				this.tans_late=e.target.scrollTop;
				// console.log(e.target.scrollTop)
				},
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
        var data=';';
        if(this.ppr_action=="SelectMoreClientPacketTank"){
            this.check_data.forEach((item,index)=>{
            this.show_data.forEach((ite,i)=>{
               if(ite=="fld_package_name"){
                 this.list_data.forEach((i)=>{
                   if(i.fld_record_id==item){
                    //  if(i.fld_record_id!=undefined){
                     data+=i.fld_package_name+";"
                    //  }
                   }
                 })
                  } 
              })
          })
        }else if(this.ppr_action=="ServerGroupChooseTank"){
            this.check_data.forEach((item,index)=>{
            this.show_data.forEach((ite,i)=>{
              // console.log(item)
               if(ite=="fld_group_id"){
                 this.list_data.forEach((i)=>{
                   if(i.fld_record_id==item){
                     console.log(item)
                    //  alert(1)
                    // if(i.fld_record_id!=undefined){
                     data+=i.fld_group_id+";"
                    //  }
                   }
                 })
                  }
              })
          })
        };
        if(data==';'){
          data='';
        };
      this.$emit('channel_input_data',data)     
    },
    //头部复选框
    btn_sel(){
        if(this.btn_check==true){
          // alert(3)
            this.list_data.forEach((item,i)=>{
        if(this.check_data.length==0){
            this.check_data.push(item.fld_record_id);
        }else if(this.check_data.every((item,index)=>{return item!=item.fld_record_id})){//当数组中的每一项都不等于当前的value值时把值push进去
            this.check_data.push(item.fld_record_id);
        }
            })
            // console.log(this.check_data)
        }else{
            this.list_data.forEach((ite,i)=>{
                 this.check_data=this.check_data.filter((item,index)=>{//当数组中的某一项和当前点击的value项有相同的就移除出去
                return ite.fld_record_id!=item
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
  .th{
  background: white;
}
  .modal-header{
    cursor: move;
  }
  .modal-dialog{
    width: 100%;
  }
  .modal-body{
    max-height: 500px;
    overflow: auto;
    padding-top: 0;
  }
  .table>tbody>tr>td {
       
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
  .table>thead>tr>th {
    text-align: center;
  }
	.project{
    min-width: 846px;
    position: fixed;
    top: 30%;
    left: 20%;
    z-index:999
    /* transform: translate(-50%, -50%); */
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