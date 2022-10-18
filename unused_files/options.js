$(function () {
    // 获取当前限额
    chrome.storage.sync.get('limit', (budget) => {
        $('#limit').val(budget.limit);
    });
    // 点击保存按钮
    $('#saveLimit').click(() => {
        let limit = $('#limit').val();
        if (limit) {
            // 设置最新限额
            chrome.storage.sync.set({ 'limit': limit }, () => {
                close();
            });
        }
    });
    // 点击重置按钮
    $('#resetTotal').click(() => {
        $('#limit').val('');
        chrome.storage.sync.set({ 'total': 0 }, () => {

            let Options = {
                type: "basic",
                iconUrl: "images/jjy64.png",
                title: "重置限额",
                message: "重置限额为0！"
            };

            chrome.notifications.create(Options);

        });
    });
});