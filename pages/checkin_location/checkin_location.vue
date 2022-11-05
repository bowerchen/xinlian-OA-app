<template>
	<view>
		<map id="map" ref="map" :latitude="latitude" :longitude="longitude" class="map" scale="18"
		show-location='true' :circles="circles" :markers="markers" :enable-building='true'></map>
		<view class="checkin-wrapper">
			<button class="in-clock blue" :disabled="canCheckin"  @tap="uploadLocation()">
				<view class="btn-time">{{ time }}</view>
				<text class="btn-txt">{{ btnText }}</text>
			</button>
			<view :class="isRange ? 'range range_green' : 'range range_red'">
				{{range_text}}
			</view>
			<button class="out-clock" @tap="toPage('人脸识别', '../checkin/checkin')">外勤签到>></button>
		</view>
	</view>
</template>

<script>
	import QQMapWX from '../../lib/qqmap-wx-jssdk.min.js'
	var qqmapsdk
	export default {
		data() {
			return {
				latitude: "",
				longitude: "",
				btnText: "",
				time: "",
				range_text: "" ,
				isRange: true,    // true -> 在范围
				canCheckin: false,
				markers: [{
					id: 1,
					latitude: 23.119067,
					longitude: 113.350738,
				}],
				circles: [{
					latitude: 23.119067,
					longitude: 113.350738,
					fillColor: '#2979ff6A',
					radius: 400,
				}]
			}
		},
		onLoad: function() {
			qqmapsdk = new QQMapWX({
				key: "xx-xx-xxx-xx-xx-xx"
			})
		},
		onShow: function() {
			var that = this
			// 获取当前定位
			this.isGetLocation()
			
			// 获取当前时间
			setInterval(() => {
				let date = new Date()
				let hour = date.getHours()
				let minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
				that.time = hour + ":" + minute
			}, 1000)
			
			// 判断当时是否能打卡
			that.validCanCheckIn(that)
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
						that.getMaxRangeAddress()
					}
				})
			},
			getAuthorizeInfo: function(a = "scope.userLocation") {
				let that = this
				uni.authorize({
					scope: a,
					success: function() {
						that.getLocation()
					},
					fail: function() {
						uni.showToast({
							icon: "none",
							title: "你拒绝了授权，无法获得周边信息"
						})
					}
				})
			},
			isGetLocation: function(a = "scope.userLocation") {
				let that = this
				uni.getSetting({
					success(res) {
						if (!res.authSetting[a]) {
							that.getAuthorizeInfo()
						} else {
							that.getLocation()
						}
					}
				})
			},
			// 公司地址范围限制
			getMaxRangeAddress: function(res) {
				
				// 地球半径（公里）
				let EARTH_RADIUS = 6378.393
				
				// 当前位置经纬度
				let lat1 = this.rad(this.latitude)
				let lon1 = this.rad(this.longitude)
				
				// 公司位置经纬度
				let lat2 = this.rad(this.markers[0].latitude)
				let lon2 = this.rad(this.markers[0].longitude)
				
				// 公里换算米
				let distance = (Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
				Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * EARTH_RADIUS) * 1000
				
				if (distance <= this.circles[0].radius) {
					this.isRange = true
					this.range_text = "你已在打卡范围内"
				} else {
					this.canCheckin = true
					this.isRange = false
					this.range_text = "你已超出打卡范围"
				}
			},
			rad: function(d) {
				//  将角度换算为弧度
				return d * Math.PI / 180.0;
			},
			// 上传地理位置
			uploadLocation: function() {
				var that = this
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: this.latitude,
						longitude: this.longitude
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
							 district,
							 imgUrl: that.photoPath,
						}
						uni.showLoading({
							title:"签到中请稍后"
						})
						that.ajax(that.url.checkin, "post", data, function(res) {
							if (res.data.code == 200) {
								uni.hideLoading()
								uni.showToast({
									duration: 2000,
									title: res.data.msg,
									complete: function() {
										uni.navigateTo({
											url: '../checkin_result/checkin_result',
										})
									}
								})
							}
						})
					}
				})
			},
			validCanCheckIn: function(that) {
				that.ajax(that.url.validCanCheckIn, "get", {}, function(res) {
					let code = res.data.code
					let msg = res.data.msg
					switch(code) {
						case 10101:
						case 10102:
						case 10103:
							that.btnText = msg
							break;
						case 10105:
							that.btnText = "签到"
							break;
						case 10106:
						case 10107:
						case 10108:
							that.btnText = "签到"
							that.canCheckin = true
							break;
						case 10110:
							that.btnText = "已签到"
							that.canCheckin = true
							break;
						default:
							that.btnText = "迟到"
					}
				})
			},
			toPage: function(name, url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss">
.map {
	width: 100%;
	height: 350px;
}
.checkin-wrapper {
	.in-clock {
		width: 250rpx;
		height: 250rpx;
		border-radius: 50%;
		opacity: .7;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100rpx;
		&.blue {
			background-image: linear-gradient(125deg, #029fff, #0166ff);
		}
		&.red {
			background-image: linear-gradient(125deg, #ff00ff, #ff0000)
		}
		&>text {
			font-size: 40rpx;
		}
	}
	.out-clock {
		margin-top: 20rpx;
		width: 50%;
		background-color: none;
		color: $background-color;
		text-decoration: underline;
	}
	.range {
		padding-top: 20rpx;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.range_green {
		color: green;
	}
	
	.range_red {
		color: red;
	}
}

</style>
