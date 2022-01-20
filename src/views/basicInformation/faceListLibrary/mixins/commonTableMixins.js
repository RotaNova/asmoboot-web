/*
 * @Descripttion: 通用表单数据封装mixins封装
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-04 09:45:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-05 11:39:26
 */
export default {
    data() {
        return {
            defaultImg: 'http://fpoimg.com/48x48?text=暂无人员图片',
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [], //删除数组,
            tableData: '', // 表格数据源
            columns: [
                {
                    title: '人脸底图',
                    dataIndex: 'faceUrl',
                    key: 'faceUrl',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'faceUrl' }
                },
                {
                    title: '姓名',
                    dataIndex: 'personName',
                    key: 'personName',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'personName' }
                },
                {
                    title: '编号',
                    dataIndex: 'faceNo',
                    key: 'faceNo',
                    align: 'center',
                    scopedSlots: { customRender: 'faceNo' },
                    width: 100
                },
                {
                    title: '人脸分组',
                    align: 'center',
                    key: 'faceGroupNameList',
                    width: 150,
                    scopedSlots: { customRender: 'faceGroupNameList' }
                },
                {
                    title: '手机号',
                    dataIndex: 'contactPhone',
                    key: 'contactPhone',
                    align: 'center',
                    scopedSlots: { customRender: 'contactPhone' },
                    width: 100
                },
                {
                    title: '状态',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'status_dictText' }
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    keyword: 'a.create_time',
                    sorter: () => {},
                    defaultSortOrder: 'descend'
                },

                {
                    title: '操作',
                    key: 'operate',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    className: 'v-center'
                }
            ]
        }
    },
    methods: {
        /**
         * @description:  用于计算男女图片,1 男 2 女
         * @param {*} value 1 男 0 女 剩下不确定
         * @return {*}
         */
        showIcon(value) {
            if ([1, 0].includes(value)) {
                if (value === 1) {
                    return 'icona-huaban58 man-color'
                } else {
                    return 'icona-huaban59 woman-color'
                }
            }
        },
        /**
         * @description: 用于设置
         * @param {*} value
         * @return {*}
         */
        setFaceGroupNameList(value) {
            return value && Array.isArray(value) ? value[0] : ''
        },
        // 用于批量导出
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        }
    }
}
