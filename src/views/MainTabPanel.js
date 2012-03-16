
BVApp.views.MainTabPanel = Ext.extend(Ext.TabPanel,{    
    tabBar: {
        dock: 'bottom',
        layout: {
            pack: 'justify'
        }
    },

    ui: 'dark',
    cardSwitchAnimation: false,
    scroll:false,
    /**
     * @private
     */
    homePanel: null,
    passportPanel: null,
    favoritesPanel: null,
    recommendationsPanel: null,
    optionPanel: null,

    initComponent: function(){
        this.homePanel = new BVApp.views.HomePanel();
        //this.emergencyPanel = new BVApp.views.EmergencyPanel();
        this.passportPanel = new BVApp.views.PassportPanel();
        if(BVApp.utils.Settings.language=="en"){
            this.passportPanel = new BVApp.views.PassportPanel();
        }else{
          this.recommendationsPanel = new BVApp.views.RecommendationsPanel();
        }

        this.favoritesPanel = new BVApp.views.FavoritesPanel();
        this.optionPanel = new BVApp.views.OptionPanel();

        this.items = [];
        this.items.push(this.homePanel);

        if(this.recommendationsPanel){
            this.items.push(this.recommendationsPanel);
        }else if(this.passportPanel){
            this.items.push(this.passportPanel);
        }
        this.items.push(this.favoritesPanel);
        this.items.push(this.optionPanel);

        //= [,this.favoritesPanel,this.passportPanel,this.optionPanel];

        this.on("cardswitch", function(cmp , newCard, oldCard, index, animated ){
            if(index==2){ //favorites
                if(this.favoritesPanel.getFavoriteList().getStore().getCount()===0){
                    BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("HelpTitle"),BVApp.Main.getLangString("HelpEmptyFavList"));
                }
            }
            if(index==1 && this.recommendationsPanel){ // recomendations
                this.recommendationsPanel.beforeActive();
                if(this.recommendationsPanel.getRecommendationsList().getStore().getCount()===0){
                    BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("HelpTitle"),BVApp.Main.getLangString("HelpEmptyRecommendList"));
                }
            }
        });
        BVApp.views.MainTabPanel.superclass.initComponent.call(this);
    },
    getHomePanel: function(){
        return this.homePanel;
    },
    getFavoritesPanel: function(){
        return this.favoritesPanel;
    },
    getRecommendationsPanel: function(){
        return this.recommendationsPanel;
    }


});