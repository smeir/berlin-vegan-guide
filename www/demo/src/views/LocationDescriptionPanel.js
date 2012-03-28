
BVApp.views.LocationDescriptionPanel = Ext.extend(Ext.Panel,{

    initComponent: function () {
        Ext.apply(this, {
            autoDestroy: true,
            scroll: 'vertical',
            tpl: BVApp.templates.RestaurantDescriptionTemplate
        });
        BVApp.views.LocationDescriptionPanel.superclass.initComponent.call(this);
    }

});