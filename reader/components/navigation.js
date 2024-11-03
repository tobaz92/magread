import React, { useState, useEffect } from "react";
const Navigation = ({ folio, maxFolio, changeFolio }) => {
  const next = () => {
    const newFolio = folio + 1;
    if (newFolio > maxFolio) {
      changeFolio(0);
    } else {
      changeFolio(newFolio);
    }
  };
  const prev = () => {
    const newFolio = folio - 1;
    if (newFolio < 0) {
      changeFolio(maxFolio);
    } else if (folio === maxFolio) {
      changeFolio(folio - 1);
    } else {
      changeFolio(newFolio);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      next();
    } else if (event.key === "ArrowLeft") {
      prev();
    } else if (event.key === "Home" || event.key === "ArrowDown") {
      changeFolio(0);
    } else if (event.key === "End" || event.key === "ArrowUp") {
      changeFolio(maxFolio);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [folio]);

  const folioVisible = (folio) => {
    const isDouble = folio !== 0 && folio !== maxFolio;

    if (folio === 0) {
      return 1;
    } else if (folio === maxFolio) {
      return maxFolio + 1;
    } else if (folio !== 0 && folio !== maxFolio) {
      return folio + 1 + "-" + (folio + 2);
    } else {
      return folio;
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
      }}
    >
      <div>
        <span>{folioVisible(folio)}</span> - <span>{maxFolio + 1}</span>
      </div>
      <div className="buttons">
        <Button
          text={"Home"}
          click={() => {
            changeFolio(0);
          }}
        />
        <Button text={"Previous"} click={() => prev()} />
        <Button text={"Next"} click={() => next()} />
      </div>
    </nav>
  );
};

export default Navigation;

const Button = ({ text, click }) => {
  return <button onClick={() => click()}>{text}</button>;
};
