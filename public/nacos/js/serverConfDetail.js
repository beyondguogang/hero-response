let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data:{
        // b:null
        //设置coodMirror
      codeMirror:"",
      //获取项目id
      fld_project_id:"",
    //   fld_namespace_id:"",
    //分组id
      fld_group_id:"",
      //列表id
      fld_id:"",
      //详情数据
      serverInfo:"",
      //分组数据
      groupList:"",
      shows:false,  /*弹框显示隐藏*/
      verification:'',/*弹框内容*/
      //页面地址
      urlreturn:'',
      //用户信息
      userInfo:"",
      //是否点击发布
      release:false,
      //透明度
      release_role:1,
      //弹框显示
      show_tips_box:false,
      //弹框内容
      current_state:'没有添加权限',
      //组
      fld_group:'',
      group_id:null,
},
created(){
    // alert(0)
    // this.fld_group='group'
},
mounted() {
    //登录过期
    this.login_expired();
    //获取页面
    this.item_id();
    //设置codeMirror
    this.code_mirror();
    //获取分组
    this.getGroup();
    //控制输入框的宽高
    this.codeMirror.setSize('','550px');
    //判断配置管理有没有增删改查权限
    this.getAuth("tbl_serverconf");
},
methods:{
    //设置codeMirror
    code_mirror:function(){
        this.codeMirror=CodeMirror.fromTextArea(document.getElementById("code_textarea"),{
            lineNumbers: true,
            identUnit:4,
            styleActiveLine:true,
            theme:'blackboard',
            matchBrackets: true,
            mode: "javascript"
    
        });
    },
    //根据id获取页面
    item_id:function(){
        this.fld_project_id=getUrlParam("fld_project_id");
    if(getUrlParam("fld_id")==false){
        // this.fld_namespace_id=getUrlParam("fld_namespace_id");
    }else{
        this.fld_id=getUrlParam("fld_id");
        this.getServerInfo();
    }
   this.urlreturn= 'serverList.html?projectId='+this.fld_project_id;
    },
    //是否登录过期
    login_expired:function(){
        this.userInfo=sessionStorage.getItem('userInfo');
        var user,time,startTime;
            user=sessionStorage.getItem('userInfo');
            time=parseInt(new Date().getTime()/1000);
            startTime=sessionStorage.getItem('startTime');
            this.userInfo=user;
        // }
        if(user==""||user==null ||user==undefined ||user=='null'){
            window.location.href="/login";
            return false;
        }
        
        
        var timeCha=(time-startTime)-(30*60);
        if(timeCha>0){
            sessionStorage.setItem('user',null);
            window.location.href="/login";
            return false;
        }else{
            startTime=sessionStorage.setItem('startTime',time);
        }
    },
    //添加数据
    serverAdd:function(){
        var key=this.$refs.datakey.value;
        var value=this.codeMirror.getValue();
        var des=this.$refs.datades.value;
        key=key.trim();
        this.groupList.forEach((item,index)=>{
            // alert(0)
            if(item.fld_name==this.fld_group){
                this.group_id=item.fld_id
                // console.log(this.group_id)
            }
        })
        if(key===''){
            this.shows=true;
            this.verification='ID不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }else if(value==''){
            this.shows=true;
            this.verification='配置内容不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }
        else if(this.fld_id!==""){
            var data={
                fld_id:this.fld_id,
                fld_project_id:this.fld_project_id,
                // fld_namespace_id:this.fld_namespace_id,
                // fld_group_id:$("#in-seven3").val(),
                fld_group_id:this.group_id,
                fld_key:key,
                fld_value:value,
                fld_des:des,
                userInfo:this.userInfo
            }
            

        }else{

            var data={
                fld_project_id:this.fld_project_id,
                // fld_group_id:$("#in-seven3").val(),
                fld_group_id:this.group_id,
                fld_key:key,
                fld_value:value,
                fld_des:des,
                userInfo:this.userInfo
            };
           
        }
        axios
        .post(serverUrl+'/nacos/sAddOrUpdate',
            data)
        .then(response => {
            // alert(2)
            if(response.data.error==0){
                this.shows=true;
                this.verification=response.data.message;
                setTimeout( ()=> {
                    this.shows=false;
                    console.log(this.fld_project_id)
                    window.location.href = '/nacos/serverList.html?projectId='+this.fld_project_id;
                },2000)
            }else{
                this.shows=true;
                this.verification=response.data.message;
                setTimeout( ()=> {
                    this.shows=false;
                },2000)
                return false
            }



        })
        

        
        

    },
    //获取服务详情
    getServerInfo:function(){
        axios
            .post(serverUrl+'/nacos/serverconfInfo',
            {
                fld_id:this.fld_id,
                userInfo:this.userInfo
                
            })
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.serverInfo=response.data.serverInfo;
                    console.log(this.serverInfo)
                    this.fld_project_id=this.serverInfo.fld_project_id;
                    // this.fld_namespace_id=this.serverInfo.fld_namespace_id;
                    this.$refs.datakey.value=this.serverInfo.fld_key;
                    this.$refs.datades.value=this.serverInfo.fld_des;
                    this.fld_group_id=this.serverInfo.fld_group_id;
                    this.fld_group=this.serverInfo.fld_group;
                    // console.log(this.fld_group)
                    $("#selected-"+this.fld_group_id).attr("selected","selected");
                    this.codeMirror.setValue(this.serverInfo.fld_value);
                }
                
                
            })

    },
    //获取分组
    getGroup:function(){
        // alert(0)
        axios
            .post(serverUrl+'/nacos/groupList',{fld_project_id:this.fld_project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    // console.log(response.data.message)
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.groupList = response.data.groupList;
                    console.log(response.data.groupList)
                    
                }
                
            })
    },
    //获取表权限   
    getAuth:function(table){
        axios
        .post(serverUrl+'/nacos/getUserAuth',
        {
            TBName:table,
            userInfo:this.userInfo
            
        })
        .then(response => {
            // console.log("response.data.rule",response.data.rule);   
            if(response.data.rule.Update==true){
                this.release=true;
                this.release_role=1;
            }else{
                this.release=false;
                this.release_role=0.5;
            }
        })
    }

}
})