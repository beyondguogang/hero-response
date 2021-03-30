<template>
  <div class="sel" v-drag >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--选择服务器分组--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
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
            <table class="table table-hover text-nowrap">
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
            res_data:'',
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
  },
  mounted () {
    alert('selectService')
    this.axios.get(this.api+'/AnyQuery/Tank/Launcher/tbl_group').then((res)=>{
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
    position: fixed;
    top: 30%;
    left: 20%;
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
	  margin-right: 93%;
  }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
  }
</style>