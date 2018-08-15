<template>
    <div :style="getMainBtnStyle()"  @click="play"  @touchstart="touchStart"  @touchend="touchEnd">
        <div :class="getNoteClass()">{{params.display}}</div>
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
            actualVal() {
                return _common.getValFromParams(this.params);
            }
        },
        methods: {
            getMainBtnStyle(){
                let objStyle = {
                    position: 'relative',                    
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                };
                objStyle.border = (this.params.active)?'1px solid red':'1px solid black';
                if (this.touching)
                {
                  objStyle['background-color'] = 'lightgray';
                }
                else 
                {
                  if (this.params.active)
                  {
                      objStyle['background-color'] = 'yellow';
                  }
                  else
                  {
                      objStyle['background-color'] = 'white';
                  }                  
                }
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
                switch (this.params.sign) {
                    case _common.sign.Plus:
                        objStyle.rise = true;
                        break;
                    case _common.sign.Minus:
                        objStyle.fall = true;
                        break;
                }
                if ((this.params.times > 0) && (this.params.display != "?")) {
                    objStyle.upper = true;
                }
                else if (this.params.times < 0) {
                    objStyle.lower = true;
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
                if (this.params.display != '?')
                {
                  _common.play(this.actualVal,{});
                }                
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
        width: 45%;
        height: 45%;
        text-align: center;
        padding: 25%;
    }

    .upper:after {
        content: '.';
        position: absolute;
        top: -5px;
        left: 23px;
    }

    .lower:after {
        content: '.';
        position: absolute;
        top: 20px;
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