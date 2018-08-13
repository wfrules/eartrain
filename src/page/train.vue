<template>
    <div>
        <notegroup :notes.sync="questions" ref="ng"></notegroup>
        <notegroup v-if="revealing" :notes.sync="answers" :can_active="false"></notegroup>
        <notegroup v-if="showStandard" :notes.sync="standards"></notegroup>
        <icon v-if="revealing && questResult" type="success" is-msg></icon>
        <icon v-if="revealing && !questResult" type="warn" is-msg></icon>
        <div class='btnbar'>
            <button @click='play' :disabled='!canPlay()'>play</button>
            <!--<button  @click='stop' >stop</button>-->
            <button @click='shuffle' v-show="revealing">shuffle</button>
            <button @click='reveal' v-show="showReveal">reveal</button>
            <button @click='toggleStandard' v-show="!revealing">>></button>
        </div>
        <keyboard :keys="keys" v-if="!revealing"  @click="keyPress"></keyboard>
    </div>
</template>

<script>
    import {Icon} from 'vux'
    import { XButton } from 'vux'
    

    let moment = require('moment');
    import _common from '@/com/common';
    import notegroup from '@/components/notegroup';
    import keyboard from '@/components/keyboard';

    const _questLen = 6;
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
            this.shuffle();
        },
        components: {
            notegroup, Icon, XButton, keyboard
        },
        methods: {
            keyPress(keyObj){
                this.$refs.ng.change(keyObj);
            },           
            stop() {
                _common.stop();
            },
            questClick(index) {
                alert(index);
            },

            toggleStandard() {
                this.showStandard = !this.showStandard;
            },
            canPlay() {
                let bCanPlay = moment(this.now) > moment(this.play_end_at);
                return bCanPlay;
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
                for (let i = 0; i < _questLen; i++) {
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
    button {
        width: 60px;
        height: 50px;
    }

    .questList {
        display: flex;
    }

    ul, li {
        padding: 0;
        margin: 0;
        list-style: none
    }

    .keyboard {
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

    .colleft {
        float: left;

    }

    .colright {
        float: right;
    }

    .btnbar button {
        width: 15%;
        margin-left: 15px;
    }
</style>
