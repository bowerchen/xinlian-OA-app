<template>
	<view class="page">
		<image src="../../static/logo-3.jpg" mode="widthFix" class="logo"></image>
		<view class="add" v-if="checkPermission(['ROOT', 'MEETING:INSERT'])" @tap="toNoticePage(null, 'insert')">
			<image src="../../static/icon-17.png" mode="widthFix" class="icon"></image>
			<text>发布公告</text>
		</view>
		<view class="list-title">2022年4月1日</view>
		<view class="item">
			<view class="header">
				<view class="left">
					<text>系统公告</text>
				</view>
				<view class="right">
					<text>编辑</text>
				</view>
			</view>
			<view class="content">
				<view class="title">清明节放假通知</view>
				<view class="attr">
					<view class="timer">
						<image src="../../static/icon-14.png" mode="widthFix" class="icon"></image>
						<text>2022.4.1</text>
					</view>
					<view class="creator">
						<image src="../../static/icon-15.png" mode="widthFix" class="icon"></image>
						<text>管理员</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view v-for="one in list" :key="one.date">
			<view class="list-title">{{one.date}}</view>
			<view class="item" v-for="meeting in one.list" :key="meeting.id">
				<view class="header">
					<view class="left">
						<image src="../../static/icon-11.png" mode="widthFix" class="icon" v-if="meeting.type == '线上会议'"></image>
						<image src="../../static/icon-12.png" mode="widthFix" class="icon" v-if="meeting.type == '线下会议'"></image>
						<text>{{meeting.type}}</text>
						<text :class="meeting.status === '已结束' ? 'red' : 'blue'">（{{meeting.status}})</text>
					</view>
					<view class="right">
						<text>编辑</text>
					</view>
				</view>
				<view class="content">
					<view class="title">{{meeting.title}}</view>
					<view class="attr">
						<view class="timer">
							<image src="../../static/icon-14.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.start}}~{{meeting.end}}</text>
						</view>
						<view class="creator">
							<image src="../../static/icon-15.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.nickname}}</text>
						</view>
						<view class="place" v-if="meeting.type != '线上会议'">
							<image src="../../static/icon-16.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.place}}</text>
						</view>
					</view>
					<view class="desc">{{meeting.desc}}</view>
					<button class="btn" v-if="meeting.type == '线上会议'">复制</button>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				length: 20,
				list: [],
				isLastPage: false,
			}
		},
		onShow:function(){
			let that = this
			that.page = 1
			that.isLastPage = false
			that.list = []
			that.loadMeetingList(that)
		},
		onReachBottom: function() {
			let that = this
			if (that.isLastPage) {
				return
			}
			that.page = that.page + 1
			that.loadMeetingList(that)
		},
		methods: {
			loadMeetingList: function(ref) {
				let data = {
					page: ref.page, 
					length: ref.length
				}
				ref.ajax(ref.url.searchMyMeetingListByPage, "post", data, function(res) {
					let result = res.data.result
					if (result == null || result.length == 0) {
						ref.isLastPage = true
						ref.page = ref.page - 1
						if (ref.page > 1) {
							uni.showToast({
								icon: "none",
								title: "已经到底了"
							})
						}
					} else {
						for(let one of result) {
							for(let meeting of one.list) {
								if (meeting.type == 1) {
									meeting.type = "线上会议"
								} else if (meeting.type == 2) {
									meeting.type = "线下会议"
								}
								
								if (meeting.status == 1) {
									meeting.status = "待审批"
								} else if(meeting.status == 2) {
									meeting.status = "已审批"
								} else if (meeting.status == 3) {
									meeting.status = "进行中"
								} else if (meeting.status == 4) {
									meeting.status = "已结束"
								}
							}
							
							if(ref.list.length > 0) {
								let last = ref.list[ref.list.length-1]
								if (last.date == one.date) {
									last.list = last.list.concat(one.list)
								} else {
									ref.list.push(one)
								}
							} else {
								ref.list.push(one)
							}
						}
					}
				})
			},
			toNoticePage: function(id, opt) {
				uni.navigateTo({
					url: "../notice/notice?id" + id + "&opt=" + opt
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	padding: 35rpx 45rpx;
	position: relative;
	.logo {
		margin-top: 30rpx;
		margin-bottom: 45rpx;
		width: 100%;
	}
	.add {
		position: absolute;
		top: 50rpx;
		display: flex;
		justify-content: center;
		.icon {
			width: 40rpx;
			margin-right: 10rpx;
			margin-top: 6rpx;
		}
		text {
			color: $background-color;
			font-size: 32rpx;
		}
	}
	.list-title {
		margin-bottom: 35rpx;
		font-size: 38rpx;
		font-weight: bold;
		color: $background-color;
		border-left: solid 15rpx $background-color;
		padding-left: 20rpx;
	}
	.item {
		border: solid #e0e0e0 1rpx;
		padding: 30rpx;
		background-color: #f7f9fd;
		border-radius: 15rpx;
		margin-bottom: 45rpx;
		.header {
			display: flex;
			justify-content: space-between;
			border-bottom: solid #e0e0e0 1rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			.left{
				display: flex;
				.icon {
					width: 46rpx;
					margin-right: 20rpx;
					margin-top: -5rpx;
				}
				text {
					font-size: 32rpx;
					color: $font-color;
				}
				.blue {
					color: $background-color;
				}
				.red {
					color: #ff4234;
				}
			}
			.right{
				text {
					font-size: 32rpx;
					color: $background-color;
					
				}
			}
		}
		.content {
			position: relative;
			.title {
				font-size: 34rpx;
				color: $font-color;
			}
			.attr {
				display: flex;
				color: #999999;
				font-size: 30rpx;
				padding: 15rpx 0;
				.timer, .creator, .place {
					margin-right: 35rpx;
					display: flex;
					.icon {
						width: 36rpx;
						margin-right: 10rpx;
						margin-top: 5rpx;
					}
				}
			}
			.desc {
				color: #999999;
				font-size: 30rpx;
				line-height: 1.6;
			}
			.btn {
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				background-color: $background-color;
				color: #FFFFFF;
				width:  140rpx;
				height: 60rpx;
				border-radius: 30rpx;
				line-height: 60rpx;
				font-size: 30rpx;
				&:active {
					background-color: $background-color-active;
				}
				&::after {
					border: none;
				}
			}
		}
	}
}
</style>
