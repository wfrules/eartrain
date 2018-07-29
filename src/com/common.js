/**
 * Created by Administrator on 2018/7/29 0029.
 */
let common = {
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
