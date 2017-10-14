package org.hackupc.twittercockfight.azure.microsoft.cognitive.response;

import java.util.ArrayList;
import java.util.List;

public class Documents {
    public List<Document> documents;

    public Documents() {
        this.documents = new ArrayList<>();
    }

    public void add(String id, ArrayList<String> keyPhrases) {
        this.documents.add(new Document(id, keyPhrases));
    }
}