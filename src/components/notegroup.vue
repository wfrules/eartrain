<template>
    <flexbox>
        <flexbox-item  v-for="(note,index) in notes" :key="'row' + index" >
            <note  :params.sync="note"  @click="noteClick(index)" :ref="'note'+ index"></note>
        </flexbox-item>
    </flexbox>
</template>

<script>
    import { Flexbox, FlexboxItem } from 'vux'    
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
            note, Flexbox, FlexboxItem
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
            check(answers){
                for(let i = 0; i < this.$props.notes.length; i++)
                {
                    let iAnswered = _common.getValFromParams(this.$props.notes[i]);
                    let iCorret = _common.getValFromParams(answers[i]);                    
                    this.$props.notes[i].state = (iAnswered == iCorret)?1:2;
                }    
            },
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
                if(!bFound)
                {
                    this.next();
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
            change(keyObj){
                switch(keyObj.code){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        this.$props.notes[this.activeIndex].val = keyObj.code;
                        this.$props.notes[this.activeIndex].display = keyObj.code;
                        this.toHidding();
                        break;
                    case 'r':
                        this.reset();
                        break;
                    case 'b':
                        this.fall();
                        break;
                    case '#':
                        this.rise();
                        break;                        
                    case '-8':
                        this.setTimes(-1);
                        break;                         
                    case '+8':
                        this.setTimes(1);
                        break;                                    
                    case 'p':
                        this.prev();
                        break;  
                    case 'n':
                        this.next();
                        break;
                    default:
                        let iNote = _common.keyToNote(keyObj.code);
                        let objNote = _common.getTitleFromVal(iNote, _common.sign.Minus);
                        this.$props.notes[this.activeIndex].val = objNote.val;
                        this.$props.notes[this.activeIndex].display = objNote.val;
                        this.$props.notes[this.activeIndex].times = objNote.times;
                        this.$props.notes[this.activeIndex].sign = objNote.sign;
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