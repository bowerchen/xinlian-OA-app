<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="logo"></image>
		<view class="register-container">
			<input type="text" v-model="registerCode" placeholder="请输入您的邀请码" class="register-code" maxlength="6" />
			<view class="register-desc">
				管理员创建员工证账号之后，你可以从你的个人邮箱中获得注册邀请码
			</view>
			<button type="default" class="register-btn" open-type="getUserInfo" @tap="register()">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerCode: ""
			}
		},
		methods: {
			register: function() {
				let that = this
				if (that.registerCode.length == 0 || that.registerCode == null) {
					uni.showToast({
						icon: "none",
						title: "邀请码不能为空"
					})
					return
				} else if (/^[0-9]{6}$/.test(that.registerCode) == false) {
					uni.showToast({
						icon:"none",
						title: "邀请码必须为6位数字"
					})
					return
				}
				uni.login({
					provider: "weixin",
					success:function(res){
						let code = res.code
						uni.getUserInfo({
							provider: "weixin",
							success:function(res){
								let nickName = res.userInfo.nickName
								let avatarUrl = res.userInfo.avatarUrl
								let data = {
									code: code,
									nickname: nickName,
									photo: avatarUrl,
									registerCode: that.registerCode
								}
								that.ajax(that.url.register, 'POST', data, function(res) {
									let permission = res.data.permission
									uni.setStorageSync("permission", permission)
									console.log(permission)
									// TODO 跳转到Index
									uni.switchTab({
										url:"../index/index"
									})
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../style.scss";

.logo {
	width: 70%;
	display: block;
	margin-left: auto;
	margin-right: auto;
	margin-top: 80rpx;
}
.register-container {
	width: 70%;
	margin-top: 150rpx;
	margin-left: auto;
	margin-right: auto;
	.register-code {
		border: 1px solid #e0e0e0;
		font-size: 34rpx;
		color: $font-color;
		text-align: center;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		height: 80rpx;
		padding: 0 20rpx;
	}
	.register-desc {
		color: $desc-color;
		font-size: 28rpx;
		line-height: 1.5;
		margin-bottom: 80rpx;
	}
	.register-btn {
		background-color: $background-color;
		color: #FFFFFF;
		&:active {
			background-color: $background-color-active;
		}
	}
}
</style>
