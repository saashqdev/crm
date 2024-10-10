import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import contactsSlice from './contacts/contactsSlice';
import customer_interactionsSlice from './customer_interactions/customer_interactionsSlice';
import leadsSlice from './leads/leadsSlice';
import opportunitiesSlice from './opportunities/opportunitiesSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';
import organizationsSlice from './organizations/organizationsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    contacts: contactsSlice,
    customer_interactions: customer_interactionsSlice,
    leads: leadsSlice,
    opportunities: opportunitiesSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
    organizations: organizationsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
