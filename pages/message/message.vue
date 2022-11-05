<template>
	<view>
		<view class="message">
			<view class="header">
				<view class="desc">{{sendTime}}</view>
				<view class="opt" @tap="deleteMsg">删除</view>
			</view>
			<view class="content">{{msg}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sendTime: "",
				msg: "",
				id: null,
				readFlag: null,
				refId: null
			}
		},
		onShow: function() {
			let that = this
			uni.setNavigationBarTitle({
				title: "系统通知"
			})
			that.ajax(that.url.searchMessageById, "post", {"id": that.id}, function(res) {
				let result = res.data.result
				that.sendTime = result.sendTime
				that.msg = result.msg
			})
		},
		onLoad: function(options) {
			let that = this
			that.id = options.id
			that.readFlag = options.readFlag == "true" ? true : false
			that.refId = options.refId
			
			if(!that.readFlag) {
				that.ajax(that.url.updateUnreadMessage, "post", {"id": that.refId}, function(res) {
					console.log("消息更新成已读状态")
				})
			}
		},
		methods: {
			deleteMsg() {
				let that = this
				uni.showModal({
					title: "提示信息",
					content: "是否要删除这条消息？",
					success: function(res) {
						if (res.confirm) {
							that.ajax(that.url.deleteMessageRefById, "post", {"id": that.refId}, function(res) {
								uni.showToast({
									icon: "success",
									title: "删除成功",
									complete: function() {
										setTimeout(function() {
											uni.navigateBack({
												delta: 1
											})
										}, 1000)
									}
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.message {
	margin: 55rpx;
	.header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
		.desc {
			font-size: 28rpx;
			color: #999;
		}
		.opt {
			font-size: 28rpx;
			color: red;
			padding-left: 10rpx;
		}
	}
	.content {
		background-color: #f5f5f5;
		font-size: 32rpx;
		padding: 20rpx 45rpx;
		line-height: 1.8;
		color: $font-color;
		border-radius: 15rpx;
	}
}
</style>
