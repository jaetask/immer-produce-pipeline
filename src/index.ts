import { produce } from "immer"

// @ts-ignore
const producePipe = fns => x => fns.map(produce).reduce((y, f) => f(y), x)

export default producePipe