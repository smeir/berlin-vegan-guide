
BVApp.views.FavoritesPanel = Ext.extend(Ext.Panel,{
    favoriteList: null,
    initComponent: function () {
        this.favoriteList = new Ext.List({
            store: BVApp.Main.favoriteListStoreID,
            itemTpl: BVApp.templates.LocationListItemTemplate
        });
        
        Ext.apply(this, {
            layout: 'fit',
            title: BVApp.Main.getLangString("Favorites"),
            iconCls: 'favorites',
            items: [this.favoriteList],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: BVApp.Main.getLangString("Favorites")
            }],
           autoDestroy: true
        });
        BVApp.views.FavoritesPanel.superclass.initComponent.call(this);
    },
    /**
     * @return {Ext.List}
     */
    getFavoriteList: function(){
      return this.favoriteList;
    }
});