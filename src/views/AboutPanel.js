
BVApp.views.AboutPanel = Ext.extend(Ext.Panel,{
    constructor: function (a) {
        this.addEvents("back");
        BVApp.views.AboutPanel.superclass.constructor.call(this, a)
    },
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            autoDestroy: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("OptionsInfo"),
                items: BVApp.utils.AppUtils.isAndroid() ? null : [{
                    text: BVApp.Main.getLangString("Back"),
                    ui: 'back',
                    handler: this.doBack,
                    scope: this
                }]
            }],
            scroll: true,
            listeners: {
                added: function(container, component,index){
                    var file = 'about_' + BVApp.utils.Settings.language +'.html';
                    var me = container;
                    BVApp.utils.AppUtils.loadFile(file,function(result){
                        me.update(result);
                    });
                }
            }
        });

        BVApp.views.AboutPanel.superclass.initComponent.call(this);


    },
    doBack : function(){
        this.fireEvent("back");
    }
});