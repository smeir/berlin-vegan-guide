
BVApp.views.LocationListPanel = Ext.extend(Ext.Panel,{
    restaurantList: null,
    constructor: function (a) {
        this.addEvents("back");
        this.addEvents("showFilterPanel");
        BVApp.views.LocationListPanel.superclass.constructor.call(this, a)
    },
    initComponent: function () {
        var me = this;

        this.restaurantList = new BVApp.views.LimitedList({
            maxItems: BVApp.Main.maxListItems,
            showMoreText: BVApp.Main.getLangString("ListShowMore"),
            store: "restaurantStore",
            itemTpl: BVApp.templates.LocationListItemTemplate
        });
        var toolBarItems = [];
        if(!BVApp.utils.AppUtils.isAndroid()){ // add back button on non android platforms
            toolBarItems.push({
                text: BVApp.Main.getLangString("Menu"),
                ui: 'back',
                handler: this.doBack,
                scope: this
            });
        }
        toolBarItems.push({
            xtype: "spacer"
        },
            //    { iconMask: true, iconCls: 'berlinmap' },
        {
            iconMask: true,
            iconCls: 'organize',
            handler: this.showFilterPanel,
            scope: this
        });
        Ext.apply(this, {
            layout: 'fit',
            items: [this.restaurantList],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                items: toolBarItems

            }]
        });

        BVApp.views.LocationListPanel.superclass.initComponent.call(this)

    },

    doBack: function(button,event){       
        this.fireEvent("back");
    },
    showFilterPanel: function(button,event){       
        this.fireEvent("showFilterPanel");
    },
    /**
     * @return {Ext.List}
     */
    getRestaurantList: function(){
      return this.restaurantList;
    },    
    /**
     * @param title for the topbar
     */
    setTitle: function(title){
        // toolbar
        this.getDockedItems()[0].setTitle(title);
    }
});