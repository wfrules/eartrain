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
        margin-top: 60px;
    }
</style>
