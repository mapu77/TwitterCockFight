package org.hackupc.twittercockfight;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.twitter.sdk.android.core.models.Tweet;

import java.util.List;

class SelectedTweetAdapter extends ArrayAdapter<Tweet> {

    private List<Tweet> tweets;

    public SelectedTweetAdapter(Context context, List<Tweet> tweets) {
        super(context, 0, tweets);
        this.tweets = tweets;
    }

    public void add(Tweet item) {
        tweets.add(item);
    }

    @Override
    public int getCount() {
        return tweets.size();
    }

    @Override
    public Tweet getItem(int position) {
        return tweets.get(position);
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder;

        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.layout_selected_tweets, parent, false);
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        Tweet tweet = tweets.get(position);
        holder.mItemTweetText.setText(tweet.text);
        holder.mItemTweetUsername.setText(tweet.user.name);

        return convertView;
    }

    @Override
    public boolean isEmpty() {
        return tweets.isEmpty();
    }

    private class ViewHolder extends RecyclerView.ViewHolder {

        TextView mItemTweetText;
        TextView mItemTweetUsername;

        ViewHolder(View itemView) {
            super(itemView);
            mItemTweetUsername = (TextView) itemView.findViewById(R.id.usernane);
            mItemTweetText = (TextView) itemView.findViewById(R.id.tweet_text);
        }

    }
}