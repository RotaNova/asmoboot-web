import Axios from "../http";

export default {
    getLdap: (params) => Axios.get("/v1/ldap/getLdap", { params }), //获取ldap
    updateLdap: (params) => Axios.put("/v1/ldap/updateLdap", params), // 更新ldap
};
