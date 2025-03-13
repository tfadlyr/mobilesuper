import { createSlice } from "@reduxjs/toolkit";
import {
  deleteListTask,
  deleteTask,
  deleteTaskProject,
  editCategoryTM,
  editTaskTM,
  getChoiceListTM,
  getCompleteTM,
  getDetailKorespondensiTM,
  getDetailProjectTM,
  getDetailTaskTM,
  getListDashboardTM,
  getListKorespondensiArsipTM,
  getListKorespondensiNextWeekTM,
  getListKorespondensiOverdueTM,
  getListKorespondensiTM,
  getListKorespondensiTodayTM,
  getListTaskTM,
  getTreeTM,
  postAttachmentTM,
  postCategoryTM,
  postCommentTM,
  postTaskTM,
  updateStatusTaskTM,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const TaskSlice = createSlice({
  name: "Task",
  initialState: {
    treeView: [],
    list: {
      id: "1",
      name: "Dashboard",
      type: "Dashboard",
      data: [],
      detail: null,
    },
    attachment: [],
    detailProject: null,
    variant: "list",
    choice: [],
    complete: {
      list: [],
    },
    refresh: null,
    status: "",
    loading: false,
    listKorespondensi: {
      today: [],
      overdue: [],
      nextweek: [],
    },
    loadingtoday: false,
    loadingoverdue: false,
    loadingnextweek: false,
  },
  reducers: {
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    setAddTask: (state, action) => {
      state.addTask = action.payload;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getTreeTM.fulfilled, (state, action) => {
        state.treeView = action.payload;
      })
      .addCase(getListTaskTM.fulfilled, (state, action) => {
        const { data, type } = action.payload;
        const newDataList = {
          id: data.id,
          name: data.name,
          type: type,
          data: data.tasks,
          detail: null,
        };
        state.list = newDataList;
        state.loading = false;
      })
      .addCase(getListTaskTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListDashboardTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "1",
          name: "Dashboard",
          type: "Dashboard",
          data: data,
          detail: null,
        };
        state.list = newDataList;
        state.loading = false;
      })
      .addCase(getListDashboardTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListKorespondensiTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "2",
          name: "Korespondensi",
          type: "Korespondensi",
          data: data,
          detail: null,
        };
        state.list = newDataList;
        state.loading = false;
      })
      .addCase(getListKorespondensiTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListKorespondensiArsipTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "2",
          name: "Korespondensi",
          type: "Korespondensi",
          data: data,
          detail: null,
        };
        state.list = newDataList;
        state.loading = false;
      })
      .addCase(getListKorespondensiArsipTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListKorespondensiTodayTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "2",
          name: "Korespondensi",
          type: "Korespondensi",
          data: data,
          detail: null,
        };
        // state.list = newDataList;
        state.listKorespondensi.today = action.payload;
        state.loadingtoday = false;
      })
      .addCase(getListKorespondensiTodayTM.pending, (state, action) => {
        state.loadingtoday = true;
      })
      .addCase(getListKorespondensiOverdueTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "2",
          name: "Korespondensi",
          type: "Korespondensi",
          data: data,
          detail: null,
        };
        // state.list = newDataList;
        state.listKorespondensi.overdue = action.payload;
        state.loadingoverdue = false;
      })
      .addCase(getListKorespondensiOverdueTM.pending, (state, action) => {
        state.loadingoverdue = true;
      })
      .addCase(getListKorespondensiNextWeekTM.fulfilled, (state, action) => {
        const data = action.payload;
        const newDataList = {
          id: "2",
          name: "Korespondensi",
          type: "Korespondensi",
          data: data,
          detail: null,
        };
        // state.list = newDataList;
        state.listKorespondensi.nextweek = action.payload;
        state.loadingnextweek = false;
      })
      .addCase(getListKorespondensiNextWeekTM.pending, (state, action) => {
        state.loadingnextweek = true;
      })
      .addCase(getDetailTaskTM.fulfilled, (state, action) => {
        state.list = {
          ...state.list,
          detail: action.payload,
        };
        state.loading = false;
      })
      .addCase(getDetailTaskTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailKorespondensiTM.fulfilled, (state, action) => {
        state.list = {
          ...state.list,
          detail: action.payload,
        };
        state.loading = false;
      })
      .addCase(getDetailKorespondensiTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postCommentTM.fulfilled, (state, action) => {
        state.refresh = "comment";
        state.loading = false;
      })
      .addCase(postCommentTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postCategoryTM.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.refresh = "tree";
        state.loading = false;
      })
      .addCase(postCategoryTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postCategoryTM.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(editCategoryTM.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.refresh = "detail_project";
        state.loading = false;
      })
      .addCase(editCategoryTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editCategoryTM.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailProjectTM.fulfilled, (state, action) => {
        const data = action.payload.data;
        const type = action.payload.type;
        if (type !== "") {
          const newDataList = {
            ...state.list,
            id: data.id,
            name: data.nama,
            type: "Detail Project",
          };
          state.list = newDataList;
        }
        state.detailProject = data;
        state.loading = false;
      })
      .addCase(getDetailProjectTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postAttachmentTM.fulfilled, (state, action) => {
        state.attachment = [...state.attachment, action.payload];
        state.loading = false;
      })
      .addCase(postAttachmentTM.pending, (state, action) => {
        state.attachment = [...state.attachment, action.payload];
        state.loading = true;
      })
      .addCase(postTaskTM.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.refresh = "list_task";
        state.loading = false;
      })
      .addCase(postTaskTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postTaskTM.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(editTaskTM.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.refresh = "list_task";
        state.loading = false;
      })
      .addCase(editTaskTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editTaskTM.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(updateStatusTaskTM.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.refresh = "list_task";
        state.loading = false;
      })
      .addCase(updateStatusTaskTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateStatusTaskTM.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getChoiceListTM.fulfilled, (state, action) => {
        state.choice = action.payload;
        state.loading = false;
      })
      .addCase(getChoiceListTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getChoiceListTM.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getCompleteTM.fulfilled, (state, action) => {
        state.complete.list = action.payload;
        state.loading = false;
      })
      .addCase(getCompleteTM.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCompleteTM.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(deleteTask.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(deleteTaskProject.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(deleteTaskProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTaskProject.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(deleteListTask.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(deleteListTask.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteListTask.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { setVariant, setAddTask, setRefresh, setStatus } =
  TaskSlice.actions;

export default TaskSlice.reducer;
