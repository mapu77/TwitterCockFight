package org.hackupc.twittercockfight;


import android.app.ListActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.twitter.sdk.android.core.Callback;
import com.twitter.sdk.android.core.Result;
import com.twitter.sdk.android.core.TwitterCore;
import com.twitter.sdk.android.core.TwitterException;
import com.twitter.sdk.android.core.TwitterSession;
import com.twitter.sdk.android.core.models.Search;
import com.twitter.sdk.android.core.models.Tweet;

import org.hackupc.twittercockfight.azure.microsoft.cognitive.query.Documents;
import org.hackupc.twittercockfight.azure.microsoft.cognitive.KeyPhasesTask;
import org.hackupc.twittercockfight.twitter.api.TweetsQuery;

import retrofit2.Call;

public class RapArenaActivity extends ListActivity {

    private TweetsQuery twitterApiClient;
    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rap_arena);

        TwitterSession session = TwitterCore.getInstance().getSessionManager().getActiveSession();
        twitterApiClient = new TweetsQuery(session);

        textView = (TextView) findViewById(android.R.id.empty);
        Button button = (Button) findViewById(R.id.search);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textView.setVisibility(View.VISIBLE);
                EditText wordsContainer = (EditText) findViewById(R.id.text);
                String words = wordsContainer.getText().toString();
                for (String word : words.split(",")) {
                    lookInTwitter(word);
                }
            }
        });
    }

    private void lookInTwitter(String word) {
        Call<Search> call = twitterApiClient.getCustomService().list(word);
        call.enqueue(new Callback<Search>() {
            @Override
            public void success(Result<Search> result) {
                textView.setVisibility(View.INVISIBLE);
                Documents documents = new Documents();
                for (Tweet tweet : result.data.tweets) {
                    documents.add(String.valueOf(tweet.id), tweet.lang, tweet.text);
                }
                try {
                    new KeyPhasesTask().execute(documents);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void failure(TwitterException exception) {
                //Do something on failure
                Toast.makeText(RapArenaActivity.this, "Something went wrong", Toast.LENGTH_LONG).show();
            }
        });
    }
}
