<template>
	<div class="hello">
			<div class="row no-gutters shop">
				<!-- 设置一个动态的高度溢出时自动显示滚动条 -->
				<div class="col-lg-12  col-md-12 table-responsive">
					<table class="table text-nowrap " style="" >
						<!-- 表格头部 -->
						<!-- 将表头固定 translateY的优先层级最高当高度超出时出现滚动条滚动时表头一直计算滚动的高度所以内容数据一直往上滚动而表头固定-->
						<thead class="thead" >
							<tr >
								<th class="thb" v-for="(head,index) in res_fields" :key="index">{{head}} 
								</th>
                                <th class="thb">操作</th>
							</tr>
						</thead>
						
						<!-- 表格数据 -->
						<tbody id="tbody" >
							<!-- 编辑时把数据填充到输入框中 加上item是为了避免key值的和上一个tr的key值重复-->
							<tr v-for="(item,index) in record_data" :class="{list_color:dynamic[index]==item}" :key="index+item" >
								<!-- 渲染多个tr project为对象的每一项-->
								<td class="fixed-list" v-for="(project,key,index_list) in record_pro" :key="index_list" :title="project">
									<!-- 如果没有点击编辑则直接是渲染的数据 -->
									<template v-if="!edit_list">
										{{project}}
									</template>    
									<!-- 如果点击了编辑就渲染编辑后的数据 -->
									<template v-if="edit_list">
                                        <span v-if="key=='fld_name'">{{project}}</span>
                                        <div v-if="key=='fld_progress_id'">
                                            <input type="text"  v-model="record_pro.fld_progress_id" style="border:1px solid #96999c">
                                            <button @click="commit_progress">提交</button>
                                        </div>
									</template>
								</td>
                                <td ><button @click="edit_flag&&edit_progress()" :style="{opacity:opacity}">编辑</button></td>
							</tr>
							
						</tbody>
					</table>
				</div>
			</div>
			<!-- 如果没有数据显示 -->
		<div style="margin-top: 100px;margin-left: 50%;color: #666;" v-show="!res_fields">暂无数据</div>
		<!-- 底部结构 -->
			<!-- <div class="row row-a" >
                <div class="col-lg-12  col-md-12  footer " v-show="fields">

                </div>
			</div> -->
			  <!-- 遮罩层 -->
  <!-- <div style="width: 100%;height: 100%;background: #e2e2e2;color: #e2e2e2;position: fixed;top: 0;opacity: .5;" v-if="box_data.project_engineering||box_data.tank_channel||
  box_data.user||box_data.time||box_data.edit||box_data.sel||box_data.mail||box_data.items||box_data.sel_shows||box_data.jurisdiction||box_data.role_edit||box_data.tips"></div> -->
			<!-- <div style="background:red;position:relative"> -->
		<template>
			
		</template>
			</div>	
		
	<!-- </div>    -->
</template>
<script>
	export default {
		name: 'shop',
		data() {
			return {
				//数据列表颜色控制
				dynamic:{},
				//编辑列表的数据
				edit_list: false,
				//编辑更新的数据对象
				//当总项目条数大于16时显示一页16条数据
				data_page: 16,
                //渲染的数据头
                record_data:[],
                //数据体
                record_pro:{},
                //主键
                fld_record_id:'',
                //cliumns中的返回数据
                res_data:null,
                //是否可以点击按钮
                edit_flag:true,
                //不可点击样式
                opacity:1,
			}
		},
		components:{
			  
		},
		created(){
			 this.get_data()
		},
		mounted() {
           
		},
		computed: {
			
		},
		props: {
		},
		methods: {
            //提交progress
            commit_progress(){
                this.edit_list=false;
                let parameter={};
                this.opacity=1;
                this.edit_flag=true;
                parameter.fld_name=this.record_pro.fld_name;
                parameter.fld_progress_id=this.record_pro.fld_progress_id;
                parameter.fld_record_id=this.fld_record_id;
                parameter.oper = 'edit';
				parameter._oper = 'edit';
				parameter.userInfo = window.sessionStorage.getItem('userInfo');
                this.axios.post(this.api+'/bin/Admin/Admin/Users/jqgrid_oper/update',this.qs.stringify(parameter), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(item=>{
                            this.get_data();
                })
            },
            //编辑progrees
            edit_progress(){
                this.edit_list=true;  
                this.edit_flag=false; 
                this.opacity=0.5;         
                },
            //获取数据
            get_data(){
                this.res_fields=[];
                this.record_data=[];
                let time = new Date().getTime();
                this.userInfo=JSON.parse(window.sessionStorage.getItem('userInfo'));
                this.axios.post(this.api+'/bin/Admin/Admin/Users/columns',{userInfo:this.userInfo}).then(res=>{
                    this.res_data=res.data
                    res.data.FIELDS.forEach((item,index)=>{
                        if(item.Name=='fld_name'||item.Name=="fld_progress_id"){
                            this.res_fields.push(item.Comment)
                        }
                    })
                    let parameter={
						_search: false,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: res.data.PRIMARY,
						sord: 'desc',
						}
						parameter.userInfo=JSON.stringify(this.userInfo);
                    this.axios.post(this.api+res.data.JQ_GRID_LOAD,parameter).then(res=>{
                        res.data.rows.forEach((item,index)=>{if(item.fld_record_id==this.userInfo.fld_record_id){
                                this.fld_record_id=item.fld_record_id;
                                this.record_data.push(item);
                                this.record_pro.fld_name=item.fld_name;
                                this.record_pro.fld_progress_id=item.fld_progress_id;
                            }
                        })
                       
                    })
                })
            },
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
</style>
