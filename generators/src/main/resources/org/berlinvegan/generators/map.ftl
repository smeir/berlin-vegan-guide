<#-- @ftlvariable name="i18n" type="java.util.ResourceBundle" -->
<#-- @ftlvariable name="openTimesI18N" type="java.lang.String" -->
<#-- @ftlvariable name="reviewbase" type="java.lang.String" -->
<#-- @ftlvariable name="restaurants" type="org.berlinvegan.generators.Restaurant[]" -->
<#-- @ftlvariable name="restaurant" type="org.berlinvegan.generators.Restaurant" -->
<script type='text/javascript' src='http://maps.google.com/maps/api/js?sensor=false'></script>
<script type='text/javascript' src='http://www.berlin-vegan.de/custom/maphelper.js'></script>
<script type='text/javascript'>

    var infowindow = new google.maps.InfoWindow({maxWidth: 350});
    var markersArray = [];
    var map;
    function initialize() {
        var latlng = new google.maps.LatLng(52.518611, 13.388056);
        var myOptions = {
            zoom: 12,
            center: latlng,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	<#assign i=0>
	<#list restaurants as restaurant>
		<#if restaurant.getLatCoord()??>
            latlng = new google.maps.LatLng(${restaurant.getLatCoord()},${restaurant.getLongCoord()});
            markersArray[${i}] = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "${restaurant.getName()}",
                bv_dog: "${restaurant.getDog()}",
                bv_bio: "${restaurant.getOrganic()}",
                bv_rollstuhl: "${restaurant.getHa()}",
                bv_vegan: "${restaurant.getVegan()}",
                bv_open: ["${restaurant.getOtMon()}","${restaurant.getOtTue()}","${restaurant.getOtWed()}","${restaurant.getOtThu()}","${restaurant.getOtFri()}","${restaurant.getOtSat()}","${restaurant.getOtSun()}"]
            });
            google.maps.event.addListener(markersArray[${i}], 'click', function () {
                var infoStr = "<b>${restaurant.getName()}</b><br/><br/>${restaurant.getStreet()}, ${restaurant.getCityCode()} ${restaurant.getDistrict()}";
                infoStr += "<br/><br/><b>${i18n.openTimes}:</b><br/><br/> ${restaurant.getOpenTimesHTML()}";
				<#if restaurant.getReviewURL()??>
					infoStr += "<br/><br/><a href='${reviewbase}${restaurant.getReviewURL()}'>${restaurant.getName()} Restaurantskritik</a>";
				</#if>
				<#if restaurant.getComment()??>
					infoStr += "<br/><br/>${restaurant.getComment()}";
				</#if>
				infoStr = "<div>" + infoStr + "</div><br/>";
                infowindow.setContent(infoStr);
                infowindow.open(map, markersArray[${i}]);
            });
			<#assign i = i +1>
		</#if>
	</#list>
    }
</script>

<input id="opencheckbox" onChange="updateMarkers(markersArray);" type="checkbox">jetzt geöffnet</input>
<input id="vegandeclarecheckbox" onChange="updateMarkers(markersArray);" type="checkbox">vegan deklariert</input>
<input id="biocheckbox" onChange="updateMarkers(markersArray);" type="checkbox">Bio</input>
<input id="rollstuhlcheckbox" onChange="updateMarkers(markersArray);" type="checkbox">Rollstuhl geeignet</input>
<input id="dogcheckbox" onChange="updateMarkers(markersArray);" type="checkbox">Hunde erlaubt</input>

<div id="map_canvas" style="margin-top:5px;line-height:1.0em; width:850px; height:630px"></div>
Die Karte umfasst <b>${restaurants?size}</b> Restaurants/Bistros/Cafes