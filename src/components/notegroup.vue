<template>
    <div class="questList">
        <note v-for="(note,index) in notes" :params.sync="note"  :key="index" @click="noteClick(index)" :ref="'note'+ index"></note>
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
        watch: {
            activeIndex: {
                handler: function (val, oldVal) {
                    for(let i = 0; i < this.$props.notes.length; i++)
                    {
                        this.$props.notes[i].active = (i == val);
                    }                    
                },
                deep: true,
            },
        },                    
        methods: {
            reveal(){
                for (let i = 0; i < this.$props.notes.length; i++)
                {
                    let objNoteData = this.$props.notes[i];
                    objNoteData.display =  _common.getTitleFromVal(objNoteData.val, objNoteData.flag).val;
                    
                    // this.$refs['note'+ i].reveal();
                }
            },
            setVal(key){
                switch(key){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        this.$props.notes[this.activeIndex].display = key;//_common.getNote(key, 0).val;
                        break;
                }
            },
           noteClick(index){
                this.activeIndex = index;
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