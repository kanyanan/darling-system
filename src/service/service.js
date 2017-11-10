import Vue from 'vue'
function Service (data) {
  if (!(this instanceof Service)) {
    return new Service(data, null, null)
  }
}

//从服务器获取数据
Service.fnGetData = function (url, params,successCallback,errorCallback) {
	Vue.http.get(url, params).then(successCallback, errorCallback);
}

Service.fnPostData = function (url, params,successCallback,errorCallback) {
	Vue.http.post(url, params).then(successCallback, errorCallback);
}




export default Service