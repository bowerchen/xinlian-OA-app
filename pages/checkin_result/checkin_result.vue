<template>
	<view class="page">
		<view class="summary-container">
			<view class="user-info">
				<image :src="photo" mode="widthFix" class="photo"></image>
				<view class="info">
					<text class="username">{{name}}</text>
					<text class="deptname">隶属部门：{{deptName ==null ? "": deptName}}</text>
				</view>
			</view>
			<view class="date">
				{{date}}
			</view>
		</view>
		<view class="result-container">
			<view class="left">
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<view class="line"></view>
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
			</view>
			<view class="right">
				<view class="row">
					<text class="start">上班时间 ({{attendanceTime}})</text>
				</view>
				<view class="row">
					<text class="checkin-time">签到时间 {{checkinTime}}</text>
					<text class="checkin-result green other" v-if="status=='正常'">{{ status }}</text>
					<text class="checkin-result yellow other" v-if="status=='迟到'">{{ status }}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-7.png" mode="widthFix" class="icon-small"></image>
					<view class="desc">{{address}}</view>
					<text class="checkin-result green" v-if="risk=='低风险'">{{risk}}</text>
					<text class="checkin-result yellow" v-if="risk=='中风险'">{{risk}}</text>
					<text class="checkin-result red" v-if="risk=='高风险'">{{risk}}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-8.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">身份验证</text>
					<text class="checkin-result green">已通过</text>
				</view>
				<view class="row">
					<text class="end">下班时间 ({{closingTime}}) </text>
				</view>
				<view class="row" v-if="checkoutTime">
					<text class="checkin-time">签到时间 {{checkoutTime}}</text>
					<text class="checkin-result green other" v-if="status=='正常'">{{ status }}</text>
					<text class="checkin-result yellow other" v-if="status=='迟到'">{{ status }}</text>
				</view>
				<view class="row" v-if="checkoutTime">
					<image src="../../static/icon-7.png" mode="widthFix" class="icon-small"></image>
					<view class="desc">{{address}}</view>
					<text class="checkin-result green" v-if="risk=='低风险'">{{risk}}</text>
					<text class="checkin-result yellow" v-if="risk=='中风险'">{{risk}}</text>
					<text class="checkin-result red" v-if="risk=='高风险'">{{risk}}</text>
				</view>
				<view class="row" v-if="checkoutTime">
					<image src="../../static/icon-8.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">身份验证</text>
					<text class="checkin-result green">已通过</text>
				</view>
			</view>
		</view>
		<view class="checkin-report">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{checkinDays}}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title">
				<text>累计签到</text>
				<view class="line"></view>
			</view>
			<view class="calendar-container">
				<view class="calendar" v-for="one in weekCheckin" :key="one">
					<image src="../../static/icon-9.png" mode="widthFix" class="icon-calendar" v-if="one.type=='工作日'"></image>
					<image src="../../static/icon-10.png" mode="widthFix" class="icon-calendar" v-if="one.type=='节假日'"></image>
					<text class="day">{{one.day}}</text>
					<text class="result green" v-if="one.status=='正常'">{{one.status}}</text>
					<text class="result yellow" v-if="one.status=='迟到'">{{one.status}}</text>
					<text class="result red" v-if="one.status=='缺勤'">{{one.status}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "",
				photo: "",
				deptName: "",
				address: "",
				status: "",
				risk: "",
				checkinTime: "",
				checkoutTime: "",
				date: "",
				attendanceTime: "",
				closingTime: "",
				checkinDays: 0,
				weekCheckin: []
			};
		},
		onShow:function(){
			let that = this
			that.ajax(that.url.searchTodayCheckin, "Get", null, function(res) {
				let result = res.data.result
				console.log(result)
				that.name = result.name
				that.photo = result.photo
				that.deptName = result.deptName
				that.date = result.date
				that.address = result.address
				that.risk = result.risk
				that.checkinTime = result.checkinTime
				that.checkoutTime = result.checkoutTime
				that.attendanceTime = result.attendanceTime
				that.closingTime = result.closingTime
				that.checkinDays = result.checkinDays
				that.weekCheckin = result.weekCheckin
			})
		}
	}
</script>

<style lang="scss">
.page {
	background-color: #eeeef4;
	.summary-container {
		display: flex;
		justify-content: space-between;
		background: #FFFFFF;
		padding: 35rpx;
		margin-bottom: 20rpx;
		.user-info {
			display: flex;
			.photo {
				width: 100rpx;
				height: 100rpx;
			}
			.info {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin-left: 25rpx;
				.username {
					display: block;
					font-style: 34rpx;
					font-weight: bold;
					color: $font-color;
				}
				.deptName {
					display: block;
					font-style: 28rpx;
					color: #999999;
				}
			}
		}
		.date {
			font-style: 38rpx;
			color: $background-color;
			margin-top: 5rpx;
		}
	}

	.result-container {
		display: flex;
		background-color: #FFFFFF;
		padding: 35rpx;
		margin-bottom: 20rpx;
		.left {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-right: 30rpx;
			height: 366rpx;
			.icon-timer {
				width: 40rpx;
				height: 40rpx;
				&:nth-child(2) {
					margin-bottom: 3rpx;
				}
			}
			.line {
				position: absolute;
				height: 72%;
				width: 0;
				border-left: solid #e5e5e5 2rpx;
				left: 20rpx;
				top: 50rpx;
			}
		}
		.right {
			.row {
				display: flex;
				margin-bottom: 27rpx;
				.start, .end{
					font-size: 32rpx;
					color: $background-color;
				}
				.checkin-time {
					font-size: 38rpx;
					font-weight: bold;
					color: $font-color;
					display: block;
				}
				.checkin-result {
					display: block;
					background-color: #FFFFFF;
					font-size: 20rpx;
					height: 42rpx;
					line-height: 42rpx;
					padding: 0 15rpx;
					border-radius: 8rpx;
					margin-left: 15rpx;
					color: #FFFFFF;
					white-space: nowrap;
				}
				.other {
					margin-top: 7rpx;
					margin-left: 10rpx;
				}
				.icon-small {
					width:38rpx;
					height: 38rpx;
					margin-right: 10rpx;
					margin-top: 7rpx;
				}
				.desc {
					color: #999999;
					font-stretch: 32rpx;
				}
			}
		}
	}
	
	.checkin-report {
		background-color: #FFFFFF;
		padding: 35rpx;
		.big-icon {
			width: 250rpx;
			display: block;
			margin-left: auto;
			margin-right: auto;
			margin-top: 20rpx;
		}
		.report-title {
			display: flex;
			justify-content: center;
			margin-top: 20rpx;
			.days {
				font-size: 60rpx;
				color: $font-color;
			}
			.unit {
				margin-left: 10rpx;
				margin-top: 33rpx;
			}
		}
		.sub-title {
			font-size: 34rpx;
			color: $font-color;
			text-align: center;
			margin-top: 10rpx;
			position: relative;
			text {
				background-color: #FFFFFF;
				z-index: 999;
				position: relative;
				padding: 0 30rpx;
			}
			.line {
				height: 0;
				width: 100%;
				border-bottom: solid #151515 2rpx;
				position: absolute;
				top: 25rpx;
			}
		}
		.calendar-container {
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
			.calendar {
				text-align: center;
				flex-grow: 0;
				flex-shrink: 0;
				.icon-calendar {
					width: 70rpx;
					margin-bottom: 5rpx;
				}
				.day {
					font-size: 32rpx;
					color: $font-color;
					display: block;
				}
				.result {
					display: block;
					font-size: 26rpx;
					background-color: #555555;
					color: #FFFFFF;
					height: 42rpx;
					line-height: 42rpx;
					padding: 0 5rpx;
					border-radius: 8rpx;
					margin-top: 10rpx;
				}
			}
		}
	}
}

.yellow {
	background-color: #f0b52f !important;
}
.red {
	background-color: #f0532f !important;
}
.green {
	background-color: #52a929 !important;
}
</style>
