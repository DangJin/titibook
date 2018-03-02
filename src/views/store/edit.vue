<template>
  <div id="add-store">
    <div class="title"><i class="el-icon-arrow-left"></i> 修改门店</div>
    <el-steps :active="active.step" finish-status="success" align-center>
      <el-step title="修改基本信息" icon="el-icon-edit"></el-step>
      <el-step title="修改地理位置" icon="el-icon-upload"></el-step>
      <el-step title="修改店铺图片" icon="el-icon-picture"></el-step>
    </el-steps>
    <div class="content">
      <div class="baseInfo" v-if="active.content === 1">
        <el-form label-position="right" label-width="100px" :model="addData" :rules="rules">
          <el-form-item label="名称" prop="stoname">
            <el-input v-model="addData.stoname"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="addData.description"></el-input>
          </el-form-item>
          <el-form-item label="门店等级">
            <el-select v-model="addData.level" placeholder="请选择门店等级" style="float: left">
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置">
            <v-distpicker :province="addData.province" :city="addData.city" :area="addData.county"
                          @selected="handleDisPicker"></v-distpicker>
          </el-form-item>
          <el-form-item label="详细地址" prop="decription">
            <el-input v-model="addData.address"></el-input>
          </el-form-item>
          <el-form-item label="是否为直营店" prop="isdirect">
            <el-radio-group v-model="addData.isdirect">
              <el-radio :label="0">直营店</el-radio>
              <el-radio :label="1">加盟店</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="addLocation" v-if="active.content === 2">
        <div class="amap">
          <el-amap-search-box class="search-box" :search-option="map.searchOption"
                              :on-search-result="onSearchResult"></el-amap-search-box>
          <el-amap vid="location" :center="map.mapCenter" :zoom="12">
            <el-amap-marker v-for="(marker,index) in map.markers" :position="marker.position" :events="marker.events"
                            :key="index"></el-amap-marker>
          </el-amap>
        </div>
      </div>
      <div class="uploadPic" v-if="active.content === 3">
        <div class="upload">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="next">
      <el-button type="primary" @click="back" v-show="button.back.show">上一步</el-button>
      <el-button type="primary" @click="next" :disabled="button.next.disable">{{button.next.text}}</el-button>
    </div>
  </div>
</template>

<script>
  import { storeList, uppStore } from '../../api/store'
  import { stolevelList } from '../../api/store/config'
  import VDistpicker from 'v-distpicker'

  export default {
    name: 'add-store',
    components: {VDistpicker},
    data () {
      return {
        rules: {
          stoname: [
            {required: true, message: '请输入门店名称', trigger: 'blur'}
          ]
        },
        active: {
          step: 0,
          content: 1
        },
        button: {
          next: {
            text: '下一步',
            disable: false
          },
          back: {
            show: false
          }
        },
        addData: {
          stoname: '',
          province: '',
          level: '',
          city: '',
          county: '',
          longitude: '',
          latitude: '',
          isdirect: '1',
          address: '',
          description: '',
          imgs: ''
        },
        storeList: [],
        map: {
          markers: [],
          searchOption: {
            city: '',
            citylimit: false
          },
          mapCenter: [116.407417, 39.904172]
        }
      }
    },
    created () {
      // 获取url 参数
      let stoId = this.$route.query.stoId
      storeList({id: stoId}).then(response => {
        if (response.value) {
          let orgData = response.data.data.data[0]
          this.addData = {
            stoId: stoId,
            province: orgData.province,
            city: orgData.city,
            county: orgData.county,
            longitude: orgData.longitude,
            latitude: orgData.latitude,
            address: orgData.address,
            description: orgData.description,
            stoname: orgData.stoname,
            imgs: orgData.imgs,
            isdirect: orgData.isdirect
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data.message
          })
          this.button.back.show = true
        }
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: error.msg
        })
      })

      // 获取门店等级
      stolevelList({page: 1, limit: 100}).then(response => {
        if (response.value) {
          this.storeList = response.data.data.data
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data.message
          })
        }
      }).catch(e => {
        throw new Error(e)
      })
    },
    methods: {
      /**
       * 下一步
       */
      next () {
        ++this.active.step
        this.active.content = this.active.step + 1
        if (this.active.step === 3) {
          // 添加店铺
          this.$store.dispatch('getCsrf').then(() => {
            uppStore(this.addData).then(
              r => {
                if (r.data.value) {
                  this.$notify({
                    title: '成功',
                    message: r.data.data.message + '3秒后跳转',
                    type: 'success'
                  })
                  setTimeout(_ => {
                    this.$router.push({path: '/index/store'})
                  }, 3000)
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: r.data.data.message
                  })
                }
              }
            ).catch(
              e => {
                throw new Error('店铺添加=>' + e)
              }
            )
          }).catch(
            e => {
              throw new Error('获取表单令牌=>' + e)
            }
          )
          this.active.step = 3
          this.button.next.text = '完成'
          this.button.next.disable = true
          this.button.back.show = false
        } else {
          this.button.back.show = true
        }
      },
      /**
       * 上一步
       */
      back () {
        this.active.content = this.active.step
        this.active.step--
        if (this.active.step < 0) {
          this.active.step = 0
        }
        if (this.active.step === 0) {
          this.button.back.show = false
        }
        if (this.active.step < 3) {
          this.button.next.text = '下一步'
          this.button.next.disable = false
        }
      },
      /**
       * 搜索结果
       * @param pois
       */
      onSearchResult (pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi
            lngSum += lng
            latSum += lat
            this.map.markers.push({
              position: [poi.lng, poi.lat],
              events: {
                click: (e) => {
                  this.$confirm('确定标记此处?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let lng = e.lnglat.lng
                    let lat = e.lnglat.lat
                    this.map.center = [lng, lat]
                    this.addData.latitude = lat
                    this.addData.longitude = lng
                    this.$message({
                      type: 'success',
                      message: '标记成功!'
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '标记失败'
                    })
                  })
                },
                dragend: (e) => {
                  this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
                }
              }
            })
            console.log(this.map)
          })
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          }
          this.map.mapCenter = [center.lng, center.lat]
        }
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview (file) {
      },
      /**
       * 地址选择
       * @param data
       */
      handleDisPicker (data) {
        this.addData.province = data.province.value
        this.addData.city = data.city.value
        this.addData.county = data.area.value
      }
    }
  }
</script>

<style lang="scss">
  #add-store {
    float: left;
    height: auto;
    padding: 0 15px;
    width: calc(100% - 30px);
    background-color: white;
    .title {
      float: left;
      font-size: 18px;
      line-height: 45px;
      font-family: "Microsoft YaHei";
    }
    .el-steps {
      float: left;
      width: 100%;
      margin-top: 50px;
    }
    .content {
      float: left;
      width: 100%;
      height: auto;
      .baseInfo {
        float: left;
        width: 100%;
        text-align: center;
        .el-form {
          margin-top: 40px;
          width: 500px;
          display: inline-block;
          .distpicker-address-wrapper {
            line-height: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            select {
              flex-grow: 1;
              max-width: 33.3%;
              line-height: 20px;
              font-size: 14px;
              &:nth-last-of-type(2) {
                margin: 0 10px;
              }
            }
          }
        }
      }
      .addLocation {
        float: left;
        width: 100%;
        height: auto;
        text-align: center;
        .amap {
          display: inline-block;
          width: 70%;
          height: 500px;
          .search-box {
            top: 50px;
            left: 20px;
          }
        }
      }
      .uploadPic {
        float: left;
        width: 100%;
        height: auto;
        text-align: center;
        .upload {
          display: inline-block;
          width: 70%;
          height: 500px;
        }
      }
    }
    .next {
      float: left;
      width: 100%;
      margin-top: 20px;
      text-align: center;
      .el-button {
        display: inline-block;
      }
    }
  }
</style>
