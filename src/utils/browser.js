/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-13 11:37:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-15 08:56:11
 */
/*eslint-disable*/

//判断是否IE<11浏览器
export function isIE() {
    return (
        navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1
    )
}

export function isIE11() {
    return (
        navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf('rv:11.0') > -1
    )
}

//判断是否IE的Edge浏览器
export function isEdge() {
    return navigator.userAgent.indexOf('Edge') > -1 && !isIE()
}

export function getIEVersion() {
    let userAgent = navigator.userAgent //取得浏览器的userAgent字符串
    let isIE = isIE()
    let isIE11 = isIE11()
    let isEdge = isEdge()

    if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        let fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7 || fIEVersion === 8 || fIEVersion === 9 || fIEVersion === 10) {
            return fIEVersion
        } else {
            return 6 //IE版本<7
        }
    } else if (isEdge) {
        return 'edge'
    } else if (isIE11) {
        return 11
    } else {
        return -1
    }
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export function saveAsRename(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
    } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename

        // fix Firefox
        link.style.display = 'none'
        body.appendChild(link)

        link.click()
        body.removeChild(link)

        window.URL.revokeObjectURL(link.href)
    }
}
/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
export function getBlobToRename(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response)
            }
        }

        xhr.send()
    })
}
