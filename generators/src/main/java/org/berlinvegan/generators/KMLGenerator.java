package org.berlinvegan.generators;

import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.data.spreadsheet.SpreadsheetEntry;
import com.google.gdata.util.AuthenticationException;

import java.util.List;

/**
 * Date: 22.07.12
 * Time: 19:52
 */
public class KMLGenerator extends Generator {
    public static final String XML_HEAD ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    public static final String KML_START ="<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document>";
    public static final String KML_END = "</Document></kml>";

    public KMLGenerator(String username, String password) throws AuthenticationException {
        super(username, password);
    }
    public static void main(String[] args) throws Exception {
        KMLGenerator generator = new KMLGenerator(args[0], args[1]);
        generator.generateKML();
    }

    private void generateKML() throws Exception {
        List<ListEntry> restaurantEntries = null;
        for (SpreadsheetEntry spreadsheet : getSpreadsheetEntries()) {
            String title = spreadsheet.getTitle().getPlainText();
            if (title.equals("Restaurants")){
                restaurantEntries = addEntries(restaurantEntries, spreadsheet);
                final String kmlDocument = getKMLDocument(restaurantEntries);
                writeTextToFile(kmlDocument, "veganmap.kml");
            }
        }
    }

    private String  getKMLDocument(List<ListEntry> entries) {
        StringBuilder builder = new StringBuilder();
        builder.append(XML_HEAD);

        builder.append(KML_START);
        int i=0;
        for (ListEntry entry : entries) {
            String latPos = entry.getCustomElements().getValue("lat");
            String longPos = entry.getCustomElements().getValue("long");
            String name = textEncode(entry.getCustomElements().getValue("name"));
            //if (i < 5) {
                final PlaceMark placeMark = new PlaceMark(name, getDescription(entry), latPos, longPos);
                builder.append(placeMark.toKMLFormat());
                i++;
            //}

        }

        builder.append(KML_END);

        return builder.toString();
    }

    private String getDescription(ListEntry entry) {
        StringBuilder desc = new StringBuilder();
        int vegan = Integer.parseInt(entry.getCustomElements().getValue("veganfreundlich"));
        switch (vegan){
            case 1:
                desc.append("omnivor, vegan nicht deklariert");
                break;
            case 2:
                desc.append("omnivor, vegan deklariert");
                break;
            case 3:
                desc.append("vegetarisch, vegan nicht dekliert");
                break;
            case 4:
                desc.append("vegetarisch, vegan deklariert");
                break;
            case 5:
                desc.append("100 % vegan");
                break;

        }
        desc.append("<br/><br/>Öffnungszeiten:<br/>");
        addDay(entry, "Mo", desc);
        addDay(entry, "Di", desc);
        addDay(entry, "Mi", desc);
        addDay(entry, "Do", desc);
        addDay(entry, "Fr", desc);
        addDay(entry, "Sa", desc);
        addDay(entry, "So", desc);
        return desc.toString();
    }

    private void addDay(ListEntry entry, String day, StringBuilder desc) {
        String openTime = entry.getCustomElements().getValue(day);
        if (openTime == null) {
            openTime = "geschlossen";
        }
        desc.append(day).append(": ").append(openTime).append(" ");
    }


}
class PlaceMark {
    String name;
    String description;
    String latPos;
    String longPos;

    PlaceMark(String name, String description, String latPos, String longPos) {
        this.name = name;
        this.description = description;
        this.latPos = latPos;
        this.longPos = longPos;
    }
    public String toKMLFormat() {
        final StringBuilder builder = new StringBuilder();
        builder.append("<Placemark>\n");
        builder.append("<name>").append(name).append("</name>\n");
        builder.append("<description>").append(description).append("</description>\n");
        builder.append("<Point><coordinates>");
        builder.append(longPos).append(",").append(latPos).append(",0");
        builder.append("</coordinates></Point>\n");
        builder.append("</Placemark>\n");
        return builder.toString();
    }
}
