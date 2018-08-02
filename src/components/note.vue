<template>
    <div>
        <input type='number' v-model.number="val"/>
        <span>{{flag}}</span>
        <div class='noteFrame'>
            <div class="noteTimesTitle">{{noteObj.timesTitle}}</div>
            <div class="notebtn" @click="play">{{noteObj.title}}</div>          
        </div>        
    </div>
</template>

<script>
    import _common from '@/com/common';
    export default {
        name: "note",
        props: {
          params:{
            type: Object,
            required: true,
            default: {
              val: _common.base, 
              flag: _common.sign.Normal
            }
          },         
        },
        created(){
            this.creatting = true;
            this.val = this.params.val;
            this.flag = this.params.flag;
            this.creatting = false;
        },
        watch: {
          val(newVal){            
            // if (!this.creatting)
            // {
            //   this.play();
            // }
          }
        },
        computed: {
          noteObj(){
              return this.getNote(_common.getTitleFromVal(this.val, this.flag));
          }
        },
        methods: {
          getTimesTitle(times){
              let sSign = '';
              if (times > 0)
              {
                sSign = '+';
              }
              else if (times < 0)
              {
                sSign = '-';
              }
              let sRet = '';
              for(let i = 0; i < times; i++)
              {
                sRet += sSign;
              }
              return sRet;

          },
          getNote(nodeVal){
              let sTitle = '';
              switch(nodeVal.sign)
              {
                  case _common.sign.Normal:
                      sTitle = nodeVal.val;
                      break;
                  case _common.sign.Plus:
                      sTitle = nodeVal.val + '#';
                      break;
                  case _common.sign.Minus:
                      sTitle = 'b' + nodeVal.val;
                      break;
              }
              return {title: sTitle, timesTitle: this.getTimesTitle(nodeVal.times)};
          },
          play(){
              var delay = 0; // play one note every quarter second
              var note = this.val;
              var velocity = 127; // how hard the note hits
              // play the note
              MIDI.setVolume(0, 127);
              MIDI.noteOn(0, note, velocity, delay);
              MIDI.noteOff(0, note, delay + 0.75);
          },
        },
        data() {
            return {
                creatting: false,
                val: _common.base,
                flag: _common.sign.Plus,
            }
        }
    }
</script>

<style scoped>
    .noteFrame {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-color: red      
    }
    .notebtn {
        
    }
    .noteTimesTitle{        
         
    }
</style>