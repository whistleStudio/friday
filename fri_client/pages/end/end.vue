<template>
	<view>
		<h1>{{gameRes}}</h1>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameRes: "defeat"
			}
		},
		methods: {
			
		},
		onLoad (p) {
			console.log(typeof p.win, p.win)
			if (p.win==1) this.gameRes = "victory"
		}
	}
</script>

<style>

</style>
