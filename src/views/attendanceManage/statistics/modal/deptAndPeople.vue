<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-24 10:17:19
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-08 11:21:39
-->
<template>
    <a-modal
        style="z-index: 10"
        title="通行权限下发"
        :visible="showMove"
        width="1000px"
        centered
        cancelText="取消"
        okText="确定"
        @cancel="handleCancels"
        v-if="deleteDom"
        @ok="issuedEquipment"
    >
        <div class="text">
            <div class="choose">选择:</div>
            <div class="choose">已选:</div>
        </div>
        <div class="catchDev">
            <div class="left">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入关键字"
                    @change="onChange"
                />
                <a-spin :spinning="isSpinningTree">
                    <a-tree
                        class="my-tree"
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        :tree-data="gData"
                        show-icon
                        :selectedKeys="selectedata"
                        @expand="onExpand"
                        @select="onSelect"
                        v-model="checkeds"
                        :checkStrictly="true"
                        :replaceFields="replaceFields"
                    >
                        <template
                            slot="title"
                            slot-scope="{ groupName, groupCode, totalPersonNum, choosePersonNum }"
                        >
                            <span v-if="groupName.indexOf(searchValue) > -1">
                                {{ groupName.substr(0, groupName.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{
                                    groupName.substr(
                                        groupName.indexOf(searchValue) + searchValue.length
                                    )
                                }}
                            </span>
                            <span v-else>{{ groupName }}</span>
                            <span style="color: #d1d1d1"> {{ groupCode }} </span>
                            <span v-if="totalPersonNum"
                                >{{ `( ${choosePersonNum}/${totalPersonNum} )` }}
                            </span>
                            <span v-else>{{ `( ${totalPersonNum} )` }}</span>
                        </template>
                    </a-tree>
                </a-spin>
            </div>
            <div class="right">
                <a-input-search
                    v-show="selectedKeys"
                    style="margin-bottom: 8px"
                    placeholder="请输入关键字"
                    v-model="searchDevice"
                    @search="getCameraItemPageList(1)"
                />
                <a-empty
                    v-show="!selectedKeys"
                    description="请先选择一个分组"
                    style="margin-top: 68px"
                />
                <div v-show="selectedKeys" class="dev">
                    <div class="dev-top" v-show="isShow">
                        <span>授权通行</span>
                    </div>
                    <div class="dev-all" v-show="isShow">
                        <div>所有设备</div>
                        <div>
                            <a-checkbox v-model="accessAll" @click="changeClickAll"></a-checkbox>
                        </div>
                    </div>
                    <div class="dev-all" v-show="isShow"></div>
                    <a-spin :spinning="isSpinningList">
                        <a-list :data-source="listData" class="list">
                            <a-list-item slot="renderItem" slot-scope="item" class="dev-list">
                                <div>
                                    {{ item.personName }}
                                    <span style="color: #e2e2e2">{{ `( ${item.faceNo} )` }}</span>
                                </div>
                                <div>
                                    <a-checkbox
                                        v-model="item.access"
                                        @click="handleClickItem(item)"
                                    ></a-checkbox>
                                </div>
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <!--  小型分页组件 class="page" v-show="total !== 0"-->
                    <smallSecondPage
                        v-show="isShow"
                        ref="smallPagination"
                        class="pages"
                        @success="getCameraItemPageList(...deviceGroupId)"
                    />
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/attendanceManage/statistics'
import smallSecondPage from '@/components/smallSecondPage'
import { _debounce } from '@/utils/global.js'
// 测试结束
export default {
    components: {
        smallSecondPage
    },
    data() {
        return {
            searchDevice: '',
            isShow: true,
            isSpinningTree: false,
            isSpinningList: false,
            showMove: false,
            expandedKeys: [], //树
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            newSelect: '',
            checkeds: [],
            scopedSlots: {
                title: 'title'
            },
            dataList: [],
            name: '',
            selectedata: [],
            replaceFields: {
                children: 'children',
                title: 'groupName',
                key: 'id'
            },
            deleteid: [],
            deleteDom: true,
            selectedKeys: '',
            slots: {
                icon: 'smile'
            },
            ipagination: {
                current: 1
            },
            listData: [],
            deviceGroupId: [],
            checkAll: Boolean,
            deviceId: '',
            faceGroupId: '',
            accessAll: false
        }
    },

    computed: {
        ...mapGetters(['FACE_BEFOREID']) // 上级分组
    },
    methods: {
       
        show(id) {
            this.deviceId = id
            this.deleteDom = true
            this.showMove = true
            this.selectedata = [] // 清空选择
            this.selectedata.length = 0
            this.selectedKeys = false
            this.getCameraGroupTree()
        },
        handleCancels() {
            this.showMove = false
            this.deleteDom = false
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';
::v-deep .ant-modal-body {
    margin-bottom: -30px;
}
::v-deep .ant-list-split .ant-list-item {
    border: none;
}
::v-deep .ant-list-item {
    padding: 8px 0;
}
.text {
    display: flex;
    @include font(16px, 400, #666666);
    .choose {
        flex: 1;
        margin: 0 0 18px 40px;
    }
}
.catchDev {
    display: flex;
    justify-content: space-around;
    margin-bottom: 50px;

    .left {
        position: relative;
        width: 400px;
        height: 410px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        padding: 16px;

        .desc {
            position: absolute;
            top: 415px;
            left: 0px;
            @include font(14px, 400, #999999);
        }

        .my-tree {
            overflow: auto;
            height: 340px;
            width: 100%;
        }
    }

    .right {
        position: relative;
        width: 400px;
        height: 410px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        padding: 16px;

        .pages {
            position: absolute;
            top: 350px;
            right: 0px;
        }
    }
}

.dev::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
}

.dev {
    overflow-y: scroll;
    height: 275px;

    .dev-top {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 4px;
        @include font(14px, 400, #007aff);
    }

    .dev-list {
        display: flex;
        justify-content: space-between;
    }

    .dev-all {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
    }
}

.my-tree ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.my-tree ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.2);
}

.my-tree ::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
