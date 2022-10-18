// 右键菜单选项
let search5s = {
    "id": 'search5s',
    "title": "附近5s查询",
    "contexts": ["selection"]
};
let search1m = {
    "id": 'search1m',
    "title": "附近1min查询",
    "contexts": ["selection"]
};
let search5m = {
    "id": 'search5m',
    "title": "附近5min查询",
    "contexts": ["selection"]
};
let search10m = {
    "id": 'search10m',
    "title": "附近10min查询",
    "contexts": ["selection"]
};
let findVideo = {
    "id": 'findVideo',
    "title": "打开对应视频",
    "contexts": ["selection"]
};

// 当应用被安装时将项目添加到 Chrome 的右键菜单中
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create(search5s);
    chrome.contextMenus.create(search1m);
    chrome.contextMenus.create(search5m);
    chrome.contextMenus.create(search10m);
    chrome.contextMenus.create(findVideo);


});
// 判断是否为整数
function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}
// 函数通过将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码 
function fixedEncodeURI(str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
function padding(num) {
    return num < 10 ? '0' + num : num
}
function formatDate(t) {
    var d = new Date(t);
    return d.getFullYear()+ padding(d.getMonth())+ padding(d.getDate())+ 'T'+ 
        padding(d.getHours())+ padding(d.getMinutes())+ padding(d.getSeconds());
}
// 单击上下文菜单项时触发事件
chrome.contextMenus.onClicked.addListener((clickData) => {
    // clickData 单击上下文菜单项时发送的信息
    const timeMap = {
        "search5s" : 5,
        "search1m" : 60,
        "search5m" : 300,
        "search10m" : 600
    };
    if (clickData.menuItemId.startsWith ("search") && clickData.selectionText) {
        // 将用户选择的文本转化为整数
        let selectedText = fixedEncodeURI(clickData.selectionText);        
        let h = selectedText.match('home:([a-z0-9]+)')[1];
        let c = selectedText.match('camera:([a-z0-9]+)')[1];
        let timeStampStr = selectedText.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
        let timeStamp = new Date(timeStampStr[1], timeStampStr[2], timeStampStr[3], timeStampStr[4], timeStampStr[5], timeStampStr[6]);
        let seconds = timeStamp.getSeconds();

        let s = formatDate(timeStamp.setSeconds(seconds-timeMap[clickData.menuItemId]));
        let e = formatDate(timeStamp.setSeconds(seconds+timeMap[clickData.menuItemId]));
        var url = "https://home.camect.com/debug/list_alerts?u=1&h=" + h + "&c=" + c + "&s=" + s +"&e=" + e;
        
        var createData = {
            "url": url
        };
        chrome.tabs.create(createData);
    };

});

