<template>
  <div class="sel" v-drag >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--auth role edit--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
      <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">项目</label>
                   <!-- @change="select_project" -->
                  <select class="form-control" v-model="selected" @change="select_project">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in proj" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">类型</label>
                   <!-- @change="select_type" -->
                  <select class="form-control" v-model="selected_type" @change="select_type">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in data_type" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">数据库</label>
                   <!-- @change="select_db" -->
                  <select class="form-control" v-model="selected_db" @change="select_db">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in data_base" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
            </form>
            <div class="box-table" @scroll="scroll_flag && table_cont($event)">
              <table class="table table-hover text-nowrap">
                    <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                    <tr>
                      <th><label>项目(工程)</label></th>
                      <th><label>类型</label></th>
                      <th><label>数据库</label></th>
                      <th><label>表(页面)</label></th>
                      <th><label>说明</label></th>
                      <th><label>浏览<input type="checkbox" id="browse" v-model="parent.browse" @change="cahnge_browse"></label></th>
                      <th><label>增加<input type="checkbox" v-model="parent.increase" @change="change_increase"></label></th>
                      <th><label>删除<input type="checkbox" v-model="parent.del" @change="change_del"></label></th>
                      <th><label>修改<input type="checkbox" v-model="parent.modify" @change="change_modify"></label></th>
                      <th><label>数据权限</label></th>
                    </tr>
                  </thead> 
                    <tbody class="t-body">
                    <tr v-for="(list,index) in res_data" :key="index">
                      <td>{{list.Project}}</td>
                      <td>{{list.Type}}</td>
                      <td>{{list.DBase}}</td>
                      <td>{{list.Table}}</td>
                      <td>{{list.Comment}}</td>
                      <td checkbox=true>
                        <input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'View'" v-model="child.child_browse" @click="change_child_browse(list,index)">
                      </td>
                      <td checkbox=true>
                        <input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Add'" v-if="show_data[index]" v-model="child.child_increase" @click="change_child_increase(list,index)">
                      </td>
                      <td checkbox=true>
                        <input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Del'" v-if="show_data[index]" v-model="child.child_del" @click="change_child_del(list,index)">
                      </td>
                      <td checkbox=true>
                        <input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Update'" v-if="show_data[index]" v-model="child.child_modify" @click="change_child_modify(list,index)">
                      </td>
                      <td>
                        <span v-if="list.Type=='TABLE'">
                          <input type="text" v-model="input_data[list.Project+list.DBase+list.Table]" disabled class="data-input">
                        <span class="serch-box" @click="serch_box(list,index)">
                        <i class="fa fa-ellipsis-h fa-1x "></i></span></span></td>  
                    </tr>   
                  </tbody>                                                       
              </table>
            </div>   
      </div>
      <div class="modal-footer">
        <div class="cole">
          <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel">取消</button>
        </div>                 
        <div class="shou">
          <button type="button" class="btn btn-default-determine" @click="confirm">确定</button>
        </div> 
        <!-- 加载状态 -->
      <div class="loading" v-if="anate"><i class="fa fa-spin fa-spinner"></i></div>
      </div>
    </div>
  </div>
  <!-- 遮罩层 -->
  <div style="width: 100%;height: 100%;background: #e2e2e2;color: #e2e2e2;position: fixed;top: 0; left:0;opacity: .5;" v-if="flag"></div>
  <!-- 数据权限组件 -->
  <!-- <data-permission-list v-if="true" :columns="columns" :data_list="data_list"></data-permission-list> -->
  <data-permission-list v-if="flag" :project="project" :db="db" :table="table" :in_data="input_data[index]" @close_box='close_box' @confirm_data="confirm_data"></data-permission-list>
  </div>
</template>
<script>
import dataPermissionList from "../plug/data_permission.vue"
export default {
  name:'sel',
  data () {
    return {
            inde:null,
            //输入框中的数据
            input_data:[],
            flag:false,
            //公共的用户信息
            userInfo:'',
            //选择框的响应数据
            selected:'',
            //数据类型响应数据
            selected_type:'',
            //数据库响应数据
            selected_db:'',
            //返回的数据数组
            res_data:'',
            //项目列表选择框筛选需要的res_data副本
            res_data_repeat:'',
            //选择项目
            proj:['ALL'],
            //数据类型
            data_type:['所有'],
            //列表数据库
            data_base:['ALL'],
            //是否显示复选框
            show_data:[],
            //将复选框和输入框中的数据按规则写入对象
            obj:{},
            //父复选框对象
           parent:{
            //浏览
            browse:'',
            //增加
            increase:'',
            //删除
            del:'',
            //修改
            modify:''
            },
            //子复选框对象
           child:{
            //子浏览
            child_browse:[],
            //子增加
            child_increase:[],
            //子删除
            child_del:[],
            //子修改
            child_modify:[]
           },
           //复选框对应的值
           btn_value:{
             browse_value:'',
             increase_value:'',
             del_value:'',
             modify_value:''
           },
           child_rule_data:this.rule_data,
           //加载状态
           anate:true,
            //距离头部的位置
           tans_late:'',
           //三点的头部数据
           //columns:null,
           //三点的数据列表
           //data_list:null,
           //每条数据需获取的项目名
           project:null,
           //每条数据的数据库名
           db:null,
           //每条数据的表
           tabel:null,
           //是否执行滚动事件
           scroll_flag:false
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
    item_fun:String,
    rule_data:String
  },
  components:{
    dataPermissionList
  },
 computed: {
  },
  created(){
    this.get_data();
  },
  mounted () {
    // alert('authRoleEdit')
    this.chrome_implement();
  },
  methods: {
    //是否执行scroll_flag事件
    chrome_implement(){
      if(window.navigator.userAgent.indexOf("Chrome") > -1){
        this.scroll_flag=true;
      }
    },
    //提交选中项
    confirm_data(data){
      //index为点击时的列表索引
      // console.log(data)
      this.input_data[this.index]=data;
      // this.input_data[this.project+this.db+this.tabel]=data
      this.flag=false;
    },
    //关闭弹框组件
    close_box(){
      this.flag=false
    },
    //当点击三个点时显示组件弹框
    serch_box(item_a,index){
      // console.log(item_a)
      //把index赋值给局部data中的index这样其他的实例就能直接访问
      
      //获取总数据对应的索引的project属性db属性tabel属性提供给其子组件使用
      this.project=this.res_data[index].Project;
      this.db=this.res_data[index].DBase;
      this.table=this.res_data[index].Table;
      // console.log(this.res_data_repeat)
      // this.res_data_repeat.forEach((item,index)=>{
        if(this.project==item_a.Project&&this.db==item_a.DBase&&this.table==item_a.Table){
          // alert(0)
          // console.log(index)
          this.index=item_a.Project+item_a.DBase+item_a.Table;
          // this.index=item.Project+item.DBase+item.Table
        }
      // })
      // console.log(this.project,this.db,this.table)
      //加载状态
      window.setTimeout(()=>{
        this.flag=true;
      },0);
      this.flag=false;
    },
    //固定表头
    table_cont(e){
				// alert(1)
				this.tans_late=e.target.scrollTop;
				// console.log(e.target.scrollTop)
				},
    //复选框中选中的项目
    btn_chected(){
      //如果有数据执行
      if(this.child_rule_data!=''){
        this.child_rule_data=JSON.parse(this.child_rule_data);
        //获取对象中所有的属性（数组形式的key）
        let arrProject=Object.keys(this.child_rule_data);
        //第一次循环项目结果
        if(arrProject.length>0){
          arrProject.forEach((item,index_y)=>{
          //获取所有的type的key
            var arrType=Object.keys(this.child_rule_data[item]);          
            arrType.forEach((item1,index)=>{
              //获取所有的website的key
              var arrWebsite=Object.keys(this.child_rule_data[item][item1])
              arrWebsite.forEach((item2,index)=>{
                //获取所有的table的key
                var arrPage=Object.keys(this.child_rule_data[item][item1][item2])
                arrPage.forEach((item3,index_m)=>{
                 //获取所有的选中复选框的key
                  var arrViue=Object.keys(this.child_rule_data[item][item1][item2][item3])
                  if(arrViue.length==0){
                    this.child.child_browse.push(item+item1+item2+item3);
                    this.parent.browse=true;
                  }else{
                    arrViue.forEach((item4,index1)=>{
                      //  console.log(item4)
                      if(item1=='DBase'){
                        let item1_1='TABLE'
                        if(item4=="View"){
                          this.child.child_browse.push(item+item1_1+item2+item3+item4);
                          this.parent.browse=true;
                        };
                        if(item4=="Add"){
                          this.child.child_increase.push(item+item1_1+item2+item3+item4);
                          this.parent.increase=true;
                        };
                        if(item4=="Del"){
                          this.child.child_del.push(item+item1_1+item2+item3+item4);
                          this.parent.del=true;
                        };
                        if(item4=="Update"){
                          this.child.child_modify.push(item+item1_1+item2+item3+item4);
                          this.parent.modify=true;
                        };
                        if(item4=='RecordId'){
                          this.res_data.forEach((item_m,index)=>{
                            if(item_m.Table==item3){
                              return this.input_data[item_m.Project+item_m.DBase+item_m.Table]=this.child_rule_data[item][item1][item2][item3][item4];
                            }
                        })
                     
                        }
                      }else{
                        if(item4=="View"){
                          this.child.child_browse.push(item+item1_1+item2+item3+item4);
                          this.parent.browse=true;
                        };
                        if(item4=="Add"){
                          this.child.child_increase.push(item+item1_1+item2+item3+item4);
                          this.parent.increase=true;
                        };
                        if(item4=="Del"){
                          this.child.child_del.push(item+item1_1+item2+item3+item4);
                          this.parent.del=true;
                        };
                        if(item4=="Update"){
                          this.child.child_modify.push(item+item1_1+item2+item3+item4);
                          this.parent.modify=true;
                        }
                      }
                    })
                  }
                })
              })
            })
          })
        }
      }else{
        return false
      }
      
    },
   //浏览总复选框  
    cahnge_browse(){
      //如果总的浏览复选框为选中状态
      if(this.parent.browse==true){
        this.res_data_repeat.forEach((i,index)=>{
          //定义包好项目 类型 数据库和浏览权限的拼接字符串
          var view=i.Project+i.Type+i.DBase+i.Table+"View";
          //便利所有的子浏览复选框如果有一项不等于view返回true
          let sum=this.child.child_browse.every((item)=>{
              return item!=view
            });
            //如果子复选框没有选中项执行
          if(this.child.child_browse.length==0){
            this.child.child_browse.push(view);
            
          }else if(sum){//如果有没有选中的项目执行
            this.child.child_browse.push(view);
          }
        })
      }else{//如果总的浏览复选框为不选中状态
          //把所有跟view相同的元素过滤除去（清空选中项）
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"View";
            this.child.child_browse=this.child.child_browse.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //增加总复选框
    change_increase(){
      if(this.parent.increase==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Add";
          let sum=this.child.child_increase.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_increase.length==0){
            this.child.child_increase.push(view);
          }else if(sum){
            this.child.child_increase.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Add";
            this.child.child_increase=this.child.child_increase.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //删除总复选框
    change_del(){
      if(this.parent.del==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Del";
          let sum=this.child.child_del.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_del.length==0){
            this.child.child_del.push(view);
            
          }else if(sum){
            this.child.child_del.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Del";
            this.child.child_del=this.child.child_del.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //修改总复选框
    change_modify(){
      if(this.parent.modify==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Update";
          let sum=this.child.child_modify.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_modify.length==0){
            this.child.child_modify.push(view);
            
          }else if(sum){
            this.child.child_modify.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Update";
            this.child.child_modify=this.child.child_modify.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //浏览复选框
     change_child_browse(i,ind){
       //判断是不是ie浏览器
       if(!(!!window.ActiveXObject || "ActiveXObject" in window)){
           //把每条数据的项目类型数据库表和相应权限的字段拼接成字符串
          var view=i.Project+i.Type+i.DBase+i.Table+"View";
           //判断child_browse中的每一项是否都返回true
          let sum=this.child.child_browse.every((item,index)=>{
            return item==view
          })
          if(this.child.child_browse.length==0){
            this.child.child_browse.push(view);
          }else if(sum){//如果child_browse没有view则push进数组
            this.child.child_browse.push(view);
          }else{//如果child_browse有view则filter出数组
            this.child.child_browse=this.child.child_browse.filter((item,index)=>{
              return view!=item;
            })
          };
          //如果child_browse中有选中项则总复选框也选中
          if(this.child.child_browse.length>0){
            this.parent.browse=true;
          };
          //如果child_browse中没有选中项则总复选框也取消选中
          if(this.child.child_browse.length==0){
            this.parent.browse=false

           }
        }else{
           //如果child_browse中有选中项则总复选框也选中
          if(this.child.child_browse.length>0){
            this.parent.browse=true;
          };
          //如果child_browse中没有选中项则总复选框也取消选中
          if(this.child.child_browse.length==0){
            this.parent.browse=false
          }
        } 
     },
    //增加复选框
    change_child_increase(i){
    if(!(!!window.ActiveXObject || "ActiveXObject" in window)){
        var view=i.Project+i.Type+i.DBase+i.Table+"Add";
        let sum=this.child.child_increase.every((item,index)=>{
          return item!=view
        })
        if(this.child.child_increase.length==0){
          this.child.child_increase.push(view);
        }else if(sum){
          this.child.child_increase.push(view);
        }else{
          this.child.child_increase=this.child.child_increase.filter((item,index)=>{
            return view!=item;
          })
        };
        if(this.child.child_increase.length>0){
          this.parent.increase=true;
        };
        if(this.child.child_increase.length==0){
          this.parent.increase=false
        }
      }else{
        if(this.child.child_increase.length>0){
          this.parent.increase=true;
        };
        if(this.child.child_increase.length==0){
          this.parent.increase=false
        }
      }
    },
    //删除复选框
    change_child_del(i){
      if(!(!!window.ActiveXObject || "ActiveXObject" in window)){
        var view=i.Project+i.Type+i.DBase+i.Table+"Del";
        let sum=this.child.child_del.every((item,index)=>{
          return item!=view
        })
        if(this.child.child_del.length==0){
          this.child.child_del.push(view);
        }else if(sum){
          this.child.child_del.push(view);
        }else{
          this.child.child_del=this.child.child_del.filter((item,index)=>{
            return view!=item;
          })
        };
        if(this.child.child_del.length>0){
          this.parent.del=true;
        };
        if(this.child.child_del.length==0){
          this.parent.del=false
        }
      }else{
        if(this.child.child_del.length>0){
          this.parent.del=true;
        };
        if(this.child.child_del.length==0){
          this.parent.del=false
        }
      }
    },
    //修改复选框
    change_child_modify(i){
      if(!(!!window.ActiveXObject || "ActiveXObject" in window)){
        var view=i.Project+i.Type+i.DBase+i.Table+"Update";
        let sum=this.child.child_modify.every((item,index)=>{
          return item!=view
        })
        if(this.child.child_modify.length==0){
          this.child.child_modify.push(view);
        }else if(sum){
          this.child.child_modify.push(view);
        }else{
          this.child.child_modify=this.child.child_modify.filter((item,index)=>{
            return view!=item;
          })
        };
        if(this.child.child_modify.length>0){
          this.parent.modify=true;
        };
        if(this.child.child_modify.length==0){
          this.parent.modify=false
        }
      }else{
        if(this.child.child_modify.length>0){
          this.parent.modify=true;
        };
        if(this.child.child_modify.length==0){
          this.parent.modify=false
        }
      }
    },
    //获取数据
     get_data(){
       this.axios.get(this.api+'/Admin/AuthRules'+'?userInfo='+window.sessionStorage.getItem('userInfo')).then((res)=>{
        this.res_data=res.data.rules;
        //数据的副本
        this.res_data_repeat=res.data.rules;
        //加载状态
        this.anate=false;
          this.res_data.forEach((item,index)=>{
            this.show_data.push(true);
            //判断是否显示复选框
            if(item.Type=='PAGE'){
                this.show_data[index]=false;
            };
            //把项目选项添加到proj中
            if(this.proj.indexOf(item.Project)==-1){
                this.proj.push(item.Project)
            };
            //把类型选项添加到data_type中
            if(this.data_type.indexOf(item.Type)==-1){
               this.data_type.push(item.Type)
            };
            //把数据库选项添加到data_base中
            if(this.data_base.indexOf(item.DBase)==-1&&item.DBase!=''){
               this.data_base.push(item.DBase)
            }
          });
          //加载数据后如果是编辑时把权限对象中的值添加到复选框和输入框中
          if(this.child_rule_data!=undefined){
            this.btn_chected();
          }
        })  
     },
    //取消按钮
     cancel(){
         this.parent.browse='';
         this.parent.increase='';
         this.parent.del='';
         this.parent.modify='';
         this.child.child_browse=[];
         this.child.child_increase=[];
         this.child.child_del=[];
         this.child.child_modify=[];
         this.input_data=[];
     },
     //确认按钮
     //当选择好每一项时保存在变化的数组中，想办法保存在不变的数组中，不变的数组意味着索引不同，当渲染时根据不变的数组索引拿出数据，渲染的时候只能用动态的数据数组
     //当点击复选框的时候根据不变的数据数组也就是当新建时选择好后索引是不变数组的索引
     confirm(){
       if(this.parent.browse==''&&this.parent.increase==''&&this.parent.del==''&&this.parent.modify==''){
        //  alert(1)
        //  return '{}'
         var data=undefined;
          this.$emit('auth_data',data)
       }else{   
         //根据不变数据数组拿到选中的数据项（当每一条数据有选中项的时候就执行一次dataTypeCom函数）
            this.res_data_repeat.forEach((ite,index)=>{
            if(this.child.child_browse.length>0||this.child.child_increase.length>0||this.child.child_del.length>0||this.child.child_modify.length>0){
              //因为复选框的值是当前点击项的索引所以判断所有的复选框是否有值如果有的话那么就返回true    
              //判断child_browse里面是否有相应的值如果有则返回true
            let browse=this.child.child_browse.some((item)=>{
               var view=ite.Project+ite.Type+ite.DBase+ite.Table+"View";
               return view==item
             });
             //判断child_increase里面是否有相应的值如果有则返回true
            let increase=this.child.child_increase.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Add";
              return view==item
            });
            //判断child_del里面是否有相应的值如果有则返回true
            let del=this.child.child_del.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Del";
              return view==item
            });
            //判断child_modify里面是否有相应的值如果有则返回true
            let modify=this.child.child_modify.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Update";
              return view==item
            });
            //如果有一项是true就执行
            if(browse||increase||del||modify){
              //如果Type类型为TABLE那么将此字符替换
                if(ite['Type']=="TABLE"){
                  var Type='DBase';
                        //如果有浏览权限
                        if(browse){ this.dataTypeCom(ite,Type,"View",this.input_data[ite.Project+ite.DBase+ite.Table]);
                        };
                        //如果有增加权限
                        if(increase){
                            this.dataTypeCom(ite,Type,"Add",this.input_data[ite.Project+ite.DBase+ite.Table]);
                        };
                        //如果有修改权限
                        if(modify){
                            this.dataTypeCom(ite,Type,"Update",this.input_data[ite.Project+ite.DBase+ite.Table]);                
                        };
                        //如果有删除权限
                        if(del){
                            this.dataTypeCom(ite,Type,"Del",this.input_data[ite.Project+ite.DBase+ite.Table]);                  
                        };
                        
                    }else if(ite['Type']=="PAGE"){//如果Type是PAGE则只有浏览权限（只是页面不是数据）
                        var Type="PAGE"; 
                        if(browse){
                          this.dataTypeCom(ite,Type,"View");
                          }
                  }       
                }else{//如果没有浏览增加修改删除权限也可选择显示那条数据
                  var Type='DBase';
                  if(this.input_data[ite.Project+ite.DBase+ite.Table]){
                          // alert(1)
                           this.dataTypeCom(ite,Type,null,this.input_data[ite.Project+ite.DBase+ite.Table]);
                        }
                };      
            };    
          });
          //将权限对象赋值给变量
          var data=JSON.stringify(this.obj);
          //通过$emit方法触发父组件auth_data函数并把权限对象当作参数传入
          this.$emit('auth_data',data)
        }
     },
     //点击确认时只要有复制的权限就会执行此函数来定义一个权限对象
     dataTypeCom(item,Type,tblDo,data){
                  //如果对象的Project为undefined
                  if(this.obj[item.Project]==undefined){   
                    this.obj[item.Project]={};
                    if(this.obj[item.Project][Type]==undefined){//如果Project的Type为undefined
                      this.obj[item.Project][Type]={};
                      //判断数据库是否为空（如果为空跳过数据库直接以表为属性）
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){ //如果表为undefined先赋值为空对象
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true;
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data
                        }else{//如果表已经是对象了则直接赋值
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data  
                        }
                        //如果数据库不为空那么把数据库字段定义为对象  
                      }else{
                        //如果数据库是undefined（有数据库的话）
                        if(this.obj[item.Project][Type][item.DBase]==undefined){//如果以数据库key为属性名时没有值则直接赋值为空对象                  
                          this.obj[item.Project][Type][item.DBase]={};  
                          //如果表字段为空那么定义为对象                       
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){//如果表为undefined则赋值为空对象并把对应的权限赋值为true
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }                           
                          }else{//如果已经是对象了就直接赋值
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          } 
                          //如果数据库不是undefined
                        }else{//如果以数据库key为属性名时是对象直接赋值                     
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){//判断有没有Tabel属性
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }else{//有Tabel属性直接赋值
                             if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                        
                        }
                      }   
                      //如果类型不等于undefined                  
                    }else{
                      
                      //如果数据库等于空
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data;              
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data;
                        }                                            
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                            
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                            
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                         
                        }
                      }                      
                    }
                    //如果对象的Project不为undefined
                  }else{//如果对象的Project不为undefined
                  // alert(1)
                    if(this.obj[item.Project][Type]==undefined){
                      this.obj[item.Project][Type]={};
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data;                        
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data;      
                        }                                               
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                          
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                          
                        }
                      }
                    }else{
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true;  
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data;         
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true;  
                          // this.obj[item.Project][Type][item.Table]['RecordId']=data; 
                        }                                              
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={};
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }else{
                            if(tblDo==null){
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }else{
                              this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                              this.obj[item.Project][Type][item.DBase][item.Table]['RecordId']=data;
                            }
                          }                         
                        }
                      }                     
                    }
                  }      
     },
    //关闭按钮
     close(){
         this.$emit('close_project')
     },
     //查询数据
     filter_data(){
       //根据条件显示不同的数据当有三个选择框时一共是
       this.res_data=this.res_data_repeat.filter((item,index)=>{
         this.show_data=[];
         //当是全部数据时返回全部对象
         if((this.selected=='ALL'||this.selected=="")&&(this.selected_type=='所有'||this.selected_type=='')&&(this.selected_db=='ALL'||this.selected_db=='')){
           return item
           //当项目为筛选结果根据结果显示数据
         }else if(item.Project==this.selected&&(this.selected_type=='所有'||this.selected_type=='')&&(this.selected_db=='ALL'||this.selected_db=='')){
           return item.Project==this.selected
           //当项目为筛选结果并且类型为筛选结果根据结果显示数据
         }else if(item.Project==this.selected&&item.Type==this.selected_type&&(this.selected_db=='ALL'||this.selected_db=='')){   
           return item.Project==this.selected&&item.Type==this.selected_type
           //当项目为筛选结果并且类型为筛选结果并且数据库为筛选结果根据结果显示数据
         }else if(item.Project==this.selected&&item.Type==this.selected_type&&this.selected_db==item.DBase){
            return item.Project==this.selected&&item.Type==this.selected_type&&item.DBase==this.selected_db
            //当类型为筛选结果根据结果显示数据
         }else if((this.selected=='ALL'||this.selected=="")&&(this.selected_db=='ALL'||this.selected_db=='')&&item.Type==this.selected_type){
           return item.Type==this.selected_type
           //当数据库为筛选结果根据结果显示数据
         }else if((this.selected=='ALL'||this.selected=="")&&(this.selected_type=='所有'||this.selected_type=='')&&item.DBase==this.selected_db){
           return item.DBase==this.selected_db
           //当类型为筛选结果并且数据库为筛选结果根据结果显示数据
         }else if((this.selected=='ALL'||this.selected=="")&&(this.selected_type==this.selected_type)&&(item.DBase==this.selected_db)){
           return item.Type==this.selected_type&&item.DBase==this.selected_db
         }
       });
       //判断复选框是否显示
        this.show_data.push(true);
        //遍历数据根据类型判断是否显示哪个复选框
        this.res_data.forEach((item,index)=>{
          if(item.Type=='PAGE'){
            this.show_data[index]=false;
          }else{
            this.show_data[index]=true;
          }
         });
     },
     //选择的项目
     select_project(){
      this.filter_data();
     },
     //选择类型
     select_type(){
       this.filter_data();
     },
     //选择数据库
     select_db(){
       this.filter_data();
     }
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
  .data-input{
    width: 158px;
    border: 1px solid #ced4da;
  }
  .fa-ellipsis-h{
    color: #fff;
  }
  .serch-box{
    padding: 4px 3px;
    background-color: #AAB2BD;
    cursor: pointer;
  }
  .th{
  background: white;
  }
  .modal-header{
    cursor: move;
  }
  .loading{
		z-index: 1000;
		font-size: 50px;
		position: absolute;
		color: rgb(138, 132, 132);
		top: 50%;
		left: 50%;
		/* transform: translate(-50%, -50%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
		text-align: center;
	}
  .cole{
    float: left;
  }
  .shou{
    float: right;
  }
  .modal-footer{
    display: block;
  }
  .inp-check{
    width: 20px;
    height: 20px;
  }
  .box-table{
    height: 500px;
    overflow: auto;
  }
  .table{
    /* margin-top: 10px; */
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
    width: 80%;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index:999;
    /* transform: translate(-40%, -40%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
    transform: translate(-50%,-50%);
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
  }
  .t-body{
    height: 0;
    overflow: auto;
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
    float: left;
    }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
    }
</style>