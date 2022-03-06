/*
 * @Description:
 * @Author: zhouy
 * @Date: 2021-09-10 17:58:08
 * @LastEditTime: 2021-09-10 21:00:40
 * @LastEditors: zhouy
 */
/* 
字段映射--主要针对地区
*/
 const objMap  = {
    nationality: { 1: "nationCountry", 2: "nationProvince", 3: "nationCity", 4: "nationDistrict" }, //国籍  国 省 市 区
    jgProvince: { 1: "jgProvince", 2: "jgCity", 3: "jgDistrict" }, //籍贯 省 市 区
    residenceAddress: { 1: "residenceAddressProvince", 2: "residenceAddressCity", 3: "residenceAddressAreas", 4: "residenceAddressStreets" }, //户籍--省 市 区 街道
    destination: { 1: "destinationProvince", 2: "destinationCity", 3: "destinationArea", 4: "destinationStreet" }, //目的地--省 市 区 街道
    leaveDestAddr: { 1: "leaveDestProvince", 2: "leaveDestination", 3: "leaveDestArea", 4: "leaveDestStreet", 5: "leaveDestCommunity" }, //离去目的地--省 市 区 街道 社区
};

export default objMap