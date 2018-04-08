
var sdeAction = function () {};

sdeAction.prototype = {
    /**
     * No.1
     * findById
     * */
    reportFindById: function (param) {
        var params = param || {key0: "服务名称", key1: "1", key2: 1,reportId:"1"};
        var res = srvByAjax("reportSrv", "findById", params , false);
        return res;
    },
    /**
     * No.2 base64ToImg
     * 描述: 通过同步请求更新base64图片
     * 参数: base64Str:  一个base64字符串
     *      uploadType: 更新类型.1本地更新.2fastdfs更新
     *      actionType: 涂鸦更新等,默认uploadscrawl更新....具体看com.ry.editor.template.ueditor.define.ActionMap
     *
     * 返回参数:JSON
     *      suffixType: 后缀类型
     *      uploadType: 更新类型.1本地更新.2fastdfs更新
     *      msg:        消息
     *      code:       编码:500失败.200成功
     *      url:        上传后图片路径
     * */
    base64ToImg: function (base64Str,uploadType,actionType) {
        var srvParam = {
            base64Str: base64Str,
            uploadType:uploadType,
            actionType:actionType
        };  //数据源配置
        var dataRes="";
        var sdeConfig = window.SDE_CONFIG ? window.SDE_CONFIG : parent.window.SDE_CONFIG;
        $.ajax({
            type: "post",
            url: sdeConfig.WEB_URL+"/editor/enter/basetoimg.do",
            data: srvParam,
            async: false,
            dataType: "json",
            success: function (data) {
                dataRes = JSON.parse(data);
                //console.log("上传图片到服务器:"+JSON.stringify(dataRes));
            }
        });
        return dataRes;
    }

};


function srvByAjax(srvName, funName, param, async) {
    var dataRes;
    if (typeof async != 'boolean') {
        async = true
    }
    var sdeConfigTemp = window.SDE_CONFIG ? window.SDE_CONFIG : parent.window.SDE_CONFIG;
    var srvParam = {
        datasource: (sdeConfigTemp && sdeConfigTemp.DATASOURCE) ? sdeConfigTemp.DATASOURCE : "",  //数据源配置
    };
    srvParam = $.extend(true, srvParam, param);
    $.ajax({
        type: "post",
        url: ctx + "/editor/"+srvName+"/" + funName + ".do",
        data: srvParam,
        async: async,
        dataType: "json",
        success: function (data) {
            console.log(JSON.stringify(data));
            dataRes = data;
        }
    });
    return dataRes;

}
/*扩展接口*/
(function ($, _sde) {
    /*2018-4-2 jason 编辑器点击事件,实现光标控制,解决之前控件前后无法输入字符和数字的问题start
     *解决思路：看控件的左右两边是否有text，如果没有则增加一个text
     * */
    _sde.prototype.sde_click = function (e) {
        var t = e.target, n = window.getSelection();
        if(t.tagName.toLocaleLowerCase()=="td"){
           // if(n.type=="None"){
            var firstEl = t.firstChild;
            var lastEl = t.lastChild;
           if(firstEl.nodeType!=3||lastEl.nodeType!=3){
               var node = document.createTextNode("");
               jQuery(firstEl).before(jQuery(node));
               var node = document.createTextNode("");
               jQuery(firstEl).after(jQuery(node));
            }
        }
        if (t.classList.contains("sde-left")) {
            var node;
            if (t.parentNode.previousSibling) {
                if (t.parentNode.previousSibling.nodeType == 3) {//text ;
                    node = t.parentNode.previousSibling;
                } else if (t.parentNode.previousSibling.nodeType == 1) {//元素element
                    var prevNode = t.parentNode.previousSibling;
                 //   if (prevNode.classList.contains("sde-bg")) {
                        var node = document.createTextNode("");
                        jQuery(t).parent().before(jQuery(node));

                 //   }
                }
            } else {
                var node = document.createTextNode("");
                jQuery(t).parent().before(jQuery(node));

            }
            var range = document.createRange();
            range.selectNode(node);
            range.collapse(true);
            //range.select();
            n.removeAllRanges();
            n.addRange(range);
            return false;


        } else if (t.classList.contains("sde-right")) {
            var node;
            if (t.parentNode.nextSibling) {
                if (t.parentNode.nextSibling.nodeType == 3) {
                    node = t.parentNode.nextSibling;

                } else if (t.parentNode.nextSibling.nodeType == 1) {//元素element
                    var item = t.parentNode.nextSibling;
                   // if (item.classList.contains("sde-bg")) {
                        var node = document.createTextNode("");
                        jQuery(t).parent().after(jQuery(node));
                  //  }
                }
            } else {
                var node = document.createTextNode("");
                jQuery(t).parent().after(jQuery(node));
            }
            n.removeAllRanges();
            var range = document.createRange();
            range.selectNode(node);
            range.collapse(true);
          //  range.select();
            n.addRange(range);
             n.collapse(node, 0);
            return false;
        }else if(t.classList.contains("sde-bg")){//
            var node;
           if(!t.previousSibling||t.previousSibling.nodeType==1){
                node = document.createTextNode("");
               jQuery(t).before(jQuery(node));
           }else if(!t.nextSibling||t.nextSibling){
                node = document.createTextNode("");
               jQuery(t).after(jQuery(node));
           }
            var range = document.createRange();
            range.selectNode(node);
            range.collapse(true);
            n.removeAllRanges();
            n.addRange(range);
            return false;
        }
    };
    /*2018-4-2 jason 编辑器点击事件end*/

    /*2018-4-2 jason 给元素补全textNode，type有left和right两个值 start*/
    _sde.prototype.addTextNode = function (target, type) {
        var node = document.createTextNode(" ");
        if (type == "left") {
            if (!jQuery(target).previousSibling || jQuery(target).previousSibling.nodeType == 1) {
                jQuery(target).before(jQuery(node));
            }
        } else {
            if (!jQuery(target).nextSibling || jQuery(target).nextSibling.nodeType == 1) {
                jQuery(target).after(jQuery(node));
            }
        }
    }
})(jQuery, window.SDE);