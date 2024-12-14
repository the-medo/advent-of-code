import { Matrix } from "../Matrix";

/**
 * Calculate the solutions of a system of linear equations using Cramer's Rule.
 *
 * Form of equations (example for 3x3 linear system):
 *      a1.X + b1.Y + c1.Z = d1
 *      a2.X + b2.Y + c2.Z = d2
 *      a3.X + b3.Y + c3.Z = d3
 *
 * These equations need to be transformed to a matrix, number of columns is always 1 higher than rows:
 *
 *      | a1 b1 c1   d1 |
 *  m = | a2 b2 c2   d2 |
 *      | a3 b3 c3   d3 |
 *
 * This matrix is input of this function.
 *
 * ------------------
 * Based on this matrix, we need to compute determinants D, dX, dY and dZ
 * Computation of determinants is done inside the Matrix class, but here are the matrices we need to compute determinants for:
 *
 *      | a1 b1 c1 |         | d1 b1 c1 |         | a1 d1 c1 |         | a1 b1 d1 |
 * D  = | a2 b2 c2 |    dX = | d2 b2 c2 |    dY = | a2 d2 c2 |    dZ = | a2 b2 d2 |
 *      | a3 b3 c3 |         | d3 b3 c3 |         | a3 d3 c3 |         | a3 b3 d3 |
 *
 * System variables are computed following way:
 *
 *                            x = dX / D           y = dY / D          z = dZ / D
 *
 * Function returns array of system variables in order:
 *
 *                            [x, y, z]
 *
 * @param {Matrix<number>} m - Matrix representing the system of equations with the last column containing the results of the equations
 * @returns {number[]} - Array of solutions for the system of equations
 * @throws {Error} - If the number of columns in the matrix is not one higher than the number of rows, or if there is an error in computing determinants
 */
export const equationsByCramersRule = (m: Matrix<number>): number[] => {
    if (m.cols !== m.rows + 1) throw new Error("Number of cols must be 1 higher than number of rows!");

    /* we get and remove last column - that is the D column with equation results */
    const dCol = m.getCol(m.cols - 1);
    m.removeCol(m.cols - 1);

    /* at this point, matrix m is without last column - should be square */
    const D = m.determinant;
    if (D === false) throw new Error("Error with computing D")

    /* now, we can compute determinant dN for every variable N */
    const determinants = Array(m.cols).fill(0).map((_, i) => {
        /* we create copy of base matrix and replace appropriate column with D column, which we extracted at the start */
        return m.copy().setCol(i, dCol).determinant;
    });

    return Array(m.cols).fill(0).map((_, i) => {
        const dN = determinants[i];
        if (dN === false) throw new Error(`Error with computing d${i}`);
        return dN / D
    });
}