<template>
	<view class="upload-container">
		<view class="upload-picker">
			<image class="img" src="../../static/upload-active.png" mode="widthFix"></image>
			<button type="primary" class="btn" @tap="chooseFile()">选择文件</button>
		</view>
		<view class="file-container">
			<view class="title">上传成功列表</view>
			<template v-if="uploadList.length !== 0">
				<view class="file-list" v-for="(filename, index) in uploadList" :key="index">{{filename.name}}</view>
			</template>
		</view>
	</view>
</template>
<script>
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

export default {
	name: 'document_upload',
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			uploadList: []
		};
	},
	methods: {
		chooseFile() {
			let that = this
			wx.chooseMessageFile({
				type: 'all',
				success(path) {
					that.uploadFile(path.tempFiles)
				}
			})
		},
		uploadFile(files) {
			let that = this
			for(let file of files) {
				uni.showLoading({
					title: "正在上传中"
				})
				uni.uploadFile({
					url: that.url.fileUpload,
					name: 'file',
					filePath: file.path,
					formData: {
						'key': 'document/'+ file.name 
					},
					success: res => {
						let data = JSON.parse(res.data)
						if (data.code === 200) {
							that.uploadList.push({name: file.name})
							uni.hideLoading()
						}
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
.upload-container {
	margin: 20rpx;
	.upload-picker {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 4rpx dotted #999999;
		background: linear-gradient(to bottom, rgba(52, 116, 255, 0.03), rgba(52, 116, 255, 0.10));
		.img {
			width: 150rpx;
			height: 150rpx;
		}
		.btn {
			width: 60vw;
		}
	}
	.file-container {
		margin-top: 50rpx;
		.title {
			margin-bottom: 20rpx;
			font-weight: bold;
			color: $background-color;
		}
		.file-list {
			border: 1px #0052FF dashed;
			padding: 15rpx 10rpx;
		}
		.file-list + .file-list {
			border-top: none;
		}
	}
}
</style>
