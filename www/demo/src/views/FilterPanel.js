
BVApp.views.FilterPanel = Ext.extend(Ext.Panel,{
    //config parameter
    type: null,
    filterForm: null,
    constructor: function (a) {
        this.addEvents("back");
        BVApp.views.FilterPanel.superclass.constructor.call(this, a)
    },
    initComponent: function () {
        var me = this;

        this.filterForm = new Ext.form.FormPanel({
            items: [{
                xtype: 'fieldset',
                defaults: { xtype: 'checkboxfield',labelWidth: '80%'},
                items: this.buildItems()
            }
            ]
        });

        Ext.apply(this, {
            scroll: true,
            items: [
                this.filterForm,
                { xtype: "panel",
                    componentCls: "helpdescription",
                    html: BVApp.Main.getLangString("HelpFilterDesc")
                }],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("Filter"),
                items: BVApp.utils.AppUtils.isAndroid() ? null : [{
                    text: BVApp.Main.getLangString("Back"),
                    ui: 'back',
                    handler: this.doBack,
                    scope: this
                }]
            }],
            autoDestroy: true
        });

        BVApp.views.OptionPanel.superclass.initComponent.call(this);
    },
    buildItems: function(){
        var items = new Array();
        items.push({
            label: BVApp.Main.getLangString("FilterNowOpen"),
            checked: BVApp.utils.Settings.filterNowOpen === true,
            listeners: {
                afterrender: function (cmp){
                    cmp.on("check" ,function(cmp){
                        BVApp.utils.Settings.filterNowOpen = true;
                    });
                    cmp.on("uncheck" ,function(cmp){
                        BVApp.utils.Settings.filterNowOpen = false;
                    });
                }
            }
        });
        if(this.type === "restaurants" || this.type === "imbiss" || this.type === "icecafes"){
            if(BVApp.utils.Settings.language !== "en"){ // in english mode only vegan declared is shown
                items.push({
                    label: BVApp.Main.getLangString("FilterVeganDeclared"),
                    checked: BVApp.utils.Settings.filterVeganDeclared,
                    listeners: {
                        afterrender: function (cmp){
                            cmp.on("check" ,function(cmp){
                                BVApp.utils.Settings.filterVeganDeclared = true;
                            });
                            cmp.on("uncheck" ,function(cmp){
                                BVApp.utils.Settings.filterVeganDeclared = false;
                            });
                        }
                    }
                });
            }
            items.push({
                label: BVApp.Main.getLangString("FilterOrganic"),
                checked: BVApp.utils.Settings.filterOrganic,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterOrganic = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterOrganic = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterWheelchair"),
                checked: BVApp.utils.Settings.filterWheelChair,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterWheelChair = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterWheelChair = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterDogsAllowed"),
                checked: BVApp.utils.Settings.filterDogsAllowed,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterDogsAllowed = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterDogsAllowed = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterDelivery"),
                checked: BVApp.utils.Settings.filterDelivery,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterDelivery = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterDelivery = false;
                        });
                    }
                }
            });
        }
        if(this.type === "shopping"){
            items.push({
                label: BVApp.Main.getLangString("FilterOrganicStore"),
                checked: BVApp.utils.Settings.filterShoppingOrganicStore,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingOrganicStore = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingOrganicStore = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterBackedGoods"),
                checked: BVApp.utils.Settings.filterShoppingBakedGoods,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingBakedGoods = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingBakedGoods = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterIcecream"),
                checked: BVApp.utils.Settings.filterShoppingIcecream,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingIcecream = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingIcecream = false;
                        });
                    }
                }
            });
            items.push({
                label: BVApp.Main.getLangString("FilterDrugStore"),
                checked: BVApp.utils.Settings.filterShoppingDrugStore,
                listeners: {
                    afterrender: function (cmp){
                        cmp.on("check" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingDrugStore = true;
                        });
                        cmp.on("uncheck" ,function(cmp){
                            BVApp.utils.Settings.filterShoppingDrugStore = false;
                        });
                    }
                }
            });
        }
        return items;
    },
    doBack: function(){
        this.fireEvent("back");
    }
});