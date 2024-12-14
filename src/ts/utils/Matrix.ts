export class Matrix<T> {
    #matrix: T[][];
    #rows;
    #cols;

    constructor(rows: number = 0, cols: number = 0, prefill: T | undefined = undefined) {
        this.#rows = rows;
        this.#cols = cols;
        this.#matrix = prefill ? Array(rows).fill(0).map(() => Array(cols).fill(prefill)) : [];
    }

    get rows(): number {
        return this.#rows;
    }

    get cols(): number {
        return this.#cols;
    }

    getRow(rowIndex: number): T[] {
        if (rowIndex >= this.#rows) throw new Error("This row index doesn't exist in matrix");
        return this.#matrix[rowIndex];
    }

    getCol(colIndex: number): T[] {
        if (colIndex >= this.#cols) throw new Error("This col index doesn't exist in matrix");
        return this.#matrix.map(r => r[colIndex]);
    }

    addRow(elements: T[]): Matrix<T> {
        if (elements.length === 0) throw new Error("Can not add empty row");
        if (elements.length !== this.#cols) {
            if (this.#cols > 0) throw new Error("Number of elements in added row doesn't match number of cols!");
            this.#cols = elements.length;
        }
        this.#rows++;
        this.#matrix[this.#rows - 1] = [...elements];
        return this;
    }

    addCol(elements: T[]): Matrix<T> {
        if (elements.length === 0) throw new Error("Can not add empty col");
        if (elements.length !== this.#rows) {
            if (this.#rows > 0) throw new Error("Number of elements in added col doesn't match number of rows!");
            this.#rows = elements.length;
        }
        this.#cols++;
        this.#matrix.forEach((row, i) => row.push(elements[i]));
        return this;
    }

    setRow(rowIndex: number, elements: T[]): Matrix<T> {
        if (elements.length === 0) throw new Error("Can not set empty row");
        if (rowIndex > this.#rows - 1 || rowIndex < 0) throw new Error("This row index doesn't exist in matrix");
        if (elements.length !== this.#matrix[rowIndex].length) throw new Error("Element count doesn't match existing row");
        this.#matrix[rowIndex] = [...elements];
        return this;
    }

    removeRow(rowIndex: number): Matrix<T> {
        if (rowIndex > this.#rows - 1 || rowIndex < 0) throw new Error("This row index doesn't exist in matrix");
        this.#matrix = this.#matrix.filter((_, i) => i !== rowIndex);
        this.#rows--;
        return this;
    }

    setCol(colIndex: number, elements: T[]): Matrix<T>  {
        if (elements.length === 0) throw new Error("Can not set empty col");
        if (colIndex > this.#cols - 1 || colIndex < 0) throw new Error("This col index doesn't exist in matrix");
        if (elements.length !== this.#matrix.length) throw new Error("Element count doesn't match existing row");

        this.#matrix.forEach((row, i) => row[colIndex] = elements[i]);
        return this;
    }

    removeCol(colIndex: number): Matrix<T> {
        if (colIndex > this.#cols - 1 || colIndex < 0) throw new Error("This col index doesn't exist in matrix");
        this.#matrix.forEach((row, i) => this.#matrix[i] = [...row.slice(0, colIndex), ...row.slice(colIndex + 1)]);
        this.#cols--;
        return this;
    }

    /**
     * Creates a new Matrix by copying the current Matrix with specified rows and columns removed.
     * @param {number | number[] | undefined} rowIndexesToRemove - Optional. Index or array of row indexes to be removed.
     * @param {number | number[] | undefined} colIndexesToRemove - Optional. Index or array of column indexes to be removed.
     * @return {Matrix<T>} A new Matrix with specified rows and columns removed.
     */
    copy(rowIndexesToRemove: number | number[] | undefined = undefined, colIndexesToRemove: number | number[] | undefined = undefined): Matrix<T> {
        const newMatrix = new Matrix<T>()
        this.#matrix.forEach((row, i) => {
            if (Array.isArray(rowIndexesToRemove) && rowIndexesToRemove.includes(i)) return;
            if (i === rowIndexesToRemove) return;
            const newRow: T[] = [];
            row.forEach((e, j) => {
                if (Array.isArray(colIndexesToRemove) && colIndexesToRemove.includes(j)) return;
                if (j === colIndexesToRemove) return;
                newRow.push(e);
            })
            newMatrix.addRow(newRow);
        })
        return newMatrix;
    }

    /**
     * Calculates the determinant of the matrix.
     * @return number; false if the matrix is empty, non-numeric, or not square.
     */
    get determinant(): number | false {
        if (this.#rows === 0) throw new Error("Empty matrix, no determinant");
        if (typeof this.#matrix[0][0] !== "number") throw new Error("Can not compute determinant of non-numeric matrix");
        if (this.#rows !== this.#cols) throw new Error("Determinant can only be computed for square matrices");

        if (this.#rows === 1) return this.#matrix[0][0];

        return this.#matrix[0].map((e, i) => {
            const subDeterminant = this.copy(0, i).determinant;
            return subDeterminant === false ? false : (i % 2 === 0 ? 1 : -1) * (e as number) * subDeterminant ;
        } ).reduce((p, c) => {
            if (p === false || c === false) return false;
            return p + c;
        }, 0);
    }

    print() {
        this.#matrix.forEach((row, i) => console.log(row));
    }
}