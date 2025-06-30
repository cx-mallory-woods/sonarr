import React from 'react';
import SeriesDetailsLink from './SeriesDetailsLink';
import Series from 'Series/Series';
import styles from './SeriesDetailsLinks.css';

type SeriesDetailsLinksProps = Pick<
  Series,
  'tvdbId' | 'tvMazeId' | 'imdbId' | 'tmdbId'
>;

function SeriesDetailsLinks(props: SeriesDetailsLinksProps) {
  const { tvdbId, tvMazeId, imdbId, tmdbId } = props;

  return (
    <div className={styles.links}>
      <SeriesDetailsLink
        idValue={tvdbId}
        label="The TVDB"
        url={`https://www.thetvdb.com/?tab=series&id=${tvdbId}`}
      />
      <SeriesDetailsLink
        idValue={tvdbId}
        label="Trakt"
        url={`https://trakt.tv/search/tvdb/${tvdbId}?id_type=show`}
      />
      {tvMazeId ? (
        <SeriesDetailsLink
          idValue={tvMazeId}
          label="TV Maze"
          url={`https://www.tvmaze.com/shows/${tvMazeId}/_`}
        />
      ) : null}
      {imdbId ? (
        <>
          <SeriesDetailsLink
            idValue={imdbId}
            label="IMDB"
            url={`https://imdb.com/title/${imdbId}/`}
          />
          <SeriesDetailsLink
            idValue={imdbId}
            label="MDBList"
            url={`http://mdblist.com/show/${imdbId}`}
          />
        </>
      ) : null}
      {tmdbId ? (
        <SeriesDetailsLink
          idValue={tmdbId}
          label="TMDB"
          url={`https://www.themoviedb.org/tv/${tmdbId}`}
        />
      ) : null}
    </div>
  );
}

export default SeriesDetailsLinks;
