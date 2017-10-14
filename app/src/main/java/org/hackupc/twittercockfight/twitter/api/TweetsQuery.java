package org.hackupc.twittercockfight.twitter.api;

import com.twitter.sdk.android.core.TwitterApiClient;
import com.twitter.sdk.android.core.TwitterSession;
import com.twitter.sdk.android.core.models.Search;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public class TweetsQuery extends TwitterApiClient {
    public TweetsQuery(TwitterSession session) {
        super(session);
    }

    /**
     * Provide CustomService with defined endpoints
     */
    public CustomService getCustomService() {
        return getService(CustomService.class);
    }


    // example users/show service endpoint
    public interface CustomService {
        @GET("/1.1/search/tweets.json")
        public Call<Search> list(@Query("q") String text);
    }
}
