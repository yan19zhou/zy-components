<template>
  <div class="basic-from custom-disabled">
    <!-- <el-dialog
      custom-class="small-padding-dialog"
      :close-on-click-modal="false"
      title="流行病调查"
      width="70%"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      @close="handleClosed"
    >-->
    <div class="smallTitle full">基本信息</div>
    <div class="wrapper">
      <div>
        <span class="weight">姓名</span>
        {{ basicData.name }}
      </div>
      <div>
        <span class="weight">性别</span>
        {{ basicData.gender | dict("gender") }}
      </div>
      <div>
        <span class="weight">年龄</span>
        {{ basicData.age }}
      </div>
      <div>
        <span class="weight">电话</span>
        {{ basicData.telPhone }}
      </div>
      <div>
        <span class="weight">房号</span>
        {{ basicData.roomNum }}
      </div>
      <div>
        <span class="weight">证件类型</span>
        {{ basicData.cardType | dict("card_type") }}
      </div>
      <div>
        <span class="weight">证件号码</span>
        {{ basicData.cardId }}
      </div>
      <div>
        <span class="weight">出生日期</span>
        {{ basicData.birthday }}
      </div>
      <div>
        <span class="weight">居民身份证号:</span>
        {{ basicData.identityCard || "-" }}
      </div>
    </div>
    <div class="radio">
      <span class="weight">非内地居民身份证原因:</span>
      <el-radio-group :disabled="true" v-model="basicData.notHoldingCard">
        <el-radio label="1">1.其他</el-radio>
        <el-radio label="2">2.华人华侨</el-radio>
        <el-radio label="3">3.港澳台居民</el-radio>
        <el-radio label="4">4.外籍人数</el-radio>
        <el-radio label="5">5.未达到办理条件</el-radio>
        <el-radio label="6">6.身份被限制无法办理</el-radio>
      </el-radio-group>
    </div>
    <div class="radio">
      <span class="weight" style="width: 85px">隔离类型:</span>
      <el-radio-group :disabled="true" v-model="basicData.personClassify">
        <el-radio v-for="item in getDict('person_classify')" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        <el-input disabled style="width: 200px" v-if="basicData.personClassify == 7" v-model="basicData.personClassifyOther"></el-input>
      </el-radio-group>
    </div>
    <div class="wrapper">
      <div>
        <span class="weight">开始隔离日期</span>
        {{ basicData.moveStartTime }}
      </div>
      <div>
        <span class="weight">计划结束隔离日期</span>
        {{ basicData.moveEndTime }}
      </div>
    </div>
    <el-form ref="dataForm" :model="formData" :rules="rules" label-width="80px">
      <div class="smallTitle full">近14日旅居史(或入境信息)</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否本地隔离人员:" label-width="130px">
            <el-radio-group disabled v-model="formData.personFlowRegister.isLocalDiscovery">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.personFlowRegister.isLocalDiscovery == 1">
          <el-form-item label="是否中高风险来粤人员" label-width="230px">
            <el-radio-group disabled v-model="formData.personFlowRegister.isHighRiskPerson">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="formData.personFlowRegister.isLocalDiscovery == 1">
        <el-form-item label="来源类型">
          <el-radio-group v-model="formData.personFlowRegister.sourceType">
            <el-radio :label="item.value" v-for="item in getDict('source_type')" :key="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源地省">
              <!-- @change="changelyds" -->
              <el-cascader ref="cascader" v-model="fromProvinceCode" :options="destinatOptions" clearable :props="{ emitPath: true }" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过去14日旅行或居住省市" label-width="180px">
              <el-cascader disabled v-model="recentlyProvince" :options="ProvinceandCity" clearable :props="{ emitPath: true, value: 'label' }" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="formData.personFlowRegister.isLocalDiscovery == 0">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来自所在国或地区" label-width="125px">
              <el-cascader disabled v-model="formData.personFlowRegister.fromCountryCascadeList" :options="AreaCPC" filterable clearable :props="{ emitPath: true, value: 'label',checkStrictly:true }" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入境口岸">
              <el-select disabled v-model="formData.personFlowRegister.inboundPortId" placeholder="请选择入境口岸">
                <el-option v-for="(item, index) in source" :key="index" :label="item.name" :value="item.codePortId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="过去14日旅行或居住国家" label-width="170px">
              <el-cascader
                disabled
                v-model="
                    formData.personFlowRegister.recentlyCountryCascadeList
                  "
                :options="AreaCPC"
                filterable
                clearable
                :props="{ emitPath: true, value: 'label' }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地">
              <!-- @change="dstCitychange" -->
              <el-cascader ref="dstCitycascader" v-model="dstCity" disabled :options="ProvinceandCity" filterable clearable :props="{ emitPath: true, value: 'label' }" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="常住地址">
              <el-input disabled v-model="formData.personFlowRegister.address" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-form-item label="交通工具">
        <el-radio-group v-model="formData.personFlowRegister.trainType" disabled>
          <el-radio :label="item.value" v-for="item in getDict('trip_traffic_way')" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <el-input disabled v-if="formData.personFlowRegister.trainType == 7" style="width: 200px" v-model="formData.personFlowRegister.trainOther"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="航班(车次)号:" label-width="110px">
            <el-input disabled v-model="formData.personFlowRegister.trainNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="座位号:">
            <el-input disabled v-model="formData.personFlowRegister.seatNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="smallTitle full">近14天情况</div>
      <el-form-item label="近14天情况:" label-width="90px">
        <el-checkbox-group disabled v-model="formData.personFlowRegister.recentlyHealthStatusList">
          <el-checkbox
            v-for="item in getDict('RecentlyHealthStatus')"
            :key="item.value"
            :label="item.value"
            :disabled="
                formData.personFlowRegister.recentlyHealthStatusList.includes(
                  '7'
                ) && item.value !== '7'
              "
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="smallTitle full">流调体温&十大症状</div>
      <el-form-item label="体温:" prop="personFlowRegister.temperature" :rules="[
          { required: true, message: '体温不能为空!', trigger: 'hange'},
        ]">
        <el-radio-group v-model="formData.personFlowRegister.temperature" disabled>
          <el-radio v-for="item in getDict('temperature_type')" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="十大症状:">
        <el-checkbox-group v-model="formData.personFlowRegister.sdbzyjList" disabled>
          <el-checkbox
            v-for="item in getDict('symptoms')"
            :key="item.value"
            :label="item.value"
            :disabled="
                formData.personFlowRegister.sdbzyjList.includes('0') &&
                  item.value !== '0'
              "
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-if="formData.personFlowRegister.sdbzyjList.includes('11')" v-model="formData.personFlowRegister.sdbzejList">
          <el-checkbox
            v-for="item in getDict('second_symptoms')"
            :key="item.value"
            :label="item.value"
            :disabled="
                formData.personFlowRegister.sdbzejList.includes('11') &&
                  item.value !== '11'
              "
          >{{ item.label }}</el-checkbox>
          <el-input disabled v-if="formData.personFlowRegister.sdbzejList.includes('11')" v-model="formData.personFlowRegister.sdbzqt"></el-input>
        </el-checkbox-group>
      </el-form-item>
      <div class="smallTitle full">
        疫苗接种信息
        <!-- <el-button type="primary"  size="mini" style="float:right;" @click="vaccinEdit()">疫苗信息修改</el-button> -->
        <!-- <span>(医学观察-疫苗接种进行具体操作)</span> -->
      </div>
      <el-table :data="basicData.inoculationRecord" align="left" ref="table">
        <el-table-column prop="inoculationTime" label="接种时间" />
        <el-table-column prop="inoculationSite" label="接种地点" />
        <el-table-column prop="needleTimes" label="针次" />
        <el-table-column prop="vaccineName" label="疫苗名称" />
      </el-table>
      <p class="smallTitle">
        既往病史及健康情况
        <!-- <el-button type="primary" class="fr" @click="oneKeySelectAll"
            >一键全"无/否/没有"</el-button
        >-->
        <!-- <el-button type="primary" class="fr" @click="edit()">编辑</el-button> -->
      </p>
      <div>
        <div class="basic">
          <h4>基础疾病</h4>
          <ul>
            <li>
              <el-checkbox true-label="1" disabled false-label="0">无</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isHypertension">高血压</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isHyperglycemia">糖尿病</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isHyperlipidemia">高血脂</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isHeartDisease">心脏病</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isEpilepsy">癫痫病</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isMentalIllness">精神类疾病</el-checkbox>
              <el-input disabled v-if="formData.personHealth.isMentalIllness == '1'" v-model="formData.personHealth.mentalIllness"></el-input>
            </li>
            <li>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isBracket">有安装支架</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isBridging">有搭桥</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isKidneyDialysis">有肾透析</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isCancer">有癌症放化疗</el-checkbox>
            </li>
            <li>
              <span>慢性呼吸系统疾病:</span>
              <el-checkbox true-label="0" false-label="1" disabled v-model="formData.personHealth.isChronic">无</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isPulmonaryTuberculosis">肺结核</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isCopd">慢阻肺</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isEmphysema">肺气肿</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isAsthma">哮喘</el-checkbox>
              <el-checkbox true-label="1" false-label="0" disabled v-model="formData.personHealth.isOther">其他</el-checkbox>
              <el-input disabled v-if="formData.personHealth.isOther == '1'" v-model="formData.personHealth.isChronicOther"></el-input>
            </li>
          </ul>
        </div>
        <div class="basic">
          <h4>急症病史</h4>
          <el-checkbox-group v-model="formData.personHealth.jzbsList">
            <el-checkbox v-for="item in getDict('emergency')" :key="item.value" :label="item.value" disabled>{{ item.label }}</el-checkbox>
          </el-checkbox-group>
          <el-input disabled v-if="formData.personHealth.jzbsList.includes('5')" v-model="formData.personHealth.jzbsqt"></el-input>
        </div>
        <div class="basic">
          <h4 style="width: 260px">其他需要重点关注疾病或情况:</h4>
          <el-input disabled type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.personHealth.otherCondition"></el-input>
        </div>
        <div class="basic">
          <h4>服药史:</h4>
          <el-radio-group v-model="formData.personHealth.jbnfys" disabled>
            <el-radio label="0">无</el-radio>
            <el-radio label="1">有</el-radio>
          </el-radio-group>
          <div v-if="formData.personHealth.jbnfys == 1" style="margin-left: 10px;width:70%;display:flex;">
            <span>近半年服药史:</span>
            <el-input autosize disabled type="textarea" placeholder="请输入内容" v-model="formData.personHealth.jbnfyssm"></el-input>
          </div>
        </div>
        <div class="basic">
          <h4>携带何种药物:</h4>
          <el-radio-group v-model="formData.personHealth.xdhzyw" disabled>
            <el-radio label="0">无</el-radio>
            <el-radio label="1">有</el-radio>
          </el-radio-group>
          <div v-if="formData.personHealth.xdhzyw == 1" style="margin-left: 10px;width:70%;display:flex;">
            <span>携带何种药物:</span>
            <el-input autosize disabled type="textarea" placeholder="请输入内容" v-model="formData.personHealth.xdhzywsm"></el-input>
          </div>
        </div>
        <div class="basic">
          <h4 style="width: 80px">流行病史:</h4>
          <el-input type="textarea" :rows="2" disabled v-model="formData.personHealth.lxbxs"></el-input>
        </div>
      </div>
    </el-form>
    <!-- 业务经办公共组件 -->
    <!-- <orgnaization-business :formData="formData" isAdd class="mt20" titleFsz="20px" /> -->
    <!--疫苗修改  -->
    <hotelDialog v-bind="$attrs" ref="particulars" width="80%" @update="getPersonInfoData(personId)" />
  </div>
</template>

<script>
import {
  getProvinceCity,
  getDestination,
  getAreaCPC,
} from "@/views/yq-personnel/api/check.js";
import medical from "@/views/yq-personnel/components/medical/index.vue"; // 医学观察
import {
  isolateisolateId,
} from '@/views/yq-personnel/api/health.js';
import {
  getBasicInfo,
  getpersonFlow,
  savepersonFlow,
  getinboundPortName,
  getRecently,
} from "@/views/yq-personnel/api/medicalMonitor.js";
import hotelDialog from '@/views/yq-personnel/medicalMonitor/components/vaccination/dialog'; // 日常监测
export default {
  name: "register",
  inject: ["initList", 'row'],
  components: {
    medical,
    hotelDialog
  },
  mounted () {
    this.indexData = this.row();
    this.personId = this.row().personId;
    this.getProvinceCityData();
    this.getDestinationData();
    this.getAreaCPCData();
    this.getinboundPortNameData();
    this.getPersonInfoData(this.row().personId);
    this.getpersonFlowData(this.row().personId, this.row().daSourceId);
  },
  data () {
    return {
      indexData: {},
      AreaCPC: [],
      recentlyProvince: [],
      dstCity: [],
      fromProvinceCode: [],
      dialogVisible: false,
      basicData: {},
      source: [],
      nationCityOptions: [],
      destinatOptions: [],
      ProvinceandCity: [],
      formData: {
        personFlowRegister: {
          recentlyCountryCascadeList: [],
          fromCountryCascadeList: [],
          address: null,
          creapers: null,
          creatime: null,
          dstCity: null,
          dstProvince: null,
          flowRegisterId: null,
          fromAreaCn: null,
          fromAreaCode: null,
          fromCityCn: null,
          fromCityCode: null,
          fromCountry: null,
          fromProvinceCn: null,
          fromProvinceCode: null,
          inboundPortId: null,
          inboundPortName: null,
          isHighRiskPerson: null,
          isLocalDiscovery: null,
          moditime: null,
          personId: null,
          recentlyCity: null,
          recentlyHealthStatusList: [],
          recentlyProvince: null,
          sdbzej: null,
          sdbzejList: [],
          sdbzqt: null,
          sdbzyj: null,
          sdbzyjList: [],
          seatNumber: null,
          sourceType: null,
          temperature: '',
          trainNumber: null,
          trainOther: null,
          trainType: null,
        },
        personHealth: {
          isBasicDiseases: null,
          healthRegId: null,
          isAsthma: null,
          isBracket: null,
          isBridging: null,
          isCancer: null,
          isChronic: null,
          isChronicOther: null,
          isCopd: null,
          isEmphysema: null,
          isEpilepsy: null,
          isHeartDisease: null,
          isHyperglycemia: null,
          isHyperlipidemia: null,
          isHypertension: null,
          isKidneyDialysis: null,
          isMentalIllness: null,
          isOther: null,
          isPulmonaryTuberculosis: null,
          isolateId: null,
          jbnfys: null,
          jbnfyssm: null,
          jzbsList: [],
          jzbsqt: null,
          lxbxs: null,
          mentalIllness: null,
          otherCondition: null,
          personId: null,
          xdhzyw: null,
          xdhzywsm: null,
          ymdezcj: null,
          ymdezjzdd: null,
          ymdezjzjg: null,
          ymdezymmc: null,
          ymdszcj: null,
          ymdszjzdd: null,
          ymdszjzjg: null,
          ymdszymmc: null,
          ymdyzcj: null,
          ymdyzjzdd: null,
          ymdyzjzjg: null,
          ymdyzymmc: null,
          ymzs: null,
          ymzsdez: null,
          ymzsdezsf: null,
          ymzsdsz: null,
          ymzsdszsf: null,
          ymzsdyz: null,
          ymzsdyzsf: null,
        },
      },
      // 近14天情况
      condition: [
        {
          label: "曾接触新冠肺炎病例/疑似病例/无症状感染者",
          value: "0",
        },
        {
          label: "曾接触有发热或呼吸道症状的患者",
          value: "1",
        },
        {
          label: "居住的社区有曾报告有新冠肺炎病例",
          value: "2",
        },
        {
          label: "所在办公室/家庭等出现2人及以上有发热或呼吸道症状",
          value: "3",
        },
        {
          label: "曾服用过退烧药,感冒药,止咳药",
          value: "4",
        },
        {
          label: "曾接受新冠肺炎病毒检测,检测结果为阳性",
          value: "5",
        },
        {
          label: "有发热,咳嗽,腹泻等不适",
          value: "6",
        },
        {
          label: "以上均无",
          value: "7",
        },
      ],
      rules: {
        "personFlowRegister.temperature": [
          { required: true, message: "体温不能为空!", trigger: "blur" },
        ],
      },
    };
  },
  // watch: {
  //   // 基础疾病无
  //   "formData.personHealth.isBasicDiseases": {
  //     handler: function (newly, old) {
  //       if (newly == "1") {
  //         let textarr = [
  //           "isHypertension",
  //           "isHyperglycemia",
  //           "isHyperlipidemia",
  //           "isHeartDisease",
  //           "isEpilepsy",
  //           "isMentalIllness",
  //           "isBracket",
  //           "isBridging",
  //           "isKidneyDialysis",
  //           "isCancer",
  //         ].map((e) => {
  //           this.formData.personHealth[e] = "0";
  //         });
  //         this.formData.personHealth.mentalIllness = null;
  //       }
  //     },
  //   },
  //   // 近14日情况
  //   "formData.personFlowRegister.recentlyHealthStatusList": {
  //     handler: function (newly, old) {
  //       if (newly.includes("7") && newly.length > 1)
  //         this.formData.personFlowRegister.recentlyHealthStatusList = ["7"];
  //     },
  //     immediate: true,
  //   },
  //   // 十大症状第一集
  //   "formData.personFlowRegister.sdbzyjList": {
  //     handler: function (newly, old) {
  //       if (newly.includes("0") && newly.length > 1) {
  //         this.formData.personFlowRegister.sdbzyjList = ["0"];
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 十大症状第二集
  //   "formData.personFlowRegister.sdbzejList": {
  //     handler: function (newly, old) {
  //       if (newly.includes("11") && newly.length > 1)
  //         this.formData.personFlowRegister.sdbzejList = ["11"];
  //       if (!newly.includes("11"))
  //         this.formData.personFlowRegister.sdbzqt = null;
  //     },
  //     immediate: true,
  //   },
  //   // 交通工具
  //   "formData.personFlowRegister.trainType": {
  //     handler: function (newly, old) {
  //       if (newly !== "7") this.formData.personFlowRegister.trainOther = null;
  //     },
  //     immediate: true,
  //   },
  //   // 服药史
  //   "formData.personHealth.jbnfys": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         this.formData.personHealth.jbnfyssm = null;
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 携带何种药物
  //   "formData.personHealth.xdhzyw": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         this.formData.personHealth.xdhzywsm = null;
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 急症病史
  //   "formData.personHealth.jzbsList": {
  //     handler: function (newly, old) {
  //       if (newly.includes("0") && newly.length >= 2) {
  //         this.formData.personHealth.jzbsList = ["0"];
  //       }
  //       if (!newly.includes("5")) {
  //         this.formData.personHealth.jzbsqt = null;
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 慢性呼吸系统疾病
  //   "formData.personHealth.isChronic": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         let textArr = [
  //           "isPulmonaryTuberculosis",
  //           "isCopd",
  //           "isEmphysema",
  //           "isAsthma",
  //           "isOther",
  //         ].map((e) => {
  //           this.formData.personHealth[e] = "0";
  //         });
  //         this.formData.personHealth.isChronicOther = null;
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 疫苗接种信息
  //   "formData.personHealth.ymzsdyzsf": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         [
  //           this.formData.personHealth.ymzsdezsf,
  //           this.formData.personHealth.ymzsdszsf,
  //         ] = ["0", "0"];
  //         let textArr = [
  //           "ymzsdyz",
  //           "ymdyzjzdd",
  //           "ymdyzymmc",
  //           "ymdyzcj",
  //           "ymdyzjzjg",
  //           "ymzsdez",
  //           "ymdezjzdd",
  //           "ymdezymmc",
  //           "ymdezcj",
  //           "ymdezjzjg",
  //           "ymzsdsz",
  //           "ymdszjzdd",
  //           "ymdszymmc",
  //           "ymdszcj",
  //           "ymdszjzjg",
  //         ].map((e) => {
  //           this.formData.personHealth[e] = null;
  //         });
  //       }
  //     },
  //     immediate: true,
  //   },
  //   // 第二针
  //   "formData.personHealth.ymzsdezsf": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         this.formData.personHealth.ymzsdszsf = "0";
  //         let textArr = [
  //           "ymzsdez",
  //           "ymdezjzdd",
  //           "ymdezymmc",
  //           "ymdezcj",
  //           "ymdezjzjg",
  //           "ymzsdsz",
  //           "ymdszjzdd",
  //           "ymdszymmc",
  //           "ymdszcj",
  //           "ymdszjzjg",
  //         ].map((e) => {
  //           this.formData.personHealth[e] = null;
  //         });
  //       }
  //     },
  //     immediate: true,
  //   }, // 第三针
  //   "formData.personHealth.ymzsdszsf": {
  //     handler: function (newly, old) {
  //       if (newly == "0") {
  //         let textArr = [
  //           "ymzsdsz",
  //           "ymdszjzdd",
  //           "ymdszymmc",
  //           "ymdszcj",
  //           this.formData.personHealth.ymdszjzjg,
  //         ].map((e) => {
  //           this.formData.personHealth[e] = null;
  //         });
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  methods: {
    //修改疫苗信息
    async vaccinEdit () {
      const { data } = await isolateisolateId(this.personId);
      this.$refs.particulars.show(data.data);
    },
    // 既往病史及健康情况编辑按钮
    edit () {
      this.$emit("newly", { type: "jkpc", row: { ...this.indexData } });
    },
    // 判断非空
    judgeIsorNull () {
      let arr = 1;
      if (this.formData.personFlowRegister.isLocalDiscovery == 1) {
        if (
          this.fromProvinceCode.length == 0 ||
          this.recentlyProvince.length == 0 ||
          this.formData.personFlowRegister.isHighRiskPerson == null ||
          this.formData.personFlowRegister.sourceType == null
        ) {
          arr = 0;
        }
      } else {
        if (
          this.formData.personFlowRegister.fromCountryCascadeList == null ||
          this.formData.personFlowRegister.fromCountryCascadeList.length == 0 ||
          this.dstCity.length == 0 ||
          this.formData.personFlowRegister.inboundPortId == null ||
          this.formData.personFlowRegister.recentlyCountryCascadeList == null ||
          this.formData.personFlowRegister.recentlyCountryCascadeList.length ==
          0 ||
          this.formData.personFlowRegister.address == null
        ) {
          arr = 0;
        }
      }
      return arr;
    },
    // 获取目的地两级数据
    // dstCitychange () {
    //   let arr = this.$refs.dstCitycascader.getCheckedNodes();
    //   arr.forEach((item) => {
    //     [
    //       this.formData.personFlowRegister.dstProvince,
    //       this.formData.personFlowRegister.dstCity,
    //     ] = item.pathLabels;
    //   });
    // },
    // 来源地省 获取三中文 三code
    // changelyds (val) {
    //   let arr = this.$refs.cascader.getCheckedNodes();
    //   arr.forEach((item) => {
    //     [
    //       this.formData.personFlowRegister.fromProvinceCn,
    //       this.formData.personFlowRegister.fromCityCn,
    //       this.formData.personFlowRegister.fromAreaCn,
    //     ] = item.pathLabels;
    //     [
    //       this.formData.personFlowRegister.fromProvinceCode,
    //       this.formData.personFlowRegister.fromCityCode,
    //       this.formData.personFlowRegister.fromAreaCode,
    //     ] = item.path;
    //   });
    // },
    // 入境口岸数据
    async getinboundPortNameData () {
      let res = await getinboundPortName();
      this.source = res.data.data;
    },
    getOptionChildren (param) {
      if (!param || !param.length) return;
      param.forEach((e) => {
        if (e.children && e.children.length > 0) {
          this.getOptionChildren(e.children);
        } else {
          delete e.children;
        }
      });
      return param;
    },
    delArea (param) {
      if (!param || !param.length) return;
      param.forEach((e) => {
        if (e.levelFlag && e.levelFlag !== "2") {
          this.delArea(e.children);
        } else {
          delete e.children;
        }
      });
      return param;
    },
    // 国-省-市
    async getAreaCPCData () {
      let res = await getAreaCPC();
      if (res.data.code !== 0) return;
      this.AreaCPC = this.getOptionChildren(res.data.data);
    },
    // 国家省市区
    async getProvinceCityData () {
      let res = await getProvinceCity();
      this.nationCityOptions = this.getOptionChildren(res.data.data);
    },
    // 省市区
    async getDestinationData () {
      let res = await getDestination();
      this.destinatOptions = this.getOptionChildren(
        JSON.parse(JSON.stringify(res.data.data))
      );
      this.ProvinceandCity = this.delArea(
        JSON.parse(JSON.stringify(res.data.data))
      );
    },
    // 数据回显
    EchoData () {
      // 目的地
      this.dstCity = [
        this.formData.personFlowRegister.dstProvince,
        this.formData.personFlowRegister.dstCity,
      ];
      // 来源地省
      this.fromProvinceCode.push(
        this.formData.personFlowRegister.fromProvinceCode,
        this.formData.personFlowRegister.fromCityCode,
        this.formData.personFlowRegister.fromAreaCode
      );
      // 过去14日旅行或居住省市
      this.recentlyProvince.push(
        this.formData.personFlowRegister.recentlyProvince,
        this.formData.personFlowRegister.recentlyCity
      );
    },
    //提交数据赋值
    dataGive () {
      if (this.formData.personFlowRegister.isLocalDiscovery == "0") {
        let arr = this.source.filter((item) => {
          return (
            item.codePortId == this.formData.personFlowRegister.inboundPortId
          );
        });
        this.formData.personFlowRegister.inboundPortName = arr[0].name;
        //来自所在国或地区
        if (
          this.formData.personFlowRegister.fromCountryCascadeList.length > 1
        ) {
          this.formData.personFlowRegister.fromCountry = this.formData.personFlowRegister.fromCountryCascadeList[2];
        } else if (
          this.formData.personFlowRegister.fromCountryCascadeList.length == 1
        ) {
          this.formData.personFlowRegister.fromCountry = this.formData.personFlowRegister.fromCountryCascadeList[0];
        }
        // 过去14日国家 and 省市
        if (
          this.formData.personFlowRegister.recentlyCountryCascadeList.length > 1
        ) {
          this.formData.personFlowRegister.recentlyCountry = this.formData.personFlowRegister.recentlyCountryCascadeList[2];
        } else {
          // 过去14日国家
          this.formData.personFlowRegister.recentlyCountry = this.formData.personFlowRegister.recentlyCountryCascadeList[0];
        }
      } else {
        [
          this.formData.personFlowRegister.recentlyProvince,
          this.formData.personFlowRegister.recentlyCity,
        ] = this.recentlyProvince; // 过去14日旅行或居住省市
      }
      [
        this.formData.personFlowRegister.dstProvince,
        this.formData.personFlowRegister.dstCity,
      ] = this.dstCity; //目的地
      [
        this.formData.personFlowRegister.personId,
        this.formData.personHealth.personId,
      ] = [this.personId, this.personId]; //两个对象中personId赋值
    },
    submit (dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          let judgeIsorNull = this.judgeIsorNull();
          if (judgeIsorNull == 0)
            return this.$message.warning(
              "近14日旅居史(或入境信息)填写不能为空！"
            );
          this.dataGive();
          let params = this.formData;
          savepersonFlow(params).then((res) => {
            if (res.data.code == 1) return;
            this.$message.success(`提交成功!`);
            this.initList({ size: "10", current: 1 });
            this.handleClosed();
          });
        }
      });
    },
    // async show(data) {
    // this.indexData = data;
    // this.personId = data.personId;
    // this.getProvinceCityData();
    // this.getDestinationData();
    // this.getAreaCPCData();
    // this.getinboundPortNameData();
    // this.getPersonInfoData(data.personId);
    // this.getpersonFlowData(data.personId, data.daSourceId);
    // this.dialogVisible = true;
    // },
    //获取近14日旅居史信息与疫苗基础疾病等信息
    async getpersonFlowData (id, daSourceId) {
      let res = await getpersonFlow(id);
      if (res.data.code == 1) return;
      this.formData = res.data.data;
      if (this.formData.personFlowRegister.flowRegisterId == null) {
        this.getRecentlyData(id);
      }
      this.EchoData();
      if (
        this.basicData.isLocalPerson &&
        this.formData.personFlowRegister.isLocalDiscovery == null
      ) {
        this.formData.personFlowRegister.isLocalDiscovery = this.basicData.isLocalPerson;
      }
    },
    async getPersonInfoData (id) {
      let res = await getBasicInfo(id);
      if (res.data.code == 1) return;
      this.basicData = res.data.data;
      this.formData.personFlowRegister.isLocalDiscovery = this.basicData.isLocalPerson;
      let params = {
        idCard: this.basicData.cardId,
        personId: this.basicData.personId,
        personType: this.basicData.cardType,
        phone: this.basicData.telPhone,
        realName: this.basicData.name,
      };
    },
    //获取一码通信息接口
    async getRecentlyData (id) {
      let res = await getRecently(id);
      if (res.data.code !== 0) return;
      let arr = res.data.data;
      this.formData.personFlowRegister.fromCountryCascadeList =
        arr.comeCountryTextList;
      this.formData.personFlowRegister.address = arr.destinationAddr;
      this.formData.personFlowRegister.address = arr.destinationAddr;
      this.dstCity = arr.destinationNameList;
      this.formData.personFlowRegister.trainNumber = arr.flightNumber;
      this.formData.personFlowRegister.inboundPortId = arr.inboundPortId;
      this.formData.personFlowRegister.recentlyCountryCascadeList =
        arr.recentlyCountryList;
      this.formData.personFlowRegister.seatNumber = arr.seatNumber;
      this.formData.personFlowRegister.trainType = arr.trainType;
    },
    handleClosed () {
      this.dstCity = [];
      this.recentlyProvince = [];
      this.fromProvinceCode = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
.wrapper {
  /* 转化元素类型 */
  display: grid;
  /* 设置网格的间隙 */
  grid-gap: 5px;
  /* 设置每列的尺寸 */
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 20px;
}
.weight {
  font-weight: 700;
}
.title {
  padding-left: 10px;
  border-left: 3px solid #0187e2;
}
.fr {
  float: right;
}
.clear::after {
  clear: both;
  display: block;
  content: null;
}
.basic {
  display: flex;
  align-items: baseline;
  margin-top: 15px;
  h4 {
    margin-right: 10px;
    font-size: 15px;
    font-weight: 400;
  }
  ul {
    margin-left: 15px;
    label {
      margin-left: 15px;
    }
  }
  .el-input {
    width: 200px;
  }
  .el-textarea {
    display: inline-block;
  }
}
</style>
