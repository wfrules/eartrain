<template>
    <div>
      <button v-for="quest in questions" @click="play(quest)">{{quest}}</button>
        <button  @click='shuffle'>shuffle</button>
    </div>
</template>

<script>
    import _common from '@/com/common'
    const _questLen = 6;
    export default {
        name: 'Train',
        created(){
          this.shuffle();
        },
        methods: {
            shuffle(){
              let arrQuests = [];
              for(let i = 0; i < _questLen; i++)
              {
                let iNote = _common.randomNumBoth(1, 8);
                arrQuests.push(iNote);
              }
              this.questions = arrQuests;
            },
            play(quest){
                var delay = 0; // play one note every quarter second
                var note = _common.regular[quest];
                var velocity = 127; // how hard the note hits
                // play the note
                MIDI.setVolume(0, 127);
                MIDI.noteOn(0, note, velocity, delay);
                MIDI.noteOff(0, note, delay + 0.75);
            }
        },
        data() {
            return {
              regular: [1,2,3,4,5,6,7,8],
               questions: [],
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
