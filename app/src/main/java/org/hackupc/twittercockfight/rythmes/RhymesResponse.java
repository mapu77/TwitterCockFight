package org.hackupc.twittercockfight.rythmes;

import java.util.ArrayList;
import java.util.List;

public class RhymesResponse {
    private String word;
    private Rhymes rhymes;

    class Rhymes {
        private List<String> all;

        Rhymes() {
            this.all = new ArrayList<>();
        }

        public List<String> getAll() {
            if (this.all == null) this.all  = new ArrayList<>();
            return all;
        }
    }

    public Rhymes getRhymes() {
        return rhymes;
    }

    public void setRhymes(Rhymes rhymes) {
        this.rhymes = rhymes;
    }
}