<!--
 * @Descripttion:新建场景
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-17 10:22:04
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-18 14:33:18
-->
<template>
    <section>
        <!-- 页面标题 -->
        <p class="font16 font666">{{ title }}</p>
        <a-spin
            tip="努力加载中..."
            size="large"
            :style="{ weight: '100%', height: '100%' }"
            :spinning="isSpinning"
        >
            <div style="margin-left: 200px">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 17 }"
                >
                    <a-form-model-item
                        ref="scenes"
                        label="场景名称:"
                        class="mt20 mb20 ml10"
                        prop="scenesName"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="请输入场景名称"
                            v-model="form.scenesName"
                            :maxLength="32"
                        ></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="scenesCode"
                        label="场景编码:"
                        class="ml10"
                        prop="scenesCode"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="请输入场景编码"
                            v-model="form.scenesCode"
                            :maxLength="200"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        ref="actions"
                        label="执行动作:"
                        class="mt20 ml10 mb0 my-actions"
                    >
                        <!-- 设备 1 -->
                        <template v-for="item in SET_DEVICE_DEPLOY">
                            <a-tag
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseElse(item.key, item.type)"
                            >
                                {{
                                    `设备-${item.deviceName}-${item.dictIdentifyName}-${
                                        item.showValue
                                    }-延迟时间${item.delayTime}s`
                                }}
                            </a-tag>
                        </template>
                        <!-- 场景 2 -->
                        <template v-for="item in SET_SCENES_DEPLOY">
                            <a-tag
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseElse(item.key, item.type)"
                                >{{ `场景-${item.scenesName}-延迟时间${item.delayTime}s` }}</a-tag
                            >
                        </template>
                        <a-button @click="showAddScene">添加</a-button>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="sysAnnConfig"
                        label="通知规则"
                        prop="sysAnnConfigId"
                        class="mt20 ml10 mb0"
                    >
                        <a-cascader
                            style="width: 336px"
                            :options="notifyTree"
                            :display-render="notifyDisplayRender"
                            :fieldNames="notifyFieldName"
                            expand-trigger="hover"
                            placeholder="请选择通知规则"
                            @change="onChangeSysAnnConfigId"
                            v-model="form.sysAnnConfigId"
                        />
                    </a-form-model-item>
                    <div style="margin: 20px 0 0 532px">
                        <a-button style="margin-right: 20px" @click="handleBack">返回</a-button>
                        <a-button type="primary" @click="handleSubmit" :loading="btnLoading"
                            >保存</a-button
                        >
                    </div>
                </a-form-model>
            </div>
        </a-spin>
        <new-aciton ref="newAciton" />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import newAciton from '../modal/addAciton/newAciton.vue'
import API from '@/api/intelligentExecution/intelligentExecution'
export default {
    props: {
        title: {
            required: true,
            type: String
        },
        isSpinning: {
            type: Boolean
        }
    },
    components: { newAciton },
    data() {
        return {
            btnLoading: false,
            isShow: false,
            form: {
                scenesName: '',
                scenesCode: '',
                sysAnnConfigId: []
            },
            rules: {
                scenesName: [{ required: true, message: '请输入场景名称', trigger: 'change' }],
                scenesCode: [
                    { required: true, message: '请输入场景编码', trigger: 'change' },
                    {
                        required: true,
                        message: '场景编码必须为数字或者英文字母',
                        trigger: 'change',
                        pattern: /^([A-Z]|[a-z]|[\d])*$/
                    }
                ]
                // sysAnnConfigId: [
                //     {
                //         required: true,
                //         message: '通知规则不能为空',
                //         trigger: 'change'
                //     }
                // ]
            },
            timer: ``,
            timeShow: '',
            num: 1,
            // 指定树的value,label,和子数组
            notifyFieldName: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            notifyTree: []
        }
    },
    computed: {
        ...mapGetters([
            'INTEL_SCENESID',
            'SET_SCENES_DEPLOY',
            'SET_DEVICE_DEPLOY',
            'SET_SCENES_CONFIG_INFO'
        ])
    },
    watch: {
        SET_SCENES_DEPLOY: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        },
        SET_DEVICE_DEPLOY: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        },
        SET_SCENES_CONFIG_INFO() {
            // ?当策略id和获得的数组有值的时候,判断是编辑策略
            if (this.INTEL_SCENESID && this.SET_SCENES_CONFIG_INFO) {
                setTimeout(() => {
                    this.isSpinning = false
                }, 800)
                const { scenesName, scenesCode, sysAnnConfigId } = this.SET_SCENES_CONFIG_INFO
                this.form.scenesName = scenesName
                this.form.scenesCode = scenesCode
                // 告警规则
                this.$nextTick(() => {
                    try {
                        let parentId =
                            this.notifyTree.length > 0 &&
                            this.familyTree(this.notifyTree, sysAnnConfigId)[0].parentId
                        if (parentId) {
                            this.form.sysAnnConfigId = [parentId, `${sysAnnConfigId}`]
                        } else {
                            this.form.sysAnnConfigId = [undefined, undefined]
                        }
                    } catch (error) {
                        console.warn('暂无匹配通知规则')
                    }
                })
            } else {
                this.formItems() // ?判断新增表单
            }
        }
    },
    mounted() {
        this.getAnnouncementTree()
    },
    methods: {
        // *获取通知配置树形列表
        getAnnouncementTree() {
            API.getScenesConfigTree()
                .then((res) => {
                    // console.log(res, '我是说我')
                    this.form.sysAnnConfigId = []
                    Array.isArray(res) &&
                        res.forEach((item, index) => {
                            let arr = res[index].children
                            if (arr.length > 0) {
                                this.setSysAnnConfigId(arr)
                            }
                        })
                    this.notifyTree = res
                    this.$store.dispatch('GET_SCENES_CONFIG_INFO', this.INTEL_SCENESID) // 获取
                })
                .catch(() => {})
        },
        // 递归
        setSysAnnConfigId(arr) {
            arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                    // this.sysAnnConfigId.push(item.id) // 把 productkey push进去
                    this.setSysAnnConfigId(item.children)
                }
            })
        },
        // 只能选择告警底下的
        notifyDisplayRender({ labels }) {
            return labels[labels.length - 1]
        },
        // 获取告警父id
        familyTree(arr1, id) {
            let temp = []
            let forFn = function(arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i]
                    if (item.id == id) {
                        temp.push(item)
                        forFn(arr1, item.parentId)
                        break
                    } else {
                        if (item.children) {
                            forFn(item.children, id)
                        }
                    }
                }
            }
            forFn(arr1, id)
            return temp
        },
        /**
         * @description: 删除设备就条件
         * @param {*} removeTags
         * @param {*} type 1 dev 2 sce 3 srt
         * @return {*}
         */
        handleCloseElse(removeTags, type) {
            switch (type) {
                case 1: {
                    // 设备 1
                    const removeElseDev = this.SET_DEVICE_DEPLOY.filter(
                        (item) => item.key !== removeTags
                    )
                    this.$store.commit('SET_DEVICE_DEPLOY', removeElseDev)
                    break
                }
                case 2: {
                    // 场景 2
                    const removeElseSce = this.SET_SCENES_DEPLOY.filter(
                        (item) => item.key !== removeTags
                    )
                    this.$store.commit('SET_SCENES_DEPLOY', removeElseSce)
                    break
                }
                default:
                    break
            }
        },
        // *打开调用一次
        formItems() {
            this.form = {
                scenesName: '', // 名称
                scenesCode: '', // 编码
                sysAnnConfigId: []
            }
        },
        // 添加
        addSubmit() {
            // this.isSpinning = true
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let strategyConfigContentList = [] // 设备集合
                    let scenesList = [] // 场景集合
                    const { scenesName, scenesCode, sysAnnConfigId } = this.form
                    // 设备
                    this.SET_DEVICE_DEPLOY.length > 0 &&
                        this.SET_DEVICE_DEPLOY.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            } = item
                            let deviceDataElse = {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            }
                            strategyConfigContentList.push(deviceDataElse)
                        })
                    // 场景
                    this.SET_SCENES_DEPLOY.length > 0 &&
                        this.SET_SCENES_DEPLOY.forEach((item) => {
                            const { scenesId, delayTime } = item
                            let scenesElse = {
                                scenesId,
                                delayTime
                            }
                            scenesList.push(scenesElse)
                        })
                    let parame = {
                        scenesName,
                        scenesCode,
                        strategyConfigContentList,
                        sysAnnConfigId: sysAnnConfigId[1], // 下层通知id
                        scenesList
                    }
                    this.addScenesConfig(parame)
                } else {
                    // this.isSpinning = false
                    this.$message.error('请检查必填项')
                    // console.log('失败')
                }
            })
        },
        // 更新
        updateSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    const { scenesName, scenesCode, sysAnnConfigId } = this.form
                    let strategyConfigContentList = [] // 设备集合
                    let scenesList = [] // 场景集合
                    // 设备
                    this.SET_DEVICE_DEPLOY.length > 0 &&
                        this.SET_DEVICE_DEPLOY.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            } = item
                            let deviceDataElse = {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            }
                            strategyConfigContentList.push(deviceDataElse)
                        })
                    // 场景
                    this.SET_SCENES_DEPLOY.length > 0 &&
                        this.SET_SCENES_DEPLOY.forEach((item) => {
                            const { scenesId, delayTime } = item
                            let scenesElse = {
                                scenesId,
                                delayTime
                            }
                            scenesList.push(scenesElse)
                        })
                    let parame = {
                        scenesId: this.INTEL_SCENESID,
                        scenesName,
                        scenesCode,
                        strategyConfigContentList,
                        sysAnnConfigId: sysAnnConfigId[1], // 下层通知id
                        scenesList
                    }
                    this.updateScenesConfig(parame)
                } else {
                    this.$message.error('请检查必填项')
                    // console.log('失败')
                }
            })
        },
        handleSubmit() {
            // 判断场景id,存在就是编辑状态
            if (this.INTEL_SCENESID) {
                this.updateSubmit()
            } else {
                this.addSubmit()
            }
        },
        // *新建 /basic/v1/scenesConfig/addScenesConfig
        addScenesConfig(parame) {
            API.addScenesConfig(parame)
                .then((res) => {
                    this.$message.success('新增场景成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                })
                .catch(() => {})
        },
        // *更新 /basic/v1/scenesConfig/updateScenesConfig
        updateScenesConfig(parame) {
            API.updateScenesConfig(parame)
                .then((res) => {
                    this.$message.success('更新场景成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                    // this.$store.commit('SET_DEVICE_DEPLOY', [])
                    // this.$store.commit('SET_SCENES_DEPLOY', [])
                })
                .catch(() => {})
        },
        showAddScene() {
            this.$refs.newAciton.show()
        },
        handleBack() {
            this.$emit('return')
        }
    }
}
</script>

<style lang="scss">
.my-actions svg {
    border-radius: 50%;
    color: #666666;
    font-size: 12px;
    &:hover {
        width: 14px;
        height: 14px;
        background-color: #007aff;
        color: #fff;
        font-size: 14px;
    }
}
</style>
<style lang="scss" scoped>
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
.mt40 {
    margin-top: 40px;
}
.mt32 {
    margin-top: 32px;
}
.mt10 {
    margin-top: 10px;
}
.ml120 {
    margin-left: 120px;
}
.ml10 {
    margin-left: 10px;
}
.mt20 {
    margin-top: 20px;
}
.mb20 {
    margin-bottom: 20px;
}
.mb0 {
    margin-bottom: 0;
}
.seave-line {
    margin-left: 350px;
    margin-top: 30px;
}
.checkGroup {
    width: 60px;
    height: 32px;
    border: 1px solid #e2e2e2;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    margin-right: 0px;
    border-radius: 0;
}
.myselftags {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    .anticon svg {
        background: #007aff;
    }
}
</style>
