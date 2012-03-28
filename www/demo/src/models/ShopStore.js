
BVApp.models.ShopStore = Ext.extend(BVApp.models.LocationStore, {
});

new BVApp.models.ShopStore({
    model: 'Location',
    storeId: 'shopStore',
     "data": BVApp.data.ShopStoreData
});