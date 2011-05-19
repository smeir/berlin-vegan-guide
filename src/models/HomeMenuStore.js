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
                Icon: "restaurants.png",
                classID: "restaurants",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Imbiss"),
                Icon: "imbiss.png",
                classID: "imbiss",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Cafes"),
                Icon: "cafes.png",
                classID: "cafes",
                disabled: false
            },{
                Text: BVApp.Main.getLangString("IceCafes"),
                Icon: "icecafes.png",
                classID: "icecafes",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Shopping"),
                Icon: "shopping.png",
                classID: "shopping",
                disabled: false
            }],
            autoLoad: true,
            autoDestroy: true
        });
        BVApp.models.HomeMenuStore.superclass.constructor.call(this, config);
    }
});