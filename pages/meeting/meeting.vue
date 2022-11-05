<template>
	<view class="page" v-if="checkPermission(['ROOT', 'MEETING:INSERT', 'MEETING:UPDATE'])">
		<view class="header">
			<input type="text" class="title" v-model="title" placeholder="输入会议标题" placeholder-class="title-placeholder" />
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
					<view class="key">开始时间</view>
					<picker v-if="canEdit" mode="time" :value="start" @change="startChange">
						<view class="uni-input">{{start}}</view>
					</picker>
					<text v-if="!canEdit" class="value">{{start}}</text>
				</view>
				<view class="item">
					<view class="key">结束时间</view>
					<picker v-if="canEdit" mode="time" :value="end" @change="endChange">
						<view class="uni-input">{{end}}</view>
					</picker>
					<text v-if="!canEdit" class="value">{{end}}</text>
				</view>
				<view class="item">
					<view class="key">会议类型</view>
					<picker v-if="canEdit" :value="typeIndex" :range="typeArray" @change="typeChange">
						{{typeArray[typeIndex]}}
					</picker>
					<text v-if="!canEdit" class="value">{{typeArray[typeIndex]}}</text>
				</view>
				<view class="item" v-if="typeArray[typeIndex] == '线下会议'" @tap="editPlace">
					<view class="key">地点</view>
					<view class="value">{{place}}</view>
				</view>
			</view>
			<view @tap="editDesc">
				<text class="desc">{{desc}}</text>
			</view>
		</view>
		<view class="members">
			<view class="number">参会者 （{{members.length}})</view>
			<view class="member">
				<view class="user" v-for="one in members" :key="one.id">
					<image :src="one.photo" mode="widthFix" class="photo"></image>
					<text class="name">{{one.name}}</text>
				</view>
				<view class="add">
					<image src="../../static/icon-19.png" mode="widthFix" class="add-btn" @tap="toMembersPage"></image>
				</view>
			</view>
		</view>
		<button class="btn" type="default" @tap="save()">发布</button>
		<button class="btn warn" type="default" @tap="deleteMeeting()" v-if="!canEdit">取消</button>
		<uni-popup ref="popupPlace" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" placeholder="输入会议地点" 
			:value="palce" @confirm="finishPlace"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupDesc" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" placeholder="输入会议内容" 
			:value="desc"  @confirm="finishDesc"></uni-popup-dialog>
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
				opt: null,
				id: null,
				uuid: null,
				canEdit: true,
				title: '',
				date: '',
				start: '',
				end: '',
				typeArray: ['线上会议', '线下会议'],
				typeIndex: 0,
				place: '',
				desc: '会议内容',
				members: [],
				instanceId: null,
				status: null,
				creatorId: null,
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
					that.canEdit = true
				} else if (that.opt == "edit") {
					that.ajax(that.url.searchMeetingById, "post", {id: that.id}, function(res) {
						let result = res.data.result;
						that.title = result.title
						that.date = result.date
						that.start = result.start
						that.end = result.end
						that.typeIndex = result.type - 1
						that.place = result.place
						that.canEdit = false
						that.status = result.status
						that.creatorId = result.creatorId
						let desc = result.desc
						if (desc != null && desc != '') {
							that.desc = desc
						}
						that.members = result.members
					})
				}
			} else {
				let members = []
				for (let one of currPage.members) {
					members.push(Number(one))
				}
				that.ajax(that.url.searchMembers, "post", {members: JSON.stringify(members)}, function(res) {
					let result = res.data.result
					that.members  = result
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
				if (
					that.checkBlank(that.title, "会议题目") ||
					that.checkValidStartAndEnd(that.start, that.end) ||
					(that.typeIndex == "1" && that.checkBlank(that.place, "会议地址")) ||
					that.checkBlank(that.desc, "会议内容") ||
					array.length == 0
				) {
					return
				}
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
					if (res.data.code === 200) {
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
					} else if (res.data.code === 500) {
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
				})
			},
			deleteMeeting: function() {
				let that = this
				uni.showModal({
					title: "提示信息",
					content: "您是否确定取消会议吗？",
					success: function(res) {
						if (res.confirm) {
							let data = {
								id: Number(that.id),
								status: that.status,
								creatorId: that.creatorId
							}
							that.ajax(that.url.deleteMeetingById, "post", data, function(res) {
								let code = res.data.code
								if (code == 200) {
									uni.showToast({
										icon: "success",
										title: "会议已取消",
									})
									setTimeout(function() {
										uni.navigateBack({
											
										})
									}, 2000)
								} else {
									uni.showToast({
										icon: "none",
										title: res.data.msg
									})
								}
							})
						}
					}
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
		border-bottom: solid 20rpx #eeeef4;
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
		margin: 0 35rpx 35rpx 55rpx;
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