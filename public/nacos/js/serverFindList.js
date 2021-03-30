
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
       // mask:'',/*遮罩*/
        // nameList:"",
        // namespace_id:"",
         // serverAddUrl:"",
        // codeMirror:"",
        //正序
		isup: 'itup',
		//倒序
		isdown: 'itdown',
        //分组列表
        groupList:"",
        //分组id
        group_id:"",
         //显示数据
         back:true,
         //项目列表
         serverFindList:"",
         //项目id
         project_id:"",
        //添加弹框
        find_add:'',
        shows:false,  /*弹框显示隐藏*/
        verification:'',/*弹框内容*/
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
         tera:'sd',
         //遮罩
         view_show:false,
},

mounted(){
    //获取页面
    this.item_id();
    //判断过期
    this.login_expired();
    //获取项目列表
    this.getServerFindList();
    //获取分组
    this.getGroup();
    //判断服务管理有没有增删改查权限
    this.getAuth("tbl_serverfindconf");
},

methods:{
   /*     fn:function(){
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
},
change: function (e) {
        var controller=e.toElement.attributes.controller.value;
        if(controller=="sclc"){
                $(".subunit").css("display","none");
                $("#sclc").css("display","block"); 

        }
    },*/
    //根据id获取页面
    item_id:function(){
        var projectId=getUrlParam("projectId");
        this.project_id=projectId?projectId:1;
        var projectName=unescape(getUrlParam("project"));
        this.projectName=projectName;
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
    //获取项目列表
    getServerFindList: function () {
        axios
            .post(serverUrl+'/nacos/serverFindList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.serverFindList = response.data.serverFindList;
                }
                
                
            })

    },
    //服务发现添加
    serverFindAdd:function(){
        this.$refs.datavalue.value='';
        var fld_name = this.$refs.serverFindName.value;
        var fld_project_id = this.project_id;
        // var fld_namespace_id = this.namespace_id;
        var fld_group_id = $("#groupValue").val();
        // var fld_istpt = this.$refs.serverFindYz.value;
        var fld_des = this.tera;
        // console.log(this.tera)
        fld_name=fld_name.trim();
        // fld_istpt=fld_istpt.trim();
        if(fld_name===''){
            this.shows=true;
            this.verification='服务名称不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }
        // else if(!/^[0-9]*[0-9][0-9]*$/.test(fld_istpt)){
        //     this.shows=true;
        //     this.verification='请输入正确格式的保护阈值正整数';
        //     setTimeout( ()=> {
        //         this.shows=false;
        //     },2000)
        //     return false;
        // }
        axios
            .post(serverUrl+'/nacos/sFAddOrUpdate',{
                fld_name:fld_name,
                fld_project_id:fld_project_id,
                // fld_namespace_id:fld_namespace_id,
                fld_group_id:fld_group_id,
                // fld_istpt:fld_istpt,
                fld_des:fld_des,
                userInfo:this.userInfo

            })
            .then(response => {
                this.shows=true;
                this.verification=response.data.message;
                if(response.data.error==-1){
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000)
                }else{
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000)
                    this.findClose();
                    this.getServerFindList();
                }


               
            })

    },
    //服务发现删除
    serverFindDel:function(fld_id){
        axios
            .post(serverUrl+'/nacos/serverFindDel',{
                fld_id:fld_id,
                userInfo:this.userInfo

            })
            .then(response => {
                this.shows=true;
                this.verification=response.data.message;
                
                setTimeout( ()=> {
                    this.shows=false;
                },2000)
                this.serverFindList='';
                this.getServerFindList();
            })

    },
    //展示详情数据
    serverFindInfoShow:function(fld_id){
        window.location.href="serverFindDetail.html?fld_id="+fld_id+"&&fld_project_id="+this.project_id;
    },
    //获取分组
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
   // 改变分组
    groupChange:function(e){
        var groupid=e.target.attributes.groupid.value;
        this.group_id=groupid;
        this.getServerFindList();
        $(".server-list-group1").attr("class","server-list-group2");
        e.target.attributes.class.value="server-list-group1";


    },
    //搜索
    search: function () {
        var fld_name=this.$refs.namevalue.value;
        var fld_group=this.$refs.groupvalue.value;
            fld_name=fld_name.trim();
            fld_group=fld_group.trim();
            axios
                .post(serverUrl+'/nacos/serverFindSearch',{fld_project_id:this.project_id,fld_name:fld_name,fld_group:fld_group,userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        this.$refs.namevalue.value='';
                        this.$refs.groupvalue.value='';
                        this.show_tips_box=true;
                        this.current_state=response.data.message;
                        window.setTimeout(()=>{
                            this.show_tips_box=false;
                        },1000)
                        return false;
                    }else{
                        this.$refs.namevalue.value='';
                        this.$refs.groupvalue.value='';
                        this.serverFindList = response.data.serverFindList;
                    }
                    
                })
    },

    //点击正反小三角切换数据的正序倒序
			data_sort() {
				//当数据请求完成在执行下次请求
				// if (this.istrue.isorder == true) {
					//正序
					if (this.isup == 'itup' && this.isdown == 'itdown') {
						//小三角样式
						this.isup = 'isup';
						this.isdown = 'isdown';
                        this.serverFindList=this.serverFindList.reverse()
					} else if (this.isup == 'isup' && this.isdown == 'isdown') {//反序
						this.isup = 'itup';
						this.isdown = 'itdown';
                        this.serverFindList=this.serverFindList.reverse()
					}
				// }
			},

//    添加服务
    findAdd:function (e) {
        e.preventDefault();
        if(this.server_add==false){
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false
            },1000)
        }else{
            this.view_show=true;
            this.$refs.serverFindName.value='';
            // this.$refs.serverFindYz.value='';
            this.find_add='block';
        }
        
    },
    //关闭弹框
    findClose:function () {
        this.find_add='';
        this.view_show=false;
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
