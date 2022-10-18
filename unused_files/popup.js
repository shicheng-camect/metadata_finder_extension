$(function () {
    // 使用chrome.storageAPI 来存储、检索和跟踪用户数据的更改。
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
    });
    // 当用户点击支出按钮时触发事件
    $('#spendAmount').click(() => {
        // 首先获取已经存储的数据
        chrome.storage.sync.get(['total', 'limit'], (budget) => {
            // 重新计算总支出
            let newTotal = 0;
            if (budget.total) {
                newTotal += parseInt(budget.total);
            }
            // 获取输入的金额计算总支出
            let amount = $('#amount').val();
            if (amount) {
                newTotal += parseInt(amount);
            }
            // 将最新的计算的总支出存储起来
            chrome.storage.sync.set({ 'total': newTotal }, () => {
                if (amount && newTotal >= budget.limit) {
                    // 创建并显示通知
                    let Options = {
                        type: "basic",
                        iconUrl: "images/jjy64.png",
                        title: "过度消费警告!",
                        message: "你的消费支出已经达到限额，请理性消费！"
                    };
                    // limitNotification 通知标识符。如果没有设置或为空，将自动生成一个 ID。
                    chrome.notifications.create(Options);

                }
            });
            // 按钮动画
            $("#spendAmount").addClass("onclic", 50, validate());
            // 更新界面
            $('#total').text(newTotal);
            $('#amount').val('');
        });
    });

    // 按钮动画样式
    function validate() {
        setTimeout(() => {
            $("#spendAmount").removeClass("onclic");
            $("#spendAmount").addClass("validate", 50, callback());
        }, 500);
    }
    function callback() {
        setTimeout(() => {
            $("#spendAmount").removeClass("validate");
        }, 500);
    }
});

