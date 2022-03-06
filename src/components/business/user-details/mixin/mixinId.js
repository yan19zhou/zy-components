export const mixinsId = {
    computed: {
        id() {
            return this.personId();
        },
    },
    watch: {
        id() {
            this.queryData();
        },
    },
}