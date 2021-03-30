<template>
	<div class="hello" @click="close">
			<div class="row no-gutters shop">
				<!-- 头部选择按钮 -->
				<div class="col-lg-12  col-md-12  footer " v-show="fields" style="margin-top:20px;margin-bottom:20px">
					<button @click="add" v-if="option.new_add" :disabled="newly_build" :class="{color:btn_build}" style="outline: none;"><span class="iconfont icon-plus-creat"></span>新增</button>
					<button @click="updata" v-if="option.updata" :disabled="isedit" :class="{color:btn_edit}" style="outline: none;"><span class="iconfont icon-bianji"></span>编辑</button>					
					<button @click="submit(fields)" v-if="option.updata_add" :disabled="preservation" :class="{color:btn_preservation}"
					 style="outline: none;"><span class="iconfont icon-baocun"></span>保存</button>
					<button v-if="option.revoke" @click="bt_revoke" :disabled="revoke" :class="{color:btn_revoke}" style="outline: none;"><span class="iconfont icon-chexiao"></span>撤销</button>
					<button @click="del" v-if="option.del" :disabled="isdel" :class="{color:btn_del}" style="outline: none;background:#d26267"><span class="iconfont icon-shanchu"></span>删除</button>
					<button @click="data_export" v-if="option.del" :disabled="isdel" :class="{color:btn_del}" style="outline: none;"><span class="iconfont icon-zujian-icon-13"></span>导出</button>
					 <div class="modal-body" style="display:inline-block">
								
								<!-- 当点击添加的时候要遍历这个元素 -->
						  <div class="modal-body modal-pos" style="display:inline-block">
							  <select class="body-sty" v-model="project_box" >
								  <!-- <option disabled value="">请选择</option> -->
								  <option v-for="(item,index) in project_condition" :key="index" :value="item">{{item}}</option>
								</select>
								<i @click="accumulation" :style="{'vertical-align':align}">+</i>
							  <div style="display:inline-block;width:500px;z-index:1000" :style="{'vertical-align':align}" v-for="(item,index) in add_num" :key="index">
							  <select class="body-sle" v-model="project_slected[item]" :style="{'vertical-align':align}">
								  <!-- <option disabled value="">请选择</option> -->
								  <option v-for="(item,index) in head_data" :key="index" :value="item">{{item}}</option>
							  </select>
							  <select class="body-sle-one" v-model="type_slected[item]" :style="{'vertical-align':align}">
								  <!-- <option disabled value="">请选择</option> -->
								  <option v-for="(item,index) in query_scope" :key="index" :value="item" >{{item}}</option>
							  </select>
							  <input type="text" :style="{'vertical-align':align}" class="body-input" placeholder="输入条件值" v-model="condition[item]">
							  <i class="body-i" :style="{'vertical-align':align}" @click="Query_remove(item)" :key="index">-</i>
							</div>
  					    </div>
						</div>
						<button @click="lookup" style="width:54px; outline: none;margin-left:145px;background:#fff;color:#000;border:1px solid #808080;cursor: pointer"><span class="iconfont icon-chaxun"></span>查询</button>
						<button @click="refresh" style="outline: none;cursor: pointer"><span class="iconfont icon-shuaxin"></span>刷新</button>
				</div>
				<div class="col-lg-12  col-md-12 table-responsive" style="overflow: auto ;" :style="{overflow: 'auto',height:offset_height+'px'}" @scroll="table_cont" >
						<!-- :style="{maxHeight:fontSize+'px'"} -->
					<table class="table table-bordered text-nowrap " style="" >
						<!-- 表格头部 固定头部当设置overflow:auto时当超出高度时会出现滚动条设置translate后表头始终距离前一个元素滚动条的距离，后面的内容会在滚动的时候覆盖在表头底部-->
						<thead class="thead" >
							<tr>
								<!-- <td v-show="fields" class="fixed" ></td> -->
								<th v-show="fields" class="fixed" :style="{transform:'translateY('+tans_late+'px)'}"><input type="checkbox" class="box_size" v-model="btn_check" @change="tr_flag && btn_check_cli()"></th>
								<th class="thb" v-for="(head,index) in fields" :key="index" :style="{transform:'translateY('+tans_late+'px)'}">{{head.Comment}} 
									<span v-show="head.isSort" @click="sort_flag && data_sort(head.Name)" style="display: inline-block;vertical-align: -3px;">
										<i class="fa-up" :class="[isup]"></i>
										<i class="fa-down" :class="[isdown]"></i>
									</span>
								</th>
							</tr>
						</thead>
						
						<!-- 表格数据 -->
						<tbody id="tbody" >
							<!-- 新建的列表数据   当有多个循环的时候key值不能重复-->
							<tr v-for="(num,index1) in num" :key="index1" :class="{list_color:true}" style="margin-top: 0;  align-self:flex-end">
								<!-- <td class="fixed">{{index1+child_index_page}}</td> -->
								<td class="fixed"><input type="checkbox" class="box_size" v-model="add_checkeds" :value="index1" ></td>
								<td class="fixed-list" v-for="(le,index) in len" :key="index">
									
									<!-- 输入框根据索引显示内容当添加新项目时会把之前的索引添加到现有的索引中所以会把输入框的内容添加到新的项目中 :id="'fld'+index"-->
									<input v-if="le.check_show" type="checkbox" v-model="check[index1+'-'+index]">
									<input v-if="le.input_show" type="text" v-model="msg[index1+'-'+index]">
									<input v-if="le.textarea_show" type="text" v-model="msg[index1+'-'+index]">
									<!-- <textarea v-if="le.textarea_show" v-model="msg[index1+'-'+index]"  :key="index" rows="1"></textarea> -->
									<input v-if="le.password_show" type="text" v-model="msg[index1+'-'+index]">
									<input v-if="le.date_time_show" type="text" v-model="msg[index1+'-'+index]">
									
									<span v-if="le.span_show" @click="serch(index1,index)" class="serch_box"><i class="fa fa-ellipsis-h fa-1x"></i></span>
										
								</td>
								<!-- <div style="position:relative;right:600px;top:100px;background:red"> -->
								
								<!-- </div>						 -->
							</tr>
							
							<!-- 初始请求的列表数据 -->
							<!-- 编辑时把数据填充到输入框中 加上item是为了避免key值的和上一个tr的key值重复-->
							<!-- <tr v-for="(item,index) in rows" :class="{list_color:dynamic[index]==item}" :key="index+item" 
                            @click="tr_flag && tr_list($event,item,index)" @mouseenter="if_updata(index,item)" @mouseleave="else_updata(index)"> -->
							<tr v-for="(item,index) in rows" :class="{list_color:dynamic[index]==item}" :key="index+item" >
								<!-- {{item}} -->
								<!-- <td class="fixed">{{index+1+child_index}} </td> -->
								<!-- 给每个复选框绑定不一样的v-model -->
								<!-- <td class="fixed"><input type="checkbox" v-model="btn_checkeds" :value="index"></td> -->
								<td class="fixed"><input type="checkbox" class="box_size" v-model="btn_checkeds" @change="tr_list(item,index)" :value="index"></td>
								 <!-- v-model="btn_checkeds[index]" -->
								<!-- 渲染多个tr project为对象的每一项-->
								<td class="fixed-list" v-for="(project,key,index_list) in item" :key="index_list" :title="project">
									<!-- 如果没有点击编辑则直接是渲染的数据 -->
									<template v-if="edit_list[index]">
										{{project}}
									</template>
									<!-- 如果点击了编辑就渲染编辑后的数据 -->
									<template v-if="!edit_list[index]">
										<input v-if="(fields[index_list].type=='textarea')" :unselectable="!disabled_true[index]?'on':'off'" :readonly="!disabled_true[index]" type="text" v-model="rows[index][key]">
										<input v-if="(fields[index_list].type=='text'&&fields[index_list].Name!=response.PRIMARY&&fields[index_list].Readyonly!=true)" :unselectable="!disabled_true[index]?'on':'off'" :readonly="!disabled_true[index]" type="text" v-model="rows[index][key]">
										<input v-if="(fields[index_list].type=='password')" :unselectable="!disabled_true[index]?'on':'off'" :readonly="!disabled_true[index]" type="text" v-model="rows[index][key]">
										<input v-if="(fields[index_list].type=='date_time')" :unselectable="!disabled_true[index]?'on':'off'" :readonly="!disabled_true[index]" type="text" v-model="rows[index][key]">
                                        <span v-if="(fields[index_list].type=='text'&&fields[index_list].Name==response.PRIMARY)">{{project}}</span>
										<span v-if="(fields[index_list].type=='text'&&fields[index_list].Readyonly==true)">{{project}}</span>
										<span v-if="fields[index_list].Action!=undefined && disabled_true[index]" class="serch_box" @click="serch(index,index_list,key)"
									 ><i class="fa fa-ellipsis-h fa-1x "></i></span>
									</template>
								</td>
							</tr>
							
						</tbody>
					</table>
				</div>
			</div>
			<!-- 如果没有数据显示 -->
		<div style="margin-top: 100px;margin-left: 50%;color: #666;" v-show="!fields">暂无数据</div>
		<!-- 底部结构 -->
			<div class="row row-a" >
				<div class="popup" v-if="show_hide">
					<p class="content">确认要删除选择的条目吗</p>
					<button class="confirm" @click="confirm_click" style="outline: none;">确认</button>
					<button class="cancel" @click="cancel_click" style="outline: none;">取消</button>
				</div>
				<div class="col-lg-4 offset-lg-8 col-md-4 total-page footer">
					<nav aria-label="Page navigation">
					  <ul class="pagination pagination-lg">
					    <li>
					      <!-- <span aria-label="Previous"> -->
					        <b aria-hidden="true" style="border:none">{{[increasing+project_data.records]}}</b>
					      <!-- </span> -->
					    </li>
						<li v-show="is_previous_page">
					      <span aria-label="Next" @click="previous_page">
					        <span aria-hidden="true">上一页</span>
					      </span>
					    </li>
						<li v-show="is_home_page">
					      <span aria-label="Next" @click="home_page">
					        <span aria-hidden="true">首页</span>
					      </span>
					    </li>
						<li v-show="is_previous_ellipsis">...</li>
					    <li v-if="first_flag"><span @click="!first_box_bg && submit_input(page_init.first)" :class="{'first-box-bg':first_box_bg}">{{page_init.first}}</span></li>
    					<li v-if="second_flag"><span @click="!second_box_bg && submit_input(page_init.second)" :class="{'first-box-bg':second_box_bg}">{{page_init.second}}</span></li>
    					<li v-if="third_flag"><span @click="!third_box_bg && submit_input(page_init.third)" :class="{'first-box-bg':third_box_bg}">{{page_init.third}}</span></li>
						<li v-show="is_next_ellipsis">...</li>
					    <li v-show="is_Last_page">
					      <span aria-label="Next" @click="last_page">
					        <span aria-hidden="true">尾页</span>
					      </span>
					    </li>
						<li v-show="is_next_page">
					      <span aria-label="Next" @click="next_page">
					        <span aria-hidden="true">下一页</span>
					      </span>
					    </li>
					  </ul>
					</nav>
				</div>
				<div v-if="!no_data" class="col-lg-4  col-md-2  total">没有数据</div>
			</div>
			  <div style="width: 100%;height: 100%;background: #e2e2e2;color: #e2e2e2;position: fixed;top: 0;opacity: .5;" v-if="box_data.project_engineering||box_data.tank_channel||
  			box_data.user||box_data.time||box_data.edit||box_data.sel||box_data.mail||box_data.items||box_data.sel_shows||box_data.jurisdiction||box_data.role_edit||box_data.tips"></div>
			<!-- 项目工程组件 -->
	<template>
		<ppr v-if="box_data.project_engineering" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" :box_fun="box_fun" @close_project="close_project" @input_data="input_data">{{head_title}}</ppr>
		<!-- 坦克活动数据中的对应渠道组件 -->
		<pro v-if="box_data.tank_channel" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" :box_fun="box_fun" @close_project="close_project" @channel_input_data="channel_input_data" ></pro>
		<!-- 管理员密码组件 -->
		<user-pas v-if="box_data.user" :rule_data="rule_data" @pas_confirm="pas_confirm" @close_project="close_project"></user-pas>
		<!-- 时间的组件 -->
		<prr v-if="box_data.time" :rule_data="rule_data" :clientY="clientY" :clientX="clientX" @close_project="close_project" @time_data="time_data"></prr>
		<!-- 编辑框的组件 -->
		<edit v-if="box_data.edit" :rule_data="rule_data" @edit_confirm="edit_confirm" @close_project="close_project"></edit>
		<!-- 封停角色 用户ID -->
		<select-service v-if="box_data.sel" :rule_data="rule_data" @close_project="close_project" ></select-service>
		<!-- 系统邮件 条件组件 -->
		<mail-conditions v-if="box_data.mail" @input_data="input_data" :rule_data="rule_data" @close_project="close_project"></mail-conditions>
		<!--邮件物品 编辑物品  -->
		<edit-items v-if="box_data.items" :rule_data="rule_data" :selecte_data="selecte_data" @sbmit_data="sbmit_data" @sel_goods="sel_goods"  @close_edit="close_edit"></edit-items>
		 <!-- 选择物品的组件 -->
		<select-items v-if="box_data.sel_shows" :box_fun="box_fun" :rule_data="rule_data"  @close_select="close_select" @selecte_btn="selecte_btn"></select-items>
		<!-- 权限组件 -->
		<jurisdiction v-if="box_data.jurisdiction" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" @close_project="close_project" @input_data="input_data"></jurisdiction>
		<!-- 权限数组 -->
		<auth-role-edit v-if="box_data.role_edit" :rule_data="rule_data"  @close_project="close_project" @auth_data="auth_data"></auth-role-edit>
		<!-- 提示组件 -->
		<tips v-if="box_data.tips" :current_state="current_state"></tips>     
	</template>
			</div>	
		
	<!-- </div>    -->
</template>
<script>
	import ppr from "../box/ppr.vue";
	import pro from "../box/Project_engineering.vue";
	import userPas from "../box/user_pas.vue";
	import prr from "../box/p_time.vue";
	import edit from "../box/edit.vue";
	import selectService from "../box/select_service";
	import mailConditions from "../box/mail_conditions";
	import editItems from "../box/edit_items";
	import selectItems from "../box/select_items";
	import jurisdiction from "../box/jurisdiction";
	import authRoleEdit from "../box/auth_role_edit";
	import tips from "../box/tips";
	export default {
		name: 'shop',
		data() {
			return {
				//兼容ie的样式
				align:'top',
				//第一个按钮是否显示
				first_flag:true,
				//第二个按钮是否显示
				second_flag:true,
				//第三个按钮是否显示
				third_flag:true,
				//第一个按钮的样式
				first_box_bg:false,
				//第二个按钮的样式
				second_box_bg:false,
				//第三个按钮的样式
				third_box_bg:false,
				//是否显示尾页按钮
				is_Last_page:true,
				//是否显示下一页按钮
				is_next_page:true,
				//是否显示页数后面的省略号
				is_next_ellipsis:true,
				//是否显示页数中前面的省略号
				is_previous_ellipsis:false,
				//是否显示前一页按钮
				is_previous_page:false,
				//是否显示首页按钮
				is_home_page:false,
				//初始的页数按钮
			    page_init:{
					first:1,
					second:2,
					third:3
				},
				//输入框禁止输入
				disabled_true:{},
				//不同组件的标题
				head_title:'',
				clientX:null,
				clientY:null,
				//是否禁止点击正反序的三角
				sort_flag:true,
				//当是多行文本时的样式控件
				// is_load_textarea:false,
				//当前的状态
				current_state:'',
				//表头滚动的状态
				tans_late:'',
				//数据的的副本
				project_data_copy:this.project_data.records,
				//当点击添加的时候累加
				increasing:0,
				//第多少条数据
				child_index_page:1,
				//当屏幕高度是1080时的最大高度
				// fontSize:775,
				//数据列表颜色控制
				dynamic:{},
				rule_data:null,
				//查询的显示框
				query_show:false,
				//是否输入页数
				input_page: false,
				userInfo: null,
				//child_index:this.sub_index,
				//第一页的默认的序号
				child_index: 0,
				//每一页的第一条的条数
				child_index_total: 16,
				//默认新建时遍历的多少条数据
				num: 0,
				len: [],
				//输入框数据
				msg: [],
				//是否显示输入框
				edit: false,
				//是否显示复选框
				chected: false,
				//动态复选框
				check: [],
				//判断底部按钮的数据
				option: {
					//删除
					del: true,
					//保存 移除
					new_add: true,
					//编辑
					updata: true,
					//保存
					updata_add: true,
					//撤销
					revoke:true
				},
				//排序的正反三角
				sort: false,
				isup: 'itup',
				isdown: 'itdown',
				//保存的禁止点击
				preservation: true,
				//撤销的禁止点击
				revoke: true,
				//编辑的禁止点击
				isedit: false,
				//删除的禁止点击
				isdel: false,
				//新建的禁止点击
				newly_build: false,
				//是否禁用的选项
				btn_preservation: true,
				btn_revoke: true,
				btn_edit: false,
				btn_del: false,
				btn_build: false,
				//总按钮是否选中
				btn_check: '',
				//列表按钮
				btn_checkeds: [],
				//添加复选框
				add_checkeds:[],
				//索引号
				list_index: null,
				//多个索引号
				list_indexes: [],
				//删除弹框
				show_hide: false,
				//确认取消是否执行
				confirm_data: null,
				//列表是否有选中的按钮
				list_some: '',
				//编辑列表的数据
				edit_list: {},
				//编辑更新的数据对象
				updata_edit: [],
				//当总项目条数大于16时显示一页16条数据（默认一页显示多少条数据）
				data_page: 16,
				//查询时的查询条件的数组
				head_data:[],
				//查询时的判断条件
				query_scope:['等于','不包含','不等于','大于','大于等于','小于','小于等于','包含','开头是','开头不是','结尾是','结尾不是','为空','不为空'],
				//查询代号
				query_code:['eq','nc','ne','gt','ge','lt','le','cn','bw','bn','ew','en','nu','nn'],
				//查询多条数据累加选项
				add_num:[],
				//查询的添加和移除
				condition:[],
				//搜索输入框的不同数据
				search_data:-1,
				//项目选择框
				project_slected:[],
				//类型选择框
				type_slected:[],
				//项目条件
				project_condition:['满足所有条件','满足任一条件'],
				//项目选择框
				project_box:'',
				//页数（默认显示第一页）
				page:1,
				//弹框数据
				box_data:{
					project_engineering:false,
					tank_channel:false,
					user:false,
					time:false,
					edit:false,
					sel:false,
					mail:false,
					items:false,
				    sel_shows:false,
					jurisdiction:false,
					role_edit:false,
					tips:false
				},
				//传递的头部数据
				ppr_action:null,
				//数据索引当弹框数据确认数据时输入框的值变化
				box_index:{
					index1:null,
					index:null,
					box_key:null,
					
				},
				//每条数据是否点击的标志
				tr_flag:true,
				//时间选择标志
				//弹框的函数数据
				box_fun:null,
				//弹框数据
				box_res:[],
				//权限数组中的数据
				sort:'desc',
				//获取数据框的高度
				offset_height:null,
				//查询的条件
				Query_project:null,
				//缓存排序结果、
				sort_name:'',
			}
		},
		components:{
			   ppr,
			   pro,
			   userPas,
			   prr,
			   edit,
			   selectService,
			   mailConditions,
			   editItems,
			   selectItems,
			   jurisdiction,
			   authRoleEdit,
			   tips,
		},
		created(){},
		mounted() {			
			//获取用户信息
			this.conten_data();
			//分页的显示模式
			this.first_page();
			//查询的接口
			this.query();
			//计算显示条数
			// this.data_num();
			//判断是不是ie浏览器
			this.isIE();
			//根据屏幕的高度计算数据的显示条数
			this.count_page();
		},
		computed: {
			//计算当总数据不足16条时有多少条显示到多少条
			// count: function() {
			// 	//当前页的数据条数是否比每页设定的条数小
			// 	if (this.rows.length < this.data_page) {
			// 		return this.rows.length+(this.page*this.data_page-this.data_page)+this.increasing;//页数*16-16
			// 	} else {
			// 		return this.child_index_total
			// 	}
			// },
			//计算是否显示输入页数的输入框
			input_box: function() {
				//如果输入了页数执行
				if (this.input_page == false) {
					return this.project_data.page
				} else {
					return
				}
			}
		},
		props: {
			// flag_head:Boolean,
			//内容数据
			rows: Array,
			//头部数据
			fields: Array,
			//动态内容页数
			project_data: Object,
			//项目索引
			sub_index: Number,
			//项目路由
			sub_url: String,
			//请求的数据接口地址
			response: Object,
			//父组件数据请求完成的标志
			istrue: Object,
			//查询接口请求完成标志
			isquery:Boolean,
			//查询的数据是否为空
			no_data:Boolean,
		},
		methods: {
			//根据屏幕的高度计算显示的页数
			count_page(){
				//计算显示框的高度
				this.offset_height=window.screen.height-355
				//根据屏幕的高度计算显示的页数
				this.data_page=parseInt(this.offset_height/43-1);
				this.child_index_total=this.data_page
			},
			//判断是不是Firefox浏览器
			isIE() {
				// alert(1)
  				if (navigator.userAgent.indexOf('Firefox') >= 0){
					//   alert(0)
					  this.align='bottom'
				  }
  			},
			//获取用户信息
			conten_data(){
				let userInfo = window.sessionStorage.getItem('userInfo');
				this.userInfo = userInfo;
				//当页数的值为undefined时默认显示第一页
				if (this.project_data.page == undefined) {
					this.project_data.page = 1;
				}
				//当数据为空时给rows赋值一个对象
				if (JSON.toString(this.rows) == "[]") {
					this.rows = [{
						name: "name"
					}];
				}
			},
			//根据屏幕的高端判断显示的数据条数
			// data_num(){
			// 	this.data_page=parseInt(window.screen.height/65);
			// 	this.child_index_total=this.data_page
			// },
			//判断底部按钮的显示隐藏
			operation_isshow(){
				//如果没有数据信息
				if (this.response != null) {
				//没有添加的时候
				if (this.response.JQ_GRID_ADD == undefined) {
					this.option.new_add = false
				}
				//没有删除的时候
				if (this.response.JQ_GRID_DEL == undefined) {
					this.option.del = false
				}
				//没有更新的时候
				if (this.response.JQ_GRID_UPDATE == undefined) {
					this.option.updata = false
				}
				//没有保存的时候
				if (this.response.JQ_GRID_UPDATE == undefined && this.response.JQ_GRID_ADD == undefined) {
					this.option.updata_add = false
				}
				};
			},
			//导出
			data_export(){
				this.axios.post(this.api+'/bin/Warship/Launcher/tbl_server/to_excel',{userInfo: this.userInfo}).then((res)=>{
					window.location.href=this.api+res.data.url+'?type=excel'
				})
				
			},
			//第一页默认的按钮样式、
			first_page(){
				if(parseInt(this.project_data.total)==1||parseInt(this.project_data.total)==0){
					//第一个按钮是否显示
					this.first_flag=false;
					//第二个按钮是否显示
					this.second_flag=false;
					//第三个按钮是否显示
					this.third_flag=false;
					//是否显示尾页按钮
					this.is_Last_page=false;
					//是否显示下一页按钮
					this.is_next_page=false;
					//是否显示页数后面的省略号
					this.is_next_ellipsis=false;
					//是否显示页数中前面的省略号
					this.is_previous_ellipsis=false;
					//是否显示前一页按钮
					this.is_previous_page=false;
					//是否显示首页按钮
					this.is_home_page=false;
				}else if(parseInt(this.project_data.total)==2){
					//第一个按钮的样式
					this.first_box_bg=true;
					//第三个按钮是否显示
					this.third_flag=false;
					//是否显示尾页按钮
					this.is_Last_page=false;
					//是否显示下一页按钮
					this.is_next_page=true;
					//是否显示页数后面的省略号
					this.is_next_ellipsis=false;
				}else if(parseInt(this.project_data.total)==3){
					//第一个按钮的样式
					this.first_box_bg=true;
					//是否显示尾页按钮
					this.is_Last_page=true;
					//是否显示下一页按钮
					this.is_next_page=true;
					//是否显示页数后面的省略号
					this.is_next_ellipsis=true;
				}else{
					//第一个按钮的样式
					this.first_box_bg=true;
				}
				
			},
			//请求所有弹框的数据根据字段显示是否有查询的三个点
			serch_fn(){
				//接口需要当前的时间
				let time=new Date().getTime(); 
				this.axios.post(this.api+'/bin/Admin/Admin/tbl_action_data/jqgrid_oper/load',{ 
				  _search: false,
				  nd: time,
				  rows: 50,
				  page: 1,
				  sidx: "fld_record_id",
				  sord: 'desc',
				  userInfo:this.userInfo
    			}).then(res=>{
					//遍历响应数据
					res.data.rows.forEach((item,index)=>{
						//如果是时间字段或者没有接口函数就不push进数组
						if(!(item.fld_action_name=="edit_date")&&!(item.fld_function=="")){
						  this.box_res.push(item);
						}
					 }
					)
				});
			},
			//固定表头
			table_cont(e){
				//滚动时元素距离滚动条的高度
				// this.tans_late=e.target.scrollTop;

				//滚动节流函数
					var tur = true;
					var late=()=>{
						this.tans_late=e.target.scrollTop;
						tur=true;
					};
					if(tur){
						if(window.navigator.userAgent.indexOf("Chrome") > -1||navigator.userAgent.indexOf('Firefox') >= 0){
        				late();
      				}else{
						setTimeout(late,100);
						tur=false;
					  }
						
					}
				},
			//将选中的数据放在输入框中
			sbmit_data(data){
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_edit();
			},
			//选择的数据列表，显示在别的组件
			selecte_btn(data){
				this.box_data.sel_shows=false;
				this.selecte_data=data;
				this.box_data.items=true;
			},
			//权限数组组件输入值
			auth_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					// alert(0)
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					// alert(1)
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_project();
			},
			//关闭编辑物品框
			close_edit(){
				if(this.box_data.items==true){
				 	this.box_data.items=false;
				 }
			},
			//关闭选择物品框
			close_select(){
				if(this.box_data.sel_shows==true){
				 	this.box_data.sel_shows=false;
				 }
			},
			//物品选择的弹框
			sel_goods(){
				this.box_data.sel_shows=true;
				this.box_data.items=false;
			},
			//管理员密码组件输入值
			pas_confirm(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.box_data.user=false;
			},
			//编辑内容组件输入值
			edit_confirm(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_project();
			},
			//时间的选择组件
			time_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_project();
			},
			//让输入框中的值为弹框中的输入值  活动数据渠道组件
			channel_input_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					console.log(this.box_index.box_key)
					console.log(this.rows[this.box_index.index1][this.box_index.box_key])
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_project();
			},
			//让输入框中的值为弹框中输入的值  项目工程组件
			input_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					 this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				this.close_project();
			},
			//关闭弹出框
			close_project(){
				if(this.box_data.project_engineering==true){
					this.box_data.project_engineering=false;
				};
				if(this.box_data.tank_channel==true){
					this.box_data.tank_channel=false;
				};
				if(this.box_data.time==true){
					this.box_data.time=false;
				};
				if(this.box_data.edit==true){
					this.box_data.edit=false
				};
				if(this.box_data.sel==true){
					this.box_data.sel=false
				};
				if(this.box_data.mail==true){
					this.box_data.mail=false
				};
				if(this.box_data.user==true){
					this.box_data.user=false
				};
				if(this.box_data.jurisdiction==true){
					this.box_data.jurisdiction=false;
				};
				if(this.box_data.role_edit==true){
					// alert(2)
					this.box_data.role_edit=false
				}
			},
			//查找
			lookup(){
				// this.condition=[];
				console.log(this.condition)
				this.child_index = 0;
				this.page=1;
				//获取选框中的值并赋值请求参数
				let request_parameters={};
				request_parameters.groupOp=this.project_box;
				//选泽的是哪一项
				if(request_parameters.groupOp=='满足所有条件'){
					request_parameters.groupOp='AND'
				}else{
					request_parameters.groupOp='OR'
				}
				//当查询的时候看有多少条数据
				request_parameters.rules=[];
				//遍历有多少组数据
				this.add_num.forEach((item,index)=>{
					console.log(item)
					//有几条数据就在request_parameters对象中添加几个对象
					request_parameters.rules.push({});
					//遍历头部数据
					for(var i=0;i<this.fields.length;i++){
						//因为有的项目是不能查询的点击查询时会判断哪个字段不能查询此处把不能查询的遍历出去
						if(this.fields[i].Comment==this.project_slected[index]){
						request_parameters.rules[index].field=this.fields[i].Name;
						}
					}
					//遍历当前选择的是那条判断条件
					this.query_scope.forEach((item,i)=>{
						if(item==this.type_slected[index]){
							request_parameters.rules[index].op=this.query_code[i]
						}
					})
					if(this.condition.length>0){
						request_parameters.rules[index].data=this.condition[index];
					}else{
						return false
					}
						
				})
				this.Query_project=JSON.stringify(request_parameters);
				this.query_data=project;
				console.log(project)
				this.$emit('query',this.sub_url, this.child_index,this.Query_project,this.sort);
				//让选项数据初始化一条
				this.add_num=[];
				//查询时让弹窗关闭
				// this.close_win();
				//返回初始状态
				this.condition=[];
				this.type_slected=[];
				this.project_slected=[];
				this.head_data=[];
			},
			//重置
			// box_reset(){
			// 	this.condition=[];
			// },
			//移除查询数据中的某一条
			Query_remove(p){
				//遍历数组中添加的数据有多少移除点击的项
				console.log(p,this.add_num)
					this.add_num=this.add_num.filter((item)=>{return p!=item})
					console.log(this.add_num)
			},
			//查询多条数据累加选项
			accumulation(){		
				//当点击添加的加号时给数组添加不同的项以便给input添加不同的v-model
				this.search_data+=1;
				this.add_num.push(this.search_data);
				// console.log(this.search_data)
				// console.log(this.add_num)
				// this.add_num+=1;
				//每添加一项都会在选择框中添加第一项数据
				this.project_slected.push(this.head_data[0]);
				this.type_slected.push(this.query_scope[0]);
				this.condition.push('')
				// console.log(this.condition)
			},
			//关闭查询弹窗
			// close_win(){
			// 	this.query_show=false;
			// },
			//查询
			query(){
				// alert(0)
				// this.query_show=true;
				// this.search_data+=1;
				// console.log(this.search_data)
				// this.add_num.push(this.search_data);
				this.project_box=this.project_condition[0];
				this.fields.forEach((item,index) =>{
					//当点击查询的时候判断需要查寻的条件有哪些
					if(item.Name!="fld_deleted"&&item.Name!=this.response.PRIMARY&&item.Search==1){
						//把需要的条件放在一个数组中
						this.head_data.push(item.Comment);
						//在动态的选择框中始终把第一项放在框中
									}				
				})
				this.project_slected.push(this.head_data[0]);
				this.type_slected.push(this.query_scope[0]);
				// this.condition.push('')
				// console.log(this.condition)
			},
			//关闭输入框
			close() {
				this.input_page = false;
			},
			//enter事件提交请请求的页数点击底部的第几页出现输入框
			submit_input(data) {
				//输入框的数据的判断
				// let page = this.project_data.page;
				//如果表中的数据中有一页则只显示页数
				// if(parseInt(this.project_data.total)==2){
				// 	//第三个按钮是否显示
				// 	alert(1)
				// 	this.third_flag=false;
				// }
				// else{
					if(data==1){
						if(parseInt(this.project_data.total)==2){
							this.first_box_bg=true;
							this.is_previous_page=false;
							this.third_box_bg=false;
							this.second_box_bg=false;
							this.is_home_page=false;
							this.is_next_ellipsis=false;
							this.is_Last_page=false;
							this.is_next_page=true;
						}else if(parseInt(this.project_data.total)==3){
							this.first_box_bg=true;
							this.is_previous_page=false;
							this.third_box_bg=false;
							this.second_box_bg=false;
							this.is_home_page=false;
							this.is_next_ellipsis=true;
							this.is_previous_ellipsis=false;
							this.is_Last_page=true;
							this.is_next_page=true;
						}
						else{
							this.first_box_bg=true;
							this.is_previous_page=false;
							this.third_box_bg=false;
							this.second_box_bg=false;
							this.is_home_page=false;
							this.is_next_ellipsis=true;
							this.is_Last_page=true;
							this.is_next_page=true;
						}
				}
				else if(data==2){
					if(data<this.input_box){
						if(data==parseInt(this.project_data.total)-1){
						this.third_box_bg=false;
						this.second_box_bg=true;
						this.first_box_bg=false;
						this.is_next_page=true;
						}else{
							this.first_box_bg=false;
						this.is_previous_page=true;
						this.is_previous_ellipsis=false;
						this.third_box_bg=false;
						this.second_box_bg=true;
						this.is_home_page=false;
						this.page_init.first -=1
						this.page_init.second -=1
						this.page_init.third -=1
						}
					}else{
						this.second_box_bg=true;
						this.first_box_bg=false;
						this.third_box_bg=false;
						this.is_previous_page=true;
						this.is_home_page=false;	
					}					
				}
					else if(data==parseInt(this.project_data.total)){
						this.third_box_bg=true;
						this.second_box_bg=false;
						this.first_box_bg=false;
						this.is_next_ellipsis=false;
						this.is_Last_page=false;
						this.is_next_page=false;
						this.is_home_page=true;
						this.is_previous_page=true;
						this.is_previous_ellipsis=true;
					}else if(data>this.input_box){
						this.second_box_bg=true;
						this.first_box_bg=false;
						this.third_box_bg=false;
						this.is_home_page=true;
						this.is_previous_page=true;
						this.is_previous_ellipsis=true;
						this.page_init.first+=1
						this.page_init.second+=1
						this.page_init.third +=1
					}else if(data<this.input_box){
						if(data==parseInt(this.project_data.total)-1){
						this.third_box_bg=false;
						this.second_box_bg=true;
						this.first_box_bg=false;
						this.is_next_page=true;
						}else{
						this.second_box_bg=true;
						this.first_box_bg=false;
						this.third_box_bg=false;
						this.is_home_page=true;
						this.is_previous_page=true;
						this.is_previous_ellipsis=true;
						this.is_Last_page=true;
						this.is_next_ellipsis=true;
						this.page_init.first -=1
						this.page_init.second -=1
						this.page_init.third -=1
						}
					}
				let page = data;
				// if (this.project_data.page != '' && !isNaN(this.project_data.page) && Number(this.project_data.page) > 0 && Number(
				// 		this.project_data.page) <= parseInt(this.project_data.total)) {
					//当数据请求回来再执行下次方法
					if (this.istrue.isnext == true) {
						this.child_index = this.data_page * (page - 1);
						if (this.project_data.records - page * this.data_page >= 0) {
							this.child_index_total = this.data_page * page;
						} else {
							//最后一页的数据是16的几倍
							let positive_integer = window.parseInt(this.project_data.records / this.data_page);
							//最后一页的数据的总条数
							let mantissa = this.project_data.records - positive_integer * this.data_page;
							this.child_index_total = (positive_integer) * this.data_page + mantissa;
						}
						this.$emit('lookup', this.sub_url, this.child_index, page,this.sort)
					}
				// } else {
				// 	this.input_page = false;
				// 	this.child_index = 0;
				// 	this.child_index_total = this.data_page;
				// 	this.child_index_page=1;
				// 	this.$emit('lookup', this.sub_url, this.child_index, 1,this.sort)
				// 	return false;
				// }
				this.input_page = false;
				this.page=page;
				this.child_index_page=this.data_page*page-this.data_page+1;
				
			
			},
			//选择查找的页数当点击时出现输入框输入完成时点enter请求数据当没有点enter而是点击的别的地方不请求数据直接返回之前的状态
			select_input() {
				this.input_page = true;
			},
			//删除的确认点击
			confirm_click() {
				this.confirm_data = true;
				var ids = [];
				this.btn_checkeds.forEach((item, index) => {
						ids.push(this.rows[item][this.response.PRIMARY])
				})
				var ids_data = ids.join();
				if (this.confirm_data == true) {
					this.axios.post(this.api + this.response.JQ_GRID_DEL, {
						ids: ids_data,
						userInfo: this.userInfo
					}).then(res => {
						if (this.list_some == true) {
						this.btn_checkeds.forEach((item,i)=>{			
								this.edit_list[item] = false;
							})
							this.btn_checkeds=[];
							this.btn_check = false			
						}
						this.refresh()
					})
				}
				this.show_hide = false;
			},
			//删除的取消点击
			cancel_click() {
				this.confirm_data = false;
				this.show_hide = false;
				this.btn_checkeds=[];
				this.btn_check=false;
				this.dynamic={};
			},
			//列表复选框的选中和取消
			tr_list(item,i){
				// if(this.btn_checkeds.length==0){
				// 	this.btn_checkeds.push(i);
				// }else if(this.btn_checkeds.every((item,index)=>{return item!=i})){
				// 	this.btn_checkeds.push(i);
				// }else{
				// 	this.btn_checkeds=this.btn_checkeds.filter((item,index)=>{
				// 		return i!=item;
				// 	});
				// };
				// if(this.btn_checkeds.length>0){
				// 	this.btn_check=true;
				// 	this.list_some=true;
				// 	this.revoke = false;
 				// 	this.btn_revoke = false;
				// };
				// if(this.btn_checkeds.length==0){
				// 	this.btn_check=false;
				// };
				// //点击列表改变背景色
				// if(!this.dynamic[i]){
				// 	this.dynamic[i]=item;
				// }else{
				// 	this.dynamic[i]='';
				// }

				// console.log(this.btn_checkeds)
				//判断选中数组是否有值
				if(this.btn_checkeds.length>0){
					// this.edit_list[i] =true;
					// this.flag_up=false;
					//如果有值那么总复选框也选中
					this.btn_check=true;
					//列表选中标志
					this.list_some=true;
					//当选中后撤销的按钮可以点击然后取消选中
					this.revoke = false;
					//取消撤销禁用的样式
					 this.btn_revoke = false;
					//  console.log(this.btn_checkeds)
				}else{
					
					this.btn_check=false;
					this.list_some=false;
					this.revoke = true;
 					this.btn_revoke = true;
				
					// console.log(this.btn_checkeds)
					//如果没有值那么总复选框就不选中
					// this.btn_check=false;
				};
					//数据列表的颜色控制当复选框变化后如果dynamic的索引值为false给dynamic赋值item属性然后模板对比item值
				if(!this.dynamic[i]){
					this.dynamic[i]=item;
				}else{
					this.dynamic[i]='';
				}
			},
			//总按钮是否选中
			btn_check_cli() {
				if(this.btn_check==true){
					this.list_some=true;//表示列表中有选中项
					this.rows.forEach((item,i)=>{
							this.btn_checkeds.push(i);
							this.dynamic[i]=item;
					})
				}else{
					this.list_some=false;
					this.rows.forEach((item,i)=>{
						this.dynamic[i]='';
						this.btn_checkeds=this.btn_checkeds.filter((item,index)=>{
								return i!=item;
							});
					})		
						}
						// console.log(this.btn_checkeds)
			},
			//点击动态的数据项后边的三点请求不同的数据
			serch(index1,index,key) {
				//判断时间组件的位置
				this.clientX=event.clientX;
				this.clientY=event.clientY;
				//当两个组件相同数据不同时先把前一个组件关闭
				this.box_data.project_engineering==false;
				//每条数据的索引
				this.box_index.index1=index1;
				//每条数据中对象的索引
				this.box_index.index=index;
				//每条数据中的对象中的key
				this.box_index.box_key=key;
				// console.log(this.rule_data)
				//当是编辑的时候拿出输入框中的值，当是新建的时候拿出新建输入框中的值
				if(this.rows[index1]!=undefined){
					// alert(0)
					if(this.rows[index1][key]!=undefined){
						// alert(3)
					this.rule_data=this.rows[index1][key];
					}else{
						
					//如果是新建时会新建输入框中的值
					this.rule_data=this.msg[index1+'-'+index]
					// alert(2)
					}
				}else{
					// alert(1)					
					this.rule_data=this.msg[this.num-1+'-'+index]
				}
				
				// console.log(this.rows[index1][key])
				// console.log(this.msg[this.num-1+'-'+index])
				//当渲染同一个组件时刷新组件因为组件的数据不同
				for(var i in this.box_data){
					if(this.box_data[i]==true){
						this.box_data[i]=false
					}
				}
				//当点击查询时看
				// let time=new Date().getTime();
    			//请求的是编辑action的数据
    			// this.axios.post(this.api+'/bin/Admin/Admin/EditAction/jqgrid_oper/load',{
    			//   _search: false,
				//   nd: time,
				//   rows: 50,
				//   page: 1,
				//   sidx: this.response.PRIMARY,
				//   sord: 'desc',
				//   userInfo:this.userInfo
    			// }).then(res=>{
				  //判断当点击三个点时是哪个数据头，根据不同的数据头进行不同的接口请求
				let item=this.fields[index];
				this.box_res.forEach((item_in,index)=>{
					if(item_in.fld_action_name==item.Action){
						this.box_fun=JSON.parse(item_in.fld_function)	
					}
				})
				this.ppr_action=item.Action;
				this.ppr_action_param=item.ActionParam;
				
				// console.log(this.box_data.project_engineering)
				console.log(item.Action)
				// if(this.box_data.project_engineering==true){
				// 	this.box_data.project_engineering==false
				// }
				// alert(1)
				switch(item.Action){
						//判断头部三个点字段的值根据值请求不同的接口
						case "selecttion_typevalue":
								 //action中所有的数据项
							// this.box_data.project_engineering=false;
							setTimeout(()=>{this.box_data.project_engineering=true;},(0))
							this.head_title='--选择--'
							break;
						case "selecttion_appliction":
							// alert(0)
							// if(this.box_data.project_engineering==true){
							// 	this.box_data.project_engineering=false
							// }else{
								
							// }
							setTimeout(()=>{this.box_data.project_engineering=true;},(0))
							this.head_title='--选择应用--'
							this.box_data.edit=false;
							break;
						case "role_rule_edit":
							// alert("角色 权限数组 直接返回的页面，暂无接口");
							this.box_data.role_edit=true;
							break;
						case "edit_content":
							// alert("模板参数，直接返回的页面，暂无数据");
							setTimeout(()=>{this.box_data.edit=true;},0)
							this.box_data.project_engineering=false;
							break;
						case "edit_password":
							this.box_data.user=true;
							this.box_data.jurisdiction=false;
							break;
						case "user_role_edit":
							// alert("用户 权限 直接返回的页面 暂无接口");
							// alert(0)
							this.box_data.jurisdiction=true;
							this.box_data.user=false;
							break;
						case "selecttion_typeid":
							// alert(2)
							setTimeout(()=>{this.box_data.project_engineering=true;},(0))
							this.head_title='--选择应用类型--';
							// this.box_data.project_engineering=true;
							break;
						case "edit_date_time":
							// alert(21)
							//当点击了时间的三点后先把组件设置为false也就是不显示组件，当同步执行完后再设置为true
							this.box_data.time=false;
							setTimeout(()=>{this.box_data.time=true;},(0))
							break;
						case "SelectMoreClientPacketTank":
							setTimeout(()=>{this.box_data.tank_channel=true;},0)
							// this.box_data.tank_channel=true;
							break;
						case "ServerGroupChooseTank":
							setTimeout(()=>{this.box_data.tank_channel=true;},0)
							// this.box_data.tank_channel=true;
							break;
						case "ItemArrayEditorTank":
							this.box_data.items=true;
							this.selecte_data=[];
							break;
						case "SelectClientPacketTank":
							this.box_data.project_engineering=true;
							this.head_title='--选择发行包--';
							break;
						case "SelectGiftPackageTank":
							// this.box_data.project_engineering=true;
							// this.box_data.project_engineering=false;
							setTimeout(()=>{this.box_data.project_engineering=true;},(0))
							this.head_title='--选择礼包--';
							break;
						case "QueryRoleTank":
							this.box_data.sel=true;
							break;
						case "QueryUserTank":
							this.box_data.sel=true;
							break;
						case "EditConditionTank":
							this.box_data.mail=true;
							break;
						case "SelectServerGroupTank":
							this.box_data.project_engineering=true;
							this.head_title='--选择服务器分组--';
							break;
						case "SelectChargeItemTank":
							this.box_data.project_engineering=true;
							break;
						case "SelectMailTemplate":
							this.box_data.project_engineering=true;
							this.head_title='--选择邮件模板--';
							// alert(1)
							break;
						case "ACTION_COLUMNS_URL":
							this.box_data.project_engineering=true;
							break;
						case "select_gift_batch_warship":
							this.box_data.project_engineering=true;
							this.head_title='--选择礼包生成批次--';
							break;
						case "select_gift_package_warship":
							//2
							alert('没有数据')
							break;
						case "select_package_channel_more":
							alert('没有数据')
							break;
						case "ItemArrayEditor_warship":
							alert('没有数据')
							break;
						case "serverChoose_warship":
							//4
							alert('没有数据')
							break;
						case "packageChoose":
							//2
							alert('没有数据')
							break;
						case "serverChooseOne_warship":
							alert('没有数据')
							break;
						}
						
				// })
			},
			//刷新
			refresh() {
				// alert(1)
				this.sort_flag=true;
				if(this.istrue.isrefresh==true){
				var total=this.child_index_total;
				this.project_data_copy=this.project_data.records+this.num;
				this.bt_revoke()
				this.$emit('parent_refresh', this.sub_url, this.sort,this.project_data.page);
				// this.$emit('parent_refresh', this.sub_url, this.sort,this.project_data.page);
				this.list_some =false;
				this.dynamic={};
				this.btn_check = false;
				this.increasing=0;
					if(total==this.project_data_copy){
						this.child_index_total=total;
					}
				}
				this.disabled_true={};
				// console.log(this.disabled_true)
			},
			//撤销
			bt_revoke() {
				// this.disabled_true=true;
				this.sort_flag=true;
				this.child_index_total-=this.num;
				//当点击时把新建取消
				this.num = 0;
				//点击撤销是序号也跟着减少
				this.child_index =this.data_page*this.project_data.page-this.data_page;
				//保存的禁止点击
				this.preservation = true;
				//撤销的禁止点击
				this.revoke = true;
				//编辑的禁止点击
				this.isedit = false;
				//删除的禁止点击
				this.isdel = false;
				//新建的禁止点击
				this.newly_build= false,
					//是否禁用的选项
					this.btn_preservation = true;
				this.btn_revoke = true;
				this.btn_del = false;
				this.btn_edit = false;
				this.btn_build = false;
				
				
				// 
				//当编辑的时候撤销编辑
				if (this.list_some == true||this.btn_checkeds.length>0) {
					alert(1)
						//取消选中项中的值
						if (this.btn_checkeds.length>0) {
							this.btn_checkeds.forEach((item,i)=>{
								// alert(1)
								// if(this.rule_data!=undefined&&this.num!=0){
										// console.log(this.box_index.index1,this.box_index.box_key)
										//当撤销时列表输入框返回之前的值新建撤销时不执行判断
										// this.rows[item][this.box_index.box_key]=this.rule_data;
									// }
								// console.log(item)
								// this.updata_edit.push(this.rows[item]);
								//取消相中项
								this.edit_list[item] = false;
							})
							//复选框清空 总复选框为false
							this.btn_checkeds=[];
							this.btn_check = false;
						}
						//编辑时候撤销重新刷新数据
						// this.$emit('parent_refresh', this.sub_url, this.sort,this.project_data.page);
						// this.refresh()
						this.disabled_true={};
				}
				this.tr_flag=true;
				//把之前保存的选中数清除
				this.list_some =false;
				this.dynamic={};
				this.btn_check = false;
				this.increasing=0;
				this.msg = [];
				this.check = [];
				
			},
			datetime2zone_x(_date_time, _zone) {
				// console.log(_date_time.getTime(),_zone)
				// console.log(typeof _date_time)
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
			    if (!_date_time){
					return "N/A";
					}
					//时区毫秒数
			    var office = UTC_ZONE["UTC+0000"];
			    var temp_date = null;
			    if (typeof _date_time == "string") {
					// alert(12)
			        if (_date_time == "1970-01-01 00:00:00"){
						 return "N/A";
					}
			           
					if (_date_time == "0000-00-00 00:00:00"){
						 return "N/A";
					}
			           
			        if (_date_time == "null"){
						return "N/A";
					}
			            
			        if (_date_time.indexOf("UTC") < 0){
						// alert(1)
					 _date_time += " UTC+0000";
			        temp_date = new Date(_date_time);
					}
					 
				}else{
						temp_date = _date_time;
					}

			    function to_2_str(_value) {
			        if (_value < 10)
			            return "0" + _value;
			        else
			            return _value;
			    }
			    // console.log(temp_date);
			    var temp = new Date(temp_date.getTime() + office);
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
					// + " " + _zone;
			    return date_str;
			},
			//提交数据
			submit(fields) {
				// alert(0)
				this.sort_flag=true;
				//保存的禁止点击
				this.preservation = true;
				//撤销的禁止点击
				this.revoke = true;
				//编辑的禁止点击
				this.isedit = false;
				//删除的禁止点击
				this.isdel = false;
				//是否禁用的选项
				this.btn_preservation = true;
				this.btn_revoke = true;
				this.btn_del = false;
				this.btn_edit = false;
				//当有新建的时候请求保存的接口
				if (this.num > 0) {
					//遍历有多少条数据
					// var reg=/UTC\+\d+$/g;
					for (var i = this.num - 1; i >= 0; i--) {
						//请求接口需要的参数
						var parameter = {};
						//遍历每条数据里包含多少项需要提交的数据
						for (var j = 0; j < this.fields.length; j++) {
							//动态的保存参数获取所有的动态参数每有一条数据就会有执行一次每一条的数据就会有多项的动态值
							if(this.fields[j].Name!=this.response.PRIMARY||this.fields[j].Name!="fld_deleted"){
								// console.log(this.msg[i + '-' + j])
								console.log(this.fields[j])
								parameter[this.fields[j].Name + ''] = this.msg[i + '-' + j];
								if(this.fields[j].type=='checkbox'){
								parameter[this.fields[j].Name + '']=Number(this.check[i+'-'+j]);
								};
								
								if(this.fields[j].Name=='fld_create_time'||this.fields[j].Name=='fld_modif_time'||this.fields[j].Name=='fld_login_time'){
									// alert(1)
									var tem=new Date().getTime();
									console.log(temp)
									function to_2_str(_value) {
			    						    if (_value < 10){
												return "0" + _value;
											}   
			    						    else{
												return _value;
											}       
										};
									var temp=new Date(tem);
						parameter[this.fields[j].Name] = temp.getUTCFullYear()
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
								}
							}
								
								
						};
						parameter.oper = 'edit';
						parameter[this.response.PRIMARY] = 'row_new_';
						parameter._oper = 'add';
						parameter.userInfo = this.userInfo;
						this.axios.post(this.api + this.response.JQ_GRID_ADD, this.qs.stringify(parameter), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(res => {
							// alert(1)
							//重新请求加载接口
							//如果调用了查询接口那么添加的时候会自动请求查询接口
							console.log(res)
							if(res.data.error==-1){
								this.box_data.tips=true;
								this.current_state=res.data.message;
								setTimeout(()=>{
									this.box_data.tips=false;
								},2000)
							}else{
								if(this.isquery==true){
									this.lookup()
								};
									this.refresh();
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
							}
							
						})
							
					}
					this.child_index--;
					
					this.increasing=0;
				} //当有编辑的时候请求保存的接口
				else if (this.list_some == true) {
					//当点击保存后新建的按钮
						this.newly_build= false;
						this.btn_build=false;
					//updata_edit是一共有多少条数据对象
					var parameter = {};
					for (var i = 0; i < this.updata_edit.length; i++) {
						// this.disabled_true[this.updata_edit.length[i]]=false;
						//当有复选框的时候把boolean转换成数字类型
						for (let k in this.updata_edit[i]) {
							// console.log(this.updata_edit[i][k])
							if (typeof(this.updata_edit[i][k]) == 'boolean') {
								this.updata_edit[i][k] = Number(this.updata_edit[i][k])
							};
							var reg=/UTC\+\d+$/g;
							if(reg.test(this.updata_edit[i][k])){
								k++;
								continue
								// this.updata_edit[i][k]=this.updata_edit[i][k].replace(/UTC\+\d+/g,'')
							}
							parameter[k] = this.updata_edit[i][k];
						}
						parameter.oper = 'edit';
						parameter._oper = 'edit';
						parameter.userInfo = this.userInfo;
						this.axios.post(this.api + this.response.JQ_GRID_UPDATE, this.qs.stringify(parameter), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(res => {
							if(res.data.error==-1){
								this.box_data.tips=true;
								this.current_state=res.data.message;
								setTimeout(()=>{
									this.box_data.tips=false;
								},2000)
							}else{
								this.rows.forEach((item, index) => {

								if (this.btn_checkeds.length>0) {
									this.btn_checkeds.forEach((item,i)=>{
									this.edit_list[item] = false;
								})
									this.btn_checkeds=[];
									this.btn_check = false
								}
								//如果调用了查询接口那么添加的时候会自动请求查询接口
								if(this.isquery==true){
									// this.lookup()
									this.$emit('query',this.sub_url, this.child_index,this.Query_project,this.sort);
									this.refresh();
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
								}else{
									this.refresh();
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
								}
							});
							
							}
							
						})

					}
					// this.refresh()
					//修改完成后清空数组项
					this.updata_edit = {};	
				}
					this.tr_flag=true;
					//把之前保存的选中数清除
					this.list_some=false ;
					this.dynamic={};
            },
			//编辑
			updata() {
                // console.log(0)
				//当列表项选中的时候再进行编辑
				if (this.list_some == true) {
					//点击编辑时触发其他页面的函数这样当点击三个点的时候就可以根据字段判断是那个页面函数的数据
					this.serch_fn();
					this.sort_flag=false;
					//保存的禁止点击
					this.preservation = false;
					//撤销的禁止点击
					this.revoke = false;
					//编辑的禁止点击
					this.isedit = true;
					//删除的禁止点击
					this.isdel = true;
					//新建的禁止点击
					this.newly_build=true;
						//是否禁用的选项
					this.btn_preservation = false;
					this.btn_revoke = false;
					this.btn_del = true;
					this.btn_edit = true;
					this.btn_build = true;
				//当点击某一条数据时让复选框选中，点击编辑的时候禁止每一项的点击事件
				this.tr_flag=false;
						//当选中其中一项
                        //当选中数组中的值大于0时遍历数组
                        // console.log(this.btn_checkeds)
						if (this.btn_checkeds.length>0) {
							
							this.btn_checkeds.forEach((item,index)=>{
								//每条数据选中根据选中项索引添加为true值
								this.disabled_true[item]=true;
                                // console.log(item)
								//当点击编辑时edit_list中的索引数据为true
                                // console.log(typeof item)
                                // console.log(this.rows[item])
                                this.edit_list[item] = false;
								// console.log(this.edit_list)
								//编辑时把每条数据项保存起来
							this.updata_edit.push(this.rows[item]);
							// console.log(this.updata_edit)
							})

						} else {
							this.isedit = false;
						}
				}else{
					//保存的禁止点击
					this.preservation = true;
					//撤销的禁止点击
					this.revoke = true;
					//编辑的禁止点击
					this.isedit = false;
					//删除的禁止点击
					this.isdel = false;
					//新建的禁止点击
					this.newly_build=false;
						//是否禁用的选项
					this.btn_preservation = true;
					this.btn_revoke = true;
					this.btn_del = false;
					this.btn_edit = false;
					this.btn_build = false;
					this.box_data.tips=true;
						this.current_state='请选择编辑项';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
				}
			},
			//新建
			add() {
				this.sort_flag=false;
				this.btn_check=true;
				this.btn_checkeds=[];
				this.dynamic={};
				//点击新建时不能选中复选框
				this.tr_flag=false;
				//点击新建时增加遍历的条数
				this.num += 1;
				this.child_index += 1;
				this.check.push(false)
				// this.msg = [];
				// this.check = []
				this.len = [];
				//保存的禁止点击
				this.preservation = false;
				//撤销的禁止点击
				this.revoke = false;
				//编辑的禁止点击
				this.isedit = true;
				//删除的禁止点击
				this.isdel = true;
				//是否禁用的选项
				this.btn_preservation = false;
				this.btn_revoke = false;
				this.btn_del = true;
				this.btn_edit = true;
				//点击编辑时触发其他页面的函数这样当点击三个点的时候就可以根据字段判断是那个页面函数的数据
				this.serch_fn();
				this.fields.forEach((item, index) => {
					// console.log(item)
					if (item.type == 'checkbox') {
						var tem = {
							input_show: false,
							check_show: true,
							password_show:false,
							textarea_show:false,
							date_time_show:false
						}
					}else if(item.type == 'text'){
							var tem = {
							input_show: true,
							check_show: false,
							password_show:false,
							textarea_show:false,
							date_time_show:false
						}
					}else if(item.type == 'textarea'){
							var tem = {
							input_show: false,
							check_show: false,
							password_show:false,
							textarea_show:true,
							date_time_show:false,
						};
					}else if(item.type == 'password'){
							var tem = {
							input_show: false,
							check_show: false,
							password_show:true,
							textarea_show:false,
							date_time_show:false
						}
					}else if(item.type == 'date_time'){
							var tem = {
							input_show: false,
							check_show: false,
							password_show:false,
							textarea_show:false,
							date_time_show:true
						}
					}
					//新建时通过接口参数获取默认值
					if(item.DefaultValue!=undefined){
						if(item.DefaultValue=='0000-00-00 00:00:00'){
							this.msg[this.num-1+'-'+index]='N/A';
						}else{
							this.msg[this.num-1+'-'+index]=item.DefaultValue;	
						}
					};
					//新建时时间字段显示空
					// if(item.Name=='fld_create_time'||item.Name=='fld_modif_time'||item.Name=='fld_starttime'||item.Name=='fld_expiretime'
					// ||item.Name=='fld_unlock_time'||item.Name=='fld_login_time'||item.Name=='fld_StopTime'||item.Name=='fld_StartTime'){
						if(item.FieldType=='datetime'||item.FieldType=='timestamp'){
						this.msg[this.num-1+'-'+index]='N/A';
					};
					if (item.Action!=undefined) {//当新建时看看头部数据有没有action字段如果有就显示点击标识
						tem.span_show=true;
					}
					this.len.push(tem);		
				})
				//当点击新建时复选框跟着选中
				for(var i=0;i<this.num;i++){
					this.add_checkeds.push(i);
				}
				this.child_index_total+=1;
				this.increasing+=1;
				// this.num+1;
			},
			//删除数据
			del() {
				if (this.btn_check == true) {
					this.show_hide = true;
				} else {
					this.box_data.tips=true;
						this.current_state='请选择删除项';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
				}
			},
			//点击正反小三角切换数据的正序倒序
			data_sort(name) {
				this.sort_name=name;
				if (this.istrue.isorder == true) {
					if (this.isup == 'itup' && this.isdown == 'itdown') {
						this.isup = 'isup';
						this.isdown = 'isdown';
						this.sort='asc';
						this.$emit('parent_data_sort', this.sub_url, this.sort,name);
						this.page=1;
						this.child_index = 0;
						this.child_index_page=1;
						this.child_index_total = this.data_page;
					} else if (this.isup == 'isup' && this.isdown == 'isdown') {
						this.isup = 'itup';
						this.isdown = 'itdown';
						this.sort='desc';
						this.$emit('parent_data_sort', this.sub_url, this.sort,name);
						this.page=1;
						this.child_index = 0;
						this.child_index_page=1;
						this.child_index_total = this.data_page;
					}
				}
			},
			//首页加载
			home_page() {
				this.submit_input(1)
					// this.first_box_bg=true;
					// this.is_previous_page=false;
					// this.third_box_bg=false;
					// this.second_box_bg=false;
					// this.is_home_page=false;
					this.is_previous_ellipsis=false;
					this.page_init.first=1;
					this.page_init.second=2;
					this.page_init.third=3;	
				// if(this.child_index_page!=1){
				// 	if (this.istrue.isstart == true) {
				// 	let time = new Date().getTime();
				// 	let page = 1;
				// 	this.btn_check = false;
				// 	this.btn_checkeds.forEach((item, index) => {
				// 		this.btn_checkeds[index] = false
				// 	});
				// 	this.child_index = 0;
				// 	this.child_index_total = this.data_page;
				// 	this.$emit('child_home', this.sub_url, this.child_index, page,this.sort);
				// 	this.page=page;
				// 	this.child_index_page=1;
				//    }
				// }else{
				// 	this.box_data.tips=true;
				// 	this.current_state='已经是第一页了';
				// 	setTimeout(()=>{
				// 		this.box_data.tips=false;
				// 	},1000)
				// }
				
			},
			//上一页
			previous_page() {
				// if(this.input_box-1>1){
				// 	// alert(1)
				// 	this.is_previous_page=true;
				// }
				this.submit_input(this.input_box-1);
				
				// if (this.istrue.isfirst == true) {
				// 	this.btn_check = false;
				// 	this.btn_checkeds.forEach((item, index) => {
				// 		this.btn_checkeds[index] = false
				// 	});
				// 	//当前的页数
				// 	let page = this.project_data.page;
				// 	let time = new Date().getTime();
				// 	if (page > 1 && page != undefined && page != null) {
				// 		page--;
				// 		//总条数减去当前的条数如果是最后一条会等于0
				// 		if (this.project_data_copy - this.child_index_total != 0) {
				// 			//alert(1111111)根据索引计算序号值开始值
				// 			this.child_index = this.child_index - this.data_page;
				// 			//每一页中最后一条数据的序号值
				// 			this.child_index_total = this.child_index_total - this.data_page;
				// 			this.$emit('child', this.sub_url, this.child_index, page,this.sort)
				// 		} else {
				// 			this.child_index = this.child_index - this.data_page;
				// 			//最后一页的数据是16的几倍
				// 			let positive_integer = window.parseInt(this.project_data.records / this.data_page);
				// 			//检测是不是正整数
				// 			let num=/^[0-9]*[1-9][0-9]*$/.test(this.project_data.records / this.data_page)
				// 			//最后一页的数据的总条数如果是正整数那么mantissa的值就是0所以就是当为0时会直接减去定义好的每页显示的数据
				// 			let mantissa = this.project_data.records - positive_integer * this.data_page;
				// 			if(num==true){//当是正整数的时候会减去16否则永远都会减去0，也就是count值不会变化
				// 				if(positive_integer>page){
				// 					var num_z=positive_integer-page;
				// 					this.child_index_total = this.child_index_total - mantissa-this.data_page*num_z;
				// 				}else{
				// 					this.child_index_total = this.child_index_total - mantissa-this.data_page;
				// 				}
				// 			}else{
				// 				//当最后一页添加数据时大于当前页的显示条数时点击前一页要多减去当前页
				// 				if(positive_integer>page){
				// 					var num_f=positive_integer-page;
				// 					this.child_index_total = this.child_index_total - mantissa-this.data_page*num_f;
				// 				}else{
				// 					this.child_index_total = this.child_index_total - mantissa;
				// 				}
				// 			}
				// 			this.$emit('child_next', this.sub_url, this.child_index, page,this.sort);
				// 		}
				// 		this.child_index_page-=this.data_page
				// 	} else if (page <= 1) {
				// 		this.child_index_page=1;
				// 		this.box_data.tips=true;
				// 		this.current_state='已经是第一页了';
				// 		setTimeout(()=>{
				// 			this.box_data.tips=false;
				// 		},1000)
				// 	}
				// 	this.page=page;
				// }		
			},
			//下一页
			next_page() {
				// if(this.input_box+1<parseInt(this.project_data.total)){
				// 	// alert(1)
				// 	this.is_next_page=true;
				// }
				this.submit_input(this.input_box+1)
				// console.log(this.isnext)
				//判断当异步函数执行完成在执行同步代码
				// if (this.istrue.isnext == true) {
				// 	this.btn_check = false;
				// 	this.btn_checkeds.forEach((item, index) => {
				// 		this.btn_checkeds[index] = false
				// 	});
				// 	let page = this.project_data.page;
				// 	let time = new Date().getTime();
				// 	let positive_integer = window.parseInt(this.project_data.total);
				// 	if (page < positive_integer && page != undefined && page != null) {
				// 		page++;
				// 		if (this.project_data.records - this.child_index_total > this.data_page) {
				// 			this.child_index = this.child_index + this.data_page;
				// 			this.child_index_total = this.child_index_total + this.data_page;
				// 			this.$emit('child_next', this.sub_url, this.child_index, page,this.sort)
				// 		} else {
				// 			this.child_index = this.child_index + this.data_page;
				// 			//最后一页的数据是16的几倍
				// 			let positive_integer = window.parseInt(this.project_data.records / this.data_page);
				// 			//最后一页的数据的总条数
				// 			let mantissa = this.project_data.records - positive_integer * this.data_page;
				// 			this.child_index_total = (positive_integer) * this.data_page + mantissa;
				// 			this.$emit('child_next', this.sub_url, this.child_index, page,this.sort);
				// 		}
				// 		this.child_index_page+=this.data_page
				// 	} else if (page >= positive_integer) {
				// 		// alert("已经是最后一页了")
				// 		this.box_data.tips=true;
				// 		this.current_state='已经是最后一页了';
				// 		setTimeout(()=>{
				// 			this.box_data.tips=false;
				// 		},1000)
				// 	}
				// 	this.page=page;
				// } 
			},
			//尾页
			last_page() {
				this.is_home_page=true;
				this.is_previous_page=true;
				this.is_previous_ellipsis=true;
				this.submit_input(parseInt(this.project_data.total));
				this.page_init.first=parseInt(this.project_data.total)-2;
				this.page_init.second=parseInt(this.project_data.total)-1;
				this.page_init.third=parseInt(this.project_data.total);	
				//当返回数据时在请求
				// 	if (this.istrue.isend == true) {
				// 	//把按钮选中的时候取消
				// 	this.btn_check = false;
				// 	this.btn_checkeds.forEach((item, index) => {
				// 		this.btn_checkeds[index] = false
				// 	});
				// 	//最后一页的数据是16的几倍
				// 	let positive_integer = window.parseInt(this.project_data.records / this.data_page);
				// 	//检测是不是正整数
				// 	let num=/^[0-9]*[1-9][0-9]*$/.test(this.project_data.records / this.data_page)
				// 	//最后一页的数据的总条数
				// 	let mantissa = this.project_data.records - positive_integer * this.data_page;
				// 	//总页数
				// 	var pasin = window.parseInt(this.project_data.total);
					
				// 	//序号
				// 					// console.log(this.page,pasin)
				// if(this.page!=pasin){
				// 	this.page=pasin;
				// 	if(num==false){
				// 		this.child_index = (positive_integer) * this.data_page;//总页数减一乘以16   是第几条{{}}中的数据
				// 		this.child_index_page=this.project_data.records-mantissa+1;
				// 	}else{
				// 		this.child_index = (positive_integer) * this.data_page-this.data_page;
				// 		this.child_index_page=this.project_data.records-this.data_page+1;
				// 	}
					
				// 	//每页包含的项目条数
				// 	this.child_index_total = (positive_integer) * this.data_page + mantissa; //总页数减一乘以16+最后一页的条数   是到第几条{{}}中的数据
				// 	this.$emit('child_end', this.sub_url, this.child_index, pasin,this.sort)
				// 	}else{
				// 	this.box_data.tips=true;
				// 	this.current_state='已经是最后一页了';
				// 	setTimeout(()=>{
				// 		this.box_data.tips=false;
				// 	},1000)
				// }
				// 	}

			},
		},
		//移动弹框
		directives: {
            drag: {inserted(el) {
                let drag_Box = el; //获取当前元素
                let dragBox = document.getElementsByClassName('modal-header')[0];
                dragBox.onmousedown = e => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - drag_Box.offsetLeft;
                    let disY = e.clientY - drag_Box.offsetTop;
                    document.onmousemove = e => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        //移动当前元素
                        drag_Box.style.left = left + "px";
                        drag_Box.style.top = top + "px";
                    };
                    document.onmouseup = e => {
                          //鼠标弹起来的时候不再移动
                          document.onmousemove = null;
                         //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
                        document.onmouseup = null;
                    };
                };
            }
        }
    }
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
} */
/* .load_textarea{
	padding-top: 6px;
    vertical-align: super;
    padding-bottom: 2px;
} */
input{
	width: 175px;
}
.iconfont{
	font-size: 12px;
}
thead th{
	background: #ebecf0;
    border: none;
	color: #007bff;
}
.first-box-bg{
	background: #337ab7!important;
	color:#fff!important;
	cursor: auto!important;
}
.pagination li{
	margin:0 5px
}
.pagination li span:hover{
	background: darkgray;
}
.pagination>li>span{
	position: relative;
    float: left;
    padding: 3px 10px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #007bff;
    text-decoration: none;
    background-color: #fff;
	border: 1px solid #ddd;
	font-size: 12px;
	cursor: pointer;
}
.box_size{
	width: 20px;
	height: 20px;
	-moz-transform:scale(1.5,1.5)
}
#tbody input{
    border: none!important;
    height: 25px!important;
}
.table-bordered td{
    border:none
}
.table tr td{
	padding-left: 10px!important;
	padding-right: 10px!important;
	vertical-align:middle
}
td{
	padding: 0;
}
.table td{
	padding: 0;
    border-bottom: 1px solid #dee2e6;
}
.list_color{
	background:#e4fdda!important;
}
.fa-ellipsis-h{
	color: #fff;
}
button, input{
	outline: none;
	/* width: 175px; */
}
.number{
	width: 45px;
}
    .fixed-list{
		/* min-width: 150px; */
		/* max-width: 150px; */
		max-width: 700px;
		/* min-width: 150px; */
	}
    .row-a{
		margin-top: 20px;
	}
    .modal-header{
		cursor: move;
	}
	.serch_box{
		padding: 4px 3px;
		background-color: #AAB2BD;
		cursor: pointer;
	}
	tbody tr:hover{
		/* background-color: #f9f9cc; */
		background-color: #e8efe5;
	} 
	thead td{
		color: #007bff;
		font-weight: 700;
		z-index: 1;
	}
	thead td:hover{
		background: #e4fdda;
	}
	.footer-query{
		color:#007bff;
		font-size:12px;
		border: 1px solid rgb(128, 128, 128);
		padding: 4px;
	}
	.footer-query i{
		transform:rotate(90deg); 
		/* margin-left:4px */
	}
	.footer-reset{
		color:#007bff;
		font-size:12px;
		border:1px solid #808080;
		padding:4px;
		margin-right: 362px;
	}
	.footer-reset i{
		margin-right: 5px;
	}
	.body-i{
		font-size:18px;
		vertical-align:top;
		color: #808080;
		cursor: pointer;
		border:1px solid  #808080;
		border-left:none;
		padding:0px 2px 0px 2px;
		color:#007bff
	}
	.body-input{
		vertical-align:top;
		height: 26px;
		margin-left: 1px;
		outline: none;
	}
	.body-sle-one{
		font-size: 12px; 
		height: 26px;
		line-height: 27px;
		outline: none;
		margin-left: 1px;
	}
	.body-sle{
		font-size: 12px; 
		height: 26px;
		line-height: 27px;
		outline: none;
	}
	.body-sty{
		font-size: 12px; 
		height: 26px;
		line-height: 27px;
		outline: none;
	}
	.body-sty option{
		font-size:12px
	}
	.modal-body{
		padding:6px;
	}
	.modal-pos{
		width: 154px;
    	position: absolute;
    	top: -12px;
    	left: 7px;
    	z-index: 999;
	}
	.modal-body i{
		font-size:18px;
		vertical-align:top;
		cursor: pointer;
		border: 1px solid #808080;
		border-left:none;
		color:#007bff;
		background: #fff;
		padding:0 10px;
	}
	.modal-span{
		font-size:20px;
		margin-top:-14px;
		cursor:pointer
	}
	.modal-title{
		line-height:1px
	}
	.modal-header{
		background:#ebecf0;
		height:40px
	}
	.query{
        display: block; 
		position: fixed;
		top:30%;
		left: -20%;
	}
	tr {
		height: 42px;
	}

	.popup {
		z-index: 10;
		background-color: #5f5f5f;
		max-width: 200px;
		color: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.content {
		margin: 10px 10px 10px 10px;
	}

	.confirm {
		margin-left: 10px;
		margin-bottom: 10px;
	}

	.cancel {
		margin-left: 49%;
		margin-bottom: 10px;
	}

	.color {
		opacity: .5;
		cursor: no-drop;
	}

	.fa-up {
		margin-bottom: 2px;
		width: 0;
		display: block;
		height: 0;
		overflow: hidden;
		font-size: 0;
		line-height: 0;
		border-width: 3px;
		border-style: dashed dashed solid dashed;
		border-color: transparent transparent #696969 transparent;
		cursor: pointer;
	}

	.fa-down {
		display: block;
		width: 0;
		height: 0;
		overflow: hidden;
		font-size: 0;
		line-height: 0;
		border-width: 3px;
		border-style: solid dashed dashed dashed;
		border-color: #000000 transparent transparent transparent;
		cursor: pointer;
	}

	.isup {
		border-color: transparent transparent #000000 transparent;
	}

	.isdown {

		border-color: #696969 transparent transparent transparent;
	}

	.itup {
		border-color: transparent transparent #696969 transparent;
	}

	.itdown {

		border-color: #000000 transparent transparent transparent;
	}

	td {
		overflow: hidden;
		text-overflow: ellipsis;
	    padding: 0.75rem 0.9rem;
	}

	button {
		border-radius: 5px;
		font-size: 12px;
		margin-left: 10px;
		outline: none;
		border: none;
		/* width: 40px; */
		height: 25px;
		background: #095ee8;
		color: #ffffff;
	}

	.fixed {
		width: 40px;
		text-align: center;
		color: #007bff;
	}

	table {
		font-size: 12px;
		/* float: right; */
		/* overflow: auto; */
		/* max-height: 753px; */
	}
    .pagination{
		margin-left: 75px;
		float: right;
		margin-right: 20px;
	}
	.pagination a {
		color: #095ee8;
		/* margin-left: 75px; */
	}

	.page {
		margin: 0 10px;
		text-decoration: none;
	}

	.page-num {
		margin-right: 15px;
	}

	.total {
		color: #095ee8;
		font-size: 13px;
		/* padding-left: 300px; */
		text-align: right;
		margin-left: -20px;
	}
	.total-page{
		text-align: center;
	}
	.thead {
		background-color: #ebecf0;
	    transform: translateY(0px);
		text-align: center;
		z-index: 1;
		position: relative;
	}

	.list {
		padding-top: 10px;
		padding-right: 20px;
	}

	.shop {
		padding: 0;
		margin: 0;
		margin-top: 53px;
	}

	/* .Page{
		 text-align: center;
		margin: 0 auto;
	} */
	.fa-backward {
		margin-left: 10px;
	}

	.fa-forward {
		margin-right: 10px;
	}

	.fun {
		/* margin-left: 100px; */
		text-align: center;
	}

	h3 {
		margin: 40px 0 0;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	.footer {
		font-size: 13px;
		/* position: fixed; */
		/* bottom: 10px; */
	}
</style>
