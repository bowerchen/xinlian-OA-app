<template>
	<view class="mine_info">
		<view class="attr">
			<view class="list">
				<view class="item">
					<view class="key">头像</view>
					<image :src="image" mode="widthFix" class="img" style="width: 100rpx;"></image>
				</view>
				<view class="item">
					<view class="key">姓名</view>
					<view class="value">{{name}}</view>
				</view>
				<view class="item">
					<view class="key">性别</view>
					<view class="value">{{sex}}</view>
				</view>
				<view class="item">
					<view class="key">部门</view>
					<view class="value">{{apartment}}</view>
				</view>
				<view class="item">
					<view class="key">入职时间</view>
					<view class="value">{{hiredate}}</view>
				</view>
				<view class="item">
					<view class="key">手机号码</view>
					<view class="value">{{phone}}</view>
				</view>
				<view class="item">
					<view class="key">邮箱</view>
					<view class="value">{{email}}</view>
				</view>				
			</view>
		</view>
		<button class="btn" type="default" @tap="save()">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image: "https://xinlian-sign-1255543036.cos.ap-guangzhou.myqcloud.com/thumb/132.jpg",
				name: "谢卓琛",
				sex: '男',
				apartment: '管理部',
				hiredate: '2021-11-23',
				phone: '17764072069',
				email: '1033538677@qq.com'
			}
		},
		onShow: function() {
			
		},
		onLoad: function() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.mine_info {
	padding: 45rpx 0;
	.attr {
		padding: 0 35rpx;
		margin-bottom: 55rpx;
		.list {
			.item {
				padding: 30rpx 10rpx 30rpx 15rpx;
				border-bottom: solid 1rpx #f0f0f0;
				font-size: 30rpx;
				color: $font-color;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.key {
					
				}
				.value {
					display: block;
					color: $font-color;
				}
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
	.btn {
		margin: 0 35rpx 35rpx 55rpx;
		background-color: $background-color;
		color: white;
		&:active {
			background-color: $background-color-active;
		}
	}
}
</style>
</st