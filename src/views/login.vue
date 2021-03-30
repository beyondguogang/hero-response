<template>
	<div class="login" >
	    <section class="home">
	        <div class="middle">
				玩娱互动数据管理系统
	        </div>
	        <div class="sign">
	            <div class="title-con">
	                login
	            </div>
	            <form class="form">
	                <div>
						<div class="login-use">用户名</div>
	                    <span class="line"><input @focus="use_blur" @keyup.enter="submit" @click="input_use" :class="{blue:blue_use}" v-model="username"  type="text" autocomplete required="required" placeholder="请输入用户名"  ></span>
	                </div>
	                <div class="warning-use" v-show="us" >用户名不能为空</div>
	                <div class="login-war">
						<div class="login-pas">密码</div>
						<span class="password"><input @focus="pas_blur" @keyup.enter="submit" @click="input_pas" :class="{blue:blue_pas}" v-model="password"  type="password" autocomplete required="required" placeholder="请输入密码"  ></span>
					</div>
	                <div class="warning-pas" v-show="ps" >密码不能为空</div>
	                <div  class="btn-b"><button @click="submit" type="button" autofocus="autofocus" style="outline: none;"> <span>提交</span></button></div>
	            </form>
	        </div>
	    </section>
	    <div style="display: none;" class="spring-box" >
	        <p class="spring-content"></p>
	    </div>
		<tips v-if="tips" :current_state="current_state"></tips>
	</div>
</template>
<script>
    import tips from "../box/tips"
	export default {
	  name:'login',
	  data () {
	    return {
			//提示框组件
			tips:false,
			//提示框内容
			current_state:'',
			//用户名
			username:'',
			//密码
			password:'',
			//输入框的边框变化
			blue_use:false,
			//输入框的边框变化
			blue_pas:false,
			//焦点变化
			us:false,
			//焦点变化
			ps:false,
	    }
	  },
	  computed:{
	  },
	  created(){

	  },
	  mounted(){
		  
	  },
	  components: {
	     tips,
	  },
	  methods: {
		  //输入用户名框的边框变化
		  input_use(){
			  //输入框边框的样式
			  this.blue_use=true;
			  this.blue_pas='';
			  //提示语
			  this.us=false;
		  },
		  //输入用户密码的边框变化
		  input_pas(){
			  //输入框边框的样式
			  this.blue_pas=true;
			  this.blue_use='';
			  //提示语
			  this.ps=false;
		  },
		  //输入用户名的焦点状态
		  use_blur(){	
			  //获取焦点的样式
			 this.blue_use=true ;
			 this.blue_pas='';
			 //提示语
			 this.us=false;
		  },
		  //输入密码框的焦点状态
		  pas_blur(){
			  //获取焦点的样式
			 this.blue_pas=true;
			 this.blue_use='';
			 //提示语
			 this.ps=false;
		  },
		  //提交表单进行用户验证
	      submit(){
			  //把输入框中的数据去除首尾空格
			 let username=this.username.trim();
			 let password=this.password.trim();
			 //当用户名为空时显示提示语
			 if(username==''){
				 this.us=true;
			 }
			 //当密码框为空时显示提示语
			 if(password==''){
				 this.ps=true;
			 }
			 //请求登录接口
			 if(username!=''&&password!=''){
	   			this.axios.post(this.api+'/Login/check_login',{username:username,password:password})
					  .then(res =>{
						  //读取成功的字段
						  if(res.data.error==0){
							  //判断fld_name
							if(res.data.fld_name!=''){
							  this.$router.replace("/home");
							  let time=parseInt(new Date().getTime()/1000);
							  window.sessionStorage.setItem('userInfo',JSON.stringify(res.data.message));
							  window.sessionStorage.setItem('startTime',time)
							}else{
								this.tips=true;
							  	this.current_state='用户名不能为空';
							  	setTimeout(()=>{
									this.tips=false;
								},1000)
							}
							  
						  }else{//如果失败显示提示框
							  this.tips=true;
							  this.current_state=res.data.message;
							  setTimeout(()=>{
								this.tips=false;
							},1000)
						  }
					  })
			 }
		
		 }
	  },
	}
</script>
<style scoped>
	*{
	    padding: 0;
	    margin: 0;
	}
	.logo {
	    width: 100px;
	    height: 30px;
	    margin-top: 10px;
	    margin-left: 30px
	}
	.title {
	    width: 100%;
	    height: 50px;
	    background: #1b1e21;
	    overflow: hidden;
	    position: relative;
	}
	.home{
	    position: relative;
	    height: 100vh;
	   
		background-color: #dcdcdc;
	}
	.home .middle{
	    width: 420px;
    	position: absolute;
    	left: 50%;
    	top: 22%;
    	margin-top: -14px;
    	transform: translate(-50%, -50%);
    	text-align: center;
    	color: #007bff;
    	font-size: 36px;
		letter-spacing: 6px;

	}
	.home img{
	    display: block;
	    width: 257px;
	    height: 50px;
	    margin: 0;
	}
	.home .content{
	    opacity: .8;
	    font-family: Avenir-Medium;
	    font-size: 24px;
	    color: #fff;
	    max-width: 780px;
	    margin: 12px auto 30px;
	    text-align: left;
	}
	.login-war{
		margin-top: 20px;
	}
	.login-use,.login-pas{
		font-size: 14px;
		margin-bottom: 10px;
	}
	.sign{
	    position: absolute;
	    right: 40px;
	    width: 420px;
	    height: 470px;
	    top:50%;
		left: 50%;
		transform: translate(-50%, -50%);
	    border: 0;
	    min-width: 100px;
	    border-radius: 3px;
	    box-shadow: none;
	    background: #fff;
	    overflow: hidden;
	}
	.title-con{
	    width: 100%;
	    line-height: 45px;
	    font-size: 32px;
	    margin-top: 16px;
	    margin-left: 24px;
	    font-weight: 500;
	    text-align: left;
	    background: #fff;
	}
	.form{
	    width: 360px;
	    margin: 80px auto auto;
		margin-top: 35px;
	}
	.line{
	    width: 100%;
	}
	.line input{
	    outline: none;
	}
	.warning-use{
	    color: red;
	    font-size: 12px;
	}
	.warning-pas{
		color: red;
		font-size: 12px;
	}
	.warning1{
	    border: 1px solid red;
	}
	.warning2{
	    border: 1px solid red;
	}
	.blue{
	    border: 2px solid #01a0e4;
	}
	input::-webkit-input-placeholder {
	    /* placeholder颜色 */
	    color: #aab2bd;
	    /* placeholder字体大小 */
	    font-size: 12px;
	}

	input{
	    height: 40px;
	    font-size: 16px;
	    width: 100%;
	    text-indent: 10px;
		border-radius: 5px;
		border: 2px solid rgba(0,0,0,.15);
	}
	.password{
	    width: 100%;
	}
	.password input{
	    outline: none;
	}
	.btn-b{
		width: 100%;
		padding: 0;		
	}
	.btn-b button{
	    text-align: center;
	    cursor: pointer;
	    width: 100%;
	    height: 40px;
	    font-size: 16px;
	    background: #4190ff 100%;
	    color: #fff;
	    border: none;
	    margin-top:40px;
	    outline: none;
		filter:chroma(color=#000000);
		border-radius: 5px;
	}
	.btn-b span{
	    text-decoration: inherit;
	    display: inline-block;
	    vertical-align: middle;
	}
	/*弹框*/
	/*设置内容由显示变为隐藏*/
	@-webkit-keyframes fade{
	    100%{opacity: 0;}
	    0%{opacity: 1;}
	}
	@-moz-keyframes fade{
	    100%{opacity: 0;}
	    0%{opacity: 1;}
	}
	@-o-keyframes fade{
	    100%{opacity: 0;}
	    0%{opacity: 1;}
	}
	@keyframes fade{
	    100%{opacity: 0;}
	    0%{opacity: 1;}
	}
	.spring-box{
	    -webkit-animation:fade 4s ease;
	    -moz-animation:fade 4s ease;
	    -o-animation:fade 4s ease;
	    animation:fade 4s ease;
	    width: 300px;
	    height: 165px;
	    background: #000;
	    position: absolute;
	    top: 0;
	    left: 50%;
	    transform: translate(-50%, 0);
	    z-index: 1;
	    opacity: .8;
	    border: 1px solid #1860E4;
	}
	.spring-box .spring-content{
	    text-align: center;
	    line-height: 165px;
	    font-size: 18px;
	    color: #fff;
	}
</style>
