type File = {
    name: string,
    size: number,
}

type Dir = {
    name: string,
    parent: Dir | null,
    dirs: Dir[],
    files: File[],
    dirSize: number,
}

type Active = {
    dir: Dir,
}

const checkAndAdd = (dir: Dir, max: number): number => {
    let result = dir.dirSize <= max ? dir.dirSize : 0;
    dir.dirs.forEach(d => {
        result += checkAndAdd(d, max);
    })
    return result;
}

const addFileToDir = (f: File, d: Dir) => {
    const alreadyExists = d.files.find(x => x.name === f.name);
    if (!alreadyExists) {
        d.files.push(f);
        addSizeToDir(d, f.size);
    }
}

const addSizeToDir = (d: Dir, s: number) => {
    d.dirSize += s;
    if (d.parent !== null) addSizeToDir(d.parent, s);
}


exports.solution = (input: string[]) => {
    const root: Dir = {
        name: "/",
        parent: null,
        dirs: [],
        files: [],
        dirSize: 0,
    }

    const ad: Active = {
        dir: root
    };

    const ibc: string[][] = [];
    let commandId = 0;
    input.forEach(i => {
        if (i[0] === '$') {
            commandId++;
            ibc[commandId] = []
        }
        ibc[commandId].push(i);
    });

    ibc.forEach(i => {
        const splitCmd = (i.shift() ?? "").split(" ");
        if (splitCmd[1] === "cd") {
            const dirName = splitCmd[2];
            if (dirName === ".." && ad.dir.parent) {
                ad.dir = ad.dir.parent;
            } else if (dirName === "/") {
                ad.dir = root;
            } else {
                const found = ad.dir.dirs.find(d => d.name === dirName);
                if (found) {
                    ad.dir = found;
                }
            }
        } else if (splitCmd[1] === "ls") {
            i.forEach(ls => {
                const [size, fileName] = ls.split(" ");
                if (size === "dir") {
                    const nd: Dir = {
                        name: fileName,
                        dirs: [],
                        files: [],
                        parent: ad.dir,
                        dirSize: 0,
                    }
                    ad.dir.dirs.push(nd);
                } else {
                    addFileToDir({name: fileName, size: parseInt(size)}, ad.dir);
                }
            });
        }

    })




    console.log(checkAndAdd(root, 100000));
}