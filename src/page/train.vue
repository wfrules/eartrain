<template>
    <div>
        <notegroup :notes.sync="questions" ref="ng"></notegroup>
        <notegroup v-if="revealing" :notes.sync="answers"></notegroup>        
        <div class='btnbar'>
          <button  @click='play' :disabled='!canPlay()'>play</button>
          <button  @click='stop' >stop</button>
          <button  @click='shuffle'v-show="revealing">shuffle</button>
          <button  @click='reveal' v-show="showReveal">reveal</button>
          <button  @click='toggleStandard' v-show="!revealing" >>></button>
        </div>
        <ul v-show="!revealing">
          <li class='row'>
            <div class='key colleft' @click='keyClick(1)'>1</div><div class='key colright'  @click='keyClick(2)'>2</div>
          </li>
          <li class='row'>
            <div class='key colleft' @click='keyClick(3)'>3</div><div class='key colright'  @click='keyClick(4)'>4</div>
          </li>
          <li class='row'>
            <div class='key colleft' @click='keyClick(5)'>5</div><div class='key colright'  @click='keyClick(6)'>6</div>
          </li>
          <li class='row'>
            <div class='key colleft' @click='keyClick(7)'>7</div><div class='key colright' @click='reset'>R</div>
          </li>          
          <li class='row'>
            <div class='key colleft' @click='fall'>b</div><div class='key colright' @click='rise'>#</div>
          </li>                
          <li class='row'>
            <div class='key colleft' @click='setTimes(-1)'>-8</div><div class='key colright' @click='setTimes(1)'>+8</div>
          </li>     
          <li class='row'>
            <div class='key colleft'>←</div><div class='key colright'>→</div>
          </li>  
        </ul>  
        <div>{{questResult}}</div>
        <notegroup v-if="showStandard" :notes.sync="standards"></notegroup>                 
    </div>
</template>

<script>
    let moment = require('moment');  
    import _common from '@/com/common';    
    import notegroup from '@/components/notegroup'; 
    const _questLen = 6;
    export default {
        name: 'Train',
        computed: {
          questResult(){
              let bSuccess = true;
              for(let i = 0; i< this.questions.length;i++) 
              {
                let iAnswered = _common.getValFromParams(this.questions[i]);
                let iCorret = _common.getValFromParams(this.answers[i]);
                if(iAnswered != iCorret)
                {
                  bSuccess = false;
                }
                console.log(iAnswered, iCorret);
              }
              return (bSuccess)?'YES':'NO';
          },
          showReveal(){
            let bRet = false;
            if(!this.revealing)
            {
              let arrHidding  = this.questions.filter(quest=>{
                return quest.display == "?";
              });
              if (!arrHidding.length)
              {
                bRet = true;
              }
            }
            return bRet;
          },
          answers(){
            return  this.questions.map(quest=>{
              return {
                  val: quest.val,
                  times: quest.times,
                  sign: quest.sign, 
                  display: quest.val, 
                  active: false
                }
            });
          }
        },
        created(){       
          let arrStandards = [];
          for(let i = 1; i <= 7; i++)
          {
            let objNote = {
              val: i,
              times: 0,
              sign: _common.sign.Normal, 
              display: i, 
              active: false
            };
              arrStandards.push(objNote);
          }
          this.standards = arrStandards;

          let objSelf = this;

          (function poll(){
            clearTimeout(objSelf.timerCheck);
            objSelf.now = moment().format('YYYY-MM-DD hh:mm:ss');
            objSelf.timerCheck =setTimeout(poll, 1000);
          })();
          this.shuffle();
        },
        components: {
            notegroup
        },
        methods: {
            reset(){
              this.$refs.ng.reset();
            },
            rise(){
              this.$refs.ng.rise()
            },
            fall(){
              this.$refs.ng.fall()
            },   
            setTimes(times){
              this.$refs.ng.setTimes(times)
            },
            stop(){
              _common.stop();
            },
            questClick(index){
                alert(index);
            },
            keyClick(key){
                this.$refs.ng.setVal(key)
            },

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
                _common.play(_common.getValFromParams(this.questions[i]), {delay: i* dRate});
              }
              let dDelay = this.questions.length * dRate;
              this.play_end_at = moment().add(dDelay, 's').format('YYYY-MM-DD hh:mm:ss');
            },
            reveal(){
              this.revealing = true;              
            },
            notePlay(note){
                console.log(note);
            },
            shuffle(){
              let arrQuests = [];
              for(let i = 0; i < _questLen; i++)
              {
                let iNote = _common.randomNumBoth(1, 7);
                let objNote = {
                  val: iNote,
                  times: 0,
                  sign: _common.sign.Normal, 
                  display: '?', 
                  active: i == 0
                };
                arrQuests.push(objNote);
              }
              this.questions = arrQuests;              
              this.revealing = false;
            },
        },
        data() {
            return {
               revealing: false,
               questions: [],
               keyboards: [1,2,3,4,5,6,7],
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
      margin-left: 15px;
    } 
</style>
