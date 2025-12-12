type D12ShapePoint = {
    x: number;
    y: number;
}

type D12Shape = {
    id: number;
    points: D12ShapePoint[];
}

type D12Area = {
    dimensions: {
        w: number;
        h: number;
    },
    shapeCounts: number[];
}

const createNewShape = (id: number) => {
    return {
        id,
        points: []
    }
}

const D12_SHAPE_COUNT = 6; // there is always 6 shapes

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const shapes: D12Shape[] = [];
    const areas: D12Area[] = [];

    let currentShape: D12Shape;
    input.forEach((row, i) => {
        if (row === '') return;
        if (i < D12_SHAPE_COUNT * 5) {
            if (i % 5 === 0) {
                currentShape = createNewShape(parseInt(row))
                shapes.push(currentShape);
            } else {
                row.split('').forEach((point, j) => {
                    if (point === '#') currentShape.points.push({x: j, y: i % 5 - 1})
                })
            }
        } else {
            const [area, shapeCountString] = row.split(': ');
            const [w, h] = area.split('x').map(Number);
            const shapeCounts = shapeCountString.split(' ').map(Number);
            areas.push({
                dimensions: { w, h },
                shapeCounts,
            })
        }
    })

    console.log("Shapes: ", shapes);
    console.log("Areas: ", areas);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}