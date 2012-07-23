import com.google.gdata.client.spreadsheet.FeedURLFactory;
import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.data.spreadsheet.*;
import com.google.gdata.util.AuthenticationException;
import com.google.gdata.util.ServiceException;
import net.davidashen.text.Hyphenator;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.*;
import java.net.URL;
import java.util.*;

public class ExtJsStoreGenerator extends Generator {

    public static final String REVIEW_DE_BASE_URL = "http://www.berlin-vegan.de/berlin/restaurantkritiken/";
    public static final String LANG_DE="de";
    public static final String LANG_EN="en";

    public ExtJsStoreGenerator(String username,String password) throws AuthenticationException {
        super(username,password);
    }

    public static void main(String[] args) throws Exception {
        ExtJsStoreGenerator generator = new ExtJsStoreGenerator(args[0], args[1]);
        generator.generateLocationDataStores();
        generator.generateTextfilesJS();
    }

    private String hyphenate(String text, String language) throws IOException {
        Hyphenator h=new Hyphenator();
        String hyphenBasePath = "generators" + File.separator + "lib" + File.separator + "hyphen" + File.separator;
        FileInputStream fileInputStream;
        if(language.equals(LANG_DE)){
            fileInputStream = new FileInputStream(hyphenBasePath + "dehyphx.tex");
        }else {
            fileInputStream = new FileInputStream(hyphenBasePath + "hyphen.tex");
        }
        h.loadTable(new java.io.BufferedInputStream(fileInputStream));

        text = h.hyphenate(text,4,3);
        text = text.replaceAll("\u00ad","&shy;");
        return text;
    }

    private void generateTextfilesJS() throws Exception{
        // first read the files from disk
        // <path,content>
        HashMap<String,String> filesMap = new HashMap<String,String>();
        String textFilesBase = "data" + File.separator ;
        List<File> files = getFileListing(new File(textFilesBase));
        for (File file : files) {
            String text = readFileAsString(file.getPath());
            text = textEncode(text);
            String path = file.getPath();
            path = path.replaceAll("\\\\","/"); // normalize path seperator
            path = path.replaceAll("data/","");
            //hyphenate
            if (path.contains("/de/")) {
                text = hyphenate(text,LANG_DE);
            }else if (path.contains("/en/")) {
                text = hyphenate(text,LANG_EN);
            }
            filesMap.put(path,text);
        }
        // scrape data from website for all locations
        List<ListEntry> restaurantEntries = null;
        for (SpreadsheetEntry spreadsheet : getSpreadsheetEntries()) {
            if (spreadsheet.getTitle().getPlainText().equals("Restaurants")) {
                restaurantEntries = addEntries(restaurantEntries, spreadsheet);
            }
        }
        if (restaurantEntries != null) {
            for (ListEntry restaurantEntry : restaurantEntries) {
                String reviewurl = restaurantEntry.getCustomElements().getValue("reviewurl");
                if (reviewurl != null && !reviewurl.isEmpty()) {
                    String locationText = getLocationTextFromWebsite(REVIEW_DE_BASE_URL + reviewurl);
                    locationText = textEncode(locationText);
                    locationText = hyphenate(locationText,LANG_DE);
                    filesMap.put("reviews/de/" + reviewurl + ".html",locationText);
                }
            }
        }
        StringBuilder builder = new StringBuilder();
        builder.append("BVApp.models.Data= [];");
        for (String fileName : filesMap.keySet()) {
            builder.append("\nBVApp.models.Data[\""+fileName+"\"] =\"" + filesMap.get(fileName) +"\";" );
        }
        String path = "src" + File.separator + "data" +File.separator;
        writeTextToFile(builder.toString(),path + "Textfiles.js");
    }

    private static String readFileAsString(String filePath) throws java.io.IOException{
        StringBuilder fileData = new StringBuilder(1000);
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        char[] buf = new char[1024];
        int numRead=0;
        while((numRead=reader.read(buf)) != -1){
            String readData = String.valueOf(buf, 0, numRead);
            fileData.append(readData);
            buf = new char[1024];
        }
        reader.close();
        return fileData.toString();    
    }
    private String getLocationTextFromWebsite(String reviewUrl) throws IOException {
        System.out.println("get " +reviewUrl);
        String text="";
        Document doc = Jsoup.connect(reviewUrl).get();
        Elements textElements = doc.select("#text p,#text ul");
        for (Element textElement : textElements) {
            if(!textElement.html().startsWith("<a href")){ // ignore back link
                text += textElement.text() + "<br/><br/>";
            }
        }
        return text;
    }

    public void generateLocationDataStores() throws Exception {
        List<ListEntry> restaurantEntries = null;
        List<ListEntry> shoppingEntries = null;
        List<ListEntry> cafeEntries = null;
        for (SpreadsheetEntry spreadsheet : getSpreadsheetEntries()) {
            String title = spreadsheet.getTitle().getPlainText();
            if (title.equals("Restaurants")
                    || title.equals("Subway")) {
                restaurantEntries = addEntries(restaurantEntries, spreadsheet);
            }else if (title.equals("Shopping")
                    || title.equals("Backwaren")
                    || title.equals("BioReform")) {
                shoppingEntries= addEntries(shoppingEntries, spreadsheet);
            }else if(title.equals("Cafes")){
                cafeEntries = addEntries(cafeEntries, spreadsheet);
            }

        }
        String path = "src" + File.separator + "data";
        generateStore(restaurantEntries, "RestaurantStoreData", path);
        generateStore(shoppingEntries, "ShopStoreData", path);
        generateStore(cafeEntries, "CafeStoreData", path);
    }

    private void generateStore(List<ListEntry> entries, String storeName, String path) throws IOException, ServiceException {
        StringBuilder outStr = new StringBuilder();
        outStr.append("BVApp.data." + storeName + "=[\n");
        Iterator iter = entries.iterator();
        while (iter.hasNext()) {
            ListEntry entry = (ListEntry) iter.next();
            outStr.append("[");
            Iterator iterColum = entry.getCustomElements().getTags().iterator();
            while (iterColum.hasNext()) {
                String tag = (String) iterColum.next();
                String value = entry.getCustomElements().getValue(tag);
                if (value != null) {
                    value = value.replaceAll("\\n","\\\\n");
                    value = value.replaceAll("\"","'");
                }else {
                    value = "";
                }
                outStr.append("\"" + value + "\"");
                if (iterColum.hasNext()) { // if not the last one, append a comma
                    outStr.append(",");
                }
            }
            outStr.append("]");
            if (iter.hasNext()) { // if not the last one, append a comma
                outStr.append(",\n");
            }
        }
        outStr.append("\n];");
        writeTextToFile(outStr.toString(),path + File.separator + storeName + ".js");
    }

    private List<File> getFileListing(File startDir) throws FileNotFoundException {
        List<File> result = new ArrayList<File>();
        File[] filesAndDirs = startDir.listFiles();
        List<File> filesDirs = Arrays.asList(filesAndDirs);
        for(File file : filesDirs) {
            if(file.getPath().contains(".html")){
                result.add(file);
            }
            if ( ! file.isFile() ) { // if directory            
                List<File> deeperList = getFileListing(file);
                result.addAll(deeperList);
            }
        }
        return result;
    }
}