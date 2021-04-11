import { isReactDevMode } from "../common/util/util"

export const API_URL = isReactDevMode() ? "http://localhost:5000/api/v1" : "https://backend.nowledge.xyz/api/v1"