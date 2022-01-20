
export default {
    data() {
        return {
            tableData: [],
            columns: [
                {
                    title: '方向',
                    dataIndex: 'direction',
                    key: 'direction',
                    align: 'center',
                    scopedSlots: { customRender: 'direction' }
                },
                {
                    title: '抓拍图',
                    dataIndex: 'snapshotUrl',
                    key: 'snapshotUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'snapshotUrl' }
                },
                {
                    title: '相似度',
                    dataIndex: 'similarity',
                    key: 'similarity',
                    align: 'center'
                },
                {
                    title: '人脸底图',
                    dataIndex: 'faceBaseMapUrl',
                    key: 'faceBaseMapUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'faceBaseMapUrl' }
                },
                {
                    title: '姓名',
                    dataIndex: 'personName',
                    key: 'personName',
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'faceNo',
                    key: 'faceNo',
                    align: 'center',
                    scopedSlots: { customRender: 'faceNo' }
                },
                {
                    title: '人脸分组 ',
                    dataIndex: 'faceGroupName',
                    key: 'faceGroupName',
                    align: 'center',
                    scopedSlots: { customRender: 'faceGroupName' }
                },
                {
                    title: '抓拍时间 ',
                    dataIndex: 'captureTime',
                    key: 'captureTime',
                    align: 'center',
                    scopedSlots: { customRender: 'captureTime' },
                    keyword: 'scr.capture_time',
                    sorter: () => { },
                    defaultSortOrder: 'descend'
                },
                {
                    title: '抓拍设备 ',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center'
                },
                {
                    title: '设备分组 ',
                    dataIndex: 'deviceGroupName',
                    key: 'deviceGroupName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceGroupName' }
                },
                {
                    title: '人员类型',
                    dataIndex: 'personType_dictText',
                    key: 'personType_dictText',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
                loading: false,
                loadings: false
            }
        }
    },
    method: {
        // 点击上传

    }
}