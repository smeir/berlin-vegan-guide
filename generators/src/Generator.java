import com.google.gdata.client.spreadsheet.FeedURLFactory;
import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.data.spreadsheet.ListFeed;
import com.google.gdata.data.spreadsheet.SpreadsheetEntry;
import com.google.gdata.data.spreadsheet.SpreadsheetFeed;
import com.google.gdata.util.AuthenticationException;
import com.google.gdata.util.ServiceException;

import java.io.*;
import java.net.URL;
import java.util.List;

/**
 * Date: 22.07.12
 * Time: 19:49
 */
public class Generator {
    protected SpreadsheetService service;
    protected FeedURLFactory factory;

    public Generator(String username, String password) throws AuthenticationException {
        factory = FeedURLFactory.getDefault();
        service = new SpreadsheetService("generator");
        service.setUserCredentials(username, password);
    }

    public List<SpreadsheetEntry> getSpreadsheetEntries() throws Exception {
        SpreadsheetFeed feed = service.getFeed(
                factory.getSpreadsheetsFeedUrl(), SpreadsheetFeed.class);
        return feed.getEntries();
    }

    protected ListFeed getFeed(URL listFeedUrl) throws IOException, ServiceException {
        return service.getFeed(listFeedUrl, ListFeed.class);
    }

    protected List<ListEntry> addEntries(List<ListEntry> entries, SpreadsheetEntry spreadsheet) throws IOException, ServiceException {
        URL listFeedUrl = spreadsheet.getDefaultWorksheet().getListFeedUrl();
        ListFeed feed = getFeed(listFeedUrl);
        if(entries == null){
            entries = feed.getEntries();
        }else {
            entries.addAll(feed.getEntries());
        }
        return entries;
    }

    protected void writeTextToFile(String text, String filePath) throws IOException {
        Writer output = null;
        File file = new File(filePath);
        output = new BufferedWriter(new FileWriter(file));
        output.write(text);
        output.close();
    }

    protected String textEncode(String text) {
        text = text.replaceAll("\"","\\\\\"");
        text = text.replaceAll("\n","");
        text = text.replaceAll("\r","");
        text = text.replace("&", "&amp;");
        return text;
    }
}
