// Created by lifei on 2020/7/20--11:01.
<template>
    <div class="sort-tree-comp">
        <draggable :list="list" v-bind="{forceFallback: true }">
            <div v-for="project in list" :key="project.value">
                <div class="box">
                    <span class="icon" v-show="project.children"
                          :class="{'el-icon-plus':project.showChildren, 'el-icon-minus':!project.showChildren}"
                          @click="project.showChildren=!project.showChildren"></span>
                    <span class="label">{{project.label}}</span>
                </div>
                <draggable :list="project.children" v-bind="{forceFallback: true }" :group="{ name: 'building'}"
                           group="building" v-show="project.showChildren">
                    <div v-for="building in project.children" :key="building.value">
                        <div class="box building">
                            <span class="icon" v-show="building.children" :class="{'el-icon-plus':building.showChildren, 'el-icon-minus':!building.showChildren}"
                                  @click="building.showChildren=!building.showChildren"></span>
                            <span class="label">{{building.label}}</span>
                        </div>
                        <draggable :list="building.children" v-bind="{forceFallback: true }" :group="{ name: 'floor'}"
                                   group="floor" v-show="building.showChildren">
                            <div v-for="floor in building.children" :key="floor.value">
                                <div class="box floor">
                                    <span class="label">{{floor.label}}</span>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </draggable>
            </div>
        </draggable>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: "sort-tree",
        components: {
            draggable
        },
        data() {
            return {
                list: [
                    {
                        value: 'p-1',
                        label: '项目1',
                        showChildren: true,
                        children: [
                            {
                                value: 'b-1',
                                label: '楼栋aaa1',
                                showChildren: true,
                                children: [
                                    {
                                        value: 'f-11',
                                        label: '楼层11',
                                    },
                                    {
                                        value: 'f-2',
                                        label: '楼层12',
                                    },
                                    {
                                        value: 'f-113',
                                        label: '楼层113',
                                    },
                                    {
                                        value: 'f-24',
                                        label: '楼层124',
                                    },
                                ]
                            },
                            {
                                value: 'b-2',
                                label: '楼栋4',
                                showChildren: true,
                                children: [
                                    {
                                        value: 'f-21',
                                        label: '楼层21',
                                    },
                                    {
                                        value: 'f-22',
                                        label: '楼层22',
                                    },
                                ]
                            },
                            {
                                value: 'b-3',
                                label: '楼栋3',
                                showChildren: true,
                                children: [
                                    {
                                        value: 'f-31',
                                        label: '楼层31',
                                    },
                                    {
                                        value: 'f-32',
                                        label: '楼层32',
                                    },
                                ]
                            },
                            {
                                value: 'b-4',
                                label: '楼栋4',
                            },
                        ]
                    },
                    {
                        value: 'p-2',
                        label: '项目2',
                        showChildren: true,
                        children: [
                            {
                                value: 'bb-1',
                                label: '楼栋1',
                                children: [
                                    {
                                        value: 'ff-11',
                                        label: '楼层11',
                                    },
                                    {
                                        value: 'ff-2',
                                        label: '楼层12',
                                    },
                                ]
                            },
                            {
                                value: 'bb-2',
                                label: '楼栋4',
                                children: [
                                    {
                                        value: 'ff-21',
                                        label: '楼层21',
                                    },
                                    {
                                        value: 'ff-2',
                                        label: '楼层22',
                                    },
                                ]
                            },
                            {
                                value: 'bb-3',
                                label: '楼栋3',
                                children: [
                                    {
                                        value: 'ff-31',
                                        label: '楼层31',
                                    },
                                    {
                                        value: 'ff-32',
                                        label: '楼层32',
                                    },
                                ]
                            },
                            {
                                value: 'bb-4',
                                label: '楼栋4',
                            },
                        ]
                    },
                ],
            }
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style  lang='scss'>
    

    .sort-tree-comp {
        padding: 18px 16px;

        .box {
            display: flex;
            align-items: center;
            border: 1px solid $border-color;
            height: 38px;
            margin-bottom: 12px;
            padding-left: 16px;
            cursor: move;

            .icon {
                padding: 10px 16px;
                margin-left: -16px;
                cursor: pointer;
                transition: 0.3s ease;

                &:hover {
                    font-weight: bold;
                    color: $theme-color;
                    transition: 0.3s ease;
                    transform: scale(1.3);
                }
            }
        }

        .building {
            margin-left: 30px;
        }

        .floor {
            margin-left: 60px;
        }
    }
</style>
