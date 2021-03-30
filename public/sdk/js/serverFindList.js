
let vm=new Vue({
    el: '#app',
    components: {    
    },
    data:{
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
        // find_add:'',
        // codeMirror:"",
        back:true,
        serverFindList:"",
        project_id:"",
        shows:false,  /*弹框显示隐藏*/
        verification:'',/*弹框内容*/
        // mask:'',/*遮罩*/
        /*添加权限*/
        server_add:false,
        opacity:1,
        /*修改权限*/
        serverFlag:false,
        edit_role:1,
        /*删除权限*/
        serverDelFlag:false,
        del_role:1,
        projectName:'',
        userInfo:"",
        //提示框的显示隐藏
        show_tips_box:false,
        current_state:'没有添加权限',
         //是否显示数据
         t_body:true,
         //弹框显示隐藏
         spring:'none',
         //弹框标题
         item:null,
         //确认是否能点击
         true_flag:true,
         //添加的标志
         add_to:false,
         //编辑的标志
         edit:false,
         //主键id
         record_id:null,
},
mounted(){
    //登录过期
    this.login_expired();
    //获取项目id
    this.item_id();
    //项目数据列表
    this.getServerFindList();
    //判断服务管理有没有增删改查权限
    this.getAuth("tbl_serverfindconf");
},
methods:{
 /*   change: function (e) {
        var controller=e.toElement.attributes.controller.value;
        if(controller=="sclc"){
                $(".subunit").css("display","none");
                $("#sclc").css("display","block"); 

        }
    },           
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
                }
                
            })
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
    //项目id
    item_id(){
    var projectId=getUrlParam("projectId");
    this.project_id=projectId?projectId:1;
    var projectName=unescape(getUrlParam("project"));
    this.projectName=projectName;
    },
    //是否过期
    login_expired(){
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
    // 获取项目列表
    getServerFindList: function () {
        
        axios
            .post(serverUrl+'/sdk/gsdkList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    // alert(0)
                    this.serverFindList = response.data.gsdkList;
                }
                
                
            })

    },
    //添加编辑的确认按钮
    serverFindAdd:function(){
        this.true_flag =false;
        var fld_gameid=this.$refs.gameid.value;
        var fld_productcode=this.$refs.projectcode.value;
        var fld_appkey=this.$refs.appkey.value;
        if(this.add_to==true){
            this.$refs.gameid.value='';
            this.$refs.projectcode.value='';
            this.$refs.appkey.value='';
           axios
            .post(serverUrl+'/sdk/gsdkAddOrUpdate',{
                fld_project_id:this.project_id,
                fld_gameid:fld_gameid,
                fld_productcode:fld_productcode,
                fld_appkey:fld_appkey,
                userInfo:this.userInfo

            })
            .then(response => {
                this.spring='none';
                this.shows=true;
                this.verification=response.data.message;
                if(response.data.error==-1){
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000);
                    this.true_flag =true;
                }else{
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000);
                    this.true_flag =true;
                    this.findClose();
                    this.getServerFindList();
                }  
            }) 
        }else if(this.edit==true){
            axios
            .post(serverUrl+'/sdk/gsdkAddOrUpdate',{
                fld_record_id:this.record_id,
                fld_project_id:this.project_id,
                fld_gameid:fld_gameid,
                fld_productcode:fld_productcode,
                fld_appkey:fld_appkey,
                userInfo:this.userInfo

            })
            .then(response => {
                this.spring='none';
                this.shows=true;
                this.verification=response.data.message;
                if(response.data.error==-1){
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000);
                    this.true_flag =true;
                }else{
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000);
                    this.true_flag =true;
                    this.findClose();
                    this.getServerFindList();
                }  
            })   
        }
        

    },
    //删除
    serverFindDel:function(usdkList){
        axios
            .post(serverUrl+'/sdk/gsdkDel',{
                fld_record_id:usdkList.fld_record_id,
                userInfo:this.userInfo

            })
            .then(response => {
                this.shows=true;
                this.verification=response.data.message;
                
                setTimeout( ()=> {
                    this.shows=false;
                },2000)
                this.getServerFindList();
            })

    },
    //编辑
    serverFindInfoShow:function(usdkList){
        // window.location.href="serverFindDetail.html?fld_id="+fld_id+"&&fld_project_id="+this.project_id;
        this.add_to=false;
        this.edit=true;
        this.record_id=usdkList.fld_record_id;
        if(this.serverFlag==false){
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false
            },1000)
        }else{
            this.$refs.gameid.value=usdkList.fld_gameid;
            this.$refs.projectcode.value=usdkList.fld_productcode;
            this.$refs.appkey.value=usdkList.fld_appkey;
            this.item='编辑项目';
            this.spring='block';
        }
    },
    //改变分组
    groupChange:function(e){
        var groupid=e.target.attributes.groupid.value;
        this.group_id=groupid;
        this.getServerFindList();
        $(".server-list-group1").attr("class","server-list-group2");
        e.target.attributes.class.value="server-list-group1";
    },
    //搜索
    search: function () {
        var code_name=this.$refs.codevalue.value;
        // var fld_group=this.$refs.groupvalue.value;
            code_name=code_name.trim();
            // fld_group=fld_group.trim();
            axios
                .post(serverUrl+'/sdk/gsdkSearch',{fld_project_id:this.project_id,fld_productcode:code_name,userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        this.$refs.codevalue.value='';
                        this.show_tips_box=true;
                        this.current_state=response.data.message;
                        window.setTimeout(()=>{
                            this.show_tips_box=false;
                        },1000)
                        return false;
                    }else{
                        this.$refs.codevalue.value='';
                        this.serverFindList = response.data.gsdkList;
                    }
                    
                })
    },
//    添加服务
    findAdd:function (e) {
        e.preventDefault();
        this.add_to=true;
        this.edit=false;
        if(this.server_add==false){
            // alert(0)
            // console.log(this.current_state)
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false
            },1000)
        }else{
            this.$refs.gameid.value='';
            this.$refs.projectcode.value='';
            this.$refs.appkey.value='';
            this.item='新建项目';
            this.spring='block';
        }
        
    },
    //关闭弹框
    findClose:function () {
        this.spring='none';
    },
     //弹框取消按钮
     cross_q :function(){
        this.$refs.gameid.value='';
        this.$refs.projectcode.value='';
        this.$refs.appkey.value='';
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
                this.server_add=true;
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
    }
}
})
