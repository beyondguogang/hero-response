let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data:function(){
    return{
        // rea:'a',
        // isItemList:false,
        // isItemList1:false,
        // isItemList2:false,
        // msg1:'',
        // msg:'',
        // bor:'1px solid #5a6268',
        // bor1:'1px solid #5a6268',
        // hide:'none',
        // hide1:'none',
        // disappear:'',
        // nameList:"",
        // namespace_id:"",
        // groupList:"",
        // group_id:"",
        // serverAddUrl:"",
        back:true,
        project_id:"",
        serverList:"",
        //弹框是否显示
        shows:false,
        //弹框内容
        verification:'',
        /*添加权限*/
        pointer:'true',
        opacity:1,
        /*修改权限*/
        serverFlag:false,
        edit_role:1,
        /*删除权限*/
        serverDelFlag:false,
        del_role:1,
        projectName:"巅峰战舰",
        userInfo:"",
        show_dis:false,
        // update_dis:false,
        show_tips_box:false,
        current_state:'没有添加权限',
        //是否显示数据
        t_body:true,
        //弹框的显示与隐藏
        spring:'none',
        //弹框标题
        item:'',
        opacity_edit:1,
        //编辑标志
        edit:false,
        //添加标志
        add_to:false,
        //数据主键id
        fld_record_id:null,
        //确认的标志
        true_flag:true,
    }
},
mounted:function(){
    //登录过期
    this.login_expired();
    //获取项目id
    this.item_id();
    //获取项目列表
    this.getServerList();
    //判断配置管理有没有增删改查权限
    this.getAuth("tbl_serverconf");
},
methods:{  
   /* change: function (e) {
        console.log(e);
        var controller=e.toElement.attributes.controller.value;
        
        if(controller=="sclc"){
                $(".subunit").css("display","none");
                $("#sclc").css("display","block"); 

        }
    },
    获取组列表
    getGroup:function(){
        axios
            .post(serverUrl+'/nacos/groupList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {

                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.groupList = response.data.groupList;
                    this.group_id = response.data.groupList[0].fld_id;
                }
               
            })
    },
    改变分组
    groupChange:function(e){
        var groupid=e.target.attributes.groupid.value;
        this.group_id=groupid;
        this.getServerList();
        $(".server-list-group1").attr("class","server-list-group2");
        e.target.attributes.class.value="server-list-group1";



    },
   fn:function(){
       this.a1=this.a;
    },
    fn3:function(){
        if (!this.isItemList) {
            this.isItemList=true
        }else{
            this.isItemList=false
        }
    },
    fn4:function(){
        if (!this.isItemList1) {
            this.isItemList1=true
        }else{
            this.isItemList1=false
        }
    },
    fn5:function(){
        if (!this.isItemList2) {
            this.isItemList2=true
        }else{
            this.isItemList2=false
        }

    },
    inp:function(){
        this.hide='none';
        this.bor='1px solid #5a6268';
        if(this.msg===''){
            this.hide='inline-block';
            this.bor='1px solid red';
        }
    },
    inp2:function(){
        this.hide1='none';
        this.bor1='1px solid #5a6268';
        if(this.msg1===''){
            this.hide1='inline-block';
            this.bor1='1px solid red';
        }
    },
    Empty:function(){
        if(this.msg===''&& this.msg1===''){
            this.hide='inline-block';
            this.bor='1px solid red';
            this.hide1='inline-block';
            this.bor1='1px solid red';
        }else if(this.msg===''&& this.msg1!==''){
            this.hide='inline-block';
            this.bor='1px solid red';
        }else if(this.msg!==''&&this.msg1===''){
            this.hide1='inline-block';
            this.bor1='1px solid red';
        }
        },
    group1:function(){
        this.disappear=true;
        this.back=''

    },
    getVal:function(){
        return this.disappear
    },*/
    item_id:function(){
        //获取项目id根据url地址
        var projectId=getUrlParam("projectId");
        //获取项目名根据url地址
        var projectName=unescape(getUrlParam("project"));
        this.projectName=projectName;
        this.project_id=projectId?projectId:1;
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
    //关闭弹框
    cross:function(){
        this.spring='none';
    },
    //获取数据列表
    getServerList: function () {  
        axios
            .post(serverUrl+'/sdk/usdkList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    // console.log(response)
                    this.serverList = response.data.usdkList;
                    //当添加时的页面地址及参数
                    // this.serverAddUrl="serverConfDetail.html?fld_project_id="+this.project_id;
                }
                
                
            })
        
    },   
    //服务删除
    serverDel:function(server){
        axios
            .post(serverUrl+'/sdk/usdkDel',{fld_record_id:server.fld_record_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    // alert(response.data.message);
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    this.getServerList();
                }
                
            })
    },
    //服务编辑跳转
    serverDetail:function(server){
             this.edit=true;
             this.add_to=false;
            // window.location.href = 'serverConfDetail.html?fld_id='+fld_id+'&&fld_project_id='+this.project_id;
            if(this.serverFlag==false){
                this.show_tips_box=true;
                window.setTimeout(()=>{
                    this.show_tips_box=false;
                },1000)
            }else{  
                this.$refs.projecturl.value=server.fld_product_url;
                this.$refs.projectcode.value=server.fld_productcode;
                this.$refs.projectkey.value=server.fld_productkey;
                this.fld_record_id=server.fld_record_id;
                this.item='修改项目';
                this.spring='block';
            }
    },
    //搜索
    search:function(){
        var fld_name=this.$refs.namevalue.value;
        // var fld_group=this.$refs.groupvalue.value;

        fld_name=fld_name.trim();
        // fld_group=fld_group.trim();
        axios
            .post(serverUrl+'/sdk/usdkSearch',{fld_project_id:this.project_id,fld_productcode:fld_name,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.$refs.namevalue.value='';
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.$refs.namevalue.value='';
                    this.serverList = response.data.usdkList;
                }
                
            })



    },  
    //获取表权限
    getAuth:function(table){
        axios
        .post(serverUrl+'/sdk/getUserAuth',
        {
            TBName:table,
            userInfo:this.userInfo
            
        })
        .then(response => {
            // console.log("response.data.rule",response.data.rule);  
            if(response.data.rule.Add==true){
                this.show_dis=true;
            }else{
                this.show_dis=false;
            };
            if(response.data.rule.View==false){
                this.t_body=false
            };
            if(response.data.rule.Update==false){
                this.edit_role=0.5;
            }else{
                this.serverFlag=true;
                this.edit_role=1;
            };
            if(response.data.rule.Del==false){
                this.del_role=0.5;
            }else{
                this.serverDelFlag=true;
                this.del_role=1;
            }
        })
    },
    //添加时的权限管理
    add:function(e){
        this.add_to=true;
        this.edit=false;
        e.preventDefault();
        if(this.show_dis==false){
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false;
            },1000)
        }else{
            // window.location.href=this.serverAddUrl;
        this.$refs.projecturl.value='';
        this.$refs.projectcode.value='';
        this.$refs.projectkey.value='';    
        this.item='新建项目';
        this.spring='block';
        }
       
        // this.axios.post(serverUrl+'/sdk/usdkAddOrUpdate',{})
    },
    //弹框确认按钮
    confirm: function(){
        this.true_flag=false;
        var fld_product_url=this.$refs.projecturl.value;
        var fld_productcode=this.$refs.projectcode.value;
        var fld_productkey=this.$refs.projectkey.value;
        if(this.add_to==true){
           axios.post(serverUrl+'/sdk/usdkAddOrUpdate',{fld_project_id:this.project_id,fld_product_url:fld_product_url,fld_productcode:fld_productcode,fld_productkey:fld_productkey,userInfo:this.userInfo}).then((res)=>{
            
            // this.cross();
            this.shows=true;
            this.verification=res.data.message;
            if(res.data.error==-1){                            
                setTimeout( ()=> {
                    this.shows=false;
                    this.true_flag=true;
                },1000)                        
                this.spring='none'
            }else{
                setTimeout( ()=> {
                    this.shows=false;
                    this.true_flag=true;
                },1000)
                this.getServerList();
                this.spring='none'
                }            
            }) 
        }else if(this.edit==true){
            axios.post(serverUrl+'/sdk/usdkAddOrUpdate',{fld_record_id:this.fld_record_id,fld_project_id:this.project_id,fld_product_url:fld_product_url,fld_productcode:fld_productcode,fld_productkey:fld_productkey,userInfo:this.userInfo}).then((res)=>{
                this.shows=true;
                this.verification=res.data.message;
                if(res.data.error==-1){                            
                    setTimeout( ()=> {
                        this.shows=false;
                        this.true_flag=true;
                    },1000)                        
                    this.spring='none'
                }else{
                    setTimeout( ()=> {
                        this.shows=false;
                        this.true_flag=true;
                    },1000)
                    this.getServerList();
                    this.spring='none'
                    }  
            }) 
        }
        
    },
    //取消按钮
    cross_q: function(){
        this.$refs.projecturl.value='';
        this.$refs.projectcode.value='';
        this.$refs.projectkey.value='';
    }
}

})