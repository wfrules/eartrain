let _Tmp = [
    1,//48
    2,//50
    3,//52
    4,//53
    5,//55
    6,//57
    7,//59
]
/**
 * Created by Administrator on 2018/7/29 0029.
 */


let _listStand = [
    0, 2, 4, 5, 7, 9, 11
];

let _SIGN = {
    Minus: -1,
    Normal: 0,
    Plus: 1,
};

let _getNote = function (noteVal, offset) {//计算
    let iRemain = (noteVal - 1) % 7;
    let iRe = _listStand[iRemain] + offset;
    let iTimes = Math.floor((noteVal + offset - 1) / 7);
    return {
        val: this.base + iRe + 12 * iTimes,
        stand: noteVal % 7,
    }
};

let _getTitleFromVal = function (val, sign) {
    let iVal = (val - this.base) % 12;
    let objRet = {times: Math.floor((val - this.base) / 12)};
    switch (sign) {
        case _SIGN.Normal:
        case _SIGN.Plus:
            for (let i = 0; i < _listStand.length - 1; i++) {
                if (_listStand[i] == iVal) {
                    objRet.val = i + 1;
                    objRet.sign = _SIGN.Normal;
                    break;
                }
                else if ((_listStand[i] < iVal)) {
                    if (_listStand[i + 1] == iVal) {
                        objRet.val = i + 2;
                        objRet.sign = _SIGN.Normal;
                        break;
                    }
                    else if (_listStand[i + 1] > iVal) {
                        objRet.val = i + 1;
                        objRet.sign = _SIGN.Plus;
                        break;
                    }
                }
            }
            break;
        case _SIGN.Minus:
            for (let i = _listStand.length - 1; i > 0; i--) {
                if (_listStand[i] == iVal) {
                    objRet.val = i + 1;
                    objRet.sign = _SIGN.Normal;
                    break;
                }
                else if ((_listStand[i] > iVal)) {
                    if (_listStand[i - 1] == iVal) {
                        objRet.val = i;
                        objRet.sign = _SIGN.Normal;
                        break;
                    }
                    else if (_listStand[i - 1] < iVal) {
                        objRet.val = i + 1;
                        objRet.sign = _SIGN.Minus;
                        break;
                    }
                }
            }
            break;
    }
    return objRet;
};

let common = {
    sign: _SIGN,
    base: 48,
    getNote: _getNote,
    getValFromParams(params) {//从曲谱对象获得实际值
        let iVal = this.base;
        for (let i = 2; i <= params.val; i++) {
            if (i == 4) {
                iVal = iVal + 1;
            }
            else {
                iVal = iVal + 2;
            }
        }
        switch (params.sign) {
            case this.sign.Plus:
                iVal++;
                break;
            case this.sign.Minus:
                iVal--;
                break;
        }
        iVal += params.times * 12;
        return iVal;
    },
    noteToKey(note) {
        return MIDI.noteToKey[note];
    },
    keyToNote(key) {
        return MIDI.keyToNote[key];
    },
    randomNumBoth: function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },
    getTitleFromVal: _getTitleFromVal,
    stop() {
        MIDI.stopAllNotes();
    },
    play(noteVal, params) {
        var delay = params.delay || 0; // play one note every quarter second
        var velocity = 127; // how hard the note hits
        // play the note
        MIDI.setVolume(0, 127);
        let objNote = MIDI.noteOn(0, noteVal, velocity, delay);
        MIDI.noteOff(0, noteVal, delay + 0.75);
        return objNote;
// MIDI.noteOn(channel, note, velocity, delay);
// MIDI.noteOff(channel, note, delay);
// MIDI.chordOn(channel, [note, note, note], velocity, delay);
// MIDI.chordOff(channel, [note, note, note], delay);
// MIDI.keyToNote = object; // A0 => 21
// MIDI.noteToKey = object; // 21 => A0

    },
    playSound(src){        
        var audio = new Audio(src);
        audio.play();
    },
    getRate(right, wrong){//统计百分比
      let dTotal = Number(right) + Number(wrong);
      return (dTotal > 0)?(right*100/dTotal):0;
    }
}
export default common;
