import { createSlice } from "@reduxjs/toolkit";
import {
  getFaq,
  getFaqCategory,
  getFaqByCategory,
  getFaqGroup,
  getFaqByGroup,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const FaqSlice = createSlice({
  name: "Faq",
  initialState: {
    faq: {
      lists: [],
    },
    faqCategory: {
      lists: [],
    },
    faqByCategory: {
      DDR: [],
      R: [],
      AP: [],
      PK: [],
      SA: [],
    },
    faqGroup: {
      lists: [],
    },
    faqByGroup: {
      lists: [],
    },
    loading: false,
  },
  reducers: {
    setFaq: (state, action) => {
      state.faq.lists = action.payload;
    },
    setFaqCategory: (state, action) => {
      state.faqCategory.lists = action.payload;
    },
    setFaqByCategory: (state, action) => {
      state.faqByCategory = action.payload;
    },
    setFaqGroup: (state, action) => {
      state.faqGroup = action.payload;
    },
    setFaqByGroup: (state, action) => {
      state.faqByGroup = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getFaq.fulfilled, (state, action) => {
        state.faq.lists = action.payload;
        state.loading = false;
      })
      .addCase(getFaq.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFaq.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFaqCategory.fulfilled, (state, action) => {
        state.faqCategory.lists = action.payload;
        state.loading = false;
      })
      .addCase(getFaqCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFaqCategory.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFaqByCategory.fulfilled, (state, action) => {
        if (action.payload.id == state.faqCategory.lists[0].id) {
          state.faqByCategory.DDR = action.payload.respon;
        } else if (action.payload.id == state.faqCategory.lists[1].id) {
          state.faqByCategory.R = action.payload.respon;
        } else if (action.payload.id == state.faqCategory.lists[2].id) {
          state.faqByCategory.AP = action.payload.respon;
        } else if (action.payload.id == state.faqCategory.lists[3].id) {
          state.faqByCategory.PK = action.payload.respon;
        } else if (action.payload.id == state.faqCategory.lists[4].id) {
          state.faqByCategory.SA = action.payload.respon;
        }
        state.loading = false;
      })
      .addCase(getFaqByCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFaqByCategory.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFaqGroup.fulfilled, (state, action) => {
        state.faqGroup.lists = action.payload;
        state.loading = false;
      })
      .addCase(getFaqGroup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFaqGroup.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFaqByGroup.fulfilled, (state, action) => {
        state.faqByGroup.lists = action.payload;
        state.loading = false;
      })
      .addCase(getFaqByGroup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFaqByGroup.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { setFaq, setFaqCategory, setFaqByCategory, setFaqByGroup } =
  FaqSlice.actions;

export default FaqSlice.reducer;
