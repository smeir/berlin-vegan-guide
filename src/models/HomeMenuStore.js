Ext.regModel("HomeMenu", {
    fields: ["Text", "Icon"]
});

BVApp.models.HomeMenuStore = Ext.extend(Ext.data.Store, {
    constructor: function (config) {
        if (!config) {
            config = {}
        }
        Ext.apply(config, {
            model: "HomeMenu",
            data: [{
                Text: BVApp.Main.getLangString("Restaurants"),
                Icon: BVApp.utils.AppUtils.isAndroid() ? "restaurants_android.png" : "restaurants.png",
                classID: "restaurants",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Imbiss"),
                Icon: BVApp.utils.AppUtils.isAndroid() ? "imbiss_android.png" : "imbiss.png",
                classID: "imbiss",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Cafes"),
                Icon: BVApp.utils.AppUtils.isAndroid() ? "cafes_android.png" : "cafes.png",
                classID: "cafes",
                disabled: false
            },{
                Text: BVApp.Main.getLangString("IceCafes"),
                    Icon: BVApp.utils.AppUtils.isAndroid() ? "icecafes_android.png" : "icecafes.png",
                classID: "icecafes",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Shopping"),
                Icon: BVApp.utils.AppUtils.isAndroid() ? "shopping_android.png" : "shopping.png",
                classID: "shopping",
                disabled: false
            }],
            autoLoad: true,
            autoDestroy: true
        });
        BVApp.models.HomeMenuStore.superclass.constructor.call(this, config);
    }
});