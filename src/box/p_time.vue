<template>
  <div class="hello" :style="{position:fliex,left:clientX-400+'px',top:clientY+20+'px'}">
      <!-- <div class="hello" :style="{transform:'translate('+clientX-400+'px,'+clientY+20+'px)'}"> -->
    <div id="orderTime" v-drag ></div>
  </div>
</template>
<script>
 import laydate from 'layui-laydate';

//  import "layui-laydate/dist/theme/default/laydate.css";
export default {
    name: "Time",
    data() {
        return {
            date: "",// 存储选择的日期
            isshow:false,
            a:null,
            fliex:'fixed',
            date:this.rule_data
        };
      },
      props:{
          rule_data:String,
          clientX:Number,
          clientY:Number
      },
   mounted() {
    //    alert('prr')
    //使用：执行一个laydate实例
        //获取输入框时间去掉时区字符
        this.date= this.date.replace(/UTC\+\d+/g,'');
        //当新建时如果为空那么默认显示当前的时间
        if(this.date=='N/A'){
            this.date=new Date().getTime()
        }
        this.isshow=true;
        this.a=laydate.render({
            elem: "#orderTime", // 指定元素
            //trigger: 'click',
            show: this.isshow,
            // closeStop: '',
            type: "datetime",
            // range: true, // 组件的类型：year,month,time···
            format: 'yyyy-MM-dd HH:mm:ss',// 设置显示格式
            position:'abolute',
            value: this.date,
            isInitValue: false,
            done: value => { // 点击确认执行的回调函数，会把当前选择的时间传入进来
              // 把选择的时间赋值给先前定义好的变量，显示在页面
              //value为当前选择的时间
              this.date = value;
              this.$emit('time_data',this.date)
            },
            //拿到这个时间的组件选择的值   当选择完毕时把组件也关闭    
        });
      },
      methods:{
       
      },
        directives: {
            drag: function(el) {
                let drag_Box = el; //获取当前元素
                // let dragBox = document.getElementsByClassName('modal-header')[0];
                drag_Box.onmousedown = e => {
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
};
</script>
<style scoped>
.layui-laydate {
    top: 100px;
    left: 100px;
}
#orderTime{
    font-size:0;
    overflow:hidden;
    /* position: fixed;
    top: 20% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; */
    /* overflow: visible;
	bottom: inherit;
	right: inherit;
	transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px))!important; */
}
.hello {
    display: inline-block;
    margin-left: 200px;
    margin-top: -100px;
    z-index:999;
    /* position: relative; */
   
}
.hello input {
    margin-left: -4px;
    width: 300px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
}
.layui-laydate .layui-this {
    background-color: #358ee7 !important;
}
</style>