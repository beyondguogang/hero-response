<template>
<div class="container-fluid list">
			<div class="row no-gutters shop">
				<div class="col-lg-12 col-md-12 table-responsive">
  <div class="sel" >
    <div role="document">
    <div class="modal-content">
      <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">模板ID</label>
                  <input type="text" class="form-control"  placeholder="UserID" v-model="input_id">
                </div>
                <button type="button" class="btn btn-default-determine" @click="select_mail">选择邮件模板</button>
            </form>
            <div class="input_box">
                <div class="form-group">
                  <label for="exampleInputEmail2" >说明</label>
                  <input type="text" class="form-control inp"  placeholder="RoleNumID" v-model="input_explain">
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail2" >邮件标题</label>
                  <input type="text" class="form-control inp"  placeholder="RoleID" v-model="mail_title">
                </div>
            </div>

            <div class="multi-box">
                <div class="form-group">
                  <p >邮件内容</p>
                  <textarea name="" id="" cols="100" rows="10" class="form-control  multi-line-input" v-model="mail_content"></textarea>
                </div>
                <div class="form-group">
                  <p >附件</p>
                  <textarea name="" id="" cols="100" rows="10" class="form-control multi-line-input" v-model="input_enclosure"></textarea>
                </div>
                <div class="form-group">
                   <p class="p-target">目标角色</p>
                  <button type="button" class="btn btn-default-determine query-role" @click="cearch_role">查询角色</button>
                  <textarea name="" id="" cols="100" rows="10" class="form-control multi-line-input"></textarea>   
                </div>
                <div class="form-group">
                  <p >发送完成角色</p>
                  <textarea name="" id="" cols="100" rows="10" class="form-control multi-line-input"></textarea>
                </div>
            </div>
           <form class="form-inline">
               <div class="form-group">
                  <label for="exampleInputName2" class="lab">客户端邮件模板</label>
                  <input type="text" class="form-control"  placeholder="UserID" v-model="mail_temp">
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">保留时间</label>
                  <input type="text" class="form-control"  placeholder="UserID" v-model="retention_time">
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">删除方式</label>
                  <input type="text" class="form-control"  placeholder="UserID" v-model="deletion_method">
                </div>
                <button type="button" class="btn btn-default-determine query-role">发送邮件</button>
           </form>
      </div>
    </div>
  </div>
</div>
			</div>
		</div>
    <!-- 邮件模板组件 -->
  <send-mail v-if="mail_shows" @close_project="close" @input_data="input_data"></send-mail>
  <select-service v-if="role" @close_project="close_project"></select-service>
  </div>
</template>
<script>
import sendMail from "../plug/mail_template.vue";
import selectService from "../box/select_service.vue"
export default {
  name:'sel',
  data () {
    return {
      //邮件模板组件
      mail_shows:false,
      //角色查询组件
      role:false,
      //模板id
      input_id:'',
      //说明框
      input_explain:'',
      //邮件标题
      mail_title:'',
      //邮件内容
      mail_content:'',
      //附件
      input_enclosure:'',
      //邮件模板
      mail_temp:'',
      //保留时间
      retention_time:'',
      //删除方式
      deletion_method:''
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
  },
  components: {
     sendMail,
     selectService
  },
  mounted () {
   
  },
  methods: {
    //取消按钮
     cancel(){
         this.selected='';
     },
     //确认按钮
     confirm(){

     },
    //关闭按钮
     close_project(){
         this.role=false
     },
     close(){
         this.mail_shows=false
     },
     //选择邮件模板、
     select_mail(){
         this.mail_shows=true;
     },
     //角色查询
     cearch_role(){
       this.role=true;
     },
     //填充邮件内容
     input_data(id,explain,title,content,enclosure,temp,time,del){
      //  console.log(id)
      this.input_id=id;
      this.input_explain=explain;
      this.mail_title=title;
      this.mail_content=content;
      this.input_enclosure=enclosure;
      this.mail_temp=temp;
      this.retention_time=time;
      this.deletion_method=del;
      this.mail_shows=false;
     }
  },
  
  
}
</script>
<style scoped>
  .modal-content{
    border: none;
   }
  .modal-body{
    font-size: 14px;
   }
  .table{
    margin-top: 10px;
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
	  margin-right: 93%;
    }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
    }
  .list {
		padding-top: 100px;
		padding-right: 20px;
    z-index:999
	}
  .inp{
    width: 100%;
  }
  .input_box{
    font-size: 14px;
    margin-top: 10px;
  }
  .multi-line-input{
    width:100%;
  }
  .p-target{
    display: inline-block;
  }
  .query-role{
    margin-left: 10px;
  }
</style>