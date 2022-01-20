import Axios from '../http'

export default {
    findProjectMap: params => Axios.get(`/basic/v1/projectMap/findProjectMap`, params),  //获取所有项目分布，点聚合
    findCityProjectStatistic: params => Axios.get(`/basic/v1/projectMap/findCityProjectStatistic`, params),  //项目获取城市分布统计
    findProvinceProjectStatistic: params => Axios.get(`/basic/v1/projectMap/findProvinceProjectStatistic`, params),  //项目获取省份分布统计
    getProjectUnknownLocationCount: params => Axios.get(`/basic/v1/projectMap/getProjectUnknownLocationCount`, params),  //项目获取省份分布统计
    listDeviceProductData: params => Axios.get(`/basic/v1/mapDistribution/listDeviceProductData`, { params }),  //获取设备产品数据副本
    listDeviceDistributions: params => Axios.get(`/basic/v1/mapDistribution/listDeviceDistributions`, { params }),  //获取设备分布集合
    listProvinceDeviceStatistic: params => Axios.get(`/basic/v1/mapDistribution/listProvinceDeviceStatistic`, { params }),  //获取设备分布集合
    listCityDeviceStatistic: params => Axios.get(`/basic/v1/mapDistribution/listCityDeviceStatistic`, { params }),  //获取设备分布集合
    getUnknownLocationDeviceCount: params => Axios.get(`/basic/v1/mapDistribution/getUnknownLocationDeviceCount`, { params }),  //获取未知经纬度的设备数量
    getUnknownLocationGatewayCount: params => Axios.get(`/basic/v1/mapDistribution/getUnknownLocationGatewayCount`, { params }),  //获取未知经纬度的网关数量
    listGatewayDistributions: params => Axios.get(`/basic/v1/mapDistribution/listGatewayDistributions`, { params }),  //获取网关分布集合
    listProvinceGatewayStatistic: params => Axios.get(`/basic/v1/mapDistribution/listProvinceGatewayStatistic`, { params }),  //获取省份网关统计信息
    listCityGatewayStatistic: params => Axios.get(`/basic/v1/mapDistribution/listCityGatewayStatistic`, { params }),  //获取城市网关统计信息
    listGatewayProductData: params => Axios.get(`/basic/v1/mapDistribution/listGatewayProductData`, { params }),  //获取城市网关统计信息
}
