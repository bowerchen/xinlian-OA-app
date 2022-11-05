<template>
	<view class="page">
		<view class="user-info">
			<view class="border-outer">
				<view class="border-inner">
					<image :src="photo" mode="widthFix" class="photo"></image>
				</view>
			</view>
			<view class="summary">
				<view>
					<text class="title">姓名</text>
					<text class="value">{{name}}</text>
				</view>
				<view>
					<text class="title">部门</text>
					<text class="value">{{deptName}}</text>
				</view>
				<view>
					<text class="title">状态</text>
					<text class="value">{{deptstatus}}</text>
				</view>
			</view>
		</view>
		<view class="list-title">用户信息栏目</view>
		<uni-list>
			<uni-list-item title="个人资料" link to="/pages/mine_info/mine_info"></uni-list-item>
			<uni-list-item title="我的考勤" link to="/pages/my_checkin/my_checkin"></uni-list-item>
			<!-- <uni-list-item title="罚款记录" link to=""></uni-list-item> -->
		</uni-list>
		<view class="list-title">系统管理栏目</view>
		<uni-list>
			<uni-list-item title="员工管理" v-show="checkPermission(['ROOT', 'EMPLOYEE:SELECT'])" link to=""></uni-list-item>
			<uni-list-item title="部门管理" v-show="checkPermission(['ROOT', 'DEPT:SELECT'])" link to=""></uni-list-item>
			<uni-list-item title="权限管理" v-show="checkPermission(['ROOT', 'ROLE:SELECT'])" link to=""></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components:{
			uniList,
			uniListItem
		},
		data() {
			return {
				name: "",
				deptName: "",
				photo: "",
				deptstatus: "",
			}
		},
		onShow:function(){
			let that = this
			that.ajax(that.url.searchUserSummary, "get", null, function(res) {
				let result = res.data.result
				that.name = result.name
				that.deptName = result.deptName
				that.photo = result.photo
				that.deptstatus = result.status === 1 ? '在职' : '离职'
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.page {
	padding: 35rpx;
	.user-info {
		margin-top: 50rpx;
		padding-bottom: 20rpx;
		.border-outer {
			width: 320rpx;
			height: 320rpx;
			background-color: #fbe3e1;
			border-radius: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;
			margin-bottom: 40rpx;
			.border-inner {
				width: 280rpx;
				height: 280rpx;
				background-color: #f5b8b4;
				border-radius: 140rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.photo {
					width: 200rpx;
					height: 200rpx;
					border-radius: 120rpx;
					display: block;
					border: 20rpx solid #ec7872;
				}
			}
		}
		.btn {
			width: 200rpx;
			margin-bottom: 20rpx;
			font-size: 30rpx;
		}
		.summary {
			display: flex;
			justify-content: space-between;
			background-color: #f5f5f5;
			color: $font-color;
			padding: 15rpx 0;
			view {
				text-align: center;
				flex-grow: 1;
				flex-shrink: 1;
				&:nth-child(2) {
					border-left: 1rpx solid #e0e0e0;
					border-right: 1rpx solid #e0e0e0;
				}
				.title {
					display: block;
					color: #999999;
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}
				.value {
					display: block;
					color: $font-color;
					font-size: 32rpx;
				}
			}
		}
	}
	.list-title {
		font-size: 32rpx;
		font-weight: bold;
		color: $background-color;
		border-left: 15rpx solid $background-color;
		padding-left: 20rpx;
		margin: 35rpx 0;
	}
}
</style>
