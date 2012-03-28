
BVApp.views.PassportPanel = Ext.extend(Ext.Panel,{

    initComponent: function () {
        Ext.apply(this, {
            title: BVApp.Main.getLangString("VeganPassport"),
            iconCls: 'doc2',
            autoDestroy: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("VeganPassport")
            }],
            scroll: true,
            listeners: {
                added: function(container, component,index){
                    var file = 'passport.html';
                    var me = container;
                    BVApp.utils.AppUtils.loadFile(file,function(result){
                        me.update(result);
                    });
                }
            }
        });
        BVApp.views.PassportPanel.superclass.initComponent.call(this);
    }
});