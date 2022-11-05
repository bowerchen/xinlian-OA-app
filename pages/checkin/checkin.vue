<template>
	<view>
		<camera class="camera" device-position="front" flash="off" @error="error" v-if="showCamera"></camera>
		<image class="image" :src="photoPath" mode="widthFix" v-if="showImage"></image>
		<view class="operate-container">
			<button class="btn" type="primary" @tap="clickBtn" :disabled="!canCheckin">{{btnText}}</button>
			<button class="btn" type="warn" @tap="afresh" >重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
	import QQMapWX from '../../lib/qqmap-wx-jssdk.min.js'
	var qqmapsdk
	export default {
		data() {
			return {
				showCamera: true,
				showImage: false,
				canCheckin: true,
				photoPath: '',
				btnText: '拍照',
				secret: {},
				latitude: "",
				longitude: "",
			}
		},
		onLoad: function() {
			qqmapsdk = new QQMapWX({
				key: "xx-xx-xxx-xx-xx-xx"
			})
			this.getLocation()
		},
		methods: {
			getLocation: function() {
				let that = this
				uni.getLocation({
					type: "gcj02", // WGS84（真实坐标） || gcj02（加密坐标）
					altitude: "true",
					success: function(res){
						that.latitude = res.latitude
						that.longitude = res.longitude
					}
				})
			},
			clickBtn: function() {
				let that = this
				
				if (that.btnText == '拍照') {
					let ctx = uni.createCameraContext()
					ctx.takePhoto({
						quality: "high",
						success: function(res) {
							that.photoPath = res.tempImagePath
							that.showCamera = false
							that.showImage = true
							that.btnText = '人脸识别'
						}
					})
				} else {
					// TODO 执行签到功能
					uni.showLoading({
						title:"开始人脸识别"
					})
					
					let path = that.photoPath
					let name = path.substr(path.lastIndexOf("/") + 1, path.length)
					let key = 'image/'+ name
					
					uni.uploadFile({
						url: that.url.fileUpload,
						filePath: path,
						name: 'file',
						formData: {
							'key': key
						},
						success: res => {
							let data = JSON.parse(res.data)
							// 人脸认证
							that.validFaceModel(data.key)
						}
					})
				}
			},
			afresh: function() {
				let that = this
				that.showCamera = true
				that.showImage = false
				that.btnText = '拍照'
			},
			validFaceModel: function(img) {
				var that = this
				that.ajax(that.url.validFaceModel, "get", {"photo": img}, function(res) {
					if (res.data.code == 500 && res.data.msg == "不存在人脸模型") {
						uni.hideLoading()
						uni.showModal({
							title: "提示",
							content: "EMOS系统中不存在你的人脸识别模型，是否用当前这张照片作为人脸识别模型？",
							success: function(res){
								if (res.confirm) {
									that.createFaceModel(img)
								}
								uni.showToast({
									title: "签到成功",
									complete: function() {
										that.uploadLocation(that)
									}
								})
							}
						})
					} else if (res.data.code == 200) {
						uni.hideLoading()
						uni.showToast({
							title: res.data.msg,
							duration: 5000,
							complete: function() {
								that.uploadLocation(that)
							}
						})
						
					} else if (res.data.code == 500){
						uni.showToast({
							icon: "error",
							title: res.data.msg
						})
					}
				})
			},
			createFaceModel: function(imgUrl) {
				this.ajax(this.url.createFaceModel, "get", { "photo": imgUrl}, function(res) {
					console.log("人脸模型创建成功"+ JSON.stringify(res))
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg
						})
					}
				})
			},
			uploadLocation: function(that) {
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: that.latitude,
						longitude: that.longitude
					},
					success: function(res) {
						let address = res.result.address
						let addressComponent = res.result.address_component
						let nation = addressComponent.nation
						let province = addressComponent.province
						let city = addressComponent.city
						let district = addressComponent.district
						
						let data = {
							 address,
							 country: nation,
							 province,
							 city,
							 district
						}
						
						that.ajax(that.url.checkin, "post", data, function(res) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.msg,
									complete: function() {
										uni.navigateTo({
											url: "../checkin_result/checkin_result"
										})
									}
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.camera, .image {
	width: 100%;
	height: 400px;
}
.operate-container {
	display: flex;
	justify-content: center;
	margin-top: 50rpx;
	.btn {
		width: 40%;
		margin: 0;
		&:first-child {
			margin-right: 30rpx;
		}
	}
}

.notice-container {
	padding: 40rpx 60rpx;
	.notice {
		font-size: 40rpx;
		color: $font-color;
		font-weight: bold;
		display: block;
		margin-bottom: 15rpx;
	}
	.desc {
		display: block;
		font-size: 32rpx;
		color: $desc-color;
		line-height: 1.6;
	}
}
</style>
