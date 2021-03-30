let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data: {        
        // reversal: '',
        // reversal1: '',
        // isActive: false,
        // pro: '',
        // temprojectid:"a",
        // index:'',
        // user:"",
        // add:'',
        //显示权限
        show_tips:null,
        //显示子菜单
        isItemList: false,
        isItemList1: false,
        isItemList2: false,
        //项目列表
        projectList: "",
        heo: true,
        sty: '',      
        //新建添加的标志
        shows:0,      
        //项目名
        fld_username:"",
        //用户信息
        userInfo:"",
        current_state:'没有权限',
        //提示框
        show_tips_box:false,
    },

    mounted:function() {
        //是否登录过期
        this.login_expired();
        //判断权限
        this.getAuth();
        //获取数据列表
        this.getProject();
    },
    computed:{
        
    },
    methods: {
        /* // getProjectId: function (e) {
            
        //     this.temprojectid=e.toElement.attributes.projectId.value;
        //     //console.log(this.temprojectid);

        // },
       group_fn: function () {
            if (!this.isItemList2) {
                this.isItemList2 = true;
                this.isItemList = false;
                this.isItemList1 = false
            } else {
                this.isItemList2 = false
            }

        },
        change1: function () {
            this.reversal1 = true
        },
        triangle: function () {
            this.heo = '';
            this.sty = true

        },*/
        //退出登陆
        logout:function(){
            sessionStorage.setItem('userInfo',null);
            // console.log(webUrl)
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
                .post(serverUrl+'/nacos/projectList',{userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        // alert(response.data.message);
                        return false;
                    }else{
                        this.projectList = response.data.projectList;
                    }
                    
                })
        },       
        //配置管理
        config_fn: function () {
            if (!this.isItemList) {
                this.isItemList = true;
                this.isItemList1 = false;
                this.isItemList2 = false
            } else {
                this.isItemList = false
            }
        },
        //服务管理
        server_fn: function () {
            if (!this.isItemList1) {
                this.isItemList1 = true;
                this.isItemList = false;
                this.isItemList2 = false
            } else {
                this.isItemList1 = false
            }
        },
        //点击返回不同的页面
        change: function (index,e) {
            //获取每个子菜单的标志
            var controller=e.target.attributes.controller.value;
            //根据标志判断要显示的页面
            if(controller=="slc"){
                //获取项目的projectid
                var projectId=e.target.attributes.projectid.value;
                //根据不同的id获取不同的元素内容
                var projectName=$("#pid_"+projectId).html();
                //根据不同的参数显示不同内容的嵌套页面
                $("#iframe").attr("src","serverList.html?projectId="+projectId+"&project="+projectName+index);
                //给地址添加不同的参数以让其有历史记录
                window.location.href=window.location.pathname+"#type="+escape('配置')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }else if(controller=="glc"){
                $("#iframe").attr("src","group.html");
                window.location.href=window.location.pathname+"#type="+escape('分组'+'&count='+index);
            }
            // else if(controller=="nlc"){
            //     $("#iframe").attr("src","namespace.html");
            //     window.location.href=window.location.pathname+"#type="+escape('命名空间'+'&count='+index);
            // }
            else if(controller=="prlc"){
                $("#iframe").attr("src","project.html");
                window.location.href=window.location.pathname+"#type="+escape('项目管理'+'&count='+index);
            }else if(controller=="sflc"){
                var projectId=e.target.attributes.projectid.value;
                var projectName=$("#pid_"+projectId).html();
                //projectName=escape(projectName);

                $("#iframe").attr("src","serverFindList.html?projectId="+projectId+"&project="+projectName);
                window.location.href=window.location.pathname+"#type="+escape('服务')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }
            // else if(controller=="ulc"){
            //     $("#iframe").attr("src","user-admin.html");
            //     window.location.href=window.location.pathname+"#type="+escape('用户管理'+'&count='+index);

            // }else if(controller=="plc"){
            //     $("#iframe").attr("src","role-admin.html");
            //     window.location.href=window.location.pathname+"#type="+escape('角色管理'+'&count='+index);
            // }
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
            .post(serverUrl+'/nacos/getUserAuth',
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