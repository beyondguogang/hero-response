<template>
  <div class="edit" :style="{transform:is_ie}" v-drag>
    <div  role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--请输入内容--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span> 
      </div>
      <div class="modal-body">
             <textarea class="text" name="" id="" cols="100" rows="10" v-model="text_info"></textarea>
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
        text_info:'',
    }
  },
  props:{
    rule_data:String,
  },
  mounted () {
    alert('edit')
      this.edit();
      this.t_ie()
  },
  methods: {
     t_ie(){
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.is_ie='translate(-50%, -50%)'
      }
    },
    //编辑时的内容
    edit(){
      this.text_info=this.rule_data
    },
    //   确认按钮
     confirm(){
         this.$emit('edit_confirm', this.text_info)
     },
    //  关闭图标
     close(){
         this.$emit('close_project')
     },
    //  取消按钮
    cancel(){
        this.text_info='';
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
    font-size: 12px;
  }
  .edit{
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 846px;
    z-index:999;
    /* transform: translate(-40%, -40%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
  }
  .text{
    margin: 0 auto;
    display: block;
    outline: none;
    width: 100%;
    border: 1px solid #5b5d63;
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
</style>