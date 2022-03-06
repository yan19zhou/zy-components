// Created by Charles on 2020/7/27--15:47.
<!--hxf-0804-提取封装组件-->
<template>
  <div>
    <v-dialog :title="isEdit?'编辑':'录入'" :show.sync="dialogVisible" :closeOnClickModal="false" @beforeClose="beforeClose" width="1200px">
      <div class="card-box" v-if="dialogVisible">
        <el-form ref="editForm" :model="form" class="form-wrap" size="small" :rules="rules">
          <!--                    hxf-0804-标题大类-->
          <template v-for="setting in editSettings">
            <div class="data-title full mb12">{{ setting.label }}</div>
            <el-form-item v-for="config in setting.children" :class="config.full ? 'full' : ''" :key="config.label" :label="config.label" :prop="config.model">
              <div class="form-item-choose" v-if="config.type === 'search'" @click="searchShow(config.config)">
                <span v-if="form[config.model]">{{ form[config.model] }}</span>
                <span v-else class="placeholder">请选择{{ config.label }}</span>
                <span class="el-icon-search placeholder"></span>
              </div>
              <el-select clearable v-else-if="config.type === 'select'" v-model="form[config.model]" :placeholder="'请选择' + config.label">
                <el-option v-for="item in config.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-date-picker
                v-else-if="config.type === 'date'"
                v-model="form[config.model]"
                type="date"
                :value-format="!config.valueFormat ? 'yyyy-MM-dd' : config.valueFormat"
                :format="!config.format ? 'yyyy-MM-dd' : config.format"
                :placeholder="'请选择' + config.label"
              ></el-date-picker>
              <div class="full" v-else-if="config.type === 'upload'">
                <upload-media
                  type="file"
                  ref="myUpload"
                  :fileSize="fileSize"
                  :busId="busId"
                  :modelType="modelType"
                  @onSuccess="onSuccess"
                  @onError="onError"
                  @beforeUpload="beforeUpload"
                  :propsFileList="uploadFileList"
                  :isShowFileList="true"
                  :isView="false"
                ></upload-media>
                <!--hxf-0803-文件编辑-->
                <!--<div class="mark mb20">
                                        <div class="flex-c" v-for="(item, index) in fileList" :key="index">
                                            <div class="name mr20">{{ item.fileName + '(' + (item.fileSize / 1024 / 1024).toFixed(4) + 'M)'}}</div>
                                            <div class="date mr20">{{ item.updateTime }}</div>
                                            <div class="btn">
                                                <el-button type="text" @click="handleClean(item)">删除</el-button>
                                            </div>
                                        </div>
                </div>-->
              </div>
              <!--<div  v-if="config.type === 'upload'">
                                    <upload-media type="image"
                                                  ref="imageUpload"
                                                  :fileSize="fileSize"
                                                  :busId="busId"
                                                  :modelType="modelType"
                                                  @onSuccess="onSuccess"
                                                  @onError="onError"
                                                  @beforeUpload="beforeUpload"
                                                  :propsFileList="uploadFileList"
                                                  :isShowFileList="true"
                                                  :isView="false">
                                    </upload-media>
              </div>-->
              <el-input
                v-halfCharCode
                v-else
                v-model="form[config.model]"
                :type="!config.propType ? 'text' : config.propType"
                :maxLength="!config.maxLength ? 25 : config.maxLength"
                :placeholder="'请输入' + config.label"
              >
                <template v-if="config.append" slot="append">{{ config.append }}</template>
              </el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <span slot="foot">
        <el-button @click="cancel()">取 消</el-button>
        <el-button @click="commit">提 交</el-button>
      </span>
    </v-dialog>
    <engineer-list ref="engineerList" @chooseData="chooseData" :propertyPageList="propertyPageList" :config="config"></engineer-list>
  </div>
</template>

<script>
import uploadMedia from '@/components/upload-media'
import engineerList from '@/components/engineer-list'
// import {addObj, putObj} from '~/views/wy-operate/api/operate-construction-contract'
import { mapState } from 'vuex'
import BaseLoad from '@/assets/vue-mixin/BaseLoad'
import { getFiles, delFiles } from '@/api/operate-construction-contract'

export default {
  mixins: [BaseLoad],
  components: { uploadMedia, engineerList },
  props: {
    // hxf-0803-文件列表请求默认值 父页面须填写
    modelType: {
      type: String,
      default: ''
    },
    // hxf-0803-busId对应详情的字段名字，用于不同页面字段不同的配置
    busIdPropertyName: {
      type: String,
      default: ''
    },
    // hxf-0804-配置添加弹框基本信息
    editSettings: {
      type: Array,
      default: () => []
    },
    // hxf-0804-配置添加弹框基本信息校验规则
    rules: {
      type: Object,
      default: () => { }
    },
    // hxf-0804-基本信息绑定值
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // hxf-0803-editSettings配置添加编辑弹框
    propertyPageList: {
      type: Function,
      default: () => {
      }
    }
  },
  computed: {
    ...mapState({
      contract_type: state => {
        let data = state.dict.find(item => item.type === "contract_type") || {}
        let list = data.children || []
        return data.children || []
      },
    }),
  },
  data () {
    return {
      // hxf-0903-文件列表
      fileList: [],
      uploadFileList: [],
      // hxf-0903-文件id
      fileId: '',
      // hxf-0903-文件大小
      fileSize: 50,
      formData: {},
      // url: '/admin/sys-file/upLodeFileAdd',
      input: '',
      value: '',
      area: [],
      dialogVisible: false,
      // hxf-0903-是否为编辑
      isEdit: false,
      // 配置名字搜索
      config: {},
      // hxf-0903-业务id
      busId: ''
    }
  },
  methods: {
    show (item) {
      this.dialogVisible = true
      // console.log('是否获取到busId---', item)
      // if (item === undefined || item === null) {
      //     this.busId = item[this.busIdPropertyName]
      // }
      this.busId = item ? item[this.busIdPropertyName] : ''
      this.$nextTick(function () {
        this.isEdit = false
        this.$refs.editForm.resetFields()
        delete this.form.propertyId
        if (item) {
          // console.log('合同编辑')
          this.isEdit = true
          Object.keys(this.form).forEach(key => {
            this.form[key] = item[key]
          })
          //hxf-0805-如果为编辑时，修改URL地址
          // this.url = '/admin/sys-file/upLodeFileEdit'
          this.form.propertyId = item.propertyId
          // this.$refs.myUpload[0].getFiles(this.busId)
          // hxf-0803-文件列表展示 此处为修改item不为空
          /*let busId = item[this.busIdPropertyName]
          getFiles(busId, this.modelType).then(resp => {
              if (resp.data.code === 0) {
                  this.fileList = [...resp.data.data]
                  // this.fileId = this.fileList[0].fileId
                  console.log( this.fileList)
              } else {
              }
          })*/
        } else {
          // console.log('合同录入')
          Object.keys(this.form).forEach(key => {
            this.form[key] = ''
          })
        }
      })
    },
    // hxf-0806物业名称搜索框带出值回显
    chooseData (data) {
      this.form.propertyName = data.propertyName
    },
    commit (val) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.uploadFileList.length > 0) {
            // console.log('this.isEdit------',this.isEdit)
            // console.log('this.form[this.busIdPropertyName]------',this.form[this.busIdPropertyName])
            // console.log('this.form------',this.form)
            // console.log('this.busIdPropertyName------',this.busIdPropertyName)
            if (this.isEdit) {
              this.$refs.myUpload[0].submit(this.modelType, this.form[this.busIdPropertyName]);
            } else {
              this.$refs.myUpload[0].submit(this.modelType);
            }
          } else {
            this.sendData()
          }
        }
      })
    },
    // hxf-0801-上传文件变化时将文件对象push进files数组
    fileChange (file) {
      this.files.push(file.raw);
    },
    // hxf-0801-成功
    onSuccess (response, file, fileList) {
      if (response.data) {
        this.sendData(response.data)
      } else {
        this.err('提交失败')
      }
    },
    // hxf-0801-失败
    onError (err, file, fileList) {
      this.err('提交失败')
    },
    // hxf-0801-上传前
    beforeUpload () {
      // this.loadAction('请稍等...')
    },
    // hxf-0803-上传前判断
    sendData (val) {
      if (val) {
        this.form[this.busIdPropertyName] = val
      }
      this.$emit('submit', this.isEdit)
    },
    // hxf-0803-删除文件
    /*handleClean(file) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            delFiles(file.fileId, this.modelType).then(resp => {
                if (resp.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.fileList = []
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败!'
                    })
                }
            })

        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        })
    },*/
    //hxf-0803- 弹框X关闭事件
    beforeClose (done) {
      this.cancel()
      done()
    },
    //hxf-0803- 弹框取消事件
    cancel () {
      this.dialogVisible = false
      this.$refs.myUpload[0].fileList = []
      this.uploadFileList = []
      this.fileList = []
    },
    // 配置名字搜索
    searchShow (param) {
      this.config = param
      this.$refs.engineerList.show()
    }
  }
}
</script>

<style lang='scss' scoped>
@include data-title();
@include info-list(2);
@include formWrap(3);
</style>
