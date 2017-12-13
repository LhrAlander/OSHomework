<template>
  <div class="wrapper">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">短作业优先（非抢占式）</el-menu-item>
      <el-menu-item index="2">
        短作业优先（抢占式）
      </el-menu-item>
      <el-menu-item index="3">
        时间片轮转
      </el-menu-item>
      <el-menu-item index="4">
        文件操作
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: '1',
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {

      if (this.currentIndex != key) {
        this.currentIndex = key
        switch (key) {
          case '1':
            this.$router.push('/sjfno')
                break;
          case '2':
            this.$router.push('/sjf')
                break;
          case '3':
            this.$router.push('/rr')
            break;
          case '4':
            this.$router.push('/file')
            break;
        }
      }
    }
  }
}
</script>

<style scoped>
  .wrapper {
    position: relative;
    width: 80%;
    margin: 0 auto;
  }



</style>
