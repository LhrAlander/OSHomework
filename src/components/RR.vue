<template>
  <div>


    <el-row class="progress-item-wrapper">
      <el-col :span="14">
        <el-row class="progress-item">
          <el-col :span="5" offset="1">
            <el-input v-model="time" placeholder="time size"></el-input>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

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
            <el-button type="primary" @click="initData">init</el-button>
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
          <h2>过程展示</h2>
          <el-input
            type="textarea"
            :rows="10"
            v-model="results">
          </el-input>
        </el-row>
        <el-row>
          <h2>结果展示</h2>
          <el-input
            type="textarea"
            :rows="10"
            v-model="finalRes">
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
          awaitTime: -1,
          isFirst: true
        },
        resultProgresses: [],
        results: "",
        finalRes: "",
        time: ""
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
          awaitTime: -1,
          isFirst: true
        }
        this.existProgress.push(progress)
      },
      delProgress (index, row) {
        this.existProgress.splice(index, 1)
      },
      initData () {
        this.time = 4
        this.existProgress.push({
          progressName: "p1",
          arriveTime: parseInt(1),
          serverTime: parseInt(24),
          restTime: parseInt(24),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1,
          isFirst: true
        })
          this.existProgress.push({
            progressName: "p2",
            arriveTime: parseInt(1),
            serverTime: parseInt(3),
            restTime: parseInt(3),
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1,
            isFirst: true
          })
          this.existProgress.push({
            progressName: "p3",
            arriveTime: parseInt(1),
            serverTime: parseInt(3),
            restTime: parseInt(3),
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1,
            isFirst: true
          })
      },
      calculate () {
        // 当前系统时间
        let currentSystemTime = 1
// 时间片大小
        let time = parseInt(this.time)
        let currentTime = 0

        function createProgress (progressName, arriveTime, serverTime) {
          return {
            progressName: progressName,
            arriveTime: arriveTime,
            serverTime: serverTime,
            restTime: serverTime,
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1,
            isFirst: true
          }
        }

// 创建进程
        let progresses = []
        for (let i = 0; i < this.existProgress.length; i++) {
          let _progress = this.existProgress[i]
          progresses.push(createProgress(_progress.progressName, _progress.arriveTime, _progress.serverTime))
        }

        let finishProgresses = [] // 已完成进程集合
        let awaitProgresses = []  // 执行队列
        let activeProgress = null // 正在执行的进程
        let timeNodes = [] 		  // 时间集合

        while (finishProgresses.length < progresses.length || awaitProgresses > 0) {
          this.results += "当前时间为：" + currentSystemTime + "\n"

          chooseProgress()
          if (currentTime == time) {
            currentTime = 0
            if (activeProgress != null) {
              awaitProgresses.push(activeProgress)
              this.results += activeProgress.progressName + " 插入等待队列末尾， 当前等待进程个数为：" + awaitProgresses.length + "\n"
            }
            if (awaitProgresses.length > 0) {
              activeProgress = awaitProgresses.shift()
              this.results += activeProgress.progressName + " 被取出, 当前等待进程个数为：" + awaitProgresses.length + "\n"
              // 记录该进程开始时间
              if (activeProgress.isFirst) {
                activeProgress.startTime = currentSystemTime
                activeProgress.isFirst = false
              }
            }
            activeProgress.restTime--
            createTimeNode()
            this.results += activeProgress.progressName + " 正在进行，当前等待进程个数为：" + awaitProgresses.length + ", 剩余服务时间为：" + activeProgress.restTime + "\n"
            if (activeProgress.restTime == 0) {
              // 记录结束时间
              activeProgress.finishTime = currentSystemTime + 1
              finishProgresses.push(activeProgress)
              this.results += activeProgress.progressName + " 执行完毕，当前等待进程个数为：" + awaitProgresses.length + ", 已完成进程集合个数为： " + finishProgresses.length + "\n"
              activeProgress = null

            }

          }
          else {
            if (activeProgress == null) {
              activeProgress = awaitProgresses.shift()

              this.results += activeProgress.progressName + " 被取出, 当前等待进程个数为：" + awaitProgresses.length + "\n"
            }
            if (activeProgress != null) {
              // 记录该进程开始时间
              if (activeProgress.isFirst) {
                activeProgress.startTime = currentSystemTime
                activeProgress.isFirst = false
              }
              activeProgress.restTime--
              createTimeNode()
              this.results += activeProgress.progressName + " 正在进行，当前等待进程个数为：" + awaitProgresses.length + ", 剩余服务时间为：" + activeProgress.restTime + "\n"
              if (activeProgress.restTime == 0) {
                // 记录结束时间
                activeProgress.finishTime = currentSystemTime + 1
                finishProgresses.push(activeProgress)
                this.results += activeProgress.progressName + " 执行完毕，当前等待进程个数为：" + awaitProgresses.length + ", 已完成进程集合个数为： " + finishProgresses.length + "\n"
                activeProgress = null
              }
            }
          }
          currentSystemTime++
          if (activeProgress == null) {
            currentTime = 0
          }
          else {
            currentTime++
          }
        }


        for (let i = 0; i < progresses.length; i++) {
          let progress = this.existProgress[i]
          let _pro = progresses[i]
          progress.startTime = _pro.startTime
          progress.finishTime = _pro.finishTime
          progress.awaitTime = progress.finishTime - progress.arriveTime - progress.serverTime
        }

        for (let i = 0; i < timeNodes.length; i++) {
          let timeNode = timeNodes[i]
          this.finalRes += "{" + "ProgressName: " + timeNode.progressName + ", startTime: " + timeNode.startTime + ", persistTime: " + timeNode.persistTime + "}\n"
        }

        console.log(progresses)
        console.log(timeNodes)

        function createTimeNode() {
          if (timeNodes.length == 0 || timeNodes[timeNodes.length - 1].progressName != activeProgress.progressName) {
            timeNodes.push({
              progressName: activeProgress.progressName,
              startTime: currentSystemTime,
              persistTime: 1
            })
          }
          else {
            timeNodes[timeNodes.length - 1].persistTime++
          }
        }

        function chooseProgress() {
          for (let i = 0; i < progresses.length; i++) {
            let returnProgress = null
            let _progress = progresses[i]
            if (currentSystemTime == _progress.arriveTime) {
              if (returnProgress == null) {
                returnProgress = _progress
              }
              awaitProgresses.push(_progress)

            }
          }
        }

      },



    },
    computed: {
      averageTime () {
        let sum = 0
        for (let i = 0; i < this.existProgress.length; sum += this.existProgress[i++].awaitTime);
        return sum / this.existProgress.length
      },
    }
  }
</script>

<style scoped>

  .progress-item-wrapper {
    margin: 1rem;
  }


</style>
