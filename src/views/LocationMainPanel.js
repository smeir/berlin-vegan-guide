
BVApp.views.LocationMainPanel =  Ext.extend(Ext.Panel,{
    /**
     * @private
     */
    restaurantListPanel: null,
    restaurantPanel: null,
    filterPanel:null,
    restaurantStore: null,
    shopStore:null,
    cafeStore:null,

    maxItemsInListView: 30,


    /* restaurant, imbiss...*/
    currentType: null,
    constructor: function (a) {
        this.addEvents("back");
        BVApp.views.LocationMainPanel.superclass.constructor.call(this, a)
    },
    initComponent: function () {
        var me=this;
        this.restaurantListPanel = new BVApp.views.LocationListPanel();
        this.restaurantPanel = new BVApp.views.LocationPanel();
        this.restaurantStore = Ext.StoreMgr.lookup(BVApp.Main.restaurantStoreID);
        this.shopStore = Ext.StoreMgr.lookup(BVApp.Main.shopStoreID);
        this.cafeStore = Ext.StoreMgr.lookup(BVApp.Main.cafeStoreID);

        Ext.apply(this, {
            autoDestroy: true,
            layout: "card",
            items: [this.restaurantListPanel,this.restaurantPanel],
            cardSwitchAnimation: {
                type: "slide",
                cover: false
            }
        });
        this.on("cardswitch",function (container, newCard, oldCard, index, animated){
            //set explizit to hide, on some android devices there are timing errors, so setActiveItem doesn't work
            oldCard.hide();
        },this);
        this.restaurantListPanel.on("back",this.doBack,this);
        this.restaurantListPanel.on("showFilterPanel",this.showFilterPanel,this);
        this.restaurantPanel.on("back",function(){
            var animation = false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: true};
            }
            this.restaurantListPanel.getRestaurantList().getSelectionModel().deselectAll();
            this.setActiveItem(this.restaurantListPanel,animation);
            BVApp.Main.ui.activeView = this.restaurantListPanel;
        },this);
        this.restaurantListPanel.getRestaurantList().on("itemtap",function(list,index, item,event ){
            var animation = false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", cover: false};
            }
            var restaurant = list.getStore().getAt(index);
            this.restaurantPanel.updateRestaurant(restaurant);
            this.setActiveItem(this.restaurantPanel,animation);
            BVApp.Main.ui.activeView = this.restaurantPanel;
        },this);

        BVApp.views.LocationMainPanel.superclass.initComponent.call(this);
    },
    doBack : function(){
        this.fireEvent("back");
    },
    showFilterPanel: function(){
        var animation = false;
        if(BVApp.utils.Settings.animation){
            animation = { type: "slide", cover: false};
        }
        if(this.filterPanel !== null){
            this.remove(this.filterPanel);
        }
        this.filterPanel = new BVApp.views.FilterPanel({
            type: this.currentType
        });
        this.add(this.filterPanel);
        this.filterPanel.on("back",function(){
            var animation = false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: true};
            }
            /*this.updateFilter();
            this.updateDistance();
            var restaurantList =  this.restaurantListPanel.getRestaurantList();
            if(restaurantList.scroller){
                restaurantList.scroller.scrollTo({x:0,y:0},false);
            }*/
            this.showRestaurantList(this.currentType);
            this.setActiveItem(this.restaurantListPanel,animation);
            BVApp.Main.ui.activeView = this.restaurantListPanel;
        },this);
        this.setActiveItem(this.filterPanel,animation);
        BVApp.Main.ui.activeView = this.filterPanel;
    },
    showRestaurantList: function(type){
        this.currentType = type;
        var restaurantList =  this.restaurantListPanel.getRestaurantList();
        restaurantList.bindStore(null);
        this.updateFilter();
        this.updateDistance();
        //this.restaurantStore.clearFilter(true);

        if(restaurantList.scroller){
            restaurantList.scroller.scrollTo({x:0,y:0},false);
        }

        if(type === "restaurants"){
            restaurantList.bindStoreLimited(this.restaurantStore);
            this.restaurantListPanel.setTitle(BVApp.Main.getLangString("Restaurants"));
        }
        else if(type === "imbiss"){
            restaurantList.bindStoreLimited(this.restaurantStore);
            this.restaurantListPanel.setTitle(BVApp.Main.getLangString("Imbiss"));
        }
        else if(type === "icecafes"){
            restaurantList.bindStoreLimited(this.restaurantStore);
            this.restaurantListPanel.setTitle(BVApp.Main.getLangString("IceCafes"));
        }
        else if(type === "shopping"){ 
             restaurantList.bindStoreLimited(this.shopStore);
            this.restaurantListPanel.setTitle(BVApp.Main.getLangString("Shopping"));
        }
        else if(type.indexOf("cafes") !== -1){
            restaurantList.bindStoreLimited(this.cafeStore);
            this.restaurantListPanel.setTitle(BVApp.Main.getLangString("Cafes"));
        }
        if(restaurantList.getStore().getCount()===0){
            BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("HelpTitle"),BVApp.Main.getLangString("HelpEmptyLocationList"));
        }
    },
    updateDistance: function(){        
        if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
            this.restaurantStore.updateDistance();
            this.restaurantStore.sort({
                property: "distance",
                direction: "ASC"
            });
        }else if(this.currentType === "shopping"){
            this.shopStore.updateDistance();
            this.shopStore.sort({
                property: "distance",
                direction: "ASC"
            });
        }else if(this.currentType === "cafes"){
            this.cafeStore.updateDistance();
            this.cafeStore.sort({
                property: "distance",
                direction: "ASC"
            });

        }
    },
    updateFilter: function(){
        this.restaurantStore.clearFilter(false);
        this.cafeStore.clearFilter(false);
        this.shopStore.clearFilter(false);
        if(this.currentType === "restaurants"){
            this.restaurantStore.filter([{
                property     : 'tags',
                value        : 'Restaurant',
                anyMatch     : true,
                caseSensitive: true
            }]);
        }
        if(this.currentType === "imbiss"){
            this.restaurantStore.filter([{
                property     : 'tags',
                value        : 'Imbiss',
                anyMatch     : true,
                caseSensitive: true
            }]);
        }
        if(this.currentType === "icecafes"){
        this.restaurantStore.filter([{
                property     : 'tags',
                value        : 'Eiscafe',
                anyMatch     : true,
                caseSensitive: true
            }]);
        }
        /*if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
            this.restaurantStore.filter([this.restaurantStore.noReviewFilter]); // don't show location without review
        } */
        if(BVApp.utils.Settings.filterNowOpen){
            if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
                this.restaurantStore.filter([this.restaurantStore.nowOpenFilter])
            }else if(this.currentType === "shopping"){
                this.shopStore.filter([this.shopStore.nowOpenFilter]);
            }else if(this.currentType === "cafes"){
                this.cafeStore.filter([this.cafeStore.nowOpenFilter]);
            }
        }
        if(BVApp.utils.Settings.filterVeganDeclared){
            if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
                this.restaurantStore.filter([this.restaurantStore.veganDeclaredFilter])
            }
        }
        if(BVApp.utils.Settings.filterOrganic){
            if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
                this.restaurantStore.filter([this.restaurantStore.organicFilter])
            }
        }
        if(this.currentType === "restaurants" || this.currentType === "imbiss" || this.currentType === "icecafes"){
            if(BVApp.utils.Settings.filterWheelChair){
                this.restaurantStore.filter([this.restaurantStore.wheelchairFilter]);
            }
            if(BVApp.utils.Settings.filterDogsAllowed){
                this.restaurantStore.filter([this.restaurantStore.dogsAllowedFilter]);
            }
            if(BVApp.utils.Settings.filterDelivery){
                this.restaurantStore.filter([this.restaurantStore.deliveryFilter]);
            }
        }

        if(this.currentType === "shopping"){
            if(BVApp.utils.Settings.filterShoppingBakedGoods){
                this.shopStore.filter([{
                    property     : 'tags',
                    value        : 'Backwaren',
                    anyMatch     : true,
                    caseSensitive: true
                }]);
            }
            if(BVApp.utils.Settings.filterShoppingDrugStore){
                this.shopStore.filter([{
                    property     : 'tags',
                    value        : 'Drogerie',
                    anyMatch     : true,
                    caseSensitive: true
                }]);
            }
            if(BVApp.utils.Settings.filterShoppingOrganicStore){
                this.shopStore.filter([{
                    property     : 'tags',
                    value        : 'Bio',
                    anyMatch     : true,
                    caseSensitive: true
                }]);
            }
            if(BVApp.utils.Settings.filterShoppingIcecream){
                this.shopStore.filter([{
                    property     : 'tags',
                    value        : 'Eis',
                    anyMatch     : true,
                    caseSensitive: true
                }]);
            }
        }
    },
    /**
     * @return  BVApp.views.RestaurantListPanel
     */
    getRestaurantListPanel: function(){
      return this.restaurantListPanel;  
    }


});
