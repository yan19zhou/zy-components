<template>
  <div>
    <el-cascader :options="options" clearable @change="(e)=>$emit('input',e)"></el-cascader>
  </div>
</template>

<script>
import { getProvinceCity } from "./api";
export default {
  data() {
    return {
      options: [],
    };
  },
  mounted() {
    this.getAreas();
  },

  methods: {
    //获取目的地级联
    async getAreas() {
      this.options = await this.getLocations();
    },
    getLocations() {
      return new Promise((resolve) => {
        let datas = localStorage.getItem("province_city_list");
        if (datas) {
          resolve(JSON.parse(datas));
        } else {
          getProvinceCity().then((resp) => {
            // let data = resp.data.data;
            function cityMap(result) {
              let getCity = (data, n) => {
                n = n + 1;
                data.map((item) => {
                  item.label = item.areaName;
                  item.value = item.id;
                  if (item.children && item.children.length > 0) {
                    if (n < 3) {
                      item.children = getCity(item.children, n);
                    } else {
                      delete item.children;
                    }
                  } else {
                    delete item.children;
                  }
                });
                return data;
              };
              return getCity(result, 0);
            }

            let data = cityMap(resp.data.data);
            let customProvinceCity = [];
            data.map((item) => {
              if (item.id == "000000") {
                customProvinceCity = [...customProvinceCity, ...item.children];
              } else if (item.id == "1000003") {
                customProvinceCity = [...customProvinceCity, ...item.children];
              } else if (item.id == "1000001") {
                customProvinceCity = [...customProvinceCity, ...item.children];
              }
            });
            setTimeout(() => {
              localStorage.setItem(
                "province_city_list",
                JSON.stringify(customProvinceCity)
              );
              resolve(customProvinceCity);
            }, 100);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>