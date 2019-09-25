import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import generateSearchUrlFromKeywords from "scrappy/lib/generateSearchUrlFromKeywords";
import getUrlData from "scrappy/lib/getUrlData";
import findLinksFromSearchPage from "scrappy/lib/findLinksFromSearchPage";
import findElementMatches from "scrappy/lib/findElementMatches";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

const regex = /https?:\/\/([^\/,\s]+\.[^\/,\s]+)?(?=\/|,|\s|$|\?|#)/g;

type BaseTypes = "LOADING" | "ERROR" | null;

type SearchResults = BaseTypes | string[];
const SearchResults: React.FC<{ searchResults: SearchResults }> = props => {
  const { searchResults } = props;
  if (searchResults === null) return <div />;
  if (searchResults === "LOADING") return <div>Cargando...</div>;
  if (searchResults === "ERROR")
    return <div>Hubo un error cargando los resultados de búsqueda</div>;
  if (!searchResults.length)
    return <div>No se encontraron resultados de búsqueda</div>;
  return (
    <div>
      <ul>
        {searchResults.map((el, i) => (
          <li key={`result_${el}_${i}`}>
            <a href={el}>{(el.match(regex) || [el])[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

type SiteMatches = BaseTypes | [string, string[]][];
const SiteMatches: React.FC<{ siteMatches: SiteMatches }> = props => {
  const { siteMatches } = props;
  if (siteMatches === null) return <div />;
  if (siteMatches === "LOADING") return <div>Cargando...</div>;
  if (siteMatches === "ERROR")
    return (
      <div>Hubo un error econtrando matches en los sitios de búsqueda</div>
    );
  return (
    <div>
      {siteMatches.map(([link, matches], index) => (
        <div key={`site_${link}_${index}`}>
          <h3>
            <a href={link}>{(link.match(regex) || [link])[0]}</a>
          </h3>
          <ul>
            {matches.map((el, i) => (
              <li key={`match_${link}_${index}_${i}`}>{el}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [contentKeywords, setContentKeywords] = useState<string>("");

  const [searchUrl, setSearchUrl] = useState<string>("");
  useEffect(() => {
    if (searchUrl.includes("http")) {
      setSearchResults("LOADING");
      getUrlData(searchUrl)
        .then(data => {
          const searchResults = findLinksFromSearchPage(data);
          setSearchResults(searchResults);
        })
        .catch(() => setSearchResults("ERROR"));
    }
  }, [searchUrl]);

  const [isFinishedSearching, setIsFinishedSearching] = useState<boolean>(
    false
  );
  const [searchResults, setSearchResults] = useState<SearchResults>(null);
  useEffect(() => {
    if (searchResults && typeof searchResults === "object") {
      setSiteMatches("LOADING");
      searchResults.forEach((link, index) => {
        getUrlData(link)
          .then(data => {
            const matches = findElementMatches(data, contentKeywords);
            const textMatches: string[] = matches
              .map(match =>
                match.text && !match.text.includes("src=")
                  ? match.text
                  : "[ IMAGEN ]"
              )
              .filter(Boolean);
            if (!textMatches.length) return;
            const newMatch = [link, textMatches];
            setSiteMatches(siteMatches => {
              const newMatches = (siteMatches && typeof siteMatches === "object"
                ? [...siteMatches, newMatch]
                : [newMatch]) as [string, string[]][];
              return newMatches;
            });
          })
          .catch(console.error)
          .finally(() => {
            if (index + 1 === searchResults.length)
              setIsFinishedSearching(true);
          });
      });
    }
  }, [JSON.stringify(searchResults)]);

  const [siteMatches, setSiteMatches] = useState<SiteMatches>(null);

  return (
    <>
      <h1>Scrapper Master</h1>
      <div className="App">
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!searchKeywords || !contentKeywords) return;
              const searchUrl = generateSearchUrlFromKeywords(
                searchKeywords.split(" ")
              );
              setSearchUrl(searchUrl);
            }}
          >
            <h2>Keywords</h2>
            <label>Búsqueda</label>
            <input
              onChange={e => setSearchKeywords(e.target.value)}
              value={searchKeywords}
              placeholder="Keywords de búsqueda"
            />
            <br />
            <label>Contenido</label>
            <input
              onChange={e => setContentKeywords(e.target.value)}
              value={contentKeywords}
              placeholder="Palabras clave"
            />
            <br />
            <input type="submit" value="Continuar" />
          </form>
        </div>
        <div
          style={{
            width: "100%",
            display: "block",
            overflow: "scroll",
            margin: "auto"
          }}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <h2>Sitio de Búsqueda</h2>
                <div>
                  {searchUrl ? <a href={searchUrl}>{searchUrl}</a> : <div />}
                </div>
              </tr>
              <tr>
                <h2>Sitios Encrontados</h2>
                <div>
                  <SearchResults searchResults={searchResults} />
                </div>
              </tr>
              <tr>
                <h2>
                  Matches encontradas
                  {siteMatches && typeof siteMatches === "object"
                    ? isFinishedSearching
                      ? " (Terminado)"
                      : " (Buscando)"
                    : ""}
                </h2>
                <div>
                  <SiteMatches siteMatches={siteMatches} />
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
