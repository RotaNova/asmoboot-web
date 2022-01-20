<template>
    <a-form
        :form="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        @submit="handleSubmit"
    >
        <a-form-item label="部门名称">
            <a-input
                disabled
                v-decorator="[
                    'deptName',
                    {
                        rules: [
                            {
                                required: true,
                                message: '部门名称不能为空!'
                            }
                        ]
                    }
                ]"
                maxLength="30"
                placeholder="30字符以内"
            />
        </a-form-item>
        <a-form-item label="部门编号:">
            <a-input
                disabled
                v-decorator="[
                    'deptCode',
                    {
                        rules: [
                            {
                                required: true,
                                message: '部门编号不能为空!'
                            }
                        ]
                    }
                ]"
                maxLength="30"
            />
        </a-form-item>
        <a-form-item label="上级部门">
            <div class="disflexsd modelsdsd">
                <a-input v-model="parentname" disabled />
            </div>
        </a-form-item>
        <a-form-item label="有效期: ">
            <a-date-picker
                disabled
                style="width:100%;"
                v-decorator="[
                    'deptValidTime',
                    {
                        rules: [
                            {
                                required: true,
                                message: '有效期不能为空!'
                            }
                        ]
                    }
                ]"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
            />
        </a-form-item>
        <a-form-item label="部门负责人">
            <a-select
                mode="tags"
                @change="handleSelectChange"
                allowClear
                disabled
                v-model="lustname"
            >
            </a-select>
        </a-form-item>
        <a-form-item label="部门描述:">
            <a-textarea
                :disabled="!canOperating"
                placeholder="300字符以内"
                :rows="2"
                v-decorator="['deptDescription']"
                maxLength="300"
                :autoSize="{ minRows: 2, maxRows: 7 }"
            />
        </a-form-item>

        <a-form-item label="负责人联系方式">
            <a-input
                :disabled="!canOperating"
                v-decorator="['deptManagerPhone']"
                placeholder="暂无数据"
            />
        </a-form-item>
        <a-form-item label="部门地址">
            <a-input
                v-decorator="['deptAddress']"
                :disabled="!canOperating"
                placeholder="暂无数据"
            />
        </a-form-item>
        <a-form-item label="部门传真">
            <a-input v-decorator="['deptFax']" :disabled="!canOperating" placeholder="暂无数据" />
        </a-form-item>
        <a-form-item label="部门排序">
            <a-input-number
                id="deptOrder"
                v-decorator="[
                    'deptOrder',
                    {
                        rules: [
                            {
                                required: true,
                                message: '部门排序不能为空!'
                            }
                        ]
                    }
                ]"
                :min="1"
                :max="100"
                disabled
                @change="onChange"
            />
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
            <a-button @click="getDeptInfo(deptId, canOperating, 1)">
                重置
            </a-button>
            <a-button type="primary" html-type="submit" class="ml10">
                确定
            </a-button>
        </a-form-item>
    </a-form>
</template>
<script>
import API from '@/api/system/myDepartment/index'
export default {
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            hide: 0,
            gData: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            principal: '',
            deptOrder: '',
            deptId: '',
            parentname: '',
            canOperating: '',
            lustname: []
        }
    },
    methods: {
        getDeptInfo(id, canOperating, e) {
            this.lustname = []
            this.canOperating = canOperating
            this.deptId = id
            let parame = {
                deptId: id
            }
            API.getDeptInfo(parame)
                .then((res) => {
                    if (e == 1) {
                        this.$message.success('重置成功！')
                    }
                    this.form.setFieldsValue({
                        deptName: res.deptName,
                        deptCode: res.deptCode,
                        deptDescription: res.deptDescription,
                        deptManagerPhone: res.deptManagerPhone,
                        deptAddress: res.deptAddress,
                        deptFax: res.deptFax,
                        deptValidTime: res.deptValidTime
                            ? this.$moment(
                                  this.$getdate(res.deptValidTime, 1),
                                  'YYYY-MM-DD HH:mm:ss'
                              )
                            : '',
                        deptOrder: res.deptOrder
                    })
                    if (res.sysUserList) {
                        res.sysUserList.forEach((item) => {
                            this.lustname.push(item.sysUserName)
                        })
                    }
                    this.deptOrder = res.deptOrder
                    this.parentname = res.parentDeptName
                })
                .catch(() => {})
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = {
                        deptId: this.deptId,
                        deptDescription: values.deptDescription,
                        deptManagerPhone: values.deptManagerPhone,
                        deptAddress: values.deptAddress,
                        deptFax: values.deptFax
                    }
                    API.updateDepartment(parame)
                        .then(() => {
                            this.$message.success('修改成功！')
                            this.$emit('adchaner')
                        })
                        .catch(() => {})
                }
            })
        }
    }
}
</script>
<style>
/* s */
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
<style lang="scss" scoped>
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
