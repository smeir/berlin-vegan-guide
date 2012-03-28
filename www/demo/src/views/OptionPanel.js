

BVApp.views.OptionPanel = Ext.extend(Ext.Panel,{
    optionsForm: null,
    constructor: function (a) {
        this.addEvents("about");
        BVApp.views.OptionPanel.superclass.constructor.call(this, a)
    },
    initComponent: function () {
        /*this.favoritesList = new Ext.List({
            store: "restaurantStore",
            itemTpl: BVApp.templates.LocationListItemTemplate
        });
        */
        var me = this;
        this.optionsForm = new Ext.form.FormPanel({
            items: [{
                xtype: 'togglefield',
                name : 'animation',
                label: BVApp.Main.getLangString("OptionsAnimation"),
                value: BVApp.utils.Settings.animation,
                labelWidth: '40%',
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("change" ,function(slider, thumb, newValue, oldValue){
                            me.updateOptions();
                        });
                    }
                }
            }, {
                xtype: 'fieldset',
                title: BVApp.Main.getLangString("OptionsLanguage"),
                defaults: { xtype: 'radiofield',labelWidth: '40%',name : 'language' },
                items: [{
                    label: BVApp.Main.getLangString("OptionsGerman"),
                    value : 'de',
                    checked: BVApp.utils.Settings.language === 'de',
                    listeners: {
                        afterrender: function (cmp){
                            cmp.on("check" ,function(cmp){
                                BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("OptionsHint","de"), BVApp.Main.getLangString("OptionsPleaseRestart","de"));
                                me.updateOptions();
                            });
                        }
                    }
                },{
                    label: BVApp.Main.getLangString("OptionsEnglish") ,
                    value : 'en',
                    checked: BVApp.utils.Settings.language === 'en',
                    listeners: {
                        afterrender: function (cmp){
                            cmp.on("check" ,function(cmp){
                                BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("OptionsHint","en"), BVApp.Main.getLangString("OptionsPleaseRestart","en"));
                                me.updateOptions();
                            });
                        }
                    }
                }
                ]
            },{
                xtype: 'fieldset',
                title: BVApp.Main.getLangString("OptionsUnits"),
                defaults: { xtype: 'radiofield',labelWidth: '40%',name : 'distanceUnit' },
                items: [{
                    label: BVApp.Main.getLangString("OptionsMetric"),
                    value : 'metric',
                    checked: BVApp.utils.Settings.distanceUnit === 'metric',
                    listeners: {
                        afterrender: function (cmp){
                            cmp.on("check" ,function(cmp){
                                me.updateOptions();
                            });
                        }
                    }
                },{
                    label: BVApp.Main.getLangString("OptionsImperial") ,
                    value : 'imperial',
                    checked: BVApp.utils.Settings.distanceUnit === 'imperial',
                    listeners: {
                        afterrender: function (cmp){
                            cmp.on("check" ,function(cmp){
                                me.updateOptions();
                            });
                        }
                    }
                }
                ]
            }
            ]
        });

        Ext.apply(this, {
            title: BVApp.Main.getLangString("Options"),
            iconCls: 'settings',
            scroll: true,
            items: [this.optionsForm],
            dockedItems: this.createDockedItems(),
            autoDestroy: true

        });

        BVApp.views.OptionPanel.superclass.initComponent.call(this);
    },    
    updateOptions: function(){
       this.optionsForm.updateRecord(BVApp.utils.Settings.getSettingRecord());
        BVApp.utils.Settings.writeSettings();
    },
    showAbout: function(){
        this.fireEvent("about");
    },
    showContact: function(){        
        var subject = "";
        var body ="";
        if(BVApp.utils.AppUtils.isPhoneGap()){
            body += "\n\n\n\n\n";
            body += BVApp.Main.getAppInfoPhoneGapForEMail();         
        }
        BVApp.utils.AppUtils.sendEMail(BVApp.Main.errorEMail,subject,body);
    }
    ,
    createDockedItems : function(){
        var dockedItems;
        if(BVApp.utils.AppUtils.isAndroid()) {
            dockedItems =[{
                dock:'top',
                xtype:'toolbar',
                title:BVApp.Main.getLangString("Options"),
                items:[
                    {
                        xtype:"spacer"
                    },
                    {
                        iconMask:true,
                        iconCls:'mail',
                        handler:this.showContact,
                        scope:this
                    },                    {
                        iconMask:true,
                        iconCls:'info2',
                        handler:this.showAbout,
                        scope:this
                    }
                ]
            }
            ];
        } else {
            dockedItems = [{
                dock:'top',
                xtype:'toolbar',
                title:BVApp.Main.getLangString("Options") + "&nbsp;&nbsp;&nbsp;",
                items:[
                    {
                        text:BVApp.Main.getLangString("OptionsInfo"),
                        handler:this.showAbout,
                        scope:this
                    },
                    {
                        xtype:"spacer"
                    },
                    {
                        text:BVApp.Main.getLangString("Contact"),
                        handler:this.showContact,
                        scope:this
                    }
                ]
            }
            ];
        }
        return dockedItems;
    }
});