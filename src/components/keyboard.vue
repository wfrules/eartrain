<template>
    <div>
        <flexbox  v-for="(keyBtn,index)  in keys" :key="'row' + index" >
            <flexbox-item>
                <x-button type="primary" class="flex-demo" @click.native="keyPress(keyBtn)">
                    {{keyBtn.caption}}
                </x-button>                
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
    import { Flexbox, FlexboxItem } from 'vux'
    import { XButton } from 'vux'
    import _common from '@/com/common';
    export default {
        name: "keyboard",
        props: {
            keys: {
                type: Array,
                required: true,
            },
        },        
        components: {
            XButton, Flexbox, FlexboxItem
        },                          
        methods: {
            keyPress(keyObj){
                this.$emit('click', keyObj)
            },      
        },
        computed: {
            keyLayOut(){
                let arrLayOut = [];
                for(let i = 0; i < this.keys.length; i++)
                {
                    if (i % 2 == 0)
                    {   
                        if (i == (this.keys.length-1))
                        {//最后一笔
                          arrLayOut.push([this.keys[i]]);
                        } 
                        else 
                        {
                          arrLayOut.push([this.keys[i],this.keys[i+1]]);
                        }
                    }
                }
                return arrLayOut;
            }
        },
        data() {
            return {
                
            }
        }
    }
</script>

<style scoped>
   
</style>