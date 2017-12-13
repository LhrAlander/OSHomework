<template>
  <el-row class="up-wrapper">
    <el-col :span="5" class="upload">
      <el-upload
        class="upload-demo"
        action="/users/file-upload"
        :on-remove="handleRemove"
        multiple
        :data="dataa"
        :limit="3"
        :on-preview="previewFile"
        :on-exceed="handleExceed"
        :on-error="errorFile"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-col>
    <el-col :span="5"><el-button type="danger" size="small" @click="delFile">删除源文件</el-button></el-col>
  </el-row>

</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        fileList: [],
        dataa: {
          name: "hairui"
        },
        filePath: ""
      };
    },
    methods: {
      previewFile(file){
        this.filePath = file.response.path
      },
      errorFile(err, file, filelist) {
        console.log(err)
        console.log(file)
        console.log(filelist)
      },
      uploadFile () {

        // 成功上传
        function uploadSuccess(event) {
          if (xhr.readyState === 4) {
            console.log(xhr.responseText);
          }
        }

          // 进度条
          function setProgress(event) {
            if (event.lengthComputable) {
              var complete = Number.parseInt(event.loaded / event.total * 100);
              progress.innerHTML = complete + '%';
            }
          }
//        let formData = new FormData()
//        formData.append('fileUpload',this.$refs.file.files[0]);
        let postData = {
          file: this.$refs.file.files[0]
        }
        console.log(this.fileList[0])
        axios({
          method: 'post',
          url: '/users/file-upload',
          data:postData,
        });

      },
      delFile () {
        axios.post("/users/delFile", {
          path: this.filePath
        })
          .then(res => {
            console.log(res)
            if (res.data.code == 1) {
              alert("删除成功!")
            }
            else {
              alert("删除失败")
            }
          })
          .catch(err => {
            alert("删除出错")
          })
      }

    }
  }
</script>
<style scoped>
  .el-upload {
    margin: 1rem;
  }

</style>
