// 获取跳转路由
export function getJumpRoute(child = {}) {
	if (!child.smenu.length) {
		return child.menuUrl
	}
	for (let i = 0; i < child.smenu.length; i++) {
		let smenu = child.smenu[i]
		if (smenu.menuType === 5) {
			return getJumpRoute(smenu)
		}
	}
	return child.menuUrl
}
