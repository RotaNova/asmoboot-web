<template>
  <div>
    <!-- 系统备份 -->
    <a-modal
      style="z-index:10"
      title="系统备份列表"
      :visible="showBackupList"
      width="1000px"
      centered
      :confirm-loading="confirmLoading"
      @cancel="handleCancels"
      @ok="handleLogBackupOk"
    >
      <template slot="footer">
        <a-button @click="handleCancels">关闭</a-button>
      </template>

      <div>
        <div>
          <a-button
            v-if="deleteid.length > 0"
            @click="
              () => {
                visibleDelete = true
              }
            "
          >
            批量删除
          </a-button>
          <!-- 删除设置二次确认 -->
          <a-modal
            style="z-index:11"
            v-model="visibleDelete"
            centered
            class="modalSecond"
            title="批量删除"
            width="432px"
            heigth="198px"
            @ok="handleDeleteApp(1)"
          >
            <p class="font14 font666 disflex">
              <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
              &nbsp;是否批量删除 ?
            </p>
          </a-modal>
        </div>
        <div class="mt24">
          <a-table
            :columns="columns"
            :data-source="BackList"
            rowKey="id"
            :row-selection="{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setchang(selectedRows)
              }
            }"
            :pagination="ipagination"
            @change="handleChangeInTable"
          >
            <!-- slot-scope="text, record" 传text record -->
            <span slot="operate" slot-scope="text, record">
              <span class="Authorized-users cursor" @click="deleteOne(record)">删除</span>
              <span class="segmentation">|</span>
              <span><a :href="record.fileUrl">下载</a></span>
            </span>
          </a-table>
        </div>
      </div>
    </a-modal>
    <!-- 单个删除设置二次确认 -->
    <a-modal
      v-model="visibleDeleteOne"
      centered
      style="z-index:11"
      title="删除备份"
      width="432px"
      heigth="198px"
      @ok="handleDeleteAppOne"
    >
      <p class="font14 font666 disflex">
        <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
        &nbsp;是否删除备份 ?
      </p>
    </a-modal>
  </div>
</template>

<script>
import API from '@/api/sysSetting/index'
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
  name: 'sysBackupList',
  data() {
    return {
      visibleDeleteOne: false,
      showBackupList: false,
      rowSelection,
      BackList: [],
      total: 0,
      visibleDelete: false,
      columns: [
        {
          title: '备份名称',
          dataIndex: 'bakName',
          key: 'bakName',
          align: 'center',
          scopedSlots: { customRender: 'bakName' },
          width: '18.6%'
        },
        {
          title: '备份编号',
          dataIndex: 'bakCode',
          key: 'bakCode',
          align: 'center',
          scopedSlots: { customRender: 'bakCode' },
          width: '10.4%'
        },
        {
          title: '备份类型',
          dataIndex: 'bakType_dictText',
          key: 'bakType_dictText',
          align: 'center',
          scopedSlots: { customRender: 'bakType_dictText' },
          width: '10.4%'
        },
        {
          title: '备份创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center',
          scopedSlots: { customRender: 'createTime' },
          width: '15.1%'
        },
        {
          title: '备份完成时间',
          dataIndex: 'bakTime',
          key: 'bakTime',
          align: 'center',
          scopedSlots: { customRender: 'bakTime' },
          width: '15.1%'
        },
        {
          title: '备份大小',
          dataIndex: 'fileSize',
          key: 'fileSize',
          align: 'center',
          scopedSlots: { customRender: 'fileSize' },
          width: '10.4%'
        },
        {
          title: '操作',
          dataIndex: 'address',
          key: 'address',
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
    this.getSysBackupList()
  },
  methods: {
    handleLogBackupOk() {
      this.showLogBackupList = false
    },
    // onChange(e) {
    //   console.log(e);
    // },
    // 获取多选的数据
    setchang(arr) {
      // 删除id为空
      this.deleteid = []
      // 遍历往这个数组里面丢
      arr.forEach((item) => {
        this.deleteid.push(item.id)
      })
    },
    // 表格操作  增删改查 分页
    handleChangeInTable(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.sorter.column = sorter.field
        this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.getSysBackupList()
    },
    //展示取消
    handleCancels() {
      this.showBackupList = false
    },
    handleBackupOk() {
      this.showBackupList = false
    },
    show() {
      this.showBackupList = true
      this.getSysBackupList()
    },
    // 获取系统备份列表
    getSysBackupList() {
      let params = {
        pageSize: this.ipagination.pageSize,
        pageNum: this.ipagination.current
      }
      API.getSysBackupList(params)
        .then((res) => {
          // console.log(res);
          this.BackList = res.records
          this.ipagination.total = res.total
          // console.log(this.BackList);
        })
        .catch(() => {})
    },
    /**
     * @name: 批量删除按钮
     * @msg:
     * @param {*}
     * @return {*}
     */
    // 删除系统信息备份 传row
    handleDeleteApp(row) {
      // 参数为空
      let params = []
      // 一为标志位，如果不是一说明是批量删除
      if (row == 1) {
        params = this.deleteid
      } else {
        // 把数据放进批量数组里去
        params.push(row.id)
      }
      API.deleteBackup(params)
        .then(() => {
          // 重新获取备份列表
          this.getSysBackupList()
          this.visibleDelete = false
          this.$message.success('批量删除成功')
        })
        .catch(() => {})
    },
    // 单个删除
    deleteOne(record) {
      this.visibleDeleteOne = true
      this.deleteid.push(record.id)
    },
    handleDeleteAppOne() {
      let params = []
      params = this.deleteid
      API.deleteBackup(params)
        .then(() => {
          // 重新获取备份列表
          this.getSysBackupList()
          this.visibleDeleteOne = false
          this.$message.success('备份删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.modalSecond {
  display: flex;
  // 两边对齐
  justify-content: center;
  // 水平方向居中
  align-items: center;
}
</style>

<!-- <a-dropdown >
                        <a-menu slot="overlay">
                            <a-menu-item key="1" > 删除 </a-menu-item>
                            <a-menu-item key="2">下载 </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px">
                            批量操作<a-icon type="down" />
                        </a-button>
                    </a-dropdown> -->
