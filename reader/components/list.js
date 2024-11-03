import React, { useState, useEffect, useRef } from "react";
import Page from "./page";

const List = ({ data, thumbnails }) => {
  const orderPageByDouble = (data) => {
    const newData = [];
    let ignore = false;
    data.map((page, index) => {
      const isDouble = index === 0 || index === data.length - 1 ? false : true;

      if (!isDouble) {
        newData.push([page]);
      } else {
        if (ignore) {
          ignore = false;
          return;
        }
        newData.push([page, data[index + 1]]);
        ignore = true;
      }
    });
    return newData;
  };

  return (
    <div className="list__scale">
      <div className="list">
        <div
          className="list__pages"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            overflowY: "scroll",
            height: "calc(100dvh - 4rem)",
            width: "100vw",
          }}
        >
          {orderPageByDouble(data).map((pages, indexPages) => {
            return (
              <div key={indexPages}
                style={{
                    display:"block",
                    height:"fit-content",
                    width:"100%",
                }}
              
              >
                <div
                  className={"pages"}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                    transform: "scale(0.5)",
                  }}
                >
                  {pages.map((page, indexPage) => {
                    return (
                      <Page
                        key={indexPage}
                        data={page}
                        onFolio={indexPage}
                        maxFolio={data.length - 1}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default List;
