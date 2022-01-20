// 获取指定位数的随机英文字符串
export function randomString(len = 32) {
	len = len || 32
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
	/* ***默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
	let maxPos = $chars.length
	let pwd = ''
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return pwd
}
