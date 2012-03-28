
BVApp.views.MainPanel = Ext.extend(Ext.Panel,{
    fullscreen: true,
    /* contains the current views, used to filter global back key event,
      so only active view reacts on key*/
    activeView: null,
    determinePositionMask: null,
    /**
     * @private
     */
    mainTabPanel: null,
    restaurantMainPanel: null,
    aboutPanel: null,
    favoriteRestaurantPanel:null,
    recommendRestaurantPanel:null,
    
    initComponent: function () {
        var me = this;
        this.determinePositionMask = new Ext.LoadMask(Ext.getBody(), {msg:BVApp.Main.getLangString("DeterminePosition")});

        this.mainTabPanel = new BVApp.views.MainTabPanel();
        this.restaurantMainPanel = new BVApp.views.LocationMainPanel();
        this.aboutPanel = new BVApp.views.AboutPanel();
        this.favoriteRestaurantPanel = new BVApp.views.LocationPanel();
        this.recommendRestaurantPanel = new BVApp.views.LocationPanel();
         Ext.apply(this, {
            autoDestroy: true,
            layout: "card",
            items: [this.mainTabPanel, this.restaurantMainPanel,this.recommendRestaurantPanel,this.favoriteRestaurantPanel,this.aboutPanel],
            cardSwitchAnimation: {
                type: "slide",
                cover: false
            }
        });
        this.mainTabPanel.getHomePanel().on("categorySelected", function (category) {
            var animation = false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: false};
            }
            this.restaurantMainPanel.showRestaurantList(category);
            this.setActiveItem(this.restaurantMainPanel, animation);
            this.activeView = this.restaurantMainPanel;
        },this);
        // favorite  TODO remove code duplication
        this.mainTabPanel.getFavoritesPanel().getFavoriteList().on("itemtap",function(list,index, item,event ){
            var animation = false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", cover: false};
            }
            var restaurant = list.getStore().getAt(index);
            this.favoriteRestaurantPanel.updateRestaurant(restaurant);
            this.setActiveItem(this.favoriteRestaurantPanel,animation);
            this.activeView = this.favoriteRestaurantPanel;
        },this);

        this.favoriteRestaurantPanel.on("back",function(){
            var animation =false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: true};
            }
            this.mainTabPanel.getFavoritesPanel().getFavoriteList().getSelectionModel().deselectAll();
            this.setActiveItem(this.mainTabPanel, animation);
            this.activeView = this.mainTabPanel;
        },this);
        if (this.mainTabPanel.getRecommendationsPanel() !=null) { // recommend
            this.mainTabPanel.getRecommendationsPanel().getRecommendationsList().on("itemtap", function (list, index, item, event) {
                var animation = false;
                if (BVApp.utils.Settings.animation) {
                    animation = { type:"slide", cover:false};
                }
                var restaurant = list.getStore().getAt(index);
                this.recommendRestaurantPanel.updateRestaurant(restaurant);
                this.setActiveItem(this.recommendRestaurantPanel, animation);
                this.activeView = this.recommendRestaurantPanel;
            }, this);

            this.recommendRestaurantPanel.on("back", function () {
                var animation = false;
                if (BVApp.utils.Settings.animation) {
                    animation = { type:"slide", reverse:true};
                }
                this.mainTabPanel.getRecommendationsPanel().getRecommendationsList().getSelectionModel().deselectAll();
                this.setActiveItem(this.mainTabPanel, animation);
                this.activeView = this.mainTabPanel;
            }, this);
        }

        this.restaurantMainPanel.on("back",function(){
            var animation =false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: true};
            }
            this.setActiveItem(this.mainTabPanel, animation);
            this.activeView = this.mainTabPanel;
        },this);



        this.mainTabPanel.optionPanel.on("about",function(){
            var animation =false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: false};
            }
            this.setActiveItem(this.aboutPanel, animation);
            this.activeView = this.aboutPanel;
        },this);

        this.aboutPanel.on("back",function(){
            var animation =false;
            if(BVApp.utils.Settings.animation){
                animation = { type: "slide", reverse: true};
            }
            this.setActiveItem(this.mainTabPanel, animation);
            this.activeView = this.mainTabPanel;
        },this);
        // register key event for android
        document.addEventListener("backKeyDown",function(){
            me.doBackKeyDown.call(me);
        });

        this.activeView = this.mainTabPanel;
        BVApp.views.MainPanel.superclass.initComponent.call(this);

    },
    getMainTabPanel: function(){
        return this.mainTabPanel;
    },
    doBackKeyDown: function (){
        if(this.activeView === this.mainTabPanel){
            console.log("exitApp:");
            BackButton.exitApp();
        }else{
            // call the "back" method on the current view
            this.activeView.doBack.call(this.activeView);
        }
    }
});