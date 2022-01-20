import Axios from '../http'

export default {
    getUserAnnouncementItemPage: params => Axios.post(`/v1/myMessage/getUserAnnouncementItemPage`, params),  //分页获取消息
    getUserAnnouncementInfo: params => Axios.get(`/v1/myMessage/getUserAnnouncementInfo`, { params }),  // 获取通告详情
    readAllAnnouncement: params => Axios.post(`/v1/myMessage/readAllAnnouncement`, params),  // 全部已读
    readAnnouncement: params => Axios.post(`/v1/myMessage/readAnnouncement`, params),  // 单个已读
    getAnnouncement: params => Axios.get(`/v1/announcementWindows/getUserAnnouncementInfo`, { params }),  // 获取通告详情
}
