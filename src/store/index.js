/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-17 11:43:06
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-29 10:27:49
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import network from './network'
import smart from './smart'
import intel from './intel'
import smartElectricity from './smartElectricity'
import faceListLibrary from './faceListLibrary'
import IntelligentSecurity from './IntelligentSecurity'
import cascadeSystem from './cascadeSystem'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        user,
        network,
        smart,
        intel, // 智能执行
        smartElectricity,
        faceListLibrary, //face,
        IntelligentSecurity,
        cascadeSystem // 级联系统
    }
})
export default store
