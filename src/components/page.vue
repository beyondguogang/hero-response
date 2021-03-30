<template>
<div class="container-fluid list">
			<div class="row no-gutters shop">
				<div class="col-lg-12  col-md-12 table-responsive">
  <div class="sel" >
    <div role="document">
    <div class="modal-content">
      <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">分区</label>
                  <select class="form-control" v-model="selected">
                      <option disabled value="">请选择</option>
                      <option v-for="(data,index) in res_data" :key="index">{{data.fld_group_name+'['+data.fld_group_id+']'}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">UserID</label>
                  <input type="text" class="form-control"  placeholder="UserID">
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail2" class="lab">RoleNumID</label>
                  <input type="email" class="form-control"  placeholder="RoleNumID">
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail2" class="lab">RoleID</label>
                  <input type="email" class="form-control"  placeholder="RoleID">
                </div>
                <div class="form-group ">
                  <label for="exampleInputEmail2" class="lab">角色名</label>
                  <input type="email" class="form-control" placeholder="角色名">
                </div>
                <button type="button" class="btn btn-default-determine">查询</button>
            </form>
            <table class="table table-hover table-bordered  text-nowrap">
                  <thead>
                    <tr>
                      <th>UserID</th>
                      <th>RoleNumID</th>
                      <th>RoleID</th>
                      <th>RoleName</th>
                      <th>Level</th>
                      <th>VIP</th>
                      <th>创建时间</th>
                      <th>登陆时间</th>
                      <th>充值累计</th>
                      <th>钻石</th>
                      <th>Online</th>
                    </tr>
                  </thead>
                  <tbody>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                      <td>9</td>
                      <td>a</td>
                      <td>b</td>             
                  </tbody>
              </table>
      </div>
    </div>
  </div>
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
            res_data:'',
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
  },
  mounted () {
    //alert(0)  
    this.axios.get(this.api+'/AnyQuery/Tank/Launcher/tbl_group').then((res)=>{
        console.log(res.data)
        this.res_data=res.data;
    })
  },
  methods: {
    //取消按钮
     cancel(){
         this.selected='';
     },
     confirm(){},
    //关闭按钮
     close(){
         this.$emit('close_project')
     },
  },
  components: {
     
  },
  
}
</script>
<style scoped>
   .modal-content{
     border: none;
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
    .sel{
    /* position: fixed;
    top: 30%;
    left: 20%; */
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
</style>