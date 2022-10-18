// 右键菜单选项
let search5s = {
    "id": 'search5s',
    "title": "metadata页面查询",
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
    chrome.contextMenus.create(findVideo);
});

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

function formatVideoDate(t) {
        var d = new Date(t);
    return d.getFullYear()+ '-' + padding(d.getMonth()) + '-' + padding(d.getDate())+ ' '+
        padding(d.getHours()) + ':' + padding(d.getMinutes()) + ':' + padding(d.getSeconds());
}

function formatVideoDateToDay(t) {
        var d = new Date(t);
    return d.getFullYear()+ '-' + padding(d.getMonth()) + '-' + padding(d.getDate());
}

chrome.contextMenus.onClicked.addListener((clickData) => {
    // const timeMap = {
    //     "search5s" : 5,
    //     "search1m" : 60,
    //     "search5m" : 300,
    //     "search10m" : 600
    // };
    let selectedText = fixedEncodeURI(clickData.selectionText);
    let timeStampStr = selectedText.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
    let timeStamp = new Date(timeStampStr[1], timeStampStr[2], timeStampStr[3], timeStampStr[4], timeStampStr[5], timeStampStr[6]);
    let vDate = formatVideoDateToDay(timeStamp);
    let videoFile = selectedText.match(/(2\d)?([a-zA-Z0-9_.-]*mp4)/)[2];

    if (clickData.menuItemId.startsWith ("search") && clickData.selectionText) {
        // 将用户选择的文本转化为整数
        let h = selectedText.match('home:([a-z0-9]+)')[1];
        let c = selectedText.match('camera:([a-z0-9]+)')[1];
        let seconds = timeStamp.getSeconds();
        // let s = formatDate(timeStamp.setSeconds(seconds-timeMap[clickData.menuItemId]));
        // let e = formatDate(timeStamp.setSeconds(seconds+timeMap[clickData.menuItemId]));
        let fDate = formatVideoDate(timeStamp.setSeconds(seconds));
        // var url = "https://home.camect.com/debug/list_alerts?u=1&h=" + h + "&c=" + c + "&s=" + s +"&e=" + e;
        var url = "https://home.camect.com/debug/list_alerts?u=1&h=" + h + "&c=" + c + "&pb_name=" + videoFile + ".pbtxt";
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,
                {
                    message: "copyText",
                    textToCopy: fDate,
                }, function(response) {})
        })
        var createData = {
            "url": url
        };
        chrome.tabs.create(createData);
    };
    if (clickData.menuItemId.startsWith ("findVideo") && clickData.selectionText) {
        let vDate = formatVideoDateToDay(timeStamp);
        var url = "https://cbj.my.to:21980/video/" + vDate + "/" + videoFile
        var createData = {
            "url": url
        };
        chrome.tabs.create(createData);
    };
});

