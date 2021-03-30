<template>
	<div class="hello" @click="close">
			<div class="row no-gutters shop">
				<!-- 设置一个动态的高度溢出时自动显示滚动条 -->
				<div class="col-lg-12  col-md-12 table-responsive" :style="{overflow: 'auto',height:offset_height+'px'}" @scroll="table_cont" >
						<!-- :style="{maxHeight:fontSize+'px'}" -->
					<table class="table text-nowrap " style="" >
						<!-- 表格头部 -->
						<!-- 将表头固定 translateY的优先层级最高当高度超出时出现滚动条滚动时表头一直计算滚动的高度所以内容数据一直往上滚动而表头固定-->
						<thead class="thead" >
							<tr >
								<th v-show="fields" class="fixed" :style="{transform:'translateY('+tans_late+'px)'}"></th>
								<th v-show="fields" class="fixed" :style="{transform:'translateY('+tans_late+'px)'}"><input type="checkbox" v-model="btn_check" @change="tr_flag && btn_check_cli()"></th>
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
								<td class="fixed">{{index1+child_index_page}}</td>
								<td class="fixed"><input type="checkbox" v-model="add_checkeds" :value="index1" ></td>
								<td class="fixed-list" v-for="(le,index) in len" :key="index">
									
									<!-- 输入框根据索引显示内容当添加新项目时会把之前的索引添加到现有的索引中所以会把输入框的内容添加到新的项目中 :id="'fld'+index"-->
									<div class="input-width">
									<input  v-if="le.check_show" type="checkbox" v-model="check[index1+'-'+index]">
									<input style="width:100%" v-if="le.input_show&&fields[index].Name!=response.PRIMARY" type="text" v-model="msg[index1+'-'+index]">
									<input style="width:100%" v-if="le.textarea_show" type="text" v-model="msg[index1+'-'+index]">
									<!-- <textarea v-if="le.textarea_show" v-model="msg[index1+'-'+index]"  :key="index" rows="1"></textarea> -->
									<input style="width:100%" v-if="le.password_show" type="text" v-model="msg[index1+'-'+index]">
									<input style="width:100%" v-if="le.date_time_show" type="text" v-model="msg[index1+'-'+index]">
									
									<span style="width:20%" v-if="le.span_show" @click="serch(index1,index)" class="serch_box"><i class="fa fa-ellipsis-h fa-1x"></i></span>
									</div>
								</td>
								<!-- <div style="position:relative;right:600px;top:100px;background:red"> -->
								
								<!-- </div>						 -->
							</tr>
							
							<!-- 初始请求的列表数据 -->
							<!-- 编辑时把数据填充到输入框中 加上item是为了避免key值的和上一个tr的key值重复-->
							<tr v-for="(item,index) in rows" :class="{list_color:dynamic[index]==item}" :key="index+item" @click="tr_flag && tr_list($event,item,index)">
								<!-- {{item}} -->
								<td class="fixed">{{index+1+child_index}} </td>
								<!-- 给每个复选框绑定不一样的v-model -->
								<td class="fixed"><input type="checkbox" v-model="btn_checkeds" :value="index"></td>
								 <!-- v-model="btn_checkeds[index]" -->
								<!-- 渲染多个tr project为对象的每一项-->
								<td class="fixed-list " v-for="(project,key,index_list) in item" :key="index_list" :title="project">
									<!-- 如果没有点击编辑则直接是渲染的数据 -->
									<template v-if="!edit_list[index]">
										{{project}}
									</template>
									<!-- 如果点击了编辑就渲染编辑后的数据 -->
									<template v-if="edit_list[index]">
										<div class="input-width">
										<input style="width:100%"  v-if="(fields[index_list].type=='textarea')" type="text" v-model="rows[index][key]">
										<input style="width:100%" v-if="(fields[index_list].type=='text'&&fields[index_list].Name!=response.PRIMARY&&fields[index_list].Readyonly!=true)" type="text" v-model="rows[index][key]">
										<input style="width:100%" v-if="(fields[index_list].type=='password')" type="text" v-model="rows[index][key]">
										<input style="width:100%" v-if="(fields[index_list].type=='date_time')" type="text" v-model="rows[index][key]">
										<!-- 如果表头的数据字段中的的name与clumns中的主键字段相同就不能更改 -->
										<span v-if="(fields[index_list].type=='text'&&fields[index_list].Name==response.PRIMARY)">{{project}}</span>
										<span v-if="(fields[index_list].type=='text'&&fields[index_list].Readyonly==true)">{{project}}</span>
										<!-- 是否显示其他页面的按钮 -->
										<span style="width:20%" v-if="fields[index_list].Action!=undefined" class="serch_box" @click="serch(index,index_list,key)"
									 ><i class="fa fa-ellipsis-h fa-1x "></i></span>
										</div>
										
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
				<div class="col-lg-4  col-md-2  footer " v-show="fields">
					<button @click="query" style="outline: none;"><span class="iconfont icon-chaxun"></span>查询</button>
					<button @click="refresh" style="outline: none;"><span class="iconfont icon-shuaxin"></span>刷新</button>
					<button @click="updata" v-if="option.updata" :disabled="isedit" :class="{color:btn_edit}" style="outline: none;"><span class="iconfont icon-bianji"></span>编辑</button>
					<button @click="add" v-if="option.new_add" :disabled="newly_build" :class="{color:btn_build}" style="outline: none;"><span class="iconfont icon-plus-creat
"></span>新建</button>
					<button @click="submit(fields)" v-if="option.updata_add" :disabled="preservation" :class="{color:btn_preservation}"
					 style="outline: none;"><span class="iconfont icon-baocun"></span>保存</button>
					<button v-if="option.revoke" @click="bt_revoke" :disabled="revoke" :class="{color:btn_revoke}" style="outline: none;"><span class="iconfont icon-chexiao"></span>撤销</button>
					<button @click="del" v-if="option.del" :disabled="isdel" :class="{color:btn_del}" style="outline: none;background: rgb(210, 98, 103);"><span class="iconfont icon-shanchu"></span>删除</button>
				</div>
				<div class="popup" v-if="show_hide">
					<p class="content">确认要删除选择的条目吗</p>
					<button class="confirm" @click="confirm_click" style="outline: none;">确认</button>
					<button class="cancel" @click="cancel_click" style="outline: none;">取消</button>
				</div>
				<div class="col-lg-4  col-md-4 total-page footer">
					<nav>
						<ul class="">
							<li>
								<a href="javascript:void(0);" @click.prevent="home_page">
									<i class="fa fa-fast-backward"></i>
								</a>
								<a href="javascript:void(0);" @click.prevent="previous_page">
									<i class="fa fa-backward"></i>
								</a>
							</li>
							<li>|<a class="page" href="javascript:void(0);" @click.stop="select_input" @keyup.enter="submit_input">第<input
									 type="text" v-if="input_page" v-model="project_data.page" style="width:30px; height:20px">{{input_box}}页</a><a
								 class="page page-s" href="#">共{{parseInt(this.project_data.total)}}页</a>|</li>
							<li>
								<a href="javascript:void(0);" @click.prevent="next_page">
									<i class="fa fa-forward"></i>
								</a>
								<a href="javascript:void(0);" @click="last_page">
									<i class="fa fa-fast-forward"></i>
								</a>
							</li>
						</ul>
					</nav>
				</div>
				<div v-if="no_data" class="col-lg-4  col-md-2  total footer">
					<span class="page-num">第{{child_index_page}}到第{{count}}条</span>
					<span class="total-num">共{{increasing+project_data.records}}条</span>
				</div>
				<div v-if="!no_data" class="col-lg-4  col-md-2  total">没有数据</div>
				
				<!-- 搜索的弹出框 -->
				<div v-if="query_show" class="modal fade query" tabindex="-1" role="dialog" style="overflow: visible;opacity: 1" v-drag>
  					<div class="modal-dialog" role="document">
  					  <div class="modal-content">
  					    <div class="modal-header">
						 <span class="modal-title" >搜索&hellip;</span>
  					      <span @click="close_win" v-if="query_show" aria-hidden="true" class="modal-span">&times;</span>
  					    </div>
  					    <div class="modal-body">
								<select class="body-sty" v-model="project_box" >
									<option v-for="(item,index) in project_condition" :key="index" :value="item">{{item}}</option>
								</select>
								<i @click="accumulation">+</i>
  					    </div>
						  <!-- 当点击添加的时候要遍历这个元素 -->
						  <div class="modal-body" v-for="(item,index) in add_num" :key="index" >
							  <div>
							  <select name="" class="body-sle" v-model="project_slected[item]">
								  <!-- <option value="">请选择</option> -->
								  <option v-for="(item,index) in head_data" :key="index" :value="item">{{item}}</option>
							  </select>
							  <select name="" class="body-sle-one" v-model="type_slected[item]">
								  <option v-for="(item,index) in query_scope" :key="index" :value="item" >{{item}}</option>
							  </select>
							  <input type="text" class="body-input" v-model="condition[item]">
							  <i class="body-i" @click="Query_remove(item)" :key="index">-</i>
							  </div>
							  
						  </div>
  					    <div class="modal-footer">	
  					      <span type="button" class="btn btn-default footer-reset" data-dismiss="modal" @click="box_reset"><i class="fa fa-reply" aria-hidden="true"
							></i>重置</span>
  					      <span type="button" class="btn footer-query" @click="lookup">查找
								<i class="fa fa-search" aria-hidden="true" ></i></span>
  					    </div>
  					  </div>
  					</div>
				</div>
			</div>
			  <!-- 遮罩层 -->
  <div style="width: 100%;height: 100%;background: #e2e2e2;color: #e2e2e2;position: fixed;top: 0;opacity: .5;" v-if="box_data.project_engineering||box_data.tank_channel||
  box_data.user||box_data.time||box_data.edit||box_data.sel||box_data.mail||box_data.items||box_data.sel_shows||box_data.jurisdiction||box_data.role_edit||box_data.tips||query_show"></div>
			<!-- <div style="background:red;position:relative"> -->
		<template>
			<!-- 项目工程组件 (Admin本地数据库[项目工程] 菜单编辑[类型] 其他页面[项目工程] 编辑Action[项目工程] 操作表字段[编辑控件 编辑操作] 数据类型[项目工程] 数据类型值[项目工程 类型id]) 
			                 (Tank 活动商店[重置周期] 活动数据[活动类型 活动状态] 活动奖励[重置周期] 活动任务[重置周期] 客户端可见服务器管理[客户端名] 客户端资源升级[客户端名]
							 客户端代码升级[客户端名] 兑换码生成[礼包id 生成状态] 邮件模板[删除类型] 系统邮件[邮件模板id] 房间服务器[服务器所属分组] 测试设备[类型]
							 渠道商品定义[渠道的名字 官方id 货币类型] 商品定义[商品类型])
							 (巅峰战舰 礼包码[批次] 礼包生成[生成状态] 礼包管理[邮件标题 邮件内容] 资源升级[资源类型] 测试设备[设备类型])-->
			<ppr v-if="box_data.project_engineering" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" :box_fun="box_fun" @close_project="close_project" @input_data="input_data">{{head_title}}</ppr>
			<!-- 坦克活动数据中的对应渠道组件  (Tank 活动数据[对应渠道 生效分区] 游戏内公告[生效分区] 客户端可见服务器管理[可以看见的服务器分组 测试设备可见的服务器分组]
			系统邮件[生效分区])-->
			<pro v-if="box_data.tank_channel" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" :box_fun="box_fun" @close_project="close_project" @channel_input_data="channel_input_data" ></pro>
			<!-- 管理员密码组件 (Admin 用户[管理员密码])-->
			<user-pas v-if="box_data.user" :rule_data="rule_data" @pas_confirm="pas_confirm" @close_project="close_project"></user-pas>
			<!-- 时间的组件 (Tank 活动数据[活动开始时间 活动结束时间 活动展示开始时间 活动展示结束时间] 首页公告[组后修改时间] 游戏内公告[最后修改时间 公告展示开始时间 公告展示结束时间]
			系统公告[公告发送时间] 兑换码生成[生效时间 过期时间] 封停账号[解锁时间] 系统邮件[到期时间])-->
			<prr v-if="box_data.time" :rule_data="rule_data" :clientY="clientY" :clientX="clientX" @close_project="close_project" @time_data="time_data"></prr>
			<!-- 编辑框的组件 (Admin编辑Action[模板参数] Tank首页公告[测试公告 正式公告] 巅峰挑战任务[任务描述] 礼包[邮件内容] 邮件模板[邮件标题 邮件内容])
			巅峰战舰(礼包管理[邮件标题 邮件内容] 跑马灯[内容] 物品[describe] 首页公告[测试公告 正式公告] 服务器内公告[公告内容 落款 导航 背景图 内容 条件]
			资源升级[下载地址 下载地址测试])-->
			<edit v-if="box_data.edit" :rule_data="rule_data" @edit_confirm="edit_confirm" @close_project="close_project"></edit>
			<!-- 封停角色 用户ID (Tank封停角色[用户id] 封停账号[用户id])-->
			<select-service v-if="box_data.sel" :rule_data="rule_data" @close_project="close_project" ></select-service>
			<!-- 系统邮件 条件组件 (Tank系统邮件[条件])-->
			<mail-conditions v-if="box_data.mail" @input_data="input_data" :rule_data="rule_data" @close_project="close_project"></mail-conditions>
			<!--邮件物品 编辑物品  (Tank礼包[物品数据] 邮件模板[邮件物品])-->
			<edit-items v-if="box_data.items" :rule_data="rule_data" :selecte_data="selecte_data" @sbmit_data="sbmit_data" @sel_goods="sel_goods"  @close_edit="close_edit"></edit-items>
			 <!-- 选择物品的组件 (Tank巅峰挑战任务[奖励物品])-->
			<select-items v-if="box_data.sel_shows" :box_fun="box_fun" :rule_data="rule_data"  @close_select="close_select" @selecte_btn="selecte_btn"></select-items>
			<!-- 权限组件 (Admin 用户[权限])-->
			<jurisdiction v-if="box_data.jurisdiction" :rule_data="rule_data" :ppr_action="ppr_action" :ppr_action_param="ppr_action_param" @close_project="close_project" @input_data="input_data"></jurisdiction>
			<!-- 权限数组 (Admin 角色[权限数组])-->
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
				//不同组件的标题
				head_title:'',
				//计算点击元素距离左上边框的距离
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
				//编辑新建时输入框中的值
				rule_data:null,
				//查询的显示框
				query_show:false,
				//是否输入页数
				input_page: false,
				//用户信息
				userInfo: null,
				//child_index:this.sub_index,
				//默认的序号
				child_index: 0,
				//每一页包含的项目数目
				child_index_total: 16,
				//默认新建时遍历的多少条数据
				num: 0,
				//新建时根据每一项数据渲染不同的输入框或选择框
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
				//正序
				isup: 'itup',
				//倒序
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
				edit_list: [],
				//编辑更新的数据对象
				updata_edit: [],
				//当总项目条数大于16时显示一页16条数据
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
				//搜索输入框的添加
				search_data:0,
				//查询项目选择框
				project_slected:[],
				//查询类型选择框
				type_slected:[],
				//项目条件
				project_condition:['满足所有条件','满足任一条件'],
				//项目选择框
				project_box:'',
				//页数
				page:1,
				//组件弹框数据
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
				//查询接口是否调用、
				lookup_flag:false,
				//
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
		created(){
			//根据屏幕的高度计算数据的显示条数
			this.count_page();
		},
		mounted() {
		
			//数据为空时的显示
			this.count_data();
			// window.setTimeout(()=>{
			// 		this.table_cont()	
			// 		},(2000))
			//判断底部操作按钮的显示隐藏
			this.operation_isshow();
		},
		computed: {
			//计算当总数据不足16条时有多少条显示到多少条
			count: function() {
				//当前页的数据条数是否比每页设定的条数小
				if (this.rows.length < this.data_page) {
					return this.rows.length+(this.page*this.data_page-this.data_page)+this.increasing;//页数*16-16
				} else {
					//如果是动态的页数那么返回本页最后一条页数值
					return this.child_index_total
				}
				
			},
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
			//判断底部操作按钮的显示隐藏
			operation_isshow(){
				//判断是否有columns接口数据
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
			//数据为空时的显示
			count_data(){
				this.userInfo = window.sessionStorage.getItem('userInfo');
				//如果页数返回undefined怎默认第一页
				if (this.project_data.page == undefined) {
					this.project_data.page = 1;
				}
				//如果数据返回为空时
				if (JSON.toString(this.rows) == "[]") {
					this.rows = [{
						name: "name"
					}];
				}
			},
			//根据屏幕的高度计算显示的页数
			count_page(){
				// console.log(document.body.offsetHeight)
				//计算显示框的高度
				// this.offset_height=window.screen.height-300
				this.offset_height=window.screen.height-280
				//根据屏幕的高度计算显示的页数
				// this.data_page=parseInt(window.screen.height/60);
				// this.data_page=parseInt(window.screen.height*0.02);
				this.data_page=parseInt(this.offset_height/43-1)
				console.log(this.offset_height,this.data_page)
				this.child_index_total=this.data_page
			},
			//请求所有弹框的数据根据字段显示是否有查询的三个点
			serch_fn(){
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
					//获取接口数据过滤出时间的字段
					res.data.rows.forEach((item,index)=>{
							if(!(item.fld_action_name=="edit_date")&&!(item.fld_function=="")){
						  this.box_res.push(item);
						}
					 }
					)
				});
			},
			//固定表头
			table_cont(e){
					//获取滚动条距离盒子的高度
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
						setTimeout(late,10);
						tur=false;
					  }
						
					}
					//停止滚动执行函数
					// let t1=0;
					// let t2=0;
					// let timer=null;
						
					// 	// alert(0)
					// let isScrollEnd=()=>{
					// 	// console.log(e)
					// 	// alert(1)
					// 	t2=e.target.scrollTop;
					// 	if(t2==t1){
					// 		// alert(2)
					// 		this.tans_late=e.target.scrollTop
					// 	}
					// };
					// 	clearTimeout(timer);
					// 	timer=setTimeout(isScrollEnd,5);
					// 	t1=e.target.scrollTop;
					//直接执行函数
					// this.tans_late=e.target.scrollTop;
					// window.setTimeout(()=>{
						
					// },(50))
					
				},
			//将选中的数据放在输入框中
			sbmit_data(data){
				//当是新建时把弹框中的数据填进输入框
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				}
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				}
				//关闭弹框
				this.close_edit();
			},
			//选择的数据列表，显示在别的组件（选择选中项目然后在别的组件选择项目然后再把数据放到本组件中）
			selecte_btn(data){
				//点击选择物品关闭物品选择框组件（select-service组件）
				this.box_data.sel_shows=false;
				//把选中的数据赋值给selecte_data
				this.selecte_data=data;
				//显示edit-items组件
				this.box_data.items=true;
			},
			//权限数组组件输入值
			auth_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭组件
				this.close_project();
			},
			//关闭编辑物品框（sbmit_data确认执行关闭）
			close_edit(){
				//当选择好选项后让弹框组件关闭
				if(this.box_data.items==true){
				 	this.box_data.items=false;
				 }
			},
			//关闭选择物品框（给编辑物品组件用）
			close_select(){
				//关闭选择框组件（select-service组件）
				if(this.box_data.sel_shows==true){
				 	this.box_data.sel_shows=false;
				 }
			},
			//物品选择的弹框
			sel_goods(){
				//显示选择物品组件（select-service组件）
				this.box_data.sel_shows=true;
				//关闭编辑物品组件
				this.box_data.items=false;
			},
			//管理员密码组件输入值
			pas_confirm(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭密码框组件（user-pas组件）
				this.box_data.user=false;
			},
			//编辑内容组件输入值
			edit_confirm(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭编辑框组件
				this.close_project();
			},
			//时间的选择组件
			time_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭时间组件
				this.close_project();
			},
			//让输入框中的值为弹框中的输入值  活动数据渠道组件（pro组件）
			channel_input_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭弹框
				this.close_project();
			},
			//让输入框中的值为弹框中输入的值  项目工程组件（ppr组件）
			input_data(data){
				//当新建的时候编辑带弹框的数据
				if(this.len.length>0){
					this.msg[this.box_index.index1+'-'+this.box_index.index]=data;
				};
				//当编辑的时候编辑带弹框的数据
				if(this.edit_list.length>0){
					 this.rows[this.box_index.index1][this.box_index.box_key]=data;
				};
				//关闭组件
				this.close_project();
			},
			//关闭弹出框
			close_project(){
				//ppr组件
				if(this.box_data.project_engineering==true){
					this.box_data.project_engineering=false;
				};
				//pro组件
				if(this.box_data.tank_channel==true){
					this.box_data.tank_channel=false;
				};
				//prr组件
				if(this.box_data.time==true){
					this.box_data.time=false;
				};
				//edit组件
				if(this.box_data.edit==true){
					this.box_data.edit=false
				};
				//select-service组件
				if(this.box_data.sel==true){
					this.box_data.sel=false
				};
				//mail-conditions组件
				if(this.box_data.mail==true){
					this.box_data.mail=false
				};
				//user-pas组件
				if(this.box_data.user==true){
					this.box_data.user=false
				};
				//jurisdiction组件
				if(this.box_data.jurisdiction==true){
					this.box_data.jurisdiction=false;
				};
				//auth-role-edit组件
				if(this.box_data.role_edit==true){
					this.box_data.role_edit=false
				}
			},
			//查找
			lookup(){
				// alert(0)
				this.lookup_flag=true;
				//设置序号
				this.child_index = 0;
				//设置页数
				this.page=1;
				//获取选框中的值并赋值请求参数
				let request_parameters={};
				//获取选择的条件
				request_parameters.groupOp=this.project_box;
				//选泽的是哪一项
				if(request_parameters.groupOp=='满足所有条件'){
					request_parameters.groupOp='AND'
				}else{
					request_parameters.groupOp='OR'
				}
				//当查询的时候看有多少条数据
				request_parameters.rules=[];
				// console.log(this.add_num)
				//遍历有多少组数据
				this.add_num.forEach((item,index)=>{
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
						request_parameters.rules[index].data=this.condition[index];
				})
				//将对象转换成json数据
				this.Query_project=JSON.stringify(request_parameters);
				// this.query_data=project;
				//通过父组件执行
				this.$emit('query',this.sub_url, this.child_index,this.Query_project,this.sort);
				//让选项数据初始化一条
				this.add_num=[];
				//查询时让弹窗关闭
				this.close_win();
				//返回初始状态
				//查询的添加和移除
				this.condition=[];
				//查询类型选择框
				this.type_slected=[];
				//查询项目选择框
				this.project_slected=[];
				//查询条件
				this.head_data=[];
				// this.search_data=0;
				this.btn_checkeds=[];
				this.btn_check='';
			},
			//查询重置
			box_reset(){
				//将输入框数据清空
				this.condition=[];
			},
			//移除查询数据中的某一条
			Query_remove(p){
				//遍历数组中添加的数据有多少移除点击的项
					this.add_num=this.add_num.filter(item=>item!==p)
			},
			//查询多条数据累加选项
			accumulation(){
				//当点击添加的加号时给数组添加不同的项以便给input添加不同的v-model
				//每添加一条数据就像数组push不同的值
				this.search_data+=1;
				this.add_num.push(this.search_data);
				// this.add_num=this.search_data;
				//每添加一项都会在选择框中添加第一项数据
				//项目值
				this.project_slected.push(this.head_data[0]);
				//类型值
				this.type_slected.push(this.query_scope[0]);
				//输入框值
				this.condition.push('')
			},
			//关闭查询弹窗
			close_win(){
				this.query_show=false;
				if(!this.lookup_flag){
					this.add_num=[];
				}
				
			},
			//查询
			query(){
				//显示查询弹框
				this.query_show=true;
				//设置查询数据的条数
				this.add_num.push(this.search_data);
				// this.add_num=[];
				//设置选择条件
				this.project_box=this.project_condition[0];
				//遍历数据头的数据
				this.fields.forEach((item,index) =>{
					//当点击查询的时候判断需要查寻的条件有哪些
					if(item.Name!="fld_deleted"&&item.Name!=this.response.PRIMARY&&item.Search==1){
						//把需要的条件放在一个数组中
						this.head_data.push(item.Comment);
						//在动态的选择框中始终把第一项放在框中
									}				
				})
				//设置查询项目
				this.project_slected.push(this.head_data[0]);
				//设置查询项目的条件
				this.type_slected.push(this.query_scope[0]);
				//设置输入框中的值
				this.condition.push('');
				// this.add_num=[];
			},
			//关闭输入框
			close() {
				this.input_page = false;
			},
			//enter事件提交请请求的页数点击底部的第几页出现输入框
			submit_input() {
				//输入框的数据的判断
				//获取动态页数
				let page = this.project_data.page;
				//如果当前的页数不是空 是有效的数字 大于0 小于等于总页数执行
				if (this.project_data.page != '' && !isNaN(this.project_data.page) && Number(this.project_data.page) > 0 && Number(
						this.project_data.page) <= parseInt(this.project_data.total)) {
					//当数据请求回来再执行下次方法
					if (this.istrue.isnext == true) {
						//获取本页的第一条数据的序号
						this.child_index = this.data_page * (page - 1);
						//当总页数大于当前页数乘每页的条数（说明有当前的页数并且不是最后一页）
						if (this.project_data.records - page * this.data_page >= 0) {
								//本页最后一条数据
								this.child_index_total = this.data_page * page;
							}else{
								//最后一页的数据是16的几倍（总页数是当前页的倍数）
								let positive_integer = window.parseInt(this.project_data.records / this.data_page);
								//最后一页的数据的总条数
								let mantissa = this.project_data.records - positive_integer * this.data_page;
								//本页最后一条数据
								this.child_index_total = (positive_integer) * this.data_page + mantissa;
							};
							//父组件执行接口
							this.$emit('lookup', this.sub_url, this.child_index, page,this.sort)
						}
					}else{
						//将页数搜索输入框隐藏
						// this.input_page = false;
						//将序号默认为0
						this.child_index = 0;
						//将每页的最后一条数据序号设置为第一页的最后一条数据的序号也就是当输入的页数为false时返回第一页的数据
						this.child_index_total = this.data_page;
						//将第一页的第一条数据的序号赋值给第多少条中的data值
						this.child_index_page=1;
						//通过组组件返回第一页数据
						this.$emit('lookup', this.sub_url, this.child_index, 1,this.sort)
						// return false;
				}
				//将页数搜索输入框隐藏
				this.input_page = false;
				//将页数赋值为输入的页数
				this.page=page;
				//将第一页的第一条数据的序号赋值给第多少条中的data值
				this.child_index_page=this.data_page*page-this.data_page+1;
			},
			//选择查找的页数当点击时出现输入框输入完成时点enter请求数据当没有点enter而是点击的别的地方不请求数据直接返回之前的状态
			select_input() {
				//显示底部（点击第几页）输入框
				this.input_page = true;
			},
			//删除的确认点击
			confirm_click() {
				//确认删除标志
				this.confirm_data = true;
				var ids = [];
				//遍历选中的列表
				this.btn_checkeds.forEach((item, index) => {
						//获取选中的数据的主键并push进数组
						ids.push(this.rows[item][this.response.PRIMARY])
				})
				//将数组的每一项转换成字符串
				var ids_data = ids.join();
				if (this.confirm_data == true) {
					this.axios.post(this.api + this.response.JQ_GRID_DEL, {
						ids: ids_data,
						userInfo: this.userInfo
					}).then(res => {
						//如果列表有选中的按钮
						// if (this.list_some == true) {
						// this.btn_checkeds.forEach((item,i)=>{	
						// 	console.log(item)		
						// 		this.edit_list[item] = false;
						// 	})
						// 	this.btn_checkeds=[];
						// 	this.btn_check = false			
						// }
						//删除数据后刷新数据
						this.refresh()
					})
				};
				//关闭弹框
				this.show_hide = false;
			},
			//删除的取消点击
			cancel_click() {
				//确认删除的标志
				this.confirm_data = false;
				//关闭删除弹框
				this.show_hide = false;
				//取消选中项
				this.btn_checkeds=[];
				//取下总选中项
				this.btn_check=false;
				//将选中数据项的样式取消
				this.dynamic={};
			},
			//列表复选框的选中和取消
			tr_list(e,item,i){//事件对象 数据项目 数据索引
				//如果没有选中项
				if(this.btn_checkeds.length==0){
					this.btn_checkeds.push(i);
				}else if(this.btn_checkeds.every((item,index)=>{return item!=i})){//如果选中项中没有与之相同的值那么加入
					this.btn_checkeds.push(i);
				}else{
					this.btn_checkeds=this.btn_checkeds.filter((item,index)=>{//如果选中项中有与之相同的那么移除此项
						return i!=item;
					});
				};
				//如果有选中项
				if(this.btn_checkeds.length>0){
					//总复选框选中
					this.btn_check=true;
					//有选中项的标志
					this.list_some=true;
					//如果有选中项可以点击撤销
					this.revoke = false;
					//如果有选中项不禁用撤销
 					this.btn_revoke = false;
				}else{
					//总复选框不选中
					this.btn_check=false;
					//是否选中的标志
					this.list_some=false;
					//不能点撤销
					this.revoke = true;
					//禁用撤销样式
 					this.btn_revoke = true;
				};
				//如果没有选中项
				if(this.btn_checkeds.length==0){
					this.btn_check=false;
				};
				//点击列表改变背景色
				if(!this.dynamic[i]){
					this.dynamic[i]=item;
				}else{
					this.dynamic[i]='';
				}
			},
			//总按钮是否选中
			btn_check_cli() {
				//如果总复选框选中
				if(this.btn_check==true){
					this.list_some=true;//表示列表中有选中项
					//将本页全部选中
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
			},
			//点击动态的数据项后边的三点请求不同的数据
			serch(index1,index,key) {
				//计算点击元素距离左上边框的距离用来判断时间组件的位置
				this.clientX=event.clientX;
				this.clientY=event.clientY;
				// console.log(this.clientY)
				//当访问同一个组件的时候先关闭组件因为数据不同
				this.box_data.project_engineering==false;
				//每条数据的索引
				this.box_index.index1=index1;
				//数据对象中的索引
				this.box_index.index=index;
				//数据对象中的key
				this.box_index.box_key=key;
				//当是编辑的时候拿出输入框中的值，当是新建的时候拿出新建输入框中的值
				if(this.rows[index1]!=undefined){
					//如果不为空把该值赋值给rule_data
					if(this.rows[index1][key]!=undefined){
					this.rule_data=this.rows[index1][key];
					}else{
					//如果时新建时会新建输入框中的值
					this.rule_data=this.msg[index1+'-'+index]
					}
				}else{//如果没有数据则赋值为空
					this.rule_data=this.msg[this.num-1+'-'+index]
				};
				//当渲染同一个组件时刷新组件因为组件的数据不同
				for(var i in this.box_data){
					if(this.box_data[i]==true){
						this.box_data[i]=false
					}
				};
				
				  //判断当点击三个点时是哪个数据头，根据不同的数据头进行不同的接口请求
				let item=this.fields[index];
				this.box_res.forEach((item_in,index)=>{
					if(item_in.fld_action_name==item.Action){
						//弹框的函数数据
						this.box_fun=JSON.parse(item_in.fld_function)	
					}
					console.log(item.Action)
				})
				this.ppr_action=item.Action;
				this.ppr_action_param=item.ActionParam;
				// console.log(this.ppr_action,this.ppr_action_param)
				switch(item.Action){
						//判断头部三个点字段的值根据值请求不同的接口
						case "selecttion_typevalue":
								 //action中所有的数据项
							setTimeout(()=>{this.box_data.project_engineering=true;},(0))
							this.head_title='--选择--'
							break;
						case "selecttion_appliction":
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
							// alert(2)
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
				//正反序标志
				this.sort_flag=true;
				//刷新完成的标志（当刷新接口执行完后在才能在次执行刷新按钮）
				if(this.istrue.isrefresh==true){
				//每页最后一条数据的序号数
				var total=this.child_index_total;
				//当有新建时刷新总页数加上新建的页数
				this.project_data_copy=this.project_data.records+this.num;
				//执行撤销函数（例 当新建没提交刷新时就撤销新建项目 编辑时撤销编辑）
				this.bt_revoke()
				//触发父组件执行刷新的方法
				this.$emit('parent_refresh', this.sub_url, this.sort,this.project_data.page);
				//是否有选中项的标志
				this.list_some =false;
				//取消每条数据的样式
				this.dynamic={};
				//取消总复选框
				this.btn_check = false;
				//取消添加时的累加
				this.increasing=0;
					//当前页的最后一条数据页数等于添加新建后的数据
					// if(total==this.project_data_copy){
					// 	this.child_index_total=total;
					// }
				}
				
			},
			//撤销
			bt_revoke() {
				//正反序标志
				this.sort_flag=true;
				//减去新建时的页数
				this.child_index_total-=this.num;
				//当点击时把新建取消
				this.num = 0;
				//序号的标志点击撤销是序号也跟着减少（每页显示数据*当前页数-每页显示数据）
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
				//禁用撤销样式
				this.btn_revoke = true;
				//禁用删除样式
				this.btn_del = false;
				//禁用编辑样式
				this.btn_edit = false;
				//禁用新建样式
				this.btn_build = false;
				//当编辑的时候撤销编辑
				if (this.list_some == true||this.btn_checkeds.length>0) {
						//取消选中项中的值
						if (this.btn_checkeds.length>0) {
							this.btn_checkeds.forEach((item,i)=>{
								//取消选中项
								this.edit_list[item] = false;
							})
							//复选框清空 总复选框为false
							this.btn_checkeds=[];
							this.btn_check = false;
						}
						//编辑时候撤销重新刷新数据
						this.$emit('parent_refresh', this.sub_url, this.sort,this.project_data.page);
				};
				//是否能执行点击事件或者执行变化事件的标志
				this.tr_flag=true;
				//是否有选中项的标志
				this.list_some =false;
				//取消选中的样式
				this.dynamic={};
				//总复选框取消选中
				this.btn_check = false;
				//将累加清零
				this.increasing=0;
				//输入框中的数据清空
				this.msg = [];
				//动态的内容数组清空
				this.check = [];
				
			},
			datetime2zone_x(_date_time, _zone) {
				//时区的计算公式
				// const UTC_ZONE = {
				//     "UTC-0000": -0 * 3600 * 1000,
				//     "UTC-0100": -1 * 3600 * 1000,
				//     "UTC-0200": -2 * 3600 * 1000,
				//     "UTC-0300": -3 * 3600 * 1000,
				//     "UTC-0400": -4 * 3600 * 1000,
				//     "UTC-0500": -5 * 3600 * 1000,
				//     "UTC-0600": -6 * 3600 * 1000,
				//     "UTC-0700": -7 * 3600 * 1000,
				//     "UTC-0800": -8 * 3600 * 1000,
				//     "UTC-0900": -9 * 3600 * 1000,
				//     "UTC-1000": -10 * 3600 * 1000,
				//     "UTC-1100": -11 * 3600 * 1000,
				//     "UTC-1200": -12 * 3600 * 1000,
				//     "UTC+0000": 0 * 3600 * 1000,
				//     "UTC+0100": 1 * 3600 * 1000,
				//     "UTC+0200": 2 * 3600 * 1000,
				//     "UTC+0300": 3 * 3600 * 1000,
				//     "UTC+0400": 4 * 3600 * 1000,
				//     "UTC+0500": 5 * 3600 * 1000,
				//     "UTC+0600": 6 * 3600 * 1000,
				//     "UTC+0700": 7 * 3600 * 1000,
				//     "UTC+0800": 8 * 3600 * 1000,
				//     "UTC+0900": 9 * 3600 * 1000,
				//     "UTC+1000": 10 * 3600 * 1000,
				//     "UTC+1100": 11 * 3600 * 1000,
				//     "UTC+1200": 12 * 3600 * 1000
				// };
				// //如果传入的时间为false
			    // if (!_date_time){
				// 	return "N/A";
				// 	}
				// 	//0时区一小时毫秒数
			    // var office = UTC_ZONE["UTC+0000"];
				// var temp_date = null;
				// //如果传入的时间是字符串
			    // if (typeof _date_time == "string") {
				// 	//如果字符串的值是1970年的0时或者是0或者是null那么返回'N/A'
			    //     if (_date_time == "1970-01-01 00:00:00"){
				// 		 return "N/A";
				// 	}
			           
				// 	if (_date_time == "0000-00-00 00:00:00"){
				// 		 return "N/A";
				// 	}
			           
			    //     if (_date_time == "null"){
				// 		return "N/A";
				// 	}
			    //     //如果时间中没有UTC字段就加上UTC   
			    //     if (_date_time.indexOf("UTC") < 0){
				// 		//因为返回的时间都是0时区时间所以直接加上0时区的字段
				// 		 _date_time += " UTC+0000";
				// 		//把当前的字符串时间转换成时间对象
			    //     	temp_date = new Date(_date_time);
				// 	}
					 
				// }else{//如果不是字符串那么直接赋值给temp_date
				// 		temp_date = _date_time;
				// 	};
				// //定义函数将获取的时间的字段进行转换
			    // function to_2_str(_value) {
			    //     if (_value < 10)
			    //         return "0" + _value;
			    //     else
			    //         return _value;
			    // }
				// //把当前时间的毫秒数加上相应时区的毫秒数  也就是说当访问utc方法时会根据时区信息返回0时区的对应数值，当想要返回某个时区信息时就加上对应时区的毫秒数这样
				//当转换时其实就是本时的信息
				// var temp = new Date(temp_date.getTime() + office);
				// //将时间方法返回的字段进行加工拼接
			    // var date_str = temp.getUTCFullYear()
			    //     + "-"
			    //     + to_2_str(temp.getUTCMonth() + 1)
			    //     + "-"
			    //     + to_2_str(temp.getUTCDate())
			    //     + " "
			    //     + to_2_str(temp.getUTCHours())
			    //     + ":"
			    //     + to_2_str(temp.getUTCMinutes())
			    //     + ":"
			    //     + to_2_str(temp.getUTCSeconds())
				// 	// + " " + _zone;
			    // return date_str;
			},
			//提交数据
			submit(fields) {
				//正反序的标志
				this.sort_flag=true;
				//保存的禁止点击
				this.preservation = true;
				//撤销的禁止点击
				this.revoke = true;
				//编辑的禁止点击
				this.isedit = false;
				//删除的禁止点击
				this.isdel = false;
				//是否保存禁用的样式
				this.btn_preservation = true;
				//是否撤销禁用的样式
				this.btn_revoke = true;
				//是否删除禁用的样式
				this.btn_del = false;
				//是否编辑禁用的样式
				this.btn_edit = false;
				//当有新建的时候请求保存的接口
				if (this.num > 0) {
					//遍历有多少条数据
					for (var i = this.num - 1; i >= 0; i--) {
						//请求接口需要的参数
						var parameter = {};
						//遍历每条数据里包含多少项需要提交的数据
						for (var j = 0; j < this.fields.length; j++) {
							//动态的保存参数获取所有的动态参数每有一条数据就会有执行一次每一条的数据就会有多项的动态值
							if(this.fields[j].Name!=this.response.PRIMARY||this.fields[j].Name!="fld_deleted"){//判断不需要提交的字段
								//给接口参数赋值
								parameter[this.fields[j].Name + ''] = this.msg[i + '-' + j];
								//如果数据项的类型是复选框
								if(this.fields[j].type=='checkbox'){
									//把复选款的值转换成数字类型
									parameter[this.fields[j].Name + '']=Number(this.check[i+'-'+j]);
								};
									//如果项目类型是时间的字段
									if(this.fields[j].FieldType=="datetime"||this.fields[j].FieldType=='timestamp'){
									//获取当前时间的对象
									var tem;
									//当没有值的时候获取最新的时间
									if(this.fields[j].Name=='fld_create_time'||this.fields[j].Name=='fld_modif_time'||this.fields[j].Name=='fld_login_time'){
										tem=new Date().getTime();
									}else{//有值的时候获取自定义的时间
										tem=this.msg[i + '-' + j];
									}
									//根据时间方法返回的值进行转换
									function to_2_str(_value) {
			    						    if (_value < 10){
												return "0" + _value;
											}   
			    						    else{
												return _value;
											}       
										};
									//将时间毫秒数转换成时间对象
									var temp=new Date(tem);
											//将0时区的信息拼接时间字符串
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
							};	
						};
						//定义固定接口参数
						parameter.oper = 'edit';
						parameter[this.response.PRIMARY] = 'row_new_';
						parameter._oper = 'add';
						parameter.userInfo = this.userInfo;
						//请求添加接口
						this.axios.post(this.api + this.response.JQ_GRID_ADD, this.qs.stringify(parameter), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(res => {
							//重新请求加载接口
							//如果调用了查询接口那么添加的时候会自动请求查询接口
							if(res.data.error==-1){
								//显示提示组件
								this.box_data.tips=true;
								//提示组件中的提示内容
								this.current_state=res.data.message;
								//控制显示时间
								setTimeout(()=>{
									this.box_data.tips=false;
								},2000)
							}else{
								//如果有查询接口请求查询接口(当在查询数据后添加项目后加载全部的数据)
								if(this.isquery==true){
									this.lookup();
								};
									this.refresh();
									// console.log(this.sort,this.sort_name)
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
							}
							
						})
							
					}
					//显示序号减1
					// this.child_index--;
					//累加清零
					// this.increasing=0;
				} //当有编辑的时候请求保存的接口
				else if (this.list_some == true) {
					// alert(11)
					//当点击保存后新建的按钮可以点击
						this.newly_build= false;
						this.btn_build=false;
					//updata_edit是一共有多少条数据对象
					var parameter = {};
					//遍历编辑的数据项
					for (var i = 0; i < this.updata_edit.length; i++) {
						console.log(this.updata_edit[i])
						//当有复选框的时候把boolean转换成数字类型
						for (let k in this.updata_edit[i]) {
							console.log(this.updata_edit[i][k])
							//如果是复选框转换成数字类型
							if (typeof(this.updata_edit[i][k]) == 'boolean') {
								this.updata_edit[i][k] = Number(this.updata_edit[i][k])
							};
							//定义正则对象判断有没有UTC字段
							var reg=/UTC\+\d+$/g;
							// if(!(this.updata_edit[i].fld_create_time&&this.updata_edit[i].fld_modif_time)){
									if(reg.test(this.updata_edit[i][k])){
										k++;
										continue
							// 	this.updata_edit[i][k]=this.updata_edit[i][k].replace(/UTC\+\d+/g,'')
							// }
							//如果项目类型是时间的字段
									// if(this.updata_edit[i][k].FieldType=="datetime"||this.updata_edit[i][k].FieldType=='timestamp'){
									//获取当前时间的对象
									// var tem=new Date().getTime(this.updata_edit[i][k]);
									//根据时间方法返回的值进行转换
									// function to_2_str(_value) {
			    					// 	    if (_value < 10){
									// 			return "0" + _value;
									// 		}   
			    					// 	    else{
									// 			return _value;
									// 		}       
									// 	};
									// //将时间毫秒数转换成时间对象
									// var temp=new Date(this.updata_edit[i][k]);
									// 		//将0时区的信息拼接时间字符串
									// this.updata_edit[i][k] = temp.getUTCFullYear()
			        				// 		+ "-"
			        				// 		+ to_2_str(temp.getUTCMonth() + 1)
			        				// 		+ "-"
			        				// 		+ to_2_str(temp.getUTCDate())
			        				// 		+ " "
			        				// 		+ to_2_str(temp.getUTCHours())
			        				// 		+ ":"
			        				// 		+ to_2_str(temp.getUTCMinutes())
			        				// 		+ ":"
									// 		+ to_2_str(temp.getUTCSeconds())														
								};
								
							// }
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
							//如果返回-1执行提示框
							if(res.data.error==-1){
								this.box_data.tips=true;
								this.current_state=res.data.message;
								setTimeout(()=>{
									this.box_data.tips=false;
								},2000)
							}else{
								// alert(12)
								// this.rows.forEach((item, index) => {
								// if (this.btn_checkeds.length>0) {
								// 	this.btn_checkeds.forEach((item,i)=>{
								// 	this.edit_list[item] = false;
								// })
								// 	this.btn_checkeds=[];
								// 	this.btn_check = false
								// }
								//如果调用了查询接口那么添加的时候会自动请求查询接口（所有的数据）
								if(this.Query_project){
									// alert(1)
									// this.lookup();
									this.$emit('query',this.sub_url, this.child_index,this.Query_project,this.sort);
									this.refresh();
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
								}else{
									this.refresh();
									this.$emit('parent_data_sort', this.sub_url, this.sort,this.sort_name);
								}
							// });
							
							}
							
						})

					}
					//把选中项清空
					this.rows.forEach((item, index) => {
								if (this.btn_checkeds.length>0) {
									this.btn_checkeds.forEach((item,i)=>{
									//不渲染编辑列表
									this.edit_list[item] = false;
								})
									//复选框为空
									this.btn_checkeds=[];
									//总复选框为空
									this.btn_check = false
								}
					})
					//修改完成后清空数组项
					this.updata_edit = [];	
				}
					//是否能执行点击事件或者执行变化事件的标志
					this.tr_flag=true;
					//是否有选中项的标志
					this.list_some=false ;
					//取消选中的样式
					this.dynamic={};
					// console.log('====='+this.sort)
					
			},
			//编辑
			updata() {
				//当列表项选中的时候再进行编辑
				if (this.list_some == true) {
					//当有编辑项的时候执行是否有弹框的函数如果有就显示弹框按钮
					this.serch_fn();
					//正反序的标志
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
					//是否撤销禁用的样式
					this.btn_revoke = false;
					//是否删除禁用的样式
					this.btn_del = true;
					//是否编辑禁用的样式
					this.btn_edit = true;
					//是否新建禁用的样式
					this.btn_build = true;
					//当点击某一条数据时让复选框选中，点击编辑的时候禁止每一项的点击事件
					this.tr_flag=false;
						//当选中其中一项
						//当选中数组中的值大于0时遍历数组
						if (this.btn_checkeds.length>0) {
							this.btn_checkeds.forEach((item,index)=>{
								//当点击编辑时edit_list中的索引数据为true（渲染编辑后输入框的样式）
								this.edit_list[item] = true;
								//把每条数据push进updata_edit数组中
								this.updata_edit.push(this.rows[item]);
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
					//是否撤销禁用的样式
					this.btn_revoke = true;
					//是否删除禁用的样式
					this.btn_del = false;
					//是否编辑禁用的样式
					this.btn_edit = false;
					//是否新建禁用的样式
					this.btn_build = false;
					//显示提示框
					this.box_data.tips=true;
						this.current_state='请选择编辑项';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
				}
			},
			//新建
			add() {
				//正反序的标志
				this.sort_flag=false;
				//总复选框为true
				this.btn_check=true;
				// 复选框为空数组
				this.btn_checkeds=[];
				//取消选中的样式
				this.dynamic={};
				//点击新建时不能选中复选框
				this.tr_flag=false;
				//点击新建时增加遍历的条数
				this.num += 1;
				//点击新建时序号累加
				this.child_index += 1;
				//当数据项有复选框时新建时不选中
				this.check.push(false)
				//新建时根据头部类型push不同字段对象判断显示表单字段
				this.len = [];
				//保存的禁止点击
				this.preservation = false;
				//撤销的禁止点击
				this.revoke = false;
				//编辑的禁止点击
				this.isedit = true;
				//删除的禁止点击
				this.isdel = true;
				//是否禁用保存的样式
				this.btn_preservation = false;
				//是否禁用撤销的样式
				this.btn_revoke = false;
				//是否禁用删除的样式
				this.btn_del = true;
				//是否禁用编辑的样式
				this.btn_edit = true;
				//新建时执行函数判断是否显示弹框的标志
				this.serch_fn();
				//遍历数据头根据type字段显示不同的表单字段
				this.fields.forEach((item, index) => {
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
					}else if(item.type == 'date_time'||item.FieldType=='timestamp'){
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
					// ||item.Name=='fld_unlock_time'||item.Name=='fld_login_time'){
					if(item.FieldType=="datetime"||item.FieldType=='timestamp'){
						this.msg[this.num-1+'-'+index]='N/A';
					};
					if (item.Action!=undefined) {//当新建时看看头部数据有没有action字段如果有就显示点击标识
						tem.span_show=true;
					};
					//新建的时候把每条数据的显示标志对象push进数组，然后在模板tr中遍历len数组
					this.len.push(tem);		
				});
				//当点击新建时复选框跟着选中
				for(var i=0;i<this.num;i++){
					this.add_checkeds.push(i);
				};
				//每页最后一条序号数每添加一条就累加1
				this.child_index_total+=1;
				//总页数添加时累加
				this.increasing+=1;
			},
			//删除数据
			del() {
				//如果总复选框为true
				if (this.btn_check == true) {
					//显示删除弹框
					this.show_hide = true;
				} else {//如果没有选中总复选框则显示提示组件
					this.box_data.tips=true;
						this.current_state='请选择删除项';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
				}
			},
			//点击正反小三角切换数据的正序倒序
			data_sort(name) {
				// console.log(name)
				// alert(0)
				this.sort_name=name;
				//当数据请求完成在执行下次请求
				if (this.istrue.isorder == true) {
					//正序
					if (this.isup == 'itup' && this.isdown == 'itdown') {
						//小三角样式
						this.isup = 'isup';
						this.isdown = 'isdown';
						//正序接口参数
						this.sort='asc';
						//执行父组件函数
						this.$emit('parent_data_sort', this.sub_url, this.sort,name);
						//页数保持第一页
						this.page=1;
						//项目数的序号
						this.child_index = 0;
						//第多少条数据
						this.child_index_page=1;
						//每页最后一条序号
						this.child_index_total = this.data_page;
					} else if (this.isup == 'isup' && this.isdown == 'isdown') {//反序
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
				//当不是第一页的时候	
				if(this.child_index_page!=1){
					//接口加载完在执行下一次请求
					if (this.istrue.isstart == true) {
					// let time = new Date().getTime();
					let page = 1;
					//把复选框的数据清除
					this.btn_check = false;
					this.btn_checkeds.forEach((item, index) => {
						this.btn_checkeds[index] = false
					});
					//项目序号
					this.child_index = 0;
					//每一页的到第多少条数据
					this.child_index_total = this.data_page;
					this.$emit('child_home', this.sub_url, this.child_index, page,this.sort);
					//将页数赋值为1
					this.page=page;
					//每一页的第多少条数据
					this.child_index_page=1;
				   }
				}else{//如果已经是第一页那么显示提示组件
					this.box_data.tips=true;
					this.current_state='已经是第一页了';
					setTimeout(()=>{
						this.box_data.tips=false;
					},1000)
				}
				
			},
			//上一页
			previous_page() {
				//执行完成后的标志
				if (this.istrue.isfirst == true) {
					//将复选框的数据清除
					this.btn_check = false;
					this.btn_checkeds.forEach((item, index) => {
						this.btn_checkeds[index] = false
					});
					//当前的页数
					let page = this.project_data.page;
					// let time = new Date().getTime();
					if (page > 1 && page != undefined && page != null) {
						page--;
						//总条数减去当前的条数如果是最后一页会等于0
						if (this.project_data_copy - this.child_index_total != 0) {
							//根据索引计算序号值开始值（序号等于上一页的序号减去每页的数据条数）
							this.child_index = this.child_index - this.data_page;
							//每一页的到第多少条数据值
							this.child_index_total = this.child_index_total - this.data_page;
							//执行父组件函数
							this.$emit('child', this.sub_url, this.child_index, page,this.sort)
						} else {//如果是最后一页的数据
							this.child_index = this.child_index - this.data_page;
							//最后一页的数据是每页条数的几倍
							let positive_integer = window.parseInt(this.project_data.records / this.data_page);
							//检测是不是正整数
							let num=/^[0-9]*[1-9][0-9]*$/.test(this.project_data.records / this.data_page);
							//最后一页的数据的总条数如果是正整数那么mantissa的值就是0所以就是当为0时会直接减去定义好的每页显示的数据
							let mantissa = this.project_data.records - positive_integer * this.data_page;
							if(num==true){//当是正整数的时候会减去每页条数否则永远都会减去0，也就是count值不会变化
									//如果是整数那么大于page
									var num_z=positive_integer-page;
									//是到第几条{{}}中的数据 每页的末尾页数减去每页的页数
									this.child_index_total = this.child_index_total - mantissa-this.data_page*num_z;
							}else{
								//当最后一页添加数据时大于当前页的显示条数时点击前一页要多减去当前页
									//如果不是整数那么不大于page 每页的末尾页数减去最后一页的页数
									this.child_index_total = this.child_index_total - mantissa;
							}
							this.$emit('child_next', this.sub_url, this.child_index, page,this.sort);
						};
						////每一页的第多少条数据
						this.child_index_page-=this.data_page
					} else if (page <= 1) {
						this.child_index_page=1;
						this.box_data.tips=true;
						this.current_state='已经是第一页了';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
					}
					this.page=page;
				}		
			},
			//下一页
			next_page() {
				//判断当异步函数执行完成在执行同步代码
				if (this.istrue.isnext == true) {
					//如果此时有选中项那么将其清空
					this.btn_check = false;
					this.btn_checkeds.forEach((item, index) => {
						this.btn_checkeds[index] = false
					});
					//当前的页数
					let page = this.project_data.page;
					// let time = new Date().getTime();
					//表的总页数
					let positive_integer = window.parseInt(this.project_data.total);
					//当小于总页数的时候执行下一页的按钮
					if (page < positive_integer && page != undefined && page != null) {
						//页数累加
						page++;
						//当总页数减去上一页的最后一条数据页数大于每页的页数时说明不是最后一页
						if (this.project_data.records - this.child_index_total > this.data_page) {
							//当点击下一页后序号加上每页的总页数
							this.child_index = this.child_index + this.data_page;
							//每页的最后一条数据页数也加上每页的总页数
							this.child_index_total = this.child_index_total + this.data_page;
							//执行父组件函数
							this.$emit('child_next', this.sub_url, this.child_index, page,this.sort)
						} else {//如果总页数减去上一页的最后一条数据页数小于或者等于每页的页数说明是最后一页
							//当点击下一页后序号加上每页的总页数
							this.child_index = this.child_index + this.data_page;
							//最后一页的数据是每页页数的几倍
							// let positive_integer = window.parseInt(this.project_data.records / this.data_page);
							//最后一页的数据的总条数
							// let mantissa = this.project_data.records - positive_integer * this.data_page;
							//每页最后一条数据的页数
							// this.child_index_total = (positive_integer) * this.data_page + mantissa;
							// console.log(this.child_index_total==this.project_data.records)
							//最后一页的数据数
							this.child_index_total=this.project_data.records;
							this.$emit('child_next', this.sub_url, this.child_index, page,this.sort);
						};
						//每一页的第多少条数据
						this.child_index_page+=this.data_page
					} else if (page >= positive_integer) {
						// alert("已经是最后一页了")
						this.box_data.tips=true;
						this.current_state='已经是最后一页了';
						setTimeout(()=>{
							this.box_data.tips=false;
						},1000)
					}
					this.page=page;
				} 
			},
			//尾页
			last_page() {
				//当返回数据时在请求
					if (this.istrue.isend == true) {
					//把按钮选中的时候取消
					this.btn_check = false;
					this.btn_checkeds.forEach((item, index) => {
						this.btn_checkeds[index] = false
					});
					//最后一页的数据是16的几倍
					let positive_integer = window.parseInt(this.project_data.records / this.data_page);
					//检测是不是正整数
					let num=/^[0-9]*[1-9][0-9]*$/.test(this.project_data.records / this.data_page)
					//最后一页的数据的总条数
					let mantissa = this.project_data.records - positive_integer * this.data_page;
					//总页数
					var pasin = window.parseInt(this.project_data.total);
					//判断是否是最后一页
				if(this.page!=pasin){
					this.page=pasin;
					//如果是正整数说明最后一页是每页条数的整数倍
					if(num==false){//当总数据数除以总页数不是整数时则序号数为总页数的前一页乘以每页显示的数
						this.child_index = (positive_integer) * this.data_page;//最后一页第一条数据的序号
						this.child_index_page=this.project_data.records-mantissa+1;//最后一页的第{{}}中的数据为总数据数减去最后一页的数加上1
					}else{
						this.child_index = (positive_integer) * this.data_page-this.data_page;//如果是整数那么最后一页的数据的序号总页数乘以每页的页数减去一页的页数
						this.child_index_page=this.project_data.records-this.data_page+1;//最后一页的第{{}}中的数据为总数据页数减去最后一页页数加上1
					};
					this.child_index_total = (positive_integer) * this.data_page + mantissa; //是到第几条{{}}中的数据
					this.$emit('child_end', this.sub_url, this.child_index, pasin,this.sort)
					}else{
					this.box_data.tips=true;
					this.current_state='已经是最后一页了';
					setTimeout(()=>{
						this.box_data.tips=false;
					},1000)
				}
					}

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

.iconfont{
	font-size: 12px;
}
.hello{
	margin-top: -2px;
}
.thb{
	color:#095ee8
}
#tbody input{
    border: none;
    height: 25px;
}
.table tr th{
	background-color: #ebecf0;
	    transform: translateY(0px);
		text-align: center;
}
.table tr td,th{
	padding-left: 10px!important;
	padding-right: 10px!important;
	vertical-align:middle;
	box-shadow: inset 1px 0 0 0 #dee2e6;	
}

	
.table-bordered td{
	/* border:none; */
}
td{
	padding: 0;
}
.table td{
	padding: 0;
}
.list_color{
	background:#e4fdda!important;
}
.fa-ellipsis-h{
	color: #fff;
}
button, input{
	outline: none;
	/* padding: 0 10px; */
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
	    margin-left: -15px;
		position: relative;
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
	.modal-body i{
		font-size:18px;
		vertical-align:top;
		cursor: pointer;
		border: 1px solid #808080;
		border-left:none;
		color:#007bff;
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

	.table {
		font-size: 12px;
		border: 1px solid #dee2e6
		/* float: right; */
		/* overflow: auto; */
		/* max-height: 753px; */
	}

	.pagination a {
		color: #095ee8;
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
		/* z-index: 1; */
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
	.input-width{
		width: 100%;
	}
</style>
