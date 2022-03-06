import request from '@/plugins/axios'

// 获取行政区域
export function getProvinceCity(query) {
    return request({
        url: '/admin/area/get_province_city_pc',
        method: 'get',
        params: query
    })
}

