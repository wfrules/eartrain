<template>
    <div v-if="$store.state.libLoaded">
        <notegroup :notes.sync="questions" ref="ng"></notegroup>
        <notegroup v-if="revealing" :notes.sync="answers" :can_active="false"></notegroup>
        <notegroup v-if="showStandard" :notes.sync="standards"></notegroup>
        <icon v-if="revealing && questResult" type="success" is-msg></icon>
        <icon v-if="revealing && !questResult" type="warn" is-msg></icon>
        <keyboard :keys="pool" v-if="!revealing"  @click="keyPress"></keyboard>
        <flexbox>
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
                objSelf.now = moment().format('YYYY-MM-DD hh:mm:ss');
                objSelf.timerCheck = setTimeout(poll, 1000);
            })();            
        },
        components: {
            notegroup, Icon, XButton, keyboard, Flexbox, FlexboxItem 
        },
        methods: {
            keyPress(keyObj){
                this.$refs.ng.change(keyObj);
            },           
            stop() {
                this.play_end_at =  moment().format('YYYY-MM-DD hh:mm:ss');
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
                this.play_end_at = moment().add(dDelay, 's').format('YYYY-MM-DD hh:mm:ss');
            },
            reveal() {
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
                revealing: false,
                questions: [],
                answers: [],
                play_end_at: moment().format('YYYY-MM-DD hh:mm:ss'),
                now: moment().format('YYYY-MM-DD hh:mm:ss'),
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

</style>
