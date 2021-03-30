<template>
  <div class="mail" v-drag >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--邮件条件--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
       <div class="modal-body">
              <!-- Table -->
              <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Min</th>
                      <th>Max</th>
                    </tr>
                  </thead>
                  <tbody> 
                        <tr>
                          <td>版本号</td>
                          <td><input v-model="min_version" type="text"></td>
                          <td><input v-model="max_version" type="text"></td>
                        </tr>
                        <tr>
                          <td>可领取版本号</td>
                          <td><input v-model="min_rewardversion" type="text"></td>
                          <td><input v-model="max_rewardversion" type="text"></td> 
                        </tr>
                        <tr>
                          <td>等级</td>
                          <td><input v-model="min_level" type="text"></td>
                          <td><input v-model="max_level" type="text"></td>
                        </tr>
                        <tr>
                          <td>VIP</td>
                          <td><input v-model="min_vip" type="text"></td>
                          <td><input v-model="max_vip" type="text"></td>
                        </tr>
                        <tr>
                          <td>创建时间</td>
                          <td><input type="text" class="in-btn" v-model="date_one"><button class="line" @click="time_on">...</button></td>
                          <td><input type="text" class="in-btn" v-model="date_tow"><button class="line" @click="time_in">...</button></td>
                         </tr>
                        <tr>
                          <td>拥有载具</td>
                          <td><input v-model="own_vehicle_id" type="text" class="single-line"></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>拥有装备</td>
                          <td><input v-model="own_equip_id" type="text" class="single-line"></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>拥有成员</td>
                          <td><input v-model="own_member_id" type="text" class="single-line"></td>
                          <td></td>
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
  <creat-time v-if="time_shows" @time_data="time_data" :clientY="clientY" :clientX="clientX" :date_time="date_time"></creat-time>
  </div>
</template>
<script>
import creatTime from "../plug/creat_time.vue"
export default {
  name:'mail',
  data () {
    return {
      clientX:null,
      clientY:null,
      //取消标志
      selected: '',
      //组件显示隐藏
      time_shows:false,
      date_time:null,
      //时间值最小
      date_one:'',
      //时间值最大
      date_tow:'',
      flag:false,
      //版本号最小
      min_version:'',
      //版本号最大
      max_version:'',
      //可领取版本号最大
      min_rewardversion:'',
      //可领取版本号最大
      max_rewardversion:'',
      //等级最小
      min_level:'',
      //等级最大
      max_level:'',
      //vip最小
      min_vip:'',
      //vip最大
      max_vip:'',
      //拥有载具
      own_vehicle_id:'',
      //拥有装备
      own_equip_id:'',
      //拥有成员
      own_member_id:'',
      //输入框数据
      btn_data:this.rule_data
    }
  },
  components:{
     creatTime
  },
  props: {
    rule_data:String
  },
  mounted () {
    alert('mailConditions')
    if(this.rule_data!=undefined){
      var obj=JSON.parse(this.btn_data);
      if(obj.MinVersion!=''){
        this.min_version=obj.MinVersion;
      };
      if(obj.MaxVersion!=''){
        this.max_version=obj.MaxVersion;
      };
      if(obj.RewardVersionMin!=''){
        this.min_rewardversion=obj.RewardVersionMin;
      };
      if(obj.RewardVersionMax!=''){
        this.max_rewardversion=obj.RewardVersionMax;
      };
      if(obj.LevelMin!=''){
        this.min_level=obj.LevelMin;
      };
      if(obj.LevelMax!=''){
        this.max_level=obj.LevelMax;
      };
      if(obj.VipLevelMin!=''){
        obj.min_vip=obj.VipLevelMin;
      };
      if(obj.VipLevelMax!=''){
        this.max_vip=obj.VipLevelMax;
      };
      if(obj.CreateTimeMin!=''){
        this.date_one=obj.CreateTimeMin;
      };
      if(obj.CreateTimeMax!=''){
        this.date_tow=obj.CreateTimeMax;
      };
      if(obj.OwnVehicleID!=''){
        this.own_vehicle_id=obj.OwnVehicleID;
      };
      if(obj.OwnEquipID!=''){
        this.own_equip_id=obj.OwnEquipID;
      };
      if(obj.OwnMemberID!=''){
        this.own_member_id=obj.OwnMemberID;
      };
    }
  },
  methods: {
    //取消按钮
     cancel(){
          this.date_one='';
          this.date_tow='';
     },
     //确定按钮
     confirm(){
       var obj={};
      if(this.min_version!=''){
        obj.MinVersion=this.min_version;
      };
      if(this.max_version!=''){
        obj.MaxVersion=this.max_version;
      };
      if(this.min_rewardversion!=''){
        obj.RewardVersionMin=this.min_rewardversion;
      };
      if(this.max_rewardversion!=''){
        obj.RewardVersionMax=this.max_rewardversion;
      };
      if(this.min_level!=''){
        obj.LevelMin=this.min_level;
      };
      if(this.max_level!=''){
        obj.LevelMax=this.max_level;
      };
      if(this.min_vip!=''){
        obj.VipLevelMin=obj.min_vip;
      };
      if(this.max_vip!=''){
        obj.VipLevelMax=this.max_vip;
      };
      if(this.date_one!=''){
        obj.CreateTimeMin=this.date_one;
      };
      if(this.date_tow!=''){
        obj.CreateTimeMax=this.date_tow;
      };
      if(this.own_vehicle_id!=''){
        obj.OwnVehicleID=this.own_vehicle_id;
      };
      if(this.own_equip_id!=''){
        obj.OwnEquipID=this.own_equip_id;
      };
      if(this.own_member_id!=''){
        obj.OwnMemberID=this.own_member_id;
      };
      var data=JSON.stringify(obj)
      this.$emit('input_data',data)
     },
    //关闭按钮
     close(){
         this.$emit('close_project')
     },
    //时间选择组件
     time_on(){
       this.flag=true;
       this.time_shows=false;
       this.clientX=event.clientX;
       this.clientY=event.clientY;
       this.date_time=this.date_one;
       setTimeout(()=>{this.time_shows=true},(0))
     },
     time_in(){
       this.flag=false;
       this.time_shows=false;
       this.clientX=event.clientX;
       this.clientY=event.clientY;
       this.date_time=this.date_tow
       setTimeout(()=>{this.time_shows=true},(0))
     },
     time_data(date){
        if(this.flag==true){
          this.date_one=date;
        }else{
           this.date_tow=date;
        }
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
     font-size: 14px;
   }
   .line{
     outline: none;
     border: none;
     padding: 3px;
     background: #777;
   }
   input{
     outline: none;
   }
   .single-line{
     width: 205%;
   }
   .in-btn{
     width: 84%;
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
    .mail{
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
	  margin-right: 84%;
    }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
    }
</style>