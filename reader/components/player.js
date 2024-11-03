import React, { useState, useEffect, useRef } from "react";
import Page from "./page";
import Navigation from "./navigation";
import List from "./list";
import { publicPath } from "./utils";

const Player = ({ data, thumbnails }) => {
  const firstPage = data[1][0][1];
  const page_width = firstPage[firstPage.length - 2];
  const page_height = firstPage[firstPage.length - 1];

  const [folio, setFolio] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [defaultScale, setDefaultScale] = useState(0.5);

  const refPlayer__scale = useRef(null);
  const refRange__scale = useRef(null);

  const doubleMaxWidth = () => {
    let width = [];
    for (let i = 0; i < data.length; i++) {
      const page = data[i];
      const pageWidth = page[0][1][page[0][1].length - 2];
      width.push(pageWidth);
    }
    let maxWidth = Math.max(...width);
    return maxWidth * 2;
  };
  const doubleMaxHeight = () => {
    let height = [];
    for (let i = 0; i < data.length; i++) {
      const page = data[i];
      const pageHeight = page[0][1][page[0][1].length - 1];
      height.push(pageHeight);
    }

    const maxHeight = Math.max(...height);
    return maxHeight;
  };

  const setScaleByWindow = (max) => {
    if (!refPlayer__scale.current) return;

    const paddingRefPlayer__scale = {
      top: parseInt(
        window.getComputedStyle(refPlayer__scale.current).paddingTop
      ),
      bottom: parseInt(
        window.getComputedStyle(refPlayer__scale.current).paddingBottom
      ),
      left: parseInt(
        window.getComputedStyle(refPlayer__scale.current).paddingLeft
      ),
      right: parseInt(
        window.getComputedStyle(refPlayer__scale.current).paddingRight
      ),
    };

    const maxWidth =
      refPlayer__scale.current.offsetWidth -
      (paddingRefPlayer__scale.left + paddingRefPlayer__scale.right);
    const maxHeight =
      refPlayer__scale.current.offsetHeight -
      (paddingRefPlayer__scale.top + paddingRefPlayer__scale.bottom);

    const scaleWidth = maxWidth / doubleMaxWidth();
    const scaleHeight = maxHeight / doubleMaxHeight();
    const scale = Math.min(scaleWidth, scaleHeight);
    setScale(scale);
    setDefaultScale(scale);
    // setScale(1);
  };

  useEffect(() => {
    window.addEventListener("resize", setScaleByWindow);

    return () => {
      window.removeEventListener("resize", setScaleByWindow());
    };
  }, []);

  useEffect(() => {
    if (refPlayer__scale.current) {
      setScaleByWindow();
    }
  }, [useRef]);

  // ZOOM A FAIRE
  // useEffect(() => {
  //   const handleMove = (e) => {
  //     if (refPlayer__scale.current) {
  //       const { clientX, clientY } = e;
  //       const { left, top } = refPlayer__scale.current.getBoundingClientRect();

  //       const x = clientX - left;
  //       const y = clientY - top;

  //       console.log(x, y);

  //     }
  //   };

  //   const handleUp = (e) => {
  //     if (refPlayer__scale.current) {
  //       refPlayer__scale.current.removeEventListener("mousemove", handleMove);
  //       refPlayer__scale.current.removeEventListener("mouseup", handleUp);
  //     }
  //   };

  //   if (refPlayer__scale.current) {
  //     refPlayer__scale.current.addEventListener("mousedown", (e) => {
  //       refPlayer__scale.current.addEventListener("mousemove", handleMove);
  //       refPlayer__scale.current.addEventListener("mouseup", handleUp);
  //     });
  //   }
  //   return () => {
  //     if (refPlayer__scale.current) {
  //       refPlayer__scale.current.removeEventListener("mousedown", (e) => {
  //         refPlayer__scale.current.removeEventListener("mousemove", handleMove);
  //         refPlayer__scale.current.removeEventListener("mouseup", handleUp);
  //       });
  //     }
  //   };
  // }, [useRef]);

  // const handleVisibilityChange = () => {
  //   if (document.hidden) {
  //     handleWindowBlur();
  //   } else {
  //     handleWindowFocus();
  //   }
  // };

  // const handleWindowBlur = () => {
  //   console.log("L'utilisateur a quitté le navigateur.");
  //   refPlayer__scale.current.style.filter = "blur(5px)";
  // };

  // const handleWindowFocus = () => {
  //   console.log("L'utilisateur est revenu dans le navigateur.");
  //   refPlayer__scale.current.style.filter = "blur(0px)";
  // };

  // useEffect(() => {
  //   if (refPlayer__scale.current) {
  //     let focusCheckInterval;

  //     // Ajout des écouteurs d'événements pour "visibilitychange", "blur" et "focus"
  //     document.addEventListener(
  //       "visibilitychange",
  //       handleVisibilityChange,
  //       false
  //     );
  //     window.addEventListener("blur", handleWindowBlur, false);
  //     window.addEventListener("focus", handleWindowFocus, false);

  //     focusCheckInterval = setInterval(() => {
  //       if (!document.hasFocus()) {
  //         console.log(
  //           "L'utilisateur a quitté le navigateur (via Alt+Tab ou autre)."
  //         );
  //       } else {
  //         console.log("L'utilisateur est dans le navigateur.");
  //       }
  //     }, 1000);

  //     // Nettoyage des écouteurs d'événements lors du démontage du composant
  //     return () => {
  //       document.removeEventListener(
  //         "visibilitychange",
  //         handleVisibilityChange,
  //         false
  //       );
  //       window.removeEventListener("blur", handleWindowBlur, false);
  //       window.removeEventListener("focus", handleWindowFocus, false);
  //     };
  //   }
  // }, [useRef]);

  // ZOOM A FAIRE

  const width = (data, scale, folio) => {
    let width = [];
    for (let i = 0; i < data.length; i++) {
      const page = data[i];
      const pageWidth = page[0][1][page[0][1].length - 2];
      width.push(pageWidth);
    }
    let maxWidth = Math.max(...width);
    const isDouble = folio !== 0 && folio !== data.length - 1;

    if (folio === 0 || folio === data.length - 1) {
      maxWidth = data[folio][0][1][data[folio][0][1].length - 2];
    } else {
      const pageLeft = data[folio];
      const widthLeft = pageLeft[0][1][pageLeft[0][1].length - 2];
      const pageRight = data[folio + 1];
      const widthRight = pageRight[0][1][pageRight[0][1].length - 2];
      maxWidth = widthLeft + widthRight;
    }

    return maxWidth * scale;
  };
  const maxHeight = (data, scale) => {
    let height = [];
    for (let i = 0; i < data.length; i++) {
      const page = data[i];
      const pageHeight = page[0][1][page[0][1].length - 1];
      height.push(pageHeight);
    }

    const maxHeight = Math.max(...height);
    return maxHeight * scale;
  };

  const movePage = (folio, data, scale) => {
    let width = 0;
    for (let i = 0; i < folio; i++) {
      const page = data[i];
      const page_width = page[0][1][page[0][1].length - 2];
      width += page_width;
    }
    return width * scale;
  };

  const [view, setView] = useState("player");
  return (
    <>
      <header>
        <div className="header__title">
          <img
            width="124"
            height="30"
            src={window.MagreadConfig.server + "/v1/img/logo.svg"}
            alt="logo"
          />
        </div>
        {view === "player" && (
          <Navigation
            folio={folio}
            maxFolio={data.length - 1}
            changeFolio={(newFolio) => {
              const sens = folio < newFolio ? true : false;
              if (!sens && folio === data.length - 1 && newFolio !== 0) {
                setFolio(newFolio - 1);
              } else if (
                sens &&
                folio !== 0 &&
                folio !== data.length - 1 &&
                newFolio !== 0 &&
                newFolio !== data.length - 1
              ) {
                setFolio(newFolio + 1);
              } else if (
                !sens &&
                folio !== 0 &&
                folio !== data.length - 1 &&
                newFolio !== 0
              ) {
                setFolio(newFolio - 1);
              } else {
                setFolio(newFolio);
              }
            }}
          />
        )}

        <div className="buttons range-scale">
          {/* <button
            onClick={() => setView("player")}
            className={view === "player" ? "active" : ""}
          >
            Player
          </button>
          <button
            onClick={() => setView("list")}
            className={view === "list" ? "active" : ""}
          >
            List
          </button> */}

          <div>
            <input
              ref={refRange__scale}
              type="range"
              id="zoom"
              name="zoom"
              defaultValue="0"
              min="0"
              max="100"
              onChange={(e) => {
                const value = parseInt(e.target.value);

                const min = defaultScale * 100;
                const max = 100;

                const newValue = ((max - min) * (value - 0)) / (100 - 0) + min;

                setScale(newValue / 100);

                refPlayer__scale.current.classList.add("on-zoom");
                setTimeout(() => {
                  refPlayer__scale.current.classList.remove("on-zoom");
                }, 500);
              }}
            />
            <label htmlFor="zoom">zoom</label>
          </div>

          <button
            onClick={() => {
              setScale(defaultScale);
              refPlayer__scale.current.classList.add("on-zoom");
              setTimeout(() => {
                refPlayer__scale.current.classList.remove("on-zoom");
              }, 500);

              refRange__scale.current.value = 0;
            }}
          >
            reset
          </button>
        </div>

        <div className="help">
          <span>?</span>
        </div>
      </header>
      {view === "player" && (
        <div className="player__scale" ref={refPlayer__scale}>
          <div
            className="player"
            style={{
              width: width(data, scale, folio),
              height: maxHeight(data, scale),
            }}
          >
            <div
              className="player__pages"
              style={{
                width: page_width * 2,
                height: page_height,
                transform: `translateX(-${movePage(
                  folio,
                  data,
                  scale
                )}px) scale(${scale})`,
              }}
            >
              {data.map((page, index) => {
                return (
                  <Page
                    key={index}
                    data={page}
                    onFolio={index}
                    maxFolio={data.length - 1}
                    thumbnail={thumbnails[0][index][0]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* {view === "list" && <List data={data} thumbnail={thumbnails} />} */}
    </>
  );
};
export default Player;
