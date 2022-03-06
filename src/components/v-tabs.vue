// Created by lifei on 2020/7/22--15:47.
<template>
    <div class="v-tabs">
        <div class="item all-center" v-for="(tab,index) in tabs" :key="tab.value" :class="{active:tab.value===active}"
             @click="changeTab(tab,index)">
            <span class="label">{{tab.label}}</span>
            <span class="amount">{{tab.amount}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "v-tabs",
        props: {
            tabs: {
                type: Array,
                default: () => []
            },
            active: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        mounted() {
        },
        methods: {
            changeTab(tab, index) {
                this.$emit("update:active", tab.value)
                this.$emit('changeTab', {tab, index})
            }
        }
    }
</script>

<style lang='scss'>
    .v-tabs {
        display: flex;

        .item {
            height: 40px;
            padding: 0 16px;
            cursor: pointer;
            border-top: 2px solid white;

            &:hover {
                color: $theme-color;
            }

            .amount {
                min-width: 20px;
                height: 20px;
                line-height: 18px;
                color: white;
                text-align: center;
                background-color: $theme-color;
                border-radius: 10px;
                font-size: 12px;
                margin-left: 6px;
            }
        }

        .active {
            border-color: $theme-color;
        }

    }
</style>
