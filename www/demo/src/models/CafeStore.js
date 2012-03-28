
BVApp.models.CafeStore = Ext.extend(BVApp.models.LocationStore, {
});

new BVApp.models.CafeStore({
    model: 'Location',
    storeId: 'cafeStore',
   "data": BVApp.data.CafeStoreData
});