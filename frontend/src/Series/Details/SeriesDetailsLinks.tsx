import React from 'react';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import { icons, kinds, sizes } from 'Helpers/Props';
import Series from 'Series/Series';

import Icon from 'Components/Icon';

type SeriesDetailsLinksProps = Pick<
  Series,
  'tvdbId' | 'tvMazeId' | 'imdbId' | 'tmdbId'
>;

function SeriesDetailsLinks(props: SeriesDetailsLinksProps) {
  const { tvdbId, tvMazeId, imdbId, tmdbId } = props;

  return (
    <>
      <style>
        {`
          .series-links-row {
            display: flex;
            flex-direction: row;
            gap: 12px;
            flex-wrap: wrap;
          }
          .series-link-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 100px;
          }
          .series-link-id-row {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          @media (max-width: 600px) {
            .series-links-row {
              flex-direction: column;
              gap: 12px;
              align-items: stretch;
            }
            .series-link-group {
              flex-direction: row;
              align-items: center;
              min-width: 0;
              justify-content: flex-start;
            }
            .series-link-id-row {
              margin-top: 0;
              margin-left: 8px;
            }
          }
        `}
      </style>
      <div className="series-links-row">
        {/* TVDB */}
        <div className="series-link-group">
          <Link to={`https://www.thetvdb.com/?tab=series&id=${tvdbId}`}>
            <Label kind={kinds.INFO} size={sizes.LARGE}>
              The TVDB
            </Label>
          </Link>
          <div className="series-link-id-row">
            <span>{tvdbId}</span>
            <button
              style={{ marginLeft: '4px', cursor: 'pointer' }}
              type="button"
              aria-label="Copy tvdbId"
              onClick={() => navigator.clipboard.writeText(String(tvdbId))}
              title="Copy tvdbId"
            >
              <Icon name={icons.CLIPBOARD} size={16} />
            </button>
          </div>
        </div>

        {/* Trakt */}
        <div className="series-link-group">
          <Link to={`https://trakt.tv/search/tvdb/${tvdbId}?id_type=show`}>
            <Label kind={kinds.INFO} size={sizes.LARGE}>
              Trakt
            </Label>
          </Link>
          <div className="series-link-id-row">
            <span>{tvdbId}</span>
            <button
              style={{ marginLeft: '4px', cursor: 'pointer' }}
              type="button"
              aria-label="Copy tvdbId"
              onClick={() => navigator.clipboard.writeText(String(tvdbId))}
              title="Copy tvdbId"
            >
              <Icon name={icons.CLIPBOARD} size={16} />
            </button>
          </div>
        </div>

        {/* TV Maze */}
        {tvMazeId ? (
          <div className="series-link-group">
            <Link to={`https://www.tvmaze.com/shows/${tvMazeId}/_`}>
              <Label kind={kinds.INFO} size={sizes.LARGE}>
                TV Maze
              </Label>
            </Link>
            <div className="series-link-id-row">
              <span>{tvMazeId}</span>
              <button
                style={{ marginLeft: '4px', cursor: 'pointer' }}
                type="button"
                aria-label="Copy tvMazeId"
                onClick={() => navigator.clipboard.writeText(String(tvMazeId))}
                title="Copy tvMazeId"
              >
                <Icon name={icons.CLIPBOARD} size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {/* IMDB */}
        {imdbId ? (
          <>
            <div className="series-link-group">
              <Link to={`https://imdb.com/title/${imdbId}/`}>
                <Label kind={kinds.INFO} size={sizes.LARGE}>
                  IMDB
                </Label>
              </Link>
              <div className="series-link-id-row">
                <span>{imdbId}</span>
                <button
                  style={{ marginLeft: '4px', cursor: 'pointer' }}
                  type="button"
                  aria-label="Copy imdbId"
                  onClick={() => navigator.clipboard.writeText(String(imdbId))}
                  title="Copy imdbId"
                >
                  <Icon name={icons.CLIPBOARD} size={16} />
                </button>
              </div>
            </div>
            <div className="series-link-group">
              <Link to={`http://mdblist.com/show/${imdbId}`}>
                <Label kind={kinds.INFO} size={sizes.LARGE}>
                  MDBList
                </Label>
              </Link>
              <div className="series-link-id-row">
                <span>{imdbId}</span>
                <button
                  style={{ marginLeft: '4px', cursor: 'pointer' }}
                  type="button"
                  aria-label="Copy imdbId"
                  onClick={() => navigator.clipboard.writeText(String(imdbId))}
                  title="Copy imdbId"
                >
                  <Icon name={icons.CLIPBOARD} size={16} />
                </button>
              </div>
            </div>
          </>
        ) : null}

        {/* TMDB */}
        {tmdbId ? (
          <div className="series-link-group">
            <Link to={`https://www.themoviedb.org/tv/${tmdbId}`}>
              <Label kind={kinds.INFO} size={sizes.LARGE}>
                TMDB
              </Label>
            </Link>
            <div className="series-link-id-row">
              <span>{tmdbId}</span>
              <button
                style={{ marginLeft: '4px', cursor: 'pointer' }}
                type="button"
                aria-label="Copy tmdbId"
                onClick={() => navigator.clipboard.writeText(String(tmdbId))}
                title="Copy tmdbId"
              >
                <Icon name={icons.CLIPBOARD} size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SeriesDetailsLinks;
