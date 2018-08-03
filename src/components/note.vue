<template>
    <div class="mainFrame">
        <div class="adjuster" v-show="showAdjuster">
          <input class="adjInput" type='number' v-model.number="params.val" min="48" max="60"/>
          <span>{{params.flag}}</span>
        </div>
        <div class='noteFrame' @click="play">
            <!--<div class="noteTimesTitle">{{noteObj.timesTitle}}</div>-->
            <div :class="getNoteClass()">{{noteObj.val}}</div>
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
          },         
        },
        watch: {
            params: {
                handler: function (val, oldVal) {
                    this.$emit('update:params', val)
                },
                deep: true,
            },
        },
        computed: {
          noteObj(){
              return _common.getTitleFromVal(this.params.val, this.params.flag);
          }
        },
        methods: {
          getNoteClass(){
              let objStyle =  {
                  notebtn: true,
              };
              switch(this.noteObj.sign)
              {
                  case _common.sign.Plus:
                      objStyle.rise = true;
                      break;
                  case _common.sign.Minus:
                      objStyle.fall = true;
                      break;
              }
              if (this.noteObj.times > 0)
              {
                  objStyle.upper = true;
              }
              else if (this.noteObj.times < 0)
              {

              }

              // let sTitle = '';
              // switch(nodeVal.sign)
              // {
              //     case _common.sign.Normal:
              //         sTitle = nodeVal.val;
              //         break;
              //     case _common.sign.Plus:
              //         sTitle = nodeVal.val + '#';
              //         break;
              //     case _common.sign.Minus:
              //         sTitle = 'b' + nodeVal.val;
              //         break;
              // }
              // return {title: sTitle, timesTitle: this.getTimesTitle(nodeVal.times)};



              return objStyle;
          },
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
          play(){
              var delay = 0; // play one note every quarter second
              var note = this.params.val;
              var velocity = 127; // how hard the note hits
              // play the note
              MIDI.setVolume(0, 127);
              MIDI.noteOn(0, note, velocity, delay);
              MIDI.noteOff(0, note, delay + 0.75);
          },
        },
        data() {
            return {
                showAdjuster: true,
            }
        }
    }
</script>

<style scoped>
    .mainFrame {
        position: relative;
    }
    .adjuster {
      width: 40px;
      background-color: blue;
    }
    .adjInput{
        width: 30px;
    }
    .noteFrame {
        position: relative;
        border: 1px solid;
        display: inline-block;
        width: 40px;
        height: 40px;
        background-color: lightgray;
    }
    .notebtn {
        margin-top: 25%;
    }
    .upper:before{
        content: '.';
        position: absolute;
        top: -5px;
        left: 18px;
    }
    .noteTimesTitle{        
         
    }
    .rise{
        color: green;
    }
    .rise:before{
        content: '#';
        position: absolute;
        top: 2px;
        left: 8px;
    }
    fall{
        color: blue;
    }
    .fall:before{
        content: 'b';
        position: absolute;
        top: 2px;
        left: 8px;
    }
</style>