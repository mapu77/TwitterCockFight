package org.hackupc.twittercockfight.azure.microsoft.cognitive.response;

import java.util.ArrayList;

public class Document {
    public String id;
    public ArrayList<String> keyPhrases;

    public Document(String id, ArrayList<String> keyPhrases) {
        this.id = id;
        this.keyPhrases = keyPhrases;
    }
}
