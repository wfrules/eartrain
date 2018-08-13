<template>
    <div>
        {{keyLayOut}}
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

        <x-button type="primary" v-for="keyObj in keyboard" @click.native="keyPress(keyObj)" :key="keyObj.caption">{{keyObj.caption}}</x-button>

        <!--<flexbox>-->
            <!--<flexbox-item><x-button type="primary" class="flex-demo">1</x-button></flexbox-item>-->
            <!--<flexbox-item><x-button type="primary" class="flex-demo">2</x-button></flexbox-item>-->
        <!--</flexbox>-->

        <ul v-show="revealing">
            <li class='row'>
                <div class='key colleft' @click='keyClick(1)'>1</div>
                <div class='key colright' @click='keyClick(2)'>2</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='keyClick(3)'>3</div>
                <div class='key colright' @click='keyClick(4)'>4</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='keyClick(5)'>5</div>
                <div class='key colright' @click='keyClick(6)'>6</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='keyClick(7)'>7</div>
                <div class='key colright' @click='reset'>R</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='fall'>b</div>
                <div class='key colright' @click='rise'>#</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='setTimes(-1)'>-8</div>
                <div class='key colright' @click='setTimes(1)'>+8</div>
            </li>
            <li class='row'>
                <div class='key colleft' @click='prev'>←</div>
                <div class='key colright' @click='next'>→</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {Icon} from 'vux'
    import { XButton } from 'vux'
    import { Flexbox, FlexboxItem } from 'vux'

    let moment = require('moment');
    import _common from '@/com/common';
    import notegroup from '@/components/notegroup';

    const _questLen = 6;
    export default {
        name: 'Train',
        computed: {
            keyLayOut(){
                let arrLayOut = [];
                for(let i = 0; i < this.keyboard.length; i++)
                {
                    if (i % 2 == 0)
                    {
                        arrLayOut.push({});
                    }
                }
                return arrLayOut;
            },
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
            notegroup, Icon, XButton, Flexbox, FlexboxItem
        },
        methods: {
            keyPress(keyObj){
                console.log(keyObj);
            },
            prev() {
                this.$refs.ng.prev();
            },
            next() {
                this.$refs.ng.next();
            },
            reset() {
                this.$refs.ng.reset();
            },
            rise() {
                this.$refs.ng.rise()
            },
            fall() {
                this.$refs.ng.fall()
            },
            setTimes(times) {
                this.$refs.ng.setTimes(times)
            },
            stop() {
                _common.stop();
            },
            questClick(index) {
                alert(index);
            },
            keyClick(key) {
                this.$refs.ng.change(key)
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
                for (let i = 0; i < this.questions.length; i++) {
                    _common.play(_common.getValFromParams(this.questions[i]), {delay: i * dRate});
                }
                let dDelay = this.questions.length * dRate;
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
                keyboardss: [1, 2, 3, 4, 5, 6, 7, 'R', 'b', '#', '-8', '+8', '←', '→'],
                keyboard: [
                    {caption: 1, code: 1},
                    {caption: 2, code: 2},
                    {caption: 3, code: 3},
                    {caption: 4, code: 4},
                    {caption: 5, code: 5},
                    {caption: 6, code: 6},
                    {caption: 7, code: 7},
                    {caption: 'b', code: 'b'},
                    {caption: '#', code: '#'},
                    {caption: '-8', code: '-8'},
                    {caption: '+8', code: '+8'},
                    {caption: '←', code: 'L'},
                    {caption: '→', code: 'R'},
                ],
                play_end_at: moment().format('YYYY-MM-DD hh:mm:ss'),
                now: moment().format('YYYY-MM-DD hh:mm:ss'),
                timerCheck: 0,
                showStandard: false,
                questResult: false,
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
