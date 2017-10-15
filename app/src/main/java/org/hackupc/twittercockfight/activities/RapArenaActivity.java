package org.hackupc.twittercockfight.activities;


import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import com.twitter.sdk.android.core.models.Tweet;
import com.twitter.sdk.android.tweetui.SearchTimeline;
import com.twitter.sdk.android.tweetui.TweetTimelineListAdapter;

import org.hackupc.twittercockfight.R;
import org.hackupc.twittercockfight.adapters.SelectableTweetTimelineListAdapter;
import org.hackupc.twittercockfight.adapters.SelectedTweetAdapter;
import org.hackupc.twittercockfight.rythmes.RhymesAsyncTask;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RapArenaActivity extends LoginActivity {

    private TextView textView;
    private ListView searchListView;
    private SelectedTweetAdapter selectedTweetAdapter;
    private String rhyme;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rap_arena);

        textView = (TextView) findViewById(android.R.id.empty);

        searchListView = (ListView) findViewById(android.R.id.list);
        selectedTweetAdapter = new SelectedTweetAdapter(RapArenaActivity.this, new ArrayList<Tweet>());
        final ListView selectedListView = (ListView) findViewById(R.id.list_selected);
        FloatingActionButton fabSaveButton = (FloatingActionButton) findViewById(R.id.fab_save);
        fabSaveButton.setVisibility(View.INVISIBLE);
        selectedTweetAdapter.setButton(fabSaveButton);
        fabSaveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                List<Tweet> tweets = selectedTweetAdapter.getItems();
                SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences(textView.getText().toString(), MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                for (Tweet tweet : tweets) {
                    editor.putString(tweet.idStr, tweet.text);
                }
                editor.apply();
            }
        });
        selectedListView.setAdapter(selectedTweetAdapter);

        Button button = (Button) findViewById(R.id.search);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textView.setVisibility(View.VISIBLE);
                EditText wordsContainer = (EditText) findViewById(R.id.text);
                String word = wordsContainer.getText().toString();
                new RhymesAsyncTask(RapArenaActivity.this).execute(word);
            }
        });
    }

    private void searchInTwitterByWord(String word, int count) {
        SearchTimeline searchTimeline = new SearchTimeline.Builder()
                .query(word)
                .maxItemsPerRequest(count)
                .build();

        final TweetTimelineListAdapter timelineListAdapter =
                new SelectableTweetTimelineListAdapter(RapArenaActivity.this, searchTimeline, selectedTweetAdapter);
        searchListView.setAdapter(timelineListAdapter);

        textView.setVisibility(View.INVISIBLE);
    }

    public void manageResult(List<String> rhymes) {
        if (rhymes.size() != 0) {
            rhyme = rhymes.get(new Random().nextInt(rhymes.size()));
            searchInTwitterByWord(rhyme, 10);
        } else {
            textView.setText("No rhymes found");
        }
    }
}
