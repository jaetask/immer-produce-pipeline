import { produce } from "immer"

// @ts-ignore
const producePipeline = fns => x => fns.map(produce).reduce((y, f) => f(y), x)

export default producePipeline