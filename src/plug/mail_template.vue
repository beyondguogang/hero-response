<template>
  <div class="project" v-drag>  
  <div  role="document">
    <div class="modal-content">
      <div class="modal-header">
      <span class="modal-title">--选择邮件模板--</span>
      <span aria-hidden="true" class="modal-span" @click="close">&times;</span>  
      </div>
      <div class="modal-body">
          <div class="load">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw" v-if="anate"></i>
          <span class="sr-only">Loading...</span>
          </div>
              <!-- Table -->
              <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th v-for="(item,index) in heade_data" :key="index">{{item}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(list,index) in res_data" :key="index" @click="col_radio(list.fld_record_id)"> 
                      <td>{{list.fld_record_id}}</td>
                      <td>{{list.fld_declare}}</td>
                      <td>{{list.fld_title}}</td>
                      <td><input type="radio" v-model="list_radio" :value="list.fld_record_id"></td> 
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
  name: 'Project',
  components: {
  },
  computed:{
  },
  data(){
    return {
      //头部数据
      heade_data:['ID','说明','标题'],
      //内容数据
      res_data:'',
      //单选框
      list_radio:'',
      anate:true,
     
    }
  },
  mounted(){
    this.axios.get(this.api+"/AnyQuery/Tank/Activity/tbl_mail_template?fld_deleted=0&"+'userInfo='+window.sessionStorage.getItem('userInfo')).then(res=>{
                             console.log(res.data)
                            this.res_data=res.data.reverse();
                            this.anate=false
						})
   
  },
  props:{
   
  },
  methods:{
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
      this.res_data.forEach((item,index)=>{
           if(this.list_radio==item.fld_record_id){
                this.$emit('input_data',item.fld_record_id,item.fld_declare,item.fld_title,item.fld_content,item.fld_items,item.fld_template,item.fld_retention,item.fld_deleted) 
        }
      })
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
    position: relative;
    max-height: 500px;
    overflow: auto;
  }
  .table>tbody>tr>td {
    text-align: center;
  }
  .table>thead>tr>th {
    text-align: center;
  }
  .load{
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #007bff;
   }
  .project{
    position: fixed;
    top: 30%;
    left: 20%;
    z-index:999
    /* transform: translate(-49%, -49%); */
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
		margin-right: 480px;
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