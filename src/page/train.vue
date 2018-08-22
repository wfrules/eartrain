<template>
    <div v-if="$store.state.libLoaded">        
        <div class="joystick_area" ref="joystick" @dblclick="doSubmit" :style="getJoyStyle()">
            <div v-if="!revealing" class="circle" :style="getHintStyle(poolHint, index)" v-for="(poolHint, index) in pool">{{poolHint.caption}}</div>
            <!--{{joystick.key.caption}}-->
        </div>
        <notegroup :notes.sync="questions" ref="ng"></notegroup>
        <notegroup v-if="revealing" :notes.sync="answers" :can_active="false"></notegroup>
        <div>正确数{{score.right}}</div>
        <div>错误数{{score.wrong}}</div>
        <!-- <keyboard :keys="pool" v-if="!revealing"  @click="touchEnd"></keyboard> -->
        <svg class="icon" aria-hidden="true" @click="toSetting" v-if="$store.state.token != ''">
            <use xlink:href="#icon-gerenzhongxin"></use>
        </svg>
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
    const TouchLimit = 50;//圆周半径
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
                                            if (objSelf.joystick.touching)
                                            {
                                                if (objSelf.revealing)
                                                {//揭示状态
                                                    if (objSelf.joystick.distance >= TouchLimit) {
                                                        if (objSelf.joystick.angle.degree <= 180)
                                                        {
                                                            objSelf.playSheet();
                                                        }
                                                        else
                                                        {
                                                            objSelf.doPlay();
                                                        }
                                                    }
                                                }
                                                else {//考核状态
                                                    if (objSelf.joystick.distance >= TouchLimit) {
                                                        objSelf.$refs.ng.change(objSelf.getActiveKey());
                                                    }
                                                    else
                                                    {//小范围移动
                                                        if (objSelf.joystick.distance > 5)
                                                        {//5和limit之间的小范围移动
                                                            if (objSelf.joystick.angle.degree > 45 && objSelf.joystick.angle.degree <= 135)
                                                            {
                                                                objSelf.$refs.ng.first();
                                                            }
                                                            else if (objSelf.joystick.angle.degree > 135 && objSelf.joystick.angle.degree <= 225)
                                                            {
                                                                objSelf.$refs.ng.prev();
                                                            }
                                                            else if (objSelf.joystick.angle.degree > 225 && objSelf.joystick.angle.degree <= 315)
                                                            {
                                                                objSelf.$refs.ng.last();
                                                            }
                                                            else
                                                            {
                                                                objSelf.$refs.ng.next();
                                                            }
                                                        }
                                                        else
                                                        {
                                                            objSelf.doPlay();
                                                        }
                                                    }
                                                }
                                            }
                                            objSelf.joystick = objSelf.getEmptyStick();
                                            break;
                                    }
                                  })
                                  .on('move', function(evt, data) {
                                          objSelf.joystick.angle.degree = data.angle.degree;  
                                          objSelf.joystick.distance = data.distance;
                                  })
                                  .on('dir:up plain:up dir:left plain:left dir:down ' +
                                        'plain:down dir:right plain:right',
                                        function(evt, data) {
                                            // dump(evt.type);
                                            // console.log('direction');
                                            // console.log(evt);
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

                if (objSelf.joystick.touching && objSelf.joystick.distance < TouchLimit)
                {
                    if (objSelf.revealing)
                    {//揭示状态
                        {//小范围移动
                            let iDiff =  moment(objSelf.now).diff(objSelf.joystick.touchBeginAt, 'seconds');
                            if (iDiff >= 1){
                                objSelf.shuffle();
                            }
                        }
                    }
                    else {//考核状态
                        {//小范围移动
                            if (objSelf.canDoReveal())
                            {
                                objSelf.reveal();
                            }
                        }
                    }
                }
            })();                        
        },
        mounted(){                  

                
        },
        components: {
            notegroup, Icon, XButton, keyboard, Flexbox, FlexboxItem 
        },
        methods: {
            toSetting(){
                this.$router.push('/setting');
            },
            getActiveKey(){
                let iAngle = this.joystick.angle.degree;
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
                return this.pool[iNote - 1];
            },
            canDoReveal(){
                let bRet = false;
                if (this.showReveal && (this.joystick.distance < TouchLimit) && (this.joystick.touching))
                {
                    let iDiff =  moment(this.now).diff(this.joystick.touchBeginAt, 'seconds');
                    bRet = (iDiff >= 1);
                }
                return bRet;
            },
            getEmptyStick(){
                return {
                    touching: false,
                    distance: 0,
                    position: {x: 0, y: 0},
                    touchBeginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    touchEndAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    angle: {degree: 0},
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
                    if ((aHint.caption == this.getActiveKey().caption) && (this.joystick.distance >= TouchLimit))
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
                this.play(this.answers);
            },
            play(notes) {
                let dBpm  = this.$store.state.profile.speed;
                if(!dBpm)
                {
                    throw new Error('速度不能为0');
                }
                let dRate = 60 / dBpm;
                for (let i = 0; i < notes.length; i++) {
                    _common.play(_common.getValFromParams(notes[i]), {delay: i * dRate});
                }
                let dDelay = notes.length * dRate;
                this.play_end_at = moment().add(dDelay, 's').format('YYYY-MM-DD HH:mm:ss');
            },
            playSheet(){
                this.stop();
                this.play(this.questions);                               
            },
            reveal() {
                this.joystick.touching = false;
                this.$refs.ng.activeIndex = 0;
                this.$refs.ng.check(this.answers);
                this.revealing = true;

                let objOptions = {};
                objOptions.url = '/api/train/getsum';
                objOptions.action = '获取分数';
                objOptions.json = {};
                objOptions.func = (json) => {
                    this.score.right = json.right;
                    this.score.wrong = json.wrong;
                }
                this.request(objOptions);

            },
            notePlay(note) {
                console.log(note);
            },
            shuffle() {
                this.joystick.touching = false;
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
                this.doPlay();
            },
        },
        data() {
            return {
                score: {
                    right: 0,
                    wrong: 0,
                },
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
