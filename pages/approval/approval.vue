<template>
	<view class="page">
		<view class="meeting">
			<view class="header">{{title}}</view>
			<view class="attr">
				<view class="list">
					<view class="item">
						<view class="key">日期</view>
						<text class="value">{{ date }}</text>
					</view>
					<view class="item">
						<view class="key">开始时间</view>
						<text class="value">{{ start }}</text>
					</view>
					<view class="item">
						<view class="key">结束时间</view>
						<text class="value">{{ end }}</text>
					</view>
					<view class="item">
						<view class="key">会议类型</view>
						<text class="value">{{ typeArray[typeIndex] }}</text>
					</view>
					<view class="item" v-if="typeArray[typeIndex] == '线下会议'">
						<view class="key">地点</view>
						<view class="value">{{ place }}</view>
					</view>
				</view>
				<view>
					<text class="desc">{{ desc }}</text>
				</view>
			</view>
			<view class="members">
				<view class="number">参会者 （{{members.length}}人）</view>
				<view class="member">
					<view class="user" v-for="one in members" :key="one.id">
						<image :src="one.photo" mode="widthFix" class="photo"></image>
						<text class="name">{{one.name}}</text>
					</view>
				</view>
			</view>
			<block>
				<button class="btn" @tap="approvalMeeting('同意')" type="primary">同意</button>
				<button class="btn" @tap="approvalMeeting('不同意')" type="warn">不同意</button>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				title: '',
				typeArray: ['在线会议', '线下会议'],
				typeIndex: 0,
				place: '',
				desc: '',
				members: [],
				date: '',
				start: '',
				end: ''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			let that = this
			that.ajax(that.url.searchMeetingById, "POST", {id: that.id}, function(res) {
				let result = res.data.result
				that.title = result.title
				that.date = result.date
				that.start = result.start
				that.end = result.end
				that.typeIndex = result.type - 1
				that.place = result.place
				let desc = result.desc
				if (desc != null && desc != '') {
					that.desc = desc
				}
				that.members = result.members
			})
		},
		methods: {
			approvalMeeting: function(approval) {
				let that = this
				let approveStatus = approval == '同意' ? 1 : 0
				uni.showModal({
					title: "提示信息",
					content: "你"+approval+"这条申请?",
					success: function(res) {
						if (res.confirm) {
							let data = {
								id: Number(that.id),
								status: 2,
								approveStatus: approveStatus
							}
							console.log(data)
							that.ajax(that.url.updateMeetingStatus, "post", data, function(res) {
								let code = res.data.code
								 if (code == 200) {
									 uni.showToast({
									 	icon: "success",
										title: "已"+approval+"该申请"
									 })
									 setTimeout(function() {
										 uni.navigateBack({
										 	
										 })
									 }, 1500)
								 } else {
									 uni.showToast({
									 	icon: "none",
									 	title: res.data.msg
									 })
								 }
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.page {
	padding: 35rpx 0;
}

.header {
	margin-bottom: 15rpx;
	font-size: 34rpx;
	color: #3474FF;
	font-weight: bold;
	padding: 0 50rpx;
}
.attr {
	padding: 0 35rpx;
	border-bottom: solid 20rpx #EEEEF4;
	.list {
		.item {
			padding: 30rpx 10rpx 30rpx 15rpx;
			border-bottom: solid 1rpx #f0f0f0;
			font-size: 30rpx;
			color: #333;
			display: flex;
			justify-content: space-between;
			.value {
				display: block;
				color: #333;
			}
		}
	}
	.desc {
		display: block;
		font-size: 30rpx;
		padding: 30rpx 10rpx 30rpx 15rpx;
		color: #333;
		line-height: 1.6;
	}
}
.members {
	padding: 45rpx 25rpx;
	.number {
		margin-bottom: 35rpx;
		color: #3474FF;
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
				border-radius: 50rpx;
				margin-bottom: 5rpx;
			}
			.name {
				font-size: 30rpx;
				color: #333;
				display: block;
				text-align: center;
			}
		}
	}
}

.btn {
	margin: 0 35rpx 35rpx 55rpx;
}
</style>
