package org.hackupc.twittercockfight.adapters;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.twitter.sdk.android.core.models.Tweet;
import com.twitter.sdk.android.tweetui.Timeline;
import com.twitter.sdk.android.tweetui.TweetTimelineListAdapter;

public class SelectableTweetTimelineListAdapter extends TweetTimelineListAdapter {

    private final SelectedTweetAdapter selectedAdapter;

    public SelectableTweetTimelineListAdapter(Context context, Timeline<Tweet> timeline, SelectedTweetAdapter selectedAdapter) {
        super(context, timeline);
        this.selectedAdapter = selectedAdapter;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        View view = super.getView(position, convertView, parent);

        //disable subviews to avoid links are clickable
        if (view instanceof ViewGroup) {
            disableViewAndSubViews((ViewGroup) view);
        }

        //enable root view and attach custom listener
        view.setEnabled(true);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedAdapter.showButton();
                selectedAdapter.add(getItem(position));
                selectedAdapter.notifyDataSetChanged();
            }
        });
        return view;
    }

    //helper method to disable subviews
    private void disableViewAndSubViews(ViewGroup layout) {
        layout.setEnabled(false);
        for (int i = 0; i < layout.getChildCount(); i++) {
            View child = layout.getChildAt(i);
            if (child instanceof ViewGroup) {
                disableViewAndSubViews((ViewGroup) child);
            } else {
                child.setEnabled(false);
                child.setClickable(false);
                child.setLongClickable(false);
            }
        }
    }

}