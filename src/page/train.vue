<template>
    <div>
      {{note}}
        <note :params="{val:60, flag:0}"></note>
        <note v-for="(quest,index) in questions" :params="getNoteParams(quest)"  :key="index"></note>
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
        computed: {
          note(){
            return _common.getNote(this.noteval, this.offset);
          }
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
                arrQuests.push(iNote);
              }
              this.questions = arrQuests;
            },
        },
        data() {
            return {   
              offset: 0,
              noteval: 1,              
               questions: [],
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
