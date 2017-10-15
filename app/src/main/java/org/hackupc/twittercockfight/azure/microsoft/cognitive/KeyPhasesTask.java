package org.hackupc.twittercockfight.azure.microsoft.cognitive;

import android.os.AsyncTask;

import com.google.gson.Gson;

import org.hackupc.twittercockfight.azure.microsoft.cognitive.query.Documents;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

public class KeyPhasesTask extends AsyncTask<Documents, Void, Map<String, Integer>> {


    // Replace the accessKey string value with your valid access key.
    private String accessKey = "9a2cb2f4638846018eb25ce00237cf8a";

    // Replace or verify the region.
    // NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
    // a free trial access key, you should not need to change this region.
    private String host = "https://westcentralus.api.cognitive.microsoft.com";

    private String path = "/text/analytics/v2.0/keyPhrases";


    @Override
    protected Map<String, Integer> doInBackground(Documents... params) {
        Map<String, Integer> counter = new HashMap<>();
        String text = new Gson().toJson(params[0]);
        try {
            URL url = new URL(host + path);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "text/json");
            connection.setRequestProperty("Ocp-Apim-Subscription-Key", accessKey);
            connection.setDoOutput(true);

            BufferedOutputStream out = new BufferedOutputStream(connection.getOutputStream());
            BufferedWriter wr = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
            wr.write(text);
            wr.flush();
            wr.close();

            connection.connect();

            StringBuilder response = new StringBuilder();
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            org.hackupc.twittercockfight.azure.microsoft.cognitive.response.Documents documents = new Gson().fromJson(response.toString(), org.hackupc.twittercockfight.azure.microsoft.cognitive.response.Documents.class);
            for (org.hackupc.twittercockfight.azure.microsoft.cognitive.response.Document document : documents.documents) {
                for (String phrase : document.keyPhrases) {
                    if (counter.containsKey(phrase)) {
                        counter.put(phrase, counter.get(phrase) + 1);
                    } else counter.put(phrase, 1);
                }
            }
            in.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return counter;
    }

}