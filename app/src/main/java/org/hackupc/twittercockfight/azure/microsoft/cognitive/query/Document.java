package org.hackupc.twittercockfight.azure.microsoft.cognitive.query;

public class Document {
    public String id, language, text;

    public Document(String id, String language, String text) {
        this.id = id;
        this.language = language;
        this.text = text;
    }
}
