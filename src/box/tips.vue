<template>
  <div class="tips">
    <div class="popup">
		<p class="content">{{current_state}}</p>
	</div>
  </div>
</template>
<script>
export default {
	mounted(){
	},
  name: 'About',
  props:{
    current_state:String,
  },
  components: {}
}
</script>
<style scoped>
	.tips{
		z-index:999
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
        border-radius: 5px;
	}
    .content {
		margin: 10px 10px 10px 10px;
	}
</style>