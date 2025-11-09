import { configureStore } from "@reduxjs/toolkit";
import { propertyApi } from "../services/propertyApi";
import { agentApi } from "../services/agentApi";
import { leadApi } from "../services/leadApi";
import { tableApi } from "../services/tableApi";

// imports slices
import agentReducer from "../stores/slices/agentSlice.js";
import leadReducer from "../stores/slices/leadSlice.js";
import propertyReducer from "../stores/slices/propertySlice.js";
import authReducer from "./slices/appSlice.js"
import revenueReducer from "./slices/revenue_graph_das.js"

export const store = configureStore({
    reducer: {
        agents: agentReducer,
        leads: leadReducer,
        property: propertyReducer,
        auth: authReducer,
        revenueGraph: revenueReducer,

        [propertyApi.reducerPath]: propertyApi.reducer,
        [agentApi.reducerPath]: agentApi.reducer,
        [leadApi.reducerPath]: leadApi.reducer,
        [tableApi.reducerPath]: tableApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(propertyApi.middleware)
            .concat(agentApi.middleware)
            .concat(leadApi.middleware)
            .concat(tableApi.middleware),
});
