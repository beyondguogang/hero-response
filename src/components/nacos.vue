<template>
  <div class="nacos">
    <div class="container-fluid list">
			<div class="row no-gutters shop">
				<div class="col-lg-12 col-md-12 table-responsive">
                    <div class="sel" >
                      <div role="document">
                       <div class="modal-content">
                        <div class="modal-body">
                              <form class="form-inline">
                                  <div class="form-group">
                                    <label for="exampleInputName2" class="lab">Data ID</label>
                                    <input type="text" class="form-control"  placeholder="模糊查询请输入Data ID" >
                                    <label for="exampleInputName2" class="lab">Group</label>
                                    <input type="text" class="form-control"  placeholder="模糊查询请输入Group" >
                                  </div>
                                  <button type="button" class="btn btn-default-determine" >搜索</button>
                              </form>
                         </div>
                       </div>
                     </div>
                    </div>
                    <table class="table table-bordered text-nowrap">
						<thead class="thead">
						<tr>
                            <td>Data Id</td>
                            <td>归属分组</td>
                            <td>归属项目</td>
                            <td>操作</td>
                        </tr>
						</thead>
						<tbody id="tbody">
						</tbody>
					</table>
			    </div>
			</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nacos',
  created(){
  },
  components: {
  }
}
</script>
<style scoped>
    table{
        font-size: 12px;
    }
    thead{
     background-color: #ebecf0;
    }
	.modal-content{
     border: none;
   }
   .modal-body{
      font-size: 14px;
   }
   .table{
     margin-top: 10px;
   }
   .form-control{
    margin-right: 10px;
    width: 140px;
    height: 30px;
    font-size: 13px;
   }
   .lab{
    margin-right: 10px;
   }
   .form-inline{
    font-size: 14px;
   }
  .list {
		padding-top: 100px;
		padding-right: 20px;
	}
  .btn-default-determine{
    color:#007bff;
    font-size:12px;
    border: 1px solid rgb(128, 128, 128);
    padding: 4px;
  }
</style>