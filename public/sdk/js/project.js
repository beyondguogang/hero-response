let vm=new Vue({
    el: '#app',
    data: {
        item:'',//编辑或新建的名
        spring:'none', //是否显示弹框
        // isItemList:false,
        // isItemList1:false,
        // isItemList2:false,
        // msg1:'',
        // msg:'',
        // bor:'1px solid #5a6268',
        // bor1:'1px solid #5a6268',
        // hide:'none',
        // hide1:'none',
        // groupList:"",
        // a:"",
        projectList:"",//项目列表
        // nameList:"",
        // groupInfo:"",
        isEdit:"0",//编辑新建的标记
        shows:false,  /*弹框显示隐藏*/
        verification:'',/*弹框内容*/
        /*删除权限*/
        pointer_del:false,
        opacity_del:1,
        /*修改权限*/
        pointer_edit:false,
        opacity_edit:1,
        /*添加权限*/
        serverNewFlag:false,
        new_role:1,
        userInfo:"",//用户信息请求接口需要传入
        show_tips_box:false,//提示框
        current_state:'没有添加权限',
        t_body:true, //是否显示数据
        projectInfo:null, //请求列表数据
        true_flag:true,//确认的标志
    },
    mounted() {
        //是否登录过期
        this.login_expired();
        // var userObj=JSON.parse(user);
        //用户权限
        this.getAuth('tbl_project');
        // this.fld_username=userObj.fld_name;
        //项目列表
        this.getProject();
    
    },
    methods:{
        /*    fn5:function(){
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
    },*/
        //是否是登陆过期
        login_expired:function(){
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
        //编辑新建的确认按钮
        add:function(){
            this.true_flag=false;
            var name=this.$refs.projectname.value;
            var des=this.$refs.projectdes.value;
            name=name.trim();
            des=des.trim();
           if(name===''){
                this.shows=true;
                this.verification='项目名称不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(des===''){
                this.shows=true;
                this.verification='描述不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            } else if(this.isEdit==="0"){
                axios
                    .post(serverUrl+'/sdk/pAddOrUpdate',
                        {
                            fld_name:name,
                            fld_des:des,
                            userInfo:this.userInfo
                        })
                    .then(response => {

                        this.shows=true;
                        this.verification=response.data.message;
                        if(response.data.error==-1){
                            
                            setTimeout( ()=> {
                                this.shows=false;

                            },1000)
                        
                            this.spring='none';
                            this.true_flag=true;
                        }else{
                            setTimeout( ()=> {
                                this.shows=false;
                            },1000)
                            this.getProject();
                            this.spring='none';
                            this.true_flag=true;
                        }
                         
                        

                    })
            }else{
                axios
                    .post(serverUrl+'/sdk/pAddOrUpdate',
                        {
                            fld_id:this.projectInfo.fld_id,
                            fld_name:name,
                            fld_des:des,
                            userInfo:this.userInfo
                        })
                    .then(response => {
                        
                        this.shows=true;
                        this.verification=response.data.message;
                        if(response.data.error==-1){
                            
                            setTimeout( ()=> {
                                this.shows=false;

                            },1000)
                        
                            this.spring='none';
                            this.true_flag=true;
                        }else{
                            setTimeout( ()=> {
                                this.shows=false;
                            },1000)
                            this.getProject();
                            this.spring='none';
                            this.true_flag=true;
                            //  alert(1)
                        }

                    })

            }
        },
        //获取项目列表
        getProject:function(){
            axios
            .post(serverUrl+'/sdk/projectList',{userInfo:this.userInfo})
            .then(response => {
                // console.log(response)
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    //  console.log(response.data)
                    this.projectList = response.data.projectList
                }

                
            })

        },
        // 添加时的弹框
        addProjectShow:function(){          
            if(this.serverNewFlag==true){
                 this.$refs.projectname.value='';
                this.$refs.projectdes.value='';
                this.isEdit="0";
                this.spring='block';
                this.item='新建项目';
            }else{
                this.show_tips_box=true;
                window.setTimeout(()=>{
                    this.show_tips_box=false;
                },1000)
            }
           
        },
        //关闭弹框
        cross:function(){
            this.spring='none'
        },
        //删除数据
        projectDel:function(e){
            var fld_id=e.target.getAttribute('fld_id');
            axios
                .post(serverUrl+'/sdk/projectDel',
                {
                    fld_id:fld_id,
                    userInfo:this.userInfo
                    
                })
                .then(response => {
                    
                    this.shows=true;
                    this.verification=response.data.message;
                    if(response.data.error==-1){
                        
                        setTimeout( ()=> {
                            this.shows=false;

                        },1000)
                    
                        this.spring='none'
                    }else{
                        setTimeout( ()=> {
                            this.shows=false;
                        },1000)
                        this.getProject();
                        this.spring='none'
                    }

                })
        },
        //编辑项目
        projectEdit:function(e){
            this.isEdit="1";
            var fld_id=e.target.getAttribute('fld_id')
            axios
            .post(serverUrl+'/sdk/projectfInfo',
            {
                fld_id:fld_id,
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
                    // console.log(this.projectInfo)
                    this.projectInfo=response.data.projectInfo;
                    // console.log(this.projectInfo)
                    this.$refs.projectname.value=this.projectInfo.fld_name;
                    this.$refs.projectdes.value=this.projectInfo.fld_des;
                    this.item='编辑项目';
                    this.spring='block';
                }
                
                

            })
        },
        // 获取表权限
        getAuth:function(table){
            axios
            .post(serverUrl+'/sdk/getUserAuth',
            {
                TBName:table,
                userInfo:this.userInfo
                
            })
            .then(response => {
                //  console.log("response.data.rule",response.data.rule);   
                
                    if(response.data.rule.Add){
                        this.serverNewFlag=true
                    };
                    if(response.data.rule.View==false){
                        this.t_body=false
                    };
                    if(response.data.rule.Update==false){
                        this.opacity_edit=0.5;
                    }else{
                         this.opacity_edit=1;
                         this.pointer_edit=true;
                    };
                    if(response.data.rule.Del==false){
                        this.opacity_del=0.5;
                    }else{
                        this.pointer_del=true;
                        this.opacity_del=1;
                    }
                
            })
        }
    }
})