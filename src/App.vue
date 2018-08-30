<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import * as types from "@/store/mutation-types";
    export default {
        name: 'App',
        created() {
            let objSelf = this;
            window.onload = function () {
                MIDI.loadPlugin({
                    soundfontUrl: "./static/soundfont/",
                    instrument: "acoustic_grand_piano",
                    onprogress: function (state, progress) {
//                console.log(state, progress);
                    },
                    onsuccess: function () {
                        objSelf.$store.dispatch(types.SET_LIBLOADED, true);
                    }
                });
            };
        },
        methods: {

        },
        components: {
        },
        data(){
            return {

            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .icon {
        /* 通过设置 font-size 来改变图标大小 */
        width: 1em; height: 1em;
        /* 图标和文字相邻时，垂直对齐 */
        vertical-align: -0.15em;
        /* 通过设置 color 来改变 SVG 的颜色/fill */
        fill: currentColor;
        /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
           normalize.css 中也包含这行 */
        overflow: hidden;
    }
</style>
