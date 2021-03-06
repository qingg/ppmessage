Ctrl.$sheetheader = (function() {

    var $device = Service.$device;

    return {
        onSheetHeaderInit: onSheetHeaderInit,
        
        getHeaderTitle: getHeaderTitle,
        onSheetHeaderClicked: onSheetHeaderClicked,
        setHeaderTitle: setHeaderTitle,
        
        minimize: minimize,
        closed: closed,
        
        incrUnread: incrUnread,
        decrUnread: decrUnread,
    };

    ///////// Implenmentation ///////
    function minimize() {

        // We disable body scroll when user click launcher in mobile browser,
        // So we need to enable it again when the user press minimize button
        // @see `launcherctrl.js` `showMessageBox` methods
        if ($device.isIOS()) {
            $device.enableScroll();
        }

        View.$launcher.showLauncher( View.$launcher.STATE.NORMAL );
        View.$conversation.hide();

        // Cancel all sechedule tasks
        Service.$schedule.cancelAll();
        Service.$sheetHeader.close(false);

        cancelAnyWaitingToCreateConversations();

        // We should enter quick message mode when minimize
        if ( View.$settings.getLaunchStyle().mode.toLowerCase() === View.Settings.LAUNCH_MODE.NORMAL ) {
            Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.QUICK_MESSAGE );   
        }

    }

    function getHeaderTitle() {
        return Service.$sheetHeader.getHeaderTitle();
    }

    function onSheetHeaderClicked() {
        Ctrl.$emojiSelector.get().showSelector(false);
    }

    function setHeaderTitle(title) {
        title = title || getHeaderTitle();
        Service.$sheetHeader.setHeaderTitle(title);
        View.$sheetHeader.setTitle(title);
    }

    function closed() {
        return Service.$sheetHeader.closed();
    }

    function onSheetHeaderInit() {
        Service.$sheetHeader.asyncGetHeaderTitle(function(title) {
            setHeaderTitle(title);
        });

        // decide should show group button, when app init
        Service.$conversationManager.asyncGetList(function(conversationList) {
            var len = (conversationList || []).length;
            // more than one conversations, so show `conversations` button in the sheetHeader
            if ( len > 1 ) {
                View.$sheetHeader.showGroupButton();
            }
        });
    }

    function incrUnread() {
        Service.$sheetHeader.incrUnreadCount();
        View.$sheetHeader.setUnreadCount(Service.$sheetHeader.unreadCount());
    }

    function decrUnread( count ) {
        Service.$sheetHeader.decrUnreadCount ( count );
        View.$sheetHeader.setUnreadCount(Service.$sheetHeader.unreadCount());
    }

    function cancelAnyWaitingToCreateConversations() {
        Ctrl.$conversationPanel.stopPolling();
    }
    
})();
