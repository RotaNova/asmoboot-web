<template>
  <div>
    <!-- 定时重启列表 -->
    <a-modal
      title="重启时间列表"
      :visible="showRestartTimeList"
      width="1000px"
      centered
      :confirm-loading="confirmLoading"
      @cancel="handleCancels"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancels">
          关闭
        </a-button>
      </template>
      <div>
        <div>
          <a-button type="primary" style="height:32px;width:132px;" @click="handleAddTime">
            <a-icon type="plus" /> 添加重启时间
          </a-button>
        </div>
      </div>
      <a-table
        class="mt20"
        :columns="columnsTime"
        :data-source="RestartList"
        rowKey="sysTimingTaskId"
        :row-selection="{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            this.setchang(selectedRows)
          }
        }"
        :pagination="ipagination"
        @change="handleChangeInTable"
      >
        <!-- 时间戳转换 -->
        <span slot="timing" slot-scope="text, record">
          {{ record.timing ? $getdate(record.timing, 1) : '' }}
        </span>
        <span slot="operate" slot-scope="text, record">
          <div class="Authorized-users cursor" @click="deleteRestart(record)">
            删除
          </div>
        </span>
      </a-table>
    </a-modal>
    <!-- 添加重启时间 -->
    <a-modal
      centered
      title="添加重启时间"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :visible="visibleTime"
    >
      <a-form-model style="padding-bottom:0" ref="addResTime" :rules="rules" :model="form">
        <a-form-model-item
          ref="addTime"
          prop="addTime"
          style="width:352px;height:32px;margin:0 54px;"
        >
          <!-- v-model="addTime" -->
          <a-date-picker
            style="width:352px;height:32px;"
            placeholder="请选择日期"
            v-model="form.addTime"
            format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import API from '@/api/sysSetting/index'
import { log } from 'util'
// 定义分页部分
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  data() {
    return {
      form: {
        addTime: ''
      },
      rules: {
        addTime: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      rowSelection,
      total: 0,
      visibleTime: false,
      showRestartTimeList: false,
      RestartList: [],
      // addTime: [],
      columnsTime: [
        {
          title: '重启时间',
          dataIndex: 'timing',
          key: 'timing',
          width: '77%',
          scopedSlots: { customRender: 'timing' },
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      ipagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '15', '20'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      deleteid: []
    }
  },
  mounted() {
    this.listRestartRegularly() // 获取系统重启时间列表
  },
  methods: {
    handleAddTime() {
      this.visibleTime = true
      this.form.addTime = ''
    },
    show() {
      this.showRestartTimeList = true
    },
    handleCancels() {
      this.showRestartTimeList = false
    },
    handleCancel() {
      this.visibleTime = false
    },
    // 表格操作  增删改查 分页
    handleChangeInTable(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.sorter.column = sorter.field
        this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.listRestartRegularly() // 获取系统重启时间列表
    },
    /**
     * @name:获取系统重启时间列表
     * @msg:
     * @param {pageSize，pageNum}
     * @return {*}
     */
    // 转换时间戳
    listRestartRegularly() {
      let params = {
        pageSize: this.ipagination.pageSize,
        pageNum: this.ipagination.current
      }
      API.listRestartRegularly(params)
        .then((res) => {
          this.RestartList = res.records
          this.ipagination.total = res.total
        })
        .catch((err) => {})
    },
    // 删除 @params FormData()
    deleteRestart(record) {
      // console.log(record);
      let params = {
        sysTimingTaskId: record.sysTimingTaskId
      }
      // 删除row下面的数据
      API.deleteRestartRegularly(params)
        .then(() => {
          this.listRestartRegularly()
          this.$message.success('重启时间删除成功')
        })
        .catch(() => {})
    },
    /**
     * @name:提交定时重启任务
     * @msg:FormData格式
     * @param {timing}
     * @return {*}
     */
    handleSubmit(e) {
      this.$refs.addResTime.validate((valid) => {
        if (valid) {
          let parame = new FormData()
          parame.append('timing', this.dateToMs(this.form.addTime))
          API.saveRestartRegularly(parame)
            .then(() => {
              this.$message.success('重启时间添加成功')
              this.form.addTime = ''
              this.listRestartRegularly()
              this.visibleTime = false
            })
            .catch(() => {})
        } else {
          this.$message.error('请选择一个日期')
          return false
        }
      })
      // // 如果没有这个，就代表没有选择时间
      // if (!this.addTime) return
      // let parame = new FormData()
      // parame.append('timing', this.dateToMs(this.addTime))
      // API.saveRestartRegularly(parame)
      //   .then(() => {
      //     this.$message.success('重启时间添加成功')
      //     this.listRestartRegularly()
      //     this.visibleTime = false
      //   })
      //   .catch(() => {})
    }
  }
}
</script>

<style></style>
