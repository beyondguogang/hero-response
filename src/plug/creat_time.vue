<template >
  <div class="hello" :style="{position:fixed,left:clientX-400+'px',top:clientY+110+'px'}">
    <div id="orderTime" v-drag ></div>
  </div>
</template>
<script>
 import laydate from 'layui-laydate';
 import "layui-laydate/dist/theme/default/laydate.css";
export default {
    name: "Time",
    data() {
        return {
            fixed:'fixed',
            date: "",// 存储选择的日期
            isshow:false,
            a:null,
        };
      },
     // props:{isshow_time:Boolean},
     props:{
          clientX:Number,
          clientY:Number,
          date_time:String
      },
      mounted() {
        // console.log(this.clientX,this.clientY)
       //alert(2)
    //使用：执行一个laydate实例
        this.isshow=true;
        this.a=laydate.render({
            elem: "#orderTime", // 指定元素
            //trigger: 'click',
             show: this.isshow,
            // closeStop: '',
            type: "datetime", // 组件的类型：year,month,time···
　　　　　　 format: 'yyyy-MM-dd HH:mm:ss',// 设置显示格式
            position:'abolute',
            theme: 'molv',

            // ready: date=>{
            //      console.log(this.value);
            //       //得到初始的日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            //  },
             value: this.date_time,
             isInitValue: false,
            done: value => { // 点击确认执行的回调函数，会把当前选择的时间传入进来
              // 把选择的时间赋值给先前定义好的变量，显示在页面
              //value为当前选择的时间
              //alert(2)
              // console.log(value)
              this.date = value;
              // console.log(this.date)
              //this.$emit('close_project')
               this.$emit('time_data',this.date);
            },
            //拿到这个时间的组件选择的值   当选择完毕时把组件也关闭    
        });
        //  console.log(this.a)
      },
      methods:{
       
      },
       directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - dragBox.offsetLeft;
                    let disY = e.clientY - dragBox.offsetTop;
                    document.onmousemove = e => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        //移动当前元素
                        dragBox.style.left = left + "px";
                        dragBox.style.top = top + "px";
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
#orderTime{
  /* position: fixed; */
  /* top: 36% !important; */
  /* left: 25% !important; */
  /* display: none; */
  font-size:0;
  overflow:hidden;
}
.hello {
  /* position: fixed; */
  direction: none;
  display: inline-block;
  margin-left: 200px;
  margin-top: -100px;
  z-index:999
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