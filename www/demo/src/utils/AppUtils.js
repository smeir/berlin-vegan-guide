
BVApp.utils.AppUtils = {


    android : false,
    //public
    loadFile: function(fileName,callback){
        console.log("loadFile");
        callback(BVApp.models.Data[fileName]);
        /* Ext.Ajax.request({
            url: fileName,
            success: function(response, opts) {
                callback(response.responseText);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
                */
    },
    sendEMail: function(email,subject,body){
        console.log("enter sendEMail");
        if(this.isPhoneGap()){
            if(this.isIPhone()){
             window.plugins.emailComposer.showEmailComposer(subject,body,email);
            }else if(this.isAndroid()){                
                var extras = {};
                extras[WebIntent.EXTRA_SUBJECT] = subject;
                extras[WebIntent.EXTRA_TEXT] = body;
                extras[WebIntent.EXTRA_EMAIL] = email;
                window.plugins.webintent.startActivity({
                    action: WebIntent.ACTION_SEND,
                    type: 'text/plain',
                    extras: extras
                }, function() {
                    console.log("sendEMail:success");
                }, function() {
                    console.log("sendEMail:error");
                });
            }
        }else{
            this.alertMessage(BVApp.Main.getLangString("OptionsHint"),BVApp.Main.getLangString("EMailOnlyInNativeApp"));
        }

    },
    dialTelNumber: function(number){
        console.log("enter dialTelNumber");
        if(this.isAndroid()){
            window.plugins.webintent.startActivity({
                action: WebIntent.ACTION_DIAL,
                url: "tel:" + number
            }, function() {
                console.log("dialNumber:success");
            }, function() {
                console.log("dialNumber:error");
            });
        }
    },
    doNavigation: function(lat,lon){
        console.log("enter doNavigation");
        if(this.isAndroid()){
            window.plugins.webintent.startActivity({
                action: WebIntent.ACTION_VIEW,
                url: "geo:" + lat + "," +lon + "?z=20"
            }, function() {
                console.log("doNavigation:success");
            }, function() {
                console.log("doNavigation:error");
            });
        }
    },
    isIPhone: function(){
        return device.name.indexOf("iPhone") !== -1 || device.platform.indexOf("iPhone") !== -1;
    },
    isAndroid: function(){
        return this.android;
    },
    isPhoneGap: function(){
        return (typeof device !== "undefined");
    },
    alertMessage: function(title,message){
        if(this.isPhoneGap()){
            navigator.notification.alert(message,Ext.emptyFn,title);
            //Ext.Msg.alert(title,message, Ext.emptyFn);
        }else{
            Ext.Msg.alert(title,message, Ext.emptyFn);
        }

    },
    getUserLanguage: function(){
        /*PhoneGap on Android would always return EN in navigator.*language.
         so parse userAggent
         UserAgent: Mozilla/5.0 (Linux; U; Android 2.3.3; de-de; Nexus S Build/GRI54)
         AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
         */
            
        var lang ="de";
return lang;
        if(navigator.userAgent.match(/android/i)){
            lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i)[1];
        }else{
            if(navigator.language.indexOf("en") !== -1){
                lang = "en";
            }

        }
        return lang;
    }
    /*,
    loadGoogleMaps: function(){
        var e = document.createElement("script");
        e.src = "http://maps.google.com/maps/api/js?sensor=true";
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }*/
};
