package org.hackupc.twittercockfight.rythmes;

import android.os.AsyncTask;

import com.google.gson.Gson;

import org.hackupc.twittercockfight.activities.RapArenaActivity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;


public class RhymesAsyncTask extends AsyncTask<String, Void, List<String>> {

    private final RapArenaActivity delegate;
    private String host = "http://80.211.195.233";

    private String path = "/rhymes/";

    public RhymesAsyncTask(RapArenaActivity activity) {
        this.delegate = activity;
    }

    @Override
    protected List<String> doInBackground(String... params) {
        List<String> rhymes = new ArrayList<>();
        try {
            URL url = new URL(host + path + params[0]);
            //Instantiate new instance of our class
            //Create a connection
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.connect();

            StringBuilder response = new StringBuilder();
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            RhymesResponse rhymesResponse = new Gson().fromJson(response.toString(), RhymesResponse.class);
            if (rhymesResponse.getRhymes() != null && rhymesResponse.getRhymes().getAll().size() != 0) {
                rhymes.addAll(rhymesResponse.getRhymes().getAll());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return rhymes;
    }

    @Override
    protected void onPostExecute(List<String> strings) {
        delegate.manageResult(strings);
    }
}