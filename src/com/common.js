/**
 * Created by Administrator on 2018/7/29 0029.
 */
let _base = 48;
let _getNote = function(noteVal, offset){//计算
  let iRemain = (noteVal - 1) % 7;
  let arrStanrd = [
    0, 2, 4, 5, 7, 9, 11
  ];
  let iRe =  arrStanrd[iRemain] + offset;
  let iTimes = Math.floor((noteVal + offset - 1) / 7);
  return {
    val: _base + iRe + 12 * iTimes,
    stand: noteVal % 7,
  }
};
let common = {
  base: _base,
  getNote: _getNote,
  randomNumBoth: function(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  }
}
export default common;
