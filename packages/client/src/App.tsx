import React, { useState } from "react";
import "./App.css";

import generateSearchUrlFromKeywords from "scrappy/lib/generateSearchUrlFromKeywords";
import getUrlData from "scrappy/lib/getUrlData";
import findLinksFromSearchPage from "scrappy/lib/findLinksFromSearchPage";
import findElementMatches from "scrappy/lib/findElementMatches";

import axios from "axios";

const App: React.FC = () => {
  const [keywordsInput, setKeywordsInput] = useState<string>("");
  const [searchUrl, setSearchUrl] = useState<string>("http://example.com");
  const [searchResults, setSearchResults] = useState<string>("");
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hola Gil</h1>
        <input
          type="text"
          onChange={e => setKeywordsInput(e.target.value)}
          value={keywordsInput}
        />
        <button
          onClick={() => {
            const keywords = keywordsInput.split(", ");
            const url = generateSearchUrlFromKeywords(keywords);
            setSearchUrl(url);
          }}
        >
          Generar URL de búsqueda
        </button>
        {searchUrl.includes("http") ? (
          <>
            <a href={searchUrl}>
              <h4>{searchUrl}</h4>
            </a>
            <button
              onClick={async () => {
                setSearchResults("LOADING");
                try {
                  const data = await getUrlData(searchUrl);
                  alert(JSON.stringify({ data }));
                  const links = findLinksFromSearchPage(data);
                  setSearchResults(links.join(", "));
                } catch (error) {
                  setSearchResults("");
                  console.error(error);
                  alert("¡Ha habido un terrible error!\n" + String(error));
                }
              }}
            >
              Buscar enlaces en página de búsqueda
            </button>
          </>
        ) : (
          ""
        )}
        {searchResults.length ? (
          searchResults === "LOADING" ? (
            <h5>Cargando...</h5>
          ) : (
            <>
              <h4>Se econtraron enlaces:</h4>
              <p>{searchResults}</p>
            </>
          )
        ) : (
          ""
        )}
      </header>
    </div>
  );
};

export default App;
