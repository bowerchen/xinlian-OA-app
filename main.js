import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

// 修改成自己部署后端IP
let baseUrl = "http://IP:8080/emos-wx-api"

Vue.prototype.url = {
	sign: baseUrl + "/thirdparty/getCredential",
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	searchMembers: baseUrl + "/user/searchMembers",
	searchUserGroupByDept: baseUrl + "/user/searchUserGroupByDept",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	checkin: baseUrl + "/checkin/checkin",
	validFaceModel: baseUrl + "/checkin/validFaceModel",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin",
	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	searchMessageById: baseUrl + "/message/searchMessageById",
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage",
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById",
	searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage",
	searchUnapprovalMeetingListByPage: baseUrl + "/meeting/searchUnapprovalMeetingListByPage",
	searchApprovalMeetingListByPage: baseUrl + "/meeting/searchApprovalMeetingListByPage",
	insertMeeting: baseUrl + "/meeting/insertMeeting",
	updateMeetingInfo: baseUrl + "/meeting/updateMeetingInfo",
	updateMeetingStatus: baseUrl + "/meeting/updateMeetingStatus",
	searchMeetingById: baseUrl + "/meeting/searchMeetingById",
	deleteMeetingById: baseUrl + "/meeting/deleteMeeting",
	fileUpload: baseUrl + "/thirdparty/fileUpload",
	getFileList: baseUrl + "/thirdparty/getFileList",
	download: baseUrl + "/thirdparty/download"
}

Vue.prototype.ajax = function(url, method, data, fun) {
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync("token")
		},
		"data": data,
		success: function(res) {
			if (res.statusCode == 401) {
				uni.redirectTo({
					url: "/pages/login/login"
				})
				console.log(res.statusCode)
			} else if (res.statusCode == 200 && res.data.code == 200) {
				let data = res.data
				if (data.hasOwnProperty("token")) {
					let token = data.token
					console.log(token)
					uni.setStorageSync("token", token)
				}
				fun(res)
			} else {
				fun(res)
			}
		},
		fail: function(err) {
			uni.showToast({
				icon: "none",
				title: "请求失败，请再试一次"
			})
		}
	})
}

Vue.prototype.checkPermission = function(perms) {
	let permission = uni.getStorageSync("permission")
	let result = false
	for (let one of perms) {
		if (permission.indexOf(one) != -1) {
			return true
			break
		}
	}
	return result
}


Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	}

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
		}
	}
	return fmt
}

Vue.prototype.checkNull = function(data, name) {
	if (data == null) {
		uni.showToast({
			icon: "none",
			title:name + "不能为空"
		})
		return true
	}
	return false
}

Vue.prototype.checkBlank = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidName = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if(!/^[\u4e00-\u9fa5]{2,15}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidTel = function(data, name) {
	if (data == null || data == "") {
			uni.showToast({
				icon: "none",
				title: name + "不能为空"
			})
			return true
		} else if (!/^1[0-9]{10}$/.test(data)) {
			uni.showToast({
				icon: "none",
				title: name + "内容不正确"
			})
			return true
		}
		return false
}

Vue.prototype.checkValidEmail = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidStartAndEnd = function(start, end) {
	let d1 = new Date("2000/01/01 " + start + ":00");
	let d2 = new Date("2000/01/01 " + end + ":00");
	if (d2.getTime() <= d1.getTime()) {
		uni.showToast({
			icon: "none",
			title: "结束时间必须大于开始时间"
		})
		return true
	}
	return false
}
