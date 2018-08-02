<template>
    <div>
        <input type='number' v-model.number="val"/>
        <span>{{flag}}</span>
        <div class="notebtn" @click="play">{{title}}</div>
    </div>
</template>

<script>
    import _common from '@/com/common';
    export default {
        name: "note",
        computed: {
          title(){
              return _common.getTitleFromVal(this.val, this.flag);
          }
        },
        methods: {
          play(){
              var delay = 0; // play one note every quarter second
              var note = this.val;
              var velocity = 127; // how hard the note hits
              // play the note
              MIDI.setVolume(0, 127);
              MIDI.noteOn(0, note, velocity, delay);
              MIDI.noteOff(0, note, delay + 0.75);
          },
        },
        data() {
            return {
                val: 59,
                flag: _common.sign.Minus,
            }
        }
    }
</script>

<style scoped>
    .notebtn {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: red;
    }
</style>