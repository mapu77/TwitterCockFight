package org.hackupc.twittercockfight.activities;


import android.os.Bundle;
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
    private SelectedTweetAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rap_arena);

        textView = (TextView) findViewById(android.R.id.empty);

        searchListView = (ListView) findViewById(android.R.id.list);
        adapter = new SelectedTweetAdapter(RapArenaActivity.this, new ArrayList<Tweet>());
        ListView selectedListView = (ListView) findViewById(R.id.list_selected);
        selectedListView.setAdapter(adapter);

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
                new SelectableTweetTimelineListAdapter(RapArenaActivity.this, searchTimeline, adapter);
        searchListView.setAdapter(timelineListAdapter);


        textView.setVisibility(View.INVISIBLE);
    }

    public void manageResult(List<String> rhymes) {
        if (rhymes.size() != 0) {
            searchInTwitterByWord(rhymes.get(new Random().nextInt(rhymes.size())), 10);
        } else {
            textView.setText("No rhymes found");
        }
    }
}
