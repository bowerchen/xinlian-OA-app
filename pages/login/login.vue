<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode="widthFix"></image>
		<view class="logo-title">
			EMOS企业在线办公系统
		</view>
		<view class="logo-subtitlte">
			Version 2022
		</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()">
			登录系统
		</button>
		<view class="register-container">
			没有账号？
			<text class="register" @tap="toRegister()">立即注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toRegister: function() {
				uni.navigateTo({
					url: "../register/register"
				})
			},
			login: function() {
				let that = this
				uni.login({
					provider:"weixin",
					success:function(res){
						let code = res.code
						that.ajax(that.url.login, "GET", {code}, function(res) {
							if (res.data.code == 500 && res.data.msg == "账号未注册") {
								uni.showToast({
									icon: "none",
									title: "账号尚未注册,即将跳转到注册页面",
								})
								setTimeout(function() {
									uni.navigateTo({
										url: "../register/register"
									})
								}, 2000)
							} else {
								uni.setStorageSync("permission", res.data.permission)
								uni.setStorageSync("token", res.data.token)
								// TODO 跳转到登录页面
								uni.switchTab({
									url: "../index/index",
									success: function() {
										let page = getCurrentPages().pop()
										if (page === undefined || page === null) return
										page.onLoad()
									}
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
	margin-left: auto;
	margin-right: auto;
	display: block;
	margin-top: 30%;
}

.logo-title {
	font-size: 48rpx;
	font-weight: bold;
	text-align: center;
	margin-top: 8%;
	color: $font-color;
}

.logo-subtitlte {
	font-size: 34rpx;
	text-align: center;
	color: $font-color;
	margin-top: 20rpx;
}

.login-btn {
	width: 60%;
	position: absolute;
	bottom: 20%;
	left: 20%;
	background-color: $background-color;
	color: #FFFFFF;
	box-sizing: border-box;
	&:active {
		background-color: $background-color-active;
	}
}

.register-container {
	position: absolute;
	bottom: 50rpx;
	width: 100%;
	text-align: center;
	font-size: 30rpx;
	color: $font-color;
	.register {
		color: $background-color;
	}
}

</style>
