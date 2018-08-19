<template>
    <div v-if="$store.state.libLoaded">
        <div class="joystick_area" ref="joystick" @dblclick="doSubmit" :style="getJoyStyle()">
            <div class="circle" :style="getHintStyle(poolHint, index)" v-for="(poolHint, index) in pool">{{poolHint.caption}}</div>
            <!--{{joystick.key.caption}}-->
        </div>
        <notegroup :notes.sync="questions" ref="ng"></notegroup>
        <notegroup v-if="revealing" :notes.sync="answers" :can_active="false"></notegroup>
        <icon v-if="revealing && questResult" type="success" is-msg></icon>
        <icon v-if="revealing && !questResult" type="warn" is-msg></icon>

        <!-- <keyboard :keys="pool" v-if="!revealing"  @click="touchEnd"></keyboard> -->
        <flexbox v-if="false">
            <flexbox-item><x-button type="warn" @click.native='doPlay'>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-bofang"></use>
                </svg>
            </x-button></flexbox-item>
            <flexbox-item><x-button type="warn" @click.native='shuffle'>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhangjiechuti"></use>
                </svg>
            </x-button></flexbox-item>
            <flexbox-item v-show="showReveal"><x-button type="warn" @click.native='reveal' >
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenjuandaan"></use>
                </svg>
            </x-button></flexbox-item>
            <flexbox-item><x-button type="warn" @click.native='toggleStandard' v-show="!revealing">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jianpan"></use>
                </svg>
            </x-button></flexbox-item>
        </flexbox>
   <!--      <notegroup v-if="showStandard" :notes.sync="standards"></notegroup> -->
    </div>
</template>

<script>
    import {Icon} from 'vux'
    import { XButton } from 'vux'
    import { Flexbox, FlexboxItem } from 'vux'   

    let moment = require('moment');
    import _common from '@/com/common';
    import notegroup from '@/components/notegroup';
    import keyboard from '@/components/keyboard';

    export default {
        name: 'Train',
        computed: {           
            showReveal() {
                let bRet = false;
                if (!this.revealing) {
                    let arrHidding = this.questions.filter(quest => {
                        return quest.display == "?";
                    });
                    if (!arrHidding.length) {
                        bRet = true;
                    }
                }
                return bRet;
            }
        },
        watch: {
            '$store.state.libLoaded': function(newVal, oldVal){
              if(newVal)
              {
                 this.$nextTick(() => {
                                let objSelf = this;
                                var options = {
                                    zone: this.$refs.joystick,
                                    color: 'red'
                                };            
                                var objJoystick = require('nipplejs').create(options);

                                  objJoystick.on('start end', function(evt, data) {
                                    // dump(evt.type);
                                    // debug(data);
                                    switch(evt.type)
                                    {
                                        case 'start':
                                            objSelf.joystick.touching = true;
                                            objSelf.joystick.position = data.position;
                                            objSelf.joystick.touchBeginAt = moment();

                                            break;
                                        case 'end':
                                            if (objSelf.revealing)
                                            {
                                                let iDiff =  moment(objSelf.now).diff(objSelf.joystick.touchBeginAt, 'seconds');
                                                if (iDiff >= 2){
                                                    objSelf.shuffle();
                                                }
                                                else
                                                {
                                                    objSelf.doPlay();
                                                }                                                    
                                                
                                            }
                                            else {
                                                if (objSelf.joystick.distance >= 50) {
                                                    objSelf.touchRelease(objSelf.joystick.key);
                                                }
                                                else 
                                                {//小范围移动
                                                    if (objSelf.canDoReveal())
                                                    {
                                                        objSelf.reveal();
                                                    }
                                                    else 
                                                    {
                                                        objSelf.doPlay();
                                                    };                                                                                              
                                                }
                                            }
                                            objSelf.joystick = objSelf.getEmptyStick();
                                            break;
                                    }
                                  })
                                  .on('move', function(evt, data) {
                                          let iAngle = data.angle.degree;
                                          let iRet = -1;
                                          for(let i = 0; i < 8; i++)
                                          {
                                              let iBegin = 22.5 + i*45;
                                              let iEnd = 22.5 + (i+1)*45;
                                              if(((iAngle >= iBegin) && (iAngle < iEnd))
                                                  ||
                                                  (((iAngle + 360) >= iBegin) && ((iAngle + 360) < iEnd))
                                              )
                                              {
                                                  iRet = i;
                                                  break;
                                              }
                                          }
                                          let arrStand = [ 7, 8, 1, 2, 3, 4, 5, 6];
                                          let iNote = arrStand[iRet];
                                          if (data.distance >= 50)
                                          {
                                              objSelf.joystick.key = objSelf.pool[iNote - 1];
                                          }
                                          objSelf.joystick.distance = data.distance;
                                  })
                                  .on('dir:up plain:up dir:left plain:left dir:down ' +
                                        'plain:down dir:right plain:right',
                                        function(evt, data) {
                                            // dump(evt.type);
                                            // console.log('direction');
                                          }
                                       )
                                  .on('pressure', function(evt, data) {
                                        // console.log('pressure');
                                            // debug({
                                            //   pressure: data
                                            // });
                                  });

                           })                     
                this.shuffle();
              }
            },
            questions: {
                handler: function (questions, oldVal) {
                    let bSuccess = true;
                    for (let i = 0; i < questions.length; i++) {
                        if (questions[i].display != this.answers[i].display) {
                            bSuccess = false;
                            break;
                        }
                        let iAnswered = _common.getValFromParams(questions[i]);
                        let iCorret = _common.getValFromParams(this.answers[i]);
                        if (iAnswered != iCorret) {
                            bSuccess = false;
                            break;
                        }
                    }
                    this.questResult = (bSuccess) ? true : false;
                },
                deep: true,
            },
        },
        created() {
            let arrStandards = [];
            for (let i = 1; i <= 7; i++) {
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

            (function poll() {
                clearTimeout(objSelf.timerCheck);
                objSelf.now = moment().format('YYYY-MM-DD HH:mm:ss');
                objSelf.timerCheck = setTimeout(poll, 1000);
            })();                        
        },
        mounted(){                  

                
        },
        components: {
            notegroup, Icon, XButton, keyboard, Flexbox, FlexboxItem 
        },
        methods: {
            canDoReveal(){
                let bRet = false;
                if (this.showReveal)
                {
                    let iDiff =  moment(this.now).diff(this.joystick.touchBeginAt, 'seconds');
                    bRet = (iDiff >= 2);
                }
                return bRet;
            },
            getEmptyStick(){
                return {
                    touching: false,
                    key: {caption: '', code: ''},
                    distance: 0,
                    position: {x: 0, y: 0},
                    touchBeginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    touchEndAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                };
            },
            getPosition(x, y, radius, index){
                // {caption: 1, code: 'C3'},
                // {caption: 2, code: 'D3'},
                // {caption: 3, code: 'E3'},
                // {caption: 4, code: 'F3'},
                // {caption: 5, code: 'G3'},
                // {caption: 6, code: 'A3'},
                // {caption: 7, code: 'B3'},
                // {caption: 'i', code: 'C4'},
                let iDistance = 100;
                let arrPos = [
                    {left: x - iDistance - (radius/2), top: y - iDistance - (radius/2)},//1
                    {left: x - iDistance - (radius/2), top: y - (radius/2)},//2
                    {left: x - iDistance - (radius/2), top: y + iDistance - (radius/2)},//3
                    {left: x - (radius/2), top: y + iDistance - (radius/2)},//4
                    {left: x + iDistance - (radius/2), top: y + iDistance - (radius/2)},//5
                    {left: x + iDistance - (radius/2), top:  y - (radius/2)},//6
                    {left: x + iDistance - (radius/2), top: y - iDistance - (radius/2)},//7
                    {left: x - (radius/2), top: y - iDistance - (radius/2)}//8
                ];
                return arrPos[index];
            },
            getHintStyle(aHint, index){
                let objStyle = {};
                if (this.joystick.touching)
                {
                    objStyle.display = "block";
                    let iWidth = document.body.clientWidth;
                    let iRadius = iWidth * 0.15;
                    objStyle.width = iRadius + 'px';
                    objStyle.height = iRadius + 'px';
                    let objPosition = this.getPosition(this.joystick.position.x, this.joystick.position.y, iRadius,  index);
                    objStyle.left = objPosition.left + 'px';
                    objStyle.top = objPosition.top + 'px';
                    objStyle['font-size'] = '20px';
                    if ((aHint.caption == this.joystick.key.caption) && (this.joystick.distance >= 50))
                    {
                        objStyle['background-color'] = 'yellow';
                    }
                    if (this.canDoReveal())
                    {
                        objStyle['background-color'] = 'green';
                    }

                }
                else
                {
                    objStyle.display = "none";
                }

                return objStyle;
            },
            getJoyStyle(){
              let iWidth = document.body.clientWidth;
              let objStyle = {
                  width: iWidth + 'px',
                  height: iWidth + 'px',
              };
              return objStyle;
            },
            doSubmit(){
              alert('双击');
            },
            touchRelease(keyObj){
                this.$refs.ng.change(keyObj);
            },           
            stop() {
                this.play_end_at =  moment().format('YYYY-MM-DD HH:mm:ss');
                _common.stop();
            },
            questClick(index) {
                alert(index);
            },

            toggleStandard() {
                this.showStandard = !this.showStandard;
            },
            isFree() {
                let bIsFree = moment(this.now) > moment(this.play_end_at);
                return bIsFree;
            },
            doPlay(){
                this.stop();
                this.play();
            },
            play() {
                let dRate = 0.5;
                for (let i = 0; i < this.answers.length; i++) {
                    _common.play(_common.getValFromParams(this.answers[i]), {delay: i * dRate});
                }
                let dDelay = this.answers.length * dRate;
                this.play_end_at = moment().add(dDelay, 's').format('YYYY-MM-DD HH:mm:ss');
            },
            reveal() {
                this.$refs.ng.activeIndex = 0;
                this.$refs.ng.check(this.answers);
                this.revealing = true;                
            },
            notePlay(note) {
                console.log(note);
            },
            shuffle() {                
                let arrQuests = [];                
                for (let i = 0; i < 6; i++) {
                    let idx = _common.randomNumBoth(0, 7);
                    let iNote = _common.keyToNote(this.pool[idx].code);
                    let objNote = _common.getTitleFromVal(iNote, _common.sign.Minus);
                    objNote.display = '?';
                    objNote.active = i == 0;
                    objNote.state = 0;
                    arrQuests.push(objNote);
                }
                this.questions = arrQuests;
                this.answers = this.questions.map(quest => {
                    return {
                        val: quest.val,
                        times: quest.times,
                        sign: quest.sign,
                        display: quest.val,
                        active: false
                    }
                });
                this.revealing = false;
                this.play();
            },
        },
        data() {
            return {
                joystick: this.getEmptyStick(),
                revealing: false,
                questions: [],
                answers: [],
                play_end_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                timerCheck: 0,
                showStandard: false,
                questResult: false,

                pool: [
                    {caption: 1, code: 'C3'},
                    {caption: 2, code: 'D3'},
                    {caption: 3, code: 'E3'},
                    {caption: 4, code: 'F3'},
                    {caption: 5, code: 'G3'},
                    {caption: 6, code: 'A3'},
                    {caption: 7, code: 'B3'},
                    {caption: 'i', code: 'C4'},
                ],

                keys: [
                    {caption: 1, code: 1},
                    {caption: 2, code: 2},
                    {caption: 3, code: 3},
                    {caption: 4, code: 4},
                    {caption: 5, code: 5},
                    {caption: 6, code: 6},
                    {caption: 7, code: 7},
                    {caption: 'R', code: 'r'},
                    {caption: 'b', code: 'b'},
                    {caption: '#', code: '#'},
                    {caption: '-8', code: '-8'},
                    {caption: '+8', code: '+8'},
                    {caption: '←', code: 'p'},
                    {caption: '→', code: 'n'},
                ]                
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .joystick_area {
        background-color: #b2b2b2;
        font-size: 200px;
        position: relative;
        text-align: center;
    }
    .circle {;
        position: absolute;
        background-color:#cccccc;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
