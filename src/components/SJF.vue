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
          awaitTime: -1
        },
        resultProgresses: [],
        results: "",
        finalRes: ""
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
      delProgress (index, row) {
        this.existProgress.splice(index, 1)
      },
      initData () {
        this.existProgress.push({
          progressName: "p1",
          arriveTime: parseInt(1),
          serverTime: parseInt(8),
          restTime: parseInt(8),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        }),
          this.existProgress.push({
            progressName: "p2",
            arriveTime: parseInt(2),
            serverTime: parseInt(4),
            restTime: parseInt(4),
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1
          }),
        this.existProgress.push({
          progressName: "p3",
          arriveTime: parseInt(3),
          serverTime: parseInt(9),
          restTime: parseInt(9),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        }),
        this.existProgress.push({
          progressName: "p4",
          arriveTime: parseInt(4),
          serverTime: parseInt(5),
          restTime: parseInt(5),
          finished: false,
          startTime: -1,
          finishTime: -1,
          awaitTime: -1
        })
      },
      calculate () {
        // 当前系统时间
        let currentSystemTime = 1
        let progresses = []
        for (let i = 0; i < this.existProgress.length; i++) {
          let progress = this.existProgress[i]
          progresses.push({
            progressName: progress.progressName,
            arriveTime: progress.arriveTime,
            serverTime: progress.serverTime,
            restTime: progress.serverTime,
            finished: false,
            startTime: -1,
            finishTime: -1,
            awaitTime: -1
          })
        }
        let awaitProgresses = []        // 当前时间在运行或等待的进程
        let activeProgress = null       // 当前正在执行的进程
        let finishedProgresses = []     // 已结束的进程
        let resultProgresses = []       // 结果时间片集合


        while (progresses.length > 0 || awaitProgresses.length > 0) {
          // 进程执行一个单位时间
          if (activeProgress != null) {
            activeProgress.restTime--
            this.results += "当前进行进程为： " + activeProgress.progressName + "当前是系统时间为： " + currentSystemTime + " 剩余时间为： " +activeProgress.restTime + "\n"
            // 整合时间点
            createTimeNode(activeProgress)
            if (activeProgress.restTime == 0) {
              awaitProgresses.splice(awaitProgresses.indexOf(activeProgress), 1)
              finishedProgresses.push(activeProgress)
              this.results += "进程 " + activeProgress.progressName + " 完成\n"
              activeProgress = null
            }

          }
          // 找出接下来一个单位时间里需要激活的进程
          let minTime = activeProgress == null ? -1 : activeProgress.restTime
          for (let i = 0; i < progresses.length; i++) {
            let progress = progresses[i]
            if (currentSystemTime == progress.arriveTime) {
              progresses.splice(progresses.indexOf(progress), 1)
              awaitProgresses.push(progress)
              if (minTime == -1 || minTime > progress.restTime) {
                minTime = progress.restTime
                activeProgress = progress
              }
            }
          }
          for (let i = 0; i <awaitProgresses.length; i++) {
            let progress = awaitProgresses[i]
            if (minTime == -1 || minTime > progress.restTime || (minTime == progress.restTime && progress.arriveTime < activeProgress.arriveTime)) {
              minTime = progress.restTime
              activeProgress = progress
            }
          }
          currentSystemTime++
        }

        let existProgresses = this.existProgress


        operateTime(finishedProgresses, resultProgresses)



        console.log("完成后的集合")
        for (let i = 0; i < finishedProgresses.length; i++) {
          let progress = finishedProgresses[i]
          console.log(progress)
        }

        console.log("完成后的时间片")
        for (let i = 0; i < resultProgresses.length; i++) {
          let timeNode = resultProgresses[i]
          this.finalRes += "{" + "progressName: " + timeNode.progressName + ", startTime: " + timeNode.startTime + ", persistTime: " + timeNode.persistTime + "}\n"

          console.log(timeNode)
        }




        function createTimeNode (progress) {
          if (resultProgresses.length == 0 || resultProgresses[resultProgresses.length - 1].progressName != progress.progressName) {
            let node = {
              progressName: progress.progressName,
              startTime: currentSystemTime - 1,
              persistTime: 1
            }
            progress.startTime = node.startTime
            resultProgresses.push(node)
          }
          else
            resultProgresses[resultProgresses.length - 1].persistTime++
        }


        // 计算每个进程的时间点
        function operateTime (progresses, results) {
          for (let i = 0; i < progresses.length; i++) {
            let progress = progresses[i]
            let timeNode = getTimeNode(progress, results)
            progress.startTime = timeNode.startTime
            progress.finishTime = timeNode.finishTime
            progress.awaitTime = progress.finishTime - progress.arriveTime - progress.serverTime
            for (let j = 0; j < existProgresses.length; j++) {
              let _progress = existProgresses[j]
              if (_progress.progressName == progress.progressName) {
                _progress.startTime = progress.startTime
                _progress.finishTime = progress.finishTime
                _progress.awaitTime = progress.awaitTime
              }

            }
          }
        }


        // 获取该进程开始时间和结束时间
        function getTimeNode(progress, results) {
          let name = progress.progressName
          let startTime = null
          let finishedTime = null
          for (let i = 0; i < results.length; i++) {
            let timeNode = results[i]
            if (timeNode.progressName == name) {
              finishedTime = timeNode.startTime + timeNode.persistTime
              if (startTime == null)
                startTime = timeNode.startTime
            }
          }
          return {
            startTime: startTime,
            finishTime: finishedTime
          }
        }
      },



      // 初始化
//      initData () {
//        this.operateProgress = []
//        this.resultProgresses = []
//        console.log(this.resultProgresses.length)
//        for (let i = 0; i < this.existProgress.length; i++) {
//          let progress = this.existProgress[i]
//          let _progress = new Object({
//            progressName: progress.progressName,
//            arriveTime: progress.arriveTime,
//            serverTime: progress.serverTime,
//            restTime: progress.serverTime,
//            finished: false,
//            startTime: -1,
//            finishTime: -1,
//            awaitTime: -1
//          })
//          this.operateProgress.push(_progress)
//        }
//      }
    },
    computed: {
      averageTime () {
        let sum = 0
        for (let i = 0; i < this.existProgress.length; sum += this.existProgress[i++].awaitTime);
        return sum / this.existProgress.length
      },
//      finalRes () {
//        let str = ""
//        for (let i = 0; i < this.finalResult.length; i++) {
//          let progress = this.finalResult[i].progressName
//          str += "{" + "progressName: " + progress.progressName + ", startTime: " + progress.startTime + ", persistTime: " + progress.persistTime + "}\n"
//        }
//        return str
//      }
    }
  }
</script>

<style scoped>

  .progress-item-wrapper {
    margin: 1rem;
  }


</style>
