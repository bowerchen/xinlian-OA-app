<template>
	<view class="page">
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="8000" :duration="1000">
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/swiper-1.jpg" mode="widthFix"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/swiper-2.jpg" mode="widthFix"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/swiper-3.jpg" mode="widthFix"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/swiper-4.jpg" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="notify-container" @tap="toPage('消息提醒', '/pages/message_list/message_list')">
			<view class="notify-title">
				<image src="../../static/icon-1.png" mode="widthFix" class="notify-icon"></image>
				消息提醒
			</view>
			<view class="notify-content">
				你有 {{ unreadRows }} 条未读消息
			</view>
			<image src="../../static/icon-2.png" mode="widthFix" class="more-icon"></image>
		</view>
		<view class="nav-container">
			<view class="nav-row">
				<view class="nav" @tap="toPage('在线签到', '../notice_list/notice_list')">
					<image src="../../static/nav-9.png" mode="widthFix" class="icon"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav" @tap="toPage('事项审批', '../approval_list/approval_list')">
					<image src="../../static/nav-10.png" mode="widthFix" class="icon"></image>
					<text class="name">事项审批</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-11.png" mode="widthFix" class="icon"></image>
					<text class="name">物品领用</text>
				</view>
				<view class="nav" @tap="toPage('报销申请', '../payment/payment')">
					<image src="../../static/nav-12.png" mode="widthFix" class="icon"></image>
					<text class="name">报销申请</text>
				</view>
				
			</view>
			<view class="nav-row">
				<view class="nav" @tap="toPage('员工日报', '../daily_report/daily_report')">
					<image src="../../static/nav-5.png" mode="widthFix" class="icon"></image>
					<text class="name">员工日报</text>
				</view>
				<!-- <view class="nav">
					<image src="../../static/nav-6.png" mode="widthFix" class="icon"></image>
					<text class="name">我的加班</text>
				</view> -->
				<view class="nav">
					<image src="../../static/nav-7.png" mode="widthFix" class="icon"></image>
					<text class="name">付款申请</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-8.png" mode="widthFix" class="icon"></image>
					<text class="name">费用报销</text>
				</view>
				<view class="nav" @tap="toPage('在线请假', '../absence/absence')">
					<image src="../../static/nav-3.png" mode="widthFix" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav" @tap="toPage('在线签到', '../checkin_location/checkin_location')">
					<image src="../../static/nav-1.png" mode="widthFix" class="icon"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-2.png" mode="widthFix" class="icon"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-3.png" mode="widthFix" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-4.png" mode="widthFix" class="icon"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popupMsg" type="top">
			<uni-popup-message type="success" :message="'接受到' + lastRows + '条消息'" :duration="2000"></uni-popup-message>
		</uni-popup>
		<uni-popup ref="popupDialog" type="center">
			<uni-popup-dialog type="warning" title="尚未登录" content="登录验证已失效, 是否重新登录" @confirm="toLogin('用户登录', '../login/login')"></uni-popup-dialog>
		</uni-popup>
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
				unreadRows: 0,
				lastRows: 0,
				timer: null
			}
		},
		onLoad() {
			let that = this
			uni.$on("showMessage", function() {
				that.$refs.popupMsg.open()
			})
			that.ajax(that.url.refreshMessage, "get", null, function(res) {
				that.unreadRows = res.data.unreadRows
				that.lastRows = res.data.lastRows
				if (that.lastRows > 0) {
					uni.$emit("showMessage")
				}
			})
		},
		onUnload() {
			uni.$off("showMessage")
		},
		onShow() {
			let that = this
			let token = uni.getStorageSync('token')
			if (!token) {
				that.$refs.popupDialog.open()
			}
			uni.checkSession({
				fail: function() {
					that.$refs.popupDialog.open()
				}
			})
			
			that.timer = setInterval(function() {
				that.ajax(that.url.refreshMessage, "get", null, function(res) {
					that.unreadRows = res.data.unreadRows
					that.lastRows = res.data.lastRows
					if (that.lastRows > 0) {
						uni.$emit("showMessage")
					}
				})
			}, 5000)
		},
		onHide() {
			clearInterval(this.timer)
		},
		methods: {
			toPage: function(name, url) {
				uni.navigateTo({
					url: url
				})
			},
			toLogin: function(name, url) {
				this.toPage(name, url)
				this.$refs.popupDialog.close()
			}
		}
	}
</script>

<style lang="scss">
.page {
	background-color: #EEEEF4;

	.swiper {
		height: 210px;
		margin-bottom: 20rpx;
		image {
			width: 100%;
		}
	}

	.notify-container{
		background-color: #FFFFFF;
		padding: 25rpx;
		position: relative;
		margin-bottom: 20rpx;
		.notify-title {
			font-size: 34rpx;
			color: $background-color;
			margin-bottom: 10rpx;
			.notify-icon {
				width: 38rpx;
				margin-right: 5rpx;
				vertical-align: -8rpx;
			}
		}
		.notify-content {
			font-size: 30rpx;
			color: $font-color;
			&:before {
				content: "";
				display: inline-block;
				width: 12rpx;
				height: 12rpx;
				background: #DD524D;
				border-radius: 6rpx;
				margin-left: 18rpx;
				margin-right: 15rpx;
				vertical-align: 3rpx;
			}
		}
		.more-icon {
			position: absolute;
			right: 5rpx;
			top: 50rpx;
			width: 60rpx;
		}
	}
	
	.nav-container {
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		padding: 50rpx 20rpx;
		.nav-row {
			display: flex;
			justify-content: space-around;
			margin-bottom: 50rpx;
			.nav {
				text-align: center;
				.icon {
					width: 80rpx;
				}
				.name {
					display: block;
					font-size: 30rpx;
					color: $font-color;
				}
			}
		}
	}
}

</style>
