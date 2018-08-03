<template>
    <div>
        <div class="questList">
            <note v-for="(quest,index) in questions" :params.sync="quest"  :key="index"></note>
        </div>
        <button  @click='shuffle'>shuffle</button>
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
                  flag: _common.sign.Normal};
                arrQuests.push(objNote);
              }
              this.questions = arrQuests;
            },
        },
        data() {
            return {
               questions: [],
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .questList{
        display: flex;
    }
</style>
