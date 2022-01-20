<template>
  <section class="roleManage">
    <div class="System-role">
      <advancedSearch
        @success=";(ipagination.current = 1), getBehaviorLogList()"
        ref="search"
        :searchCode="searchCode"
      />
      <div class="mt16">
        <a-table
          :columns="columns"
          :data-source="tableData"
          rowKey="id"
          :pagination="ipagination"
          @change="handleChangeInTable"
        >
          <span slot="syslogTime" slot-scope="text, record">
            <span>{{ $getdate(record.syslogTime, 1) }}</span>
          </span>
          <span slot="userStatus" slot-scope="text, record">
            <span class="Authorized-users cursor" @click="particularsData(record)">详情</span>
          </span>
          <span slot="operate" slot-scope="text, record">
            <span class="Authorized-users cursor" @click="compileData(record)">编辑</span>
            <span class="segmentation">|</span>
            <a-dropdown>
              <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="openPermissions(record)">
                  <span>重置密码</span>
                </a-menu-item>
                <a-menu-item @click="freezeUser(record, 1)">
                  <span>冻结</span>
                </a-menu-item>
                <a-menu-item @click="freezeUser(record, 2)">
                  <span>解冻</span>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="是否确定删除?" @confirm="confirm(record)" @cancel="cancel">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </div>
    </div>
    <a-modal
      title="日志详情"
      :visible="popstitle"
      width="800px"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleOk"
            :footer="null"
    >
      <div>
        <div class="information">
          <span>
            日志内容:
          </span>
          <span>{{ objdata.syslogContent }}</span>
        </div>
        <div class="information">
          <span>
            操作人:
          </span>
          <span>{{ objdata.operateBy }}</span>
        </div>
        <div class="information">
          <span>
            操作人IP:
          </span>
          <span>{{ objdata.operateIp }}</span>
        </div>
        <div class="information">
          <span>
            日志类型:
          </span>
          <span>{{ objdata.syslogType_dictText }}</span>
        </div>
        <div class="information">
          <span>
            日志时间:
          </span>
          <span>{{ objdata.syslogTime }}</span>
        </div>
        <div class="information">
          <span>
            操作类型:
          </span>
          <span>{{ objdata.operateType_dictText }}</span>
        </div>
        <div class="information">
          <span>
            请求方法:
          </span>
          <span>{{ objdata.operateType_dictText }}</span>
        </div>
        <div class="information">
          <span>
            请求路径:
          </span>
          <span>{{ objdata.operateUrl }}</span>
        </div>
        <div class="information">
          <span>
            请求参数:
          </span>
          <span>{{ objdata.operateParam }}</span>
        </div>
        <div class="information">
          <span>
            请求类型:
          </span>
          <span>{{ objdata.operateRequestType_dictText }}</span>
        </div>
          <div class="infor-footer">
                    <a-button @click="handleOk">关 闭</a-button>
                </div>
      </div>
    </a-modal>
  </section>
</template>
<script>
import API from '@/api/systemMaintenance/logManagement'
import advancedSearch from '@/components/advancedSearch'
export default {
  data() {
    return {
      columns: [
        {
          title: '日志内容',
          dataIndex: 'syslogContent',
          key: 'syslogContent',
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'operateBy',
          key: 'operateBy',
          align: 'center'
        },
        {
          title: '操作人IP',
          dataIndex: 'operateIp',
          key: 'operateIp',
          align: 'center',
          scopedSlots: { customRender: 'operateIp' }
        },
        {
          title: '日志类型',
          dataIndex: 'syslogType_dictText',
          key: 'syslogType_dictText',
          align: 'center'
        },
        {
          title: '日志时间',
          dataIndex: 'syslogTime',
          key: 'syslogTime',
          align: 'center',
          scopedSlots: { customRender: 'syslogTime' }
        },
        {
          title: '操作类型',
          dataIndex: 'operateType_dictText',
          key: 'operateType_dictText',
          align: 'center'
        },
        {
          title: '操作耗时(ms)',
          dataIndex: 'operateCostTime',
          key: 'operateCostTime',
          align: 'center',
          scopedSlots: { customRender: 'operateCostTime' }
        },
        {
          title: '操作',
          dataIndex: 'userStatus',
          key: 'userStatus',
          align: 'center',
          scopedSlots: { customRender: 'userStatus' }
        }
      ],
      tableData: [],
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
      packup: true,
      visible: false,
      childrenDrawer: false,
      deleteid: [],
      rouseData: [],
      rousemouer: '',
      openstuent: '',
      sysUserId: '',
      popstitle: false,
      objdata: {},
      searchCode: 'sys_log_search'
    }
  },
  mounted() {
    this.getBehaviorLogList()
  },
  methods: {
    // 关闭详情弹框
    handleOk() {
      this.popstitle = false
    },
    // 表格操作  增删改查 分页
    handleChangeInTable(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.sorter.column = sorter.field
        this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.getBehaviorLogList()
    },
    // 详情
    particularsData(row) {
      this.objdata = {}
      this.objdata = row
      this.popstitle = true
    },
    // 获取数据
    getBehaviorLogList() {
      let parame = {
        dateArray: [],
        pageNum: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        content: '',
        operateBy: '',
        operateType: ''
      }
      Object.assign(parame, this.$refs.search.ObtainSearch())
      API.getBehaviorLogList(parame)
        .then((res) => {
          this.ipagination.total = res.total
          this.tableData = res.records
        })
        .catch(() => {})
    }
  },
  components: {
    advancedSearch
  }
}
</script>

<style lang="scss" scoped>
.disflexs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.information {
  display: flex;
  margin-top: 20px;
  span {
    display: inline-block;
  }
  span:nth-child(1) {
    width: 160px;
    text-align: right;
  }
  span:nth-child(2) {
    width: 350px;
    margin-left: 10px;
  }
}
.information:nth-child(1) {
  margin-top: 0;
}
.infor-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
