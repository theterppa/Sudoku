class Sudoku {
  constructor(container, gridSize = 9, subgridSize = 3) {
    this.container = container;
    this.grid = [];
    this.solution = [];
    this.gridSize = gridSize;
    this.subgridSize = subgridSize;
    this.tileSelected = null;
    this.noteButton = false;
    this.previousTile = "";
    this.numberHighlighted = "";

    this.notes = this.notes.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.selectNumber = this.selectNumber.bind(this);
    this.pressNumber = this.pressNumber.bind(this);
  }

  //make the grid
  makeGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      //All nodes in the grid are initially empty (marked with 0)
      this.grid[i] = new Array(9).fill(0);
      this.solution[i] = new Array(9).fill(0);
    }
  }

  //fill the grid with numbers one to nine
  populateGrid() {
    //go trough the grid
    for (let i = 0; i < this.gridSize; i++) {
      //go trough the row
      for (let j = 0; j < this.gridSize; j++) {
        //if grid node doesn't have designated number yet
        if (this.grid[i][j] == 0) {
          let attempts = 0;
          //while not all available numbers hasn't been tried yet
          while (attempts < 9) {
            // num = random int between one to nine
            const num = Math.floor(Math.random() * 9) + 1;
            //if isSafe method returns true num is added to the node in guestion
            if (this.isSafe(i, j, num)) {
              this.grid[i][j] = num;
              this.solution[i][j] = num;
              //if this method returns true, so num fits to the node in guestion
              if (this.populateGrid(this.grid)) {
                return true;
              }
              //if populated grid recursion = false the node in guestion will be 0 (empty)
              this.grid[i][j] = 0;
              this.solution[i][j] = 0;
            }
            //if isSafe returns false
            attempts++;
          }
          //if attempts > 9
          return false;
        }
      }
    }
    // if all conditions in this method are true
    return true;
  }

  //determine if num from previous method fits the node in guestion from previous method
  isSafe(row, column, num) {
    for (let i = 0; i < this.gridSize; i++) {
      //if there already is the same number in same row
      if (this.grid[row][i] == num) {
        return false;
      }
      //if there already is the same number in same column
      if (this.grid[i][column] == num) {
        return false;
      }
    }
    //variables to determine the 3x3 subgrid, to make sure that no same num is in the subgrid
    // subgridSize = 3
    const startRow = Math.floor(row / this.subgridSize) * this.subgridSize;
    const startColumn =
      Math.floor(column / this.subgridSize) * this.subgridSize;
    for (let i = startRow; i < startRow + this.subgridSize; i++) {
      for (let j = startColumn; j < startColumn + this.subgridSize; j++) {
        //if the node in guestion in the subgrid = num
        if (this.grid[i][j] == num) {
          return false;
        }
      }
    }
    //if the num from populateGrid method can be placed in the node from populateGrid method
    return true;
  }

  //remove random numbers from the grid to be filled by the player
  removeNumbers(count) {
    //while the number of numbers to be removed from grid is has not been met yet
    while (count > 0) {
      //variable for random row wehere to remove a number
      let row = Math.floor(Math.random() * 9);
      //variable for random column wehere to remove a number
      let column = Math.floor(Math.random() * 9);
      //if the node from where to remove a number is not empty already
      if (this.grid[row][column] !== 0) {
        //remove the number in guestion
        this.grid[row][column] = 0;
        count--;
      }
    }
  }

  setBoard() {
    //Digits 1-9 below the board that user can choose from
    for (let i = 1; i <= 9; i++) {
      let number = document.createElement("div");
      number.id = i;
      number.innerText = i;
      number.addEventListener("click", this.selectNumber);
      number.classList.add("number");
      document.getElementById("digits").appendChild(number);
    }
    //Generates the board and adds id to each tile (row-col) f.e (0-0), (2-1)....
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let tile = document.createElement("div");
        tile.id = row + "-" + col;
        tile.notes = [];
        if (this.grid[row][col] != "0") {
          tile.innerText = this.grid[row][col];
          tile.classList.add("tile-start");
        }
        //Add darker lines to the board so boxes are more visible
        if (row == 2 || row == 5) {
          tile.classList.add("horizontal-line");
        }
        if (col == 2 || col == 5) {
          tile.classList.add("vertical-line");
        }
        tile.addEventListener("click", this.selectTile);
        document.addEventListener("keypress", this.pressNumber);

        tile.classList.add("tile");
        document.getElementById("sudoku-board").append(tile);
      }
    }
  }
  // Changes the background of tile selected to gray
  selectTile(event) {
    //Check if the selected tile is same as the previous one, if so, clear highlights
    if (this.tileSelected === event.target) {
      this.tileSelected.classList.remove("tile-selected");
      this.removeHighlight();
      this.tileSelected = null;
      this.previousTile = "";
      this.numberHighlighted = "";
    } else {
      //Clear previous tile highlight
      if (this.tileSelected != null) {
        this.tileSelected.classList.remove("tile-selected");
      }

      this.removeHighlight();

      this.tileSelected = event.target;
      let coords = this.tileSelected.id.split("-");
      let row = parseInt(coords[0]);
      let col = parseInt(coords[1]);

      // If selected tile is empty or the number in selected tile is different than highlighted number
      if (
        this.tileSelected.innerText == "" ||
        this.tileSelected.innerText != this.numberHighlighted
      ) {
        this.addHighlight(row, col);
        this.tileSelected.classList.remove("highlight");
        this.tileSelected.classList.add("tile-selected");
        this.numberHighlighted = "";
        // If selected tile contains a number, highlight same numbers
        if (
          this.tileSelected.innerText != "" &&
          !this.tileSelected.classList.contains("note-number")
        ) {
          let num = parseInt(this.tileSelected.innerText);
          this.highlightNumbers(num);
        }
        this.previousTile = this.tileSelected.id;
      } else {
        // Deselect the tile and remove highlight if the same tile is clicked
        this.tileSelected.classList.remove("tile-selected");
        this.removeHighlight();
        this.previousTile = "";
        this.numberHighlighted = "";
        this.tileSelected = null;
      }
    }
  }

  // After selecting tile, select number below and it is added to the tile.
  selectNumber(event) {
    let num = parseInt(event.target.id);
    if (this.previousTile == "") {
      this.highlightNumbers(num);
    } else {
      if (
        !this.tileSelected ||
        this.tileSelected.classList.contains("tile-start")
      ) {
        return;
      }
      this.insertNumber(num);
    }
  }

  //After selecting tile, press number in keyboard to add it to the tile
  pressNumber(event) {
    if (event.key >= 1 && event.key <= 9) {
      let num = parseInt(event.key);
      if (this.previousTile == "") {
        this.highlightNumbers(num);
      } else {
        if (this.tileSelected.classList.contains("tile-start")) {
          return;
        } else {
          this.insertNumber(num);
        }
      }
    }
  }

  //Handles inserting numbers & note numbers to the board
  insertNumber(num) {
    let coords = this.tileSelected.id.split("-");
    let row = parseInt(coords[0]);
    let col = parseInt(coords[1]);

    if (this.noteButton) {
      if (
        this.tileSelected.classList.contains("tile-correct") ||
        this.tileSelected.classList.contains("tile-error")
      ) {
        return;
      }
      if (this.tileSelected.notes.includes(num)) {
        let index = this.tileSelected.notes.indexOf(num);
        if (index !== -1) {
          this.tileSelected.notes.splice(index, 1);
        }
      } else {
        this.tileSelected.notes.push(num);
        this.tileSelected.notes.sort();
      }

      this.tileSelected.innerText = this.tileSelected.notes.join("");
      this.tileSelected.classList.add("note-number");
    } else {
      this.tileSelected.classList.remove("note-number");
      this.tileSelected.notes = [];
      if (this.grid[row][col] === num) {
        this.tileSelected.innerText = "";
        this.grid[row][col] = 0;
        this.tileSelected.classList.remove(
          "tile-correct",
          "tile-error",
          "note-number"
        );
      } else {
        this.tileSelected.innerText = num;
        if (this.solution[row][col] == num) {
          this.tileSelected.classList.add("tile-correct");
          this.tileSelected.classList.remove("tile-error");
          this.grid[row][col] = num;
          this.removeNotes(row, col, num);
        } else {
          this.tileSelected.classList.add("tile-error");
          this.tileSelected.classList.remove("tile-correct");
          this.grid[row][col] = num;
        }
      }
    }
    if (this.numberCompleted(num)) {
      document.getElementById(num).classList.add("number-completed");
    }

    if (this.isSolved()) {
      this.finisher();
    }
  }

  numberCompleted(num) {
    let count = 0;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] == this.solution[i][j] || this.grid[i][j] == 0) {
          if (this.grid[i][j] == num) {
            count++;
          }
        } else {
          return false;
        }
      }
    }
    return count == 9;
  }

  isSolved() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] !== this.solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  addHighlight(row, col) {
    for (let i = 0; i < this.gridSize; i++) {
      if (
        document.getElementById(row + "-" + i).classList.contains("tile-start")
      ) {
        document.getElementById(row + "-" + i).classList.add("highlight-fixed");
      } else {
        document.getElementById(row + "-" + i).classList.add("highlight");
      }

      if (
        document.getElementById(i + "-" + col).classList.contains("tile-start")
      ) {
        document.getElementById(i + "-" + col).classList.add("highlight-fixed");
      } else {
        document.getElementById(i + "-" + col).classList.add("highlight");
      }
    }
    //variables to determine the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startColumn; j < startColumn + 3; j++) {
        if (
          document.getElementById(i + "-" + j).classList.contains("tile-start")
        ) {
          document.getElementById(i + "-" + j).classList.add("highlight-fixed");
        } else {
          document.getElementById(i + "-" + j).classList.add("highlight");
        }
      }
    }
  }

  highlightNumbers(num) {
    if (this.numberHighlighted == num) {
      this.removeHighlight();
      this.numberHighlighted = "";
      this.tileSelected = null;
    } else {
      this.removeHighlight();
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          if (this.grid[i][j] === num) {
            document
              .getElementById(i + "-" + j)
              .classList.add("highlight-numbers");
          }
        }
      }
      this.numberHighlighted = num;
    }
  }

  removeHighlight() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        document
          .getElementById(i + "-" + j)
          .classList.remove(
            "highlight",
            "highlight-numbers",
            "highlight-fixed"
          );
      }
    }
  }

  removeNotes(row, col, num) {
    for (let i = 0; i < this.gridSize; i++) {
      if (document.getElementById(row + "-" + i).notes.includes(num)) {
        let index = document.getElementById(row + "-" + i).notes.indexOf(num);
        if (index !== -1) {
          document.getElementById(row + "-" + i).notes.splice(index, 1);
          document.getElementById(row + "-" + i).innerText = document
            .getElementById(row + "-" + i)
            .notes.join("");
        }
      }
      if (document.getElementById(i + "-" + col).notes.includes(num)) {
        let index = document.getElementById(i + "-" + col).notes.indexOf(num);
        if (index !== -1) {
          document.getElementById(i + "-" + col).notes.splice(index, 1);
          document.getElementById(i + "-" + col).innerText = document
            .getElementById(i + "-" + col)
            .notes.join("");
        }
      }
    }
    //variables to determine the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startColumn; j < startColumn + 3; j++) {
        if (document.getElementById(i + "-" + j).notes.includes(num)) {
          let index = document.getElementById(i + "-" + j).notes.indexOf(num);
          if (index !== -1) {
            document.getElementById(i + "-" + j).notes.splice(index, 1);
            document.getElementById(i + "-" + j).innerText = document
              .getElementById(i + "-" + col)
              .notes.join("");
          }
        }
      }
    }
  }

  solve() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] == 0) {
          this.grid[i][j] = this.solution[i][j];
          document.getElementById(i + "-" + j).innerText = this.solution[i][j];
          document.getElementById(i + "-" + j).classList.remove("tile-correct", "tile-error", "tile-selected");
        }
      }
    }
    this.tileSelected = null;
    this.removeHighlight();
    document.getElementById("solve-button").classList.add("number-completed");
    this.finisher();
  }

  notes() {
    if (this.noteButton === false) {
      document.getElementById("notes-button").classList.add("highlight");
      this.noteButton = true;
    } else {
      document.getElementById("notes-button").classList.remove("highlight");
      this.noteButton = false;
    }
  }

  modeSelection(removedNumbers) {
    // Clear the previous board
    this.container.innerHTML = "";
    document.getElementById("digits").innerHTML = "";

    const modeSettings = {
      43: "easyMode",
      48: "mediumMode",
      53: "hardMode",
      58: "expertMode",
    };

    const modeElements = ["easyMode", "mediumMode", "hardMode", "expertMode"];
    modeElements.forEach((mode) => {
      document.getElementById(mode).style.backgroundColor = "white";
    });

    const selectedMode = modeSettings[removedNumbers];
    if (selectedMode) {
      document.getElementById(selectedMode).style.backgroundColor =
        "rgb(240, 240, 240)";
    }

    this.makeGrid();
    this.populateGrid();
    this.removeNumbers(removedNumbers);
    this.setBoard();
    document.getElementById("solve-button").classList.remove("number-completed");
  }

  //ChatGPT generated the finisher, launchConfetti and showVictoryMessage functions.

  finisher() {
    // Remove any existing highlights
    this.removeHighlight();
    if (this.tileSelected != null) {
      this.tileSelected.classList.remove("tile-selected");
    }
    // Launch confetti
    this.launchConfetti();

    // Loop through the grid to apply the "finisher" class
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        document.getElementById(i + "-" + j).classList.add("finisher");
        document.getElementById(i + "-" + j).style.pointerEvents = "none";
      }
    }

    // Create and display the victory message
    this.showVictoryMessage();
  }

  launchConfetti() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  showVictoryMessage() {
    // Create a new div for the message
    const messageDiv = document.createElement("div");

    // Add a message, you can change this to any message you prefer
    messageDiv.innerText = "Congratulations! You've completed the Sudoku!";

    // Add custom styles to make the message look nice
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.padding = "20px";
    messageDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    messageDiv.style.color = "white";
    messageDiv.style.fontSize = "24px";
    messageDiv.style.fontWeight = "bold";
    messageDiv.style.textAlign = "center";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.zIndex = "1000"; // Ensure it appears above everything else

    // Optionally, you can add a fade-in effect with CSS animations
    messageDiv.style.opacity = "0";
    messageDiv.style.transition = "opacity 1s ease";
    setTimeout(() => {
      messageDiv.style.opacity = "1";
    }, 0);

    // Append the message to the body
    document.body.appendChild(messageDiv);

    // Optionally, remove the message after a few seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 3000); // 3 seconds delay
  }
}
