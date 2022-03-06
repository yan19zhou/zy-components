<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-10-13 09:59:45
 * @Description: 隔离人员信息
 * @LastEditors: cqg
-->
<template>
  <div class="basic-form">
    <el-form ref="form" label-position="right" class="form-wrap preview-form" :model="formData">
      <el-form-item label="隔离点名称" prop="hotelName">
        <span>{{formData.hotelName}}</span>
      </el-form-item>
      <el-form-item label="房间号" prop="roomNum">
        <span>{{jdglHotelMoveInto.roomNum}}</span>
      </el-form-item>
       <el-form-item label="隔离开始时间" prop="isolateStartTime">
        <span>{{formData.isolateStartTime}}</span>
      </el-form-item>
      <el-form-item label="入住时间" prop="moveStartTime">
        <span>{{jdglHotelMoveInto.moveStartTime}}</span>
      </el-form-item>
      <el-form-item label="隔离天数" prop="moveDay">
        <span>{{jdglHotelMoveInto.moveDay}}</span>
      </el-form-item>
      <el-form-item label="隔离结束时间" prop="moveEndTime">
        <span>{{jdglHotelMoveInto.moveEndTime}}</span>
      </el-form-item>
      <div class="card-title full info-subtitle">基础信息</div>
      <el-form-item label="一码通面值" class="full" prop="daSourceId">{{formData.daSourceId}}</el-form-item>
      <el-form-item label="隔离人员类型" prop="dataSource">{{formData.personClassify | dict("person_classify")}}</el-form-item>
      <el-form-item label="姓名" prop="name">{{formData.name}}</el-form-item>
      <el-form-item label="性别" prop="gender">{{formData.gender | dict("gender") }}</el-form-item>
      <el-form-item label="出生日期" prop="name">{{formData.birthday}}</el-form-item>
      <el-form-item label="年龄" prop="age">{{formData.age && `${formData.age}（岁）`}}</el-form-item>
      <el-form-item label="国籍或地区" prop="nationArea">{{formData.nationArea}}</el-form-item>
      <!-- <el-form-item label="户籍地址" prop="residenceAddressText">{{formData.residenceAddressText}}</el-form-item> -->
      <el-form-item label="民族" prop="nation">{{formData.nation| dict("nation_type")}}</el-form-item>
      <el-form-item label="电话号码" prop="nation">{{formData.telPhone}}</el-form-item>
      <el-form-item label="证件类型" prop="cardType">{{formData.cardType | dict("card_type")}}</el-form-item>
      <el-form-item label="证件号码" prop="cardId">{{formData.cardId}}</el-form-item>
      <el-form-item label="居民身份证号" prop="identityCard">{{formData.identityCard}}</el-form-item>

      <el-form-item label="目的地" prop="destinationName">{{formData.destinationName}}</el-form-item>
      <el-form-item label="目的地详细地址" prop="destinationAddr">{{formData.destinationAddr}}</el-form-item>
      <el-form-item class="full" label="备注" prop="remark">{{formData.remark}}</el-form-item>
      <div class="card-title full">入境信息</div>
      <el-form-item label="来自所在国或地区" prop="comeCountryText">{{formData.comeCountryText}}</el-form-item>
      <el-form-item label="入境方式" prop="entryWay">{{formData.entryWay| dict("entry_way")}}</el-form-item>
      <el-form-item label="入境时间" prop="entryTime">{{formData.entryTime}}</el-form-item>
      <el-form-item label="入境口岸" prop="dataSource">{{formData.inboundPortName}}</el-form-item>
      <el-form-item label="航班（船班/车次）号" prop="flightNumber">{{formData.flightNumber}}</el-form-item>
      <el-form-item label="座位号" prop="seatNumber">{{formData.seatNumber}}</el-form-item>
      <el-form-item label="境外联系电话" prop="outlandsPhone">{{formData.outlandsPhone}}</el-form-item>
      <el-form-item label="中国境内地址" prop="enterAddressCode">{{formData.enterAddressText}}</el-form-item>
      <el-form-item label="中国境内详细地址" prop="enterAddress">{{formData.enterAddress}}</el-form-item>
      <div class="card-title full">紧急联系人</div>
      <el-form-item label="紧急联系人关系" prop="emergencyContactType">{{formData.emergencyContactType}}</el-form-item>
      <el-form-item label="紧急联系人姓名" prop="emergencyContactName">{{formData.emergencyContactName}}</el-form-item>
      <el-form-item label="紧急联系人电话" prop="emergencyContactPhone">{{formData.emergencyContactPhone}}</el-form-item>
      <el-form-item label="紧急联系人地址" prop="emergencyContactAddress">{{formData.emergencyContactAddress}}</el-form-item>
      <div class="card-title full">补充信息</div>

      <el-form-item label="是否留学生" prop="isOverStudent">{{formData.isOverStudent| dict("is_valid")}}</el-form-item>
      <el-form-item label="同行人数" prop="peerNumber">{{formData.peerNumber}}</el-form-item>
      <el-form-item label="户籍地址">
        {{formData.residenceAddressTexts}}
      </el-form-item>
      <el-form-item label="户籍详细地址" prop="residenceAddress">
        {{formData.residenceAddress}}
      </el-form-item>
      <el-form-item label="居住地址">
        {{formData.livingAddressTexts}}
      </el-form-item>
      <el-form-item label="居住详细地址" prop="livingAddress">
        {{formData.livingAddress}}
      </el-form-item>
      <el-form-item label="几房几厅几卫" prop="residenceBuilding">{{formData.residenceBuilding}}</el-form-item>
      <el-form-item label="居住人数" prop="livingNumber">{{formData.livingNumber}}</el-form-item>
      <el-form-item label="未持有身份证原因" prop="notHoldingCard">{{formData.notHoldingCard | dict("noIdcard_type")}}</el-form-item>
      <!-- <div class="card-title full">行程列表</div>
      <div class="full">
        <el-table :data="formData.routes" stripe style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="webCustomAddressOut" label="出发地" width="180">
            <template
              slot-scope="scope"
            >{{getAddr(scope.row.outAddrProvince, scope.row.outAddrCity)}}</template>
          </el-table-column>
          <el-table-column prop="outDate" label="出发时间" width="180"></el-table-column>
          <el-table-column prop="webCustomAddressGet" label="到达地">
            <template
              slot-scope="scope"
            >{{getAddr(scope.row.getAddrProvince, scope.row.getAddrCity)}}</template>
          </el-table-column>
          <el-table-column prop="getDate" label="到达时间"></el-table-column>
          <el-table-column prop="tripTrafficWay" label="出行交通方式">
            <template slot-scope="scope">{{scope.row. tripTrafficWay | dict("trip_traffic_way")}}</template>
          </el-table-column>
          <el-table-column prop="flightNumber" label="出行交通方式排号登记"></el-table-column>
        </el-table>
      </div>-->
    </el-form>
        <orgnaization-business :formData="formData" :isAdd="false" />
  </div>
</template>

<script>
import { getMemberInfo, getProvinceCity } from "../api/info";
import imageTpl from "./image-tpl.vue";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "userInfo",
  mixins: [mixinsId],
  components: {
    imageTpl,
  },
  props: {
    hotelName: String,
  },
  inject: ["personId"],
  data () {
    return {
      formData: {},
      jdglHotelMoveInto: {},
      addressList: [], //世界所有地址
      kosekiAddress: [], //户籍地址
      residentialAddress: [], //居住地址

    };
  },
  mounted () {
    this.queryData();
    /*     this.$bus.$on("previewInfoOpen", () => {
          this.queryData();
        }); */
  },
  methods: {
    async queryData () {
      let res = await getMemberInfo(this.personId());
      this.formData = res.data.data.jdglPersonInfo;
      this.jdglHotelMoveInto = res.data.data.jdglHotelMoveInto || {};
      // this.formData.hotelName = sessionStorage.getItem("hotelName");
      this._getContact(this.personId())
    },
    async getCity () {
      let res = await getProvinceCity();
      return res.data.data;
    },
    getAddr (Province, city) {
      if (!Province) return;
      let province_city_list = JSON.parse(
        localStorage.getItem("province_city_list")
      );
      province_city_list || (province_city_list = this.getCity());
      let str = "";
      str = this.getCitys(Province, city, province_city_list);
      return str;
    },
    getCitys (Province, city, list) {
      let str = "";
      for (let i = 0; i < list.length; i++) {
        const ele = list[i];
        if (ele.id === "000000") {
          for (const item of ele.children) {
            if (item.id == Province) {
              str = item.areaName;
              if (item.children.length && city) {
                for (const v of item.children) {
                  if (v.id == city) {
                    str += " | " + v.areaName;
                    return str;
                  }
                }
              }
            }
          }
        }
      }
      return str;
    },
    _getContact (pid) {
      // 获取联系人
      // getContact(pid).then((res) => {
      //   console.log(res);
      //   let data = res.data.data;
      //   // this.formData.emergencyContactType = data.emergencyContact1Type;
      //   // this.formData.emergencyContactPhone = data.emergencyContact1Phone;
      //   // this.formData.emergencyContactName = data.emergencyContact1Name;
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.userInfo {
}
</style>