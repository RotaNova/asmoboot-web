/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-04-14 10:35:01
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 09:56:28
 */
import view from '@/views/backstage/index.vue'
import home from './backstage/home'
import system from './backstage/system'
import resource from './backstage/resource'
import dataDictionary from './backstage/dataDictionary'
import systemMonitoring from './backstage/systemMonitoring'
import noticeManage from './backstage/noticeManage'
import advanconfig from './backstage/advanconfig'
import messageCenter from './backstage/messageCenter'
import safetyManage from './backstage/safetyManage'
import systemMaintenance from './backstage/systemMaintenance'
import networkConfiguration from './backstage/networkConfiguration'
import accountSetting from './backstage/accountSetting'
import platformConfiguration from './backstage/platformConfiguration'
import welcome from './backstage/welcome'
import screenDisplay from './backstage/screenDisplay'
import deviceGroup from './smartElectricity/deviceGroup'
import deviceManage from './smartElectricity/deviceManage'
import logManage from './smartElectricity/logManage'
import projectManage from './smartElectricity/projectManage'
import intelligentExecution from './smartElectricity/intelligentExecution'
import mapDistribution from './smartElectricity/mapDistribution'
import mochaITOM from './smartElectricity/mochaITOM'
import enterpriseInfor from './siteRealname/enterpriseInfor'
import projectInfor from './siteRealname/projectInfor'
import teamInformation from './siteRealname/teamInformation'
import faceListLibrary from './basicInformation/faceListLibrary' // 基础资料---人脸名单库
import accessRecords from './IntelligentSecurity/accessRecords'
import entranceGuard from './IntelligentSecurity/entranceGuard'
import videoSurveillance from './IntelligentSecurity/videoSurveillance'
import intelligentAnalysis from './IntelligentSecurity/intelligentAnalysis'
import smartParking from './smartParking' // 智慧停车系统
import securityService from './IntelligentSecurity/securityService'
import securityEquipment from './IntelligentSecurity/securityEquipment'
import managementLine from './siteRealname/managementLine'
import amis from './backstage/amis'
import attendanceManage from './attendanceManage/index' // 考勤管理
import cascadeSystem from './IntelligentSecurity/cascadeSystem'

// js组件库
import _ from 'lodash'

export default [
    {
        path: '/backstage',
        component: view,
        // 重定向到home
        redirect: { path: 'home' },
        // 数值拼接方法/backstage/accountSetting
        children: _.concat([
            home,
            system,
            resource,
            dataDictionary,
            systemMonitoring,
            noticeManage,
            advanconfig,
            messageCenter,
            safetyManage,
            systemMaintenance,
            networkConfiguration,
            accountSetting,
            platformConfiguration,
            welcome,
            screenDisplay,
            deviceGroup,
            deviceManage,
            logManage,
            projectManage,
            intelligentExecution,
            mapDistribution,
            mochaITOM,
            teamInformation,
            projectInfor,
            enterpriseInfor,
            faceListLibrary,
            accessRecords,
            entranceGuard,
            videoSurveillance,
            intelligentAnalysis,
            smartParking,
            attendanceManage,
            securityService,
            securityEquipment,
            managementLine,
            amis,
            cascadeSystem
        ])
    }
]
