<template>
	<view class="page">
		<uni-segmented-control :values="items" :current="current" @clickItem="onClickItem" style-type="button" active-color="#3474FF"></uni-segmented-control>
		<view class="list" v-if="current == 0">
			<view class="item" v-for="one in list" :key="one.id">
				<view class="left">
					<image :src="one.creatorPhoto" mode="widthFix" class="photo"></image>
					<view class="name">{{one.creatorName}}</view>
					<view class="desc">(发起)</view>
				</view>
				<view class="center">
					<view class="title">{{one.title}}</view>
					<view class="attr">日期：{{one.date}}</view>
					<view class="attr">时长：{{one.hour >= 1 ? one.hour : '小于1'}}小时</view>
					<view class="attr">状态：待审批</view>
				</view>
				<view class="right">
					<button class="btn" @tap="toPage(one.id)">审批</button>
				</view>
			</view>
		</view>
		<view class="list" v-if="current == 1">
			<view class="item" v-for="one in list" :key="one.id">
				<view class="left">
					<image :src="one.creatorPhoto" mode="widthFix" class="photo"></image>
					<view class="name">{{one.creatorName}}</view>
					<view class="desc">(发起)</view>
				</view>
				<view class="center">
					<view class="title">{{one.title}}</view>
					<view class="attr">日期：{{one.date}}</view>
					<view class="attr">时长：{{one.hour >= 1 ? one.hour : '小于1'}}小时</view>
					<view class="attr">
						审批结果:
						<text :class="{green: one.approveStatus == 1, red: one.approveStatus == 0, result: true}">
							{{one.approveStatus == 1? '同意' : '不同意'}}
						</text>
					</view>
				</view>
				<view class="right">
					<block>
						<image :src="one.approvePhoto" mode="widthFix" class="icon"></image>
						<view class="name">{{one.approveName}}</view>
						<view class="desc">(审批)</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				page: 1,
				length: 10,
				list: [],
				isLastPage: false,
				items: ['待审批', '已审批'],
				current: 0,
			}
		},
		onShow() {
			this.page = 1
			this.isLastPage = false
			this.list = []
			uni.pageScrollTo({
				scrollTop: "0"
			})
			this.loadData(this)
		},
		// onReachBottom() {
		// 	if (this.isLastPage) {
		// 		return
		// 	}
		// 	this.page = this.page + 1
		// 	this.loadData(this)
		// },
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex
					this.page = 1
					this.list = []
					this.isLastPage = false
					this.loadData(this)
				}
			},
			loadData(ref) {
				let data = {
					page: ref.page, 
					length: ref.length
				}
				if (ref.current == 0) {
					ref.ajax(ref.url.searchUnapprovalMeetingListByPage, "post", data, function(res) {
						let result = res.data.result
						ref.list = result
					})
				} else if(ref.current == 1) {
					ref.ajax(ref.url.searchApprovalMeetingListByPage, "post", data, function(res) {
						let result = res.data.result
						ref.list = result
					})
				}
			},
			toPage(id) {
				uni.navigateTo({
					url: "../approval/approval?id=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
.page {
	padding: 35rpx;
}
.list {
	margin-top: 45rpx;
	margin-bottom: 35rpx;
	.item {
		display: flex;
		justify-content: space-between;
		border-bottom: solid 1rpx #f0f0f0;
		padding-bottom: 35rpx;
		margin-bottom: 45rpx;
		&:last-child {
			border-bottom: none;
		}
		.left {
			margin-right: 30rpx;
			flex-grow: 0;
			.photo {
				width: 150rpx;
				border-radius: 10rpx;
			}
			.name {
				font-size: 30rpx;
				color: #333;
				text-align: center;
				margin-bottom: 5rpx;
			}
			.desc {
				font-size: 30rpx;
				color: #999;
				text-align: center;
			}
		}
		.center {
			flex-grow: 1;
			.title {
				font-size: 34rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			.attr {
				font-size: 30rpx;
				color: #999;
				margin-bottom: 15rpx;
				.result {
					margin-left: 8rpx;
					width: 120rpx;
					color: #fff;
					border-radius: 8rpx;
					display: inline-block;
					text-align: center;
					&.red {
						background-color: #e8403a !important;
					}
					&.green {
						background-color: #03ae00 !important;
					}
				}
			}
			.status {
				font-size: 30rpx;
				color: #3474ff;
			}
		}
		.right {
			flex-grow: 0;
			margin-left: 35rpx;
			position: relative;
			.btn {
				position: absolute;
				right: 0;
				top: 0rpx;
				font-size: 30rpx;
				width: 160rpx;
				background-color: #3474FF;
				color: #fff;
			}
			.btn:active {
				background-color: #0052FF;
			}
			.icon {
				width: 150rpx;
				height: auto;
			}
			.name {
				text-align: center;
				font-size: 30rpx;
				color: #333;
				margin-bottom: 5rpx;
			}
			.desc {
				text-align: center;
				font-size: 30rpx;
				color: #999;
			}
		}
	}
}


</style>
