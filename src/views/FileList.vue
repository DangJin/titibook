<template>
  <div class="index">
    <div class="file_list-top">
      <a href="javascript:void(0)" class="uploadFile"><label for="uploadFile"><img src="../assets/images/update.png"
                                                                                   alt="">上传</label></a>
      <input type="file" id="uploadFile">
      <a href="javascript:void(0)" class="addFile" v-on:click="AddFile"><img src="../assets/images/download.png" alt="">新建文件夹</a>
      <div class="file_Arrangement" v-on:click="ChangePailie">
        <img v-if="isPailie === 1" src="../assets/images/pailie2.png" alt="">
        <img v-else="isPailie === -1" src="../assets/images/pailie1.png" alt="">
      </div>
      <div class="file_sort">
        <img src="../assets/images/paixu.png" alt="">
        <ul>
          <li class="active">文件名</li>
          <li>大小</li>
          <li>修改日期</li>
        </ul>
      </div>
      <el-input placeholder="搜索您的文件" prefix-icon="el-icon-search" class="file_search"></el-input>
    </div>
    <div v-bind:class="{ file_list: Class.show, list: (isPailie === -1) }" v-on:mousedown="MouseDown"
         v-on:mousemove="MouseOver" v-on:mouseup="MouseUp"
         v-on:click="MouseClick">
      <div class="file_item" v-for="item in FileItems" v-on:mouseup="FileMouseUp">
        <img src="../assets/images/wenjianjia.png" alt="">
        <span>✔</span>
        <p>{{item.title}}</p>
      </div>
    </div>
    <div v-bind:class="{ mouseModel: Class.show, active: Class.isMouseModelShow }" id="mouseModel">
      <ul>
        <li v-for="item in ModelMenuList" v-on:click="ModelMenuClick" :data-method="item.menuMethods">
          {{ item.menuName }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    data () {
      return {
        isDown: '0',
        DownX: '',
        DownY: '',
        isPailie: 1,
        ThisFileItems: '',
        Class: {
          show: true,
          isMouseModelShow: false
        },
        ModelMenuList: [
          {menuName: '打开', menuMethods: 'openNew'},
          {menuName: '重命名', menuMethods: 'MenuUpdateName'},
          {menuName: '删除', menuMethods: 'DeleteFile'}
        ],
        FileItems: [
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          },
          {
            title: '电影、电视剧'
          }
        ]
      }
    },
    methods: {
//      页面点击
      MouseClick: function () {
        this.Class.isMouseModelShow = false
      },

//     新建文件夹
      AddFile: function () {
        var that = this
        var NewItem = $('<div class="file_item" v-for="item in FileItems" v-on:mouseup="FileMouseUp">' +
          '<img src="../assets/images/wenjianjia.png" alt=""><span>✔</span><input type="text" value="新建文件夹" onfocus="this.select()" autofocus></div>')
        NewItem.find('input').on('keypress', function (event) {
          if (event.keyCode === 13) {
            var fileName2 = NewItem.find('input').val()
            var fileNameP = $('<p>' + fileName2 + '</p>')
            NewItem.find('input').remove()
            NewItem.append(fileNameP)
          }
        })
        NewItem.find('input').blur(function () {
          var fileName2 = NewItem.find('input').val()
          var fileNameP = $('<p>' + fileName2 + '</p>')
          NewItem.find('input').remove()
          NewItem.append(fileNameP)
        })
        NewItem.mouseup(function () {
          console.log(11)
          that.FileMouseUp(event)
        })
        $('.file_list').append(NewItem)
      },
//      页面鼠标按下
      MouseDown: function (event) {
        if (event.button === 0) {
          this.isDown = 1
          this.DownX = event.clientX
          this.DownY = event.clientY
          $('.index_bg').remove()
          var Div = $('<div class="index_bg"></div>')
          $('.file_list').append(Div)
        }
      },
//      页面鼠标移动
      MouseOver: function (event) {
        if (this.isDown === 1) {
          var that = this
//          第一象限
          if ((event.clientX > this.DownX) && (event.clientY < this.DownY)) {
            $('.index_bg').css({
              'width': event.clientX - this.DownX,
              'height': this.DownY - event.clientY,
              'top': event.clientY,
              'left': this.DownX
            })
            if ($('.file_item').length !== 0) {
              $('.file_item').each(function () {
                if (($(this)[0].offsetLeft + $(this)[0].offsetWidth > that.DownX) &&
                  ($(this)[0].offsetLeft < event.clientX) &&
                  ($(this)[0].offsetTop < that.DownY) &&
                  ($(this)[0].offsetTop + $(this)[0].offsetHeight > event.clientY)) {
                  $(this).addClass('active')
                } else {
                  $(this).removeClass('active')
                }
              })
            }
//          第二象限
          } else if ((event.clientX < this.DownX) && (event.clientY < this.DownY)) {
            $('.index_bg').css({
              'width': this.DownX - event.clientX,
              'height': this.DownY - event.clientY,
              'top': event.clientY,
              'left': event.clientX
            })
            if ($('.file_item').length !== 0) {
              $('.file_item').each(function () {
                if (($(this)[0].offsetLeft + $(this)[0].offsetWidth > event.clientX) &&
                  ($(this)[0].offsetLeft < that.DownX) &&
                  ($(this)[0].offsetTop < that.DownY) &&
                  ($(this)[0].offsetTop + $(this)[0].offsetHeight > event.clientY)) {
                  $(this).addClass('active')
                } else {
                  $(this).removeClass('active')
                }
              })
            }
//          第三象限
          } else if ((event.clientX < this.DownX) && (event.clientY > this.DownY)) {
            $('.index_bg').css({
              'width': this.DownX - event.clientX,
              'height': event.clientY - this.DownY,
              'top': this.DownY,
              'left': event.clientX
            })
            if ($('.file_item').length !== 0) {
              $('.file_item').each(function () {
                if (($(this)[0].offsetLeft + $(this)[0].offsetWidth > event.clientX) &&
                  ($(this)[0].offsetLeft < that.DownX) &&
                  ($(this)[0].offsetTop < event.clientY) &&
                  ($(this)[0].offsetTop + $(this)[0].offsetHeight > that.DownY)) {
                  $(this).addClass('active')
                } else {
                  $(this).removeClass('active')
                }
              })
            }
//          第四象限
          } else {
            $('.index_bg').css({
              'width': event.clientX - this.DownX,
              'height': event.clientY - this.DownY,
              'top': this.DownY,
              'left': this.DownX
            })
            if ($('.file_item').length !== 0) {
              $('.file_item').each(function () {
                if (($(this)[0].offsetLeft + $(this)[0].offsetWidth > that.DownX) &&
                  ($(this)[0].offsetLeft < event.clientX) &&
                  ($(this)[0].offsetTop < event.clientY) &&
                  ($(this)[0].offsetTop + $(this)[0].offsetHeight > that.DownY)) {
                  $(this).addClass('active')
                } else {
                  $(this).removeClass('active')
                }
              })
            }
          }
        }
      },
//      页面鼠标松开
      MouseUp: function (event) {
        this.isDown = 0
        this.ThisFileItems = $('.file_item.active')
        $('.index_bg').remove()
      },
//      文件鼠标松开
      FileMouseUp: function (event) {
        this.ThisFileItems = $('.file_item.active')
        $('.index_bg').remove()
        if ($(event.currentTarget).attr('class') !== 'file_item active') {
          $('.file_item').removeClass('active')
          $(event.currentTarget).addClass('active')
        }
        if (event.button === 2) {
          this.Class.isMouseModelShow = true
          $('.mouseModel').css({
            top: event.clientY,
            left: event.clientX
          })
          $('.mouseModel>ul>li').removeClass('disabled')
          if (this.ThisFileItems.length > 1) {
            $('.mouseModel>ul>li').each(function () {
              if ($(this).data('method') === 'MenuUpdateName') {
                $(this).addClass('disabled')
              }
            })
          }
        }
      },
//      右键菜单点击
      ModelMenuClick: function (event) {
        this.Class.isMouseModelShow = false
        var ThisFile = $(this.ThisFileItems[0])
        console.log(this.ThisFileItems)
//        点击重命名
        if ($(event.currentTarget).data('method') === 'MenuUpdateName') {
          var fileName = ThisFile.find('p').text()
          var fileNameInput = $('<input type="text" value="' + fileName + '" onfocus="this.select()" autofocus>')
          fileNameInput.on('keypress', function (event) {
            if (event.keyCode === 13) {
              var fileName2 = fileNameInput.val()
              var fileNameP = $('<p>' + fileName2 + '</p>')
              ThisFile.find('input').remove()
              ThisFile.append(fileNameP)
            }
          })
          fileNameInput.blur(function () {
            var fileName2 = fileNameInput.val()
            var fileNameP = $('<p>' + fileName2 + '</p>')
            ThisFile.find('input').remove()
            ThisFile.append(fileNameP)
          })
          ThisFile.find('p').remove()
          ThisFile.append(fileNameInput)
//        点击删除
        } else if ($(event.currentTarget).data('method') === 'DeleteFile') {
          $('.file_item.active').remove()
        }
      },
//      右键菜单功能--打开
      openNew: function () {
        console.log('111opennew')
      },
//      切换文件排列方式
      ChangePailie: function () {
        this.isPailie = -this.isPailie
      }
    },
    mounted: function () {
      document.body.onselectstart = document.body.oncontextmenu = function () { return false }
      $('.index').css('min-height', document.documentElement.clientHeight)
      console.log($(this))
    }
  }
</script>
<style>
  .index {
    position: relative;
    width: 100%;
  }

  .index_bg {
    position: absolute;
    background-color: rgba(130, 210, 255, 0.5);
  }

  .file_list-top {
    float: left;
    width: 100%;
    padding: 10px 15px;
  }

  #uploadFile {
    display: none;
  }

  .uploadFile {
    float: left;
    width: 95px;
    height: 34px;
    color: #fff;
    font-size: 14px;
    line-height: 34px;
    text-align: left;
    border-radius: 4px;
    background-color: rgb(60, 140, 255);
  }

  .uploadFile img {
    float: left;
    width: 18px;
    margin: 7px 12px;
  }

  .uploadFile:hover {
    background-color: rgb(75, 150, 255);
  }

  .addFile {
    float: left;
    width: 125px;
    height: 34px;
    margin-left: 12px;
    color: rgb(60, 140, 255);
    font-size: 14px;
    line-height: 32px;
    border-radius: 4px;
    text-align: left;
    background-color: #fff;
    border: solid 1px rgba(90, 170, 255, 0.8);
  }

  .addFile img {
    float: left;
    width: 18px;
    margin: 7px 5px 7px 10px;
  }

  .addFile:hover {
    color: rgb(75, 170, 255);
  }

  .file_search {
    float: right;
    width: 190px;
    height: 34px;
    padding: 0;
    margin-right: 5px;
    color: #666;
    border-radius: 30px;
    background-color: rgb(240, 240, 240);
  }

  .file_search input {
    height: 34px;
    border-radius: 20px;
    background-color: rgb(240, 240, 240);
  }

  .file_search i {
    line-height: 34px;
  }

  .file_sort {
    position: relative;
    float: right;
    width: 38px;
    height: 34px;
    text-align: center;
  }

  .file_sort > img {
    width: 22px;
    margin-top: 6px;
  }

  .file_sort ul {
    position: absolute;
    display: none;
    width: 120px;
    right: 0;
    margin: 0;
    padding: 0;
    border-radius: 8px;
    background-color: #fff;
    border: solid 1px rgba(66, 129, 244, 0.5);
    z-index: 999;
  }

  .file_sort ul li {
    position: relative;
    float: left;
    width: 100%;
    height: 32px;
    color: rgb(60, 140, 255);
    line-height: 32px;
    font-size: 14px;
  }

  .file_sort ul li:hover {
    background-color: rgba(66, 129, 244, 0.1);
  }

  .file_sort:hover ul {
    display: block;
  }

  .file_sort ul li.active:before {
    position: absolute;
    content: '✔';
    left: 12px;
    font-size: 14px;
    color: rgb(60, 140, 255);
  }

  .file_Arrangement {
    float: right;
    width: 50px;
    height: 34px;
    text-align: center;
  }

  .file_Arrangement > img {
    width: 22px;
    margin-top: 6px;
  }

  .file_list {
    float: left;
    width: 100%;
    height: 100%;
    padding: 10px 5px;
    box-sizing: border-box;
  }

  .file_item {
    position: relative;
    float: left;
    width: 120px;
    height: 128px;
    margin: 3px;
    text-align: center;
    border-radius: 5px;
    border: solid 1px #fff;
  }

  .file_item:hover {
    border: solid 1px rgba(130, 210, 255, 0.2);
    background-color: rgba(130, 210, 255, 0.2);
  }

  .file_item:hover span {
    display: inline-block;
    background-color: rgba(59, 140, 255, 0.4);
  }

  .file_item.active {
    background-color: rgba(130, 210, 255, 0.3);
    border: solid 1px rgba(66, 129, 244, 0.6);
  }

  .file_item.active span {
    display: inline-block;
    background-color: rgba(59, 140, 255, 0.9) !important;
  }

  .file_item img {
    width: 56px;
    margin-top: 22px;
    image-rendering: pixelated;
  }

  .file_item span {
    position: absolute;
    display: none;
    width: 20px;
    height: 20px;
    top: 8px;
    left: 8px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    border-radius: 50%;
  }

  .file_item p {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    bottom: 10px;
    margin: 0;
    line-height: 30px;
    font-size: 14px;
  }

  .file_item input {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    bottom: 10px;
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border: none;
    background: none;
  }

  .file_list.list .file_item {
    position: relative;
    float: left;
    width: 100%;
    height: 46px;
    margin: 0;
    border-radius: 0;
    border-bottom: solid 1px #f7f7f7;
  }

  .file_list.list .file_item:hover {
    border: solid 1px rgba(130, 210, 255, 0.2);
    background-color: rgba(130, 210, 255, 0.2);
  }

  .file_list.list .file_item:hover span {
    display: inline-block;
    background-color: rgba(59, 140, 255, 0.4);
  }

  .file_list.list .file_item.active {
    background-color: rgba(130, 210, 255, 0.3);
    border: solid 1px rgba(66, 129, 244, 0.3) !important;
  }

  .file_list.list .file_item.active span {
    display: inline-block;
    background-color: rgba(59, 140, 255, 0.8) !important;
  }

  .file_list.list .file_item img {
    float: left;
    width: 26px;
    margin: 8px 0 8px 50px;
  }

  .file_list.list .file_item p {
    position: relative;
    float: left;
    width: unset;
    height: 46px;
    bottom: 0;
    margin-left: 15px;
    line-height: 46px;
    font-size: 14px;
  }

  .file_list.list .file_item input {
    position: relative;
    float: left;
    width: unset;
    height: 44px;
    margin: 0;
    padding: 0;
    bottom: 0;
    margin-left: 15px;
    line-height: 46px;
    font-size: 14px;
    text-align: left;
    border: none;
    background: none;
  }

  .mouseModel {
    display: none;
    position: absolute;
    width: 120px;
    padding: 2px 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 5px #999;
  }

  .mouseModel.active {
    display: block;
  }

  .mouseModel ul {
    float: left;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .mouseModel ul li {
    float: left;
    width: calc(100% - 44px);
    height: 30px;
    padding: 0 22px;
    list-style: none;
    font-size: 14px;
    text-align: left;
    line-height: 30px;
  }

  .mouseModel ul li.disabled {
    pointer-events: none;
    color: #bbb;
  }

  .mouseModel ul li:hover {
    color: #fff;
    background-color: rgb(66, 129, 244);
  }

</style>
