import { Config } from "../constants/config";

export const nde_api = {
  // postHttpOptions: postHttpOptions,

  // // untuk attachment bg
  // postHttp: postHttpAttachment,

  //GET
  baseurl: Config.base_url,
  baseurl_kores: Config.base_url_kores,
  auth: Config.base_url + Config.api.auth,
  //DASHBOARD
  dashboard: Config.base_url + Config.api.dashboard,
  getTermofuse: Config.base_url + Config.api.getTermofuse,
  getVersionAndroid: Config.base_url + Config.api.getVersionAndroid,
  getVersionIos: Config.base_url + Config.api.getVersionIos,
  searchglobal: Config.base_url + Config.api.searchglobal,
  //PROFILE
  profile: Config.base_url + Config.api.profile,
  profiletitle: Config.base_url + Config.api.profiletitle,
  //DEVICE
  checkdevice: Config.base_url + Config.api.checkdevice,
  switchoffdevice: Config.base_url + Config.api.switchoffdevice,
  //Sign Out
  signOutAPI: Config.base_url + Config.api.signOutAPI,

  //AGENDA MASUK
  agendain: Config.base_url + Config.api.agendain,
  agendaininternal: Config.base_url + Config.api.agendaininternal,
  agendainsearch: Config.base_url + Config.api.agendainsearch,
  agendainunread: Config.base_url + Config.api.agendainunread,
  agendainunreadsearch: Config.base_url + Config.api.agendainunreadsearch,
  agendainfilter: Config.base_url + Config.api.agendainfilter,
  agendainbyid: Config.base_url + Config.api.agendainbyid,
  agendainread: Config.base_url + Config.api.agendainread,
  agendainlog: Config.base_url + Config.api.agendainlog,

  // DISPOSISITION
  disporeceivers: Config.base_url + Config.api.disporeceivers,
  agendadispo: Config.base_url + Config.api.agendadispo,
  agendadisposearch: Config.base_url + Config.api.agendadisposearch,
  agendadispounread: Config.base_url + Config.api.agendadispounread,
  agendadispounreadsearch: Config.base_url + Config.api.agendadispounreadsearch,
  agendadispobyid: Config.base_url + Config.api.agendadispobyid,
  agendadisporead: Config.base_url + Config.api.agendadisporead,
  agendadispolog: Config.base_url + Config.api.agendadispolog,
  agendadispotree: Config.base_url + Config.api.agendadispotree,
  agendamydispo: Config.base_url + Config.api.agendamydispo,
  agendamydisposearch: Config.base_url + Config.api.agendamydisposearch,

  // AGENDA KELUAR
  agendaout: Config.base_url + Config.api.agendaout,
  agendaoutsearch: Config.base_url + Config.api.agendaoutsearch,
  agendaoutbyid: Config.base_url + Config.api.agendaoutbyid,
  agendaoutlog: Config.base_url + Config.api.agendaoutlog,
  agendaoutdelete: Config.base_url + Config.api.letterbulkdelete,

  //TODO
  todooverdue: Config.base_url + Config.api.todooverdue,
  todonextweek: Config.base_url + Config.api.todonextweek,
  todotoday: Config.base_url + Config.api.todotoday,
  todosearch: Config.base_url + Config.api.todosearch,
  todobyid: Config.base_url + Config.api.todobyid,
  todomarkcomplete: Config.base_url + Config.api.todomarkcomplete,
  todocomment: Config.base_url + Config.api.todocomment,
  todocommentreply: Config.base_url + Config.api.todocommentreply,

  //card secretary
  secretaryassigned: Config.base_url + Config.api.secretaryassigned,

  // edit secretary
  editSecretary: Config.base_url + Config.api.editSecretary,

  // card delegation
  delegationassigned: Config.base_url + Config.api.delegationassigned,

  //list delegation
  delegation: Config.base_url + Config.api.delegation,
  delegationsearch: Config.base_url + Config.api.delegationsearch,
  delegationbyid: Config.base_url + Config.api.delegationbyid,
  delegationactive: Config.base_url + Config.api.delegationactive,
  delegationdeactivate: Config.base_url + Config.api.delegationdeactivate,

  createdelegation: Config.base_url + Config.api.createdelegation,
  checkActiveDelegation:
    Config.base_url +
    "/api/delegation/check-date/?code={$title_code}&end_date={$end_date}&start_date={$start_date}",

  //list secretary
  secretary: Config.base_url + Config.api.secretary,
  secretarysearch: Config.base_url + Config.api.secretarysearch,
  secretarybyid: Config.base_url + Config.api.secretarybyid,
  secretarydeactivate: Config.base_url + Config.api.secretarydeactivate,
  // secretaryactive: Config.base_url + Config.api.// secretaryactive,
  secretaryactive: Config.base_url + Config.api.secretaryactive,

  createsecretary: Config.base_url + Config.api.createsecretary,
  checksecretary: Config.base_url + Config.api.checksecretary,

  // OUTGOING
  needfollowup: Config.base_url + Config.api.needfollowup,
  needfollowupsearch: Config.base_url + Config.api.needfollowupsearch,
  tracking: Config.base_url + Config.api.tracking,
  trackingsearch: Config.base_url + Config.api.trackingsearch,
  scanlog: Config.base_url + Config.api.scanlog,
  scanlogsearch: Config.base_url + Config.api.scanlogsearch,
  scanlogbyid: Config.base_url + Config.api.scanlogbyid,
  lettersbyid: Config.base_url + Config.api.lettersbyid,

  lettersubmit: Config.base_url + Config.api.lettersubmit,
  letteridsave: Config.base_url + Config.api.letteridsave,
  letteridapprove: Config.base_url + Config.api.letteridapprove,
  letterbulkapprove: Config.base_url + Config.api.letterbulkapprove,
  letteridfinish: Config.base_url + Config.api.letteridfinish,
  letteridreturn: Config.base_url + Config.api.letteridreturn,
  letteridreturntokonseptor:
    Config.base_url + Config.api.letteridreturntokonseptor,
  letteridreject: Config.base_url + Config.api.letteridreject,
  verifytitleprofile: Config.base_url + Config.api.verifytitleprofile,

  listDraft: Config.base_url + Config.api.listDraft,
  listComposer: Config.base_url + Config.api.listComposer,
  listTemplates: Config.base_url + Config.api.listTemplates,
  receivedLetter: Config.base_url + Config.api.receivedLetter,

  //getPreview BG
  preview: Config.base_url + Config.api.preview,
  //ADDRESSBOOK
  typeletter: Config.base_url + Config.api.typeletter,
  kmtree: Config.base_url + Config.api.kmtree,
  kmSearch: Config.base_url + Config.api.kmSearch,

  employee: Config.base_url + Config.api.employee,
  employeeSearch: Config.base_url + Config.api.employeeSearch,

  unit: Config.base_url + Config.api.unit,
  divisionbyunitid: Config.base_url + Config.api.divisionbyunitid,
  titlebydivisionid: Config.base_url + Config.api.titlebydivisionid,
  parabydivisionid: Config.base_url + Config.api.parabydivisionid,
  titleSearch: Config.base_url + Config.api.titleSearch,
  divisionList: Config.base_url + Config.api.divisionList,

  personallist: Config.base_url + Config.api.personallist,
  personaladd: Config.base_url + Config.api.personaladd,
  personaldel: Config.base_url + Config.api.personaldel,
  subordinate: Config.base_url + Config.api.subordinate,

  // attachment show
  attachmentshow: Config.base_url + Config.api.attachmentshow,

  // Archives
  listArchiveIn: Config.base_url + Config.api.listArchiveIn,
  listArchiveOut: Config.base_url + Config.api.listArchiveOut,
  listArchiveCanceled: Config.base_url + Config.api.listArchiveCanceled,
  listArchiveDisposition: Config.base_url + Config.api.listArchiveDisposition,
  listArchiveMyDisposition:
    Config.base_url + Config.api.listArchiveMyDisposition,
  listArchiveTodo: Config.base_url + Config.api.listArchiveTodo,

  // letter Show
  letterShow: Config.base_url + Config.api.letterShow,

  // Sign
  searchEmailSign: Config.base_url + Config.api.searchEmailSign,
  sendPenandatangan: Config.base_url + Config.api.sendPenandatangan,
  docSigned: Config.base_url + Config.api.docSigned,

  //Disposition
  dispoaction: Config.base_url + Config.api.dispoaction,
  postDisposition: Config.base_url + Config.api.postDisposition,
  downloadDisposisi: Config.base_url + Config.api.downloadDisposisi,

  //Forward
  postForward: Config.base_url + Config.api.postForward,
  postRetract: Config.base_url + Config.api.postRetract,

  // bg
  cekDays: Config.base_url + Config.api.cekDays,
  saveDraftBg: Config.base_url + Config.api.saveDraftBg,
  submitBg: Config.base_url + Config.api.submitBg,
  attachmentBg: Config.base_url + Config.api.attachmentBg,
  data_config: Config.base_url + Config.api.data_config,
  info_user: Config.base_url + Config.api.info_user,
  prebg: Config.base_url + Config.api.prebg,
  bankbg: Config.base_url + Config.api.bankbg,
  dataRevisiPermohonanId: Config.base_url + Config.api.dataRevisiPermohonanId,

  //Search Global
  searchGlobal: Config.base_url + Config.api.searchGlobal,

  //TRUSTED DEVICE
  adddevice: Config.base_url + Config.api.adddevice,
  listdevice: Config.base_url + Config.api.listdevice,
  getdevicebyhash: Config.base_url + Config.api.getdevicebyhash,
  getdevicebyid: Config.base_url + Config.api.getdevicebyid,
  deletedevice: Config.base_url + Config.api.deletedevice,
  deletealldevice: Config.base_url + Config.api.deletealldevice,

  //COMMENTS
  postcomment: Config.base_url + Config.api.postcomment,
  replycomment: Config.base_url + Config.api.replycomment,

  // tools
  getdefaultapprovers: Config.base_url + Config.api.getdefaultapprovers,
  profileapprovers: Config.base_url + Config.api.profileapprovers,
  profileapproversbyid: Config.base_url + Config.api.profileapproversbyid,
  profileapproversdefault: Config.base_url + Config.api.profileapproversdefault,
  profileapproversdel: Config.base_url + Config.api.profileapproversdel,
  profileapproverssave: Config.base_url + Config.api.profileapproverssave,
};
