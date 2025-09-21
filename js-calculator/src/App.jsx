import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("0"); // display value
  const [formula, setFormula] = useState(""); // keeps track of full expression

  const handleClear = () => {
    setInput("0");
    setFormula("");
  };

  const handleNumber = (value) => {
    if (input === "0" && value === "0") return; // prevent multiple zeros
    if (input === "0") {
      setInput(value);
      setFormula(value);
    } else {
      setInput(input + value);
      setFormula(formula + value);
    }
  };

  const handleDecimal = () => {
    if (!input.includes(".")) {
      setInput(input + ".");
      setFormula(formula + ".");
    }
  };

  const handleOperator = (op) => {
    // Replace last operator if multiple entered (except minus)
    if (/[+\-*/]$/.test(formula)) {
      if (op === "-" && !/[-]$/.test(formula)) {
        setFormula(formula + op);
      } else {
        setFormula(formula.slice(0, -1) + op);
      }
    } else {
      setFormula(formula + op);
    }
    setInput(op);
  };

  const handleEquals = () => {
    try {
      const result = eval(formula.replace(/x/g, "*")); // replace x with *
      setInput(result.toString());
      setFormula(result.toString()); // allows chaining new calc (#14)
    } catch (err) {
      setInput("Error", err);
      setFormula("");
    }
  };


  return (
    <div className="calculator">
      <div id="display">{input}</div>

      <div className="buttons">
        <button id="clear" onClick={handleClear} className="span-two">AC</button>
        <button id="divide" onClick={() => handleOperator("/")}>/</button>
        <button id="multiply" onClick={() => handleOperator("x")}>x</button>

        <button id="seven" onClick={() => handleNumber("7")}>7</button>
        <button id="eight" onClick={() => handleNumber("8")}>8</button>
        <button id="nine" onClick={() => handleNumber("9")}>9</button>
        <button id="subtract" onClick={() => handleOperator("-")}>-</button>

        <button id="four" onClick={() => handleNumber("4")}>4</button>
        <button id="five" onClick={() => handleNumber("5")}>5</button>
        <button id="six" onClick={() => handleNumber("6")}>6</button>
        <button id="add" onClick={() => handleOperator("+")}>+</button>

        <button id="one" onClick={() => handleNumber("1")}>1</button>
        <button id="two" onClick={() => handleNumber("2")}>2</button>
        <button id="three" onClick={() => handleNumber("3")}>3</button>
        <button id="equals" onClick={handleEquals} className="span-two">=</button>

        <button id="zero" onClick={() => handleNumber("0")} className="span-two">0</button>
        <button id="decimal" onClick={handleDecimal}>.</button>
      </div>

    </div>
  );
}

export default App;
