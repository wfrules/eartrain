import axios from 'axios'
let mTool = {
  isMobile:  function(value) {
    //是否为手机号码或者固话
    var reg1 = /^1[3|5|7|8][0-9]{9}$/;
    var reg2 = /^0\d{2,3}-?\d{7,8}$/;
    var reg3 = /^[4][0]{2}[0-9]{7}$/;
    if (!reg2.test(value) && !reg1.test(value) && !reg3.test(value)) {
      return false;
    }
    return true;
  },//判断是否手机
  randomNumBoth: function(Min,Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  },//产生指定范围的随机数
  getCookie: ()=>{
    let strCookie = document.cookie;
    let arrCookie = strCookie.split("; ");
    for (let i = 0; i < arrCookie.length; i++) {
      let arr = arrCookie[i].split("=");
      if (arr[0] == "api_token") {
        if (unescape(arr[1]) == "") {
          return unescape(arr[1]);
        } else {
          return unescape(arr[1]) + "," + '';
        }
      }

    }
    return "";
  },
  setCookie: (value)=>{
    var cookieString = "";
    cookieString = "api_token=" + escape(value);
    var date = new Date();
    date.setTime(date.getTime() + 720 * 60 * 60 * 1000); //30天,1个月
    cookieString = cookieString + "; expires=" + date.toGMTString();
    cookieString = cookieString + "; path=/";
    document.cookie = cookieString;
  },
isWechat: () => {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
},

  setSessionVal: function(key, value) { //注 key至少有3层以防止重复 譬如 sport_mobile_xxx
    window.sessionStorage[key] = value;
  },
  getSessionVal: function(key, getParams) {
    var sRet = window.sessionStorage[key];
    if (getParams.del)
    {
      window.sessionStorage.removeItem(key);
    }
    if (getParams.notnull)
    {//判断是否非空
      if (!sRet)
      {
        throw new Error(key + '值不能为空!');
      }
    }
    return sRet;
  },

  request:(opt)=>{
    if (opt.loading)
    {

    }

    if (opt.json == "" || opt.json == undefined) {
      opt.json = "{}";
    }
    var arrMyParams = opt.json;
    let params = new URLSearchParams();
    params.append('func', opt.action == undefined ? '' : opt.action);
    params.append('parms', JSON.stringify(arrMyParams));
    axios.post( opt.url.toLowerCase(), params).then(res=>{
        if (res.data.result == 0) {
          opt.func(res.data);
        }else {
          console.log(opt.action == undefined ? '' : opt.action);
          if (opt.errorfunc != undefined && opt.errorfunc != "") {
            opt.errorfunc(res.data);
          } else {
            if (res.data.error) {
              alert(res.data.error);
            }
            else
            {
              alert(res.data);
            }
          }
        }

      },
      err=>{
        alert('出错了');
      }
    );
  },
    // 克隆数据
    cloneDeep(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                    cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    },

};
export default mTool;
