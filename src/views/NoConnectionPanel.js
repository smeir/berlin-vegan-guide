
BVApp.views.NoConnectionPanel = Ext.extend(Ext.Panel,{
    fullscreen: true,
    reloadButton: null,

    initComponent: function () {
        var me = this;
        // BVApp.Main isn't initialized so we have to use the direct translation map
        var lang = BVApp.utils.AppUtils.getUserLanguage();
        var title = BVApp.utils.Locales[lang]["NoConnectionTitle"];
        var noConnectionText = BVApp.utils.Locales[lang]["NoConnection"];
        var reloadButtonText = BVApp.utils.Locales[lang]["TryReload"];
        this.reloadButton = new Ext.Button({
            text: reloadButtonText,
            ui  : 'confirm',
            width: "10em",
            handler: this.doReload

        });
        Ext.apply(this, {
            autoDestroy: true,
            cls: "noConnectionPanel",
            layout: {
                type : 'vbox'
            },
            items: [{
                html: noConnectionText,
                style: "padding:2em 1em 3em 1em"

            },
                this.reloadButton
            ],
            dockedItems: [{
                    dock : 'top',
                    xtype: 'toolbar',
                    title: title
                }
            ]
        });

        BVApp.views.NoConnectionPanel.superclass.initComponent.call(this);

    },
    doReload : function (){
        window.location.href = "index.html";
    }
});