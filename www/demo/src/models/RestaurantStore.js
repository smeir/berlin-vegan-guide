
BVApp.models.RestaurantStore = Ext.extend(BVApp.models.LocationStore, {        
});

var restaurantStoreE = new BVApp.models.RestaurantStore({
    model: 'Restaurant',
    storeId: 'restaurantStore',
    data: BVApp.data.RestaurantStoreData
});