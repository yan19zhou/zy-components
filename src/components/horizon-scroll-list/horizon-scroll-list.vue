<template>
    <div class="horizon-scroll-list" :class="{'is-left-scrollable': leftScrollable, 'is-right-scrollable': rightScrollable}" @mouseenter="handleMouseEnter">
        <div class="horizon-scroll-list__prev" :class="{'is-disabled': disabledPrevBtn}" @click="handlePrevClick"></div>
        <div class="horizon-scroll-list__wrap" ref="wrap" @scroll="handleWrapScroll" @wheel="handleWrapWheel">
            <div class="horizon-scroll-list__list">
                <div
                    class="horizon-scroll-list__item"
                    v-for="(item, index) in data"
                    :key="index"
                    ref="item"
                >
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <div class="horizon-scroll-list__next" :class="{'is-disabled': disabledNextBtn}" @click="handleNextClick"></div>
    </div>
</template>
<script>
export default {
    name: 'HorizonScrollList',
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            disabledSyncCurrentIndex: false,
            currentStartIndex: 0,
            currentEndIndex: 0,
            scrollLeft: 0,
            wrapBoxInfo: null
        }
    },
    computed: {
        leftScrollable () {
            return this.scrollLeft > 0
        },
        rightScrollable () {
            if (!this.wrapBoxInfo) {
                return false
            }
            if (this.wrapBoxInfo.scrollWidth <= this.wrapBoxInfo.clientWidth) {
                return false
            }
            if (this.scrollLeft >= this.wrapBoxInfo.scrollWidth - this.wrapBoxInfo.clientWidth) {
                return false
            }
            return true
        },
        disabledPrevBtn () {
            return this.currentStartIndex === 0
        },
        disabledNextBtn () {
            return this.currentEndIndex === this.data.length - 1
        }
    },
    watch: {
        data () {
            this.$nextTick(() => {
                this.syncWrapBoxInfo()
                this.syncCurrentIndex()
            })
        }
    },
    mounted () {
        this.syncWrapBoxInfo()
        this.syncCurrentIndex()
    },
    methods: {
        handlePrevClick () {
            if (this.disabledPrevBtn) {
                return
            }
            if (!this.currentStartIndex) {
                return
            }
            this.currentStartIndex = this.currentStartIndex - 1
            this.currentEndIndex = this.currentEndIndex - 1
            this.syncWrapScroll(this.currentStartIndex)
        },
        handleNextClick () {
            if (this.disabledNextBtn) {
                return
            }
            if (this.currentEndIndex >= this.data.length - 1) {
                return
            }
            this.currentStartIndex = this.currentStartIndex + 1
            this.currentEndIndex = this.currentEndIndex + 1
            this.syncWrapScroll(this.currentStartIndex)
        },
        handleWrapScroll () {
            this.scrollLeft = this.$refs.wrap.scrollLeft
            this.delaySyncCurrentIndex()
        },
        handleMouseEnter () {
            this.syncWrapBoxInfo()
        },
        handleWrapWheel (evt) {
            evt.preventDefault()
            let nextScrollLeft = this.$refs.wrap.scrollLeft
            if (evt.deltaY !== 0) {
                nextScrollLeft += (evt.deltaY !== undefined) ? evt.deltaY : (evt.detail !== undefined && evt.detail !== 0) ? evt.detail : -evt.wheelDelta
            } else if (evt.deltaX !== 0) {
                nextScrollLeft += (evt.deltaX !== undefined) ? evt.deltaX : (evt.detail !== undefined && evt.detail !== 0) ? evt.detail : -evt.wheelDelta
            }
            this.$refs.wrap.scrollLeft = nextScrollLeft
            return false
        },
        handleRenderItemType (item, index) {
            const ni = index + 1
            if (!(ni % 3)) {
                return 'triple'
            } else if (!(ni % 2)) {
                return 'double'
            } else if (!(ni % 1)) {
                return 'once'
            }
        },
        syncWrapBoxInfo () {
            this.wrapBoxInfo = {
                scrollWidth: this.$refs.wrap.scrollWidth,
                clientWidth: this.$refs.wrap.clientWidth
            }
        },
        syncWrapScroll (itemIndex) {
            if (!this.$refs.item || !this.$refs.item.length) {
                return
            }
            const $item = this.$refs.item[itemIndex]
            if (!$item) {
                return
            }
            this.$refs.wrap.scrollLeft = $item.offsetLeft
        },
        delaySyncCurrentIndex () {
            clearTimeout(this._syncIndexTimer)
            this._syncIndexTimer = setTimeout(() => {
                this.syncCurrentIndex()
            }, 60)
        },
        syncCurrentIndex () {
            if (this.disabledSyncCurrentIndex) {
                return
            }
            if (!this.$refs.item || !this.$refs.item.length) {
                this.currentStartIndex = 0
                this.currentEndIndex = 0
            }
            let startIndex = 0
            let endIndex = this.data.length - 1
            const startLimit = this.scrollLeft
            const endLimit = this.scrollLeft + this.wrapBoxInfo.clientWidth
            this.$refs.item.some((v, i) => {
                if (startLimit <= v.offsetLeft) {
                    startIndex = i
                    return true
                }
            })
            this.$refs.item.some((v, i) => {
                if (endLimit < v.offsetLeft + v.clientWidth) {
                    endIndex = Math.max(i - 1, 0)
                    return true
                }
            })
            this.currentStartIndex = startIndex
            this.currentEndIndex = endIndex
        }
    },
    beforeDestroy () {
        clearTimeout(this._syncIndexTimer)
    }
}
</script>
<style lang="scss">
.horizon-scroll-list{
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin-left: -6px;
    margin-right: -6px;
}
.horizon-scroll-list__prev,
.horizon-scroll-list__next{
    width: 20px;
    height: 20px;
    background-color: #fff;
    position: relative;
    z-index: 10;
    text-align: center;
    text-align: center;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 100%;
}
.horizon-scroll-list__prev{
    background-image: url('./images/prev-nomal.png');
    &:hover{
        background-image: url('./images/prev-active.png');
    }
}
.horizon-scroll-list__next{
    background-image: url('./images/next-nomal.png');
    &:hover{
        background-image: url('./images/next-active.png');
    }
}
.horizon-scroll-list__prev.is-disabled,
.horizon-scroll-list__next.is-disabled{
    cursor: not-allowed;
    opacity: 0;
}
.horizon-scroll-list__wrap{
    flex: 1;
    min-width: 0;
    overflow: hidden;
    position: relative;
    margin-left: 6px;
    margin-right: 6px;
}
.horizon-scroll-list__list{
    display: inline-block;
    white-space: nowrap;
}
.horizon-scroll-list__item{
    display: inline-block;
    vertical-align: top;
}
</style>