/*
 * @Descripttion: 级联系统
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-28 13:46:13
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-29 16:29:11
 */
import Axios from '../http'

export default {
    // 国标接入设备
    wvpListDevice: (params) => Axios.post(`/wvp/v1/accessDevice/listDevice`, params), // 分页查询国标设备
    wvpDevicesSync: (params) => Axios.post(`/wvp/v1/accessDevice/devicesSync`, params), // 同步设备通道
    wvpUpdateDevice: (params) => Axios.post(`/wvp/v1/accessDevice/updateDevice`, params), // 更新设备信息
    wvpDelete: (params) => Axios.post(`/wvp/v1/accessDevice/delete`, params), // 移除设备
    wvpUpdateTransport: (params) => Axios.post(`/wvp/v1/accessDevice/updateTransport`, params), // 修改数据流传输模式
    wvpPositions: (params) => Axios.get(`/wvp/v1/accessDevice/positions`, { params }), // 查询历史轨迹
    wvpLatestPosition: (params) => Axios.get(`/wvp/v1/accessDevice/latestPosition`, { params }), // 查询设备最新位置
    wvpPositionSubscribe: (params) => Axios.post(`/wvp/v1/accessDevice/positionSubscribe`, params), // 订阅位置信息
    wvpChannels: (params) => Axios.post(`/wvp/v1/accessDevice/channels`, params), // 分页查询通道数
    wvpSubChannels: (params) => Axios.post(`/wvp/v1/accessDevice/subChannels`, params), // 分页查询子目录通道
    wvpUpdateChannel: (params) => Axios.post(`/wvp/v1/accessDevice/updateChannel`, params), // 还原数据字典
    wvpPlay: (params) => Axios.post(`/wvp/v1/accessDevice/play`, params), // 开始点播
    wvpPlayStop: (params) => Axios.post(`/wvp/v1/accessDevice/playStop`, params), // 停止点播
    wvpGetCoding: (params) => Axios.post(`/wvp/v1/accessDevice/getCoding`, params), // 获取编码
    wvpPlayConvert: (params) => Axios.post(`/wvp/v1/accessDevice/playConvert`, params), // 转码
    wvpPlayConvertStop: (params) => Axios.post(`/wvp/v1/accessDevice/playConvertStop`, params), // 结束转码
    wvpRecordInfo: (params) => Axios.post(`/wvp/v1/accessDevice/recordInfo`, params), // 录像查询
    wvpReplayPlay: (params) => Axios.post(`/wvp/v1/accessDevice/replayPlay`, params), // 开始视频回放
    wvpReplayPlayStop: (params) => Axios.post(`/wvp/v1/accessDevice/replayPlayStop`, params), // 停止视频回放
    wvpControl: (params) => Axios.post(`/wvp/v1/accessDevice/control`, params), // 云台控制
    wvpFrontEndCommand: (params) => Axios.post(`/wvp/v1/accessDevice/frontEndCommand`, params), // 通用前端控制命令
    wvpGetUrl: (params) => Axios.get(`/wvp/v1/accessDevice/getUrl`, { params }), // 获取快照

    // new新加接口 2021-11-29
    playPause: (params) => Axios.get(`/wvp/v1/accessDevice/playPause`, { params }), // 回放暂停
    playResume: (params) => Axios.get(`/wvp/v1/accessDevice/playResume`, { params }), // 回放恢复
    playSeek: (params) => Axios.get(`/wvp/v1/accessDevice/playSeek`, { params }), // 回放拖动播放
    playSpeed: (params) => Axios.get(`/wvp/v1/accessDevice/playSpeed`, { params }), // 回放倍速播放
    playDownload: (params) => Axios.get(`/wvp/v1/accessDevice/playDownload`, { params }), // 下载
    playStopDownload: (params) => Axios.get(`/wvp/v1/accessDevice/playStopDownload`, { params }), // 停止下载

    // 推流列表
    listStreamPushItem: (params) => Axios.post(`/wvp/v1/pushStream/listStreamPushItem`, params), // 推流列表查询
    saveToGB: (params) => Axios.post(`/wvp/v1/pushStream/saveToGB`, params), // 将推流添加到国标
    removeFormGB: (params) => Axios.post(`/wvp/v1/pushStream/removeFormGB`, params), // 将推流移出到国标
    getStreamInfoByAppAndStream: (params) =>
        Axios.post(`/wvp/v1/pushStream/getStreamInfoByAppAndStream`, params), // 根据应用名和流id获取播放地址副本
    getCoding: (params) => Axios.post(`/wvp/v1/pushStream/getCoding`, params), // 获取编码副本
    playConvert: (params) => Axios.post(`/wvp/v1/pushStream/playConvert`, params), // 转码副本
    playConvertStop: (params) => Axios.post(`/wvp/v1/pushStream/playConvertStop`, params), // 结束转码副本

    // 拉流代理
    wvpListPullStream: (params) => Axios.post(`/wvp/v1/pullStreamProxy/listPullStream`, params), // 分页查询流代理
    wvpGetStreamInfoByAppAndStream: (params) =>
        Axios.post(`/wvp/v1/pullStreamProxy/getStreamInfoByAppAndStream`, params), // 根据应用名和流id获取播放地址
    GetCoding: (params) => Axios.post(`/wvp/v1/pullStreamProxy/getCoding`, params), // 获取编码
    wvpPullPlayConvert: (params) => Axios.post(`/wvp/v1/pullStreamProxy/playConvert`, params), // 转码
    wvpPullPlayConvertStop: (params) =>
        Axios.post(`/wvp/v1/pullStreamProxy/playConvertStop`, params), // 结束转码
    wvpAddPullStream: (params) => Axios.post(`/wvp/v1/pullStreamProxy/addPullStream`, params), // 保存代理
    wvpDeletePullStream: (params) => Axios.post(`/wvp/v1/pullStreamProxy/deletePullStream`, params), // 移除代理
    wvpStart: (params) => Axios.post(`/wvp/v1/pullStreamProxy/start`, params), // 启用代理
    wvpStop: (params) => Axios.post(`/wvp/v1/pullStreamProxy/stop`, params), // 停用代理
    getOnlineMediaServerList: (params) =>
        Axios.get(`/wvp/v1/pullStreamProxy/getOnlineMediaServerList`, { params }), // 在线流媒体服务列表副本
    listPlatform: (params) => Axios.post(`/wvp/v1/pullStreamProxy/listPlatform`, params), // 分页查询级联平台副本
    getFFmpegCMDs: (params) => Axios.get(`/wvp/v1/pullStreamProxy/getFFmpegCMDs`, { params }), // 模板

    // 流媒体服务列表
    wvpListMediaServer: (params) => Axios.get(`/wvp/v1/node/listMediaServer`, { params }), // 流媒体服务列表
    wvpCheckMediaServer: (params) => Axios.post(`/wvp/v1/node/checkMediaServer`, params), // 测试流媒体服务
    wvpAddMediaServer: (params) => Axios.post(`/wvp/v1/node/addMediaServer`, params), // 保存流媒体服务
    wvpDeleteMediaServer: (params) => Axios.post(`/wvp/v1/node/deleteMediaServer`, params), // 删除流媒体服务列表

    // 国标级联
    wvpListPlatform: (params) => Axios.post(`/wvp/v1/INTCascade/listPlatform`, params), // 分页查询级联平台
    wvpListNationalStandard: (params) =>
        Axios.post(`/wvp/v1/INTCascade/listNationalStandard`, params), // 查询国标通道
    wvpListChannel: (params) => Axios.post(`/wvp/v1/INTCascade/listChannel`, params), // 分页查询级联平台的所有所有通道
    wvpServerConfig: (params) => Axios.get(`/wvp/v1/INTCascade/serverConfig`, { params }), // 获取国标服务的配置
    wvpAddPlatform: (params) => Axios.post(`/wvp/v1/INTCascade/addPlatform`, params), // 保存上级平台信息
    wvpDeletePlatform: (params) => Axios.post(`/wvp/v1/INTCascade/deletePlatform`, params), // 删除上级平台
    wvpUpdateChannelForGB: (params) => Axios.post(`/wvp/v1/INTCascade/updateChannelForGB`, params), // 向上级平台添加国标通道
    wvpDelChannelForGB: (params) => Axios.post(`/wvp/v1/INTCascade/delChannelForGB`, params), // 从上级平台移除国标通道
    wvpAddNationalStandardAssociation: (params) =>
        Axios.post(`/wvp/v1/INTCascade/addNationalStandardAssociation`, params), // 保存国标关联
    wvpDelNationalStandardAssociation: (params) =>
        Axios.post(`/wvp/v1/INTCascade/delNationalStandardAssociation`, params), // 移除国标关联

    // 云录像
    wvpGetOnlineMediaServerList: (params) =>
        Axios.get(`/wvp/v1/cloudVideo/getOnlineMediaServerList`, { params }), // 在线流媒体服务列表
    wvpListCloudVideo: (params) => Axios.get(`/wvp/v1/cloudVideo/listCloudVideo`, { params }), // 分页查询云录像列表
    wvpListDate: (params) => Axios.get(`/wvp/v1/cloudVideo/listDate`, { params }), // 获取日期文件夹列表
    wvpListRecord: (params) => Axios.get(`/wvp/v1/cloudVideo/listRecord`, { params }), // 获取视频文件列表
    wvpGetMp4: (params) => Axios.get(`/wvp/v1/accessDevice/getMp4`, { params }), // 获取云录像
    wvpAddTaskForDownload: (params) =>
        Axios.get(`/wvp/v1/accessDevice/addTaskForDownload`, { params }), // 添加视频裁剪合并任务
    wvpGetTaskListForDownload: (params) =>
        Axios.get(`/wvp/v1/accessDevice/getTaskListForDownload`, { params }), // 查询视频裁剪合并任务列表
    wvpGetFile: (params) => Axios.get(`/wvp/v1/accessDevice/getFile`, { params }), // 获取文件

    // 国标信息
    serverConfig: (params) => Axios.get(`/wvp/v1/INTInfo/serverConfig`, { params })
}
