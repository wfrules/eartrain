/**
 * Created by Administrator on 2018/7/29 0029.
 */
let _base = 48;
let _getNote = function(noteVal, offset){
  let iNodeVal = Number(noteVal);
  let iCalc = Number(noteVal) + Number(offset);
  let arrStandard = [0, 2, 4, 5, 7, 9 , 11];
  let iStep = Math.floor(iCalc / 12);
  let iRemain = iCalc - iStep *12;
  let iReal = -1;
  for (let i = 0; i < arrStandard.length - 1; i++)
  {
    if (iRemain >= arrStandard[i] && iRemain <= arrStandard[i + 1])
    {
      iReal = i + 1;
      break;
    }
  }
  console.log(noteVal + '~' + iRemain + '~' + iReal);
  return {
    val: iReal
  }
};
let common = {
  base: _base,
  getNote: _getNote,
  regular: [
    0,
    48,//1
    50,//2
    52,//3
    53,//4
    55,//5
    57,//6
    59,//7
    60,//#1
  ],
  randomNumBoth: function(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  }
}
export default common;
