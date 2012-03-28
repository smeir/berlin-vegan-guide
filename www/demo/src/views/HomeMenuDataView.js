
BVApp.views.HomeMenuDataView = Ext.extend(Ext.DataView, {
    initComponent: function () {
        Ext.apply(this, {
            cls: "homepageMainMenu",
            store: new BVApp.models.HomeMenuStore(),
            tpl: BVApp.templates.HomeMenuTemplate,
            autoHeight: true,
            multiSelect: false,
            overItemCls: "x-view-over",
            itemSelector: "div.main-menu-wrapper",
            pressedCls: "main-menu-wrapper-selected",
            scroll:false,
            pressedDelay: 50
        });
        BVApp.views.HomeMenuDataView.superclass.initComponent.call(this)
    }    
});
