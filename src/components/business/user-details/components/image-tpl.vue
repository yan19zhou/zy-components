<!--
 * @Description
 * @Author: zhouy
 * @Date: 2021-08-18 16:32:55
 * @LastEditTime: 2021-08-25 15:10:36
 * @LastEditors: zhouy
-->
<template>
  <div>
    <div style="width: 100%;overflow-x: auto;">
      <div style="width: max-content;">
        <div style="width: 200px;height:100px;display: inline-block;margin-right: 15px;" v-for="item in list">
          <el-image :src="item.url" @click.stop="handlePictureCardPreview(item.url)"></el-image>
        </div>
      </div>
      <el-dialog :visible.sync="Visible" :append-to-body='true'>
        <img width="100%" :src="ImageUrl">
      </el-dialog>
    </div>

  </div>


</template>

<script>
  import imageTpl from './image-tpl.vue'
  export default {
    data(){
      return {
        list:[],
        ImageUrl: '',
        Visible: false,
      }
    },
    props:['id'],
    watch:{
      id:{
        handler(newName, oldName) {
          if(newName){
              this.list = [];
            this.setList(newName)
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods:{
      handlePictureCardPreview(file) {
        this.ImageUrl = file;
        this.Visible = true;
      },
      setList(id){
          console.log(321312, id);
        this.http.get('/admin/sys-file/getFileList/' + id + '/photo').then(res=>{
        if (res.data.code === 0) {
            for(let i of res.data.data){
                this.list.push({
                   url:this.$prefix+'/admin/sys-file/img/'+i.fileId
                 })
            }
            }
        })
      }
    },
    mounted(){
       this.setList(this.id)
    }
  }
</script>

<style>
</style>
