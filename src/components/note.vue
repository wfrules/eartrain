<template>
    <div :style="getFrameStyle()"  @click="play"  @touchstart="touchStart"  @touchend="touchEnd">
        <div class="adjuster" v-show="showAdjuster">
            <input class="adjInput" type='number' v-model.number="params.val" min="48" max="60"/>
            <span>{{params.flag}}</span>
        </div>
        <div :style="getMainBtnStyle()">
            <div :class="getNoteClass()">{{params.display}}</div>
        </div>
    </div>
</template>

<script>
    import _common from '@/com/common';

    export default {
        name: "note",
        props: {
            params: {
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
            noteObj() {
                return _common.getTitleFromVal(this.params.val, this.params.flag).val;
            }
        },
        methods: {
            reveal(){
              alert('x');
            },
            getTitle(){
                return this.params.display;
            },
            getFrameStyle(){
                let objFrameStyle = {
                  position: 'relative',
                  margin: '5px',
                };
                objFrameStyle.border = (this.params.active)?'1px solid red':'1px solid black';
                return objFrameStyle;
            },
            getMainBtnStyle(){
                let objStyle = {
                    position: 'relative',                    
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                };
                objStyle['background-color'] = (this.touching)?'lightgray':'white';
                return objStyle;
            },
            touchStart() {
                this.touching = true;
            },
            touchEnd(){
                this.touching = false;
            },
            getNoteClass() {
                let objStyle = {
                    notebtn: true,
                };
                switch (this.noteObj.sign) {
                    case _common.sign.Plus:
                        objStyle.rise = true;
                        break;
                    case _common.sign.Minus:
                        objStyle.fall = true;
                        break;
                }
                if (this.noteObj.times > 0) {
                    objStyle.upper = true;
                }
                else if (this.noteObj.times < 0) {

                }
                return objStyle;
            },
            getTimesTitle(times) {
                let sSign = '';
                if (times > 0) {
                    sSign = '+';
                }
                else if (times < 0) {
                    sSign = '-';
                }
                let sRet = '';
                for (let i = 0; i < times; i++) {
                    sRet += sSign;
                }
                return sRet;

            },
            play() {
                // this.params.active = !this.params.active;    
                _common.play(this.params.val,{});
                
                this.$emit('click');
            },
        },
        data() {
            return {
                touching: false,
                showAdjuster: false,
            }
        }
    }
</script>

<style scoped>    
    .adjuster {
        width: 40px;
        background-color: blue;
    }

    .adjInput {
        width: 30px;
    }

    .noteFrame {
        position: relative;
        border: 1px solid;
        display: inline-block;
        width: 50px;
        height: 50px;
        background-color: lightgray;
    }

    .notebtn {
        margin-top: 25%;
    }

    .upper:before {
        content: '.';
        position: absolute;
        top: -5px;
        left: 23px;
    }

    .noteTimesTitle {

    }

    .rise {
        color: green;
    }

    .rise:before {
        content: '#';
        position: absolute;
        top: 2px;
        left: 8px;
    }

    fall {
        color: blue;
    }

    .fall:before {
        content: 'b';
        position: absolute;
        top: 2px;
        left: 8px;
    }
</style>