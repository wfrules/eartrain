<template>
    <!-- polyfill -->
    <div>
        <button  @click='play'>tick</button>
    </div>
</template>

<script>
    import Base64 from "@/assets/inc/shim/Base64";
    import Base64binary from "@/assets/inc/shim/Base64binary";
    import WebAudioAPI from "@/assets/inc/shim/WebAudioAPI";
    import audioDetect from "@/assets/js/midi/audioDetect";
    import gm from "@/assets/js/midi/gm";
    import loader from "@/assets/js/midi/loader";
    import audioTag from "@/assets/js/midi/plugin.audiotag.js";
    import webaudio from "@/assets/js/midi/plugin.webaudio.js";
    import webmidi from "@/assets/js/midi/plugin.webmidi.js";

    import dom_request_xhr from "@/assets/js/util/dom_request_xhr";
    import dom_request_script from "@/assets/js/util/dom_request_script";


    export default {
        name: 'Train',
        methods: {
            play(){
                alert('play');
                var delay = 0; // play one note every quarter second
                var note = 50; // the MIDI note
                var velocity = 127; // how hard the note hits
                // play the note
                MIDI.setVolume(0, 127);
                MIDI.noteOn(0, note, velocity, delay);
                MIDI.noteOff(0, note, delay + 0.75);
            }
        },
        created(){
            MIDI.loadPlugin({
                soundfontUrl: "http://localhost:8080/static/soundfont/",
                instrument: "acoustic_grand_piano",
                onprogress: function(state, progress) {
                    console.log(state, progress);
                },
                onsuccess: function() {
                    console.log('play');
                    // var delay = 0; // play one note every quarter second
                    // var note = 50; // the MIDI note
                    // var velocity = 127; // how hard the note hits
                    // // play the note
                    // MIDI.setVolume(0, 127);
                    // MIDI.noteOn(0, note, velocity, delay);
                    // MIDI.noteOff(0, note, delay + 0.75);
                }
            });
        },
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
