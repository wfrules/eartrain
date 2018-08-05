<template>
    <div>
        <div class="questList">
            <note v-for="(quest,index) in questions" :params.sync="quest"  :key="index"></note>
        </div>
        <div class='btnbar'>
          <button  @click='play' :disabled='!canPlay()'>play</button>
          <button  @click='shuffle'>shuffle</button>
          <button  @click='reveal'>reveal</button>
          <button  @click='toggleStandard'>>></button>
        </div>
        <div class='row'>
          <div class='key colleft'>1</div><div class='key colright'>2</div>
        </div>
        <div class='row'>
          <div class='key colleft'>3</div><div class='key colright'>4</div>
        </div>
        <div class='row'>
          <div class='key colleft'>5</div><div class='key colright'>6</div>
        </div>        
        <div class='row'>
          <div class='key colleft'>b</div><div class='key colright'>#</div>
        </div>                
        <div class='row'>
          <div class='key colleft'>-8</div><div class='key colright'>+8</div>
        </div>     
        <div class='row'>
          <div class='key colleft'>←</div><div class='key colright'>→</div>
        </div>                     
        <div class="standard" v-if="showStandard">
            <note v-for="(key,index) in keyboards" :params.sync="key"  :key="index" @play="notePlay(key)"></note>
        </div>
    </div>
</template>

<script>
    let moment = require('moment');  
    import _common from '@/com/common';    
    import note from '@/components/note';    
    const _questLen = 6;
    export default {
        name: 'Train',
        created(){
          let objSelf = this;

          (function poll(){
            clearTimeout(objSelf.timerCheck);
            objSelf.now = moment().format('YYYY-MM-DD hh:mm:ss');
            objSelf.timerCheck =setTimeout(poll, 1000);
          })();
          this.shuffle();
        },
        components: {
            note
        },
        methods: {
            toggleStandard(){
              this.showStandard = !this.showStandard;
            },
            canPlay(){
              let bCanPlay =  moment(this.now) > moment(this.play_end_at);
              return bCanPlay;
            },
            play(){
              let dRate = 0.5;
              for(let i = 0; i< this.questions.length;i++)
              {
                _common.play(this.questions[i].val, {delay: i* dRate});
              }
              let dDelay = this.questions.length * dRate;
              this.play_end_at = moment().add(dDelay, 's').format('YYYY-MM-DD hh:mm:ss');
            },
            reveal(){
              this.questions.forEach(quest=>{
                 quest.hidding = false;
              });
            },
            notePlay(note){
                console.log(note);
            },
            getNoteParams(quest){
              let objRet = {val: _common.getNote(quest, 0).val,
                flag: _common.sign.Normal};
              return objRet;
            },
            shuffle(){
              let arrQuests = [];
              for(let i = 0; i < _questLen; i++)
              {
                let iNote = _common.randomNumBoth(1, 8);
                let objNote = {val: _common.getNote(iNote, 0).val,
                  flag: _common.sign.Normal, hidding: true};
                arrQuests.push(objNote);
              }
              this.questions = arrQuests;
              let arrKeyboards = [];
                for(let i = 1; i <= 7; i++)
                {
                    let objNote = {val: _common.getNote(i, 0).val,
                        flag: _common.sign.Normal, hidding: false};
                    arrKeyboards.push(objNote);
                }
                this.keyboards = arrKeyboards;
            },
        },
        data() {
            return {
               questions: [],
               keyboards: [],
               play_end_at: moment().format('YYYY-MM-DD hh:mm:ss'),
               now: moment().format('YYYY-MM-DD hh:mm:ss'),
               timerCheck: 0,
               showStandard: false,
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    button{
      width: 60px;
      height: 50px;
    }
    .questList{
        display: flex;
    }
    ul,li{ padding:0;margin:0;list-style:none}
    .keyboard{
        display: flex;
    }
    .row {
      width: 100%;
      height: 70px;
    }
    .key {
      border: 1px solid;
      width: 48%;
      height: 100%;
      display: inline-block;
      text-align: center;
      font-size: 30px;
    }
    .colleft{
      float: left;

    }
    .colright{
      float: right;
    }   
    .btnbar button{
      width: 15%;
      margin-left: 20px;
    } 
</style>
