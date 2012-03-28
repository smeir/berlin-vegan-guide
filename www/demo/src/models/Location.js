
Ext.regModel('Location', {
   "fields":[           
       "name",
       "nameID",
       "tags",
       "street",
       "citycode",
       "lat",
       "long",
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
       "wheelchair",
       "comment",
       { // dynamic field, will be calculated
           name: "distance",
           type: "float"
       },{
           name: "distanceStr",  // formated distance for output
           type: "string"
       }
   ]
});