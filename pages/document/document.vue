<template>
	<view class="document-container">
		<uni-collapse>
			<uni-collapse-item v-for="(file, index) in fileList" :key="index" :title="file.name" :thumb="thumbConvert(file.name)">
				<view class="content">
					<view class="info">
						<text class="text">大小：{{ file.size }}</text>
						<text>日期：{{ file.time }}</text>
					</view>
					<view class="button-group"><button type="primary" @tap="downloadFile(file)">下载</button></view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<uni-popup class="popup" ref="popup" :maskClick="false">
			<view class="process">
				<text>正在下载</text>
				<progress border-radius="5" :percent="percent" show-info />
			</view>
		</uni-popup>
		<uni-fab
			ref="fab"
			:pattern="fabPattern" 
			:content="fabContent"
			:horizontal="horizontal"
			:popMenu="true"
			@trigger="trigger">
		</uni-fab>
	</view>
</template>

<script>
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
export default {
	components: {
		uniCollapse,
		uniCollapseItem,
		uniPopup,
		uniFab
	},
	data() {
		return {
			fileList: [],
			value: '',
			percent: 0,
			direction: 'horizontal',
			horizontal: 'right',
			vertical: 'bottom',
			fabPattern: {
				color: '#999999',
				selectedColor: '#3474FF',
				backgroundColor: '#ffffff',
				buttonColor: '#3474FF'
			},
			fabContent: [
				{
					iconPath: '../../static/upload.png',
					selectedIconPath: '../../static/upload-active.png',
					text: '上传',
					active: true
				}
			]
		};
	},
	onLoad() {
		this.getFileList();
	},
	onPullDownRefresh() {
		this.getFileList()
	},
	methods: {
		getFileList: function() {
			this.ajax(this.url.getFileList, 'get', '', res => {
				this.fileList = res.data.result;
			});
		},
		thumbConvert: function(name) {
			let suffix = name.substr(name.lastIndexOf('.') + 1, name.length);
			let thumb = '';

			if (suffix === ('jpg' || 'png' || 'bmp' || 'git')) {
				thumb = '../../static/jpg.png';
			} else if (suffix === ('txt' || 'doc' || 'docx')) {
				thumb = '../../static/doc.png';
			} else if (suffix === 'ppt') {
				thumb = '../../static/ppt.png';
			} else if (suffix === 'pdf') {
				thumb = '../../static/pdf.png';
			} else if (suffix === 'mp4') {
				thumb = '../../static/video.png';
			} else {
				thumb = '../../static/file.png';
			}

			return thumb;
		},
		downloadFile: function(file) {
			this.$refs.popup.open('center');
			let url = file.key;
			let downloadTask = uni.downloadFile({
				url,
				success: data => {
					if (data.statusCode === 200) {
						let path = data.tempFilePath;
						let suffix = path.substr(path.lastIndexOf('.') + 1, path.length);
						let docReg = /(doc|xls|ppt|pdf|docx|xlsx|pptx)/g;
						let videoReg = /(jpg|png|bmp|jpeg|git|mp4|mov|flv|mkv)/g;

						if (docReg.test(suffix)) {
							uni.saveFile({
								tempFilePath: data.tempFilePath,
								success: res => {
									uni.showToast({
										icon: 'success',
										mask: true,
										title: '下载成功, 文件已保存本地'
									});
									uni.openDocument({
										filePath: res.savedFilePath
									});
								}
							});
						} else if (videoReg.test(suffix)) {
							uni.saveImageToPhotosAlbum({
								filePath: data.tempFilePath,
								success: res => {
									uni.showToast({
										icon: 'success',
										title: '文件已保存到系统相册'
									});
								}
							});
						}
					}
				}
			});

			downloadTask.onProgressUpdate(res => {
				this.percent = res.progress;
				if (res.progress == 100) {
					this.$refs.popup.close();
				}
			});
		},
		trigger(e) {
			if (this.fabContent[e.index].active) {
				uni.navigateTo({
					url: '../document_upload/document_upload'
				})
			}
		},
	}
};
</script>

<style scoped lang="scss">
.document-container {
	padding: 10px 0;
	.content {
		.info {
			margin-bottom: 10px;
			padding: 0 15px;
			display: flex;
			justify-content: space-around;
		}
	}
	.popup {
		.process {
			width: 45vw;
			height: 12vw;
			border-radius: 20rpx;
			text-align: center;
			background-color: #ffffff;
			padding: 10px 8px;
		}
	}
}
</style>
