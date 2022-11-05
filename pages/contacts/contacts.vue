<template>
	<view class="contacts-container">
		<view v-for="(contact, contact_index) in contacts" :key="contact_index">
			<view class="list-title">{{contact.deptName}} ({{contact.count}}人)</view>
			<uni-list>
				<uni-list-item v-for="(member, member_index) in contact.members" :key="member_index" class="contact-item" clickable="true"  @click="call(member)">
					<view slot="header" class="header">
						<image class="img" :src="member.photo" mode="widthFix"></image>
					</view>
					<view slot="body" class="body">
						<view class="info">
							<text class="name">{{member.name}}</text>
							<image v-if="member.sex === '男'" class="img" src="../../static/male.png" mode="widthFix"></image>
							<image v-if="member.sex === '女'" class="img" src="../../static/female.png" mode="widthFix"></image>
						</view>
						<view class="phone">
							<text>{{member.tel}}</text>
						</view>
					</view>
					<view slot="footer" class="footer">
						<image class="img" src="../../static/telephone.png" mode="widthFix"></image>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import uniList from '../../components/uni-list/uni-list.vue'
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue'
	
	export default {
		name: 'contacts',
		components: {
			uniList,
			uniListItem,
		},
		data() {
			return {
				contacts: [],
			}
		},
		onShow() {
			this.loadData(this)
		},
		methods: {
			call(e) {
				let phoneName = e.tel
				uni.makePhoneCall({
					phoneNumber: phoneName,
				})
			},
			loadData: function(ref) {
				ref.ajax(ref.url.searchUserGroupByDept, "post", {"keyword": ref.keyword}, function(res) {
					let result = res.data.result
					ref.contacts = result
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.contacts-container {
	padding: 0 35rpx 65rpx 35rpx;
	.list-title {
		margin-top: 55rpx;
		margin-bottom: 25rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: $background-color;
		border-left: solid 15rpx $background-color;
		padding-left: 20rpx;
	}
	.contact-item {
		position: relative;
		.header{
			.img {
				width: 100rpx;
			}
		}
		.body {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: left;
			margin-left: 25rpx;
			.name {
				padding-right: 8rpx;
			}
			.img {
				width: 30rpx;
			}
			.phone {
				margin-top: 10rpx;
				font-weight: bold;
			}
		}
		.footer {
			position: relative;
			width: 100%;
			display: flex;
			justify-content: right;
			.img {
				width: 70rpx;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
}

</style>
