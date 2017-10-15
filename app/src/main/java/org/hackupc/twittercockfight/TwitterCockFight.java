package org.hackupc.twittercockfight;

import android.app.Application;
import android.util.Log;

import com.twitter.sdk.android.core.DefaultLogger;
import com.twitter.sdk.android.core.Twitter;
import com.twitter.sdk.android.core.TwitterAuthConfig;
import com.twitter.sdk.android.core.TwitterConfig;

public class TwitterCockFight extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        TwitterConfig config = new TwitterConfig.Builder(this)
                .logger(new DefaultLogger(Log.DEBUG))
                .twitterAuthConfig(
                        new TwitterAuthConfig(
                                getResources().getText(R.string.com_twitter_sdk_android_CONSUMER_KEY).toString(),
                                getResources().getText(R.string.com_twitter_sdk_android_CONSUMER_SECRET).toString()
                        )
                )
                .debug(true)
                .build();
        Twitter.initialize(config);
    }
}
