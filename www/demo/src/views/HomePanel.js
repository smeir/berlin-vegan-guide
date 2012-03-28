
BVApp.views.HomePanel = Ext.extend(Ext.Panel,{
    homeMenuDataView: null,
    initComponent: function () {
        this.homeMenuDataView = new BVApp.views.HomeMenuDataView();
        Ext.apply(this, {
            title: BVApp.Main.getLangString("Home"),
            iconCls: 'home',
            autoDestroy: true,            
            layout: 'fit',
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("AppTitle")
            }],
            items: [this.homeMenuDataView]
        });
        this.homeMenuDataView.on("itemtap", function (dataview, index, item, event) {
            var type;
            if(item.className.indexOf("restaurants") !== -1) type= "restaurants";
            if(item.className.indexOf("imbiss") !== -1) type= "imbiss";
            if(item.className.indexOf("cafes") !== -1) type= "cafes";
            if(item.className.indexOf("icecafes") !== -1) type= "icecafes";
            if(item.className.indexOf("shopping") !== -1) type= "shopping";
            this.fireEvent("categorySelected",type);
        },this);        
        BVApp.views.HomePanel.superclass.initComponent.call(this);
    },
    constructor: function (a) {
        this.addEvents("categorySelected");
        BVApp.views.HomePanel.superclass.constructor.call(this, a)
    },
    getRestaurantPanel: function(){
        return this.items.get(1);
    },
    getHomePanel: function(){
        return this.items.get(0);
    }
});

