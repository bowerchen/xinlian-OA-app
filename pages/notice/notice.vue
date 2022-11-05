<template>
	<view class="page" v-if="checkPermission(['ROOT', 'MEETING:INSERT', 'MEETING:UPDATE'])">
		<view class="header">
			<input type="text" class="title" v-model="title" placeholder="输入公告标题" placeholder-class="title-placeholder" />
			<image src="../../static/icon-18.png" mode="widthFix" class="edit-icon"></image>
		</view>
		<view class="attr">
			<view class="list">
				<view class="item">
					<view class="key">日期</view>
					<picker v-if="canEdit" mode="date" :value="date" @change="dateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
					<text v-if="!canEdit" class="value">{{date}}</text>
				</view>
				<view class="item">
					<view class="key">公告类型</view>
					<picker v-if="canEdit" :value="typeIndex" :range="typeArray" @change="typeChange">
						{{typeArray[typeIndex]}}
					</picker>
					<text v-if="!canEdit" class="value">{{typeArray[typeIndex]}}</text>
				</view>
				<view class="item vertical">
					<view class="key">公告内容</view>
					<textarea class="textarea"></textarea>
				</view>
			</view>
		</view>
		<button class="btn" type="default" @tap="save()">发布</button>
		<button class="btn warn" type="default" @tap="save()" v-if="!canEdit">删除</button>
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
				opt: null,
				id: null,
				uuid: null,
				canEdit: true,
				title: '',
				date: '',
				start: '',
				end: '',
				typeArray: ['系统公告', '部门公告'],
				typeIndex: 0,
				place: '',
				desc: '会议内容',
				members: [],
				instanceId: null
			}
		},
		onShow: function() {
			let that = this
			let pages = getCurrentPages()
			let currPage = pages[pages.length - 1]
			if (!currPage.hasOwnProperty("finishMembers") || !currPage.finishMembers) {
				if (that.opt == "insert") {
					let now = new Date()
					now.setTime(now.getTime() + 30*60*1000)
					that.date = now.format("yyyy-MM-dd")
					that.start = now.format("hh:mm")
					now.setTime(now.getTime() + 60*60*1000)
					that.end = now.format("hh:mm")
				}
			} else {
				let members = []
				for(let one of currPage.members) {
					members.push(Number(one))
				}
				that.ajax(that.url.searchMembers, "post", {members: JSON.stringify(members)}, function(res) {
					let result = res.data.result
					that.members = result
				})
			}
		},
		onLoad: function(options) {
			this.id = options.id
			this.opt = options.opt
		},
		methods: {
			toMembersPage: function() {
				let array = []
				for(let one of this.members) {
					array.push(one.id)
				}
				uni.navigateTo({
					url: "../members/members?members=" + array.join(",")
				})
			},
			dateChange: function(e) {
				this.date = e.detail.value
			},
			startChange: function(e) {
				this.start = e.detail.value
			},
			endChange: function(e) {
				this.end = e.detail.value
			},
			typeChange: function(e) {
				this.typeIndex = e.detail.value
			},
			editPlace: function() {
				if (!this.canEdit) {
					return;
				}
				this.$refs.popupPlace.open()
			},
			finishPlace: function(done, value) {
				if (value != null && value != "") {
					this.place = value
					done()
				} else {
					uni.showToast({
						icon: "none",
						title: "地点不能为空"
					})
				}
			},
			editDesc: function() {
				if (!this.canEdit) {
					return;
				}
				this.$refs.popupDesc.open()
			},
			finishDesc: function(done, value) {
				if (value != null && value != "") {
					this.desc = value
					done()
				} else {
					uni.showToast({
						icon: "none",
						title: "内容不能为空"
					})
				}
			},
			save: function() {
				let that = this
				let array = []
				for(let one of that.members) {
					array.push(one.id)
				}
				// if (
				// 	that.checkBlank(that.title, "会议题目") ||
				// 	that.checkValidStartAndEnd(that.start, that.end) ||
				// 	(that.typeIndex == "1" && that.checkBlank(that.place, "会议地址")) ||
				// 	that.checkBlank(that.desc, "会议内容") ||
				// 	array.length == 0
				// ) {
				// 	return
				// }
				let data = {
					title: that.title, 
					date: that.date,
					start: that.start,
					end: that.end,
					type: Number(that.typeIndex) + 1,
					members: JSON.stringify(array),
					desc: that.desc,
					id: that.id,
					instanceId: that.instanceId
				}
				
				if(that.typeIndex == "1") {
					data.place = that.place
				}
				let url;
				if (that.opt == "insert") {
					url = that.url.insertMeeting
				} else if (that.opt == "edit") {
					url = that.url.updateMeetingInfo
				}
				that.ajax(url, "post", data, function(res) {
					uni.showToast({
						icon: "success",
						title: "保存成功",
						complete:function(){
							setTimeout(function() {
								uni.navigateBack({
									
								})
							}, 2000)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.page {
	padding: 35rpx 0;
	.header {
		position: relative;
		padding: 0 35rpx;
		.title {
			border-bottom: solid 1rpx #f0f0f0;
			padding: 30rpx 15rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: $background-color;
		}
		.title-placeholder {
			font-size: 34rpx;
		}
		.edit-icon {
			width: 40rpx;
			position: absolute;
			right: 45rpx;
			top: 35rpx;
		}
	}
	.attr {
		padding: 0 35rpx;
		// border-bottom: solid 20rpx #eeeef4;
		.list {
			.item {
				padding: 30rpx 10rpx 30rpx 15rpx;
				border-bottom: solid 1rpx #f0f0f0;
				font-size: 30rpx;
				color: $font-color;
				display: flex;
				justify-content: space-between;
				.key {
					
				}
				.value {
					display: block;
					color: $font-color;
				}
				.textarea {
					border: 1rpx solid #ddd;
					width: 100%;
					height: 300rpx;
					margin-top: 20rpx;
				}
				&:last-child {
					border-bottom: none;
				}
			}
			
			.vertical {
				flex-direction: column;
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
	.members {
		padding: 45rpx 25rpx;
		.number {
			margin-bottom: 35rpx;
			color: $background-color;
			font-size: 34rpx;
			font-weight: bold;
			padding-left: 20rpx;
		}
		.member {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			.user {
				width: 100rpx;
				text-align: center;
				max-width: 20%;
				min-width: 20%;
				margin-bottom: 40rpx;
				.photo {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-bottom: 5rpx;
				}
				.name {
					font-size: 30rpx;
					color: $font-color;
					display: block;
					text-align: center;
				}
			}
			.add {
				width: 100rpx;
				min-width: 20%;
				max-width: 20%;
				margin-bottom: 40rpx;
				.add-btn {
					width: 100rpx;
					display: block;
					margin-left: auto;
					margin-right: auto;
				}
			}
		}
	}
	.btn {
		margin: 20rpx 35rpx 35rpx 55rpx;
		background-color: $background-color;
		color: white;
		&:active {
			background-color: $background-color-active;
		}
		&.warn {
			background-color: #e64340;
		}
	}
}
</style>
</st