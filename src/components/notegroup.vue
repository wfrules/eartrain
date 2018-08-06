<template>
    <div class="questList">
        <note v-for="(note,index) in notes" :params.sync="note"  :key="index" @click="noteClick(index)"></note>
    </div>
</template>

<script>
    import _common from '@/com/common';
    import note from '@/components/note';   
    export default {
        name: "notegroup",
        props: {
            notes: {
                type: Array,
                required: true,
            },
        },  
        components: {
            note
        },              
        methods: {
           noteClick(index){
                
           }
        },
        data() {
            return {
                activeIndex: 0,
            }
        }
    }
</script>

<style scoped>
   
</style>