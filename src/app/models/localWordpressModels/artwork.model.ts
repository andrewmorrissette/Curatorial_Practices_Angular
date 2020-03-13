export interface Artwork{
    id?:number,
    acf?:ACF

    //Prop that determines chat availability
    comment_status?:string,
}

export interface ACF{
    artist?:string,
    artist_year?:string,
    artist_location?:string,
    artwork_title?:string,
    artwork_year?:string,
    materials?:string,
    acknowledgements?:string
}