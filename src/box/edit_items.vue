<template>
  <div class="items" v-drag>
  <div  role="document">
    <div class="modal-content">
      <div class="modal-header">
      <span class="modal-title">--编辑物品--</span>
      <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
      <div class="modal-body">
              <!-- Table -->
            <form class="form-inline">
                <button type="button" class="btn btn-default-determine" @click="sel_item">选择物品</button>
            </form>
              <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th v-for="(item,index) in heade_data" :key="index">{{item}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(list,index) in del_data" :key="index"> 
                      <td v-for="(child_list,child_key,child_index) in list" :key="child_index"><input type="text" :value="child_list"></td>
                      <td><input type="text" v-model="in_count" ></td>
                      <td><button class="btn_del" @click="btn_del(list)">删除</button></td> 
                    </tr>                   
                  </tbody>
              </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel_selection">取消</button>
        <button type="button" class="btn btn-default-determine" @click="determine">确定</button>
        
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  name: 'items',
   data(){
    return {
      //头部复选框
      btn_check:false,
      //复选框的数组
      check_data:[],
      //获取的弹框数据
      list_data:null,
      //单选按钮
      list_radio:'',
      //头部数据
      show_data:null,
      //计数
      count:0,
      //头部数据
      heade_data:['物品ID','物品名','数量','操作'],
      //移除数据项
      del_data:this.selecte_data,
      //编辑的数据
      in_count:1,
      //编辑时返回的数据的副本
      edit_data:this.rule_data
    }
  },
  components: {

  },
  computed:{
 
  },
  mounted () { 
    alert('editItems')
    if(this.rule_data!=null){
      this.editBoxData()
    }
  },
  props:{
    //编辑框中的数据
      rule_data:String,
    //选中的列表
      selecte_data:Array
  },
  methods: {
    //编辑时的数据项显示在此组件中
      editBoxData(){
        this.edit_data=JSON.parse(this.edit_data);
        this.edit_data.forEach((item,index)=>{
        this.del_data.push({item_id:item.ID,name:item.Name});
        this.in_count=item.Count;
        })
        
      },
    //删除数据列表
      btn_del(list){
        this.del_data=this.del_data.filter((item,index)=>{
          return item!=list
        })
      },
    //关闭弹框
      close(){
        this.$emit("close_edit")
      },
      //取消按钮
      cancel_selection(){
        this.$emit("close_edit")
      },
      //确认按钮
      determine(){
        var data=[];
        this.del_data.forEach((item,index)=>{
          data.push({ID:item.item_id,Name:item.name,Count:this.in_count})
        })
        data=JSON.stringify(data);
        this.$emit("sbmit_data",data)
      },
      // 选择物品组件
      sel_item(){
        this.$emit("sel_goods");
      }
  },
   directives: {
            drag: {inserted(el) {
                let drag_Box = el; //获取当前元素
                let dragBox = document.getElementsByClassName('modal-header')[0];
                console.log(drag_Box)
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
  input{
    outline: none;
  }
  .btn_del{
    background-color: #d43f3a;
    color: #fff;
    border: none;
    outline: none;
  }
  .text-nowrap{
      margin-top: 10px;
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
	.items{
    position: fixed;
    top: 30%;
    left: 20%;
    min-width: 846px;
    z-index:999
    /* transform: translate(-50%, -50%); */
  }
 .modal-header{
		background:#ebecf0;
		height:40px;
    cursor: move;
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