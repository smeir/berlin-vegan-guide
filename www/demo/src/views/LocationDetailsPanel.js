
BVApp.views.LocationDetailsPanel = Ext.extend(Ext.Panel,{

    initComponent: function () {
        Ext.apply(this, {
            autoDestroy: true,
            scroll: 'vertical',
            tpl: BVApp.templates.RestaurantDetailsTemplate
        });
        BVApp.views.LocationDetailsPanel.superclass.initComponent.call(this);
    }

});