
BVApp.models.Restaurant = Ext.regModel('Restaurant', {
   fields:[       
       "name",
       "nameID",
       "street",
       "citycode",
       "district",
       "lat",
       "long",
       "drive",
       "telephone",
       "mo",
       "tues",
       "wed",
       "thur",
       "fri",
       "sat",
       "sun",
       "openingHoursComment",
       "website",
       "email",
       "vegan",
       "wheelchair",
       "wheelchairWC",
       "dog",
       "childseat",
       "catering",
       "delivery",
       "organic",
       "seatsInside",
       "seatsOutside",
       "comment",
       "tags",
       "dummy",{ // dynamic field, will be calculated
           name: "distance",
           type: "float"
       },{
           name: "distanceStr",  // formated distance for output
           type: "string"
       }
       ]
});