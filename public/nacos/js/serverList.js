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
        //正序
		isup: 'itup',
		//倒序
		isdown: 'itdown',
        //是否禁止点击正反序的三角
		sort_flag:true,
        groupList:"",
        group_id:"",
        //显示页面
        back:true,
        //项目id
        project_id:"",
        //项目列表
        serverList:"",
        //添加页面的地址
        serverAddUrl:"",
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
        //遮罩
        view_show:false,
    }
},

mounted:function(){
    //根据项目id获取不同的页面
    this.item_id();
    //判断是否过期
    this.login_expired();
    //获取项目列表
    this.getServerList();
    //判断配置管理有没有增删改查权限
    this.getAuth("tbl_serverconf");
    // //获取分组
    // this.getGroup();
},
methods:{
    /*    fn:function(){
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
        console.log(e);
        var controller=e.toElement.attributes.controller.value;
        
        if(controller=="sclc"){
                $(".subunit").css("display","none");
                $("#sclc").css("display","block"); 

        }
    },*/
       //改变分组
    // groupChange:function(e){
    //     var groupid=e.target.attributes.groupid.value;
    //     this.group_id=groupid;
    //     this.getServerList();
    //     $(".server-list-group1").attr("class","server-list-group2");
    //     e.target.attributes.class.value="server-list-group1";



    // },
    //    // 获取组列表
    // getGroup:function(){
    //     axios
    //         .post(serverUrl+'/nacos/groupList',{fld_project_id:this.project_id,userInfo:this.userInfo})
    //         .then(response => {

    //             if(response.data.error==-1){
    //                 this.show_tips_box=true;
    //                 this.current_state=response.data.message;
    //                 window.setTimeout(()=>{
    //                     this.show_tips_box=false;
    //                 },1000)
    //                 return false;
    //             }else{
    //                 this.groupList = response.data.groupList;
    //                 this.group_id = response.data.groupList[0].fld_id;
    //             }
               
    //         })
    // },


    //点击正反小三角切换数据的正序倒序
	data_sort() {
		//当数据请求完成在执行下次请求
		// if (this.istrue.isorder == true) {
			//正序
			if (this.isup == 'itup' && this.isdown == 'itdown') {
				//小三角样式
				this.isup = 'isup';
				this.isdown = 'isdown';
                this.serverList=this.serverList.reverse()
			} else if (this.isup == 'isup' && this.isdown == 'isdown') {//反序
				this.isup = 'itup';
				this.isdown = 'itdown';
                this.serverList=this.serverList.reverse()
			}
		// }
	},
  
    //根据项目id获取不同的页面
    item_id:function(){
        var projectId=getUrlParam("projectId");
        // console.log(getUrlParam)
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
    //获取项目列表
    getServerList: function () { 
        // alert('正在加载')  
        axios
            .post(serverUrl+'/nacos/serverconfList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;

                    },1000);
                    this.serverList='';
                    this.serverAddUrl="serverConfDetail.html?fld_project_id="+this.project_id;
                    return false;
                }else{
                    this.serverList = response.data.serverConfList;
                    this.serverAddUrl="serverConfDetail.html?fld_project_id="+this.project_id;
                    console.log(this.serverList)
                } 
            }) 
    },   
    //服务删除
    serverDel:function(fld_id){
        axios
            .post(serverUrl+'/nacos/serverconfDel',{fld_id:fld_id,userInfo:this.userInfo})
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
                    this.getServerList();
                }
                
            })
    },
    //服务编辑跳转
    serverDetail:function(fld_id){
        // console.log(fld_id,this.project_id)
            window.location.href = 'serverConfDetail.html?fld_id='+fld_id+'&&fld_project_id='+this.project_id;
        
    },
    //搜索
    search:function(){
        var fld_name=this.$refs.namevalue.value;
        var fld_group=this.$refs.groupvalue.value;

        fld_name=fld_name.trim();
        fld_group=fld_group.trim();
        axios
            .post(serverUrl+'/nacos/serverconfSearch',{fld_project_id:this.project_id,fld_name:fld_name,fld_group:fld_group,userInfo:this.userInfo})
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
                    this.serverList = response.data.serverConfList;
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
            console.log("response.data.rule",response.data.rule);  
            if(response.data.rule.Add==false){
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
        e.preventDefault();
        if(this.show_dis==true){
            // alert(1)
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false;
            },1000)
        }else{
            window.location.href=this.serverAddUrl;
        }
    }
}

})