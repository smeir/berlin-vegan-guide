
/**
 * depends on LimitedList , showMore is a flag for the "show more" button
 */
BVApp.templates.LocationListItemTemplate = new Ext.XTemplate(
        '<tpl if="lat != 0"><div class="row-section"><div class="row-label">{name} </div>',
        '<div class="row-sublabel">{street}</div>',
        '<div class="row-distance">{distanceStr}</div>' ,
        '<div class="row-arrow"></div></div></tpl>',
        '<tpl if="showMore"><div class="row-section"><center><div class="row-label">{name}</div></center></div></tpl>',{
        compiled: true
        }
);
/*
 '<tpl if="lat != 0"><div class="row-section"><div class="row-label row-star{vegan}">{name} </div>'
    */