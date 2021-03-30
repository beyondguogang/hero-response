<template>
  <div class="edit" v-drag>
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--修改密码--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span> 
      </div>
      <div class="modal-body">
            <div class="form-group">
                <label for="exampleInputPassword1">原始密码</label>
                <input type="password" class="form-control"  placeholder="Password" v-model="init_pas">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">新改密码</label>
                <input type="password" class="form-control"  placeholder="Password" v-model="new_pas">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">重复密码</label>
                <input type="password" class="form-control"  placeholder="Password" v-model="repeat_pas">
            </div>
      </div>
      <!-- 弹框 -->
      <div class="box_data" v-if="box_shows">
          <p>两次输入不相同</p>
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
  name:'edit',
  data () {
    return {
        //原始密码
        init_pas:'',
       //新改密码
       new_pas:'',
       //重复密码
       repeat_pas:'',
       //弹框数据
       box_shows:false
    }
  },
  mounted () {
      
  },
  methods: {
    //   确认按钮
     confirm(){
        this.axios.post(this.api+'/Login/change_pswd',this.qs.stringify({password_old:this.init_pas,password_new:this.new_pas}),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res=>{
                                console.log(res)
                            })
     },
    //  关闭图标
     close(){
         this.$emit('close_project')
     },
    //  取消按钮
    cancel(){
        this.init_pas='';
        this.new_pas='';
        this.repeat_pas='';
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
  .modal-header{
    cursor: move;
  }
  .modal-body{
      position: relative;
      font-size: 14px;
  }
  .box_data{
      font-size: 14px;
      color: #fff;
      position: absolute;
      top: 40%;
      left: 40%;
      background: #5f5f5f;
      height: 50px;
      line-height: 50px;
      padding:0 20px;
      opacity: .7;
  }
  .edit{
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
	margin-right: 393px;
    }
  .btn-default-determine{
    color:#007bff;
	font-size:12px;
	border: 1px solid rgb(128, 128, 128);
	padding: 4px;
    }
</style>