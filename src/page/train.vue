<template>
    <div>
        <div class="questList">
            <note v-for="(quest,index) in questions" :params.sync="quest"  :key="index"></note>
        </div>
        <button  @click='shuffle'>shuffle</button>
        <button  @click='reveal'>reveal</button>
        <div class="keyboard">
            <note v-for="(key,index) in keyboards" :params.sync="key"  :key="index" @play="notePlay(key)"></note>
        </div>
    </div>
</template>

<script>
    import _common from '@/com/common';
    import note from '@/components/note';
    const _questLen = 6;
    export default {
        name: 'Train',
        created(){
          this.shuffle();
        },
        components: {
            note
        },
        methods: {
            reveal(){
              this.questions.forEach(quest=>{
                 quest.hidding = false;
              });
            },
            notePlay(note){
                console.log(note);
            },
            getNoteParams(quest){
              let objRet = {val: _common.getNote(quest, 0).val,
                flag: _common.sign.Normal};
              return objRet;
            },
            shuffle(){
              let arrQuests = [];
              for(let i = 0; i < _questLen; i++)
              {
                let iNote = _common.randomNumBoth(1, 8);
                let objNote = {val: _common.getNote(iNote, 0).val,
                  flag: _common.sign.Normal, hidding: true};
                arrQuests.push(objNote);
              }
              this.questions = arrQuests;
              let arrKeyboards = [];
                for(let i = 1; i <= 7; i++)
                {
                    let objNote = {val: _common.getNote(i, 0).val,
                        flag: _common.sign.Normal, hidding: false};
                    arrKeyboards.push(objNote);
                }
                this.keyboards = arrKeyboards;
            },
        },
        data() {
            return {
               questions: [],
               keyboards: [],
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .questList{
        display: flex;
    }
    ul,li{ padding:0;margin:0;list-style:none}
    .keyboard{
        display: flex;
    }
    .key {
        border: 1px solid;
    }
</style>
