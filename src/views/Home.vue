<template>
	<div class="home">
		<!-- 头部 -->
		<div class="container-fluid ">
			<div class="header">
			<div class="row ">
				<div class="col-lg-12 ">
					<nav class="navbar">
							<div class="navbar-header  ">
								<a class="navbar-brand" href="javascript:void(0);">
									<img class="logo" alt="Brand" src="../assets/logo.png">
								</a>
							<span @click="icon_mune">
								<i class="fa fa-align-justify left-menu"></i>
							</span>
							</div>  
							
							<div class="navbar-rigth">
								<span>项目
								<!-- <select v-model="btn_selected" @change="btn_selected!='nacos' ? menu_list(btn_selected) : nacos()"> -->
									<select v-model="btn_selected" @change="menu_list(btn_selected)">
									<option disabled value="">请选择</option>
									<option 
										v-for="(project,index) in project_list" :key="index" :value="project">{{project.Comment}}
									</option>
									<!-- <option value="nacos">nacos</option> -->
								</select>
								</span>
								<span>时区
									<select @change="sle_time" v-model="sle_zone">
										<option disabled value="">请选择</option>
										<option v-for="(item,index) in UTC_ZONE" :key="index" :value="item">{{item}}</option>
									</select>
								</span>
								<span>
								<span>欢迎<b class="user_icon">{{username}}</b></span>
								<!-- <span @click="change_psd">修改密码</span> -->
								<span class="out" @click="out">退出</span>
								</span>
							</div>
					</nav>
				</div>
			</div>
		</div>
		<!-- 左侧菜单栏 -->
			<div class="row">
				<div class=" menu " v-if="menu_show">
					<div class=" menu-list-one">{{project_name}}</div>
					<!-- 当点击头部列表时根据不同的接口显示不同的菜单数据 -->
					<div v-for="(menu_data,index) in menu_data" :key="index" :id="'menu_'+index">
						<div @click.capture="change(index)" class="menu-titel">
							<i class="fa fa-caret-right" :class="{'icon':is_icon===index}" aria-hidden="true"></i>
							{{menu_data.name}}
						</div>
						<ul class="menu-list" v-show="is_icon===index" style="margin-top: 10px;">
							<li @click="sty_list(sub,index)" class="menu_list" :class="{'sty_list':is_sty===index}" v-for="(sub,index) in menu_data.sub_item"
							 :key="index"><a :title="sub.name" href="javascript:void(0)" class="list-anchor">{{sub.name}}</a></li>
						</ul>
					</div>
				</div>
				<!-- 加载状态 -->
				<div class="loading" v-if="anate"><i class="fa fa-spin fa-refresh"></i><p>正在加载</p></div>
				<div class="data" :class="[active]">
					<!-- content-admin组件 -->
					<content-admin @lookup="lookup" @child_home="child_home" @child="child" @child_next="child_next" @child_end="child_end"
		 				  @parent_data_sort="parent_data_sort" @parent_refresh="parent_refresh" @query="query" :sub_url="sub_url" :sub_index="sub_index"
		                  :fields="fields" :rows="rows" :project_data="project_data" :response="response" v-if="flag" :istrue="istrue" :isquery="isquery" 
		                  :no_data="no_data" >
					</content-admin>
					<content-warship @lookup="lookup" @child_home="child_home" @child="child" @child_next="child_next" @child_end="child_end"
		 				  @parent_data_sort="parent_data_sort" @parent_refresh="parent_refresh" @query="query" :sub_url="sub_url" :sub_index="sub_index"
		                  :fields="fields" :rows="rows" :project_data="project_data" :response="response" v-if="flag_warship" :istrue="istrue" :isquery="isquery" 
		                  :no_data="no_data" >
					</content-warship>
					<!-- 组件 -->
					<page v-if="box_data.sel" ></page>
					<send-mail v-if="box_data.mail"></send-mail>
					<nacos v-if="box_data.nacos"></nacos>
					<!-- 提示组件 -->
					<tips v-if="sel_tips" :current_state="current_state"></tips>
					<pro-gress v-if='pro_flag' @parent_refresh="parent_refresh"></pro-gress>
				</div>
		
			</div>
		</div>
			<div class="row edition">
				<div class="col-lg-12 col-md-12 copyright">版权归玩娱互动</div>
		    </div>
	</div>
</template>
<script>
	//表格数据组件admin
	import contentAdmin from '@/components/content_admin.vue';
	//表格数据组件warship
	import contentWarship from '@/components/content_warship.vue';
	//角色查询组件
	import page from '@/components/page.vue';
	//邮件组件
	import sendMail from '@/components/send_mail.vue';
	//nacos组件
	import nacos from '@/components/nacos';
	//弹框提示组件
	import tips from "../box/tips";
	//sdk配置组件
	import proGress from "@/components/set_progress.vue"
	// import userPas from '@/components/user_psd.vue'
	export default {
		name: 'Home',
		components: {
			contentAdmin,
			contentWarship,
			page,
			sendMail,
			nacos,
			//提示组件
			tips,
			proGress
			// userPas
		},
		data() {
			return {
				//proprogress是否显示
				pro_flag:false,
				//项目下拉框的索引
				project_index:'',
				//是否显示提示组件
				sel_tips:false,
				//当前的状态
				current_state:'',				
				//菜单显示隐藏时的布局
				active:'col-lg-12',
				//菜单的显示和隐藏
				menu_show:false,
				//时区
				UTC_ZONE:[
   					 "UTC-0000",
   					 "UTC-0100",
   					 "UTC-0200",
   					 "UTC-0300",
   					 "UTC-0400",
   					 "UTC-0500",
   					 "UTC-0600",
   					 "UTC-0700",
   					 "UTC-0800",
   					 "UTC-0900",
   					 "UTC-1000",
   					 "UTC-1100",
   					 "UTC-1200",
   					 "UTC+0000",
   					 "UTC+0100",
   					 "UTC+0200",
   					 "UTC+0300",
   					 "UTC+0400",
   					 "UTC+0500",
   					 "UTC+0600",
   					 "UTC+0700",
   					 "UTC+0800",
   					 "UTC+0900",
   					 "UTC+1000",
   					 "UTC+1100",
   					 "UTC+1200"
				],
				//时区选择框的数据
				sle_zone:'UTC+0000',
				//项目的选择框数据
				btn_selected:'',
				//加载状态
				anate:false,				
				//头部请求的数据
				project_list: '',
				//头部数据项目返回的名字
				project_name: '',
				//项目菜单数据包括子菜单
				menu_data: '',
				//控制菜单三角图标
				is_icon: '',
				//用户名
				username: '',
				//菜单项的点击样式
				is_sty: '',
				//角色权限
				userInfo: '',
				//项目内容数据
				rows: [],
				//项目头部数据
				fields: null,
				//项目内容的数据
				project_data: null,
				//头部数据和其他的增删改接口
				response: {},
				//地址路由参数
				sub_url: null,
				//地址路由参数
				sub_index: null,
				list_index: 0,
				//菜单显示隐藏的索引值
				change_index: 0,
				//显示shop组件admin
				flag: false,
				//显示shop组件warship
				flag_warship:false,
				//上下翻页时数据请求完成执行代码
				istrue: {
					isnext: true,
					isfirst: true,
					isstart: true,
					isend: true,
					isrefresh: true,
					isorder: true,
				},
				//是否查询列表数据
				isquery:false,
				//查询的数据参数
				query_projectA:null,
				//请求数据页的显示条数
				data_page: 16,
				//请求的页数默认为一页
				page:1,
				//查询的数据是否为空的标志
				no_data:true,
				//page组件是否显示
				box_data:{
					sel:false,
					mail:false,
					nacos:false
				},
				//获取url中的参数
				surl:null,
				//获取url中的index参数
				index:null,
				//获取url中的子菜单的index
				change_index:null,
				//正反序的状态
				sord:'desc',
				//选择项目的副本
				copy_select:null,
			}
			
		},
		created() {

		},
		computed: {},
		mounted() {
			// alert(1)
			//头部左边状态自动请求头部数据1607504568
			this.getHeadData();
		},
		methods: {                        
			//头部左边状态自动请求头部数据和加载本地保存的数据sessionStorage
			getHeadData(){
				// alert(0)
				// console.log(JSON.stringify(window.sessionStorage.getItem('userInfo')))
				// console.log(window.sessionStorage.getItem('userInfo'))
				//
				if(window.sessionStorage.getItem('userInfo')=='null'){
					// alert(0)
					this.$router.replace({
						path: "/login"
					})
				}else{
					this.axios.get(this.api + '/Login/ProjList?userInfo='+window.sessionStorage.getItem('userInfo')).then(res => {
				//获取项目列表
				this.project_list = res.data;
				//获取项目索引
				var select=window.sessionStorage.getItem('btn_selected');
				//项目索引副本
				this.copy_select=select;
				//根据保存的项目为空时会自动请求第一个项目默认显示
				if(select!=''&&this.$route.params.project == undefined){
					//获取参数地址中的参数
					let params_url=window.sessionStorage.getItem('url');
					//如果本地保存的数据中有值
					if(params_url){
						//把参数根据’，‘分割成数组
						params_url=params_url.split(',');
						//根据参数加载对应的页面
						window.location.href = this.url + "/home/" + params_url[0] + params_url[1] + '/' + Number(params_url[3]) + '/' + Number(params_url[2]);
					}else{
						//如果参数为空那么直接加载第一个菜单
						this.menu_list(this.project_list[0]);
						this.btn_selected=this.project_list[0];
					}
					
				}
				//刷新时根据之前保存的时区显示时间
				if(window.sessionStorage.getItem('time_zone')!=null){
					this.sle_zone=window.sessionStorage.getItem('time_zone');
				};
				//当重新加载时请求反序的数据
				window.sessionStorage.setItem('sord','desc');
				//如果url参数不为undefined加载对应路由的数据
				if (this.$route.params.project != undefined) {
					this.surl = "/" + this.$route.params.project + '/' + this.$route.params.db + '/' + this.$route.params.table;
					this.index = Number(this.$route.params.index);
					this.change_index = Number(this.$route.params.change_index);
					//刷新时执行头部菜单中的函数并传入路由参数 项目对象 后台路由 菜单索引 子菜单索引
					this.menu_list(this.project_list[select],this.surl, this.index, this.change_index);
					//获取数据时执行的函数 后台路由 菜单索引 子菜单索引 项目对象
					this.getRow(this.surl, this.index, this.change_index,this.project_list[select]);
				}
				//判断是否登录过期
				this.login_expired()
				});
				}
				
			},
			//登录过期
			login_expired(){
				//如果userInfo为null那么返回登录页
				if(window.sessionStorage.getItem('userInfo')==null||window.sessionStorage.getItem('userInfo')=='null'){
					this.$router.replace({
						path: "/login"
				})
				}else{
					//把保存的用户信息转换成对象
					let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
					//保存到data对象中
					this.userInfo = userInfo;
					//获取用户名
					this.username = userInfo.fld_name;
					//获取据1970年的时间毫秒数以判断登录过期时间
					let startTime = window.sessionStorage.getItem('startTime');
					//获取登陆前据1970年的时间毫秒数
					let time = parseInt(new Date().getTime() / 1000);
				if (userInfo.fld_name == '' || userInfo.fld_name == undefined || userInfo.fld_name == null || userInfo.fld_name ==
					'null') {
					//保存选择项索引
					window.sessionStorage.setItem('btn_selected',this.project_index);
					//保存退出前的地址
					if(this.$route.params.project != undefined){
						window.sessionStorage.setItem('url',this.project_list[this.copy_select].Name+','+this.surl+','+this.index+','+this.change_index);
					};
					//保存userInfo
					window.sessionStorage.setItem('userInfo','null');
					//返回登录页
					this.$router.replace({
						path: "/login"
					});
					return false;
				};
				//设置超时时间30分钟
				let time_control = (time - startTime) - (30 * 60);
				//登录时间超时返回登录页
				if (time_control > 0) {
					// alert(2)
					// console.log(this.copy_select)
					// console.log(this.project_list)
					//保存选择项索引
					window.sessionStorage.setItem('btn_selected',this.project_index);
					//保存退出前的地址
					if(this.$route.params.project != undefined){
						window.sessionStorage.setItem('url',this.project_list[this.copy_select].Name+','+this.surl+','+this.index+','+this.change_index);
					};
					//保存userInfo
					window.sessionStorage.setItem('userInfo','null');
					//返回登录页
					this.$router.replace({
						path: "/login"
					});
					return false;
				}else{
					//当一直操做时时间也跟着更新避免30分钟后退出登录
					window.sessionStorage.setItem('startTime',time);
				}
				}
			},
			//头部菜单的显示隐藏图标 表格占比
			icon_mune(){
				if(!this.menu_show){
					this.menu_show=true;
					// 显示时的空间占比
					this.active='true-percentage'
				}else{
					this.menu_show=false;
					//隐藏时的空间占比
					this.active='col-lg-12';
				}
				
			},
			//修改密码
			// change_psd(){},
			//选择时区
			sle_time(){
				//选择时区时根据本地保存时区和正反序列字段重新加载数据
				window.sessionStorage.setItem('time_zone',this.sle_zone);
					//如果保存的正反序不为null那么获取
					if(window.sessionStorage.getItem('sord')!=null){
						this.sord=window.sessionStorage.getItem('sord');
						};
					//如果路由参数不为undefined根据正反序字段刷新数据
					if (this.$route.params.project != undefined) {
						this.parent_refresh('',this.sord,this.page)
						}
			},
			//计算时区时间
			datetime2zone_x(_date_time, _zone) {
				//定义utc时区字段
				const UTC_ZONE = {
				    "UTC-0000": -0 * 3600 * 1000,
				    "UTC-0100": -1 * 3600 * 1000,
				    "UTC-0200": -2 * 3600 * 1000,
				    "UTC-0300": -3 * 3600 * 1000,
				    "UTC-0400": -4 * 3600 * 1000,
				    "UTC-0500": -5 * 3600 * 1000,
				    "UTC-0600": -6 * 3600 * 1000,
				    "UTC-0700": -7 * 3600 * 1000,
				    "UTC-0800": -8 * 3600 * 1000,
				    "UTC-0900": -9 * 3600 * 1000,
				    "UTC-1000": -10 * 3600 * 1000,
				    "UTC-1100": -11 * 3600 * 1000,
				    "UTC-1200": -12 * 3600 * 1000,
				    "UTC+0000": 0 * 3600 * 1000,
				    "UTC+0100": 1 * 3600 * 1000,
				    "UTC+0200": 2 * 3600 * 1000,
				    "UTC+0300": 3 * 3600 * 1000,
				    "UTC+0400": 4 * 3600 * 1000,
				    "UTC+0500": 5 * 3600 * 1000,
				    "UTC+0600": 6 * 3600 * 1000,
				    "UTC+0700": 7 * 3600 * 1000,
				    "UTC+0800": 8 * 3600 * 1000,
				    "UTC+0900": 9 * 3600 * 1000,
				    "UTC+1000": 10 * 3600 * 1000,
				    "UTC+1100": 11 * 3600 * 1000,
				    "UTC+1200": 12 * 3600 * 1000
				};
				//如果参数返回false返回的显示字段
			    if (!_date_time){
					return "N/A";
					}
				//时区毫秒数
			    var office = UTC_ZONE[_zone];
			    var temp_date = null;
			    if (typeof _date_time == "string") {
					//如果参数是最初时间
			        if (_date_time == "1970-01-01 00:00:00"){
						 return "N/A";
					}
			        //如果参数是0000 
					if (_date_time == "0000-00-00 00:00:00"){
						 return "N/A";
					}
			        //如果参数是null  
			        if (_date_time == "null"){
						return "N/A";
					}
			        //如果字符串没有utc字符
			        if (_date_time.indexOf("UTC") < 0){
						_date_time += " UTC+0000";
						//将’-‘替换成’/‘兼容ie浏览器
						_date_time = _date_time.replace(/\-/g,'/')
						//将字符串转换成时间对象
						temp_date = new Date(_date_time);
					}
					 
				}else{//如果不是字符串
						temp_date = _date_time;
					}
				//返回正确格式的时间字符
			    function to_2_str(_value) {
			        if (_value < 10)
			            return "0" + _value;
			        else
			            return _value;
			    };
				//获取时区的毫秒数
				var temp = new Date(temp_date.getTime() + office);
				//获取带时区的时间
			    var date_str = temp.getUTCFullYear()
			        + "-"
			        + to_2_str(temp.getUTCMonth() + 1)
			        + "-"
			        + to_2_str(temp.getUTCDate())
			        + " "
			        + to_2_str(temp.getUTCHours())
			        + ":"
			        + to_2_str(temp.getUTCMinutes())
			        + ":"
			        + to_2_str(temp.getUTCSeconds())
					+ " " + _zone;
			    return date_str;
			},
			//nacos
			/*nacos(){
				this.project_name='nacos';
				this.menu_data=[ 
					{name:'配置管理',sub_item:[{name:'坦克',url:'/tank/nacos/serverconfList'},{name:'巅峰战舰',url:'/warship/nacos/serverconfList'}]},
					{name:'服务管理',sub_item:[{name:'坦克',url:'/tank/nacos/groupList'},{name:'巅峰战舰',url:'/warship/nacos/groupList'}]}
				];
			},*/
			//查询数据
			query(url, index,project,sort){	
				//加载时的状态
				this.anate=true;
				//接口需要的数据
				this.query_project=project;
				let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
						//默认的请求的数据是application/json，此处需要设置请求类型
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"||ite.FieldType=="timestamp"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							this.sord=sort;
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//查询数据是否为空
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 this.anate=false;
					})
			},
			//获取数据
			getRow(url, index, change_index,pr) {
				//当加载数据后左侧菜单隐藏
				this.menu_show=false;
				//设置页面铺满全屏
				this.active='col-lg-12';
				//当url对应的不是页面的时候直接请求不同的接口使用相同的组件
				if(url!='/Tank/Other/QueryRoles'&&url!="/Tank/Other/SendMail"&&url!="/Admin/Other/SetProgress"){					
					let time = new Date().getTime();
					//加载时的状态
					this.anate=true;
					//请求数据列表表头及相关的接口信息（增删改查）
					this.axios.post(this.api + '/bin' + url + '/columns', {
					//用户信息
					userInfo: window.sessionStorage.getItem('userInfo')
				}).then(res => {
					//将数据赋值给response
					this.response = res.data;
					//获取项目的表头数据 项目表格中的标题
					this.fields = res.data.FIELDS;
					//根据表模板的字段显示不同的页面，做定制表的页面 动态获取页面显示的条数
						if(this.response.PAGE_TEMPLATE=="page_grid"){
							//计算显示数据的框的高度
							this.data_page=parseInt((window.screen.height-280)/43-1);
						}else if(this.response.PAGE_TEMPLATE=="page_grid_nacos"){
							this.data_page=parseInt((window.screen.height-280)/43-1);
						}else if(this.response.PAGE_TEMPLATE=="base_page"){
							// this.data_page=parseInt(window.screen.height/65)
							this.data_page=parseInt((window.screen.height-355)/43-1)
						}
					//当求情完成的标志
					let parameter={
						_search: false,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: 'desc',
						}
						parameter.userInfo=JSON.stringify(this.userInfo);
						//如果加载接口不为undefined执行数据接口
						if(res.data.JQ_GRID_LOAD!=undefined){
							this.axios.post(this.api + res.data.JQ_GRID_LOAD,this.qs.stringify(parameter), {
							headers: {
									'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
								this.project_data = res.data;
								    //判断有没有数据
									if(res.data.rows!=undefined){
										//请求数据后把类型为时间的加上时区信息
										this.fields.map((ite,index,arr)=>{
											if(ite.FieldType=="datetime"||ite.FieldType=='timestamp'){
												 	res.data.rows.forEach((item,index)=>{
													//控制时区函数
													item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
												})
											}
										});
									this.rows = res.data.rows;
									// console.log(this.rows)
									}else{//如果没有数据
										this.sel_tips=true;
										this.current_state='没有数据';
										setTimeout(()=>{
											this.sel_tips=false;
										},2000)
									};
								//显示shop组件 根据表模板字段显示不同的定制页面 表模板设置为哪个字段就显示相应的页面
								if(this.response.PAGE_TEMPLATE=="page_grid"){
									this.flag = true;
								}else if(this.response.PAGE_TEMPLATE=="page_grid_nacos"){
									this.flag = true;
								}else if(this.response.PAGE_TEMPLATE=="base_page"){
									this.flag_warship = true;
								};
								//保存地址及索引用于传递给子组件
								this.sub_url = url;
								this.sub_index = index;
								//改变小三角样式的函数
								this.change(change_index);
								//子菜单样式
								if (this.is_sty === index) {
									this.is_sty = '';
								} else {
									this.is_sty = index;
								}
								//项目选择框的数据对象
								this.btn_selected=pr;
								//加载完成的后加载状态消失
								this.anate=false
							})}else{//没有显示权限
								this.sel_tips=true;
								this.current_state='没有权限';
								setTimeout(()=>{
									this.sel_tips=false;
								},2000)
							}
				});
				}
			},
			//子组件查找数据点击底部的第几页显示输入框并输入页数
			lookup(url, index, page,sort) {
				//根据是否查询了数据请求不同的接口
				if(this.isquery==true){
					//加载状态
					this.anate=true;
					//加载标志本次加载完成在执行下一次的接口请求
					this.istrue.isnext = false;
				let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成标志
						this.istrue.isnext = true;
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //数据的正反序
						 this.sord=sort;
						 //加载完成状态隐藏
						 this.anate=false;
					})
				}else{//没有查询数据的请求接口
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isnext = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成的标志
						this.istrue.isnext = true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//加载状态完成后隐藏
						this.anate=false;
						//数据的正反序
						this.sord=sort;
					})
				};
				//获取当前页
				this.page=page;
			},
			//子组件刷新数据
			parent_refresh(url,sort,page) {
				//根据是否加载了查询接口请求不同的接口
				if(this.isquery==true){
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isrefresh = false;
					let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;							
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isrefresh = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//加载状态完成后消失
						this.anate=false;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//数据的正反序
						this.sord=sort;
							})
				}else{//没有查询时的加载接口
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isrefresh = false;
					let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//跟新时间的时区信息
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成的标志
						this.istrue.isrefresh = true;
						//加载状态
						this.anate=false;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//数据正反序列
						this.sord=sort;
					})
				}	
			},
			//子组件调用父组件方法刷新数据正倒序
			parent_data_sort(url, sort,name) {
				// console.log(name)
				//当调用查询接口后请求的接口
					if(this.isquery==true){
					//加载的状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isorder = false;
					let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: name,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isorder = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//加载状态
						this.anate=false;
						//当点击正反序的时候从第一页开始
						this.page=1;
						//在本地存储当前的正反序字段
						window.sessionStorage.setItem('sord',sort);
							})
				}else{//没有调用查询接口请求的数据
				console.log(name)
					//加载状态
					this.anate=true;
					//加载完成标志
					this.istrue.isorder = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: name,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						console.log(this.project_data)
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成标志
						this.istrue.isorder = true;
						//加载动态
						this.anate=false;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//当点击正反序列的时后从第一页开始显示
						this.page=1;
						//保存正反序列的字段
						window.sessionStorage.setItem('sord',sort);
					})
				}
			},
			//首页加载
			child_home(url, index, page,sort) {
				//判断是否是请求的查询接口如果是那么走查询接口如果不是走原始的数据接口
				if(this.isquery==true){	
					//加载状态
					this.anate=true;	
					//加载完成的标志	
					this.istrue.isstart = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isstart = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //加载状态
						 this.anate=false;
					})
				}else{//没有查询时的请求接口
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isstart = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成的标志
						this.istrue.isstart = true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						//加载状态
						this.anate=false;
					})
				}
			},
			//子组件执行父组件方法上一页
			child(url, index, page,sort) {
				//有查询的加载接口
				if(this.isquery==true){
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isfirst = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isfirst = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						 if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 //加载的状态
						 this.anate=false;
					})
				}else{//没有查询的请求接口
				    //加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isfirst = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
				    	this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成的标志
						this.istrue.isfirst = true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //加载状态
						this.anate=false;
					})
				}
				//当前的页数
				this.page=page;
			},
			//子组件执行父组件方法下一页
			child_next(url, index, page,sort) {
				//有查询时的请求接口
				if(this.isquery==true){
					//加载的状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isnext = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isnext = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						 if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 //加载状态
						 this.anate=false;
					})
				}else{//没有查询时的请求接口
					//加载状态
					this.anate=true;
					//加载完成的标志
					this.istrue.isnext = false;
				let time = new Date().getTime();
					this.list_index = index;
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						//加载完成的标志
						this.istrue.isnext = true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //加载状态
						this.anate=false;
					})
				}
				//当前的页数
				this.page=page;
			},
			//尾页加载
			child_end(url, index, page,sort) {
				//如果是查询完成的列表则执行
				if(this.isquery==true){
					//加载的状态
					this.anate=true;
					//当执行时不能点击尾页的标志
					this.istrue.isend = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isend = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //加载状态
						 this.anate=false;
					})
				}else{//如果不是点击了查询则是所有的数据
				    this.anate=true;
					this.istrue.isend = false;
				let time = new Date().getTime();
					this.list_index = index;
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						//加载完成的标志
						this.istrue.isend = true;
						//如果没有数据
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 };
						 //加载状态
						this.anate=false;
					})
				}
				//当前页数
				this.page=page;
			},
			//左边菜单栏name:项目对象 url:后台路由 index:菜单索引 chang_index:子菜单索引
			menu_list(name,url, index, change_index) {
				//选中某一项把项目索引赋值给project_index后续使用
				if(name!=undefined){
					this.project_list.forEach((item,index)=>{
						if(item.Name==name.Name){
							this.project_index=index;
						}
					});
					var pro_url=name.url.trim();
					
					//如果有url字段那么执行外部链接
					if(pro_url!=''){
						 window.location.href=this.url+name.url;
					};
					//显示左侧菜单
					this.menu_show=true;
					//控制菜单的显示宽度
					this.active='col-lg-11 offset-lg-1';
					//项目的项目名
					this.project_name = name.Name;
					//项目数据列表的显示标志
					this.flag = false;
					//请求接口时的动画
					this.anate=true;
					//请求项目菜单
					this.axios.get(this.api + '/Login/Menu?Project=' + name.Name+'&'+'userInfo='+window.sessionStorage.getItem('userInfo')).then(res => {
					this.menu_data = res.data;
					this.is_icon = '';
					//如果项目菜单中的子菜单是页面不是数据表执行别的组件
					if(url=='/Tank/Other/QueryRoles'){//查询角色页面
						this.sub_url = url;
						this.sub_index = index;
						let len = window.history.length;
						this.change(change_index);
						if (this.is_sty === index) {
							this.is_sty = '';
						} else {
							this.is_sty = index;
						}
						//查询角色组件显示
						this.box_data.sel=true;
						//获取项目对象
						this.btn_selected=name;
					}else if(url=="/Tank/Other/SendMail"){//发送邮件页面
						this.sub_url = url;
						this.sub_index = index;
						let len = window.history.length;
						this.change(change_index);
						if (this.is_sty === index) {
							this.is_sty = '';
						} else {
							this.is_sty = index;
						}
						//发送邮件组件显示
						this.box_data.mail=true;
						//获取项目对象
						this.btn_selected=name;
					}else if(url=="/Admin/Other/SetProgress"){//发送邮件页面
						this.sub_url = url;
						this.sub_index = index;
						let len = window.history.length;
						this.change(change_index);
						if (this.is_sty === index) {
							this.is_sty = '';
						} else {
							this.is_sty = index;
						}
						//发送邮件组件显示
						this.pro_flag=true;
						//获取项目对象
						this.btn_selected=name;
					}
					//加载状态
					this.anate=false;
					});
				}else{
					return false
				};
					
					
			},
			//控制菜单栏的显示隐藏
			change(index) {
				//获取菜单的索引
				this.change_index = index;
				//子菜单的样式选项为空
				this.is_sty = '';
				//控制小三角的样式
				if (this.is_icon === index) {
					this.is_icon = '';
				} else {
					this.is_icon = index
				}
			},
			//点击项目菜单
			sty_list(sub, index){
				//每次切换项目就把btn_selected设置为最新的值)
				window.sessionStorage.setItem('btn_selected',this.project_index);
				//加载不同的表数据
				window.location.href = this.url + "/home/" + this.project_name + sub.url + '/' + this.change_index + '/' + index;	
			},
			//退出登录
			out() { 
				console.log(this.project_list[this.copy_select])
				// alert(0)
				if(this.project_list[this.copy_select]){
					// alert(1)
					//保存选择项的索引
					window.sessionStorage.setItem('btn_selected',this.project_index);
					//保存推出前的地址
					if(this.$route.params.project != undefined){
						window.sessionStorage.setItem('url',this.project_list[this.copy_select].Name+','+this.surl+','+this.index+','+this.change_index);
					};
				}
				//保存userInfo
				window.sessionStorage.setItem('userInfo','null');
				//返回登录页面
				this.$router.replace({
					path: "/login"
				})
			}
		}
	}
</script>
<style scoped>
	@media (min-width: 1024px){
		.true-percentage{
			margin-left: 160px;
			width: 85%;
		}
	}
	@media (min-width: 1100px) {
		.true-percentage{
			margin-left: 160px;
			width: 86%;
		}
	}
	@media (min-width: 1280px) {
		.true-percentage{
			margin-left: 160px;
			width: 89%;
		}
	}
	@media (min-width: 1366px) {

		.true-percentage{
			margin-left: 160px;
			width: 90%;
		}
	}  
	@media (min-width: 1440px) {
		.true-percentage{
			margin-left: 160px;
			width: 90%;
		}
	} 
	@media (min-width: 1680px) {
		.true-percentage{
			margin-left: 160px;
			width: 92%;
		}
	} 
	@media (min-width: 1920px) {
		.true-percentage{
			margin-left: 160px;
			width: 92%;
		}
	} 
    .edition{
		height: 30px;
	}
    .copyright{
		height: 30px;
		line-height: 30px;
		background-color: #969191;
		color: #fff;
		text-align: center;
		margin-bottom: 0px;
		position: fixed;
    	margin-left: 15px;
    	bottom: 0;
    	width: 100%;
		z-index: 2;
	}
    .left-menu{
		color:#fff ;
	}
    .user_icon{
		font-family: cursive;
		padding: 0 5px;
        color: #fff;
        font-weight: 400;
	}
	.fa-spin{
	    -webkit-animation: fa-spin 1s infinite linear;
        animation: fa-spin 1s infinite linear;
	}
	.loading{
		z-index: 1;
		font-size: 50px;
		position: fixed;
		color: rgb(138, 132, 132);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	.loading p{
		font-size: 20px;
		width: 120px;
		height: 30px;
		background: darkkhaki;
		color: #fff;
	}
	.home{
		overflow: hidden;
	}
    .data{
		 /* margin-top: 20px; */
		 /* width: 100%; */
		 padding-left: 20px;
		 padding-right: 20px;
	 }
	 select{
		font-size: 14px;
	}
    .z_load{
		position: absolute;
		top: 50%;
		left: 50%;
	}
	a {
		color: black;
	}
	a:hover {
		text-decoration: none
	}
	.header {
		position: fixed;
		z-index: 1000;
		width: 100%;
	}
	.container-fluid {
		padding-left: 0;
		padding-right: 0;
	}
	.project_list {
		cursor: pointer;
	}
	.list-anchor {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		width: 100px;
		overflow: hidden;
		white-space: nowrap;
        text-overflow: ellipsis;
	}
	.menu {
		/* width: 10%; */
		z-index: 2;
		background: gainsboro;
		position: fixed;
		top: 52px;
		bottom: 0px;
		overflow: auto;
		/* margin-bottom: 10px; */
		width: 160px;
		padding-right: 0;
	}
	.icon {
		transform: rotate(90deg);
	}
	.navbar-header {
		color: #ffffff;
	}
	.navbar-rigth {
		margin-right: 10px;
		color: #ffffff;
		font-size: 15px;
	}
	.navbar-rigth a{
		color:#fff;
	}
	.active {
		display: block;
	}
	.menu-titel {
		width: 100%;
		text-align: left;
		padding-left: 30px;
		cursor: pointer;
		font-size: 15px;
		/* margin-top: 20px; */
		height: 40px;
		line-height: 40px;
	}
	.menu-titel:hover {
		background: ghostwhite;
	}
	.menu-list {
		margin-left: -40px;
		/* margin-right: -15px; */
	}
	.menu-list li {
		font-size: 13px;
		cursor: pointer;
		padding-left: 52px;
	}
	.menu-list li:hover {
		background-color: ghostwhite;
	}
	.sty_list {
		background-color: ghostwhite;
	}
	.menu-list-one {
		margin-bottom: 10px;
		font-size: 40px;
		text-align: center;
		color: #666;
		font-size: 30px;
	}
	ul li {
		list-style: none;
	}
	.logo {
		width: 117px;
	}
	select {
		outline: none;
	}
	.out {
		cursor: pointer;
	}
	nav {
		padding: 0;
		background: gray;
	}
	span {
		margin-left: 20px;
	}
	.menu::-webkit-scrollbar {
		width: 4px;
	}
	.menu::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(173, 172, 172, 0.2);
		background: rgba(173, 172, 172, 0.2);
	}
	.menu::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(173, 172, 172, 0.2);
		border-radius: 0;
		background: rgba(173, 172, 172, 0.1);
	}
</style>
