<template>
  <div class="sel" v-drag >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--请选择以下物品--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
      <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">item_id</label>
                  <input type="text" class="form-control" v-model="in_id" placeholder="请输入ID号">
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail2" class="lab">name</label>
                  <input type="email" class="form-control" v-model="in_name" placeholder="请输入商品名字">
                </div>
                <button type="button" class="btn btn-default-determine" @click="btn_query">查询</button>
            </form>
            <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>item_id</th>
                      <th>name</th>
                      <th>describe</th>
                      <th>选择</th>
                    </tr>
                  </thead>
                  <tbody class="tbody">
                      <tr v-for="(data,index) in res_data" :key="index" @click="select_list(data.item_id)">
                      <td>{{data.item_id}}</td>
                      <td>{{data.name}}</td>
                      <td>{{data.describe}}</td>
                      <td><input type="checkbox" :value="data.item_id" v-model="btn_slecte"></td>
                      </tr>
                  </tbody>
              </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel">取消</button>
        <button type="button" class="btn btn-default-determine" @click="confirm">确定</button>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  name:'sel',
  data () {
    return {
            selected: '',
            //接口数据
            res_data:'',
            //副本数据
            copy_data:'',
            //输入id数据
            in_id:'',
            //输入物品名数据
            in_name:'',
            //复选框中的value
            btn_slecte:[],
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
    box_fun:Object,
  },
  mounted () {  
    alert('selectItems')
     this.axios.get(this.api+this.box_fun.ACTION_DATA_URL+'/summary'+'?userInfo='+window.sessionStorage.getItem('userInfo')).then((res)=>{
         this.res_data=res.data;
         //副本
         this.copy_data=res.data;
     })
  },
  methods: {
    //查询按钮
    btn_query(){
      if(this.in_id==''&&this.in_name==''){
        this.res_data='';
      }else if(this.in_id!=''&&this.in_name!=''){
        this.res_data=this.copy_data.filter((item,index)=>{
          return item.item_id==this.in_id&&item.name==this.in_name
        })
      }else if(this.in_id!=''){
        this.res_data=this.copy_data.filter((item,index)=>{
          return item.item_id==this.in_id
        })
      }else if(this.in_name!=''){
        this.res_data=this.copy_data.filter((item,index)=>{
          return item.name==this.in_name
        })

      }
    },
    //点击列表选中复选框
    select_list(id){
     if(this.btn_slecte.length>0){
       this.btn_slecte.forEach((item,index)=>{
         if(item!=id){
           this.btn_slecte.push(id)
         }else{
           this.btn_slecte=this.btn_slecte.filter((item,index)=>{
             return item!=id
           })
         }
       })
     }else{
       this.btn_slecte.push(id)
     }
    },
    //取消按钮
     cancel(){
        this.btn_slecte=[];
     },
    //关闭按钮
     close(){
         this.$emit('close_select')
     },
     confirm(){
       var data=[];
       var obj={};
       if(this.btn_slecte.length>0){
         this.res_data.forEach((item,index)=>{
           this.btn_slecte.forEach((ite,i)=>{
             if(item.item_id==ite){
               data.push({item_id:ite,name:item.name})
              }   
           })
         })
       }else{
         data='';
       }
       this.$emit("selecte_btn",data)
     }
  },
  components: {
     
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
   .table{
       margin-top: 10px;
   }
   .tbody{
       font-size: 14px;
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
   .sel{
    position: fixed;
    top: 30%;
    left: 20%;
    min-width: 846px;
    z-index:999
    /* transform: translate(-40%, -40%); */
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
  .modal-header{
      cursor: move;
    }
</style>