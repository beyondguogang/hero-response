let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data: {
        // reversal: '',
        // reversal1: '',
        // isActive: false,
        // temprojectid:"a",
        // index:'',
        // user:"",
        // add:'',
        //有没有显示权限
        show_tips:null,
        //是否显示子菜单
        isItemList: false,
        isItemList1: false,
        isItemList2: false,
        projectList: "",//获取项目列表
        //左侧菜单标题
        heo: true,
        sty: '',
        pro: '',
        //不同页面的标志
        shows:0, 
        //用户名
        fld_username:"",
        //用户信息
        userInfo:"",
        current_state:'没有权限',
        //提示框
        show_tips_box:false,  
        //项目管理的列表
        project_management:null,
    },

    mounted:function() {
        //是否登录过期
        this.login_expired();
        //判断权限
        this.getAuth();
        //获取项目列表
        this.getProject();
    },
    computed:{
        
    },
    methods: {
       /*  getProjectId: function (e) {
            
            this.temprojectid=e.toElement.attributes.projectId.value;
            //console.log(this.temprojectid);

        },
       change1: function () {
            this.reversal1 = true
        },
        triangle: function () {
            this.heo = '';
            this.sty = true

        },
         group_fn : function () {
            if (!this.isItemList2) {
                this.isItemList2 = true;
                this.isItemList = false;
                this.isItemList1 = false;
                // axios.post(serverUrl+'/sdk/projectList',{userInfo:this.userInfo}).then((res)=>{
                //     this.project_management=res.data.projectList;
                // })
            } else {
                this.isItemList2 = false
            }

        },*/
       // 退出登陆
        logout:function(){
            window.sessionStorage.setItem('userInfo',null);
            // this.userInfo=null;
            // console.log(this.userInfo)
            window.location.href=webUrl;
            return false;

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
            };
            var userObj=JSON.parse(user);
            this.fld_username=userObj.fld_name;
        },
        //获取项目列表
        getProject: function () {
            axios
                .post(serverUrl+'/sdk/projectList',{userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        // alert(response.data.message);
                        return false;
                    }else{
                        this.projectList = response.data.projectList;
                    }
                    
                })
        },
        //是否显示子菜单
        config_fn: function () {
            if (!this.isItemList) {
                this.isItemList = true;
                this.isItemList1 = false;
                this.isItemList2 = false
            } else {
                this.isItemList = false
            }
        },
        //子菜单页面
        server_fn: function () {
            if (!this.isItemList1) {
                this.isItemList1 = true;
                this.isItemList = false;
                this.isItemList2 = false
            } else {
                this.isItemList1 = false
            }
        },
        //显示不同的页面
        change: function (index,e) {
            // alert(1)
            var controller=e.target.attributes.controller.value;
            
            if(controller=="slc"){
                var projectId=e.target.attributes.projectid.value;
                
                var projectName=$("#pid_"+projectId).html();
                // console.log(projectName,projectId)
                $("#iframe").attr("src","serverList.html?projectId="+projectId+"&project="+projectName+index);

                window.location.href=window.location.pathname+"#type="+escape('配置')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
             }
            //else if(controller=="glc"){
            //     $("#iframe").attr("src","group.html");
            //     window.location.href=window.location.pathname+"#type="+escape('分组'+'&count='+index);
            // }else if(controller=="nlc"){
            //     $("#iframe").attr("src","namespace.html");
            //     window.location.href=window.location.pathname+"#type="+escape('命名空间'+'&count='+index);
            // }else if(controller=="prlc"){
            //     $("#iframe").attr("src","project.html");
            //     window.location.href=window.location.pathname+"#type="+escape('项目管理'+'&count='+index);
            // }
            else if(controller=="sflc"){
                var projectId=e.target.attributes.projectid.value;
                var projectName=$("#pid_"+projectId).html();
                //projectName=escape(projectName);

                $("#iframe").attr("src","serverFindList.html?projectId="+projectId+"&project="+projectName);
                window.location.href=window.location.pathname+"#type="+escape('服务')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }
            // else if(controller=="zflc"){
            //     var projectId=e.target.attributes.projectid.value;
            //     var projectName=$("#pid_"+projectId).html();
            //     //projectName=escape(projectName);

            //     $("#iframe").attr("src","group.html?projectId="+projectId+"&project="+projectName);
            //     window.location.href=window.location.pathname+"#type="+escape('管理')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            // }
            // else if(controller=="ulc"){
            //     $("#iframe").attr("src","user-admin.html");
            //     window.location.href=window.location.pathname+"#type="+escape('用户管理'+'&count='+index);

            // }
            else if(controller=="prlc"){
                // alert(0)
                $("#iframe").attr("src","project.html");
                window.location.href=window.location.pathname+"#type="+escape('角色管理'+'&count='+index);
            }
            this.shows=index;
        },
        back: function () {
            this.pro = true;
            let oldProcedure = this.$refs['procedureEdit'].getVal();
            oldProcedure='';
            // alert()
        },
         // 获取表权限
        getAuth:function(){
            axios
            .post(serverUrl+'/sdk/getUserAuth',
            {
                TBName:"tbl_project",
                userInfo:this.userInfo
            })
            .then(response => {
                // console.log("response.data.rule",response.data.rule); 
                if(response.data.rule.View==true){
                    this.show_tips=true;
                }else{
                    this.show_tips_box=true;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },3000)
                }  
            })
        }
    },
})