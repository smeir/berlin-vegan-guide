package org.berlinvegan.generators;

import com.google.gdata.util.AuthenticationException;
import freemarker.template.Configuration;
import freemarker.template.Template;

import java.io.File;
import java.io.FileWriter;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

/**
 * User: smeier
 * Date: 3/30/13
 * Time: 10:09 PM
 */
public class MapGenerator extends Generator {
    public static final String REVIEW_BASE_LOCATION = "/berlin/restaurantkritiken/";
    private final String mapFileLocation;

    public MapGenerator(String username, String password, String mapFileLocation) throws AuthenticationException {
        super(username, password);
        this.mapFileLocation = mapFileLocation;
    }

    public static void main(String[] args) throws Exception {
        MapGenerator generator = new MapGenerator(args[0], args[1],args[2]);
        generator.generateMap("de");
    }

    private void generateMap(String language) throws Exception {
        ResourceBundle bundle =   ResourceBundle.getBundle("i18n",new Locale(language));

        final ArrayList<Restaurant> restaurants = getRestaurants();
        // Configuration
        Writer file = null;
        Configuration cfg = new Configuration();

        try {
            // Set Directory for templates
            cfg.setClassForTemplateLoading(MapGenerator.class,"");
            // load template
            Template template = cfg.getTemplate("map.ftl");

            // data-model
            Map<String, Object> input = new HashMap<String, Object>();
            input.put("reviewbase", REVIEW_BASE_LOCATION);
            input.put("i18n", bundle);


//            input.put("restaurants", restaurants.subList(0,4));
            input.put("restaurants", restaurants);


            // File output
            file = new FileWriter(new File("output.html"));
            template.process(input, file);
            file.flush();

            // Also write output to console
            Writer out = new OutputStreamWriter(System.out);
            template.process(input, out);
            out.flush();

        } catch (Exception e) {
            System.out.println(e.getMessage());

        } finally {
            if (file != null) {
                try {
                    file.close();
                } catch (Exception ignored) {
                }
            }
        }

    }
}
