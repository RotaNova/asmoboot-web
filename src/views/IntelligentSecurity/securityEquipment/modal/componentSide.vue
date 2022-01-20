<template>
    <div>
        <div v-if="item.dataType == 'INT'" class="disflex">
            <a-input :suffix="item.dataSpecs.unit" :disabled="item.rwFlag != 'READ_WRITE'" />
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'FLOAT'" class="disflex">
            <a-input :suffix="item.dataSpecs.unit" :disabled="item.rwFlag != 'READ_WRITE'" />
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'DOUBLE'" class="disflex">
            <a-input :suffix="item.dataSpecs.unit" :disabled="item.rwFlag != 'READ_WRITE'" />
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'ENUM'" class="disflex">
            <a-select allowClear>
                <a-select-option
                    v-for="itemend in item.dataSpecsList"
                    :key="itemend.value"
                    :value="itemend.value"
                    :disabled="item.rwFlag != 'READ_WRITE'"
                >
                    {{ itemend.name }}
                </a-select-option>
            </a-select>
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'BOOL'" :class="item.rwFlag != 'READ_WRITE' ? 'anlinght' : ''">
            <a-switch default-checked @change="onChange" v-if="item.rwFlag == 'READ_WRITE'" />
            <span class="boolType" v-if="item.rwFlag != 'READ_WRITE'"></span>
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'TEXT'" class="disflex">
            <a-textarea
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 1, maxRows: 7 }"
                :disabled="item.rwFlag != 'READ_WRITE'"
                :max="item.dataSpecs.length"
                v-model="item.value"
            />
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
        <div v-if="item.dataType == 'DATE'" class="disflex">
            <a-date-picker
                format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
                :disabled-time="disabledDateTime"
                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                :disabled="item.rwFlag != 'READ_WRITE'"
                style="flex:1"
            />
            <a-button type="primary" class="ml20" v-if="item.rwFlag == 'READ_WRITE'">
                设置
            </a-button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        items: Object
    },
    data() {
        return {}
    },
    methods: {}
}
</script>
