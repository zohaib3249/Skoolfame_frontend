import axios from "axios";
const COMMON_ERROR = "Error, Please try again.!";
const errorResponse = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 403) {
      setTimeout(() => {
        window.location.href = "/";
        localStorage.clear();
      }, 5000);
    }
    return data;
  } else {
    return { status: 0, message: COMMON_ERROR };
  }
};

//LOGIN

export const login = async (requestData) => {
  try {
    const { email, password } = requestData;
    const login = await axios.post("/sign-in", { email, password });
    const { data } = login;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// USER

export const getAllUser = async (perPage, page = 1, searchData, rev) => {
  try {
    const AllUser = await axios.get(`/all-user?perPage=${perPage}&page=${page}&search=${searchData}&ascending=${rev}`);
    const { data } = AllUser;
    console.log("");
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

export const singleUserDetail = async (id) => {
  try {
    const userDetail = await axios.get(`/get-user-by-id?id=${id}`);
    const { data } = userDetail;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// All SCHOOL

export const getAllSchool = async (perPage, page = 1, searchData, rev) => {
  try {
    const AllSchool = await axios.get(`/get-all-school?perPage=${perPage}&page=${page}&search=${searchData}&ascending=${rev}`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const getSingleSchool = async (id) => {
  try {
    const AllSchool = await axios.get(`/school-timeline/schools/${id}`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const updateSingleSchool = async (fileData, file,id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('schoolType', fileData.schoolType);
    formData.append('name', fileData.name);
    formData.append('address', fileData.address);
    formData.append('state', fileData.state);
    formData.append('since', fileData.since);
    formData.append('about', fileData.about);
    // return
    const CreateSchool = await axios.patch(`/school-timeline/schools/${id}`, formData);
    const { data } = CreateSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
}
//All reports
export const getAllReports = async (perPage, page = 1,searchData) => {
  try {
    const AllReport = await axios.get(`/get-report-post?perPage=${perPage}&page=${page}&search=${searchData}`);
    const { data } = AllReport;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
}

// Add All Superlatives

export const addSuperlatives = async (payload,schoolIconId) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const AllSchool = await axios.post(`/add-all-superlative${schoolIconId!==null?`?id=${schoolIconId}`:''}`,  {names:payload});
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const addWords = async (payload) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const AllSchool = await axios.post(`/moderators`, payload);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

export const uploadSchoolCSV = async (payload) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const formData = new FormData();
    formData.append("file", payload);
    const AllSchool = await axios.post(`/school-timeline/schools/import`, formData);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const uploadWordCSV = async (payload) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const formData = new FormData();
    formData.append("file", payload);
    const AllSchool = await axios.post(`/moderators/import`, formData);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const getAllWords = async (perPage, page = 1, searchData, rev) => {
  try {
    const AllSchool = await axios.get(`/moderators?perPage=${perPage}&page=${page}&search=${searchData}&ascending=${rev}`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const addGroups = async (payload,schoolIconId) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const AllSchool = await axios.post(`/school-timeline/school-groups/duplicate${schoolIconId!==null?`?id=${schoolIconId}`:''}`, {names:payload} );
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// All SCHOOL for user request

export const getAllSchoolsRequest = async (perPage, page = 1, searchData) => {
  try {
    const AllSchool = await axios.get(`/get-school`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const getSchoolsChangeRequest = async (perPage, page = 1, searchData) => {
  try {
    const AllSchool = await axios.get('/school-timeline/schools/change-requests');
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//  SCHOOL

export const getSchool = async (perPage, page = 1, searchData, id, rev) => {
  try {
    const AllSchool = await axios.get(
      `/get-all-superlative?perPage=${perPage}&page=${page}&id=${id}&search=${searchData}&ascending=${rev}`
    );
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const getGroups = async (perPage, page = 1, searchData, id, rev) => {
  try {
    const AllSchool = await axios.get(
      `/school-timeline/groups?perPage=${perPage}&page=${page}&id=${id}&search=${searchData}&ascending=${rev}`
    );
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

export const createSchool = async (fileData, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('schoolType', fileData.schoolType);
    formData.append('name', fileData.name);
    formData.append('address', fileData.address);
    formData.append('state', fileData.state);
    formData.append('since', fileData.since);
    formData.append('about', fileData.about);
    // return
    const CreateSchool = await axios.post(`/add-school`, formData);
    const { data } = CreateSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
}

//ABOUT

export const updateAbout = async (about) => {
  try {
    const aboutDetail = await axios.post(`/about-us`, { message: about });
    const { data } = aboutDetail;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//album

export const getAlbum = async (type, id) => {
  try {
    const album = await axios.post(`/get-all-document?id=${id}`, { type });
    const { data } = album;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// user's list for chat

export const getChatuser = async (id) => {
  try {
    const user = await axios.get(`/get-user-chat?id=${id}`);
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// user chat
export const getChatById = async (sid, rid) => {
  try {
    const user = await axios.post("/user-chat", {
      sender_id: sid,
      receiver_id: rid,
    });
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//school Nominees

export const schoolNominees = async (id) => {
  try {
    const user = await axios.get(`/get-nominees?id=${id}`);
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
export const schoolMembers = async (perPage, page = 1, searchData,id) => {
  try {
    const user = await axios.get(`/school-timeline/groups/${id}/members?perPage=${perPage}&page=${page}&search=${searchData}`);
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
//get All Liv eUser

export const getAllLiveUser = async (id) => {
  try {
    const user = await axios.get("/dashboard");
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
