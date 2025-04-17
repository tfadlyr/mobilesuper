import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Config } from "../constants/config";

const BASE_URL = Config?.base_url;
const kebijakan = BASE_URL + "policy/";
const kalender = BASE_URL + "calendar/";
const addressbook = BASE_URL + "bridge/";
const pegawai = BASE_URL + "bridge/";
const SATKER = BASE_URL + "bridge/";
const Linimasa = BASE_URL + "mp/";
const repository = BASE_URL + "repository/";
const profile = BASE_URL + "bridge/profile/";
const banner = BASE_URL + "bridge/home/benner/";
const galeri = BASE_URL + "bridge/home/gallery/";
const berita = BASE_URL + "bridge/home/news/";
const detailBerita = BASE_URL + "bridge/home/news/";
const taskManagement = BASE_URL + "calendar/";
const INFOGRAFIS = BASE_URL + "bridge/";
const MYPOST_LIST = BASE_URL + "mp/mypost/";
const MYPOST_DETAIL = BASE_URL + "mp/mypost/";
const CHART_VIEW = BASE_URL + "mp/mypost/chart/view/";
const CHART_POINT = BASE_URL + "mp/mypost/chart/point/";
const CHART_POST = BASE_URL + "mp/mypost/chart/post/";
const CHART_LIKE = BASE_URL + "mp/mypost/chart/like/";
const CHART_COUNT = BASE_URL + "mp/mypost/chart/count/";
const digitalSign = BASE_URL + "digitalsign/";
const produkHukum = BASE_URL + "bridge/admintools/nde/produkhukum/";

const attachmentExport = BASE_URL + "attachment/";
const TaskKorespondensi = BASE_URL + "bridge/";

const SUMMARY_TOTAL_POST = BASE_URL + "mp/admin/summary/total-post/";
const SUMMARY_GRAPH = BASE_URL + "mp/admin/summary/graph/";
const SUMMARY_ACCUMULATION = BASE_URL + "mp/admin/summary/accumulation/";
const SUMMARY_REVIEW = BASE_URL + "mp/admin/summary/review/";
const SUMMARY_BAD_USER = BASE_URL + "mp/admin/summary/bad-user/";
const EXPORT_FILE_BY_QUARTER =
  BASE_URL + "mp/admin/summary/export/users-by-quarter/";
const EXPORT_FILE_BY_EMPLOYEE = BASE_URL + "mp/admin/summary/export/pegawai/";

const GET_SUMMARY_COUNT = digitalSign + "document/summary/";
const GET_SUMMARY_LIST = digitalSign + "document/summary/list/";
const GET_SUBJECTLIST = digitalSign + "subject-list/";

const GET_LIST_CATEGORY = BASE_URL + "mp/admin/category/?limit=10";
const GET_LIST_COMPETENCE = BASE_URL + "mp/admin/competence/?limit=199";

const GET_LIST_UNIT_KERJA = BASE_URL + "mp/admin/iku/unitkerja-choice/";
const GET_LIST_PEGAWAI = BASE_URL + "mp/admin/iku/employee/";
const GET_LIST_PEGAWAI_V2 = BASE_URL + "mp/admin/iku/employee/v2/";
const GET_LIST_POSTINGAN_PEGAWAI = BASE_URL + "mp/admin/iku/employee/";
const GET_LIST_PEGAWAI_EXPORT = BASE_URL + "mp/admin/iku/employee/export/";
const GET_LIST_PEGAWAI_EXPORT_V2 =
  BASE_URL + "mp/admin/iku/employee/export/v2/";

const UNITKERJA = BASE_URL + "policy/unker/";
const UNITKERJAID = BASE_URL + "policy/tematik/";
const DOKGENERAL = BASE_URL + "policy/search/";

const SPPD = BASE_URL + "monperdin/";

const Cuti = BASE_URL + "cuti/";
const HelpDesk = Config.base_url_helpdesk;
const Survey = BASE_URL + "bridge/";

const Attendence = BASE_URL + "attendence/";
const Kepegawaian = BASE_URL + "bridge/profile/all/";
const DetailKepegawaian = BASE_URL + "bridge/pegawai-profile/";
const DataPribadi = BASE_URL + "bridge/admintools/profile/";
const DataDetailPribadi = BASE_URL + "bridge/pegawai-profile/";
const FilterUnitKerja = BASE_URL + "bridge/unitkerja/option/";
const Nominatif = BASE_URL + "bridge/unitkerja/pegawai/";
const NominatifReport = BASE_URL + "bridge/unitkerja/report/";
// faq
const Faq = BASE_URL + "bridge/admintools/";

// Buat instans Axios
const axiosInstance = axios.create();

// Tambahkan interceptor untuk semua request
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["User-Agent"] = `DevSuperApps/${Config.app_version}`; // Tambahkan User-Agent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Login
export const Login = createAsyncThunk(
  "auth/Login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      console.log(Config.base_url_auth);
      const payload = {
        username: username,
        password: password,
      };
      const respon = await axiosInstance.post(
        Config?.base_url_auth, // auth masih kube, belum dirubah ke production
        payload
      );
      return respon?.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//Reset Password
export const putResetPassword = createAsyncThunk(
  "profile/putResetPassword",
  async ({ token, payload }) => {
    const respon = await axiosInstance.put(
      `${profile}me/reset-personal/`,
      payload,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

// kebijakan
export const getCategory = createAsyncThunk(
  "kebijakan/getCategory",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${kebijakan}category/?limit=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getCategoryId = createAsyncThunk(
  "kebijakan/getCategoryId",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kebijakan}category/${id}/`, {
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

export const getCategoryIdPage = async (id, page) => {
  try {
    const respon = await axiosInstance.get(
      `${kebijakan}category/${id}/?page=${page}`,
      {
        headers: { Authorization: "cf50a5b6-d640-49df-a45d-29f3e7ca1f1c" },
      }
    );
    return respon.data;
  } catch (error) {
    return error;
  }
};

// ? paginasi list dokumen hukum gimana? -Ben
export const getDokHukum = createAsyncThunk(
  "kebijakan/getDokHukum",
  async ({ token, id, page, search }) => {
    const respon = await axiosInstance.get(
      `${kebijakan}category/${id}/?limit=${page}&tentang=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results.datas;
  }
);

export const getUnitKerjaTematik = createAsyncThunk(
  "kebijakan/getUnitKerjaTematik",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${UNITKERJA}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getDokGeneral = createAsyncThunk(
  "kebijakan/getDokGeneral",
  async ({ token, search, page }) => {
    const respon = await axiosInstance.get(
      `${DOKGENERAL}?&general=${search}&limit=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results.datas;
  }
);

export const getUnitKerjaTematikId = createAsyncThunk(
  "kebijakan/getUniteKerjaTematikId",
  async ({ token, id, page, search }) => {
    const respon = await axiosInstance.get(
      `${UNITKERJAID}${id}/?&limit=${page}&tentang=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results.datas;
  }
);

// event
export const getEvent = createAsyncThunk("calendar/getEvent", async (token) => {
  const respon = await axiosInstance.get(`${kalender}event/?limit=9999`, {
    headers: { Authorization: token },
  });
  return respon?.data.results;
});

export const getEventFilter = createAsyncThunk(
  "calendar/getEventFilter",
  async ({ token, status, search }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/?limit=999&status=${status}&title=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getEventToday = createAsyncThunk(
  "calendar/getEventToday",
  async (token) => {
    const respon = await axiosInstance.get(
      `${kalender}event/today/?limit=9999`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getEventProgress = createAsyncThunk(
  "calendar/getEventProgress",
  async (token) => {
    const respon = await axiosInstance.get(
      `${kalender}event/progress/?limit=9999`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getEventDetail = createAsyncThunk(
  "calendar/getEventDetail",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kalender}event/${id}/retrieve/`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getEventAgenda = createAsyncThunk(
  "calendar/getEventAgenda",
  async (data) => {
    const respon = await axiosInstance.get(
      `${kalender}event/${data.id}/agenda/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.results;
  }
);

export const getEventAgendaDetail = createAsyncThunk(
  "calendar/getEventAgendaDetail",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/${id}/retrieve/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getlistApprover = createAsyncThunk(
  "calendar/getlistApprover",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/notulensi/${id}/approver/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getlistNotulensi = createAsyncThunk(
  "calendar/getlistNotulensi",
  async ({ token, idagenda }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/${idagenda}/notulensi/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getDetailNotulensi = createAsyncThunk(
  "calendar/getDetailNotulensi",
  async ({ token, idnotu }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/notulensi/${idnotu}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const getlistTodo = createAsyncThunk(
  "calendar/getlistTodo",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/notulensi/${id}/task/?name=`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getDetailTodo = createAsyncThunk(
  "calendar/getDetailTodo",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/notulensi/task/${id}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const getlistAbsen = createAsyncThunk(
  "calendar/getlistAbsen",
  async ({ token, idagenda }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/${idagenda}/presensi/?user=`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getDetailAbsen = createAsyncThunk(
  "calendar/getDetailAbsen",
  async ({ token, idabsen }) => {
    const respon = await axiosInstance.get(
      `${kalender}event/agenda/presensi/${idabsen}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const putAbsen = createAsyncThunk("calendar/putAbsen", async (data) => {
  const respon = await axiosInstance.put(
    `${kalender}event/agenda/presensi/qrcode/${data.id_Qr}`,
    { status: data.status, is_scan: data.is_scan },
    { headers: { Authorization: data.token } }
  );
  return respon?.data.result;
});

export const postAttachment = createAsyncThunk(
  "calendar/postAttachment",
  async (data) => {
    let formData = new FormData();
    formData.append("file", data.result);
    const respon = await axiosInstance.post(
      `${kalender}attachment/create/`,
      formData,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const postEvent = createAsyncThunk(
  "calendar/postEvent",
  async (data) => {
    const respon = await axiosInstance.post(
      `${kalender}event/create/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const updateStatus = createAsyncThunk(
  "calendar/updateStatus",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}event/${data.id}/status/`,
      { status: data.status },
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}event/${data.id}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${kalender}event/${data.id}/destroy/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const postSubAgenda = createAsyncThunk(
  "calendar/postSubAgenda",
  async (data) => {
    const respon = await axiosInstance.post(
      `${kalender}event/agenda/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);

export const updateSubAgenda = createAsyncThunk(
  "calendar/updateSubAgenda",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}event/agenda/${data.id}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const deleteSubAgenda = createAsyncThunk(
  "calendar/deleteSubAgenda",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${kalender}event/agenda/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const postNotulensi = createAsyncThunk(
  "calendar/postNotulensi",
  async (data) => {
    let formData = new FormData();
    formData.append("agenda_id", data.agenda_id);
    formData.append("pdf", data.pdf, data.pdf.name);
    const respon = await axiosInstance.post(
      `${kalender}event/agenda/notulensi/create/`,
      formData,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const deleteNotulensi = createAsyncThunk(
  "calendar/deleteNotulensi",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${kalender}event/agenda/notulensi/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const readyToApprove = createAsyncThunk(
  "calendar/readyToApprove",
  async (data) => {
    const body = {
      body: "approve",
    };
    const respon = await axiosInstance.patch(
      `${kalender}event/agenda/notulensi/${data.id}/ready/`,
      JSON.stringify(body),
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const postTodo = createAsyncThunk("calendar/postTodo", async (data) => {
  const respon = await axiosInstance.post(
    `${kalender}event/agenda/notulensi/task/create/`,
    data.payload,
    { headers: { Authorization: data.token } }
  );
  return respon;
});

export const updateTodo = createAsyncThunk(
  "calendar/updateTodo",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}event/agenda/notulensi/task/${data.id}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const deleteTodo = createAsyncThunk(
  "calendar/deleteTodo",
  async ({ token, id }) => {
    const respon = await axiosInstance.delete(
      `${kalender}event/agenda/notulensi/task/${id}/destroy/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

//Kalender
export const getlistKalender = createAsyncThunk(
  "calendar/getlistKalender",
  async (token) => {
    const respon = await axiosInstance.get(`${kalender}calendar/?limit=10`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

//KalenderPersonal
export const getlistKalenderPersonal = createAsyncThunk(
  "calendar/getlistKalenderPersonal",
  async ({ token, month, year }) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/korespondensi/?month=${month}&year=${year}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

//KalenderPersonalMirror
export const getlistKalenderPersonalMirror = createAsyncThunk(
  "calendar/getlistKalenderPersonalMirror",
  async ({ token, mirror }) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/korespondensi/?mirror=${mirror}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

//KalenderSatker
export const getlistKalenderSatker = createAsyncThunk(
  "calendar/getlistKalenderSatker",
  async ({ token, satker, month, year, category }) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/korespondensi/?satker=${satker}&month=${month}&year=${year}&kategori=${category}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getDetailKalenderPersonal = createAsyncThunk(
  "calendar/getDetailKalenderPersonal",
  async (data) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/${data.id}/retrieve/korespondensi/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getDetailKalenderSatker = createAsyncThunk(
  "calendar/getDetailKalenderSatker",
  async (data) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/${data.id}/retrieve/korespondensi/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

//komentar
export const postKomenTodo = createAsyncThunk(
  "calendar/postKomenTodo",
  async (data) => {
    const respon = await axiosInstance.post(
      `${kalender}event/agenda/notulensi/task/comment/create/`,
      {
        task_id: data.task_id,
        parent_id: data.parent_id,
        message: data.message,
      },
      {
        headers: {
          Authorization: data.token,
        },
      }
    );
    return {
      newComment: respon?.data.result,
      detailTodo: data.detailTodo,
      parent_id: data.parent_id,
    };
  }
);

//pegawai
export const getPegawai = createAsyncThunk(
  "calendar/getPegawai",
  async ({ token, page, search }) => {
    const offset = page * 10;
    const respon =
      search === ""
        ? await axiosInstance.get(`${pegawai}profile/all/?limit=${offset}`, {
            headers: { Authorization: token },
          })
        : await axiosInstance.get(`${pegawai}profile/all/?search=${search}`, {
            headers: { Authorization: token },
          });
    return respon?.data.results;
  }
);

export const getDetailPegawai = createAsyncThunk(
  "calendar/getDetailPegawai",
  async ({ token, nip }) => {
    const respon = await axiosInstance.get(`${pegawai}profile/${nip}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

//satker
export const getBennerSatker = createAsyncThunk(
  "bridge/getBennerSatker",
  async (token) => {
    const respon = await axiosInstance.get(`${SATKER}satker/benner/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getGallerySatker = createAsyncThunk(
  "bridge/getGallerySatker",
  async (token) => {
    const respon = await axiosInstance.get(`${SATKER}satker/gallery/?page=1`, {
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

export const getSatkerNews = createAsyncThunk(
  "bridge/getSatkerNews",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${SATKER}satker/news/?page=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getDetailSatkerNews = createAsyncThunk(
  "bridge/getDetailSatkerNews",
  async (data) => {
    const respon = await axiosInstance.get(`${SATKER}satker/news/${data.id}/`, {
      headers: { Authorization: data.token },
    });
    return respon?.data.results;
  }
);

export const getPesan = createAsyncThunk("bridge/getPesan", async (token) => {
  const respon = await axiosInstance.get(`${SATKER}satker/pesan/`, {
    headers: { Authorization: token },
  });
  return respon?.data.results;
});

export const getUltah = createAsyncThunk("bridge/getUltah", async (token) => {
  const respon = await axiosInstance.get(`${SATKER}satker/birthday/`, {
    headers: { Authorization: token },
  });
  return respon?.data.results;
});

export const getSatkerLinimasa = createAsyncThunk(
  "mp/getSatkerLinimasa",
  async (token) => {
    const respon = await axiosInstance.get(
      `${Linimasa}linimasa/?limit=6&type=satker`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);
export const getDivision = createAsyncThunk(
  "calendar/getDivision",
  async (token) => {
    const respon = await axiosInstance.get(
      `${addressbook}addressbook/division/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);
export const getEmployee = createAsyncThunk(
  "calendar/getEmployee",
  async ({ token, search }) => {
    if (search === "") {
      const respon = await axiosInstance.get(
        `${addressbook}addressbook/employee/`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.results;
    } else {
      const respon = await axiosInstance.get(
        `${addressbook}addressbook/employee/?search=${search}`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.results;
    }
  }
);
export const getFavorit = createAsyncThunk(
  "calendar/getFavorit",
  async ({ token, search }) => {
    if (search === "") {
      const respon = await axiosInstance.get(
        `${addressbook}addressbook/personals/`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.results;
    } else {
      const respon = await axiosInstance.get(
        `${addressbook}addressbook/personals/?search=${search}`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.results;
    }
  }
);
export const getDivisionTree = createAsyncThunk(
  "calendar/getDivisionTree",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${addressbook}addressbook/tree/${id}/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

// repository
export const getDocument = createAsyncThunk(
  "repository/getDocument",
  async ({ token, page, type, tipe }) => {
    if (tipe === "revision" || tipe === "review") {
      const respon = await axiosInstance.get(
        `${repository}my-documents/?limit=${page}&published=${type}&public=false&tipe=${tipe}`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.result;
    } else {
      const respon = await axiosInstance.get(
        `${repository}my-documents/?limit=${page}&published=${type}&public=false`,
        {
          headers: { Authorization: token },
        }
      );
      return respon?.data.result;
    }
  }
);

export const getDivisionFilter = createAsyncThunk(
  "repository/getDivisionFilter",
  async ({ token }) => {
    const respon = await axiosInstance.get(
      `${BASE_URL}bridge/master/division/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getSubDivisionFilter = createAsyncThunk(
  "repository/getSubDivisionFilter",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${BASE_URL}bridge/master/department-div/${id}/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getDocumentDibagikan = createAsyncThunk(
  "repository/getDocumentDibagikan",
  async ({ token, page, tipe }) => {
    const respon = await axiosInstance.get(
      `${repository}shared-documents/?limit=${page}&tipe=${tipe}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getDocumentTamplate = createAsyncThunk(
  "repository/getDocumentTamplate",
  async ({ token, page, general, by_title, unker, satker }) => {
    const respon = await axiosInstance.get(
      `${repository}my-documents/?limit=${page}&published=true&public=true&general=${general}&by_title=${by_title}&unker=${unker}&satker${satker}=`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getDetailDocument = createAsyncThunk(
  "repository/getDetailDocument",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${repository}${id}/document-detail/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const postCommentRepo = createAsyncThunk(
  "repository/document-comment",
  async (data, setRefresh = undefined) => {
    const respon = await axiosInstance.post(
      `${repository}/document-comment/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const getDownloadLampiran = createAsyncThunk(
  "attachment/download",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${attachmentExport}${id}/download`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const postRating = createAsyncThunk(
  "repository/postRating",
  async (data) => {
    const respon = await axiosInstance.put(
      `${repository}${data.id}/rate/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const postAttachmentRepo = createAsyncThunk(
  "repository/postAttachmentRepo",
  async (data) => {
    try {
      // Membuat FormData
      const formData = new FormData();
      formData.append("files", {
        uri: data.result.uri, // Path ke file
        type: data.result.mimeType, // MIME type dari file
        name: data.result.name, // Nama file (dengan ekstensi)
      });

      // Kirim data ke server menggunakan axiosInstance
      const respon = await axiosInstance.post(
        `${repository}attachment/`,
        formData,
        {
          headers: {
            Authorization: data.token, // Sertakan token otorisasi
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return respon?.data.result; // Kembalikan hasil dari server
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Gagal mengunggah file. Silakan coba lagi.");
    }
  }
);

export const postBerbagiDokumen = createAsyncThunk(
  "repository/postBerbagiDokumen",
  async (data) => {
    const respon = await axiosInstance.post(
      `${repository}document-share/`,
      data.result,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const putBerbagiDokumen = createAsyncThunk(
  "repository/putBerbagiDokumen",
  async (data) => {
    const respon = await axiosInstance.put(
      `${repository}${data.id}/document-edit/`,
      data.result,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const putUpdateState = createAsyncThunk(
  "repository/putUpdateState",
  async (data) => {
    const respon = await axiosInstance.put(
      `${repository}${data.id}/update-state/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const deleteBerbagiDokumen = createAsyncThunk(
  "repository/deleteBerbagiDokumen",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${repository}${data.id}}/document-delete/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const postDokumenTamplate = createAsyncThunk(
  "repository/postDokumenTamplate",
  async (data) => {
    const respon = await axiosInstance.post(
      `${repository}document-share/`,
      data.result,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const putDokumenTamplate = createAsyncThunk(
  "repository/putDokumenTamplate",
  async (data) => {
    const respon = await axiosInstance.put(
      `${repository}${data.id}/document-edit/`,
      data.result,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

//profile me

export const getProfileMe = createAsyncThunk(
  "profile/getProfileMe",
  async (token) => {
    const respon = await axiosInstance.get(`${profile}me/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

//banner

export const getBanner = createAsyncThunk("banner/getBanner", async (token) => {
  const respon = await axiosInstance.get(`${banner}`, {
    headers: { Authorization: token },
  });
  return respon?.data.results;
});

//galeri

export const getGaleri = createAsyncThunk(
  "galeri/getGaleri",
  async ({ token, pageGaleri }) => {
    const respon = await axiosInstance.get(`${galeri}?page=${pageGaleri}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

//berita

export const getBerita = createAsyncThunk(
  "berita/getBerita",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(`${berita}?page=${page}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getDetailBerita = createAsyncThunk(
  "berita/getDetailBerita",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${detailBerita}${id}/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

//mp
export const getLinimasa = createAsyncThunk(
  "mp/getLinimasa",
  async ({ token, page, category, competence, unker, satker, search }) => {
    const respon = await axiosInstance.get(
      `${Linimasa}linimasa/?limit=${page}&category=${category}&competence=${competence}&unker=${unker}&satker=${satker}&type=&search=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const patchLike = createAsyncThunk(
  "mp/patchLike",
  async ({ token, id }) => {
    const respon = await axiosInstance.patch(
      `${Linimasa}linimasa/${id}/like/`,
      undefined,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const patchUnlike = createAsyncThunk(
  "mp/patchUnlike",
  async ({ token, id }) => {
    const respon = await axiosInstance.patch(
      `${Linimasa}linimasa/${id}/unlike/`,
      undefined,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getDetailLinimasa = createAsyncThunk(
  "mp/getDetailLinimasa",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${Linimasa}linimasa/${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getViewLinimasa = createAsyncThunk(
  "mp/getViewLinimasa",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${Linimasa}linimasa/${id}/view/list/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const postComment = createAsyncThunk(
  "mp/postComment",
  async (data, setRefresh = undefined) => {
    const respon = await axiosInstance.post(
      `${Linimasa}linimasa/comment/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const getListsLike = createAsyncThunk(
  "mp/getListsLike",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${Linimasa}linimasa/${id}/like/list/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

//TASK MANAGEMENT
export const getTreeTM = createAsyncThunk(
  "taskmanagement/getTreeTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}project/tree/?limit=10&page=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getListDashboardTM = createAsyncThunk(
  "taskmanagement/getListDashboardTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}dashboard/list/?limit=10&page=${page}&my_task=true`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getListTaskTM = createAsyncThunk(
  "taskmanagement/getListTaskTM",
  async ({ token, id_list, type }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}list-task/${id_list}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.result,
      type: type,
    };
  }
);

export const getDetailTaskTM = createAsyncThunk(
  "taskmanagement/getDetailTaskTM",
  async ({ token, id_task }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}task/${id_task}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const getDetailProjectTM = createAsyncThunk(
  "taskmanagement/getDetailProjectTM",
  async ({ token, id_project, type = "" }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}project/${id_project}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.result,
      type: type,
    };
  }
);

export const postCommentTM = createAsyncThunk(
  "taskmanagement/postCommentTM",
  async (data, setRefresh = undefined) => {
    const respon = await axiosInstance.post(
      `${taskManagement}comment/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const postCategoryTM = createAsyncThunk(
  "taskmanagement/postCategoryTM",
  async (data) => {
    const respon = await axiosInstance.post(
      `${taskManagement}project/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const editCategoryTM = createAsyncThunk(
  "taskmanagement/editCategoryTM",
  async (data) => {
    const respon = await axiosInstance.put(
      `${taskManagement}project/${data.id_project}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const postTaskTM = createAsyncThunk(
  "taskmanagement/postTaskTM",
  async (data) => {
    const respon = await axiosInstance.post(
      `${taskManagement}task/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const editTaskTM = createAsyncThunk(
  "taskmanagement/editTaskTM",
  async (data) => {
    const respon = await axiosInstance.put(
      `${taskManagement}task/${data.id_task}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const updateStatusTaskTM = createAsyncThunk(
  "taskmanagement/updateStatusTaskTM",
  async (data) => {
    const respon = await axiosInstance.put(
      `${taskManagement}card/${data.id_task}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const postAttachmentTM = createAsyncThunk(
  "taskmanagement/postAttachmentTM",
  async (data) => {
    let formData = new FormData();
    formData.append("file", data.result);
    const respon = await axiosInstance.post(
      `${taskManagement}attachment/create/`,
      formData,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const getChoiceListTM = createAsyncThunk(
  "taskmanagement/getChoiceListTM",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${taskManagement}project/choice/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getCompleteTM = createAsyncThunk(
  "taskmanagement/getCompleteTM",
  async ({ token, id, search }) => {
    const respon = await axiosInstance.get(
      `${taskManagement}task/completed/?project_id=${id}&general=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const deleteTask = createAsyncThunk(
  "taskmanagement/deleteTask",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${taskManagement}task/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);

export const deleteTaskProject = createAsyncThunk(
  "taskmanagement/deleteTaskProject",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${taskManagement}project/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);

export const deleteListTask = createAsyncThunk(
  "taskmanagement/deleteListTask",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${taskManagement}list-task/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);

export const getListKorespondensiTM = createAsyncThunk(
  "taskmanagement/getListKorespondensiTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getListKorespondensiArsipTM = createAsyncThunk(
  "taskmanagement/getListKorespondensiArsipTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/archive/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);
export const getListKorespondensiOverdueTM = createAsyncThunk(
  "taskmanagement/getListKorespondensiOverdueTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/overdue`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);
export const getListKorespondensiTodayTM = createAsyncThunk(
  "taskmanagement/getListKorespondensiTodayTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/today`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);
export const getListKorespondensiNextWeekTM = createAsyncThunk(
  "taskmanagement/getListKorespondensiNextWeekTM",
  async ({ token, page }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/nextweek`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getDetailKorespondensiTM = createAsyncThunk(
  "taskmanagement/getDetailKorespondensiTM",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${TaskKorespondensi}integration/nde/todo/${id}/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const postMarkKorespondensiTM = createAsyncThunk(
  "taskmanagement/postMarkKorespondensiTM",
  async (data) => {
    const payload = {
      mark_complete: "1",
    };
    const respon = await axiosInstance.post(
      `${TaskKorespondensi}integration/nde/todo/${data.id}/mark/`,
      payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.status;
  }
);

//Penilian
export const getListPenilaian = createAsyncThunk(
  "mp/getListPenilaian",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Linimasa}admin/evaluation/?year=${data.tahun}&quarter=${data.TW}&limit=${data.page}&ditinjau=${data.ditinjau}&unker=${data.unitKerja}&general=${data.search}`,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.results;
  }
);

export const getTotalPenilaian = createAsyncThunk(
  "mp/getTotalPenilaian",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Linimasa}admin/evaluation/count/?year=${data.tahun}&quarter=${data.TW}`,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const getDetailPenilaian = createAsyncThunk(
  "mp/getDetailPenilaian",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${Linimasa}admin/evaluation/${id}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const postKomentarDetailPenilaian = createAsyncThunk(
  "mp/postKomentarDetailPenilaian",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Linimasa}linimasa/comment/penilaian/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getNilai = createAsyncThunk("mp/getNilai", async ({ token }) => {
  const respon = await axiosInstance.get(
    `${Linimasa}admin/category/?limit=10&type=penilai`,
    { headers: { Authorization: token } }
  );
  return respon?.data.results;
});

export const putAddApprove = createAsyncThunk(
  "mp/putAddApprove",
  async ({ token, id, body }) => {
    const respon = await axiosInstance.put(
      `${Linimasa}admin/evaluation/${id}/score/`,
      body,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const putCancelApprove = createAsyncThunk(
  "mp/putCancelApprove",
  async ({ token, id, body }) => {
    const respon = await axiosInstance.put(
      `${Linimasa}admin/evaluation/${id}/score/cancel/`,
      body,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const putTakeDown = createAsyncThunk(
  "mp/putTakeDown",
  async ({ token, id }) => {
    // const respon = await axiosInstance.put(`${Linimasa}admin/evaluation/${id}/cancel/`, { headers: { Authorization: token } })
    const respon = await fetch(`${Linimasa}admin/evaluation/${id}/cancel/`, {
      method: "put",
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

//agenda bersama
export const getListGrup = createAsyncThunk(
  "calendar/getListGrup",
  async (token) => {
    const respon = await axiosInstance.get(`${kalender}calendar/?limit=10`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getListAcara = createAsyncThunk(
  "calendar/getListAcara",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kalender}calendar/${id}/event/`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getListAgendaAcara = createAsyncThunk(
  "calendar/getListAgendaAcara",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/agenda/?calendar_id=${id}`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const getDetailAcara = createAsyncThunk(
  "calendar/getDetailAcara",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${kalender}calendar/event/${id}/retrieve/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.result;
  }
);

export const getDetailAgendaAcara = createAsyncThunk(
  "calendar/getDetailAgendaAcara",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kalender}event/${id}/retrieve/`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getListSubAgenda = createAsyncThunk(
  "calendar/getListSubAgenda",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kalender}event/${id}/agenda/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const postGrup = createAsyncThunk("calendar/postGrup", async (data) => {
  const respon = await axiosInstance.post(
    `${kalender}calendar/create/`,
    data.payload,
    {
      headers: { Authorization: data.token },
    }
  );
  return respon?.data;
});

export const postAgendaAcara = createAsyncThunk(
  "calendar/postAgendaAcara",
  async (data) => {
    const respon = await axiosInstance.post(
      `${kalender}calendar/event/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const getDetailGrup = createAsyncThunk(
  "calendar/getDetailGrup",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${kalender}calendar/${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const putEditGrup = createAsyncThunk(
  "calendar/putEditGrup",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}calendar/${data.id}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const putEditAgendaGrup = createAsyncThunk(
  "calendar/putEditAgendaGrup",
  async (data) => {
    const respon = await axiosInstance.put(
      `${kalender}calendar/event/${data.id}/update/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);
export const deleteAgendaGrup = createAsyncThunk(
  "calendar/deleteAgendaGrup",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${kalender}calendar/event/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);
export const deleteGrup = createAsyncThunk(
  "calendar/deleteGrup",
  async (data) => {
    const respon = await axiosInstance.delete(
      `${kalender}calendar/${data.id}/destroy/`,
      { headers: { Authorization: data.token } }
    );
    return respon;
  }
);

//Dashboard
export const getKesejahteraan = createAsyncThunk(
  "bridge/getKesejahteraan",
  async ({ token, value, page }) => {
    const respon = await axiosInstance.get(
      `${INFOGRAFIS}infografis/?source=${value}&limit=5&page=${page}`,
      { headers: { Authorization: token } }
    );
    return respon?.data;
  }
);

export const getPerencanaan = createAsyncThunk(
  "bridge/getPerencanaan",
  async ({ token, value, page }) => {
    const respon = await axiosInstance.get(
      `${INFOGRAFIS}infografis/?source=${value}&limit=5&page=${page}`,
      { headers: { Authorization: token } }
    );
    return respon?.data;
  }
);

export const getTeknologi = createAsyncThunk(
  "bridge/getTeknologi",
  async (token) => {
    const respon = await axiosInstance.get(`${INFOGRAFIS}teknologi-terkini/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);
//repository
export const getSharedDocuments = createAsyncThunk(
  "repository/getSharedDocuments",
  async (token) => {
    const respon = await axiosInstance.get(`${repository}shared-documents/`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);
export const getDetailsSharedDocuments = createAsyncThunk(
  "repository/getDetailsSharedDocuments",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${repository}${id}/document-detail/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

//postingan saya
export const getMyPostList = createAsyncThunk(
  "mp/mypost",
  async ({ token, page, search }) => {
    const respon = await axiosInstance.get(
      `${MYPOST_LIST}?limit=${page}&search=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getMyPostDetail = createAsyncThunk(
  "mp/mypost/detail",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${MYPOST_DETAIL}${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getMyPostView = createAsyncThunk(
  "mp/mypost/chart/view",
  async (token) => {
    const respon = await axiosInstance.get(`${CHART_VIEW}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getMyPostPoint = createAsyncThunk(
  "mp/mypost/chart/point",
  async (token) => {
    const respon = await axiosInstance.get(`${CHART_POINT}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getMyPostLike = createAsyncThunk(
  "mp/mypost/chart/like",
  async (token) => {
    const respon = await axiosInstance.get(`${CHART_LIKE}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getMyPostCount = createAsyncThunk(
  "mp/mypost/chart/count",
  async (token) => {
    const respon = await axiosInstance.get(`${CHART_COUNT}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getSummaryTotalPost = createAsyncThunk(
  "mp/admin/summary/total-post",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SUMMARY_TOTAL_POST}?year=${data.year}&quarter=${data.quarter}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getSummaryBadUser = createAsyncThunk(
  "mp/admin/summary/bad-user/",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SUMMARY_BAD_USER}?year=${data.year}&quarter=${data.quarter}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getSummaryGraph = createAsyncThunk(
  "mp/admin/summary/graph/",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SUMMARY_GRAPH}?year=${data.year}&quarter=${data.quarter}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getSummaryAccumulation = createAsyncThunk(
  "mp/admin/summary/accumulation/",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SUMMARY_ACCUMULATION}?year=${data.year}&quarter=${data.quarter}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getSummaryReview = createAsyncThunk(
  "mp/admin/summary/review/",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SUMMARY_REVIEW}?year=${data.year}&quarter=${data.quarter}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getExportFileEmployee = createAsyncThunk(
  "mp/admin/summary/export/pegawai/",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${EXPORT_FILE_BY_EMPLOYEE}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getExportFileQuarter = createAsyncThunk(
  "mp/admin/summary/export/users-by-quarter/",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${EXPORT_FILE_BY_QUARTER}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getListCategory = createAsyncThunk(
  "mp/admin/category/",
  async (token) => {
    const respon = await axiosInstance.get(`${GET_LIST_CATEGORY}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getListCompetence = createAsyncThunk(
  "mp/admin/competence/",
  async (token) => {
    const respon = await axiosInstance.get(`${GET_LIST_COMPETENCE}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getListUnitKerja = createAsyncThunk(
  "mp/admin/iku/unitkerja-choice/",
  async (token) => {
    const respon = await axiosInstance.get(`${GET_LIST_UNIT_KERJA}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getListPegawai = createAsyncThunk(
  "mp/admin/iku/employee",
  async (data) => {
    const respon = await axiosInstance.get(
      `${GET_LIST_PEGAWAI_V2}?year=${data.year}&quarter=${data.quarter}&unit_kerja=${data.unitKerja}&limit=${data.page}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.results;
  }
);

export const getListPostPegawai = createAsyncThunk(
  "mp/admin/iku/employee/id",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${GET_LIST_POSTINGAN_PEGAWAI}${id}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getListPegawaiExport = createAsyncThunk(
  "admin/iku/employee/export",
  async (data) => {
    const respon = await axiosInstance.get(
      `${GET_LIST_PEGAWAI_EXPORT_V2}?year=${data.year}&quarter=${data.quarter}&unit_kerja=${data.unitKerja}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

// export const postMyArticle = createAsyncThunk("mp/", async (data, setRefresh = undefined) => {
//     const respon = await axiosInstance.post(`${Linimasa}linimasa/comment/`, data.payload, { headers: { Authorization: data.token } })
//     return respon?.data
// })
//Digital Signature
export const getListComposer = createAsyncThunk(
  "digitalsign/getListComposer",
  async ({ token, tipe, page, search = "" }) => {
    if (token !== "" && tipe !== undefined) {
      const respon = await axiosInstance.get(
        `${digitalSign}document/composer/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
        { headers: { Authorization: token } }
      );
      return {
        data: respon?.data.results,
        tipe: tipe,
      };
    }
  }
);
export const getListInProgress = createAsyncThunk(
  "digitalsign/getListInProgress",
  async ({ token, tipe, page, search, filter = "" }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/inprogress/?tipe_dokumen=${tipe}&limit=${page}&general=${search}&direktorat=${filter}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const getListRetry = createAsyncThunk(
  "digitalsign/getListRetry",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/retry/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);
export const getListReady = createAsyncThunk(
  "digitalsign/getListReady",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/ready/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);
export const getListCompleted = createAsyncThunk(
  "digitalsign/getListCompleted",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/completed/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const getCounterMain = createAsyncThunk(
  "digitalsign/getCounterMain",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(`${digitalSign}main-counter/`, {
      headers: { Authorization: token },
    });
    return {
      data: respon?.data.result,
      tipe: tipe,
    };
  }
);

export const getListInbox = createAsyncThunk(
  "digitalsign/getListInbox",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/sk-completed/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const getListNeedSignSK = createAsyncThunk(
  "digitalsign/getListNeedSignSK",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/sk-need-sign/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const getListNeedApproveSK = createAsyncThunk(
  "digitalsign/getListNeedApproveSK",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/sk-need-approval/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const getListRejected = createAsyncThunk(
  "digitalsign/getListRejected",
  async ({ token, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/rejected/?limit=${page}&general=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);

export const getListTrack = createAsyncThunk(
  "digitalsign/getListTrack",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/track/?limit=${page}&general=${search}&tipe_dokumen=${tipe}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);
export const getListDraft = createAsyncThunk(
  "digitalsign/getListDraft",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/draft/?tipe_dokumen=${tipe}&limit=${page}&general=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const parafPerizinan = createAsyncThunk(
  "digitalsign/parafPerizinan",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/paraf/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const parafBeforeTTDEPerizinan = createAsyncThunk(
  "digitalsign/parafBeforeTTDEPerizinan",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/prepare-ttde/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const revisiPerizinan = createAsyncThunk(
  "digitalsign/revisiPerizinan",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/reject/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);
export const getNomorPerizinanMenteri = createAsyncThunk(
  "digitalsign/getNomorPerizinanMenteri",
  async ({ token, param }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}perizinan-penomoran/?jenis_dokumen=${param.jenisDokumen}&tanggal=${param.tanggal}`,
      { headers: { Authorization: token } }
    );
    return respon?.data;
  }
);

export const addDocumentDigiSign = createAsyncThunk(
  "digitalsign/addDocumentDigiSign",
  async (data) => {
    const respon = await axiosInstance.post(
      `${digitalSign}document/create/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const putDocumentPerizinan = createAsyncThunk(
  "digitalsign/putDocumentPerizinan",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/${data.id}`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return respon?.data;
  }
);

export const getListSignedDigiSign = createAsyncThunk(
  "digitalsign/getListSignedDigiSign",
  async ({ token, tipe, page, search, filter = "" }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/signed/?tipe_dokumen=${tipe}&limit=${page}&general=${search}&direktorat=${filter}`,
      { headers: { Authorization: token } }
    );
    return {
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);

export const putDocumentDigiSign = createAsyncThunk(
  "digitalsign/putDocumentDigiSign",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/${data.id}/draft/`,
      { status: data.status },
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const addAttachmentDigiSign = createAsyncThunk(
  "digitalsign/addAttachmentDigiSign",
  async (data) => {
    const formData = new FormData();
    formData.append("file", {
      uri: data.file.uri, // Path ke file
      type: data.file.mimeType, // MIME type dari file
      name: data.file.name, // Nama file (dengan ekstensi)
    });
    formData.append("name", data.name);

    const respon = await axiosInstance.post(
      `${digitalSign}attachment/create/`,
      formData,
      {
        headers: {
          Authorization: data.token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      data: respon?.data,
      tipe: data.name.startsWith("perizinan") ? "perizinan" : "lampiran",
    };
  }
);

export const getDetailDigisign = createAsyncThunk(
  "digitalsign/getDetailDigisign",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${digitalSign}document/${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getDetailDigisignMonitoring = createAsyncThunk(
  "digitalsign/getDetailDigisignMonitoring",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/${id}?all=true`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const deleteDokumenLain = createAsyncThunk(
  "digitalsign/deleteDokumenLain",
  async ({ token, id }) => {
    const respon = await axiosInstance.delete(`${digitalSign}document/${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const tolakDokumenLain = createAsyncThunk(
  "digitalsign/tolakDokumenLain",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/reject_document/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data.result;
  }
);

export const getCounterDigitalSign = createAsyncThunk(
  "digitalsign/getCounterDigitalSign",
  async ({ token, tipe }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document-counter/?type=${tipe}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.result,
    };
  }
);

export const getCounterSK = createAsyncThunk(
  "digitalsign/getCounterSK",
  async ({ token, tipe }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document-counter/?type=${tipe}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.result,
    };
  }
);

export const updateDocumentDigiSign = createAsyncThunk(
  "digitalsign/updateDocumentDigiSign",
  async (data) => {
    const respon = await axiosInstance.put(
      `${digitalSign}document/${data.id}/draft/`,
      { status: data.status },
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const putInProgressDigiSign = createAsyncThunk(
  "digitalsign/putInProgressDigiSign",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/approve/`,
      { status: data.status },
      { headers: { Authorization: data.token } }
    );
    return respon?.data.result;
  }
);

export const getCourseDigiSign = createAsyncThunk(
  "digitalsign/getCourseDigiSign",
  async (token) => {
    const respon = await axiosInstance.get(`${digitalSign}course/?limit=1000`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getListSertifikatEksternal = createAsyncThunk(
  "digitalsign/getListSertifikatEksternal",
  async ({ token, page, tipe }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}external-certificate/?page=${page}&limit=10&type=${tipe}`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);

export const getDetailSertifikatEksternal = createAsyncThunk(
  "digitalsign/getDetailSertifikatEksternal",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}external-certificate/${id}/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const getCheckProdHuk = createAsyncThunk(
  "digitalsign/getCheckProdHuk",
  async ({ token }) => {
    const respon = await axiosInstance.get(
      `${produkHukum}check-akses-produk-hukum/`,
      { headers: { Authorization: token } }
    );
    return respon?.data.results;
  }
);
export const getListProdukHukum = createAsyncThunk(
  "digitalsign/getListProdukHukum",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}permen/?category=${tipe}&limit=${page}&search=${search}`,
      { headers: { Authorization: token } }
    );
    return {
      next: respon?.data?.next,
      previous: respon?.data?.previous,
      data: respon?.data.results,
      tipe: tipe,
    };
  }
);
export const getDetailProdukHukum = createAsyncThunk(
  "digitalsign/getDetailProdukHukum",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${digitalSign}permen/${id}/`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const parafProdukHukum = createAsyncThunk(
  "digitalsign/parafProdukHukum",
  async (data) => {
    const respon = await axios.post(
      `${digitalSign}permen/paraf/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const revisionProdukHukum = createAsyncThunk(
  "digitalsign/revisionProdukHukum",
  async (data) => {
    const respon = await axios.post(
      `${digitalSign}permen/${data.id}/revision/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const ttdeProdukHukum = createAsyncThunk(
  "digitalsign/ttdeProdukHukum",
  async (data) => {
    const respon = await axios.post(
      `${digitalSign}permen/${data.id}/ttde/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const getSummaryCount = createAsyncThunk(
  "document/summary/",
  async (token) => {
    const respon = await axiosInstance.get(`${GET_SUMMARY_COUNT}`, {
      headers: { Authorization: token },
    });
    return respon?.data.result;
  }
);

export const getSummaryList = createAsyncThunk(
  "document/summary/list/",
  async ({ token, sertifikat, pelatihan, judul }) => {
    const respon = await axiosInstance.get(
      `${GET_SUMMARY_LIST}?sertifikat=${sertifikat}&pelatihan=${pelatihan}&judul=${judul}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(
      `${GET_SUMMARY_LIST}?sertifikat=${sertifikat}&pelatihan=${pelatihan}&judul=${judul}`
    );
    return respon?.data.results;
  }
);

export const getSubjectList = createAsyncThunk(
  "document/getSubjectList",
  async ({ token, pelatihan }) => {
    const respon = await axiosInstance.get(
      `${GET_SUBJECTLIST}?pelatihan=${pelatihan}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.result;
  }
);

export const putReturnSK = createAsyncThunk(
  "digitalsign/putReturnSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/return/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putRevisionSK = createAsyncThunk(
  "digitalsign/putRevisionSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/revision/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putBatalkanSK = createAsyncThunk(
  "digitalsign/putBatalkanSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/reject/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putReleaseSK = createAsyncThunk(
  "digitalsign/putReleaseSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/${data.id}/release/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putSetujiSK = createAsyncThunk(
  "digitalsign/putSetujiSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/approve2/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putTandaTanganSK = createAsyncThunk(
  "digitalsign/putTandaTanganSK",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/approve2/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const putTandaTangan = createAsyncThunk(
  "digitalsign/putTandaTangan",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/approve/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const tandaTanganMentri = createAsyncThunk(
  "digitalsign/tandaTanganMentri",
  async (data) => {
    const respon = await axios.put(
      `${digitalSign}document/approve2/`,
      data.payload,
      { headers: { Authorization: data.token } }
    );
    return {
      data: respon?.data,
    };
  }
);

export const getCounterPerizinanMenteri = createAsyncThunk(
  "digitalsign/CounterPerizinanMenteri",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${digitalSign}perizinan-count/`, {
      headers: { Authorization: token },
    });
    return {
      data: respon?.data.result,
    };
  }
);

export const getCounterPKRL = createAsyncThunk(
  "digitalsign/getCounterPKRL",
  async ({ token, dashboard }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}pkrl-count/?type=${dashboard}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.result,
    };
  }
);

export const getCounterPKRLMonitoring = createAsyncThunk(
  "digitalsign/getCounterPKRLMonitoring",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${digitalSign}main-dashboard/`, {
      headers: { Authorization: token },
    });
    return {
      data: respon?.data.result,
    };
  }
);

export const getListMonitoring = createAsyncThunk(
  "digitalsign/getListMonitoring",
  async ({ token, tipe, page, search }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}main-list/?type=${tipe}&limit=${page}&general=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);
export const getCounterProdukHukum = createAsyncThunk(
  "digitalsign/getCounterProdukHukum",
  async ({ token, category }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}permen/count-dashboard/?isRoleCreator=${category}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.result,
    };
  }
);

export const getDasboardListPKRL = createAsyncThunk(
  "digitalsign/getDasboardListPKRL",
  async ({ token, tipe, page, search, kategori }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}document/laporan-pkrl/?tipe_dokumen=${tipe}&limit=${page}&general=${search}&direktorat=&kategori=${kategori}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);

export const getExportPKRL = createAsyncThunk(
  "digitalsign/getExportPKRL",
  async ({ token }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}export-pkrl/?&direktorat=&kategori=`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.result,
    };
  }
);

export const getMonitorCountWeek = createAsyncThunk(
  "digitalsign/getMonitorCountWeek",
  async ({ token, date }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}dashboard-monitor-count/?date=${date}&last_7_days=true`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);

export const getMonitorCountMonth = createAsyncThunk(
  "digitalsign/getMonitorCountMonth",
  async ({ token, month }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}dashboard-monitor-count/?monthly=${month}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);

export const getMonitorCountYear = createAsyncThunk(
  "digitalsign/getMonitorCountYear",
  async ({ token, year }) => {
    const respon = await axiosInstance.get(
      `${digitalSign}dashboard-monitor-count/?yearly=${year}`,
      {
        headers: { Authorization: token },
      }
    );
    return {
      data: respon?.data.results,
    };
  }
);

//Cuti
export const getCutiPersonal = createAsyncThunk(
  "cuti/getCutiPersonal",
  async (token) => {
    const respon = await axiosInstance.get(`${Cuti}jenis-cuti`, {
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

export const getKuotaCuti = createAsyncThunk(
  "cuti/getKuotaCuti",
  async (token) => {
    const respon = await axiosInstance.get(`${Cuti}kuota-cuti`, {
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

export const getTanggalLibur = createAsyncThunk(
  "cuti/getTanggalLibur",
  async (token) => {
    const respon = await axiosInstance.get(
      `${Cuti}tanggal-libur?tanggal_mulai=2023-01-01&tanggal_akhir=&jenis_liburan=`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getLiburKhusus = createAsyncThunk(
  "cuti/getLiburKhusus",
  async (token) => {
    const respon = await axiosInstance.get(
      `${Cuti}tanggal-libur?tanggal_mulai=2023-01-01&tanggal_akhir=&jenis_liburan=Private Holiday`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getArsipCuti = createAsyncThunk(
  "cuti/getArsipCuti",
  async ({ token, variant, page }) => {
    const respon = await axiosInstance.get(
      `${Cuti}dokumen-cutiku/?status=${variant}&tanggal_pembuatan_dimulai=&tanggal_pembuatan_sampai=&page=&limit=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getDetailArsipCuti = createAsyncThunk(
  "cuti/getDetailArsipCuti",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Cuti}dokumen-detail/?id_dokumen=${data.id}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const getFormCuti = createAsyncThunk(
  "cuti/getFormCuti",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Cuti}form-cuti?id_jenis_cuti=${data.id}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const getPilihApproval = createAsyncThunk(
  "cuti/getPilihApproval",
  async ({ token, type }) => {
    const respon = await axiosInstance.get(
      `${Cuti}pilih-approval?kata_kunci=&type=${type}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getPilihApprovalPejabat = createAsyncThunk(
  "cuti/getPilihApprovalPejabat",
  async ({ token, type }) => {
    const respon = await axiosInstance.get(
      `${Cuti}pilih-approval?kata_kunci=&type=${type}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getDokumenPersetujuan = createAsyncThunk(
  "cuti/getDokumenPersetujuan",
  async ({ token, variant, page }) => {
    const respon = await axiosInstance.get(
      `${Cuti}dokumen-persetujuanku/?status=${variant}&tanggal_pembuatan_dimulai=&tanggal_pembuatan_sampai=&page=&limit=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const postPengajuanCuti = createAsyncThunk(
  "cuti/postPengajuanCuti",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Cuti}pengajuan-cuti/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const postPengajuanCutiDraft = createAsyncThunk(
  "cuti/postPengajuanCutiDraft",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Cuti}simpan-draft/`,
      data.payload,
      {
        headers: { Authorization: data?.token },
      }
    );
    return respon?.data;
  }
);

export const postApproval = createAsyncThunk(
  "cuti/postApproval",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Cuti}approval-cuti/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const postTanggalCuti = createAsyncThunk(
  "cuti/postTanggalCuti",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Cuti}pilih-tanggal/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const postAttachmentCuti = createAsyncThunk(
  "cuti/postAttachmentCuti",
  async (data) => {
    let formData = new FormData();
    formData.append("file", {
      uri: data.result.uri,
      type: data.result.mimeType,
      name: data.result.name,
    });
    const respon = await axiosInstance.post(`${Cuti}unggah-berkas/`, formData, {
      headers: {
        Authorization: data.token,
        "Content-Type": "multipart/form-data",
      },
    });
    return respon?.data;
  }
);

export const postPembatalanCuti = createAsyncThunk(
  "cuti/postPembatalanCuti",
  async (data) => {
    const respon = await axiosInstance.post(
      `${Cuti}pembatalan-cuti/`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

//SPPD
export const getDashboardSPPD = createAsyncThunk(
  "sppd/getDashboard",
  async (token) => {
    const respon = await axiosInstance.get(`${SPPD}dashboard/`, {
      headers: { Authorization: token },
    });
    return respon?.data;
  }
);

export const getDocumentListSPPD = createAsyncThunk(
  "sppd/getDocumentListSPPD",
  async (token) => {
    const respon = await axiosInstance.get(`${SPPD}document/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getDocumentDetailSPPD = createAsyncThunk(
  "sppd/getDocumentDetailSPPD",
  async (data) => {
    const respon = await axiosInstance.get(`${SPPD}document/${data.id}/`, {
      headers: { Authorization: data.token },
    });
    return respon?.data;
  }
);

export const getDocumentDetailPersonalSPPD = createAsyncThunk(
  "sppd/getDocumentDetailPersonalSPPD",
  async (data) => {
    const respon = await axiosInstance.get(
      `${SPPD}document-personal/${data.id}/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const getDocumentAttachmentSPPD = createAsyncThunk(
  "sppd/getDocumentAttachmentSPPD",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${SPPD}document/attachment/${id}/?mode=base64`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

export const getDocumentCetakSPPD = createAsyncThunk(
  "sppd/getDocumentCetakSPPD",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(
      `${SPPD}document/back-form/${id}/?mode=base64`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data;
  }
);

//help desk
export const getTicket = createAsyncThunk(
  "helpDesk/getTicket",
  async (data) => {
    const respon = await axiosInstance.get(
      `${HelpDesk}ticket?nip=${data.nip}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon.data.results;
  }
);

export const getParts = createAsyncThunk("helpDesk/getParts", async () => {
  const respon = await axiosInstance.get(`${HelpDesk}parts`, {
    // headers: { Authorization: token },
  });
  return respon.data;
});

export const postTicket = createAsyncThunk(
  "ticket/postTicket",
  async (data) => {
    const respon = await axiosInstance.post(
      `${HelpDesk}ticket/store`,
      data.payload,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data;
  }
);

export const postSurvey = createAsyncThunk(
  "Survey/postSurvey",
  async (data) => {
    const respon = await axiosInstance.post(`${Survey}survey/`, data.payload, {
      headers: { Authorization: data.token },
    });
    return respon?.data;
  }
);

export const getSurveyReport = createAsyncThunk(
  "Survey/getSurveyReport",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Survey}survey-report/?year=${data.year}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data?.result;
  }
);

export const getSurveyCount = createAsyncThunk(
  "Survey/getSurveyCount",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Survey}survey-count/?year=${data.year}`, {
      headers: { Authorization: data.token },
    });
    return respon?.data?.results;
  }
);

export const getSurveyDetail = createAsyncThunk(
  "Survey/getSurveyDetail",
  async (data) => {
    const respon = await axiosInstance.get(
      `${Survey}survey-detail/${data.id}/`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data?.results;
  }
);

export const getSurveyExport = createAsyncThunk(
  "Survey/getSurveyExport",
  async (data) => {
    const respon = await axiosInstance.get(`${Survey}export-survey-response/`, {
      headers: { Authorization: data },
    });
    return respon?.data?.results;
  }
);

export const getAksiPerubahan = createAsyncThunk(
  "AksiPerubahan/getAksiPerubahan",
  async ({ token, page, search, angkatan, tahun, new_title }) => {
    const url =
      new_title.length !== 0
        ? `${BASE_URL}bridge/transform/?query=${search}&page=${page}&batch=[${angkatan}]&year=[${tahun}]&new_title=${JSON.stringify(
            new_title
          )}`
        : `${BASE_URL}bridge/transform/?query=${search}&page=${page}`;
    const respon = await axiosInstance.get(url, {
      headers: { Authorization: token },
    });
    return respon?.data?.results;
  }
);

export const getDetailAksiPerubahan = createAsyncThunk(
  "AksiPerubahan/getDetailAksiPerubahan",
  async (data) => {
    const respon = await axiosInstance.get(
      `${BASE_URL}bridge/transform/${data.id}`,
      {
        headers: { Authorization: data.token },
      }
    );
    return respon?.data?.results;
  }
);

export const getFilterAksiPerubahan = createAsyncThunk(
  "AksiPerubahan/getFilterAksiPerubahan",
  async (token) => {
    const respon = await axiosInstance.get(
      `${BASE_URL}bridge/transform/title/`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data?.results;
  }
);

export const getLaporanAksiPerubahan = createAsyncThunk(
  "AksiPerubahan/getLaporanAksiPerubahan",
  async ({ token, unker, satker }) => {
    let url =
      satker === undefined && unker === undefined
        ? `${BASE_URL}bridge/transform/dashboard/title/`
        : `${BASE_URL}bridge/transform/dashboard/title/?unker=${unker}&satker=${satker}`;
    console.log(url);
    const respon = await axiosInstance.get(url, {
      headers: { Authorization: token },
    });
    return respon?.data?.results;
  }
);

export const getLastLogAttendence = createAsyncThunk(
  "attendence/getLastLogAttendence",
  async (token) => {
    const respon = await axiosInstance.get(`${Attendence}lastlog/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const postAttendence = createAsyncThunk(
  "attendence/postAttendence",
  async (data) => {
    const respon = await axiosInstance.post(`${Attendence}log/`, data.payload, {
      headers: { Authorization: data.token },
    });
    return respon?.data.results;
  }
);

//kepegawaian
export const getDataIPASN = createAsyncThunk(
  "kepegawaian/getDataIPASN",
  async ({ token, page, search }) => {
    const respon = await axiosInstance.get(
      `${Kepegawaian}?type=ipasn&limit=${page}&offset=0&search=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getDataDetailIPASN = createAsyncThunk(
  "kepegawaian/getDataDetailIPASN",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${DetailKepegawaian}${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getDataPribadi = createAsyncThunk(
  "kepegawaian/getDataPribadi",
  async ({ token, page, search, unker, satker }) => {
    const respon = await axiosInstance.get(
      `${DataPribadi}?limit=${page}&offset=0&search=${search}&unker${
        satker !== "" ? "" : unker
      }&satker=${satker}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getDataPribadiDetail = createAsyncThunk(
  "kepegawaian/getDataPribadiDetail",
  async ({ token, id }) => {
    const respon = await axiosInstance.get(`${DataDetailPribadi}${id}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getFilterUnitKerja = createAsyncThunk(
  "kepegawaian/getFilterUnitKerja",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${FilterUnitKerja}`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getNominatif = createAsyncThunk(
  "kepegawaian/getNominatif",
  async ({
    token,
    filterUnitKerja,
    firstGolongan,
    secondGolongan,
    firstEselon,
    secondEselon,
    statusPegawai,
    tahunTMT,
    page,
    search,
  }) => {
    const respon = await axiosInstance.get(
      `${Nominatif}?unker=${
        filterUnitKerja.value === undefined ? "" : filterUnitKerja.value
      }&status_pegawai=${
        statusPegawai.key === undefined ? "" : statusPegawai.key
      }&nama=${search}&echelon_start=${
        firstEselon.key === undefined ? "" : firstEselon.key
      }&echelon_end=${
        secondEselon.key === undefined ? "" : secondEselon.key
      }&golongan_start=${
        firstGolongan.key === undefined ? "" : firstGolongan.key
      }&golongan_end=${
        secondGolongan.key === undefined ? "" : secondGolongan.key
      }&tahun_tmt=${
        tahunTMT.key === undefined ? "" : tahunTMT.key ? tahunTMT?.key : ""
      }&page=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

export const getNominatifReport = createAsyncThunk(
  "kepegawaian/getNominatifReport",
  async ({
    token,
    filterUnitKerja,
    firstGolongan,
    secondGolongan,
    firstEselon,
    secondEselon,
    statusPegawai,
    tahunTMT,
    page,
  }) => {
    const respon = await axiosInstance.get(
      `${NominatifReport}?unker=${filterUnitKerja?.value}&status_pegawai=${
        statusPegawai?.key
      }&nama=&echelon_start=${firstEselon?.key}&echelon_end=${
        secondEselon?.key
      }&golongan_start=${firstGolongan?.key}&golongan_end=${
        secondGolongan?.key
      }&tahun_tmt=${tahunTMT?.key ? tahunTMT.key : ""}&page=${page}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

//Faq
export const getFaq = createAsyncThunk(
  "faq/getFaq",
  async ({ token, search }) => {
    if (search === "") {
      const respon = await axiosInstance.get(`${Faq}/faq/?limit=500`, {
        headers: { Authorization: token },
      });
      return respon?.data.results;
    } else {
      const respon = await axiosInstance.get(`${Faq}/faq/?title=${search}`, {
        headers: { Authorization: token },
      });
      return respon?.data.results;
    }
  }
);

export const getFaqCategory = createAsyncThunk(
  "faq/getFaqCategory",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${Faq}/faq/category/`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getFaqByCategory = createAsyncThunk(
  "faq/getFaqByCategory",
  async ({ token, idCategory }) => {
    const respon = await axiosInstance.get(
      `${Faq}/faq/?limit=500&category_id=${idCategory}`,
      {
        headers: { Authorization: token },
      }
    );
    return { respon: respon?.data.results, id: idCategory };
  }
);

export const getFaqGroup = createAsyncThunk(
  "faq/getFaqGroup",
  async ({ token }) => {
    const respon = await axiosInstance.get(`${Faq}/faq/group/?limit=100`, {
      headers: { Authorization: token },
    });
    return respon?.data.results;
  }
);

export const getFaqByGroup = createAsyncThunk(
  "faq/getFaqByGroup",
  async ({ token, idGroup }) => {
    const respon = await axiosInstance.get(
      `${Faq}/faq/?limit=100&group_id=${idGroup}`,
      {
        headers: { Authorization: token },
      }
    );
    return respon?.data.results;
  }
);

// export const updateTicket = createAsyncThunk(
//   "ticket/updateTicket",
//   async (id) => {
//     const respon = await axios.put(`${HelpDesk}ticket/update-status/${id}`, {
//       headers: { Authorization: token },
//     });
//     return respon?.data;
//   }
// );
