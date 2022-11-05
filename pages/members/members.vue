<template>
	<view class="page">
		<checkbox-group @change="selected">
			<block v-for="dept in list" :key="dept.id">
				<view class="list-title">{{dept.deptName}} ({{dept.count}}人)</view>
				<view class="item" v-for="member in dept.members" :key="member.userId">
					<view class="key">{{member.name}}</view>
					<checkbox class="value" :value="member.userId" :checked="member.checked"></checkbox>
				</view>
			</block>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				members: []
			}
		},
		onShow: function() {
			this.loadData(this)
		},
		onLoad: function(options) {
			if (options.hasOwnProperty("members")) {
				let members = options.members
				this.members = members.split(",")
			}
		},
		methods: {
			loadData: function(ref) {
				ref.ajax(ref.url.searchUserGroupByDept, "post", {"keyword": ref.keyword}, function(res) {
					let result = res.data.result
					ref.list = result
					for (let dept of ref.list) {
						for (let member of dept.members) {
							if(ref.members.indexOf(member.userId + "") != -1) {
								member.checked = true
							} else {
								member.checked = false
							}
						}
					}
				})
			},
			selected: function(e) {
				let that = this
				that.members = e.detail.value
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				prevPage.members = that.members
				prevPage.finishMembers = true
			}
		}
	}
</script>

<style lang="scss">
.page {
	padding: 0 35rpx 65rpx 35rpx;
	.list-title {
		margin-top: 55rpx;
		margin-bottom: 25rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: $background-color;
		border-left: solid 15rpx $background-color;
		padding-left: 20rpx;
	}
	.item {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		padding: 30rpx 10rpx 30rpx 15rpx;
		color: $font-color;
		border-bottom: solid 1rpx #f0f0f0;
		.key {
			
		}
		.value {
			display: block;
		}
	}
}
</style>
