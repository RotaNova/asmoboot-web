import Axios from "../http";

export default {
  // 封装过get后面参数{params}
  getNtpInfo: (params) => Axios.get("/v1/sysSetting/getNtpInfo", { params }), //获取ntp服务器信息
  testNtpServer: (params) =>
    Axios.get("/v1/sysSetting/testNtpServer", { params }), //测试ntp服务器

  saveNtpInfo: (params) => Axios.post("/v1/sysSetting/saveNtpInfo", params), //保存ntp服务器信息
  systemReboot: (params) => Axios.post("/v1/sysSetting/systemReboot", params), //系统重启 ok
  getSystemBackupsConfig: (params) =>
    Axios.post("/v1/sysSetting/getSystemBackupsConfig", params), //获取系统备份配置信息 ok
  systemBackupsConfig: (params) =>
    Axios.post("/v1/sysSetting/systemBackupsConfig", params), //系统备份配置信息保存 ok
  systemBackupNow: (params) =>
    Axios.post("/v1/sysSetting/systemBackupNow", params), //系统备份立即备份 ok
  backupRecovery: (params) =>
    Axios.post("/v1/sysSetting/backupRecovery", params), //恢复备份接口 ok文件数据由后端校验
  getSysBackupList: (params) =>
    Axios.get("/v1/sysSetting/getSysBackupList", { params }), //获取系统备份列表 ok
  deleteBackup: (params) => Axios.post("/v1/sysSetting/deleteBackup", params), //删除系统备份信息 ok
  logBackupNow: (params) => Axios.post("/v1/sysSetting/logBackupNow", params), //日志备份立即备份 ok
  getLogBackupList: (params) =>
    Axios.get("/v1/sysSetting/getLogBackupList", { params }), //获取日志备份列表 ok
  getLogBackupConfig: (params) =>
    Axios.get("/v1/sysSetting/getLogBackupConfig", { params }), //获取日志备份配置信息 ok
  saveLogBackupConfig: (params) =>
    Axios.post("/v1/sysSetting/saveLogBackupConfig", params), //保存日志备份配置信息 ok
  systemFactoryReset: (params) =>
    Axios.post("/v1/sysSetting/systemFactoryReset", params), //恢复系统出厂设置 ok
  listRestartRegularly: (params) =>
    Axios.post("/v1/sysSetting/listRestartRegularly", params), //获取定时重启列表 ok
  saveRestartRegularly: (params) =>
    Axios.post("/v1/sysSetting/saveRestartRegularly", params), //保存定时重启 ok
  deleteRestartRegularly: (params) =>
    Axios.delete("/v1/sysSetting/deleteRestartRegularly", { params }), //删除定时重启 ok
};
