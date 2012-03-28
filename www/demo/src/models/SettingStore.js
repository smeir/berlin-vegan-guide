

new Ext.data.Store({
    model: "Setting",
    autoLoad: true,
    storeId: 'settingStore',
    proxy: {
        type: 'localstorage',
        id  : 'settings'
    }
});