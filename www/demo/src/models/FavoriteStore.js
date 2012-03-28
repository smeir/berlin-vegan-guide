/** this one is persistent
 */
BVApp.models.FavoriteStore = Ext.extend(BVApp.models.LocationStore, {
});
new BVApp.models.FavoriteStore({
    model: 'Favorite',
    autoLoad: true,
    storeId: BVApp.Main.favoriteStoreID,
    proxy: {
        type: 'localstorage',
        id  : 'favorites'
    }
});