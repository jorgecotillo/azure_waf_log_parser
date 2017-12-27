export class BlobEntity {
    public OriginalURL: string;
    public PrettyURL: string;

    constructor (
        private originalURL: string, //NOTE: Without private accesor, the entity does not set/get values
        private prettyURL: string){

        this.OriginalURL = originalURL;
        this.PrettyURL = prettyURL;

    }
}