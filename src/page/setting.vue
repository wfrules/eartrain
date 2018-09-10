<script src="../com/MidiConvert.js"></script>
<template>
    <div>
        <!--<x-header>个人中心</x-header>-->
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gerenzhongxin"></use>
        </svg>
        {{$store.state.profile.name}}
        <x-button type="warn" @click.native="doLogout">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhuxiao"></use>
            </svg>
        </x-button>

        <flexbox orient="vertical">
            <flexbox-item>
                <x-number title="速度(bpm)" v-model="speed"></x-number>
            </flexbox-item>
            <flexbox-item>
                <x-number title="问题长度" v-model="quest_len"></x-number>
            </flexbox-item>
            <flexbox-item>
                <svg :class="getInstrumentClass(0)" aria-hidden="true" @click="toggleInstrument(0)">
                    <use xlink:href="#icon-gangqin-yuanwenjian"></use>
                </svg>
                <svg :class="getInstrumentClass(24)" aria-hidden="true" @click="toggleInstrument(24)">
                    <use xlink:href="#icon-mujita"></use>
                </svg>
            </flexbox-item>
            <flexbox-item>
                <x-button type="warn"  @click.native="doSave">
                    <svg class="icon" aria-hidden="true" >
                        <use xlink:href="#icon-baocun"></use>
                    </svg>
                </x-button>
            </flexbox-item>
        </flexbox>
        <input type="file" ref="inputFile" @change="uploadMidi" accept="audio/midi"/>
    </div>
</template>

<script>
    import {XButton, XNumber, XHeader } from 'vux'
    import {Flexbox, FlexboxItem} from 'vux'
    import * as types from "@/store/mutation-types";
    import _common from '@/com/common';
    export default {
        name: "setting",
        components: {
            XButton, Flexbox, FlexboxItem, XNumber, XHeader
        },
        data(){
            return {
                speed: this.$store.state.profile.speed,
                quest_len: this.$store.state.profile.quest_len,
                instrument: this.$store.state.profile.instrument,
            }
        },
        methods: {
            uploadMidi(e){
                if (window.FileReader) {
                    let inputFile = this.$refs.inputFile;
                    var files = e.target.files;
                    if (files.length > 0){
                        var file = files[0];
                        this.parseFile(file);
                    }
                }
            },
            parseFile(file){
                //read the file
                var reader = new FileReader();
                reader.onload = function(e){
                    var partsData = MidiConvert.parse(e.target.result);
                    console.log(partsData);//@wftmp
                    let arrNotes = partsData.tracks[1].notes;

                    let dRate = 60 / partsData.header.bpm;
                    for (let i = 0; i < arrNotes.length; i++) {
                        _common.play(arrNotes[i].midi, {
                            delay: i * dRate
                        });
                    }


                    arrNotes.forEach(noteItem=>{
                        // console.log(noteItem);
                        _common.play(noteItem.midi,{delay: noteItem.duration});
                    });

                };
                reader.readAsBinaryString(file);
            },
            toggleInstrument(instrument){
                this.instrument = instrument;
            },
            getInstrumentClass(instrument){
                let sClass = "icon instrument";
                if (this.instrument == instrument)
                {
                    sClass += " active";
                }
                return sClass;
            },
            doSave(){
                let objOptions = {};
                objOptions.url = '/api/user/saveprofile';
                objOptions.action = '保存设置';
                objOptions.json = {speed: this.speed, quest_len: this.quest_len, instrument: this.instrument};
                objOptions.func = (json) => {
                    let objProfile =  {
                        inited: true,
                        id: json.profile.id,
                        name: json.profile.name,
                        speed: json.profile.speed,
                        quest_len: json.profile.quest_len,
                        instrument: json.profile.instrument,
                    };
                    this.$store.dispatch(types.SET_PROFILE, objProfile);
                    alert('保存完毕');
                }
                this.request(objOptions);
            },
            doLogout(){
                this.$store.dispatch(types.SET_TOKEN, '');
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
    .instrument {
        width: 100px;
        height: 100px;
    }
    .active {
        border: 1px solid;
    }
</style>
