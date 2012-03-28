/**
 * beinhaltet temporäre Locations für die FavoritenListe, wird gefüllt aus dem FavoriteStore, welche persistent ist
 */
BVApp.models.FavoriteListStore = Ext.extend(BVApp.models.LocationStore, {
    updateFromFavorites: function(){
        var favStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteStoreID);
        console.log("favStore: " + favStore);
        this.removeAll();
        favStore.each(function(record){
            var lat =record.get("lat");
            console.log("favorite found: " + record);
            var locationRecord = BVApp.Main.findLocationByLat(lat);
            if(locationRecord !==null){
                this.insert(0,locationRecord);
            }
        },this);
        this.updateDistance();
        this.sort({
            property: "distance",
            direction: "ASC"
        });
    }
});

new BVApp.models.FavoriteListStore({
    model: 'Restaurant',
    storeId: 'favoriteListStore'
});


