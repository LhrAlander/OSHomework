<template>
  <div>



    <el-row class="progress-item-wrapper">
      <el-col :span="14">
        <el-row class="progress-item">
          <el-col :span="5" offset="1">
            <el-input v-model="addProgress.progressName" placeholder="progress name"></el-input>
          </el-col>
          <el-col :span="5" offset="1">
            <el-input v-model="addProgress.arriveTime" placeholder="Arrival Time"></el-input>
          </el-col>
          <el-col :span="5" offset="1">
            <el-input v-model="addProgress.serverTime" placeholder="Burst Time"></el-input>
          </el-col>
          <el-col :span="1" offset="1">
            <el-button type="primary" @click="initTestData">init</el-button>
          </el-col>
          <el-col :span="1" offset="1">
            <el-button type="primary" @click="addaProgress">add</el-button>
          </el-col>

          <el-col :span="1" offset="1">
            <el-button type="success" @click="calculate">Start</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="existProgress"
              style="width: 100%">
              <el-table-column
                prop="progressName"
                label="进程名称">
              </el-table-column>
              <el-table-column
                prop="arriveTime"
                label="到达时间">
              </el-table-column>
              <el-table-column
                prop="serverTime"
                label="服务时间">
              </el-table-column>
              <el-table-column
                prop="awaitTime"
                label="等待时间">
              </el-table-column>
              <el-table-column
                prop="finishTime"
                label="完成时间">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="delProgress(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>

        </el-row>

      </el-col>
      <el-col :span="8" offset="2">
        <h2>平均等待时间</h2>
        <div>
          <h3>{{ averageTime }}</h3>
        </div>
        <el-row>
          <h2>结果展示</h2>
          <el-input
            type="textarea"
            :rows="10"
            v-model="results">
          </el-input>
        </el-row>
      </el-col>
    </el-row>





  </div>
</template>

<script>
  export default {
    data() {
      return {
        existProgress: [],
        operateProgress: [],
        addProgress: {
          progressName : "",
          arriveTime: "",
          serverTime: "",
          restTime: "",
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        },
        resultProgresses: [],
        results: ""
      }
    },
    methods: {
      addaProgress () {
        if (this.addProgress.progressName == "" || this.addProgress.arriveTime == "" || this.addProgress.serverTime == "") {
          this.$message.error('请正确地填写信息');
          return
        }
        let progress = {
          progressName: this.addProgress.progressName,
          arriveTime: parseInt(this.addProgress.arriveTime),
          serverTime: parseInt(this.addProgress.serverTime),
          restTime: parseInt(this.addProgress.serverTime),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        }
        this.existProgress.push(progress)
      },
      initTestData () {
        this.existProgress.push({
          progressName: "p1",
          arriveTime: parseInt(1),
          serverTime: parseInt(6),
          restTime: parseInt(6),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        })
        this.existProgress.push({
          progressName: "p2",
          arriveTime: parseInt(1),
          serverTime: parseInt(8),
          restTime: parseInt(8),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        })
          this.existProgress.push({
            progressName: "p3",
            arriveTime: parseInt(1),
            serverTime: parseInt(7),
            restTime: parseInt(7),
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1
          })
          this.existProgress.push({
            progressName: "p4",
            arriveTime: parseInt(1),
            serverTime: parseInt(3),
            restTime: parseInt(3),
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1
          })
      },
      delProgress (index, row) {
        this.existProgress.splice(index, 1)
      },
      calculate () {
        this.initData()
        let currentSystemTime = 1
        for (let i = 0; i < this.existProgress.length; i++) {
          let progress = this.chooseProgress(this.existProgress, currentSystemTime)
          progress.startTime = currentSystemTime
          progress.finishTime = progress.startTime + progress.serverTime
          progress.awaitTime = progress.startTime - progress.arriveTime
          progress.finished = true
          currentSystemTime = currentSystemTime + progress.serverTime
          this.results += progress.progressName + " 正在执行， 开始执行时间为 " + (currentSystemTime - progress.serverTime) +  "\n"
          this.resultProgresses.push(progress)
        }
        console.log(this.resultProgresses)
      },

      // 获取当前服务的进程
      chooseProgress (progresses, currentSystemTime) {
        let minTime = null
        let returnProgress = null
        for (let i = 0; i < progresses.length; i++) {
          let progress = progresses[i]
          if (progress.finished || currentSystemTime < progress.arriveTime) {
            continue;
          }
          if (minTime == null && returnProgress == null) {
            minTime = progress.serverTime
            returnProgress = progress
            continue
          }
          if (minTime > progress.serverTime) {
            returnProgress = progress
            minTime = progress.serverTime
          }
        }
        return returnProgress
      },

      // 初始化
      initData () {
        this.operateProgress = []
        this.resultProgresses = []
        console.log(this.resultProgresses.length)
        for (let i = 0; i < this.existProgress.length; i++) {
          let progress = this.existProgress[i]
          let _progress = new Object({
            progressName: progress.progressName,
            arriveTime: progress.arriveTime,
            serverTime: progress.serverTime,
            restTime: progress.serverTime,
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1
          })
          this.operateProgress.push(_progress)
        }
      }
    },
    computed: {
      averageTime () {
        let sum = 0
        for (let i = 0; i < this.existProgress.length; sum += this.existProgress[i++].awaitTime);
        return sum / this.existProgress.length
      }
    }
  }
</script>

<style scoped>

  .progress-item-wrapper {
    margin: 1rem;
  }


</style>
