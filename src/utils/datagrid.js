class DataGrid {
  constructor(name = "Sin nombre") {
    this.name = name;
    this.titles;
    this.cellsCount = 0;
    this.composition;
  }
  #nameGrid() {
    console.log(`┌${"─".repeat(this.name.length + 8)}┐`);
    console.log(`│    ${this.name}    │`);
    // console.log(`└${"─".repeat(this.name.length + 8)}┘`);
    console.log(`├${"─".repeat(this.name.length + 8)}┤`);
  }
  setTitles(...titles) {
    let obj = new Object();
    titles.forEach((title) => {
      obj[title] = "";
    });
    this.composition = [obj];
    this.titles = titles;
  }
  setCells(...cells) {
    if (this.cellsCount === 0) {
      cells.forEach((cell, index) => {
        const title = this.titles[index];
        this.composition[0][title] = cell;
      });
      this.cellsCount++;
      return 0;
    } else {
      const obj = new Object();
      cells.forEach((cell, index) => {
        const title = this.titles[index];
        obj[title] = cell;
      });
      let position = this.composition.push(obj) - 1;
      return position;
    }
  }
  updateCell(position, cells) {
    // let position = params[0];
    // let cells = params[1];
    let obj = new Object();
    cells.forEach((cell, index) => {
      const title = this.titles[index];
      obj[title] = cell;
    });
    this.composition[position] = obj;
    // let position = this.composition.push(obj) - 1;
    return position;
  }
  reFlush() {
    this.composition = [];
  }
  print() {
    this.#nameGrid();
    console.table(this.composition, this.titles);
  }
}

// module.exports = new DataGrid();
module.exports = DataGrid;
