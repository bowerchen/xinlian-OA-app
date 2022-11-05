<template>
	<view class="page" v-if="checkPermission(['ROOT', 'MEETING:INSERT', 'MEETING:UPDATE'])">
		<view class="attr">
			<view class="list">
				<view class="item vertical">
					<view class="key">今天完成工作</view>
					<textarea class="textarea"></textarea>
				</view>
				<view class="item vertical">
					<view class="key">未完成工作</view>
					<textarea class="textarea"></textarea>
				</view>
				<view class="item vertical">
					<view class="key">需协调工作</view>
					<textarea class="textarea"></textarea>
				</view>
				<view class="item vertical">
					<view class="key">备注</view>
					<textarea class="textarea"></textarea>
				</view>
			</view>
		</view>
		<button class="btn" type="default" @tap="save()">提交</button>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				canEdit: true,
				title: '',
				date: '',
			}
		},
		methods: {
			save: function() {
				let that = this
				let array = []
				for(let one of that.members) {
					array.push(one.id)
				}
				let data = {
					title: that.title, 
					date: that.date,
					start: that.start,
					end: that.end,
					type: Number(that.typeIndex) + 1,
					members: JSON.stringify(array),
					desc: that.desc,
					id: that.id,
					instanceId: that.instanceId
				}
				
				if(that.typeIndex == "1") {
					data.place = that.place
				}
				let url;
				if (that.opt == "insert") {
					url = that.url.insertMeeting
				} else if (that.opt == "edit") {
					url = that.url.updateMeetingInfo
				}
				that.ajax(url, "post", data, function(res) {
					uni.showToast({
						icon: "success",
						title: "保存成功",
						complete:function(){
							setTimeout(function() {
								uni.navigateBack({
									
								})
							}, 2000)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.page {
	padding: 35rpx 0;
	.header {
		position: relative;
		padding: 0 35rpx;
		.title {
			border-bottom: solid 1rpx #f0f0f0;
			padding: 30rpx 15rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: $background-color;
		}
		.title-placeholder {
			font-size: 34rpx;
		}
		.edit-icon {
			width: 40rpx;
			position: absolute;
			right: 45rpx;
			top: 35rpx;
		}
	}
	.attr {
		padding: 0 35rpx;
		// border-bottom: solid 20rpx #eeeef4;
		.list {
			.item {
				padding: 30rpx 10rpx 30rpx 15rpx;
				border-bottom: solid 1rpx #f0f0f0;
				font-size: 30rpx;
				color: $font-color;
				display: flex;
				justify-content: space-between;
				.key {
					font-weight: bold;
					font-size: 32rpx;
					color: $font-color;
				}
				.value {
					display: block;
					color: $font-color;
				}
				.textarea {
					// border: 1rpx solid #ddd;
					width: 100%;
					height: 150rpx;
					margin-top: 20rpx;
				}
				&:last-child {
					// border-bottom: none;
				}
			}
			
			.vertical {
				flex-direction: column;
			}
		}
		.desc {
			display: block;
			font-size: 32rpx;
			padding: 30rpx 10rpx 30rpx 15rpx;
			color: $font-color;
			line-height: 1.6;
		}
	}
	.members {
		padding: 45rpx 25rpx;
		.number {
			margin-bottom: 35rpx;
			color: $background-color;
			font-size: 34rpx;
			font-weight: bold;
			padding-left: 20rpx;
		}
		.member {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			.user {
				width: 100rpx;
				text-align: center;
				max-width: 20%;
				min-width: 20%;
				margin-bottom: 40rpx;
				.photo {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-bottom: 5rpx;
				}
				.name {
					font-size: 30rpx;
					color: $font-color;
					display: block;
					text-align: center;
				}
			}
			.add {
				width: 100rpx;
				min-width: 20%;
				max-width: 20%;
				margin-bottom: 40rpx;
				.add-btn {
					width: 100rpx;
					display: block;
					margin-left: auto;
					margin-right: auto;
				}
			}
		}
	}
	.btn {
		margin: 20rpx 35rpx 35rpx 55rpx;
		background-color: $background-color;
		color: white;
		&:active {
			background-color: $background-color-active;
		}
		&.warn {
			background-color: #e64340;
		}
	}
}
</style>
</st