
BVApp.templates.RestaurantDetailsTemplate = new Ext.XTemplate(
        '<div class="details">' +
                '<div class="details-title">{[this.getLangString("DetailsContact")]}</div>' +
                '<div class="details-fieldset">' +
                '<div class="details-field">' +
                    '<div class="details-label">{[this.getLangString("DetailsAddress")]}</div>' +
                    '<div class="details-value">{street}<br/>{citycode} Berlin</div>' +
                '</div>'+
                '<tpl if="telephone.length &gt; 0 ">' +
                    '<div class="details-field">' +
                        '<div class="details-label">{[this.getLangString("DetailsTelephone")]}</div>' +
                        '<div class="details-value"><a href="tel:{telephone}"><img width="20px" height="20px" src="resources/images/phone2.png" alt=""/> {telephone}</a></div>' +
                    '</div>' +
                '</tpl>'+
                '</div>' +

                '<div class="details-title">{[this.getLangString("DetailsOpenTimes")]}</div>' +
                    '<div class="details-fieldset">'+
                 '<tpl for="openTimes">' +
                        '<div class="details-field">' +
                        '<div class="details-label">{day}</div>' +
                        '<div class="details-value">{time}</div></div>' +
                 '</tpl>' +
                '</div>' +
                '<tpl if="vegan &gt; 0">'+
                    '<div class="details-title">{[this.getLangString("DetailsMisc")]}</div>' +
                    '<div class="details-fieldset">' +
                    '<div class="details-field">' +
                    '<div class="details-value-full"><ul>' +
                    '<tpl if="vegan == 5">' +
                        '<li>{[this.getLangString("DetailsVegan5")]}</li>',
                    '</tpl>' +
                    '<tpl if="vegan == 4">' +
                        '<li>{[this.getLangString("DetailsVegan4")]}</li>',
                    '</tpl>' +
                    '<tpl if="vegan == 3">' +
                        '<li>{[this.getLangString("DetailsVegan3")]}</li>',
                    '</tpl>' +
                    '<tpl if="vegan == 2">' +
                        '<li>{[this.getLangString("DetailsVegan2")]}</li>',
                    '</tpl>' +
                            '<tpl if="vegan == 1">' +
                            '<li>{[this.getLangString("DetailsVegan1")]}</li>',
                    '</tpl>' +
                    '<tpl if="organic == 1">' +
                        '<li>{[this.getLangString("DetailsOrganic")]}<br/>',
                    '</tpl>' +
                    '<tpl if="wheelchair == 1">' +
                        '<li>{[this.getLangString("DetailsWheelchair")]}</li>',
                    '</tpl>' +
                    '<tpl if="!this.isEmpty(wheelchair) && wheelchair != 1">' +
                        '<li>{[this.getLangString("DetailsNotWheelchair")]}</li>',
                    '</tpl>' +
                    '<tpl if="wheelchairWC == 1">' +
                        '<li>{[this.getLangString("DetailsWCWheelchair")]}</li>',
                    '</tpl>' +
                    '<tpl if="wheelchairWC == 0 && wheelchair == 1">' +
                        '<li>{[this.getLangString("DetailsWCNotWheelchair")]}</li>',
                    '</tpl>' +
                    '<tpl if="childseat == 1">' +
                        '<li>{[this.getLangString("DetailsChildSeat")]}</li>',
                    '</tpl>' +
                    '<tpl if="dog == 1">' +
                        '<li>{[this.getLangString("DetailsDogsAllowed")]}</li>',
                    '</tpl>' +
                    '<tpl if="delivery == 1">' +
                        '<li>{[this.getLangString("DetailsDelivery")]}</li>',
                    '</tpl>' +
                    '<tpl if="catering == 1">' +
                        '<li>{[this.getLangString("DetailsCatering")]}</li>',
                    '</tpl>' +
                    '</ul></div>' +
                    '</div>' +
                    '</div>' +
                 '</tpl>'+
        '</div>',{
    compiled: true,
    getLangString: function(key){
        return BVApp.Main.getLangString(key);
    },
    isEmpty: function( inputStr ) {
        if ( null === inputStr || "" === inputStr ) {
            return true;
        }
        return false;
    }
}
);
/*
'<div class="details-title">{[this.getLangString("DetailsBVG")]}</div>' +
                '<div class="details-fieldset">' +
                '<div class="details-field">' +
                '<div class="details-value">{drive}'+
                '</div>' +
                '</div>' +
                '</div>' +


'<div class="details-fieldset"><div class="details-field">' +
                        '<a href="http://maps.google.com/maps?daddr={lat},{long}&saddr={currentLat},{currentLong}">{[this.getLangString("DetailsShowRoute")]}</a>'+
                        '</div></div>'+
        */