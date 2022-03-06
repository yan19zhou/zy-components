/*
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-07-29 20:02:42
 * @LastEditTime: 2021-08-22 17:12:54
 * @LastEditors: cqg
 */
import request from "@/plugins/axios";

// 隔离点信息
export function getHotelInfo(id) {
  return request({
    url: "/jdglhotelbaseinfo/" + id,
    method: "get",
  });
}

// 入住信息
export function getMoveInfo(query) {
  return request({
    url: "/hotel/jdglhotelmoveinto/pageMoveInfo",
    method: "get",
    params: query,
  });
}

//换房记录
export function changeRoomHistory(query = {}) {
  return request({
    url: "/hotel/jdglhotelmoveinto/changeRoomHistory",
    method: "get",
    params: query,
  });
}

//核酸检测分页
export function fetchNucleicInfo(query) {
  return request({
    url: "/jdglpersonnucleinmonitor/page",
    method: "get",
    params: query,
  });
}
// 隔离逾期登记
export function fetchDelayInfo(query) {
  return request({
    url: "/jdglpersonoverdueregi/page",
    method: "get",
    params: query,
  });
}
//隔离人员信息
export function getMemberInfo(id) {
  return request({
    url: "/jdglpersoninfo/" + id,
    method: "get",
  });
}
// 离店信息
export function getLeaveInfo(personId) {
  return request({
    url: "/jdglpersonleaveinfo/page",
    method: "get",
    params: { personId: personId },
  });
}
// 心里状态
export function fetchHeartInfo(query) {
  return request({
    url: "/jdglpersonheartstatus/list",
    method: "get",
    params: query,
  });
}
// 身体状况
export function fetchBodyInfo(query) {
  return request({
    url: "/jdglpersondailmonitor/list",
    method: "get",
    params: query,
  });
}

export function getProvinceCity(query) {
  return request({
    url: "/admin/area/get_province_city_pc",
    method: "get",
    params: query,
  });
}
export function getAreaTreeVoByParentId(query) {
  return request({
    url: "/admin/area/getAreaTreeVoByParentId",
    method: "get",
    params: query,
  });
}

export function getSelectLeaveInfo(moveInfoId) {
  return request({
    url: `/jdglpersonleaveinfo/getSelectLeaveInfo/${moveInfoId}`,
    method: "get",
  });
}
export function getIsoLatePage(params) {
  return request({
    url: `/log/isolate/page`,
    method: "get",
    params,
  });
}
// 离点档案分页
// 
export function getIsoLateRecordList(params) {
  return request({
    url: `/jdglpersoninfo/otherLeave/isoFilesPage`,
    method: "get",
    params,
  });
}