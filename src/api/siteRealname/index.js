import Axios from "../http";

export default {
    listComp: (params) => Axios.post("/building/v1/comp/listComp", params), //获取ntp服务器信息  
    addComp: (params) => Axios.post("/building/v1/comp/addComp", params), // 添加公司信息
    getComp: (params) => Axios.get("/building/v1/comp/getComp", { params }), // 获取企业信息
    listProject: (params) => Axios.post("/building/v1/project/listProject", params), // 获取项目信息列表
    addProject: (params) => Axios.post("/building/v1/project/addProject", params), // 添加项目基本信息
    getProject: (params) => Axios.get("/building/v1/project/getProject", { params }), // 获取项目信息
    listTeam: (params) => Axios.post("/building/v1/team/listTeam", params), // 获取项目信息列表
    getTeam: (params) => Axios.get("/building/v1/team/getTeam", { params }), // 获取项目信息
    listProjectWorker: (params) => Axios.post("/building/v1/team/listProjectWorker", params), //获取ntp服务器信息
    getProjectWorker: (params) => Axios.get("/building/v1/team/getProjectWorker", { params }), // 获取项目信息
    updateComp: (params) => Axios.post("/building/v1/comp/updateComp", params), //更新企业基本信息
    updateProject: (params) => Axios.post("/building/v1/project/updateProject", params), //更新项目基本信息
    updateTeamAndProjectWorker: (params) => Axios.post("/building/v1/team/updateTeamAndProjectWorker", params), //更新班组基本信息
    addFaceWarehousing: (params) => Axios.post("/building/v1/project/addFaceWarehousing", params), //更新班组基本信息
};
