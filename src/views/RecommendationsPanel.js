
BVApp.views.RecommendationsPanel = Ext.extend(Ext.Panel,{
    recommendationsList: null,
    recommendStore:null,
    initComponent: function () {
        // initStore
        this.recommendStore = new BVApp.models.RestaurantStore({
            model: 'Restaurant',
            storeId: 'recommendStore',
            data: []
        });
        var restaurantStore = Ext.StoreMgr.lookup(BVApp.Main.restaurantStoreID);
        restaurantStore.clearFilter(false);
        restaurantStore.filter(restaurantStore.veganDeclaredFilter);
        restaurantStore.filter(restaurantStore.notOmnivorFilter);
        restaurantStore.filter(restaurantStore.nowOpenFilter);
        //this.recommendStore.insert(0,restaurantStore.getRange());

        restaurantStore.each(function(record){
            this.insert(0,record.copy());
        },this.recommendStore);

        /*this.recommendStore.updateDistance();
        this.recommendStore.sort({
            property: "distance",
            direction: "ASC"
        });*/

        this.recommendationsList = new BVApp.views.LimitedList({
            maxItems: BVApp.Main.maxListItems,
            showMoreText: BVApp.Main.getLangString("ListShowMore"),
            store: this.recommendStore,
            itemTpl: BVApp.templates.LocationListItemTemplate
        });
        //this.recommendationsList.bindStoreLimited(this.recommendStore);

        Ext.apply(this, {
            layout: 'fit',
            title: BVApp.Main.getLangString("Recommendations"),
            iconCls: 'bookmark2',
            items: [this.recommendationsList],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("Recommendations")
            }],
           autoDestroy: true
        });
        BVApp.views.RecommendationsPanel.superclass.initComponent.call(this);
    },
    /**
     * @return {Ext.List}
     */
    getRecommendationsList: function(){
      return this.recommendationsList;
    },
    beforeActive: function(){
        /*var store = this.recommendationsList.getStore();
        store.clearFilter(false);
        store.filter(store.veganDeclaredFilter);
        store.filter(store.notOmnivorFilter);
        store.filter(store.nowOpenFilter);
        store.updateDistance();*/

        this.recommendStore.updateDistance();
        this.recommendStore.sort({
            property: "distance",
            direction: "ASC"
        });
    }
});