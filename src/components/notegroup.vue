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
            can_active:{
                default: true,
            }
        },  
        components: {
            note
        },  
        watch: {
            activeIndex: {
                handler: function (val, oldVal) {
                    if (this.$props.can_active) {
                        for (let i = 0; i < this.$props.notes.length; i++) {
                            this.$props.notes[i].active = (i == val);
                        }
                    }
                },
                deep: true,
            },
        },                    
        methods: {
            toHidding(){//定位到下一个隐藏按钮
                let bFound= false;
                for (let i = this.activeIndex; i < this.$props.notes.length; i++)
                {
                    let objNoteData = this.$props.notes[i];
                    if (objNoteData.display == '?')
                    {
                        bFound = true;
                        this.activeIndex = i;
                        break;
                    }
                }
                if(!bFound)
                {
                    for (let i = 0; i < this.activeIndex; i++)
                    {
                        let objNoteData = this.$props.notes[i];
                        if (objNoteData.display == '?')
                        {
                            bFound = true;
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
            },
            reveal(){
                for (let i = 0; i < this.$props.notes.length; i++)
                {
                    let objNoteData = this.$props.notes[i];
                    objNoteData.display =  this.$props.notes[i].val;
                    
                    // this.$refs['note'+ i].reveal();
                }
            },
            prev(){
                this.activeIndex = Math.max(this.activeIndex-1, 0);
            },
            next(){
                this.activeIndex = Math.min(this.activeIndex + 1, this.$props.notes.length - 1);
            },
            reset(){
                this.$props.notes[this.activeIndex].sign = _common.sign.Normal;
                this.$props.notes[this.activeIndex].times = 0;
            },
            rise(){
                this.$props.notes[this.activeIndex].sign = _common.sign.Plus;
            },
            fall(){
                this.$props.notes[this.activeIndex].sign = _common.sign.Minus;
            },
            setTimes(times){
              this.$props.notes[this.activeIndex].times = times;
            },
            change(key){
                switch(key){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        this.$props.notes[this.activeIndex].val = key;
                        this.$props.notes[this.activeIndex].display = key;
                        this.toHidding();
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