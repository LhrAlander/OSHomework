var express = require('express');
const path = require('path');
var router = express.Router();
var fs = require('fs');
const multer  = require('multer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let uploadFolder = '/home/alander/code/OSHomework/OSServer/routes/uploads';
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名+时间轴
    cb(null, file.originalname);
  }
});

// let storage = multer.memoryStorage()
// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({ storage: storage }).any();


router.post('/file-upload', function (req, res) {
  console.log("body", req.body)

  upload(req, res, function (err) {
    //添加错误处理
    if (err) {
      console.log(err)
      return;
    }
    req.file = req.files[0];
    let buffer = req.file.buffer
    let tmp_path = req.file.path;
    console.log('====================================================');

    let firstPath = req.file.path
    console.log(firstPath)
    let copyPath = '/home/alander/code/OSHomework/test.txt'

    fs.readFile(firstPath, (err, data) => {
      if (err) throw err;
      fs.appendFile(copyPath, data)
      res.send({
        path: firstPath
      })
    })
  })
});

router.post('/delFile', (req, res) => {
  let path = req.body.path
  fs.unlink(path, err => {
    if (err) {
      console.log("err", err)
      res.send({
        code: 0
      })
    }
    else {
      console.log("success")
      res.send({
        code: 1
      })
    }
  })
})

module.exports = router;
